from rest_framework import status
from rest_framework.response import Response
from rest_framework.decorators import api_view, authentication_classes, permission_classes
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework.permissions import IsAuthenticated
from rest_framework.permissions import AllowAny
import jwt


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
aws_access_key_id = 'ASIA5JCMZJ3F6BMH2ZMR'
aws_secret_access_key = 'vvJGZVQgWJIfT6/4/VDusjzXJjcDGEt2GdlT0OLT'
aws_session_token = 'IQoJb3JpZ2luX2VjENP//////////wEaCXVzLXdlc3QtMiJGMEQCIGKKNcHACc18mh/qO1D5IvitQPZjpH+qiaGeGDU0Iyv5AiBsfnYQwlAP4S6GU47qNZoQ8IT/Lem++IVvqMNxYUcsLCq0AghMEAIaDDkxMjg0MTU5MjUyMyIMoVnps+s8BCzvC9mzKpECIK1S0Nl5YZEeHP5T8Jxe79RAM8FtWTwMXfqzzhTHgLtzUjwuU5zFPIujWed0Idw9BuPPptHe/5AgyfYLrCW35qWgEPTc8vZ28+lfx/ItbTcKOUxxUDGuo9Y1CW+kxhDyPUsxX1NnWOEvCpH1MWI+ZRKGwpJujXrgff3iHf7iH962vW2AcST2umq+f1ifEGN8KfgxybeOUefv/nS/05OgMVxlMor22eaPJKnVfg6E4++E23jf6vb+Xj5bXLUUaPV8v/bbSm/abvp/umN0TPnj7oaLHqnjihLX3qhWhH2aC/2Fv4a5jrXMouZelmsmyBv4qmr54x4O4DFgDvzaQwiMmc6MenllVihtf/3IDvJMW66VMInhs7IGOp4BVK4uJYgbqsEUkHplc6sCabu6N5sAdGh+vS2sPRW6wEeiQvZxuliBc1K/FIxhi4mXVFg/bMqcrjHogRd1wxEHHPfCWnfYJqaHZmEw2VZgb4UC8BxxF6qB0bCJOrP/B7mvTd/unqedM2pox2lEHk274vgoBBRwYDPYoxoDcCcAwgftU5W3/1kdKAmtaDP/i+2a3tUxRfjtbnlbTwM5/cY='

bucket_name = ''
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
        serializer.save()

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
                'appointment_id': appointment.id,
                'paid': False
            }
        )

        return Response(serializer.data, status=status.HTTP_201_CREATED)
    
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
def payment(request, id):
    try:
        app = Appointment.objects.get(id=id)
        
        app.paid = True
        app.state = "Scheduled"
        app.save()
        
        return Response({"Appointment Paid"}, status=status.HTTP_200_OK)
    
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


@api_view(['GET'])
def waitingRoom(request):
    try:
        apps = Appointment.objects.filter(arrived=True)
        
        serializer = AppointmentSerializer(apps, many=True)
        
        return Response({'appointments': serializer.data}, status=status.HTTP_200_OK)
        
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

    target = request.POST['image'].split(',')[1]

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
            authorized = True
            break
        
        if authorized:
            break
            
    if authorized:
        try:
            user = request.user
            now = timezone.now()

            closest_appointment = Appointment.objects.filter(user=user, date__gte=now.date()).order_by('date', 'hour').first()
            
            if closest_appointment:
                closest_appointment.arrived = True
                closest_appointment.save()
                
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