import json
import logging
from pathlib import Path

from django.core.files.base import ContentFile
from django.http import FileResponse, JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods

from .models import MedicalReport
from .services.auth import verify_firebase_token
from .services.pdf_report_service import MedicalReportGenerator

LOGGER = logging.getLogger(__name__)


def _cors(response):
    response['Access-Control-Allow-Origin'] = '*'
    response['Access-Control-Allow-Headers'] = 'Authorization, Content-Type, X-Report-Client-ID'
    response['Access-Control-Allow-Methods'] = 'POST, GET, OPTIONS'
    return response


def _owner(request):
    token = verify_firebase_token(request)
    if token:
        return f'firebase:{token["uid"]}'
    return request.headers.get('X-Report-Client-ID', '').strip()[:128] or None


def _report_file(report):
    if report.report_file and Path(report.report_file.path).exists():
        return report.report_file.path
    pdf = MedicalReportGenerator(report).build()
    report.report_file.save(f'Diabetic_Retinopathy_Report_{report.id}.pdf', ContentFile(pdf), save=True)
    return report.report_file.path


def _response(request, analysis_id, attachment):
    owner_id = _owner(request)
    if not owner_id:
        return _cors(JsonResponse({'error': 'Authentication is required to access this report.'}, status=401))
    report = MedicalReport.objects.filter(id=analysis_id, owner_id=owner_id).first()
    if not report:
        return _cors(JsonResponse({'error': 'Report not found.'}, status=404))
    try:
        path = _report_file(report)
        response = FileResponse(open(path, 'rb'), content_type='application/pdf')
        disposition = 'attachment' if attachment else 'inline'
        response['Content-Disposition'] = f'{disposition}; filename="Diabetic_Retinopathy_Report_{analysis_id}.pdf"'
        return _cors(response)
    except Exception:
        LOGGER.exception('Report generation failed for %s.', analysis_id)
        return _cors(JsonResponse({'error': 'The report could not be generated.'}, status=500))


@csrf_exempt
@require_http_methods(['POST', 'OPTIONS'])
def create_report(request):
    if request.method == 'OPTIONS':
        return _cors(JsonResponse({}, status=204))
    owner_id = _owner(request)
    if not owner_id:
        return _cors(JsonResponse({'error': 'Authentication is required to create a report.'}, status=401))
    uploaded_image = request.FILES.get('image')
    if not uploaded_image:
        return _cors(JsonResponse({'error': 'The original fundus image is required.'}, status=400))
    try:
        payload = json.loads(request.POST.get('payload', '{}'))
    except json.JSONDecodeError:
        return _cors(JsonResponse({'error': 'The analysis payload is invalid.'}, status=400))
    classification = payload.get('classification') or {}
    lesions = payload.get('lesions') or {}
    gradcam = payload.get('gradcam') or {}
    if not classification.get('title') or classification.get('confidence') is None or not lesions.get('summary') or not gradcam.get('combined_path'):
        return _cors(JsonResponse({'error': 'Please complete the full retinal analysis before creating a report.'}, status=400))
    report = MedicalReport.objects.create(owner_id=owner_id, image=uploaded_image, image_name=uploaded_image.name, payload=payload)
    return _cors(JsonResponse({'success': True, 'analysis_id': str(report.id)}))


@require_http_methods(['GET', 'OPTIONS'])
def view_report(request, analysis_id):
    if request.method == 'OPTIONS':
        return _cors(JsonResponse({}, status=204))
    return _response(request, analysis_id, attachment=False)


@require_http_methods(['GET', 'OPTIONS'])
def download_report(request, analysis_id):
    if request.method == 'OPTIONS':
        return _cors(JsonResponse({}, status=204))
    return _response(request, analysis_id, attachment=True)