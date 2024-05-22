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
    room = models.IntegerField(default=lambda: random.randint(1, 5))
    est_time = models.IntegerField(default=lambda: random.randint(10, 60))

    def __str__(self):
        return f"{self.user} - {self.date} at {self.hour}"