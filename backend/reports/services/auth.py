import logging

from django.conf import settings

LOGGER = logging.getLogger(__name__)


def verify_firebase_token(request):
    header = request.headers.get('Authorization', '')
    if not header.startswith('Bearer ') or not settings.FIREBASE_SERVICE_ACCOUNT_FILE:
        return None
    try:
        import firebase_admin
        from firebase_admin import auth, credentials
        if not firebase_admin._apps:
            firebase_admin.initialize_app(credentials.Certificate(settings.FIREBASE_SERVICE_ACCOUNT_FILE))
        return auth.verify_id_token(header[7:].strip())
    except Exception:
        LOGGER.warning('Report Firebase token verification failed.', exc_info=True)
        return None