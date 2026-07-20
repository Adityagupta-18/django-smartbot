import os
from groq import Groq

client = Groq(api_key=os.environ.get("GROQ_API_KEY"),)

def generate_ai_response(history):
    chat_completion = client.chat.completions.create(
        messages=history,
        model="llama-3.3-70b-versatile",
        temperature=0.7)

    return chat_completion.choices[0].message.content