from fastapi_mail import FastMail, MessageSchema, ConnectionConfig
import os
from typing import List
from pydantic import EmailStr
from core.config import SECRET_KEY



conf = ConnectionConfig(
    MAIL_USERNAME=os.getenv("SMTP_USER"),
    MAIL_PASSWORD=os.getenv("SMTP_PASSWORD"),  # just plain string
    MAIL_FROM=os.getenv("SMTP_USER"),
    MAIL_PORT=int(os.getenv("SMTP_PORT")),
    MAIL_SERVER=os.getenv("SMTP_HOST"),
    MAIL_STARTTLS=True,
    MAIL_SSL_TLS=False,
    USE_CREDENTIALS=True,
)


async def send_verification_email(email_to: EmailStr, token: str):
    message = MessageSchema(
        subject="Please verify your email",
        recipients=[email_to],
        body=f"Click the link to verify your account: http://yourfrontend.com/verify?token={token}",
        subtype="plain"
    )
    fm = FastMail(conf)
    await fm.send_message(message)

async def send_reset_password_email(email_to: EmailStr, token: str):
    message = MessageSchema(
        subject="Reset your password",
        recipients=[email_to],
        body=f"Click the link to reset your password: http://yourfrontend.com/reset?token={token}",
        subtype="plain"
    )
    fm = FastMail(conf)
    await fm.send_message(message)
