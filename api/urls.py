from django.urls import path, re_path
#from . import views
from api.views import *

urlpatterns = [
    path('register', register),
    path('login', login),
    path('test_token', test_token),
    path('token', CustomTokenObtainPairView.as_view()),
    
    path('specialities/', getSpecialties),
    path('doctors/<str:specialty>', getDoctorsBySpecialty),
    path('set-appointment', createAppointment),
    path('profile', getProfile),
]