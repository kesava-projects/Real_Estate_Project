from django.test import TestCase
from rest_framework.test import APIClient

from accounts.models import User
from properties.models import Property
from contacts.models import ContactRequest, ContactReply


class ContactRequestTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.agent = User.objects.create_user(
            username="agent1",
            email="agent1@test.com",
            password="AgentPass123!",
            role="AGENT",
        )
        self.buyer = User.objects.create_user(
            username="buyer1",
            email="buyer1@test.com",
            password="BuyerPass123!",
            role="BUYER",
        )
        self.other_agent = User.objects.create_user(
            username="agent2",
            email="agent2@test.com",
            password="AgentPass123!",
            role="AGENT",
        )
        self.property = Property.objects.create(
            title="Test Villa",
            description="A test property",
            price=1000000,
            property_type="VILLA",
            listing_type="BUY",
            bedrooms=3,
            bathrooms=2,
            area_sqft=1500,
            address="123 Test St",
            city="Hyderabad",
            state="Telangana",
            pincode="500001",
            agent=self.agent,
        )

    def test_buyer_request_visible_to_listing_agent(self):
        self.client.force_authenticate(user=self.buyer)
        response = self.client.post(
            "/contacts/",
            {"property": self.property.id, "message": "Interested in viewing."},
            format="json",
        )
        self.assertEqual(response.status_code, 201)

        self.client.force_authenticate(user=self.agent)
        response = self.client.get("/contacts/")
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]["message"], "Interested in viewing.")
        self.assertEqual(response.data[0]["user_email"], self.buyer.email)

    def test_agent_does_not_see_other_agents_inquiries(self):
        ContactRequest.objects.create(
            user=self.buyer,
            property=self.property,
            message="Private inquiry",
        )

        self.client.force_authenticate(user=self.other_agent)
        response = self.client.get("/contacts/")
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.data), 0)

    def test_agent_cannot_send_contact_request(self):
        self.client.force_authenticate(user=self.agent)
        response = self.client.post(
            "/contacts/",
            {"property": self.property.id, "message": "Self message"},
            format="json",
        )
        self.assertEqual(response.status_code, 403)

    def test_agent_can_reply_and_buyer_can_see_reply(self):
        contact = ContactRequest.objects.create(
            user=self.buyer,
            property=self.property,
            message="Can you share more photos?",
        )

        self.client.force_authenticate(user=self.agent)
        response = self.client.post(
            f"/contacts/{contact.id}/reply/",
            {"body": "Sure, I will upload them today."},
            format="json",
        )
        self.assertEqual(response.status_code, 201)
        self.assertEqual(len(response.data["replies"]), 1)
        self.assertEqual(response.data["replies"][0]["body"], "Sure, I will upload them today.")
        self.assertEqual(ContactReply.objects.count(), 1)

        self.client.force_authenticate(user=self.buyer)
        response = self.client.get("/contacts/")
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(len(response.data[0]["replies"]), 1)
        self.assertEqual(response.data[0]["replies"][0]["sender_username"], self.agent.username)

    def test_buyer_can_reply_back_to_agent(self):
        contact = ContactRequest.objects.create(
            user=self.buyer,
            property=self.property,
            message="I am available this weekend.",
        )

        self.client.force_authenticate(user=self.agent)
        response = self.client.post(
            f"/contacts/{contact.id}/reply/",
            {"body": "Saturday 11 AM works for me."},
            format="json",
        )
        self.assertEqual(response.status_code, 201)

        self.client.force_authenticate(user=self.buyer)
        response = self.client.post(
            f"/contacts/{contact.id}/reply/",
            {"body": "Confirmed, see you then."},
            format="json",
        )
        self.assertEqual(response.status_code, 201)
        self.assertEqual(len(response.data["replies"]), 2)

    def test_other_agent_cannot_reply_to_unrelated_request(self):
        contact = ContactRequest.objects.create(
            user=self.buyer,
            property=self.property,
            message="Is this still available?",
        )

        self.client.force_authenticate(user=self.other_agent)
        response = self.client.post(
            f"/contacts/{contact.id}/reply/",
            {"body": "I should not be allowed."},
            format="json",
        )
        self.assertEqual(response.status_code, 404)
