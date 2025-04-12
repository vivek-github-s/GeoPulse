from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework.exceptions import AuthenticationFailed
from rest_framework_simplejwt.tokens import UntypedToken
from rest_framework_simplejwt.exceptions import TokenError

class CustomJWTAuthentication(JWTAuthentication):

    def authenticate(self, request):
        header = self.get_header(request)
        if header is None:
            return None

        raw_token = self.get_raw_token(header)
        if raw_token is None:
            return None

        try:
            UntypedToken(raw_token)  # Verifies token's signature, expiration, etc.
        except TokenError as e:
            raise AuthenticationFailed(str(e))

        validated_token = self.get_validated_token(raw_token)
        return self.get_user(validated_token), validated_token
