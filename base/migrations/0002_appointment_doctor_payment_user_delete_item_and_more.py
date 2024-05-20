# Generated by Django 5.0.4 on 2024-05-14 13:56

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("base", "0001_initial"),
    ]

    operations = [
        migrations.CreateModel(
            name="Appointment",
            fields=[
                (
                    "id",
                    models.BigAutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                ("room", models.CharField(max_length=200)),
                ("date", models.DateField()),
                ("speciality", models.CharField(max_length=200)),
            ],
        ),
        migrations.CreateModel(
            name="Doctor",
            fields=[
                (
                    "id",
                    models.BigAutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                ("name", models.CharField(max_length=200)),
                ("speciality", models.CharField(max_length=200)),
            ],
        ),
        migrations.CreateModel(
            name="Payment",
            fields=[
                (
                    "id",
                    models.BigAutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                ("amount", models.IntegerField()),
                ("date", models.DateField()),
            ],
        ),
        migrations.CreateModel(
            name="User",
            fields=[
                (
                    "id",
                    models.BigAutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                ("username", models.CharField(max_length=200)),
                ("password", models.CharField(max_length=200)),
                ("email", models.CharField(max_length=200)),
            ],
        ),
        migrations.DeleteModel(
            name="Item",
        ),
        migrations.AddField(
            model_name="appointment",
            name="doctor",
            field=models.OneToOneField(
                on_delete=django.db.models.deletion.CASCADE, to="base.doctor"
            ),
        ),
        migrations.AddField(
            model_name="user",
            name="appointments",
            field=models.ManyToManyField(to="base.appointment"),
        ),
        migrations.AddField(
            model_name="payment",
            name="user",
            field=models.ForeignKey(
                on_delete=django.db.models.deletion.CASCADE, to="base.user"
            ),
        ),
    ]