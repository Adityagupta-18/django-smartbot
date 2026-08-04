from django.shortcuts import render
from django.http import HttpResponse
from django.contrib.auth import login
from django.shortcuts import render, redirect
from .forms import *
from django.utils.http import url_has_allowed_host_and_scheme
from django.conf import settings
from django.contrib.auth import logout
from django.views.decorators.http import require_POST
from django.contrib import messages
from django.urls import reverse
from django.utils.http import urlsafe_base64_encode
from django.utils.encoding import force_bytes
from .tokens import email_verification_token
from django.core.mail import send_mail
from django.utils.http import urlsafe_base64_decode
from django.utils.encoding import force_str
from django.contrib import messages
from .models import CustomUser
from .tokens import email_verification_token
from django.contrib.auth.tokens import default_token_generator



def login_view(request):
    next_url = request.GET.get("next") or request.POST.get("next")
    if next_url in (None, "", "None"):
        next_url = None 

    if request.user.is_authenticated:
        return redirect(settings.LOGIN_REDIRECT_URL)
    
    if request.method=="POST":    
        form=LoginForm(request.POST)

        if form.is_valid():
            login(request,form.user)

            if not form.cleaned_data["remember_me"]:
                request.session.set_expiry(0)

            if next_url and url_has_allowed_host_and_scheme(
                next_url,
                allowed_hosts={request.get_host()},
                require_https=request.is_secure(),
            ):
                return redirect(next_url)

            return redirect(settings.LOGIN_REDIRECT_URL)

    else:
        form=LoginForm()
    context = {
        "form": form,
        "next": next_url,
    }
    return render(request,'authentication/login_page.html',context)




@require_POST
def logout_view(request):
    logout(request)
    return redirect(settings.LOGOUT_REDIRECT_URL)




def register_view(request):
    if request.user.is_authenticated:
        return redirect(settings.LOGIN_REDIRECT_URL)

    if request.method=="POST":
        form=RegisterForm(request.POST)

        if form.is_valid():
            user=form.save(commit=False)
            user.is_active=False
            user.save()
            uid = urlsafe_base64_encode(force_bytes(user.pk))
            token = email_verification_token.make_token(user)
            verification_path = reverse(
                "authentication:verify_email",
                kwargs={
                    "uidb64": uid,
                    "token": token,
                },
            )

            verification_url = request.build_absolute_uri(
                verification_path
            )

            # Sending email
            send_mail(
                subject="Verify your SmartBot account",
                message=(
                    f"Hi {user.first_name},\n\n"
                    f"Welcome to SmartBot!\n\n"
                    f"Please verify your email by clicking the link below:\n\n"
                    f"{verification_url}\n\n"
                    f"If you didn't create this account, you can safely ignore this email."
                ),
                from_email=settings.DEFAULT_FROM_EMAIL,
                recipient_list=[user.email],
                fail_silently=False,
            )
            messages.success(request,"Account created successfully! A verification link has been sent to your email.")
            return redirect(settings.LOGIN_URL)

    else:
        form=RegisterForm()

    context = {"form": form,}
    return render(request,'authentication/register_page.html',context)




def verify_email(request, uidb64, token):
    try:
        uid = force_str(urlsafe_base64_decode(uidb64))
        user = CustomUser.objects.get(pk=uid)

    except (TypeError, ValueError, OverflowError, CustomUser.DoesNotExist):
        user = None

    if user and email_verification_token.check_token(user, token):

        user.is_active = True
        user.save()
        messages.success(
            request,
            "Your email has been verified successfully. You can now sign in."
        )
    else:
        messages.error(
            request,
            "This verification link is invalid or has expired."
        )

    return redirect(settings.LOGIN_REDIRECT_URL)




def forgot_password(request):
    if request.method=='POST':
        form=ForgotPasswordForm(request.POST)

        if form.is_valid():
            email = form.cleaned_data["email"]
            user = CustomUser.objects.get(email__iexact=email)

            uid = urlsafe_base64_encode(force_bytes(user.pk))
            token = default_token_generator.make_token(user)

            reset_path = reverse(
                "authentication:reset_password",
                kwargs={
                    "uidb64": uid,
                    "token": token,
                },
            )
            reset_url = request.build_absolute_uri(reset_path)

            send_mail(
                subject="Reset your SmartBot password",
                message=(
                    f"Hi {user.first_name},\n\n"
                    f"Welcome to SmartBot!\n\n"
                    f"We received a request to reset your SmartBot password.\n\n"
                    f"click the link below:\n\n"
                    f"{reset_url}\n\n"
                    f"If you didn't request this, simply ignore this email."
                ),
                from_email=settings.DEFAULT_FROM_EMAIL,
                recipient_list=[user.email],
                fail_silently=False,
            )
            messages.success(
                request,
                "Password reset link has been sent to your email."
            )

            return redirect(settings.LOGIN_REDIRECT_URL)
        
    else:
        form = ForgotPasswordForm()

    context={"form":form,}
    return render(request,'authentication/forgot_password.html',context)




def reset_password(request, uidb64, token):
    try:
        uid = force_str(urlsafe_base64_decode(uidb64))
        user = CustomUser.objects.get(pk=uid)

    except (TypeError, ValueError, OverflowError, CustomUser.DoesNotExist):
        user = None

    if user is None or not default_token_generator.check_token(user, token):
        messages.error(
            request,
            "This password reset link is invalid or has expired."
        )
        return redirect("authentication:login")

    if request.method == "POST":
        form = ResetPasswordForm(user, request.POST)

        if form.is_valid():
            form.save()

            messages.success(
                request,
                "Your password has been updated successfully. Please sign in."
            )

            return redirect(settings.LOGIN_REDIRECT_URL)

    else:
        form = ResetPasswordForm(user)

    context = {"form": form,}

    return render(request,"authentication/reset_password.html",context)