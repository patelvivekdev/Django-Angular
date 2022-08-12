from mailjet_rest import Client
import os
from django.conf import settings as conf_settings


def send_email(SUBJECT, MESSAGE, EMAILS, NAME):
    api_key = conf_settings.EMAIL_API_KEY
    api_secret = conf_settings.EMAIL_SECRET_KEY
    mailjet = Client(auth=(api_key, api_secret))
    data = {
        'FromEmail': 'webdev0000010@gmail.com',
        'FromName': 'Django Auth',
        'Subject': SUBJECT,
        'Html-part': MESSAGE,
        'To': f'{NAME} <{EMAILS}>',
    }
    result = mailjet.send.create(data=data)

    return result.json()
