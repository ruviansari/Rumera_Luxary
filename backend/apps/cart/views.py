import uuid
import urllib.parse
from datetime import timedelta
from django.utils import timezone
from rest_framework import permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView
from .models import Cart, CartItem
from .serializers import CartSerializer, CartItemSerializer
from catalog.models import ProductVariant
from accounts.permissions import IsStoreManager


def get_or_create_cart(request):
    session_key = request.headers.get('X-Session-Key')
    if not session_key:
        session_key = request.session.session_key
        if not session_key:
            request.session.create()
            session_key = request.session.session_key

    if request.user.is_authenticated:
        cart, _ = Cart.objects.get_or_create(user=request.user)
    else:
        cart, _ = Cart.objects.get_or_create(session_key=session_key)

    return cart


class CartDetailView(APIView):
    permission_classes = [permissions.AllowAny]

    def get(self, request):
        cart = get_or_create_cart(request)
        return Response(CartSerializer(cart).data)


class CartAddItemView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        variant_id = request.data.get('variant_id')
        quantity = int(request.data.get('quantity', 1))

        if not variant_id:
            return Response({"error": "variant_id is required"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            variant = ProductVariant.objects.get(id=variant_id, is_active=True)
        except ProductVariant.DoesNotExist:
            return Response({"error": "Product variant not found or inactive"}, status=status.HTTP_404_NOT_FOUND)

        if variant.stock_quantity < quantity:
            return Response({
                "error": f"Only {variant.stock_quantity} units available in stock."
            }, status=status.HTTP_400_BAD_REQUEST)

        cart = get_or_create_cart(request)
        cart_item, created = CartItem.objects.get_or_create(
            cart=cart,
            variant=variant,
            defaults={'quantity': quantity}
        )
        if not created:
            new_qty = cart_item.quantity + quantity
            if new_qty > variant.stock_quantity:
                return Response({
                    "error": f"Cannot add more. Current in cart: {cart_item.quantity}, Available: {variant.stock_quantity}."
                }, status=status.HTTP_400_BAD_REQUEST)
            cart_item.quantity = new_qty
            cart_item.save(update_fields=['quantity'])

        return Response(CartSerializer(cart).data, status=status.HTTP_200_OK)


class CartUpdateItemView(APIView):
    permission_classes = [permissions.AllowAny]

    def patch(self, request, pk):
        cart = get_or_create_cart(request)
        try:
            cart_item = CartItem.objects.get(id=pk, cart=cart)
        except CartItem.DoesNotExist:
            return Response({"error": "Item not found in cart"}, status=status.HTTP_404_NOT_FOUND)

        quantity = int(request.data.get('quantity', 1))
        if quantity <= 0:
            cart_item.delete()
        else:
            if quantity > cart_item.variant.stock_quantity:
                return Response({
                    "error": f"Only {cart_item.variant.stock_quantity} units available."
                }, status=status.HTTP_400_BAD_REQUEST)
            cart_item.quantity = quantity
            cart_item.save(update_fields=['quantity'])

        return Response(CartSerializer(cart).data)

    def delete(self, request, pk):
        cart = get_or_create_cart(request)
        CartItem.objects.filter(id=pk, cart=cart).delete()
        return Response(CartSerializer(cart).data)


class CartClearView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        cart = get_or_create_cart(request)
        cart.items.all().delete()
        return Response(CartSerializer(cart).data)


class AdminAbandonedCartsView(APIView):
    permission_classes = [IsStoreManager]

    def get(self, request):
        # Carts with items updated more than 15 mins ago
        threshold = timezone.now() - timedelta(minutes=15)
        carts = Cart.objects.filter(
            items__isnull=False,
            updated_at__lte=threshold
        ).distinct().prefetch_related('items__variant__product', 'user')

        results = []
        for cart in carts:
            cart_total = sum([item.line_total for item in cart.items.all()])
            items_desc = [f"{item.variant.product.name} ({item.variant.volume_size}) x{item.quantity}" for item in cart.items.all()]
            first_product = cart.items.first().variant.product.name if cart.items.exists() else "Luxury Fragrance"

            user_name = cart.user.get_full_name() or cart.user.email if cart.user else "Anonymous Connoisseur"
            user_phone = cart.user.phone if cart.user and cart.user.phone else ""
            user_email = cart.user.email if cart.user else ""

            # WhatsApp recovery message
            recovery_msg = (
                f"👑 Greetings from Maison Rumera Luxury Atra!\n\n"
                f"We noticed you left *{first_product}* in your olfactory cart.\n"
                f"As a gesture of royal appreciation, enjoy Flat ₹500 off using code *WELCOME500*.\n\n"
                f"Complete your acquisition: http://127.0.0.1:5173/checkout"
            )
            encoded_msg = urllib.parse.quote(recovery_msg)
            clean_phone = user_phone.replace('+', '').replace(' ', '')
            whatsapp_link = f"https://wa.me/{clean_phone}?text={encoded_msg}" if clean_phone else f"https://wa.me/?text={encoded_msg}"

            results.append({
                "cart_id": cart.id,
                "user_name": user_name,
                "user_phone": user_phone,
                "user_email": user_email,
                "items_count": cart.total_items,
                "items_summary": ", ".join(items_desc),
                "cart_total": float(cart_total),
                "last_updated": cart.updated_at,
                "whatsapp_recovery_url": whatsapp_link,
            })

        return Response({
            "total_abandoned_carts": len(results),
            "potential_lost_revenue": sum([r['cart_total'] for r in results]),
            "results": results
        })
