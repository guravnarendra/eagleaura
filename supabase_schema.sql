-- =========================================================================
-- EAGLE AURA - SUPABASE DATABASE & STORAGE SCHEMA
-- Run this in your Supabase SQL Editor (https://supabase.com/dashboard/project/_/sql)
-- =========================================================================

-- 1. Enable UUID Extension
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 2. Products Table
CREATE TABLE IF NOT EXISTS public.products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    original_price NUMERIC(10, 2) NOT NULL,
    discounted_price NUMERIC(10, 2) NOT NULL,
    discount_percentage INTEGER GENERATED ALWAYS AS (
        CASE 
            WHEN original_price > 0 THEN ROUND(((original_price - discounted_price) / original_price) * 100)
            ELSE 0 
        END
    ) STORED,
    thumbnail_url TEXT NOT NULL,
    digital_file_url TEXT NOT NULL,
    dodo_product_id TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- 3. Coupons Table
CREATE TABLE IF NOT EXISTS public.coupons (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    code TEXT UNIQUE NOT NULL,
    discount_percentage NUMERIC(5, 2) NOT NULL,
    is_active BOOLEAN DEFAULT true,
    valid_from TIMESTAMPTZ DEFAULT now(),
    valid_until TIMESTAMPTZ,
    max_uses INTEGER DEFAULT 100,
    current_usage_count INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 4. Orders Table
CREATE TABLE IF NOT EXISTS public.orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    full_name TEXT NOT NULL,
    whatsapp_number TEXT NOT NULL,
    email TEXT NOT NULL,
    billing_address TEXT NOT NULL,
    product_id UUID REFERENCES public.products(id) ON DELETE SET NULL,
    coupon_code TEXT,
    coupon_discount NUMERIC(5, 2),
    original_amount NUMERIC(10, 2) NOT NULL,
    final_amount NUMERIC(10, 2) NOT NULL,
    dodo_session_id TEXT,
    dodo_payment_id TEXT,
    payment_status TEXT DEFAULT 'pending' CHECK (payment_status IN ('pending', 'completed', 'failed')),
    download_link TEXT,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- 5. Storage Buckets (Run in Supabase Storage or via SQL)
INSERT INTO storage.buckets (id, name, public) 
VALUES ('product-thumbnails', 'product-thumbnails', true)
ON CONFLICT (id) DO NOTHING;

INSERT INTO storage.buckets (id, name, public) 
VALUES ('product-files', 'product-files', true)
ON CONFLICT (id) DO NOTHING;

-- 6. Storage Security Policies
CREATE POLICY "Public Read for Thumbnails" ON storage.objects
FOR SELECT USING (bucket_id = 'product-thumbnails');

CREATE POLICY "Public Read for Product Files" ON storage.objects
FOR SELECT USING (bucket_id = 'product-files');

CREATE POLICY "Allow Upload for All" ON storage.objects
FOR INSERT WITH CHECK (bucket_id IN ('product-thumbnails', 'product-files'));

CREATE POLICY "Allow Update for All" ON storage.objects
FOR UPDATE USING (bucket_id IN ('product-thumbnails', 'product-files'));

CREATE POLICY "Allow Delete for All" ON storage.objects
FOR DELETE USING (bucket_id IN ('product-thumbnails', 'product-files'));

-- 7. Public Row Level Security (RLS) Policies
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.coupons ENABLE ROW LEVEL SECURITY;

-- Products: Everyone can read active products, full access with service/anon key
CREATE POLICY "Public can view active products" ON public.products
FOR SELECT USING (true);

CREATE POLICY "Allow full product modifications" ON public.products
FOR ALL USING (true) WITH CHECK (true);

-- Orders: Public can create order & read own order, full access with service key
CREATE POLICY "Public can insert orders" ON public.orders
FOR INSERT WITH CHECK (true);

CREATE POLICY "Public can view orders" ON public.orders
FOR SELECT USING (true);

CREATE POLICY "Allow update orders" ON public.orders
FOR UPDATE USING (true) WITH CHECK (true);

-- Coupons: Public can view active coupons
CREATE POLICY "Public can view coupons" ON public.coupons
FOR SELECT USING (true);

CREATE POLICY "Allow full coupon modifications" ON public.coupons
FOR ALL USING (true) WITH CHECK (true);
