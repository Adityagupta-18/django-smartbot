from django.shortcuts import render
from apps.chat.models import *
from django.utils import timezone

# Create your views here.
def home(request):
    all_conversations = Conversation.objects.filter(user=request.user).order_by("-updated_at")
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

        "ai_available": (
            AIservicestatus.is_available
            if AIservicestatus
            else True
        ),

        "retry_after": retry_after,
    }
    return render(request, "core/home.html", context)