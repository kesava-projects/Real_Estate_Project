from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import ContactRequest, ContactReply
from .serializer import ContactRequestSerializer, ContactReplyCreateSerializer

class ContactRequestViewSet(viewsets.ModelViewSet):
    """
    ViewSet for Property buyers to submit contact requests to Agents.
    Enforces role-based query isolation:
    - Buyers see only request they made.
    - Agents see only requests regarding properties they represent.
    - Admins see all.
    """
    serializer_class = ContactRequestSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        
        if user.role == 'ADMIN':
            return ContactRequest.objects.select_related(
                'user', 'property', 'property__agent'
            ).prefetch_related('replies__sender').order_by('-created_at')
            
        if user.role == 'AGENT':
            # View requests for properties that belong to this agent
            return ContactRequest.objects.filter(property__agent=user).select_related(
                'user', 'property', 'property__agent'
            ).prefetch_related('replies__sender').order_by('-created_at')
            
        # Default: Buyers/Users see only requests they submitted
        return ContactRequest.objects.filter(user=user).select_related(
            'user', 'property', 'property__agent'
        ).prefetch_related('replies__sender').order_by('-created_at')

    def create(self, request, *args, **kwargs):
        if request.user.role != 'BUYER':
            return Response(
                {"error": "Only buyers can send contact requests."},
                status=status.HTTP_403_FORBIDDEN,
            )
        return super().create(request, *args, **kwargs)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    def destroy(self, request, *args, **kwargs):
        # Restrict deletions to sender, agent of property, or admin
        obj = self.get_object()
        user = request.user
        
        if user.role == 'ADMIN' or obj.user == user or obj.property.agent == user:
            return super().destroy(request, *args, **kwargs)
            
        return Response(
            {"error": "You do not have permission to delete this contact request."},
            status=status.HTTP_403_FORBIDDEN
        )

    @action(detail=True, methods=['post'])
    def reply(self, request, pk=None):
        contact = self.get_object()
        user = request.user

        can_reply = (
            user.role == 'ADMIN'
            or contact.user == user
            or (user.role == 'AGENT' and contact.property.agent == user)
        )

        if not can_reply:
            return Response(
                {"error": "You do not have permission to reply to this request."},
                status=status.HTTP_403_FORBIDDEN,
            )

        serializer = ContactReplyCreateSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        ContactReply.objects.create(
            contact=contact,
            sender=user,
            body=serializer.validated_data['body'],
        )

        updated_contact = ContactRequest.objects.select_related(
            'user', 'property', 'property__agent'
        ).prefetch_related('replies__sender').get(pk=contact.pk)

        return Response(ContactRequestSerializer(updated_contact).data, status=status.HTTP_201_CREATED)
