from urllib.parse import parse_qs
from channels.middleware import BaseMiddleware
from django.contrib.auth.models import AnonymousUser
from rest_framework_simplejwt.tokens import AccessToken
from channels.db import database_sync_to_async
from django.contrib.auth import get_user_model

User = get_user_model()

@database_sync_to_async
def get_user(validated_token):
    try:
        user_id = validated_token['user_id']
        return User.objects.get(id=user_id)
    except User.DoesNotExist:
        return AnonymousUser()

class JWTAuthMiddleware(BaseMiddleware):
    async def __call__(self, scope, receive, send):
        print("inside Middleware")
        query_string = parse_qs(scope["query_string"].decode())
        print("Decoded string", query_string)
        token = query_string.get("token")
        print("token", token)
        if token:
            try:
                access_token = AccessToken(token[0])
                scope["user"] = await get_user(access_token)
            except Exception:
                scope["user"] = AnonymousUser()
        else:
            scope["user"] = AnonymousUser()

        return await super().__call__(scope, receive, send)
