import os

from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model


class Command(BaseCommand):
    help = "Promote an existing production user to superuser."

    def handle(self, *args, **options):
        User = get_user_model()

        email = os.getenv("ADMIN_EMAIL")

        if not email:
            self.stdout.write(
                self.style.ERROR("ADMIN_EMAIL must be set.")
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

        user.is_staff = True
        user.is_superuser = True
        user.is_active = True
        user.save(update_fields=["is_staff", "is_superuser", "is_active"])

        self.stdout.write(
            self.style.SUCCESS(
                f"User '{user.email}' is now a production superuser."
            )
        )