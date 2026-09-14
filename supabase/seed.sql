-- Bajaj Karyan Store — Seed Data
-- Migration: supabase/seed.sql

-- 1. Store Settings (default row)
INSERT INTO public.store_settings (
    store_name, phone, email, address, city, state, pincode,
    opening_hours, delivery_info, footer_text, low_stock_threshold, default_delivery_charge, order_prefix
) VALUES (
    'Bajaj Karyan Store',
    '+91 98765 43210',
    'contact@bajajkaryan.com',
    'Shop No. 14, Main Market, Near Clock Tower',
    'Amritsar',
    'Punjab',
    '143001',
    'Mon - Sat: 8:00 AM - 9:30 PM | Sun: 9:00 AM - 7:00 PM',
    'Free doorstep delivery on orders above ₹500 across Amritsar',
    'Bajaj Karyan Store — Premium Confectionery & Daily Kiryana Essentials Since 1998',
    10,
    30,
    'BKS'
) ON CONFLICT DO NOTHING;

-- 2. Categories
INSERT INTO public.categories (id, name, slug, description, image_url, sort_order) VALUES
('c0000000-0000-0000-0000-000000000001', 'Biscuits & Cookies', 'biscuits-cookies', 'Crispy, freshly stocked tea-time biscuits and cookies', 'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?auto=format&fit=crop&w=600&q=80', 1),
('c0000000-0000-0000-0000-000000000002', 'Chocolates & Candies', 'chocolates-candies', 'Delicious milk chocolates, dark bars, toffees and candies', 'https://images.unsplash.com/photo-1511381939415-e44015466834?auto=format&fit=crop&w=600&q=80', 2),
('c0000000-0000-0000-0000-000000000003', 'Namkeen & Savories', 'namkeen-savories', 'Traditional bhujia, mixtures, roasted snacks and chips', 'https://images.unsplash.com/photo-1566478989037-eec170784d0b?auto=format&fit=crop&w=600&q=80', 3),
('c0000000-0000-0000-0000-000000000004', 'Bakery & Rusks', 'bakery-rusks', 'Oven fresh rusks, cakes, buns, and morning toasts', 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=600&q=80', 4),
('c0000000-0000-0000-0000-000000000005', 'Dry Fruits & Nuts', 'dry-fruits-nuts', 'Handpicked almonds, cashews, raisins, walnuts and pistachios', 'https://images.unsplash.com/photo-1596591606975-97ee5cef3a1e?auto=format&fit=crop&w=600&q=80', 5),
('c0000000-0000-0000-0000-000000000006', 'Staples & Grocery', 'staples-grocery', 'Pure atta, aromatic basmati rice, dals, pulses and spices', 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=600&q=80', 6),
('c0000000-0000-0000-0000-000000000007', 'Cooking Oils & Ghee', 'cooking-oils-ghee', 'Refined oils, mustard oil, and pure desi ghee', 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&w=600&q=80', 7),
('c0000000-0000-0000-0000-000000000008', 'Beverages & Syrups', 'beverages-syrups', 'Cold drinks, juices, instant coffee, tea leaves and squash', 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?auto=format&fit=crop&w=600&q=80', 8)
ON CONFLICT (id) DO NOTHING;

-- 3. Products
INSERT INTO public.products (category_id, name, slug, description, image_url, price, sale_price, unit_type, unit_value, sku, stock_quantity, is_available, is_featured, is_active) VALUES
-- Biscuits
('c0000000-0000-0000-0000-000000000001', 'Parle-G Gold Biscuits', 'parle-g-gold-biscuits', 'Iconic glucose biscuits with rich taste and energy.', 'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?auto=format&fit=crop&w=600&q=80', 25.00, 22.00, 'packet', 1, 'PARLE-01', 150, TRUE, TRUE, TRUE),
('c0000000-0000-0000-0000-000000000001', 'Britannia Good Day Cashew', 'britannia-good-day-cashew', 'Rich butter cookies with delightful crunchy cashew nuts.', 'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?auto=format&fit=crop&w=600&q=80', 40.00, 38.00, 'packet', 1, 'BRIT-01', 80, TRUE, TRUE, TRUE),
('c0000000-0000-0000-0000-000000000001', 'Oreo Vanilla Creme', 'oreo-vanilla-creme', 'Classic crunchy chocolate cookies with sweet vanilla cream filling.', 'https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?auto=format&fit=crop&w=600&q=80', 35.00, 35.00, 'packet', 1, 'OREO-01', 120, TRUE, FALSE, TRUE),

-- Chocolates
('c0000000-0000-0000-0000-000000000002', 'Cadbury Dairy Milk Silk', 'cadbury-dairy-milk-silk', 'Pure, smooth and velvety milk chocolate experience.', 'https://images.unsplash.com/photo-1549007994-cb92caebd54b?auto=format&fit=crop&w=600&q=80', 85.00, 80.00, 'piece', 1, 'CAD-SILK-01', 60, TRUE, TRUE, TRUE),
('c0000000-0000-0000-0000-000000000002', 'Ferrero Rocher Box (16 pcs)', 'ferrero-rocher-box-16', 'Crispy hazelnut and milk chocolate specialty pralines in a golden gift box.', 'https://images.unsplash.com/photo-1548741487-18d16a145e80?auto=format&fit=crop&w=600&q=80', 549.00, 499.00, 'box', 1, 'FERR-16', 25, TRUE, TRUE, TRUE),
('c0000000-0000-0000-0000-000000000002', 'Assorted Toffee Gift Pack', 'assorted-toffee-gift-pack', 'Mixed butter toffees, eclairs, and fruit candies in an attractive pack.', 'https://images.unsplash.com/photo-1582058091505-f87a2e55a40f?auto=format&fit=crop&w=600&q=80', NULL, NULL, 'packet', 1, 'TOFF-GIFT-01', 40, TRUE, FALSE, TRUE), -- Price on request

-- Namkeen
('c0000000-0000-0000-0000-000000000003', 'Haldiram Aloo Bhujia', 'haldiram-aloo-bhujia', 'Spicy potato sev with classic Indian spices.', 'https://images.unsplash.com/photo-1566478989037-eec170784d0b?auto=format&fit=crop&w=600&q=80', 55.00, 50.00, 'packet', 1, 'HAL-ALOO-01', 90, TRUE, TRUE, TRUE),
('c0000000-0000-0000-0000-000000000003', 'Bikaji Navratna Mixture', 'bikaji-navratna-mixture', 'Delicious blend of crispy chickpeas, lentils, peanuts, and sev.', 'https://images.unsplash.com/photo-1566478989037-eec170784d0b?auto=format&fit=crop&w=600&q=80', 60.00, 58.00, 'packet', 1, 'BIK-NAV-01', 45, TRUE, FALSE, TRUE),

-- Bakery
('c0000000-0000-0000-0000-000000000004', 'Supper Club Premium Cake Rusk', 'premium-cake-rusk', 'Twice-baked aromatic bakery rusks infused with cardamom and butter.', 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=600&q=80', 120.00, 110.00, 'box', 1, 'RUSK-01', 30, TRUE, TRUE, TRUE),

-- Dry Fruits (Weight based & Price on Request)
('c0000000-0000-0000-0000-000000000005', 'California Almonds (Badam Giri)', 'california-almonds', 'Premium quality, sweet, crunchy whole almonds.', 'https://images.unsplash.com/photo-1596591606975-97ee5cef3a1e?auto=format&fit=crop&w=600&q=80', 480.00, 460.00, 'kg', 0.5, 'DRY-ALM-500', 40, TRUE, TRUE, TRUE),
('c0000000-0000-0000-0000-000000000005', 'Whole Cashews (Kaju W320)', 'whole-cashews-kaju', 'Plump, spotless white whole cashew nuts.', 'https://images.unsplash.com/photo-1536591375315-1b83681e3be6?auto=format&fit=crop&w=600&q=80', 550.00, 520.00, 'kg', 0.5, 'DRY-KAJU-500', 35, TRUE, TRUE, TRUE),
('c0000000-0000-0000-0000-000000000005', 'Kashmiri Walnut Kernels (Akhrot Giri)', 'kashmiri-walnut-kernels', 'Light quarter and half walnut kernels with high natural oil content.', 'https://images.unsplash.com/photo-1596591606975-97ee5cef3a1e?auto=format&fit=crop&w=600&q=80', NULL, NULL, 'kg', 0.5, 'DRY-WAL-500', 20, TRUE, FALSE, TRUE), -- Price on request
('c0000000-0000-0000-0000-000000000005', 'Royal Festive Dry Fruit Box', 'royal-festive-dry-fruit-box', 'Custom-packed luxury gift hamper with almonds, cashews, raisins, and pistachios.', 'https://images.unsplash.com/photo-1596591606975-97ee5cef3a1e?auto=format&fit=crop&w=600&q=80', NULL, NULL, 'box', 1, 'DRY-GIFT-ROYAL', 15, TRUE, TRUE, TRUE), -- Price on request

-- Staples & Grocery
('c0000000-0000-0000-0000-000000000006', 'Aashirvaad Shudh Chakki Atta', 'aashirvaad-shudh-chakki-atta', '100% whole wheat flour for soft, fluffy rotis.', 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=600&q=80', 245.00, 235.00, 'kg', 5, 'GR-ATTA-5KG', 50, TRUE, TRUE, TRUE),
('c0000000-0000-0000-0000-000000000006', 'Refined Fine Sugar (Khandsari/Cheeni)', 'refined-fine-sugar', 'Clean, sparkling crystal sugar for tea, sweets, and baking.', 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=600&q=80', 48.00, 46.00, 'kg', 1, 'GR-SUGAR-1KG', 200, TRUE, FALSE, TRUE),
('c0000000-0000-0000-0000-000000000006', 'Daawat Super Basmati Rice', 'daawat-super-basmati-rice', 'Long grain aged aromatic rice, perfect for biryanis and pulao.', 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=600&q=80', 145.00, 140.00, 'kg', 1, 'GR-RICE-1KG', 80, TRUE, TRUE, TRUE),
('c0000000-0000-0000-0000-000000000006', 'Tata Salt Vaccum Evaporated', 'tata-salt-vaccum-evaporated', 'Iodized table salt with essential nutrients.', 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=600&q=80', 28.00, 26.00, 'packet', 1, 'GR-SALT-1KG', 120, TRUE, FALSE, TRUE),

-- Cooking Oils
('c0000000-0000-0000-0000-000000000007', 'Fortune Sunlite Refined Sunflower Oil', 'fortune-sunlite-sunflower-oil', 'Light and healthy cooking oil enriched with vitamins A & D.', 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&w=600&q=80', 145.00, 138.00, 'litre', 1, 'OIL-FORT-1L', 60, TRUE, TRUE, TRUE),
('c0000000-0000-0000-0000-000000000007', 'Amul Pure Desi Ghee Tin', 'amul-pure-desi-ghee-tin', 'Traditional golden aromatic pure cow & buffalo milk ghee.', 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&w=600&q=80', 610.00, 595.00, 'litre', 1, 'GHEE-AMUL-1L', 30, TRUE, TRUE, TRUE)
ON CONFLICT (slug) DO NOTHING;
