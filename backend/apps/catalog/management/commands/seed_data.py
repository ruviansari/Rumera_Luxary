from decimal import Decimal
from django.core.management.base import BaseCommand
from django.utils import timezone
from datetime import timedelta
from accounts.models import User, Address
from catalog.models import Category, Product, ProductVariant, ProductImage, Review
from inventory.models import StockMovement
from promotions.models import Coupon
from content_cms.models import OwnerProfile, ContentPage


class Command(BaseCommand):
    help = 'Seeds initial users, luxury catalog, coupons, and content pages'

    def handle(self, *args, **options):
        self.stdout.write("Seeding Rumera Luxury Atra database...")

        # 1. Seed Users
        admin_user, _ = User.objects.get_or_create(
            email='admin@rumeraluxury.com',
            defaults={
                'first_name': 'Zayan',
                'last_name': 'Al-Hashemi',
                'role': User.Role.SUPER_ADMIN,
                'is_staff': True,
                'is_superuser': True,
            }
        )
        admin_user.set_password('Rumera@2026')
        admin_user.save()

        manager_user, _ = User.objects.get_or_create(
            email='manager@rumeraluxury.com',
            defaults={
                'first_name': 'Arif',
                'last_name': 'Khan',
                'role': User.Role.STORE_MANAGER,
                'is_staff': True,
            }
        )
        manager_user.set_password('Rumera@2026')
        manager_user.save()

        fulfilment_user, _ = User.objects.get_or_create(
            email='fulfilment@rumeraluxury.com',
            defaults={
                'first_name': 'Dev',
                'last_name': 'Sharma',
                'role': User.Role.ORDER_FULFILMENT,
                'is_staff': True,
            }
        )
        fulfilment_user.set_password('Rumera@2026')
        fulfilment_user.save()

        customer_user, _ = User.objects.get_or_create(
            email='customer@example.com',
            defaults={
                'first_name': 'Aditya',
                'last_name': 'Mehta',
                'phone': '+91 98765 43210',
                'role': User.Role.CUSTOMER,
            }
        )
        customer_user.set_password('Rumera@2026')
        customer_user.save()

        # Customer default address
        Address.objects.get_or_create(
            user=customer_user,
            defaults={
                'recipient_name': 'Aditya Mehta',
                'phone': '+91 98765 43210',
                'address_line1': 'Flat 402, Royal Palms Residencies',
                'address_line2': 'Jubilee Hills Road No. 36',
                'landmark': 'Near Heritage Club',
                'city': 'Hyderabad',
                'state': 'Telangana',
                'postal_code': '500033',
                'country': 'India',
                'is_default': True,
            }
        )

        # 2. Seed Categories
        categories_data = [
            {
                'name': 'Dehn Al Oud',
                'slug': 'dehn-al-oud',
                'description': 'Pure aged wild agarwood distillations from Assam, Cambodia, and Kalimantan. Rich, balsamic, resinous, and deeply spiritual.',
                'image_url': '/images/showcase/royal_emerald_flacon.jpg',
                'sort_order': 1
            },
            {
                'name': 'Artisanal Attars',
                'slug': 'artisanal-attars',
                'description': 'Ancient hydro-distilled floral concentrates matured on aged Indian sandalwood base oils using Kannauj deg-bhapka vessels.',
                'image_url': '/images/showcase/royal_sapphire_flacon.jpg',
                'sort_order': 2
            },
            {
                'name': 'Amber & Royal Musk',
                'slug': 'amber-musk',
                'description': 'Warm golden ambers, velvety vegan botanical musks, and opulent royal oriental accords.',
                'image_url': '/images/showcase/royal_amber_flacon_v2.jpg',
                'sort_order': 3
            },
            {
                'name': 'Extrait de Parfum',
                'slug': 'extrait-de-parfum',
                'description': 'High-concentration artisanal French-Oriental spray perfumes blending traditional rare naturals with modern diffusion.',
                'image_url': '/images/showcase/royal_aquamarine_flacon.jpg',
                'sort_order': 4
            },
            {
                'name': 'Luxury Gift Coffrets',
                'slug': 'gift-sets',
                'description': 'Handcrafted lacquer boxes and crystal crystal-cut tola bottles presented with engraved dipping wands.',
                'image_url': '/images/showcase/royal_trio_collection.jpg',
                'sort_order': 5
            },
        ]

        cat_objs = {}
        for cdata in categories_data:
            cat, _ = Category.objects.get_or_create(slug=cdata['slug'], defaults=cdata)
            cat_objs[cat.slug] = cat

        # 3. Seed Products
        products_data = [
            {
                'category': cat_objs['dehn-al-oud'],
                'name': 'Rooh Al Assam 12-Year Vintage',
                'slug': 'rooh-al-assam-vintage',
                'sku': 'RUM-OUD-001',
                'product_type': Product.ProductType.ATTAR,
                'short_description': 'Twelve-year naturally aged wild Aquilaria agallocha from the upper valley forests of Assam.',
                'description': 'A rare vintage distillation of wild Assam agarwood, aged twelve years in porous earthen amphorae before being sealed in teak casks. It opens with an antique barnyard and dry leather warmth, swiftly evolving into sweet honeycomb, dried prunes, and a smoky, resinous balsamic heart that lingers for over 36 hours on skin.',
                'fragrance_family': 'Pure Agarwood / Animalic Oriental',
                'concentration': '100% Pure Undiluted Wild Dehn Al Oud Oil',
                'top_notes': 'Wild Leather, Smoky Tobacco, Cured Figs',
                'heart_notes': 'Balsamic Sweet Resin, Dark Honeycomb, Earthy Humus',
                'base_notes': 'Aged Agarwood (Aquilaria), Warm Teakwood, Ambered Smoke',
                'usage_instructions': 'Apply a microscopic bead with the crystal glass wand to the wrist and gently press (never rub) against the carotid pulse points.',
                'ingredients': '100% Pure Steam Distilled Aquilaria Agallocha Wood Extract.',
                'is_featured': True,
                'is_bestseller': True,
                'images': [
                    '/images/showcase/royal_emerald_flacon.jpg',
                ],
                'variants': [
                    {'volume_size': '3 ml (1/4 Tola)', 'sku': 'RUM-OUD-001-3ML', 'price': Decimal('3800.00'), 'compare_at_price': Decimal('4500.00'), 'stock': 24},
                    {'volume_size': '6 ml (1/2 Tola)', 'sku': 'RUM-OUD-001-6ML', 'price': Decimal('7200.00'), 'compare_at_price': Decimal('8500.00'), 'stock': 15},
                    {'volume_size': '12 ml (1 Tola)', 'sku': 'RUM-OUD-001-12ML', 'price': Decimal('13500.00'), 'compare_at_price': Decimal('16000.00'), 'stock': 8},
                ]
            },
            {
                'category': cat_objs['artisanal-attars'],
                'name': 'Gulab-e-Khas (Kannauj Ruh Gulab)',
                'slug': 'gulab-e-khas-ruh-gulab',
                'sku': 'RUM-GLB-002',
                'product_type': Product.ProductType.ATTAR,
                'short_description': 'Ancient deg-bhapka hydro-distilled Damascena rose matured over authentic Mysore sandalwood base oil.',
                'description': 'Harvested at dawn before sunrise when the dew glistens on freshly opened petals of Rosa Damascena in Kannauj. Four metric tons of fresh blossoms yield a precious single liter of this liquid silk, slowly captured drop by drop in traditional copper receivers charged with genuine Santalum album sandalwood oil.',
                'fragrance_family': 'Noble Floral / Sandalwood',
                'concentration': '100% Pure Hydro-Distilled Concentrated Attar Oil',
                'top_notes': 'Morning Dew, Green Petal Crispness, Lychee Nectar',
                'heart_notes': 'Opulent Centifolia & Damask Rose Absolute, Saffron Dust',
                'base_notes': 'Aged Mysore White Sandalwood, Warm Velvet Amber',
                'usage_instructions': 'Touch the wand to pulse points or onto natural silk/cotton lapels. Suitable for meditation, celebratory evenings, and daily peace.',
                'ingredients': 'Rosa Damascena Flower Extract, Santalum Album Wood Oil.',
                'is_featured': True,
                'is_bestseller': True,
                'images': [
                    '/images/showcase/artisanal_gold_cage_front.jpg',
                ],
                'variants': [
                    {'volume_size': '3 ml (1/4 Tola)', 'sku': 'RUM-GLB-002-3ML', 'price': Decimal('2200.00'), 'compare_at_price': Decimal('2600.00'), 'stock': 35},
                    {'volume_size': '6 ml (1/2 Tola)', 'sku': 'RUM-GLB-002-6ML', 'price': Decimal('4100.00'), 'compare_at_price': Decimal('4800.00'), 'stock': 20},
                    {'volume_size': '12 ml (1 Tola)', 'sku': 'RUM-GLB-002-12ML', 'price': Decimal('7800.00'), 'compare_at_price': Decimal('9000.00'), 'stock': 12},
                ]
            },
            {
                'category': cat_objs['amber-musk'],
                'name': 'Kashmir Shamama Tul Amber',
                'slug': 'kashmir-shamama-tul-amber',
                'sku': 'RUM-SHM-003',
                'product_type': Product.ProductType.ATTAR,
                'short_description': 'An artisanal marriage of 42 sacred herbs, spices, Kashmiri saffron, and aged golden fossil amber resin.',
                'description': 'A recipe perfected across seven generations of Awadh court perfumers. Over forty medicinal roots, saffron pistils, cinnamon bark, cardamom pods, and nagarmotha are slow-distilled over five weeks. The scent blooms warmly in cooler temperatures, projecting an aura of majestic sovereignty.',
                'fragrance_family': 'Warm Spicy Amber / Oriental',
                'concentration': 'Traditional Herbal Shamama Attar Oil',
                'top_notes': 'Pampore Saffron, Green Cardamom, Clove Buds',
                'heart_notes': 'Nutmeg, Nagarmotha, Sugandh Kokila, Henna Blossoms',
                'base_notes': 'Fossil Amber Resin, Civet Accord, Patchouli, Sandalwood',
                'usage_instructions': 'Superb for evening wear, colder climates, and formal ceremonies. Apply a drop to inner wrists and fold gently.',
                'ingredients': 'Proprietary Complex of 42 Natural Botanicals & Spices in Sandalwood Oil.',
                'is_featured': True,
                'is_bestseller': False,
                'images': [
                    '/images/showcase/royal_amber_flacon.jpg',
                ],
                'variants': [
                    {'volume_size': '3 ml (1/4 Tola)', 'sku': 'RUM-SHM-003-3ML', 'price': Decimal('2600.00'), 'compare_at_price': Decimal('3000.00'), 'stock': 30},
                    {'volume_size': '6 ml (1/2 Tola)', 'sku': 'RUM-SHM-003-6ML', 'price': Decimal('4900.00'), 'compare_at_price': Decimal('5600.00'), 'stock': 18},
                    {'volume_size': '12 ml (1 Tola)', 'sku': 'RUM-SHM-003-12ML', 'price': Decimal('9200.00'), 'compare_at_price': Decimal('10500.00'), 'stock': 10},
                ]
            },
            {
                'category': cat_objs['amber-musk'],
                'name': 'Musk Al-Sultani (Royal White Musk)',
                'slug': 'musk-al-sultani-white-musk',
                'sku': 'RUM-MSK-004',
                'product_type': Product.ProductType.ATTAR,
                'short_description': 'Creamy botanical ambrette musk, white lily, spun silk, and celestial sandalwood.',
                'description': 'Intimate, velvety, and irresistibly comforting. Musk Al-Sultani sits close to the skin like a second aura of clean royalty. Non-animalic, formulated with rare ambrette seed concrete, white lotus, and whipped Tahitian vanilla beans.',
                'fragrance_family': 'Soft Floral Musk',
                'concentration': 'Pure Non-Alcoholic Oil Attar',
                'top_notes': 'White Lotus, Morning Iris, Heliotrope',
                'heart_notes': 'Ambrette Seed, Ylang Ylang, White Cashmere',
                'base_notes': 'Clean White Musk, Soft Ambergris, Bourbon Vanilla',
                'usage_instructions': 'Apply behind ears, along collarbones, or inside beard/hair ends.',
                'ingredients': 'Abelmoschus Moschatus (Ambrette) Seed Oil, Dipteryx Odorata, Sandalwood.',
                'is_featured': False,
                'is_bestseller': True,
                'images': [
                    '/images/showcase/artisanal_gold_cage_angle.jpg',
                ],
                'variants': [
                    {'volume_size': '3 ml (1/4 Tola)', 'sku': 'RUM-MSK-004-3ML', 'price': Decimal('1800.00'), 'compare_at_price': Decimal('2200.00'), 'stock': 40},
                    {'volume_size': '6 ml (1/2 Tola)', 'sku': 'RUM-MSK-004-6ML', 'price': Decimal('3400.00'), 'compare_at_price': Decimal('4000.00'), 'stock': 25},
                    {'volume_size': '12 ml (1 Tola)', 'sku': 'RUM-MSK-004-12ML', 'price': Decimal('6200.00'), 'compare_at_price': Decimal('7200.00'), 'stock': 14},
                ]
            },
            {
                'category': cat_objs['extrait-de-parfum'],
                'name': 'Oud Imperial Extrait de Parfum (50ml)',
                'slug': 'oud-imperial-extrait-de-parfum',
                'sku': 'RUM-PAR-005',
                'product_type': Product.ProductType.PERFUME,
                'short_description': '30% Extrait concentration atomizer combining Cambodian oud with Sicilian bergamot and dry birch tar.',
                'description': 'Designed for collectors who desire the depth of ancient attars with the contemporary projection and sillage of haute French perfumery. Opens with zesty Italian citrus and smoky black pepper before unmasking rich dark agarwood, leather accords, and velvety tonka.',
                'fragrance_family': 'Woody Leather Extrait',
                'concentration': '30% Extrait de Parfum',
                'top_notes': 'Sicilian Bergamot, Pink Peppercorn, Nutmeg',
                'heart_notes': 'Cambodian Oud, Birch Tar Smoke, Atlas Cedarwood',
                'base_notes': 'Dark Leather, Tonka Bean, Oakmoss, Ambergris',
                'usage_instructions': 'Spray 2 to 3 times on chest, wrists, and collar for an all-day luxury cloud.',
                'ingredients': 'Alcohol Denat (Organic Cane Spirit), Parfum / Fragrance Naturals, Limonene, Linalool.',
                'is_featured': True,
                'is_bestseller': False,
                'images': [
                    '/images/rumera_white_oud_hero.jpg',
                ],
                'variants': [
                    {'volume_size': '50 ml Atomizer', 'sku': 'RUM-PAR-005-50ML', 'price': Decimal('6500.00'), 'compare_at_price': Decimal('7500.00'), 'stock': 22},
                    {'volume_size': '100 ml Atomizer', 'sku': 'RUM-PAR-005-100ML', 'price': Decimal('11500.00'), 'compare_at_price': Decimal('13500.00'), 'stock': 12},
                ]
            },
            {
                'category': cat_objs['gift-sets'],
                'name': 'The Royal Quadrumvirate - Collector Coffret',
                'slug': 'royal-quadrumvirate-gift-coffret',
                'sku': 'RUM-GFT-006',
                'product_type': Product.ProductType.GIFT_SET,
                'short_description': 'A velvet-lined presentation casket featuring four 3ml crystal flacons of Rumera signature attars.',
                'description': 'The definitive gift of distinction. Contains 3ml flacons of Rooh Al Assam, Gulab-e-Khas, Shamama Tul Amber, and Musk Al-Sultani, accompanied by an artisan-engraved solid brass dipping wand and certificate of authenticity.',
                'fragrance_family': 'Omni-Olfactory Discovery Collection',
                'concentration': 'Pure Perfume Oil Extracts',
                'top_notes': 'Curated Symphony of Rose, Saffron, Oud & Musk',
                'heart_notes': 'Multifaceted Natural Resins & Botanicals',
                'base_notes': 'Mysore Sandalwood, Aged Aquilaria, Golden Amber',
                'usage_instructions': 'Explore each flacon individually or experiment with bespoke royal layering.',
                'ingredients': '100% Pure Artisanal Natural Attars.',
                'is_featured': True,
                'is_bestseller': True,
                'images': [
                    '/images/showcase/royal_trio_collection.jpg',
                ],
                'variants': [
                    {'volume_size': '4 x 3ml Flacons (Complete Set)', 'sku': 'RUM-GFT-006-SET', 'price': Decimal('8900.00'), 'compare_at_price': Decimal('10500.00'), 'stock': 18},
                ]
            }
        ]

        for pdata in products_data:
            variants_info = pdata.pop('variants')
            images_info = pdata.pop('images')

            prod, created = Product.objects.get_or_create(sku=pdata['sku'], defaults=pdata)

            # Images
            for idx, img_url in enumerate(images_info):
                ProductImage.objects.get_or_create(
                    product=prod,
                    image_url=img_url,
                    defaults={'display_order': idx, 'is_primary': (idx == 0)}
                )

            # Variants & initial stock movements
            for vdata in variants_info:
                stock_qty = vdata.pop('stock')
                variant, vcreated = ProductVariant.objects.get_or_create(
                    product=prod,
                    volume_size=vdata['volume_size'],
                    defaults={
                        'sku': vdata['sku'],
                        'price': vdata['price'],
                        'compare_at_price': vdata.get('compare_at_price'),
                        'stock_quantity': stock_qty,
                    }
                )
                if vcreated:
                    StockMovement.objects.create(
                        variant=variant,
                        quantity_change=stock_qty,
                        balance_after=stock_qty,
                        reason=StockMovement.Reason.INITIAL,
                        notes='Initial seed stock batch',
                        reference_type='SEED'
                    )

        # 4. Seed Coupons
        coupons = [
            {
                'code': 'RUMERA10',
                'discount_type': Coupon.DiscountType.PERCENTAGE,
                'discount_value': Decimal('10.00'),
                'min_purchase_amount': Decimal('1000.00'),
                'max_discount_amount': Decimal('1500.00'),
                'valid_from': timezone.now() - timedelta(days=1),
                'valid_to': timezone.now() + timedelta(days=365),
                'usage_limit': 500,
            },
            {
                'code': 'WELCOME500',
                'discount_type': Coupon.DiscountType.FIXED,
                'discount_value': Decimal('500.00'),
                'min_purchase_amount': Decimal('2499.00'),
                'valid_from': timezone.now() - timedelta(days=1),
                'valid_to': timezone.now() + timedelta(days=365),
                'usage_limit': 200,
            },
            {
                'code': 'ROYAL20',
                'discount_type': Coupon.DiscountType.PERCENTAGE,
                'discount_value': Decimal('20.00'),
                'min_purchase_amount': Decimal('4999.00'),
                'max_discount_amount': Decimal('3000.00'),
                'valid_from': timezone.now() - timedelta(days=1),
                'valid_to': timezone.now() + timedelta(days=365),
                'usage_limit': 100,
            }
        ]
        for cpn in coupons:
            Coupon.objects.get_or_create(code=cpn['code'], defaults=cpn)

        # 5. Seed Owner Profile
        OwnerProfile.objects.get_or_create(
            id=1,
            defaults={
                'display_name': 'Er. Rumana Ansari',
                'title': 'Founder & Master Perfumer',
                'portrait_url': '/images/rumera_founder_edition.jpg',
                'short_bio': 'Preserving seven centuries of Awadhi and Assamese distillation heritage into refined modern flacons of unmatched purity.',
                'full_story': 'Rumera Luxury Atra was born from an unyielding passion to bring the authentic aristocracy of Indian attar back to discerning connoisseurs worldwide. Raised in the shadow of ancient Kannauj stills and wild Assamese plantations, our founder apprenticed with third-generation distillers who read wood resins by firelight. Every drop of Rumera Atra is aged without haste, formulated without alcohol, and poured by hand.',
                'brand_vision': 'To champion natural botanical distillations, sustainable wild tree reforestation, and uncompromised quiet luxury where subtlety speaks louder than noise.',
                'values': 'Zero Synthetic Fixatives • Direct Fair-Trade Distiller Partnerships • Zero Alcohol • Aged in Heritage Glass & Teak',
                'quote': 'Pure scent does not seek to announce itself; it lingers in the mind long after you have departed.',
                'instagram_url': 'https://instagram.com/rumeraluxuryatra',
                'linkedin_url': 'https://linkedin.com/company/rumera-luxury-atra',
                'is_published': True,
            }
        )

        # 6. Seed Content Pages
        pages = [
            {
                'slug': 'about',
                'title': 'The Heritage of Rumera Luxury Atra',
                'content': 'Founded on the philosophy of quiet luxury, Rumera Luxury Atra unites centuries-old hydro-distillation traditions with uncompromising artisanal curation. Every attar is crafted from wild botanicals, hand-harvested flowers, and vintage agarwood, completely free from synthetic solvents or ethyl alcohol.',
                'is_published': True,
            },
            {
                'slug': 'shipping-policy',
                'title': 'Shipping & Discreet Delivery',
                'content': 'We offer complimentary insured white-glove express shipping across India on orders exceeding ₹1,999. Standard shipping is ₹150 for orders below this threshold. All orders are packed in temper-evident luxury containers and dispatched within 24 to 48 hours.',
                'is_published': True,
            },
            {
                'slug': 'returns-refunds',
                'title': 'Returns & Authenticity Guarantee',
                'content': 'Due to the intimate and precious botanical nature of pure perfume oils and attars, opened flacons cannot be returned. If an item arrives damaged or compromised during transit, notify our concierge within 48 hours of delivery for an immediate replacement or full refund.',
                'is_published': True,
            },
            {
                'slug': 'privacy-policy',
                'title': 'Privacy Policy',
                'content': 'Rumera Luxury Atra values your privacy above all. We never sell, lease, or distribute customer details, order history, or addresses to third parties. All transactions are processed through encrypted 256-bit SSL payment gateways.',
                'is_published': True,
            },
            {
                'slug': 'terms',
                'title': 'Terms of Service',
                'content': 'By accessing Rumera Luxury Atra, you agree to our terms of service and acceptable use policies. All product descriptions, olfactory formulations, and brand assets are intellectual property of Rumera Luxury Atra.',
                'is_published': True,
            },
            {
                'slug': 'faq',
                'title': 'Frequently Asked Questions',
                'content': 'Q: Are Rumera attars 100% alcohol-free?\nA: Yes, all our traditional attars and oils are 100% alcohol-free concentrated perfume extracts.\n\nQ: How long does pure attar last on the skin?\nA: Depending on the resin profile, our vintage Dehn Al Oud and Shamama attars linger between 18 to 36 hours.\n\nQ: How should attars be stored?\nA: Store away from direct sunlight in a cool, dry chamber in an upright position.',
                'is_published': True,
            }
        ]
        for p in pages:
            ContentPage.objects.get_or_create(slug=p['slug'], defaults=p)

        # 7. Seed Connoisseur Reviews
        white_oud = Product.objects.filter(slug='rumera-white-oud-extrait').first()
        if white_oud and not white_oud.reviews.exists():
            Review.objects.create(
                product=white_oud,
                name="Tariq Al-Mansoor",
                city="Dubai, UAE",
                rating=5,
                headline="A masterpiece of aged Dehn Al Oud — majestic longevity",
                comment="Maison Rumera has achieved what modern niche perfume houses have long forgotten. The Assam oud resin is smoky, resinous yet rounded with delicate Damascena morning rose. It lingered on my silk kurta for 32 hours.",
                is_verified_buyer=True,
                is_approved=True
            )
            Review.objects.create(
                product=white_oud,
                name="Dr. Shreya Sengupta",
                city="New Delhi",
                rating=5,
                headline="Truly royalty in a flacon",
                comment="From the 24K gold cap and crystal weight to the divine olfactory dry-down, Er. Rumana Ansari's formulation is incomparable. Worth every single rupee.",
                is_verified_buyer=True,
                is_approved=True
            )

        gulab = Product.objects.filter(slug='gulab-e-khas-ruh-gulab').first()
        if gulab and not gulab.reviews.exists():
            Review.objects.create(
                product=gulab,
                name="Vikramaditya Rao",
                city="Hyderabad",
                rating=5,
                headline="The genuine Kannauj hydro-distilled Ruh Gulab",
                comment="Pure morning dew on thousands of pink petals. Zero alcohol burn, entirely gentle and intoxicatingly deep. This is heritage Indian perfumery at its finest.",
                is_verified_buyer=True,
                is_approved=True
            )

        self.stdout.write(self.style.SUCCESS("Successfully seeded Rumera Luxury Atra database with rich test catalog, users, coupons, and content!"))
