import os
from pathlib import Path

from dotenv import load_dotenv


BASE_DIR = Path(__file__).resolve().parent.parent
load_dotenv(BASE_DIR / '.env')

SECRET_KEY = 'development-only-change-me'
DEBUG = True
ALLOWED_HOSTS = ['localhost', '127.0.0.1']

ROOT_URLCONF = 'dr_classification.urls'
MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'django.middleware.common.CommonMiddleware',
]
INSTALLED_APPS = [
    'chatbot',
    'reports',
]
TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [],
        'APP_DIRS': True,
        'OPTIONS': {'context_processors': []},
    },
]
WSGI_APPLICATION = 'dr_classification.wsgi.application'

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': BASE_DIR / 'db.sqlite3',
    },
}

DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'
FILE_UPLOAD_MAX_MEMORY_SIZE = 12 * 1024 * 1024
DATA_UPLOAD_MAX_MEMORY_SIZE = 12 * 1024 * 1024
MEDIA_ROOT = BASE_DIR / 'media'
MEDIA_URL = '/media/'

GROQ_API_KEY = os.getenv('GROQ_API_KEY', '')
GROQ_MODEL = os.getenv('GROQ_MODEL', 'llama-3.3-70b-versatile')
CHATBOT_MAX_HISTORY = int(os.getenv('CHATBOT_MAX_HISTORY', '12'))
CHATBOT_RATE_LIMIT = int(os.getenv('CHATBOT_RATE_LIMIT', '10'))
FIREBASE_SERVICE_ACCOUNT_FILE = os.getenv('FIREBASE_SERVICE_ACCOUNT_FILE', '')
