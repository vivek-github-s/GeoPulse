from rest_framework import generics, permissions
from .models import Location
from .serializers import LocationSerializer
from rest_framework_simplejwt.authentication import JWTAuthentication

class LocationCreateView(generics.CreateAPIView):
    serializer_class = LocationSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

class LocationHistoryView(generics.ListAPIView):
    serializer_class = LocationSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Location.objects.filter(user=self.request.user)
