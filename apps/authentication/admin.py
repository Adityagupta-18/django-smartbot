from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from apps.authentication.models import *

# Register your models here.

@admin.register(CustomUser)
class CustomUserAdmin(UserAdmin):
    pass
