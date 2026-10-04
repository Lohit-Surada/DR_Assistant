from django.db import migrations, models
import django.db.models.deletion
import uuid


class Migration(migrations.Migration):
    initial = True
    dependencies = []
    operations = [
        migrations.CreateModel(
            name='MedicalReport',
            fields=[
                ('id', models.UUIDField(default=uuid.uuid4, editable=False, primary_key=True, serialize=False)),
                ('owner_id', models.CharField(db_index=True, max_length=128)),
                ('image', models.ImageField(upload_to='reports/%Y/%m/%d/originals/')),
                ('image_name', models.CharField(max_length=255)),
                ('payload', models.JSONField()),
                ('report_file', models.FileField(blank=True, upload_to='reports/%Y/%m/%d/pdfs/')),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
            ],
        ),
    ]