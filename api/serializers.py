from rest_framework import serializers
from base.models import *
from django.contrib.auth.models import User
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer


class CustomTokenSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)

        token['id'] = user.id
        token['username'] = user.username
        token['email'] = user.email

        return token


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'password', 'email']
        extra_kwargs = {'password': {'write_only': True}}


class DoctorSerializer(serializers.ModelSerializer):
    class Meta:
        model = Doctor
        fields = ['id', 'name', 'speciality']


class AppointmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Appointment
        fields = ['id', 'user', 'date', 'hour', 'speciality', 'doctor', 'paid', 'room', 'est_time', 'finished', 'arrived', 'state']
        read_only_fields = ['user', 'room', 'est_time']

    def create(self, validated_data):
        request = self.context.get('request')
        user = request.user if request else None
        validated_data['user'] = user
        if 'room' not in validated_data:
            validated_data['room'] = random.randint(1, 5)
        if 'est_time' not in validated_data:
            validated_data['est_time'] = random.randint(10, 60)
        return super().create(validated_data)
