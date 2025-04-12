from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/tracking/', include('tracking.urls')),
    path('api/auth/', include('user_auth.urls')),
]
