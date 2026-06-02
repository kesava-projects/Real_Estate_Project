from django.core.management.base import BaseCommand

from accounts.apps import AccountsConfig


class Command(BaseCommand):
    help = "Create or update the Google SocialApp in the database from .env credentials."

    def handle(self, *args, **options):
        AccountsConfig._ensure_google_social_app()
        self.stdout.write(self.style.SUCCESS("Google SocialApp is configured."))
