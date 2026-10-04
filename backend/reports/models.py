import uuid

from django.db import models


def original_upload_path(instance, filename):
    return f'reports/{instance.id}/originals/{filename}'


def pdf_upload_path(instance, filename):
    return f'reports/{instance.id}/{filename}'


class MedicalReport(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    owner_id = models.CharField(max_length=128, db_index=True)
    image = models.ImageField(upload_to=original_upload_path)
    image_name = models.CharField(max_length=255)
    payload = models.JSONField()
    report_file = models.FileField(upload_to=pdf_upload_path, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)