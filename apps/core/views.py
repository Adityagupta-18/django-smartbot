from django.shortcuts import render
from apps.chat.models import *
from django.utils import timezone
from datetime import date
from django.contrib.auth.decorators import login_required

@login_required
def home(request):
    all_conversations = Conversation.objects.filter(user=request.user).order_by("-updated_at")
    today=date.today()
    has_conversations = all_conversations.exists()
    today_conversations = []
    previous_conversations = []
    for conversation in all_conversations:
        if conversation.updated_at.date()==today:
            today_conversations.append(conversation)
        else:
            previous_conversations.append(conversation)

    AIservicestatus = AIStatus.objects.first()
    retry_after = 0
    if (
        AIservicestatus
        and not AIservicestatus.is_available
        and AIservicestatus.reset_time
    ):
        retry_after = max(
            0,
            int(
                (
                    AIservicestatus.reset_time -
                    timezone.now()
                ).total_seconds()
            )
        )
    context = {
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
    return render(request, "core/home.html", context)