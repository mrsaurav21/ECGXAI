import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
import secrets
import asyncio
from app.core.config import settings
import logging

logger = logging.getLogger("uvicorn")


def generate_numeric_otp(length: int = 6) -> str:
    """Generate a cryptographically secure 6-digit numeric OTP."""
    return "".join(str(secrets.randbelow(10)) for _ in range(length))


def _send_email_sync(email_to: str, subject: str, html_body: str):
    """Synchronous SMTP email delivery executed inside a worker thread."""
    message = MIMEMultipart("alternative")
    message["Subject"] = subject
    message["From"] = settings.EMAIL_FROM
    message["To"] = email_to
    message.attach(MIMEText(html_body, "html"))

    with smtplib.SMTP(settings.SMTP_HOST, settings.SMTP_PORT) as server:
        server.starttls()
        server.login(settings.SMTP_USER, settings.SMTP_PASSWORD)
        server.sendmail(settings.EMAIL_FROM, email_to, message.as_string())


async def send_otp_email(email_to: str, otp_code: str):
    """Asynchronously dispatches OTP email or logs to console if SMTP is unconfigured."""
    if not settings.SMTP_USER or not settings.SMTP_PASSWORD:
        logger.warning(
            f"\n========================================\n"
            f"[DEV MODE] SMTP credentials missing in .env\n"
            f"Target Email : {email_to}\n"
            f"Generated OTP: {otp_code}\n"
            f"========================================\n"
        )
        return

    subject = "ECG-XAI Verification Code"
    html_content = f"""
    <div style="font-family: Arial, sans-serif; background-color: #003135; padding: 32px; border-radius: 12px; color: #AFDDE5; max-width: 500px; margin: auto;">
        <h2 style="color: #0FA4AF; margin-top: 0;">ECG-XAI Clinical Platform</h2>
        <p style="font-size: 14px; line-height: 1.5; color: #AFDDE5;">
            Your one-time security code for account verification is:
        </p>
        <div style="background-color: #024950; display: inline-block; padding: 14px 28px; border-radius: 8px; font-size: 32px; font-weight: bold; letter-spacing: 6px; color: #AFDDE5; border: 1px solid #03626C; margin: 16px 0;">
            {otp_code}
        </div>
        <p style="font-size: 13px; color: #AFDDE5; opacity: 0.8; margin-bottom: 0;">
            This security code will automatically expire in 5 minutes. If you did not request this, you can safely ignore this email.
        </p>
    </div>
    """

    try:
        # Offload blocking SMTP operations to an async executor thread
        loop = asyncio.get_running_loop()
        await loop.run_in_executor(
            None, _send_email_sync, email_to, subject, html_content
        )
        logger.info(f"Verification OTP email dispatched to {email_to}")
    except Exception as e:
        logger.error(f"Failed to dispatch OTP email to {email_to}: {str(e)}")