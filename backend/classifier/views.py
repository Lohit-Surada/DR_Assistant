from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt

from .classifier import ALLOWED_EXTENSIONS, classify_image


def add_cors_headers(response):
    response['Access-Control-Allow-Origin'] = 'http://localhost:5173'
    response['Access-Control-Allow-Headers'] = 'Content-Type'
    return response


@csrf_exempt
def classify(request):
    if request.method == 'OPTIONS':
        return add_cors_headers(JsonResponse({}, status=204))
    if request.method != 'POST':
        return add_cors_headers(JsonResponse({'error': 'Use POST with an image file.'}, status=405))

    uploaded_file = request.FILES.get('image')
    if not uploaded_file:
        return add_cors_headers(JsonResponse({'error': 'Choose a retinal image before running the classification.'}, status=400))

    extension = uploaded_file.name.rsplit('.', 1)[-1].lower() if '.' in uploaded_file.name else ''
    if extension not in ALLOWED_EXTENSIONS:
        return add_cors_headers(JsonResponse({'error': 'Use a JPG, JPEG, PNG, or WEBP image.'}, status=400))
    if uploaded_file.size > 12 * 1024 * 1024:
        return add_cors_headers(JsonResponse({'error': 'That image is larger than 12 MB. Choose a smaller file and try again.'}, status=413))

    try:
        result = classify_image(uploaded_file)
    except (OSError, ValueError):
        return add_cors_headers(JsonResponse({'error': 'That file could not be read as an image. Try another retinal photograph.'}, status=400))

    return add_cors_headers(JsonResponse(result))