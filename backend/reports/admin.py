from django.contrib import admin

from .models import MedicalReport


@admin.register(MedicalReport)
class MedicalReportAdmin(admin.ModelAdmin):
    list_display = ('id', 'owner_id', 'image_name', 'created_at', 'updated_at')