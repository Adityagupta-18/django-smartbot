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

        message=Message.objects.create(conversation=conversation,sender="USER",content=content)

        
        if conversation.messages.count() == 1 and conversation.title == "New Chat":
            first_message=message.content.title()
            cleaned=" ".join(first_message.strip().replace("\n"," ").split())
            filler_words = {
                "is","am","are","was","were",
                "of","the","a","an",
                "can","you","i","me",
                "what","how","why",
                "please","tell","explain"
            }
            title_words = [w for w in cleaned.split() if w.lower() not in filler_words]
            title = " ".join(title_words)
            title = title[:50] + ("..." if len(title) > 50 else "")
            
            conversation.title = title
            conversation.save()

        
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

            # Updating conversation 
            conversation.save() 

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




def rename_conversation(request):

    if request.method == "POST":

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

        return JsonResponse({
            "success": True,
            "title": conversation.title
        })

    return JsonResponse({
        "success": False
    })