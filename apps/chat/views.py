from django.shortcuts import render
from .models import *
from django.http import JsonResponse

# Create your views here.
def new_chat(request):
    if request.method=='POST':
        conversation=Conversation.objects.create(
            user=request.user,
            title="New Chat")
        return JsonResponse({
                "success": True,
                "id": conversation.id,
                "title": conversation.title})
        