from django.contrib.auth.backends import ModelBackend
from apps.authentication.models import CustomUser
from django.contrib.auth import get_user_model

User = get_user_model()

class EmailAuthenticationBackend(ModelBackend):

    def authenticate(self, request, username=None, email=None, password=None, **kwargs):

        if password is None:
            return None

        try:
            if email:
                user = User.objects.get(email__iexact=email)

            elif username:
                user = User.objects.get(username=username)

            else:
                return None

        except User.DoesNotExist:
            return None

        if user.check_password(password) and self.user_can_authenticate(user):
            return user

        return None


    def get_user(self, user_id):
        try:
            user = User.objects.get(pk=user_id)
            return user
        
        except User.DoesNotExist:
            return None
