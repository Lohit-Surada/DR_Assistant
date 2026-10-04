from django.conf import settings
from django.conf.urls.static import static
from django.urls import path

from classifier.views import classify, gradcam, lesions


urlpatterns = [
    path('api/classify/', classify, name='classify'),
    path('api/gradcam/', gradcam, name='gradcam'),
    path('api/lesions/', lesions, name='lesions'),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)