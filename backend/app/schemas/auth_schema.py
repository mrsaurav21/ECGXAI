from pydantic import BaseModel, EmailStr, Field
from typing import Optional, List, Dict, Any


class RegisterRequest(BaseModel):
    email: EmailStr
    password: str = Field(min_length=6, description="Password must be at least 6 characters")
    full_name: str = Field(min_length=2)
    role: str = Field(pattern="^(doctor|patient)$", description="Role must be 'doctor' or 'patient'")

    # Optional doctor profile fields
    license_number: Optional[str] = None
    specialization: Optional[str] = "Cardiology"
    hospital_affiliation: Optional[str] = None
    qualifications: Optional[List[str]] = []

    # Optional patient profile fields
    age: Optional[int] = None
    gender: Optional[str] = None
    blood_group: Optional[str] = None
    emergency_contact: Optional[str] = None


class VerifyOTPRequest(BaseModel):
    email: EmailStr
    otp_code: str = Field(min_length=6, max_length=6, description="6-digit numeric OTP")


class ResendOTPRequest(BaseModel):
    email: EmailStr


class LoginRequest(BaseModel):
    email: EmailStr
    password: str


class GoogleAuthRequest(BaseModel):
    id_token: str
    role: Optional[str] = Field(default="patient", pattern="^(doctor|patient)$")


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: Dict[str, Any]


class MessageResponse(BaseModel):
    message: str