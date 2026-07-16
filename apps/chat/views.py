from django.shortcuts import render
from .models import *
from django.http import JsonResponse
from django.shortcuts import get_object_or_404

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
    
def conversation_detail(request,conversation_id):
    conversation=get_object_or_404(Conversation,id=conversation_id)
    mesg=conversation.messages.all().order_by('created_at')
    return render(request,"base.html",{'conversation':conversation , 'message':mesg})