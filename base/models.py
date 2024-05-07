from django.db import models

# Create your models here.
class Doctor(models.Model):
    name = models.CharField(max_length=200)
    speciality = models.CharField(max_length=200)

class Appointment(models.Model):
    room = models.CharField(max_length=200)
    date = models.DateField()
    doctor = models.OneToOneField(Doctor, on_delete=models.CASCADE)
    speciality = models.CharField(max_length=200)

class User(models.Model):
    username = models.CharField(max_length=200)
    password = models.CharField(max_length=200)
    email = models.CharField(max_length=200)
    appointments = models.ManyToManyField(Appointment)



