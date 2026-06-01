from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import PropertyViewSet, PropertyImageViewSet

router = DefaultRouter()
router.register(r'listings', PropertyViewSet, basename='property')
router.register(r'images', PropertyImageViewSet, basename='propertyimage')

urlpatterns = [
    path('', include(router.urls)),
]
