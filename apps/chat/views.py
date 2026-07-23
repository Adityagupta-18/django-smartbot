from django.shortcuts import render
from .models import *
from django.http import JsonResponse
import json
from django.shortcuts import get_object_or_404
from apps.chat.ai import *
from django.utils import timezone
from groq import RateLimitError
from datetime import timedelta
import re

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

    AIservicestatus = AIStatus.objects.first()
    retry_after = 0
    if (AIservicestatus 
        and not AIservicestatus.is_available 
        and AIservicestatus.reset_time
        ):
        retry_after = max(
            0,
         int(
             (AIservicestatus.reset_time - timezone.now()).total_seconds())
         )
    
    context={'conversation':conversation , 
             'messages':messages , 
             'all_conversations':all_conversations,
             "ai_available": (
                                AIservicestatus.is_available
                                if AIservicestatus
                                else True
                            ),
            "retry_after": retry_after,
            }
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
            AIservicestatus = AIStatus.objects.get()

            if not AIservicestatus.is_available:

                if timezone.now() >= AIservicestatus.reset_time:
                    AIservicestatus.is_available = True
                    AIservicestatus.reset_time = None
                    AIservicestatus.save()

                else:
                    remaining_seconds = int(
                        (AIservicestatus.reset_time - timezone.now()).total_seconds()
                    )

                    return JsonResponse({
                        "success": False,
                        "error_type": "rate_limit",
                        "message": "SmartBot is temporarily unavailable.",
                        "retry_after": remaining_seconds
                    })

            ai_response = generate_ai_response(history_dict)

            Message.objects.create(
                conversation=conversation,
                sender="AI",
                content=ai_response
            )

            return JsonResponse({
                "success": True,
                "ai_response": ai_response,
            })

        except RateLimitError as e:
            error_message = str(e)
            match = re.search(
                r"Please try again in (\d+)h(\d+)m([\d.]+)s",
                error_message
            )
            if match:
                hours = int(match.group(1))
                minutes = int(match.group(2))
                seconds = int(float(match.group(3)))

                retry_after = (
                    hours * 3600 +
                    minutes * 60 +
                    seconds
                )
            else:
                retry_after = 7200

            AIservicestatus.is_available = False
            AIservicestatus.reset_time = timezone.now() + timedelta(hours=2)
            AIservicestatus.save()

            return JsonResponse({
                "success": False,
                "error_type": "rate_limit",
                "message": "Daily AI usage limit has been reached. Please try again after the limit resets.",
                "retry_after": retry_after
            })

        except Exception as e:
            print("GENERAL ERROR:", e)
            return JsonResponse({
                "success": False,
                "error_type": "server_error",
                "message": "Something went wrong. Please try again."
            })

    return JsonResponse(
            {
    "success":False,
    "message": "Daily AI usage limit has been reached. Please try again after the limit resets."
        })