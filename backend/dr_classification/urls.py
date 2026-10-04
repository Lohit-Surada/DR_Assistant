from django.urls import path

from classifier.views import classify


urlpatterns = [
    path('api/classify/', classify, name='classify'),
]