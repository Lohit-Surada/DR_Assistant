from django.conf import settings

from .prompts import SYSTEM_PROMPT


def generate_response(messages):
    from groq import Groq

    if not settings.GROQ_API_KEY:
        raise RuntimeError('Chatbot provider is not configured.')
    client = Groq(api_key=settings.GROQ_API_KEY)
    response = client.chat.completions.create(
        model=settings.GROQ_MODEL,
        messages=[{'role': 'system', 'content': SYSTEM_PROMPT}, *messages],
        temperature=0.2,
        max_tokens=500,
    )
    return response.choices[0].message.content.strip()