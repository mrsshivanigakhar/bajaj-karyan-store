-- Bajaj karyana Store — Initial Schema & RLS Setup
-- Migration: 20260914000000_init_schema.sql

-- Enable pgcrypto for UUIDs
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Sequence for Order Numbers
CREATE SEQUENCE IF NOT EXISTS order_number_seq START WITH 1001;

-- 1. Profiles Table
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name TEXT,
    phone TEXT,
    email TEXT,
    role TEXT NOT NULL DEFAULT 'customer' CHECK (role IN ('customer', 'admin')),
    address TEXT,
    city TEXT,
    state TEXT,
    pincode TEXT,
    avatar_url TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. Categories Table
CREATE TABLE IF NOT EXISTS public.categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    description TEXT,
    image_url TEXT,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    sort_order INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. Products Table
CREATE TABLE IF NOT EXISTS public.products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    category_id UUID REFERENCES public.categories(id) ON DELETE SET NULL,
    name TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    description TEXT,
    image_url TEXT,
    price NUMERIC(10, 2) NULL, -- NULL indicates "Price on Request"
    sale_price NUMERIC(10, 2) NULL,
    unit_type TEXT NOT NULL DEFAULT 'packet', -- piece, packet, box, kg, gram, litre, ml, dozen, bundle, custom
    unit_value NUMERIC(10, 2) NOT NULL DEFAULT 1,
    sku TEXT,
    stock_quantity NUMERIC(10, 2) NOT NULL DEFAULT 100,
    is_available BOOLEAN NOT NULL DEFAULT TRUE,
    is_featured BOOLEAN NOT NULL DEFAULT FALSE,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 4. Orders Table
CREATE TABLE IF NOT EXISTS public.orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_number TEXT NOT NULL UNIQUE,
    customer_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'preparing', 'ready', 'out_for_delivery', 'delivered', 'cancelled')),
    subtotal NUMERIC(10, 2) NOT NULL DEFAULT 0,
    discount NUMERIC(10, 2) NOT NULL DEFAULT 0,
    delivery_charge NUMERIC(10, 2) NOT NULL DEFAULT 0,
    estimated_total NUMERIC(10, 2) NOT NULL DEFAULT 0,
    final_total NUMERIC(10, 2) NOT NULL DEFAULT 0,
    payment_status TEXT NOT NULL DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid')),
    payment_method TEXT NOT NULL DEFAULT 'offline',
    customer_name TEXT NOT NULL,
    customer_phone TEXT NOT NULL,
    delivery_address TEXT NOT NULL,
    landmark TEXT,
    city TEXT NOT NULL,
    state TEXT NOT NULL,
    pincode TEXT NOT NULL,
    customer_notes TEXT,
    admin_notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 5. Order Items Table (Product snapshot for historical immutability)
CREATE TABLE IF NOT EXISTS public.order_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
    product_id UUID REFERENCES public.products(id) ON DELETE SET NULL,
    product_name TEXT NOT NULL,
    unit_type TEXT NOT NULL,
    unit_value NUMERIC(10, 2) NOT NULL DEFAULT 1,
    quantity NUMERIC(10, 2) NOT NULL DEFAULT 1,
    requested_weight TEXT,
    unit_price NUMERIC(10, 2) NULL, -- NULL if Price on Request
    line_total NUMERIC(10, 2) NULL, -- NULL if Price on Request
    price_confirmed BOOLEAN NOT NULL DEFAULT FALSE,
    customer_notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 6. Store Settings Table
CREATE TABLE IF NOT EXISTS public.store_settings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    store_name TEXT NOT NULL DEFAULT 'Bajaj karyana Store',
    phone TEXT DEFAULT '+91 98765 43210',
    email TEXT DEFAULT 'contact@bajajkaryan.com',
    address TEXT DEFAULT 'Main Bazaar, Near Clock Tower',
    city TEXT DEFAULT 'Amritsar',
    state TEXT DEFAULT 'Punjab',
    pincode TEXT DEFAULT '143001',
    opening_hours TEXT DEFAULT 'Mon - Sat: 8:00 AM - 9:00 PM | Sun: 9:00 AM - 6:00 PM',
    delivery_info TEXT DEFAULT 'Free local delivery on orders above ₹500',
    footer_text TEXT DEFAULT 'Bajaj karyana Store — Quality Groceries & Confectionery Since 1987',
    low_stock_threshold NUMERIC(10, 2) NOT NULL DEFAULT 10,
    default_delivery_charge NUMERIC(10, 2) NOT NULL DEFAULT 30,
    order_prefix TEXT NOT NULL DEFAULT 'BKS',
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Function: Generate Order Number: e.g. BKS-2026-001001
CREATE OR REPLACE FUNCTION public.generate_order_number()
RETURNS TRIGGER AS $$
DECLARE
    prefix TEXT := 'BKS';
    curr_year TEXT := TO_CHAR(NOW(), 'YYYY');
    seq_val BIGINT;
BEGIN
    SELECT COALESCE(order_prefix, 'BKS') INTO prefix FROM public.store_settings LIMIT 1;
    IF prefix IS NULL THEN prefix := 'BKS'; END IF;
    
    seq_val := NEXTVAL('order_number_seq');
    NEW.order_number := prefix || '-' || curr_year || '-' || LPAD(seq_val::TEXT, 6, '0');
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger: Automatically set order_number before insert if not provided
DROP TRIGGER IF EXISTS trg_set_order_number ON public.orders;
CREATE TRIGGER trg_set_order_number
BEFORE INSERT ON public.orders
FOR EACH ROW
WHEN (NEW.order_number IS NULL OR NEW.order_number = '')
EXECUTE FUNCTION public.generate_order_number();

-- Function: Automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Attach updated_at triggers
DROP TRIGGER IF EXISTS trg_profiles_updated_at ON public.profiles;
CREATE TRIGGER trg_profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS trg_categories_updated_at ON public.categories;
CREATE TRIGGER trg_categories_updated_at BEFORE UPDATE ON public.categories FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS trg_products_updated_at ON public.products;
CREATE TRIGGER trg_products_updated_at BEFORE UPDATE ON public.products FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS trg_orders_updated_at ON public.orders;
CREATE TRIGGER trg_orders_updated_at BEFORE UPDATE ON public.orders FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS trg_store_settings_updated_at ON public.store_settings;
CREATE TRIGGER trg_store_settings_updated_at BEFORE UPDATE ON public.store_settings FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Function: Safe check for admin role (Security Definer avoids recursive RLS)
CREATE OR REPLACE FUNCTION public.is_admin(user_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM public.profiles
        WHERE id = user_id AND role = 'admin'
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger: Handle new user creation from Supabase Auth
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, full_name, email, role, phone)
    VALUES (
        NEW.id,
        COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
        NEW.email,
        'customer',
        COALESCE(NEW.raw_user_meta_data->>'phone', '')
    )
    ON CONFLICT (id) DO NOTHING;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ==========================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ==========================================================

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.store_settings ENABLE ROW LEVEL SECURITY;

-- 1. Profiles RLS
CREATE POLICY "Public profiles can be viewed by profile owner or admin"
ON public.profiles FOR SELECT
USING (auth.uid() = id OR public.is_admin(auth.uid()));

CREATE POLICY "Users can update their own profile or admin can update"
ON public.profiles FOR UPDATE
USING (auth.uid() = id OR public.is_admin(auth.uid()))
WITH CHECK (
    -- Non-admins cannot elevate their role to admin
    (auth.uid() = id AND role = (SELECT p.role FROM public.profiles p WHERE p.id = auth.uid()))
    OR public.is_admin(auth.uid())
);

-- 2. Categories RLS
CREATE POLICY "Active categories are viewable by everyone"
ON public.categories FOR SELECT
USING (is_active = TRUE OR public.is_admin(auth.uid()));

CREATE POLICY "Admins can insert categories"
ON public.categories FOR INSERT
WITH CHECK (public.is_admin(auth.uid()));

CREATE POLICY "Admins can update categories"
ON public.categories FOR UPDATE
USING (public.is_admin(auth.uid()));

CREATE POLICY "Admins can delete categories"
ON public.categories FOR DELETE
USING (public.is_admin(auth.uid()));

-- 3. Products RLS
CREATE POLICY "Active products are viewable by everyone"
ON public.products FOR SELECT
USING (is_active = TRUE OR public.is_admin(auth.uid()));

CREATE POLICY "Admins can insert products"
ON public.products FOR INSERT
WITH CHECK (public.is_admin(auth.uid()));

CREATE POLICY "Admins can update products"
ON public.products FOR UPDATE
USING (public.is_admin(auth.uid()));

CREATE POLICY "Admins can delete products"
ON public.products FOR DELETE
USING (public.is_admin(auth.uid()));

-- 4. Orders RLS
CREATE POLICY "Customers can view their own orders or admin can view all"
ON public.orders FOR SELECT
USING (auth.uid() = customer_id OR public.is_admin(auth.uid()));

CREATE POLICY "Customers can create orders"
ON public.orders FOR INSERT
WITH CHECK (auth.uid() = customer_id OR customer_id IS NULL OR public.is_admin(auth.uid()));

CREATE POLICY "Only admins can update orders"
ON public.orders FOR UPDATE
USING (public.is_admin(auth.uid()));

-- 5. Order Items RLS
CREATE POLICY "Customers can view order items for their orders or admin can view all"
ON public.order_items FOR SELECT
USING (
    EXISTS (
        SELECT 1 FROM public.orders o
        WHERE o.id = order_items.order_id
        AND (o.customer_id = auth.uid() OR public.is_admin(auth.uid()))
    )
);

CREATE POLICY "Customers can insert order items for their orders"
ON public.order_items FOR INSERT
WITH CHECK (
    EXISTS (
        SELECT 1 FROM public.orders o
        WHERE o.id = order_items.order_id
        AND (o.customer_id = auth.uid() OR o.customer_id IS NULL OR public.is_admin(auth.uid()))
    )
);

CREATE POLICY "Only admins can update order items"
ON public.order_items FOR UPDATE
USING (public.is_admin(auth.uid()));

-- 6. Store Settings RLS
CREATE POLICY "Store settings are viewable by everyone"
ON public.store_settings FOR SELECT
USING (TRUE);

CREATE POLICY "Only admins can update store settings"
ON public.store_settings FOR UPDATE
USING (public.is_admin(auth.uid()));
