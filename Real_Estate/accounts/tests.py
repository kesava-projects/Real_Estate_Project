from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase
from accounts.models import User
from properties.models import Property

class RealEstateAuthTests(APITestCase):

    def setUp(self):
        # Create different test users
        self.admin_user = User.objects.create_superuser(
            username='adminuser',
            email='admin@example.com',
            password='Password123!',
            role='ADMIN'
        )
        
        self.agent_user = User.objects.create_user(
            username='agentuser',
            email='agent@example.com',
            password='Password123!',
            role='AGENT'
        )
        
        self.buyer_user = User.objects.create_user(
            username='buyeruser',
            email='buyer@example.com',
            password='Password123!',
            role='BUYER'
        )

        # URLs
        self.register_url = reverse('register')
        self.login_url = reverse('token_obtain_pair')
        self.property_list_url = reverse('property-list')
        self.wishlist_url = reverse('wishlist-list')

    def test_registration_success(self):
        """Test user registration with secure password validation."""
        data = {
            "username": "newuser",
            "email": "newuser@example.com",
            "password": "SecurePassword123!",
            "phone": "1234567890",
            "role": "BUYER"
        }
        response = self.client.post(self.register_url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data["message"], "Registered Successfully")

    def test_registration_fails_weak_password(self):
        """Test registration fails when password does not meet security rules."""
        data = {
            "username": "newuser2",
            "email": "newuser2@example.com",
            "password": "123",  # Weak password
            "role": "BUYER"
        }
        response = self.client.post(self.register_url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("password", response.data)

    def test_login_jwt_token_obtain(self):
        """Test standard JWT login returns tokens."""
        data = {
            "username": "buyeruser",
            "password": "Password123!"
        }
        response = self.client.post(self.login_url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn("access", response.data)
        self.assertIn("refresh", response.data)

    def test_list_properties_anonymous(self):
        """Verify anyone can view property listings."""
        response = self.client.get(self.property_list_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_create_property_anonymous_fails(self):
        """Verify anonymous users cannot create property listings."""
        data = {
            "title": "Unauthenticated House",
            "description": "Test description",
            "price": "500000.00",
            "property_type": "HOUSE",
            "listing_type": "BUY",
            "bedrooms": 3,
            "bathrooms": 2,
            "area_sqft": "1500.00",
            "address": "123 Test St",
            "city": "Test City",
            "state": "Test State",
            "pincode": "12345"
        }
        response = self.client.post(self.property_list_url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_create_property_buyer_fails(self):
        """Verify BUYER cannot create property listings."""
        self.client.force_authenticate(user=self.buyer_user)
        data = {
            "title": "Buyer House Attempt",
            "description": "Should fail",
            "price": "450000.00",
            "property_type": "APARTMENT",
            "listing_type": "RENT",
            "bedrooms": 2,
            "bathrooms": 1,
            "area_sqft": "950.00",
            "address": "456 Main St",
            "city": "Test City",
            "state": "Test State",
            "pincode": "12345"
        }
        response = self.client.post(self.property_list_url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_create_property_agent_success(self):
        """Verify AGENT can create property listings and is automatically set as the agent."""
        self.client.force_authenticate(user=self.agent_user)
        data = {
            "title": "Beautiful Villa",
            "description": "Luxurious villa in prime location",
            "price": "1200000.00",
            "property_type": "VILLA",
            "listing_type": "BUY",
            "bedrooms": 4,
            "bathrooms": 4,
            "area_sqft": "3200.00",
            "address": "789 Rich Ave",
            "city": "Beverly Hills",
            "state": "California",
            "pincode": "90210"
        }
        response = self.client.post(self.property_list_url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data["title"], "Beautiful Villa")
        # Verify the agent was set to the authenticated agent user
        self.assertEqual(response.data["agent"]["username"], self.agent_user.username)

    def test_wishlist_restricted_to_owner(self):
        """Verify users can only see their own wishlist items."""
        # Create a property listing to add
        prop = Property.objects.create(
            title="Wishlist House",
            description="Nice view",
            price=250000.00,
            property_type="HOUSE",
            listing_type="BUY",
            bedrooms=2,
            bathrooms=1,
            area_sqft=1000,
            address="123 Cozy Lane",
            city="Comfort City",
            state="Cozy State",
            pincode="33333",
            agent=self.agent_user
        )

        # Authenticate buyer 1 and add property to wishlist
        self.client.force_authenticate(user=self.buyer_user)
        data = {"property": prop.id}
        response = self.client.post(self.wishlist_url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

        # Authenticate buyer 2 (who has an empty wishlist)
        buyer2 = User.objects.create_user(
            username='buyer2',
            email='buyer2@example.com',
            password='Password123!',
            role='BUYER'
        )
        self.client.force_authenticate(user=buyer2)
        
        # Buyer 2 requests their wishlist
        response = self.client.get(self.wishlist_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 0)  # Should not see buyer 1's wishlist item
