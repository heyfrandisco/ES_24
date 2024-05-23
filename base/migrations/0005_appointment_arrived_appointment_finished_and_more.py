# Generated by Django 5.0.4 on 2024-05-23 01:54

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("base", "0004_alter_appointment_user_delete_user"),
    ]

    operations = [
        migrations.AddField(
            model_name="appointment",
            name="arrived",
            field=models.BooleanField(default=False),
        ),
        migrations.AddField(
            model_name="appointment",
            name="finished",
            field=models.BooleanField(default=False),
        ),
        migrations.AddField(
            model_name="appointment",
            name="state",
            field=models.CharField(default="waiting for payment", max_length=200),
        ),
    ]
