from decimal import Decimal
from django.test import TestCase
from django.urls import reverse
from rest_framework.test import APIClient
from rest_framework import status
from accounts.models import User
from catalog.models import Category, Product, ProductVariant
from cart.models import Cart, CartItem
from promotions.models import Coupon
from orders.models import Order


class CheckoutAndOrderTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.category = Category.objects.create(name="Attar", slug="attar")
        self.product = Product.objects.create(
            category=self.category,
            name="Royal Rose",
            slug="royal-rose",
            sku="RUM-TST-002",
            is_active=True
        )
        self.variant = ProductVariant.objects.create(
            product=self.product,
            volume_size="6 ml",
            sku="RUM-TST-002-6ML",
            price=Decimal("3000.00"),
            stock_quantity=5
        )

    def test_add_to_cart_and_checkout_flow(self):
        # 1. Add to cart
        session_key = "test-session-12345"
        cart_url = reverse('cart_add_item')
        response = self.client.post(
            cart_url,
            {'variant_id': self.variant.id, 'quantity': 2},
            HTTP_X_SESSION_KEY=session_key,
            format='json'
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['total_items'], 2)
        self.assertEqual(float(response.data['subtotal']), 6000.00)

        # 2. Checkout
        checkout_url = reverse('order_checkout')
        checkout_data = {
            'recipient_name': 'Test Customer',
            'phone': '9876543210',
            'email': 'customer@test.com',
            'address_line1': '123 Luxury Road',
            'city': 'Mumbai',
            'state': 'Maharashtra',
            'postal_code': '400001',
            'payment_method': 'COD'
        }
        checkout_resp = self.client.post(
            checkout_url,
            checkout_data,
            HTTP_X_SESSION_KEY=session_key,
            format='json'
        )
        self.assertEqual(checkout_resp.status_code, status.HTTP_201_CREATED)
        self.assertTrue(checkout_resp.data['order_number'].startswith('RUM-'))
        self.assertEqual(checkout_resp.data['status'], 'PAID')

        # 3. Verify variant stock decreased from 5 to 3
        self.variant.refresh_from_db()
        self.assertEqual(self.variant.stock_quantity, 3)

    def test_checkout_fails_on_insufficient_stock(self):
        session_key = "test-session-excess"
        # Try to add more than 5
        cart_url = reverse('cart_add_item')
        response = self.client.post(
            cart_url,
            {'variant_id': self.variant.id, 'quantity': 10},
            HTTP_X_SESSION_KEY=session_key,
            format='json'
        )
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("Only 5 units available", response.data['error'])
