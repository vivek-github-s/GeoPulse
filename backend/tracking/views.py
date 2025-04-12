from rest_framework import viewsets, generics, permissions
from .models import Location
from .serializers import LocationSerializer
from rest_framework.permissions import IsAuthenticated


class LocationViewSet(viewsets.ModelViewSet):
    queryset = Location.objects.all()  # ✅ Add this line
    serializer_class = LocationSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Location.objects.filter(user=self.request.user).order_by('-timestamp')

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)