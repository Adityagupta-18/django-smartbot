from django.shortcuts import render

# Create your views here.
def login_view(request):
    return render(request,'authentication/login_page.html')

def register_view(request):
    return render(request,'authentication/register_page.html')

def forgot_password(request):
    return render(request,'authentication/forgot_password.html')