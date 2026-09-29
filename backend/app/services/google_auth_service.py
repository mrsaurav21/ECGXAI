import asyncio
from google.oauth2 import id_token
from google.auth.transport import requests as google_requests
from app.core.config import settings
from fastapi import HTTPException, status
import logging

logger = logging.getLogger("uvicorn")


def _verify_token_sync(token_string: str) -> dict:
    """Verifies the Google OAuth 2.0 ID token synchronously."""
    client_id = settings.GOOGLE_CLIENT_ID if settings.GOOGLE_CLIENT_ID else None
    return id_token.verify_oauth2_token(
        token_string,
        google_requests.Request(),
        client_id
    )


async def verify_google_token(token_string: str) -> dict:
    """Non-blocking asynchronous wrapper for Google token verification."""
    try:
        loop = asyncio.get_running_loop()
        id_info = await loop.run_in_executor(None, _verify_token_sync, token_string)
        return id_info
    except Exception as e:
        logger.error(f"Google token verification failed: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=f"Invalid or expired Google token: {str(e)}"
        )