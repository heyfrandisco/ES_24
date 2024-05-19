from rest_framework import status
from rest_framework.response import Response
from rest_framework.decorators import api_view, authentication_classes, permission_classes
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework.permissions import IsAuthenticated
from rest_framework.permissions import AllowAny

from django.contrib.auth.models import User
from django.shortcuts import get_object_or_404

from rest_framework.decorators import authentication_classes, permission_classes
from rest_framework.authentication import SessionAuthentication, TokenAuthentication
from rest_framework.permissions import IsAuthenticated

from base.models import *
from .serializers import *

import boto3, os, base64


class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = CustomTokenSerializer


@api_view(['POST'])
@permission_classes([AllowAny])
def login(request):
    user = get_object_or_404(User, username=request.data['username'])
    if not user.check_password(request.data['password']):
        return Response({"detail": "Not found."}, status=status.HTTP_404_NOT_FOUND)
    
    token = CustomTokenSerializer(data=request.data)
    serializer = UserSerializer(instance=user)

    if token.is_valid():
        return Response({"Token": token.validated_data, "user_data":serializer.data}, status=status.HTTP_200_OK)
    
    return Response(token.errors, status=status.HTTP_400_BAD_REQUEST)
    


@api_view(['POST'])
@permission_classes([AllowAny])
def register(request):
    serializer = UserSerializer(data=request.data)
    
    if serializer.is_valid():
        user = serializer.save()
        user.set_password(request.data['password'])
        user.save()

        token = CustomTokenSerializer(data=request.data)
        if token.is_valid():
            return Response(token.validated_data, status=status.HTTP_201_CREATED)
    
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def test_token(request):
    return Response("passed for {}".format(request.user.email))


@api_view(['GET'])
def getSpecialties(request):
    specialties = Doctor.objects.values_list('speciality', flat=True).distinct()

    return Response({"Specialties":specialties})


@api_view(['GET'])
def getDoctorsBySpecialty(request, specialty):
    doctors = Doctor.objects.filter(speciality=specialty)
    serializer = DoctorSerializer(doctors, many=True)

    return Response({"Doctors for specialty":serializer.data})


@api_view(['POST'])
def faceRecognition(request):
    rekognition = boto3.client(
        'rekognition',
        aws_access_key_id='',
        aws_secret_access_key='',
        aws_session_token='',
        region_name='us-east-1'
    )

    s3 = boto3.resource(
        's3',
        aws_access_key_id='',
        aws_secret_access_key='',
        aws_session_token='',
        region_name='us-east-1'
    )