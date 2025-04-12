import json
from channels.generic.websocket import AsyncWebsocketConsumer
from asgiref.sync import sync_to_async
from .models import Location
from channels.db import database_sync_to_async
from rest_framework_simplejwt.tokens import UntypedToken
from rest_framework_simplejwt.exceptions import InvalidToken
from django.contrib.auth.models import AnonymousUser
from django.contrib.auth import get_user_model
from urllib.parse import parse_qs

@database_sync_to_async
def get_user_from_token(token):
    try:
        valid_data = UntypedToken(token)
        user_id = valid_data["user_id"]
        if not user_id:
            return AnonymousUser()
        return get_user_model().objects.get(id=user_id)
    except:
        return AnonymousUser()

class TrackingConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        query_string = self.scope["query_string"].decode()
        print("String", query_string)
        token = parse_qs(query_string).get("token", [None])[0]
        print("token", token)
        self.user = await get_user_from_token(token)
        print("user", self.user)

        if self.user.is_authenticated:
            await self.channel_layer.group_add("tracker", self.channel_name)
            await self.accept()
        else:
            await self.close()

    async def disconnect(self, close_code):
        await self.channel_layer.group_discard("tracker", self.channel_name)

    async def receive(self, text_data):
        data = json.loads(text_data)
        user_id = data['user_id']
        lat = data['latitude']
        lon = data['longitude']

        await self.save_location(user_id, lat, lon)

        await self.channel_layer.group_send(
            "tracker",
            {
                "type": "send_location",
                "message": data
            }
        )

    async def send_location(self, event):
        await self.send(text_data=json.dumps(event["message"]))

    @sync_to_async
    def save_location(self, user, lat, lon):
        Location.objects.create(user=user, latitude=lat, longitude=lon)