from django.urls import path, re_path
#from . import views
from api.views import *

urlpatterns = [
    path('register', register),
    path('login', login),
    path('test-token', test_token),
    path('token', CustomTokenObtainPairView.as_view()),
    
    path('specialities/', getSpecialties),
    path('doctors/<str:specialty>', getDoctorsBySpecialty),
    path('set-appointment', createAppointment),
    path('waiting-room', waitingRoom),
    path('profile', getProfile),
    path('recognition', faceRecognition),
    path('finish-appointment/<int:id>', finishAppointment),
    path('payment/<int:id>', payment),
    
    ### ---
    path('populate-doctors', populate_doctors),
]