from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import LocationViewSet, RegisterUserView, UserProfileView

router = DefaultRouter()
router.register(r'locations', LocationViewSet)

urlpatterns = [
    path('', include(router.urls)),
    # path('location/', LocationViewSet.as_view(), name='location'),
    path('register/', RegisterUserView.as_view(), name='register'),
    path('user/', UserProfileView.as_view(), name='user-profile'),
]
