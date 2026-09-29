from datetime import datetime, timedelta, timezone
from typing import Optional, Any, Dict
from jose import jwt, JWTError
from passlib.context import CryptContext
from fastapi import HTTPException, status, Depends
from fastapi.security import OAuth2PasswordBearer
from app.core.config import settings

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
oauth2_scheme = OAuth2PasswordBearer(tokenUrl=f"{settings.API_V1_STR}/auth/login")


def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Verify a plain password against the stored bcrypt hash."""
    return pwd_context.verify(plain_password, hashed_password)


def get_password_hash(password: str) -> str:
    """Hash a raw string password with bcrypt."""
    return pwd_context.hash(password)


def create_access_token(data: Dict[str, Any], expires_delta: Optional[timedelta] = None) -> str:
    """Encode payload claims (including role and patient_mrn) into a signed JWT."""
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.now(timezone.utc) + expires_delta
    else:
        expire = datetime.now(timezone.utc) + timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, settings.JWT_SECRET_KEY, algorithm=settings.JWT_ALGORITHM)


async def get_current_user_payload(token: str = Depends(oauth2_scheme)) -> Dict[str, Any]:
    """Dependency that decodes and validates the incoming Bearer JWT."""
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials or token expired",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, settings.JWT_SECRET_KEY, algorithms=[settings.JWT_ALGORITHM])
        user_id: str = payload.get("sub")
        role: str = payload.get("role")
        if user_id is None or role is None:
            raise credentials_exception
        return payload
    except JWTError:
        raise credentials_exception


async def require_role(required_role: str, payload: Dict[str, Any] = Depends(get_current_user_payload)) -> Dict[str, Any]:
    """Base check enforcing matching role claims."""
    user_role = payload.get("role")
    if user_role != required_role:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail=f"Access forbidden: requires '{required_role}' authorization"
        )
    return payload


async def get_current_doctor(payload: Dict[str, Any] = Depends(get_current_user_payload)) -> Dict[str, Any]:
    """Route guard dependency accessible exclusively by verified doctors."""
    return await require_role("doctor", payload)


async def get_current_patient(payload: Dict[str, Any] = Depends(get_current_user_payload)) -> Dict[str, Any]:
    """Route guard dependency accessible exclusively by verified patients."""
    return await require_role("patient", payload)