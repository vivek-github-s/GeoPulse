from django.urls import path
from .views import LocationCreateView, LocationHistoryView

urlpatterns = [
    path('location/', LocationCreateView.as_view(), name='location-create'),
    path('history/', LocationHistoryView.as_view(), name='location-history'),
]
