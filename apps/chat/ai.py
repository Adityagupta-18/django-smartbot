import os
from groq import Groq
from tavily import TavilyClient
from apps.chat.prompts import SYSTEM_PROMPT , TITLE_PROMPT , SUMMARY_PROMPT

client = Groq(api_key=os.environ.get("GROQ_API_KEY"),)
tavily_client = TavilyClient(api_key=os.environ.get("TAVILY_API_KEY"))

def search_web(query):
    response = tavily_client.search(
        query=query,
        search_depth="basic",
        max_results=5,
    )

    return response


def requires_web_search(user_message):
    check_prompt = f"""
Determine whether answering the user's question accurately requires
fresh, current, recent, or real-world information from the internet.

Return ONLY one word:
YES
or
NO

Return YES when the question involves things such as:
- current or latest information
- ongoing or recent events
- today's news or events
- current public figures or positions
- current prices, availability, or status
- recent software releases or updates
- things happening right now
- information that may have changed since the model's knowledge

Return NO for:
- general knowledge
- programming explanations
- tutorials
- conceptual questions
- historical information
- mathematical questions
- creative writing
- questions that can be answered reliably without current information

Examples:

Question: Explain Python decorators.
Answer: NO

Question: What is the latest Django release?
Answer: YES

Question: What protest is happening at Jantar Mantar?
Answer: YES

Question: How does Django middleware work?
Answer: NO

Question: Who is currently the CEO of OpenAI?
Answer: YES

Question:
{user_message}
"""

    response = client.chat.completions.create(
        messages=[
            {
                "role": "user",
                "content": check_prompt,
            }
        ],
        model="llama-3.3-70b-versatile",
        temperature=0,
    )

    result = response.choices[0].message.content.strip().upper()
    return result == "YES"



def generate_ai_response(history):
    user_message=history[-1]["content"]
    web_search_required = requires_web_search(user_message)
    print("Web search required:", web_search_required)

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