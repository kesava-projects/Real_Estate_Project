"""
URL configuration for Real_Estate project.
"""
from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path('admin/', admin.site.urls),
    
    # Auth routing
    path('accounts/', include('accounts.urls')),
    path('accounts/', include('dj_rest_auth.urls')),
    path('accounts/', include('dj_rest_auth.registration.urls')),
    
    # Business API routing
    path('properties/', include('properties.urls')),
    path('wishlist/', include('wishlist.urls')),
    path('contacts/', include('contacts.urls')),
    path('reviews/', include('reviews.urls')),
]

# Serves uploaded property media assets locally in development mode
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
