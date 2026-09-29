from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    PROJECT_NAME: str = "ECG-XAI Backend"
    API_V1_STR: str = "/api/v1"
    
    # MongoDB Atlas Connection
    MONGODB_URL: str
    MONGODB_DB_NAME: str = "ecg_xai_db"
    
    # JWT Authentication
    JWT_SECRET_KEY: str = "supersecret_ecgxai_jwt_key_change_in_production"
    JWT_ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 1440
    
    # Google OAuth
    GOOGLE_CLIENT_ID: str = ""
    
    # SMTP / Email OTP Settings
    SMTP_HOST: str = "smtp.gmail.com"
    SMTP_PORT: int = 587
    SMTP_USER: str = ""
    SMTP_PASSWORD: str = ""
    EMAIL_FROM: str = ""

    class Config:
        env_file = ".env"
        extra = "allow"

settings = Settings()