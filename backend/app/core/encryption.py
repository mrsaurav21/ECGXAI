import os
import json
import base64
from typing import Any, Union
from cryptography.hazmat.primitives.ciphers.aead import AESGCM
from cryptography.hazmat.primitives.kdf.hkdf import HKDF
from cryptography.hazmat.primitives import hashes
from app.core.config import settings

def _derive_patient_key(patient_mrn: str) -> bytes:
    """
    Derives a deterministic 256-bit AES key unique to a specific patient MRN
    using HKDF-SHA256 and the server master secret.
    """
    hkdf = HKDF(
        algorithm=hashes.SHA256(),
        length=32,
        salt=patient_mrn.encode("utf-8"),
        info=b"ecg-xai-patient-record-encryption"
    )
    return hkdf.derive(settings.JWT_SECRET_KEY.encode("utf-8"))

def encrypt_patient_data(data: Union[dict, list, str], patient_mrn: str) -> str:
    """
    Serializes and encrypts data using AES-256-GCM with a 12-byte random nonce.
    Returns a URL-safe Base64 encoded string containing nonce + ciphertext + tag.
    """
    key = _derive_patient_key(patient_mrn)
    aesgcm = AESGCM(key)
    
    # Generate 96-bit (12-byte) unique nonce
    nonce = os.urandom(12)
    
    # Serialize to JSON bytes if dictionary or list
    if isinstance(data, (dict, list)):
        payload_bytes = json.dumps(data).encode("utf-8")
    else:
        payload_bytes = str(data).encode("utf-8")
        
    encrypted_bytes = aesgcm.encrypt(nonce, payload_bytes, None)
    
    # Pack nonce + encrypted payload together
    combined = nonce + encrypted_bytes
    return base64.urlsafe_b64encode(combined).decode("utf-8")

def decrypt_patient_data(encrypted_str: str, patient_mrn: str, is_json: bool = True) -> Any:
    """
    Decrypts an AES-256-GCM payload using the derived key for the given patient MRN.
    """
    try:
        raw_combined = base64.urlsafe_b64decode(encrypted_str.encode("utf-8"))
        nonce = raw_combined[:12]
        ciphertext_with_tag = raw_combined[12:]
        
        key = _derive_patient_key(patient_mrn)
        aesgcm = AESGCM(key)
        
        decrypted_bytes = aesgcm.decrypt(nonce, ciphertext_with_tag, None)
        decrypted_str = decrypted_bytes.decode("utf-8")
        
        if is_json:
            return json.loads(decrypted_str)
        return decrypted_str
    except Exception:
        raise ValueError("Decryption failed: invalid key, altered data, or unauthorized access.")