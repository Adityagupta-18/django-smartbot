import os
from groq import Groq
from apps.chat.prompts import SYSTEM_PROMPT , TITLE_PROMPT , SUMMARY_PROMPT

client = Groq(api_key=os.environ.get("GROQ_API_KEY"),)

def generate_ai_response(history):
    chat_completion = client.chat.completions.create(
        messages=[
            {
                'role':'system',
                "content": SYSTEM_PROMPT,
            },
            *history
        ],
        model="llama-3.3-70b-versatile",
        temperature=0.7)

    return chat_completion.choices[0].message.content


def generate_conversation_title(user_message, ai_response):
    chat_completion = client.chat.completions.create(
        messages=[
            {
                "role": "system",
                "content": TITLE_PROMPT,
            },
            {
                "role": "user",
                "content": f"""
                    Generate a title for this conversation.

                    User message:
                    {user_message}

                    Assistant response:
                    {ai_response}
                    """,
            },
        ],
        model="llama-3.3-70b-versatile",
        temperature=0.4,
    )

    title = chat_completion.choices[0].message.content.strip()
    title = title.replace('"', "").strip()
    if len(title) > 50:
        title = title[:50].rstrip()

    if not title:
        title = "New Chat"

    return title



def generate_conversation_summary(conversation_history):
    chat_completion = client.chat.completions.create(
        messages=[
            {
                "role":"system",
                "content": SUMMARY_PROMPT,
            },
            {
                "role":"user",
                "content": conversation_history,
            },
        ],
        model="llama-3.3-70b-versatile",
        temperature=0.3,
    )

    summary = chat_completion.choices[0].message.content.strip()

    return summary