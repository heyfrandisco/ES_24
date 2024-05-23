from django.urls import path, re_path
#from . import views
from api.views import *
from rest_framework_swagger.views import get_swagger_view
from drf_yasg.views import get_schema_view
from drf_yasg import openapi
from rest_framework import permissions

schema_view = get_schema_view(
    openapi.Info(
        title="Fisiocare API",
        default_version='v1',
        description="API for Fisiocare",
    ),
    public=True,
    permission_classes=(permissions.AllowAny,),
)

urlpatterns = [
    path('swagger/', schema_view.with_ui('swagger', cache_timeout=0), name='schema-swagger-ui'),
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