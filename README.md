# Rumera Luxury Atra — E-Commerce & ERP Platform

> **Haute Parfumerie • Artisanal Indian Attars • Owner Atelier • ERP Management**

---

## 1. Overview & Brand Identity

**Rumera Luxury Atra** is a full-stack, quiet-luxury e-commerce and ERP platform for artisanal Indian attars, aged wild Dehn Al Oud, and fine fragrance extraits.

### Visual Design System
- **Primary Color**: Deep Forest Green (`#14231F`)
- **Accent Color**: Brushed Gold (`#B78B45`)
- **Background**: Warm Ivory (`#F8F4EC`)
- **Typography**: Editorial Serif (`Cormorant Garamond`) for regal titles; Clean Modern Sans (`Plus Jakarta Sans`) for UI, prices, tables, and forms.
- **Imagery**: Polished product bottle photography, natural shadows, and elegant olfactory breakdowns.

---

## 2. Technical Stack

- **Backend**: Python 3.12, Django 6, Django REST Framework (DRF), SimpleJWT, CORS Headers, SQLite (dev/test) & PostgreSQL-ready (`DATABASE_URL`).
- **Frontend**: React 19, Vite, Lucide Icons, Vanilla CSS Luxury Design System.
- **Security & Integrity**:
  - JWT Access/Refresh tokens with Role-Based Access Control (RBAC).
  - Server-side authoritative price recalculation (no client trust).
  - Atomic database transactions with `select_for_update` row locks preventing concurrent inventory overselling.
  - Auditable stock movement ledger with mandatory reasons.
  - Dynamic CMS for Founder Profile & legal policies.

---

## 3. Pre-Seeded Demo Role Credentials

| Role | Email | Password | Access Level |
|---|---|---|---|
| **Super Admin** | `admin@rumeraluxury.com` | `Rumera@2026` | Full system configuration, user/role management, audit logs |
| **Store Manager** | `manager@rumeraluxury.com` | `Rumera@2026` | Catalog CRUD, inventory adjustments, orders, reports |
| **Order Fulfilment** | `fulfilment@rumeraluxury.com` | `Rumera@2026` | Order status updates, tracking numbers, customer addresses |
| **Customer** | `customer@example.com` | `Rumera@2026` | Browsing, cart, checkout, order tracking, address book |

---

## 4. Active Promotional Coupons

- `RUMERA10`: 10% off any order (Min spend: ₹1,000)
- `WELCOME500`: Flat ₹500 off (Min spend: ₹2,499)
- `ROYAL20`: 20% off high-value orders (Min spend: ₹4,999)

---

## 5. Running the Project Locally

### Prerequisites
- Python 3.12+
- Node.js v20+ & npm

### Backend Setup (Django API)
```bash
cd backend

# Activate Virtual Environment
.\venv\Scripts\activate   # Windows PowerShell
# source venv/bin/activate  # macOS / Linux

# Apply Database Migrations
python manage.py migrate

# Seed Initial Catalog, Roles, Coupons & Founder Profile
python manage.py seed_data

# Run Automated Backend Tests
python manage.py test

# Start Backend Server on Port 8001
python manage.py runserver 127.0.0.1:8001
```

### Frontend Setup (React + Vite)
```bash
cd frontend

# Install Dependencies
npm install

# Build Production Bundle (0 errors)
npm run build

# Start Local Dev Server
npm run dev -- --host 127.0.0.1 --port 5173
```

- **Public Storefront URL**: `http://127.0.0.1:5173/`
- **Django API Root**: `http://127.0.0.1:8001/api/v1/`
- **Admin ERP Dashboard**: Click **"Admin ERP"** in top header when logged in as admin/staff, or via demo buttons on `/login`.

---

## 6. API Reference (`/api/v1/`)

### Authentication & Accounts (`/api/v1/auth/`)
- `POST /login/`: Obtain JWT tokens + user profile snapshot
- `POST /refresh/`: Refresh expired JWT access token
- `POST /register/`: Customer registration
- `GET /me/`: Authenticated user profile
- `GET /addresses/`, `POST /addresses/`: Address management
- `GET /admin/users/`: Staff user list (Store Manager / Super Admin)

### Catalog & Olfactory Notes (`/api/v1/`)
- `GET /categories/`: Active categories with creation counts
- `GET /products/`: Filterable product grid (`?category=`, `?fragrance_family=`, `?search=`, `?min_price=`, `?max_price=`, `?ordering=`)
- `GET /products/<slug>/`: Detailed product view with multi-size variants and olfactory notes pyramid
- `POST /admin/products/`: Create product with variants and images

### Inventory & Audits (`/api/v1/`)
- `GET /admin/inventory/movements/`: Stock movement ledger
- `POST /admin/inventory/adjust/`: Audited stock adjustment with mandatory reason and balance update
- `GET /admin/audit-logs/`: Immutable audit log

### Cart & Orders (`/api/v1/`)
- `GET /cart/`: View session or user cart
- `POST /cart/items/`: Add item (variant_id, quantity) with stock bounds check
- `PATCH /cart/items/<id>/`: Update quantity or remove
- `POST /checkout/`: Transactional atomic checkout with server price recalculation and inventory locking
- `POST /orders/track/`: Secure public order verification by order reference and phone/email

### Founder Profile CMS (`/api/v1/content/`)
- `GET /content/owner/`: Public founder profile
- `PATCH /admin/content/owner/`: Real-time editing and publishing
