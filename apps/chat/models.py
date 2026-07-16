from django.db import models
from django.contrib.auth.models import User

# Create your models here.
class Conversation(models.Model):
    user=models.ForeignKey(User, on_delete=models.CASCADE)
    title=models.CharField(max_length=50)
    created_at=models.DateTimeField(auto_now_add=True)
    updated_at=models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.title
    
class Message(models.Model):
    SENDER_CHOICES = [('USER','user'),('AI','smartbot')]
    conversation=models.ForeignKey(Conversation,on_delete=models.CASCADE,related_name='messages')
    sender=models.CharField(max_length=10,choices=SENDER_CHOICES)
    content=models.TextField()
    created_at=models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.sender} - {self.conversation.title}"