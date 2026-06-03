import os

from django.apps import AppConfig
from django.db.models.signals import post_migrate
from django.db.utils import OperationalError, ProgrammingError


class AccountsConfig(AppConfig):
    default_auto_field = "django.db.models.BigAutoField"
    name = "accounts"

    def ready(self):
        post_migrate.connect(
            self._sync_google_social_app_after_migrate,
            dispatch_uid="accounts.sync_google_social_app",
        )

    @staticmethod
    def _sync_google_social_app_after_migrate(sender, **kwargs):
        try:
            AccountsConfig._ensure_google_social_app()
        except (OperationalError, ProgrammingError):
            pass

    @staticmethod
    def _ensure_google_social_app():
        from django.contrib.sites.models import Site
        from allauth.socialaccount.models import SocialApp

        client_id = os.getenv("GOOGLE_CLIENT_ID")
        secret = os.getenv("GOOGLE_SECRET")
        if not client_id or not secret:
            return

        try:
            site = Site.objects.get_current()
        except Site.DoesNotExist:
            site = Site.objects.create(
                id=1,
                domain="localhost",
                name="localhost",
            )
        app, _created = SocialApp.objects.update_or_create(
            provider="google",
            defaults={
                "name": "Google",
                "client_id": client_id,
                "secret": secret,
            },
        )
        if not app.sites.filter(pk=site.pk).exists():
            app.sites.add(site)
