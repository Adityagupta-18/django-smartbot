from django.shortcuts import render
from apps.chat.models import Conversation
# Create your views here.
def home(request):
    all_conversations = Conversation.objects.filter(user=request.user).order_by("-updated_at")
    context = {"all_conversations": all_conversations,}
    return render(request, "core/home.html", context)