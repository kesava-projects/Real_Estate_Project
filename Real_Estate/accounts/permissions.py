from rest_framework import permissions

class IsAgentOrAdmin(permissions.BasePermission):
    """
    Allows write access only to agents and admins.
    """
    def has_permission(self, request, view):
        if not request.user or not request.user.is_authenticated:
            return False
        return request.user.role in ['AGENT', 'ADMIN']

class IsPropertyAgentOrAdmin(permissions.BasePermission):
    """
    Allows writing access only to the property's agent or admins.
    """
    def has_permission(self, request, view):
        return request.user and request.user.is_authenticated

    def has_object_permission(self, request, view, obj):
        if not request.user or not request.user.is_authenticated:
            return False
            
        if request.user.role == 'ADMIN':
            return True
            
        # If the object is a Property, check agent
        if hasattr(obj, 'agent'):
            return obj.agent == request.user
            
        # If the object is a PropertyImage, check the parent property's agent
        if hasattr(obj, 'property') and hasattr(obj.property, 'agent'):
            return obj.property.agent == request.user
            
        return False

class IsOwnerOrReadOnly(permissions.BasePermission):
    """
    Object-level permission to only allow owners of an object to edit it.
    Assumes the model instance has a `user` attribute.
    """
    def has_object_permission(self, request, view, obj):
        # Read permissions are allowed to any request,
        # so we'll always allow GET, HEAD or OPTIONS requests.
        if request.method in permissions.SAFE_METHODS:
            return True

        # Instance must have an attribute named `user`.
        if not request.user or not request.user.is_authenticated:
            return False
            
        return obj.user == request.user or request.user.role == 'ADMIN'
