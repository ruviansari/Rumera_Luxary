from decimal import Decimal
from django.test import TestCase
from django.urls import reverse
from rest_framework.test import APIClient
from rest_framework import status
from accounts.models import User
from catalog.models import Category, Product, ProductVariant


class CatalogAPITests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.category = Category.objects.create(
            name="Rare Oud",
            slug="rare-oud",
            description="Pure Oud"
        )
        self.product = Product.objects.create(
            category=self.category,
            name="Assam Oud 10-Year",
            slug="assam-oud-10-year",
            sku="RUM-TST-001",
            product_type=Product.ProductType.ATTAR,
            short_description="Vintage Assam Oud",
            description="Rare wild agarwood extract",
            fragrance_family="Woody Animalic",
            concentration="100% Pure Attar Oil",
            top_notes="Leather, Saffron",
            heart_notes="Resin, Honey",
            base_notes="Agarwood, Amber",
            is_featured=True,
            is_active=True
        )
        self.variant = ProductVariant.objects.create(
            product=self.product,
            volume_size="3 ml",
            sku="RUM-TST-001-3ML",
            price=Decimal("4500.00"),
            stock_quantity=10
        )

    def test_get_categories_list(self):
        url = reverse('category_list')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]['slug'], 'rare-oud')

    def test_get_product_list_and_filters(self):
        url = reverse('product_list')
        response = self.client.get(url, {'category': 'rare-oud'})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data['results']), 1)
        self.assertEqual(response.data['results'][0]['sku'], 'RUM-TST-001')

    def test_get_product_detail_by_slug(self):
        url = reverse('product_detail', kwargs={'slug': 'assam-oud-10-year'})
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['name'], "Assam Oud 10-Year")
        self.assertEqual(len(response.data['variants']), 1)
        self.assertEqual(response.data['variants'][0]['volume_size'], "3 ml")
        self.assertEqual(response.data['top_notes'], "Leather, Saffron")
