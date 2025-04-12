from django.db import models
from django.contrib.auth import get_user_model

class Location(models.Model):
    user = models.ForeignKey(get_user_model(), on_delete=models.CASCADE)
    latitude = models.FloatField()
    longitude = models.FloatField()
    timestamp = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user} @ ({self.latitude}, {self.longitude})"
