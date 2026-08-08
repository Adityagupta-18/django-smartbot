import os
from groq import Groq
from tavily import TavilyClient
from apps.chat.prompts import SYSTEM_PROMPT , TITLE_PROMPT , SUMMARY_PROMPT

client = Groq(api_key=os.environ.get("GROQ_API_KEY"),)
tavily_client = TavilyClient(api_key=os.environ.get("TAVILY_API_KEY"))


class TavilySearchError(Exception):
    pass


# TRAVILY SEARCH
def search_web(query):
    try:
        response = tavily_client.search(
            query=query,
            search_depth="basic",
            max_results=3,
        )

        results = []

        for result in response.get("results", []):
            results.append({
                "title": result.get("title", ""),
                "url": result.get("url", ""),
                "content": result.get("content", ""),
            })
        return results
    
    except Exception as e:
        raise TavilySearchError(str(e))


# FORMATTED SERACH
def format_search_results(results):
    if not results:
        return ""

    web_context = []

    for index, result in enumerate(results, start=1):
        web_context.append(
            f"""Source {index}
            Title: {result["title"]}
            URL: {result["url"]}
            Content: {result["content"]}"""
                    )

    return "\n\n".join(web_context)




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

    if web_search_required:
        try:
            search_results = search_web(user_message)

        except TavilySearchError:
            raise TavilySearchError("Smart Search is currently unavailable. Please try again later.")
        
        web_context = format_search_results(search_results)
        if not web_context:
            raise Exception("Smart Search could not find useful information for this question.")

        messages = [
            {
                "role": "system",
                "content": SYSTEM_PROMPT,
            },
            *history,
            {
                "role": "system",
                "content": f"""
            Web information was retrieved for the user's current question.

            Use the retrieved information when it is relevant, especially for
            current or time-sensitive facts.

            Do not invent facts that are not supported by the retrieved information.
            If the retrieved information is insufficient, say so rather than
            making up an answer.

            Do not claim that you searched the web unless web information was
            actually provided.

            WEB INFORMATION:
            {web_context}
            """
            },
        ]

    else:
        messages = [
            {
                "role": "system",
                "content": SYSTEM_PROMPT,
            },
            *history,
        ]

    chat_completion = client.chat.completions.create(
        messages=messages,
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