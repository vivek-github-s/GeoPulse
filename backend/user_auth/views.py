from rest_framework import viewsets, generics, permissions, status
from rest_framework.views import APIView
from django.contrib.auth.models import User
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken
from django.utils.http import urlsafe_base64_decode, urlsafe_base64_encode
from django.utils.encoding import force_bytes, force_str
from django.contrib.auth.tokens import default_token_generator
from django.core.mail import send_mail

from .serializers import (
UserRegisterSerializer,
    UserProfileUpdateSerializer,
    ChangePasswordSerializer,
    ResetPasswordConfirmSerializer
)

class UserProfileView(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        user = request.user
        user_data = {
            'username': user.username,
            'email': user.email,
            'first_name': user.first_name,
            'last_name': user.last_name,
            'last_login': user.last_login.strftime("%d %b %Y, %I:%M %p") if user.last_login else None,
            'date_joined': user.date_joined.strftime("%d %b %Y, %I:%M %p") if user.date_joined else None,
        }
        return Response(user_data)

    def patch(self, request):
        serializer = UserProfileUpdateSerializer(request.user, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response({"detail": "Profile updated successfully."})
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class LogoutView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        # Get refresh token from request
        refresh_token = request.data.get("refresh")
        try:
            token = RefreshToken(refresh_token)
            # Blacklist the refresh token
            token.blacklist()
            return Response({"detail": "Successfully logged out."}, status=200)
        except Exception as e:
            return Response({"detail": "Invalid token."}, status=400)

class RegisterUserView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserRegisterSerializer

class ChangePasswordView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        serializer = ChangePasswordSerializer(data=request.data)
        user = request.user
        if serializer.is_valid():
            if not user.check_password(serializer.validated_data['old_password']):
                return Response({'old_password': ['Wrong password.']}, status=400)
            user.set_password(serializer.validated_data['new_password'])
            user.save()
            return Response({'detail': 'Password updated successfully.'})
        return Response(serializer.errors, status=400)

class RequestResetPasswordView(APIView):
    def post(self, request):
        email = request.data.get('email')

        if not email:
            return Response(
                {"detail": "Email is required."},
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            user = User.objects.get(email=email)

            if not user.is_active:
                return Response(
                    {"detail": "This account is inactive."},
                    status=status.HTTP_400_BAD_REQUEST
                )

            token = default_token_generator.make_token(user)
            uid = urlsafe_base64_encode(force_bytes(user.pk))
            reset_url = f"http://your-frontend.com/reset-password/{uid}/{token}/"

            send_mail(
                subject="Reset Your Password",
                message=f"Click the link to reset your password:\n{reset_url}",
                from_email="no-reply@example.com",
                recipient_list=[user.email],
            )

        except User.DoesNotExist:
            # Don't reveal whether the email exists
            pass

        return Response(
            {"detail": "If the email exists, a reset link has been sent."},
            status=status.HTTP_200_OK
        )


class ResetPasswordConfirmView(APIView):
    def post(self, request):
        serializer = ResetPasswordConfirmSerializer(data=request.data)
        if serializer.is_valid():
            try:
                uid = force_str(urlsafe_base64_decode(serializer.validated_data['uid']))
                user = User.objects.get(pk=uid)
                token = serializer.validated_data['token']
                if default_token_generator.check_token(user, token):
                    user.set_password(serializer.validated_data['new_password'])
                    user.save()
                    return Response({"detail": "Password reset successful."})
                else:
                    return Response({"detail": "Invalid token."}, status=400)
            except (User.DoesNotExist, ValueError):
                return Response({"detail": "Invalid link."}, status=400)
        return Response(serializer.errors, status=400)