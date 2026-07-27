from django.contrib.auth.forms import UserCreationForm
from .models import CustomUser
from django import forms



class RegisterForm(UserCreationForm):
    first_name = forms.CharField()
    last_name = forms.CharField()
    email = forms.EmailField()

    def clean_email(self):
        email = self.cleaned_data["email"]
        return email

    class Meta:
        model = CustomUser
        fields = [
            "first_name",
            "last_name",
            "username",
            "email",
        ]