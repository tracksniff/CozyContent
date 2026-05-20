from authlib.integrations.django_client import OAuth
from django.conf import settings

oauth = OAuth()

oauth.register(
    name='google',
    client_id=settings.AUTHLIB_OAUTH_CLIENTS['google']['client_id'],
    client_secret=settings.AUTHLIB_OAUTH_CLIENTS['google']['client_secret'],
    server_metadata_url=settings.AUTHLIB_OAUTH_CLIENTS['google']['server_metadata_url'],
    client_kwargs=settings.AUTHLIB_OAUTH_CLIENTS['google']['client_kwargs'],
)
