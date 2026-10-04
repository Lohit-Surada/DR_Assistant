from .domain_guard import REFUSAL
from .groq_service import generate_response


def answer(message, history, category):
    if category == 'blocked':
        return REFUSAL
    return generate_response([*history, {'role': 'user', 'content': message}])