# Bajaj Karyan Store — Full-Stack Confectionery & Grocery Ordering Platform

A modern, production-ready full-stack web application built for **Bajaj Karyan Store** (Firozpur, Punjab). Built with Next.js (App Router), TypeScript, Tailwind CSS, and Supabase.

---

## 🌟 Key Features

- **Public Storefront**: Elegant, responsive storefront highlighting fresh confectionery, biscuits, bakery, dry fruits, and everyday grocery staples.
- **Brand Identity**: Styled with the signature Bordeaux & Pink color palette (`--night-bordeaux: #590d22`, `--dark-amaranth: #800f2f`, `--bubblegum-pink: #ff4d6d`, etc.).
- **Flexible Measurement Units**: Sells by packet, piece, box, kg, gram, litre, ml, dozen, bundle, or custom. Decimal quantities are fully supported (e.g. `0.5 kg`, `1.5 kg`).
- **Price-on-Request (Market Rate)**: Products can have `price = NULL`. Customers can add them to their shopping list, and the store confirms current prices before preparing the order.
- **My Shopping List / Cart**: Slide-over drawer and dedicated page with real-time decimal quantity updates, requested weights, and customer item notes.
- **Offline / Pay on Delivery Checkout**: Fast, minimal-tap checkout collecting delivery details and notes with zero online payment gateway required.
- **Human-Friendly Order Numbers**: Automatic sequential order numbering: `BKS-YYYY-XXXXXX` (e.g. `BKS-2026-001001`).
- **Customer Order Tracking**: Real-time visual fulfillment timeline (Placed → Confirmed → Preparing → Out for Delivery → Delivered).
- **Admin Dashboard**:
  - Real-time KPIs: Today's Orders, Pending Reviews, Active Products, Total Customers.
  - Pipeline breakdown for every status stage.
  - Order review with **inline price confirmation** (allows store staff to set prices for unpriced items and recalculate grand totals automatically).
  - Product & Category CRUD with image URLs, stock controls, and status toggles.
  - Real-time Inventory tracking with configurable low-stock threshold alerts and quick inline stock adjustments.
  - Customer directory.
  - Store identity, delivery thresholds, and order prefix settings.
- **Printable Order / Invoice PDF**: Deterministic printer-friendly layout for standard A4 and compact thermal printers with 1-click trigger.
- **Row Level Security (RLS)**: Strict database-level isolation ensuring customers only see their own orders, while store administrators have full privileged access.

---

## 🛠️ Technology Stack

- **Framework**: [Next.js](https://nextjs.org/) (App Router, Server Components & Server Actions)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Database & Auth**: [Supabase](https://supabase.com/) (PostgreSQL + Auth + Row Level Security)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Validation**: [Zod](https://zod.dev/)

---

## 🚀 Getting Started Locally

### 1. Prerequisites
- Node.js 18+ or 20+
- npm, pnpm, or yarn
- A free [Supabase](https://supabase.com/) project

### 2. Clone & Install Dependencies
```bash
cd e:\bajajkaryanastore
npm install
```

### 3. Configure Environment Variables
Copy `.env.example` to `.env.local`:
```bash
cp .env.example .env.local
```
Fill in your Supabase credentials:
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

### 4. Apply Database Migrations & Seed Data
1. Go to your **Supabase Dashboard** → **SQL Editor**.
2. Run the script found in `supabase/migrations/20260914000000_init_schema.sql`.
   This creates all tables, functions, sequences, triggers, and RLS policies.
3. (Optional) Run `supabase/seed.sql` to populate sample categories, products, and default store settings.

### 5. Run the Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 👑 Creating an Admin Account

To access the Store Administration portal at `/admin`:

1. Sign up a user through the customer registration page at `/auth/register` (e.g. `admin@bajajkaryan.com`).
2. Open your **Supabase Dashboard** → **Table Editor** → **profiles**.
3. Locate your user row and change `role` from `'customer'` to `'admin'`.
4. Return to the website and log in at `/auth/login`. You will be directed to `/admin`.

---

## 📊 Database Schema & Relationships

```text
auth.users
    │
    ▼ (1:1 cascade)
 public.profiles (id, full_name, phone, role, address, city, pincode)
    │
    ▼ (1:N)
 public.orders (id, order_number, customer_id, status, subtotal, final_total, payment_status, ...)
    │
    ▼ (1:N cascade)
 public.order_items (id, order_id, product_id, product_name, unit_type, quantity, unit_price, line_total, ...)
    ▲
    │ (snapshot references)
 public.products (id, category_id, name, price, unit_type, stock_quantity, ...)
    ▲
    │ (N:1)
 public.categories (id, name, slug, image_url, ...)

 public.store_settings (id, store_name, phone, address, low_stock_threshold, default_delivery_charge, order_prefix)
```

### Historical Order Immutability
When an order is created, a product snapshot (`product_name`, `unit_type`, `unit_value`, `unit_price`, `line_total`) is copied into `order_items`. If an administrator later changes a product's price or description, past order records remain completely unaltered.

---

## 🖨️ Order PDF & Receipt Printing

- The admin order details view includes an immediate **Print Invoice / Receipt** action linking to `/admin/orders/[id]/print`.
- The document is formatted with clean typography, high-contrast borders, itemized unit prices, customer contact details, and grand totals.
- Optimized for standard A4 desktop printers and compact point-of-sale thermal receipt rolls.

---

## 🚢 Deployment to Vercel

1. Push your repository to GitHub / GitLab / Bitbucket.
2. Import the repository into [Vercel](https://vercel.com/).
3. Set the Environment Variables:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `NEXT_PUBLIC_SITE_URL` (your production domain)
4. Deploy! Vercel will automatically build the Next.js App Router application.
