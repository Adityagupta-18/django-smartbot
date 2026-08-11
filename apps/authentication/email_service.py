import os

import sib_api_v3_sdk
from sib_api_v3_sdk.rest import ApiException


def send_email(to_email, subject, message):
    configuration = sib_api_v3_sdk.Configuration()
    configuration.api_key["api-key"] = os.getenv("BREVO_API_KEY")

    api_instance = sib_api_v3_sdk.TransactionalEmailsApi(
        sib_api_v3_sdk.ApiClient(configuration)
    )

    sender = sib_api_v3_sdk.SendSmtpEmailSender(
        name="SmartBot",
        email=os.getenv("BREVO_SENDER_EMAIL"),
    )

    send_smtp_email = sib_api_v3_sdk.SendSmtpEmail(
        sender=sender,
        to=[
            sib_api_v3_sdk.SendSmtpEmailTo(
                email=to_email
            )
        ],
        subject=subject,
        text_content=message,
    )

    try:
        response = api_instance.send_transac_email(send_smtp_email)
        return response

    except ApiException as e:
        print("Brevo email error:", e)
        raise