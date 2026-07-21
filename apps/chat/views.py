from django.shortcuts import render
from .models import *
from django.http import JsonResponse
import json
from django.shortcuts import get_object_or_404
from apps.chat.ai import *

# Create your views here.

def new_chat(request):
    if request.method=='POST':
        new_chats = Conversation.objects.filter(user=request.user,title="New Chat")
        for conversation in new_chats:
            if not conversation.messages.exists():
                return JsonResponse({
                "success": True,
                "conversation_id": conversation.id,
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


def send_message(request):
    if request.method=='POST':
        data = json.loads(request.body)

        conversation_id = data.get("conversation_id")
        content = data.get("content", "").strip()

        conversation = get_object_or_404(Conversation,id=conversation_id,user=request.user)

        Message.objects.create(conversation=conversation,sender="USER",content=content)
        history = conversation.messages.all().order_by("created_at")
        history_dict=[]
        for mesgcont in history:
            if mesgcont.sender=='USER':
                history_dict.append({"role":"user","content":mesgcont.content})
            else:
                history_dict.append({"role":"assistant","content":mesgcont.content})
        
        try:
            ai_response=generate_ai_response(history_dict)
            Message.objects.create(conversation=conversation,sender="AI",content=ai_response)

            return JsonResponse({
                'success':True,
                "ai_response": ai_response,
            })
        except Exception as e:
            return JsonResponse({
                "success": False,
                "error_type": "rate_limit",
                "message": "Daily AI usage limit has been reached. Please try again after the limit resets.",
                "retry_after": 7200
            })

    return JsonResponse(
            {
    "success":False,
    "message": "Daily AI usage limit has been reached. Please try again after the limit resets."
        })