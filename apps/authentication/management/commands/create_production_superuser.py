import os

from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model


class Command(BaseCommand):
    help = "Configure the production superuser."

    def handle(self, *args, **options):
        User = get_user_model()

        username = os.getenv("ADMIN_USERNAME")
        email = os.getenv("ADMIN_EMAIL")
        password = os.getenv("ADMIN_PASSWORD")

        if not username or not email or not password:
            self.stdout.write(
                self.style.ERROR(
                    "ADMIN_USERNAME, ADMIN_EMAIL and ADMIN_PASSWORD must be set."
                )
            )
            return

        try:
            user = User.objects.get(email=email)
        except User.DoesNotExist:
            self.stdout.write(
                self.style.ERROR(
                    f"No user found with email '{email}'."
                )
            )
            return

        user.username = username
        user.is_staff = True
        user.is_superuser = True
        user.is_active = True
        user.set_password(password)
        user.save()

        self.stdout.write(
            self.style.SUCCESS(
                f"User '{user.email}' is now a production superuser."
            )
        )