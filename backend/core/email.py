from fastapi_mail import FastMail, MessageSchema, ConnectionConfig
import os
from typing import List
from pydantic import EmailStr
from core.config import SECRET_KEY
from fastapi_mail.errors import ConnectionErrors


# Get email configuration from environment variables
SMTP_USER = os.getenv("SMTP_USER")
SMTP_PASSWORD = os.getenv("SMTP_PASSWORD")
SMTP_HOST = os.getenv("SMTP_HOST", "smtp.gmail.com")
SMTP_PORT = int(os.getenv("SMTP_PORT", "587")) if os.getenv("SMTP_PORT") else 587
FRONTEND_URL = os.getenv("FRONTEND_URL", "http://localhost:5173")

# Only create email config if credentials are provided
conf = None
if SMTP_USER and SMTP_PASSWORD:
    conf = ConnectionConfig(
        MAIL_USERNAME=SMTP_USER,
        MAIL_PASSWORD=SMTP_PASSWORD,
        MAIL_FROM=SMTP_USER,
        MAIL_PORT=SMTP_PORT,
        MAIL_SERVER=SMTP_HOST,
        MAIL_STARTTLS=True,
        MAIL_SSL_TLS=False,
        USE_CREDENTIALS=True,
    )


async def send_verification_email(email_to: EmailStr, token: str):
    """Send verification email. Raises exception if email is configured but fails."""
    if not conf:
        verification_url = f"{FRONTEND_URL}/verify-email?token={token}"
        print(f"⚠️ Email not configured. Verification link: {verification_url}")
        raise ConnectionErrors("Email service not configured. Please set SMTP_USER and SMTP_PASSWORD in .env")
    
    try:
        verification_url = f"{FRONTEND_URL}/verify-email?token={token}"
        message = MessageSchema(
            subject="Please verify your email - CampusConnect",
            recipients=[email_to],
            body=f"""Welcome to CampusConnect!

Please verify your email address by clicking the link below:

{verification_url}

This link will expire in 24 hours.

If you didn't create this account, please ignore this email.

Best regards,
CampusConnect Team""",
            subtype="plain"
        )
        fm = FastMail(conf)
        await fm.send_message(message)
    except ConnectionErrors as e:
        verification_url = f"{FRONTEND_URL}/verify-email?token={token}"
        print(f"❌ Email configuration error: {str(e)}")
        print(f"💡 Verification link (for testing): {verification_url}")
        raise ConnectionErrors(
            f"Email service error: {str(e)}. For development, use: {verification_url}"
        )

async def send_reset_password_email(email_to: EmailStr, token: str):
    """Send password reset email. Raises exception if email is configured but fails."""
    if not conf:
        reset_url = f"{FRONTEND_URL}/reset-password?token={token}"
        print(f"⚠️ Email not configured. Reset link: {reset_url}")
        raise ConnectionErrors("Email service not configured. Please set SMTP_USER and SMTP_PASSWORD in .env")
    
    try:
        reset_url = f"{FRONTEND_URL}/reset-password?token={token}"
        message = MessageSchema(
            subject="Reset your password - CampusConnect",
            recipients=[email_to],
            body=f"""Password Reset Request

You requested to reset your password. Click the link below to set a new password:

{reset_url}

This link will expire in 1 hour.

If you didn't request this, please ignore this email.

Best regards,
CampusConnect Team""",
            subtype="plain"
        )
        fm = FastMail(conf)
        await fm.send_message(message)
    except ConnectionErrors as e:
        reset_url = f"{FRONTEND_URL}/reset-password?token={token}"
        print(f"❌ Email configuration error: {str(e)}")
        print(f"💡 Reset link (for testing): {reset_url}")
        raise ConnectionErrors(
            f"Email service error: {str(e)}. For development, use: {reset_url}"
        )
