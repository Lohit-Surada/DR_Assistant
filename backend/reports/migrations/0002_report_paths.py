from django.db import migrations, models

from reports.models import original_upload_path, pdf_upload_path


class Migration(migrations.Migration):
    dependencies = [('reports', '0001_initial')]
    operations = [
        migrations.AlterField(
            model_name='medicalreport',
            name='image',
            field=models.ImageField(upload_to=original_upload_path),
        ),
        migrations.AlterField(
            model_name='medicalreport',
            name='report_file',
            field=models.FileField(blank=True, upload_to=pdf_upload_path),
        ),
    ]