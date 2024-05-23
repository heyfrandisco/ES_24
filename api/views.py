from rest_framework import status
from rest_framework.response import Response
from rest_framework.decorators import api_view, authentication_classes, permission_classes
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework.permissions import IsAuthenticated
from rest_framework.permissions import AllowAny
import jwt
import json
from django.utils import timezone
from datetime import datetime

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


# --- AWS VARIABLES ---
aws_access_key_id='ASIA5JCMZJ3FQC7ABUPX'
aws_secret_access_key='nwzQi4qlUjeYkumX3xu8cFmTtNCHidIx2VU12bDa'
aws_session_token='IQoJb3JpZ2luX2VjEAAaCXVzLXdlc3QtMiJIMEYCIQD3v0mro3weVUf+SPHv9b2yudvJbHwwwcMDuMpKRI2ECQIhAL3o0gnH1IOG6aSWEO3m15Jc3Vok3CtMrMtC3ybAOG8cKrQCCHkQAhoMOTEyODQxNTkyNTIzIgxRHi8/crfcf4+Qv84qkQJm7Kodt2jR7FPqU63isAwlgkJwUFixZy6yRQCktCXpnNrRnB2s9DVH+ouVy8r9MIyW7hGEcE27Tzah+64nzXkKWMKUWum5m46hGk6bTiNuYUgxqZ3j4nUVeq0/YoziZGRhs/DTvRq/WK4pcj8UJEz6IX2OT+4cEttvSJwK8siz4yR6JrXtDozjPGyCYnumrf/GzxyuUrXFSY76Vg2UXdbM4lJ3F7xhPdxLWUifG88b4dCykKUFJ+ay+HDUj0kP8Lu8la1BiFUwFz5i1/Jngwlaa67uh4RSe6Xu38f7DOnGz9b1rnmQ/pl8yOog6FwCHBW+Ohc14sorwNbuLa1hs9q0O4X7LpDhjsu5ZqJD9q4BzGEwg8e9sgY6nAEO8MZiJgnFgaVEJ1chkb2hFafE1fGiUTS8286JJBACiJZZr1w3xALap3KMpXEVZE7LVgpbj4Ze1w51jraoXX3GuC8Df3oQz9LsCknd6YrcXWx1FSDqL/mt5nH/y+/y1ip7A/r49r1/lfB4zfkOlTRiTQHiWbLd/2RMk+ZiZjWaArKsGXdI6cE0JecbG1s3Q/posK2IYJ3Gegm7v5o='

sf_arn = 'arn:aws:states:us-east-1:912841592523:stateMachine:appointment_handler'

bucket_name = 'facereconbuck'
# ----------------


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
    print(request.data)
    serializer = UserSerializer(data=request.data)
    
    if serializer.is_valid():
        print('entrou')
        user = serializer.save()
        user.set_password(request.data['password'])
        user.save()

        return Response({"User Created"},status=status.HTTP_201_CREATED)
    
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
def createAppointment(request):
    date = request.data.get('date')
    hour = request.data.get('hour')
    speciality = request.data.get('speciality')
    doctor = request.data.get('doctor')

    if not (date and hour and speciality and doctor):
        return Response({"detail": "All fields are required."}, status=status.HTTP_400_BAD_REQUEST)

    if len(hour.split(':')) == 2:
        hour = f"{hour}:00"

    appointment_data = {
        'date': date,
        'hour': hour,
        'speciality': speciality,
        'doctor': doctor
    }

    serializer = AppointmentSerializer(data=appointment_data, context={'request': request})
    if serializer.is_valid():
        appointment_instance = serializer.save()

        dynamodb = boto3.resource(
            'dynamodb', 
            aws_access_key_id=aws_access_key_id,
            aws_secret_access_key=aws_secret_access_key,
            aws_session_token=aws_session_token,
            region_name='us-east-1'
        )
        
        table = dynamodb.Table('appointments')

        dynamodb_response = table.put_item(
            Item={
                'appointment_id': str(appointment_instance.id),
                'paid': False
            }
        )
        
        step = boto3.client(
            'stepfunctions', 
            aws_access_key_id=aws_access_key_id,
            aws_secret_access_key=aws_secret_access_key,
            aws_session_token=aws_session_token,
            region_name='us-east-1'
        )
        
        try:
            response = step.start_execution(
                stateMachineArn=sf_arn,
                input=json.dumps({'appointment_id': appointment_instance.id})
            )
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def test_token(request):
    return Response("passed for {}".format(request.user.email))


@api_view(['GET'])
def getSpecialties(request):
    specialties = Doctor.objects.values_list('speciality', flat=True).distinct()

    return Response({"Specialties":specialties})


@api_view(['POST'])
@permission_classes([AllowAny])
def payment(request, id):
    try:
        app = Appointment.objects.get(id=id)
        
        app.paid = True
        app.state = "Scheduled"
        app.save()
        
        dynamodb = boto3.resource(
            'dynamodb', 
            aws_access_key_id=aws_access_key_id,
            aws_secret_access_key=aws_secret_access_key,
            aws_session_token=aws_session_token,
            region_name='us-east-1'
        )
        
        table = dynamodb.Table('appointments')
        
        response = table.update_item(
            Key={
                'appointment_id': str(id)
            },
            UpdateExpression="set paid = :p",
            ExpressionAttributeValues={
                ':p': True
            },
            ReturnValues="UPDATED_NEW"
        )
        
        return Response({"detail": "Appointment Paid"}, status=status.HTTP_200_OK)
    
    except Appointment.DoesNotExist:
        return Response({'detail': 'Appointment not found'}, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        return Response({'detail': 'Could not pay appointment', 'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['POST'])
def finishAppointment(request, id):
    try:
        app = Appointment.objects.get(id=id)
        
        app.arrived = False
        app.finished = True
        app.state = "Finished"
        app.save()
        
        return Response({"Appointment Closed"}, status=status.HTTP_200_OK)
    
    except Exception as e:
            return Response({'detail': 'Could not close appointment', 'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


from boto3.dynamodb.conditions import Key

@api_view(['GET'])
@permission_classes([AllowAny])
def waitingRoom(request):
    try:
        apps = Appointment.objects.filter(arrived=True)

        dynamodb = boto3.resource(
            'dynamodb', 
            aws_access_key_id=aws_access_key_id,
            aws_secret_access_key=aws_secret_access_key,
            aws_session_token=aws_session_token,
            region_name='us-east-1'
        )

        table = dynamodb.Table('appointments')

        appointment_data = []
        for appointment in apps:
            user_username = appointment.user.username if appointment.user else None
            
            response = table.get_item(
                Key={'appointment_id': str(appointment.id)}
            )
            paid_status = response.get('Item', {}).get('paid', False)
            
            if paid_status:
                appointment_data.append({
                    'id': appointment.id,
                    'user_username': user_username,
                    'date': appointment.date,
                    'hour': appointment.hour,
                    'speciality': appointment.speciality,
                    'doctor': appointment.doctor,
                    'paid': paid_status,
                    'room': appointment.room,
                    'est_time': appointment.est_time
                })

        return Response({'appointments': appointment_data}, status=status.HTTP_200_OK)
        
    except Exception as e:
        return Response({'detail': 'Could not fetch appointments', 'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['GET'])
def getDoctorsBySpecialty(request, specialty):
    doctors = Doctor.objects.filter(speciality=specialty)
    serializer = DoctorSerializer(doctors, many=True)

    return Response({"doctors":serializer.data})


@api_view(['GET'])
def getProfile(request):
    user = request.user

    try:
        user = User.objects.get(id=user.id)
    except User.DoesNotExist:
        return Response({"detail": "User not found."}, status=status.HTTP_404_NOT_FOUND)

    user_serializer = UserSerializer(user)

    appointments = Appointment.objects.filter(user_id=user.id)

    appointment_serializer = AppointmentSerializer(appointments, many=True)

    return Response({
        "user": user_serializer.data,
        "appointments": appointment_serializer.data
    }, status=status.HTTP_200_OK)



@api_view(['POST'])
@permission_classes([IsAuthenticated])
def faceRecognition(request):
    rekognition = boto3.client(
        'rekognition',
        aws_access_key_id=aws_access_key_id,
        aws_secret_access_key=aws_secret_access_key,
        aws_session_token=aws_session_token,
        region_name='us-east-1'
    )

    s3 = boto3.resource(
        's3',
        aws_access_key_id=aws_access_key_id,
        aws_secret_access_key=aws_secret_access_key,
        aws_session_token=aws_session_token,
        region_name='us-east-1'
    )


    bucket = s3.Bucket(bucket_name)

    target = request.data.get('img')

    #treat the image
    target = target.split(',')[1]


    authorized = False

    for i in bucket.objects.all():
        path, filename = os.path.split(i.key)
        img = bucket.Object(filename)
        
        resp = rekognition.compare_faces(
            SimilarityThreshold=75,
            SourceImage={'Bytes': img.get()['Body'].read()},
            TargetImage={'Bytes': base64.b64decode(target)}
        )

        
        
        for match in resp['FaceMatches']:
            if match['Similarity'] > 75:
                authorized = True
                break
        
        if authorized:
            break
            
    print(authorized)
    if authorized:
        try:
            user = request.user
            print(user)
            #get time now
            now = datetime.now()
            now_date = now.strftime('%Y-%m-%d')
            now_time = now.strftime('%H:%M:%S')
            
            #get the closest of the day the user is in and mark as arrived
            appointment = Appointment.objects.filter(user=user.id, date=now_date).order_by('hour').first()
            if appointment:
                appointment.arrived = True
                appointment.save()
                
                return Response({'AUTH': True, 'message': 'Arrival marked successfully.'}, status=status.HTTP_200_OK)
            else:
                return Response({'AUTH': False, 'error': 'No upcoming appointments found.'}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({'AUTH': False, 'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    else:
        return Response({'AUTH': False, 'error': 'Face not recognized.'}, status=status.HTTP_401_UNAUTHORIZED)
    
    
    
    
### ---
@api_view(['POST'])
def populate_doctors(request):
    doctor_data = [
        {'name': 'João Pratas ', 'speciality': 'Fisioterapia Respiratória'},
        {'name': 'Carlos Martins ', 'speciality': 'Fisioterapia Respiratória'},
        {'name': 'Ricardo Pacheco ', 'speciality': 'Recuperação Muscular'},
        {'name': 'Renato Gonçalves', 'speciality': 'Recuperação Muscular'},
        {'name': 'Pedro Pereira', 'speciality': 'Fisioterapia Desportiva'},
        {'name': 'Gonçalo Almeida', 'speciality': 'Fisioterapia Desportiva'},
        {'name': 'Paulo Castro', 'speciality': 'Fisioterapia Geriátrica'},
        {'name': 'Nuno Santos', 'speciality': 'Fisioterapia Geriátrica'},
    ] 
    
    created_count = 0
    errors = []

    for data in doctor_data:
        serializer = DoctorSerializer(data=data)
        if serializer.is_valid():
            serializer.save()
            created_count += 1
        else:
            errors.append(serializer.errors)

    if created_count > 0:
        return Response({"message": f"Successfully created {created_count} doctors."}, status=status.HTTP_201_CREATED)
    else:
        return Response({"errors": errors}, status=status.HTTP_400_BAD_REQUEST)