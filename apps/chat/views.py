from django.shortcuts import render
from .models import *
from django.http import JsonResponse
import json
from django.shortcuts import get_object_or_404
from apps.chat.ai import *
from django.utils import timezone
from groq import RateLimitError
from datetime import date, timedelta
import re
from django.contrib.auth.decorators import login_required
from django.views.decorators.http import require_POST


# Create your views here.

@require_POST
def new_chat(request):
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

    

@login_required
def conversation_detail(request,conversation_id):
    user=request.user
    all_conversations=Conversation.objects.filter(user=user).order_by('-updated_at')
    today=date.today()
    has_conversations = all_conversations.exists()
    today_conversations = []
    previous_conversations = []
    for conversation in all_conversations:
        if conversation.updated_at.date()==today:
            today_conversations.append(conversation)
        else:
            previous_conversations.append(conversation)

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
             "all_conversations": all_conversations,
             "has_conversations":has_conversations,
             "today_conversations": today_conversations,
             "previous_conversations": previous_conversations,
             "ai_available": (
                                AIservicestatus.is_available
                                if AIservicestatus
                                else True
                            ),
            "retry_after": retry_after,
            }
    return render(request,"core/home.html",context)


@login_required
@require_POST
def send_message(request):

    try:
        data = json.loads(request.body)
    except json.JSONDecodeError:
        return JsonResponse({
            "success": False,
            "error_type": "invalid_request",
            "message": "Invalid request data."
        }, status=400)

    conversation_id = data.get("conversation_id")
    content = data.get("content", "").strip()
    if not conversation_id:
        return JsonResponse({
            "success": False,
            "error_type": "invalid_request",
            "message": "Conversation ID is required."
        }, status=400)

    if not content:
        return JsonResponse({
            "success": False,
            "error_type": "invalid_request",
            "message": "Message cannot be empty."
        }, status=400)

    conversation = get_object_or_404(Conversation,id=conversation_id,user=request.user)

    message=Message.objects.create(conversation=conversation,sender="USER",content=content)
    
    MAX_HISTORY_MESSAGES = 20
    history = list(conversation.messages.all().order_by("-created_at")[:MAX_HISTORY_MESSAGES])
    history.reverse()
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

        if conversation.messages.count() % 6 == 0:
            summary_history = "\n".join(
                [
                    f"{msg.sender}: {msg.content}"
                    for msg in conversation.messages.all()
                ]
            )
            
            summary = generate_conversation_summary(summary_history)
            conversation.summary=summary
            conversation.save(update_fields=["summary"])

        if conversation.messages.count() == 2 and conversation.title == "New Chat":
            try:
                title=generate_conversation_title(user_message=message.content,ai_response=ai_response)
            except Exception:
                title="New Chat"
            conversation.title = title
            conversation.save(update_fields=["title"])

        return JsonResponse({
            "success": True,
            "ai_response": ai_response,
            "title": conversation.title,
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

    except TavilySearchError as e:
        return JsonResponse({
            "success": False,
            "error_type": "web_search_unavailable",
            "message": "Smart Search is currently unavailable. Please try again later."
        })

    except Exception as e:
        return JsonResponse({
            "success": False,
            "error_type": "server_error",
            "message": "Something went wrong. Please try again."
        })



@login_required
@require_POST
def rename_conversation(request):
    try:
        data = json.loads(request.body)

        conversation_id = data.get("conversation_id")
        new_title = data.get("title").strip()

        conversation = get_object_or_404(
            Conversation,
            id=conversation_id,
            user=request.user
        )

        conversation.title = new_title
        conversation.save()

    except Exception:
        return JsonResponse({
            "success": False,
            "error": "Something went wrong."
        }, status=500)

    return JsonResponse({
        "success": True,
        "title": conversation.title
    })



@login_required
@require_POST
def delete_conversation(request):
    try:
        data = json.loads(request.body)
        conversation_id = data.get("conversation_id")
        conversation=get_object_or_404(
            Conversation,
            id=conversation_id,
            user=request.user
            )
        conversation.delete()
        
    except Exception:
        return JsonResponse({
            "success": False,
            "error": "Something went wrong."
        }, status=500)

    return JsonResponse({
        "success": True
    })