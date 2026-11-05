from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from django.http import HttpResponse

def api_root_welcome(request):
    html = """<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Rumera Luxury Atra — Backend Service</title>
    <style>
        body {
            background-color: #14231F;
            color: #F8F4EC;
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
            display: flex;
            align-items: center;
            justify-content: center;
            min-height: 100vh;
            margin: 0;
            padding: 24px;
            box-sizing: border-box;
        }
        .card {
            background: #0F1C18;
            border: 1px solid #B78B45;
            border-radius: 24px;
            padding: 44px 36px;
            max-width: 520px;
            text-align: center;
            box-shadow: 0 24px 60px rgba(0, 0, 0, 0.7), 0 0 35px rgba(183, 139, 69, 0.2);
        }
        .badge {
            display: inline-block;
            background: rgba(183, 139, 69, 0.15);
            border: 1px solid #B78B45;
            color: #E8CA89;
            padding: 6px 16px;
            border-radius: 9999px;
            font-size: 0.74rem;
            letter-spacing: 0.16em;
            text-transform: uppercase;
            font-weight: 700;
            margin-bottom: 18px;
        }
        h1 {
            color: #FAF7F0;
            font-size: 2rem;
            margin: 0 0 10px;
            font-family: Georgia, serif;
        }
        p {
            color: #B6C4BC;
            font-size: 0.95rem;
            line-height: 1.6;
            margin: 0 0 28px;
        }
        .btn {
            display: block;
            padding: 15px 24px;
            border-radius: 9999px;
            text-decoration: none;
            font-weight: 700;
            font-size: 0.88rem;
            letter-spacing: 0.08em;
            text-transform: uppercase;
            margin-bottom: 12px;
            transition: all 0.28s;
        }
        .btn-gold {
            background: linear-gradient(135deg, #D4AF37 0%, #C59B55 50%, #B78B45 100%);
            color: #14231F;
            box-shadow: 0 8px 24px rgba(183, 139, 69, 0.4);
        }
        .btn-gold:hover {
            transform: translateY(-2px);
            box-shadow: 0 12px 30px rgba(183, 139, 69, 0.6);
        }
        .btn-outline {
            border: 1px solid rgba(183, 139, 69, 0.6);
            color: #FAF7F0;
            background: transparent;
        }
        .btn-outline:hover {
            background: rgba(183, 139, 69, 0.16);
            border-color: #D4AF37;
        }
        .info-tag {
            font-size: 0.78rem;
            color: #8E9B94;
            margin-top: 18px;
        }
    </style>
</head>
<body>
    <div class="card">
        <div class="badge">Royal Awadh Atelier • Django Backend API Live</div>
        <h1>Rumera Luxury Atra</h1>
        <p>Aapka Backend server bilkul sahi chal raha hai! Website ka visual storefront dekhne ke liye neeche button par click karein:</p>
        <a href="http://127.0.0.1:5173/" class="btn btn-gold">👉 Open Storefront Website (Port 5173)</a>
        <a href="/admin/" class="btn btn-outline">Django Admin Portal</a>
        <div class="info-tag">Backend API Root: <code>/api/v1/</code></div>
    </div>
</body>
</html>"""
    return HttpResponse(html)

urlpatterns = [
    # Root Welcome & Redirection Page
    path('', api_root_welcome, name='api-welcome'),

    path('admin/', admin.site.urls),

    # Rumera Luxury Atra API v1
    path('api/v1/auth/', include('accounts.urls')),
    path('api/v1/', include('catalog.urls')),
    path('api/v1/', include('inventory.urls')),
    path('api/v1/', include('cart.urls')),
    path('api/v1/', include('orders.urls')),
    path('api/v1/', include('payments.urls')),
    path('api/v1/', include('promotions.urls')),
    path('api/v1/', include('content_cms.urls')),
    path('api/v1/', include('audit.urls')),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
