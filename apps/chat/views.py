from django.shortcuts import render
from .models import *
from django.http import JsonResponse
from django.shortcuts import get_object_or_404

# Create your views here.
def new_chat(request):
    if request.method=='POST':
        new_chats = Conversation.objects.filter(user=request.user,title="New Chat")
        for conversation in new_chats:
            if not conversation.messages.exists():
                return JsonResponse({
                "success": True,
                "id": conversation.id,
                "title": conversation.title})
        
        conversation = Conversation.objects.create(
            user=request.user,
            title="New Chat"
        )
        return JsonResponse({
            "success": True,
            "conversation_id": conversation.id,
            "title": conversation.title
        })
            
    return JsonResponse({
            "success": False,
            "message": "Invalid request"}, status=400)
    
def conversation_detail(request,conversation_id):
    user=request.user
    all_conversations=Conversation.objects.filter(user=user).order_by('-updated_at')
    conversation=get_object_or_404(Conversation,id=conversation_id,user=user)
    messages=conversation.messages.all().order_by('created_at')

    context={'conversation':conversation , 'messages':messages , 'all_conversations':all_conversations}
    return render(request,"core/home.html",context)