from django.shortcuts import render
from django.contrib.auth import login
from django.shortcuts import render, redirect
from .forms import *
from django.utils.http import url_has_allowed_host_and_scheme
from django.conf import settings
from django.contrib.auth import logout
from django.views.decorators.http import require_POST
from django.contrib import messages


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
            user=form.save()
            messages.success(request,"Your account has been created successfully. Please sign in to continue.")
            return redirect(settings.LOGIN_URL)

        else:
            print(form.errors)

    else:
        form=RegisterForm()

    context = {"form": form,}
    return render(request,'authentication/register_page.html',context)


def forgot_password(request):
    return render(request,'authentication/forgot_password.html')