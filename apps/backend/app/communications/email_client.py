from fastapi import FastAPI, HTTPException, Query
import smtplib
import imaplib
import ssl
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from dotenv import load_dotenv
import os

from ..core.config import settings
from ..utilities.logger import log


# Internal function to send email
def send_email_internal(recipient: str, subject: str, body: str, html: bool = False):
    try:
        context = ssl.create_default_context()

        with smtplib.SMTP_SSL(settings.SMTP_SERVER, settings.SMTP_PORT, context=context) as server:
            server.login(settings.SMTP_EMAIL, settings.SMTP_PASSWORD)
            log.info('Server authenticated successfully')

            msg = MIMEMultipart()
            display_name = "Mazeltov"  # Change this to your desired display name
            msg["From"] = f"{display_name} <{settings.SMTP_EMAIL}>"
            msg["To"] = recipient
            msg["Subject"] = subject

            # Choose the content type based on the 'html' parameter
            if html:
                msg.attach(MIMEText(body, "html"))
                log.info('sending as html')
            else:
                msg.attach(MIMEText(body, "plain"))

            server.sendmail(settings.SMTP_EMAIL, recipient, msg.as_string())
            log.info(f'email sent successfully to {recipient}')
    except smtplib.SMTPException as smtp_error:
        log.error(f'An SMTP error occured: {smtp_error}')
        raise HTTPException(status_code=500, detail=f"SMTP error occurred: {smtp_error}")
    except Exception as e:
        log.info('an error occured: {e}')
        raise HTTPException(status_code=500, detail=f"An error occurred: {e}")


def receive_emails():
    context = ssl.create_default_context()

    mail = imaplib.IMAP4_SSL(settings.IMAP_SERVER, settings.IMAP_PORT, ssl_context=context)
    mail.login(settings.SMTP_EMAIL, settings.SMTP_PASSWORD)

    mail.select("inbox")
    status, messages = mail.search(None, 'UNSEEN')

    email_ids = messages[0].split()
    email_messages = []

    for email_id in email_ids:
        status, msg_data = mail.fetch(email_id, "(RFC822)")
        for response_part in msg_data:
            if isinstance(response_part, tuple):
                email_messages.append(response_part[1].decode("utf-8"))

    mail.logout()
    return email_messages
