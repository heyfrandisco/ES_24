from django.urls import path
from. import views

urlpatterns = [
    path('getusers/', views.getUsers),
    path('adduser/', views.addUser),
    path('adddoctor/', views.addDoctor),
    path('addappointment/', views.addAppointment),
]