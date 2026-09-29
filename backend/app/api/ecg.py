import io
import numpy as np
import pandas as pd
from datetime import datetime, timezone
from bson import ObjectId
from typing import Optional
from fastapi import APIRouter, UploadFile, File, Form, Depends, HTTPException, status

from app.database.mongodb import get_database
from app.core.security import get_current_user_payload
from app.core.encryption import encrypt_patient_data, decrypt_patient_data
from app.services.inference_service import ecg_inference_service

router = APIRouter(prefix="/ecg", tags=["ECG Analysis & History"])


def _parse_ecg_file(file_bytes: bytes, filename: str) -> np.ndarray:
    """Parses uploaded file (.csv, .npy) into a (12, N) numpy array."""
    filename_lower = filename.lower()
    try:
        if filename_lower.endswith(".npy"):
            signal = np.load(io.BytesIO(file_bytes))
        elif filename_lower.endswith(".csv"):
            df = pd.read_csv(io.BytesIO(file_bytes))
            # Handle headers or index columns if present
            signal = df.to_numpy(dtype=np.float32)
        else:
            raise ValueError("Unsupported format. Please upload .csv or .npy file.")

        # Ensure shape (12, N)
        if signal.ndim != 2:
            raise ValueError(f"Signal must be 2-dimensional. Got shape {signal.shape}")

        if signal.shape[0] != 12:
            if signal.shape[1] == 12:
                signal = signal.T
            else:
                raise ValueError(f"Expected 12 leads, found {signal.shape[0]} channels.")

        return signal.astype(np.float32)
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Failed to parse ECG file: {str(e)}"
        )


def _compute_trajectory(current_concepts: dict, previous_record: Optional[dict]) -> dict:
    """Computes physiological delta between current and prior ECG."""
    if not previous_record or "concepts" not in previous_record:
        return {
            "status": "INITIAL_BASELINE",
            "delta_st_mm": 0.0,
            "delta_qrs_ms": 0.0,
            "delta_hr_bpm": 0.0,
            "patient_friendly_summary": "Initial baseline ECG recording established."
        }

    prev_concepts = previous_record["concepts"]
    curr_st = current_concepts.get("max_st_elevation_mm", 0.0)
    prev_st = prev_concepts.get("max_st_elevation_mm", 0.0)
    delta_st = round(curr_st - prev_st, 2)

    curr_qrs = current_concepts.get("qrs_duration_ms", 90.0)
    prev_qrs = prev_concepts.get("qrs_duration_ms", 90.0)
    delta_qrs = round(curr_qrs - prev_qrs, 1)

    curr_hr = current_concepts.get("heart_rate_bpm", 72.0)
    prev_hr = prev_concepts.get("heart_rate_bpm", 72.0)
    delta_hr = round(curr_hr - prev_hr, 1)

    if delta_st < -0.5:
        traj_status = "IMPROVEMENT"
        summary = "Significant reduction in ST elevation observed, indicating positive recovery."
    elif delta_st > 0.5:
        traj_status = "DETERIORATION"
        summary = "Increased ST elevation detected compared to previous baseline test."
    else:
        traj_status = "STABLE"
        summary = "Electrophysiological parameters remain stable with no acute changes."

    return {
        "status": traj_status,
        "delta_st_mm": delta_st,
        "delta_qrs_ms": delta_qrs,
        "delta_hr_bpm": delta_hr,
        "patient_friendly_summary": summary
    }


@router.post("/analyze")
async def analyze_ecg_upload(
    file: UploadFile = File(...),
    patient_mrn: Optional[str] = Form(None),
    sampling_rate: int = Form(500),
    doctor_notes: Optional[str] = Form(""),
    payload: dict = Depends(get_current_user_payload),
    db=Depends(get_database),
):
    """
    Primary clinical analysis endpoint.
    Accepts 12-lead signal, executes CBM model, encrypts with AES-256-GCM,
    and stores to MongoDB Atlas.
    """
    user_role = payload.get("role")
    token_mrn = payload.get("patient_mrn")

    # If caller is a patient, enforce their own MRN
    if user_role == "patient":
        target_mrn = token_mrn
    else:
        # Doctor providing an MRN for a patient
        target_mrn = patient_mrn or f"MRN-EXT-{ObjectId()}"

    if not target_mrn:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Patient MRN is required for clinical analysis."
        )

    # 1. Read & Parse file
    content = await file.read()
    raw_signal = _parse_ecg_file(content, file.filename)

    # 2. Run Concept Bottleneck Inference Engine
    analysis_result = ecg_inference_service.analyze_ecg(raw_signal, input_fs=sampling_rate)

    # 3. Retrieve prior test for trajectory tracking
    last_record = await db["ecg_records"].find_one(
        {"patient_mrn": target_mrn},
        sort=[("recorded_at", -1)]
    )

    # Decrypt prior concepts if present
    if last_record and "encrypted_concepts" in last_record:
        try:
            last_record["concepts"] = decrypt_patient_data(
                last_record["encrypted_concepts"], target_mrn, is_json=True
            )
        except Exception:
            last_record["concepts"] = None

    trajectory = _compute_trajectory(analysis_result["concepts"], last_record)
    now = datetime.now(timezone.utc)

    # 4. Envelope Encryption (AES-256-GCM) per-patient
    encrypted_concepts = encrypt_patient_data(analysis_result["concepts"], target_mrn)
    encrypted_notes = encrypt_patient_data(doctor_notes, target_mrn)
    encrypted_patient_summary = encrypt_patient_data(
        analysis_result["clinical_evidence"]["patient_guidance"], target_mrn
    )

    # 5. Persist record in MongoDB Atlas
    record_doc = {
        "patient_mrn": target_mrn,
        "recorded_at": now,
        "diagnosis": analysis_result["diagnosis"],
        "encrypted_concepts": encrypted_concepts,
        "encrypted_doctor_notes": encrypted_notes,
        "encrypted_patient_summary": encrypted_patient_summary,
        "attributions": analysis_result["attributions"],
        "triage": analysis_result["triage"],
        "trajectory": trajectory,
        "doctor_citations": analysis_result["clinical_evidence"]["doctor_citations"],
        "leads_preview": analysis_result["processed_leads"],
        "created_by": payload.get("sub"),
        "created_by_role": user_role
    }

    insert_res = await db["ecg_records"].insert_one(record_doc)
    record_doc["_id"] = str(insert_res.inserted_id)

    # Unpack decrypted fields for immediate client response
    record_doc["concepts"] = analysis_result["concepts"]
    record_doc["doctor_notes"] = doctor_notes
    record_doc["patient_summary"] = analysis_result["clinical_evidence"]["patient_guidance"]
    del record_doc["encrypted_concepts"]
    del record_doc["encrypted_doctor_notes"]
    del record_doc["encrypted_patient_summary"]

    return record_doc


@router.get("/history")
async def get_patient_history(
    patient_mrn: Optional[str] = None,
    payload: dict = Depends(get_current_user_payload),
    db=Depends(get_database),
):
    """
    Returns decrypted longitudinal ECG history for a patient.
    Enforces that patients can only retrieve their own MRN history.
    """
    user_role = payload.get("role")
    token_mrn = payload.get("patient_mrn")

    if user_role == "patient":
        target_mrn = token_mrn
    else:
        target_mrn = patient_mrn

    if not target_mrn:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="patient_mrn parameter is required."
        )

    cursor = db["ecg_records"].find({"patient_mrn": target_mrn}).sort("recorded_at", -1)
    records = await cursor.to_list(length=100)

    decrypted_records = []
    for r in records:
        r["_id"] = str(r["_id"])
        # Decrypt sensitive fields
        try:
            r["concepts"] = decrypt_patient_data(r["encrypted_concepts"], target_mrn, is_json=True)
            r["doctor_notes"] = decrypt_patient_data(r["encrypted_doctor_notes"], target_mrn, is_json=False)
            r["patient_summary"] = decrypt_patient_data(r["encrypted_patient_summary"], target_mrn, is_json=False)
        except Exception:
            r["concepts"] = {}
            r["doctor_notes"] = ""
            r["patient_summary"] = "Data unavailable or decryption key mismatch."

        del r["encrypted_concepts"]
        del r["encrypted_doctor_notes"]
        del r["encrypted_patient_summary"]
        decrypted_records.append(r)

    return {"patient_mrn": target_mrn, "total_records": len(decrypted_records), "records": decrypted_records}


@router.get("/record/{record_id}")
async def get_single_record(
    record_id: str,
    payload: dict = Depends(get_current_user_payload),
    db=Depends(get_database),
):
    """Fetches and decrypts an individual ECG record with authorization checking."""
    try:
        oid = ObjectId(record_id)
    except Exception:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid record ID format.")

    record = await db["ecg_records"].find_one({"_id": oid})
    if not record:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="ECG record not found.")

    target_mrn = record["patient_mrn"]
    user_role = payload.get("role")
    token_mrn = payload.get("patient_mrn")

    # Patient role can only view their own records
    if user_role == "patient" and token_mrn != target_mrn:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Access denied to this record.")

    record["_id"] = str(record["_id"])
    record["concepts"] = decrypt_patient_data(record["encrypted_concepts"], target_mrn, is_json=True)
    record["doctor_notes"] = decrypt_patient_data(record["encrypted_doctor_notes"], target_mrn, is_json=False)
    record["patient_summary"] = decrypt_patient_data(record["encrypted_patient_summary"], target_mrn, is_json=False)

    del record["encrypted_concepts"]
    del record["encrypted_doctor_notes"]
    del record["encrypted_patient_summary"]

    return record