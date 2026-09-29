from fastapi import APIRouter, HTTPException, status, Depends, BackgroundTasks
from datetime import datetime, timezone
from bson import ObjectId
from app.database.mongodb import get_database
from app.schemas.auth_schema import (
    RegisterRequest,
    VerifyOTPRequest,
    ResendOTPRequest,
    LoginRequest,
    GoogleAuthRequest,
    TokenResponse,
    MessageResponse,
)
from app.core.security import (
    get_password_hash,
    verify_password,
    create_access_token,
    get_current_user_payload,
)
from app.services.email_service import generate_numeric_otp, send_otp_email
from app.services.google_auth_service import verify_google_token
import secrets

router = APIRouter(prefix="/auth", tags=["Authentication"])


def format_user_doc(user: dict) -> dict:
    """Formats raw MongoDB BSON document into a clean API response."""
    return {
        "id": str(user["_id"]),
        "email": user["email"],
        "full_name": user["full_name"],
        "role": user["role"],
        "is_verified": user.get("is_verified", False),
        "doctor_profile": user.get("doctor_profile"),
        "patient_profile": user.get("patient_profile"),
    }


@router.post("/register", response_model=MessageResponse)
async def register(
    req: RegisterRequest,
    background_tasks: BackgroundTasks,
    db=Depends(get_database),
):
    email_clean = req.email.lower().strip()
    existing_user = await db["users"].find_one({"email": email_clean})

    if existing_user and existing_user.get("is_verified", False):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="An account with this email address already exists.",
        )

    hashed_pwd = get_password_hash(req.password)
    now = datetime.now(timezone.utc)

    doctor_profile = None
    patient_profile = None

    if req.role == "doctor":
        doctor_profile = {
            "license_number": req.license_number or "",
            "specialization": req.specialization or "Cardiology",
            "hospital_affiliation": req.hospital_affiliation or "",
            "qualifications": req.qualifications or [],
            "certificates": [],
        }
    else:
        mrn = f"MRN-{secrets.token_hex(3).upper()}"
        patient_profile = {
            "patient_mrn": mrn,
            "age": req.age or 0,
            "gender": req.gender or "Unknown",
            "blood_group": req.blood_group or "Unknown",
            "emergency_contact": req.emergency_contact or "",
        }

    user_payload = {
        "email": email_clean,
        "hashed_password": hashed_pwd,
        "full_name": req.full_name.strip(),
        "role": req.role,
        "is_verified": False,
        "doctor_profile": doctor_profile,
        "patient_profile": patient_profile,
        "updated_at": now,
    }

    if existing_user:
        await db["users"].update_one(
            {"_id": existing_user["_id"]}, {"$set": user_payload}
        )
    else:
        user_payload["created_at"] = now
        await db["users"].insert_one(user_payload)

    otp = generate_numeric_otp(6)
    await db["otps"].delete_many({"email": email_clean})
    await db["otps"].insert_one({
        "email": email_clean,
        "otp_code": otp,
        "created_at": now,
    })

    background_tasks.add_task(send_otp_email, email_clean, otp)
    return {
        "message": "Registration initiated. A 6-digit verification code has been dispatched to your email."
    }


@router.post("/verify-otp", response_model=TokenResponse)
async def verify_otp(req: VerifyOTPRequest, db=Depends(get_database)):
    email_clean = req.email.lower().strip()
    otp_record = await db["otps"].find_one(
        {"email": email_clean, "otp_code": req.otp_code.strip()}
    )
    if not otp_record:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid or expired verification code.",
        )

    user = await db["users"].find_one({"email": email_clean})
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User record not found.",
        )

    now = datetime.now(timezone.utc)
    await db["users"].update_one(
        {"_id": user["_id"]},
        {"$set": {"is_verified": True, "updated_at": now}},
    )
    await db["otps"].delete_many({"email": email_clean})
    user["is_verified"] = True

    if user["role"] == "patient" and user.get("patient_profile"):
        await db["patients"].update_one(
            {"patient_mrn": user["patient_profile"]["patient_mrn"]},
            {
                "$set": {
                    "user_id": user["_id"],
                    "full_name": user["full_name"],
                    "email": user["email"],
                    "patient_mrn": user["patient_profile"]["patient_mrn"],
                    "age": user["patient_profile"].get("age", 0),
                    "gender": user["patient_profile"].get("gender", "Unknown"),
                    "blood_group": user["patient_profile"].get("blood_group", "Unknown"),
                    "emergency_contact": user["patient_profile"].get("emergency_contact", ""),
                    "updated_at": now,
                },
                "$setOnInsert": {"created_at": now},
            },
            upsert=True,
        )

    patient_mrn = user.get("patient_profile", {}).get("patient_mrn") if user["role"] == "patient" else None
    token = create_access_token({
        "sub": str(user["_id"]),
        "role": user["role"],
        "email": user["email"],
        "patient_mrn": patient_mrn,
    })

    return {
        "access_token": token,
        "token_type": "bearer",
        "user": format_user_doc(user),
    }


@router.post("/resend-otp", response_model=MessageResponse)
async def resend_otp(
    req: ResendOTPRequest,
    background_tasks: BackgroundTasks,
    db=Depends(get_database),
):
    email_clean = req.email.lower().strip()
    user = await db["users"].find_one({"email": email_clean})
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="No registered account found with this email.",
        )
    if user.get("is_verified", False):
        return {"message": "Account is already verified. Please sign in."}

    now = datetime.now(timezone.utc)
    otp = generate_numeric_otp(6)
    await db["otps"].delete_many({"email": email_clean})
    await db["otps"].insert_one({
        "email": email_clean,
        "otp_code": otp,
        "created_at": now,
    })

    background_tasks.add_task(send_otp_email, email_clean, otp)
    return {"message": "A new verification code has been dispatched."}


@router.post("/login", response_model=TokenResponse)
async def login(req: LoginRequest, db=Depends(get_database)):
    email_clean = req.email.lower().strip()
    user = await db["users"].find_one({"email": email_clean})
    if not user or not user.get("hashed_password"):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password.",
        )
    if not verify_password(req.password, user["hashed_password"]):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password.",
        )
    if not user.get("is_verified", False):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Account is not verified. Please verify your email via OTP.",
        )

    patient_mrn = user.get("patient_profile", {}).get("patient_mrn") if user["role"] == "patient" else None
    token = create_access_token({
        "sub": str(user["_id"]),
        "role": user["role"],
        "email": user["email"],
        "patient_mrn": patient_mrn,
    })

    return {
        "access_token": token,
        "token_type": "bearer",
        "user": format_user_doc(user),
    }


@router.post("/google", response_model=TokenResponse)
async def google_auth(req: GoogleAuthRequest, db=Depends(get_database)):
    id_info = await verify_google_token(req.id_token)
    email = id_info.get("email", "").lower().strip()
    name = id_info.get("name", "Google User")
    sub_id = id_info.get("sub")

    if not email:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Google ID token does not contain a verified email.",
        )

    user = await db["users"].find_one({"email": email})
    now = datetime.now(timezone.utc)

    if not user:
        doctor_profile = None
        patient_profile = None

        if req.role == "doctor":
            doctor_profile = {
                "license_number": "",
                "specialization": "Cardiology",
                "hospital_affiliation": "",
                "qualifications": [],
                "certificates": [],
            }
        else:
            mrn = f"MRN-{secrets.token_hex(3).upper()}"
            patient_profile = {
                "patient_mrn": mrn,
                "age": 0,
                "gender": "Unknown",
                "blood_group": "Unknown",
                "emergency_contact": "",
            }

        new_user = {
            "email": email,
            "full_name": name,
            "role": req.role,
            "is_verified": True,
            "google_id": sub_id,
            "doctor_profile": doctor_profile,
            "patient_profile": patient_profile,
            "created_at": now,
            "updated_at": now,
        }
        res = await db["users"].insert_one(new_user)
        new_user["_id"] = res.inserted_id
        user = new_user

        if req.role == "patient":
            await db["patients"].insert_one({
                "user_id": user["_id"],
                "full_name": user["full_name"],
                "email": user["email"],
                "patient_mrn": patient_profile["patient_mrn"],
                "age": 0,
                "gender": "Unknown",
                "blood_group": "Unknown",
                "emergency_contact": "",
                "created_at": now,
                "updated_at": now,
            })
    else:
        await db["users"].update_one(
            {"_id": user["_id"]},
            {"$set": {"google_id": sub_id, "is_verified": True, "updated_at": now}},
        )
        user["is_verified"] = True

    patient_mrn = user.get("patient_profile", {}).get("patient_mrn") if user["role"] == "patient" else None
    token = create_access_token({
        "sub": str(user["_id"]),
        "role": user["role"],
        "email": user["email"],
        "patient_mrn": patient_mrn,
    })

    return {
        "access_token": token,
        "token_type": "bearer",
        "user": format_user_doc(user),
    }


@router.get("/me")
async def get_current_user_profile(
    payload: dict = Depends(get_current_user_payload),
    db=Depends(get_database),
):
    try:
        user_oid = ObjectId(payload["sub"])
    except Exception:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid token subject identifier.",
        )

    user = await db["users"].find_one({"_id": user_oid})
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User account not found.",
        )

    return format_user_doc(user)


# --- NEW ENDPOINTS TO FIX PROFILE UPDATES & DOCTOR DIRECTORY 404s ---

@router.put("/me")
@router.patch("/complete-profile")
async def update_user_profile(
    payload: dict,
    token_payload: dict = Depends(get_current_user_payload),
    db=Depends(get_database),
):
    """Updates profile details for the authenticated user."""
    try:
        user_oid = ObjectId(token_payload["sub"])
    except Exception:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid token subject.")

    user = await db["users"].find_one({"_id": user_oid})
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found.")

    now = datetime.now(timezone.utc)
    update_data = {"updated_at": now}

    if "full_name" in payload and payload["full_name"]:
        update_data["full_name"] = payload["full_name"].strip()
    if "role" in payload and payload["role"]:
        update_data["role"] = payload["role"]
    if "doctor_profile" in payload and payload["doctor_profile"]:
        update_data["doctor_profile"] = payload["doctor_profile"]
    if "patient_profile" in payload and payload["patient_profile"]:
        update_data["patient_profile"] = payload["patient_profile"]

    await db["users"].update_one({"_id": user_oid}, {"$set": update_data})
    updated_user = await db["users"].find_one({"_id": user_oid})
    return format_user_doc(updated_user)


@router.get("/doctors/directory")
async def get_doctors_directory(db=Depends(get_database)):
    """Returns all registered doctors for patient selection."""
    doctors_cursor = db["users"].find({"role": "doctor"})
    doctors = await doctors_cursor.to_list(length=100)
    return [format_user_doc(doc) for doc in doctors]


@router.post("/patient/assign-doctor")
async def assign_doctor_to_patient(
    payload: dict,
    token_payload: dict = Depends(get_current_user_payload),
    db=Depends(get_database),
):
    """Assigns an attending physician to the patient profile."""
    try:
        user_oid = ObjectId(token_payload["sub"])
    except Exception:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid token subject.")

    doctor_id = payload.get("doctor_id")
    user = await db["users"].find_one({"_id": user_oid})
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found.")

    patient_profile = user.get("patient_profile") or {}
    
    # Fetch doctor's name for display convenience
    doctor_user = await db["users"].find_one({"_id": ObjectId(doctor_id)}) if doctor_id else None
    doctor_name = doctor_user["full_name"] if doctor_user else "Assigned Doctor"

    patient_profile["assigned_doctor_id"] = doctor_id
    patient_profile["assigned_doctor_name"] = f"Dr. {doctor_name}"

    now = datetime.now(timezone.utc)
    await db["users"].update_one(
        {"_id": user_oid},
        {"$set": {"patient_profile": patient_profile, "updated_at": now}}
    )

    updated_user = await db["users"].find_one({"_id": user_oid})
    return format_user_doc(updated_user)