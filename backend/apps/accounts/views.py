import random
import re
from datetime import timedelta
from django.utils import timezone
from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework_simplejwt.tokens import RefreshToken
from .models import User, Address, MobileOTP
from .serializers import (
    CustomTokenObtainPairSerializer,
    UserRegistrationSerializer,
    UserSerializer,
    AddressSerializer,
)
from .permissions import IsStoreManager


class CustomLoginView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer


class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserRegistrationSerializer
    permission_classes = [permissions.AllowAny]


class UserProfileView(generics.RetrieveUpdateAPIView):
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        return self.request.user


class AddressListCreateView(generics.ListCreateAPIView):
    serializer_class = AddressSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Address.objects.filter(user=self.request.user)


class AddressDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = AddressSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Address.objects.filter(user=self.request.user)


# Admin-facing User Management
class AdminUserListView(generics.ListAPIView):
    serializer_class = UserSerializer
    permission_classes = [IsStoreManager]
    queryset = User.objects.all().order_by('-created_at')


class SendOTPView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        phone = request.data.get('phone', '').strip()
        if not phone:
            return Response({"error": "Mobile phone number is required."}, status=status.HTTP_400_BAD_REQUEST)

        clean_digits = re.sub(r'\D', '', phone)
        if len(clean_digits) < 10:
            return Response({"error": "Please provide a valid 10-digit mobile number."}, status=status.HTTP_400_BAD_REQUEST)

        # Generate 6-digit OTP
        otp_code = str(random.randint(100000, 999999))
        expires_at = timezone.now() + timedelta(minutes=10)

        MobileOTP.objects.create(
            phone=phone,
            otp_code=otp_code,
            expires_at=expires_at
        )

        # In production this connects to SMS/WhatsApp gateway (e.g. Twilio / Gupshup / Fast2SMS)
        return Response({
            "message": "Royal OTP dispatched to your mobile number.",
            "phone": phone,
            "otp_preview": otp_code,
            "expires_in_seconds": 600,
        })


class VerifyOTPView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        phone = request.data.get('phone', '').strip()
        otp_code = request.data.get('otp_code', '').strip()

        if not phone or not otp_code:
            return Response({"error": "Phone and 6-digit OTP code are required."}, status=status.HTTP_400_BAD_REQUEST)

        otp_record = MobileOTP.objects.filter(
            phone=phone,
            otp_code=otp_code,
            is_used=False,
            expires_at__gte=timezone.now()
        ).first()

        if not otp_record:
            return Response({"error": "Invalid or expired OTP. Please request a new code."}, status=status.HTTP_400_BAD_REQUEST)

        otp_record.is_used = True
        otp_record.save(update_fields=['is_used'])

        # Find or create user
        user = User.objects.filter(phone=phone).first()
        if not user:
            clean_digits = re.sub(r'\D', '', phone)
            email = f"user_{clean_digits}@rumeraluxury.com"
            user, created = User.objects.get_or_create(
                email=email,
                defaults={
                    'phone': phone,
                    'first_name': 'Connoisseur',
                    'role': User.Role.CUSTOMER,
                }
            )

        refresh = RefreshToken.for_user(user)
        return Response({
            "access": str(refresh.access_token),
            "refresh": str(refresh),
            "user": UserSerializer(user).data,
            "message": "Welcome to Maison Rumera."
        })
