import random
from datetime import timezone
from django.contrib.auth.models import User
from django.db import models


# Create your models here.
class Doctor(models.Model):
    name = models.CharField(max_length=200)
    speciality = models.CharField(max_length=200)


"""
class Userr(AbstractUser):
    username = models.CharField(max_length=200)
    password = models.CharField(max_length=200)
    email = models.CharField(max_length=200)
    # appointments = models.ManyToManyField(Appointment)
"""


class Appointment(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, null=True)
    date = models.DateField(null=True, blank=True)
    hour = models.TimeField(null=True, blank=True)
    speciality = models.CharField(max_length=200)
    doctor = models.CharField(max_length=200)
    paid = models.BooleanField(default=False)
    room = models.IntegerField(default=1)
    est_time = models.IntegerField(default=10)

    def __init__(self, *args, **kwargs):
        if 'room' not in kwargs:
            kwargs['room'] = random.randint(1, 5)
        if 'est_time' not in kwargs:
            kwargs['est_time'] = random.randint(10, 60)
        super().__init__(*args, **kwargs)
