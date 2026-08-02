from django.contrib.auth.forms import UserCreationForm
from .models import CustomUser
from django import forms
from django.contrib.auth import authenticate


class RegisterForm(UserCreationForm):
    full_name = forms.CharField()
    email = forms.EmailField()

    def clean_email(self):
        email = self.cleaned_data["email"].strip().lower()

        if CustomUser.objects.filter(email=email).exists():
            raise forms.ValidationError(
                "An account with this email already exists."
            )

        return email

    def clean_full_name(self):
        full_name = self.cleaned_data["full_name"].strip().title()
        return full_name

    def clean_username(self):
        username = self.cleaned_data["username"].strip().lower()
        if CustomUser.objects.filter(username=username).exists():
            raise forms.ValidationError(
                "This username is already taken."
            )
        return username

    def save(self, commit=True):
        user = super().save(commit=False)

        full_name = self.cleaned_data["full_name"]

        name_parts = full_name.split(" ", 1)

        user.first_name = name_parts[0]

        if len(name_parts) > 1:
            user.last_name = name_parts[1]

        user.username = self.cleaned_data["username"]
        user.email = self.cleaned_data["email"]

        if commit:
            user.save()

        return user

    class Meta:
        model = CustomUser
        fields = [
            "full_name",
            "username",
            "email",
        ]



class LoginForm(forms.Form):
    email = forms.EmailField()
    password = forms.CharField()
    remember_me = forms.BooleanField(required=False)

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.user = None

    def clean(self):
        cleaned_data = super().clean()
        email = cleaned_data.get("email")
        password=cleaned_data.get("password")
        if email and password:
            user=authenticate(email=email , password=password)

            if user is None:
                raise forms.ValidationError("Invalid email or password.")
        
            self.user=user
        return cleaned_data