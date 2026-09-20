-- Bajaj karyana Store — Storage Setup & Expanded Catalog Migration
-- Migration: 20260915000000_storage_and_catalog.sql

-- 1. Create Public Storage Bucket 'store'
INSERT INTO storage.buckets (id, name, public)
VALUES ('store', 'store', TRUE)
ON CONFLICT (id) DO NOTHING;

-- Policies for 'store' bucket
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies
        WHERE schemaname = 'storage' AND tablename = 'objects' AND policyname = 'Public Access to Store Bucket'
    ) THEN
        CREATE POLICY "Public Access to Store Bucket"
        ON storage.objects FOR SELECT
        USING (bucket_id = 'store');
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM pg_policies
        WHERE schemaname = 'storage' AND tablename = 'objects' AND policyname = 'Allow Uploads to Store Bucket'
    ) THEN
        CREATE POLICY "Allow Uploads to Store Bucket"
        ON storage.objects FOR INSERT
        WITH CHECK (bucket_id = 'store');
    END IF;
END $$;

-- 2. Upsert 16 Store Categories
INSERT INTO public.categories (id, name, slug, description, image_url, sort_order) VALUES
('c0000000-0000-0000-0000-000000000001', 'Biscuits & Cookies', 'biscuits-cookies', 'Crispy, freshly stocked tea-time biscuits and cookies', '/images/categories/biscuits-cookies.jpg', 1),
('c0000000-0000-0000-0000-000000000002', 'Chocolates & Candies', 'chocolates-candies', 'Delicious milk chocolates, dark bars, toffees and candies', '/images/categories/chocolates-candies.jpg', 2),
('c0000000-0000-0000-0000-000000000003', 'Namkeen & Savories', 'namkeen-savories', 'Traditional bhujia, mixtures, roasted snacks and chips', '/images/categories/namkeen-savories.jpg', 3),
('c0000000-0000-0000-0000-000000000004', 'Bakery & Rusks', 'bakery-rusks', 'Oven fresh rusks, cakes, buns, and morning toasts', '/images/categories/bakery-rusks.jpg', 4),
('c0000000-0000-0000-0000-000000000005', 'Dry Fruits & Nuts', 'dry-fruits-nuts', 'Handpicked almonds, cashews, raisins, walnuts and pistachios', '/images/categories/dry-fruits-nuts.jpg', 5),
('c0000000-0000-0000-0000-000000000006', 'Staples & Grocery', 'staples-grocery', 'Pure chakki atta, aromatic basmati rice, sugar and salt', '/images/categories/staples-grocery.jpg', 6),
('c0000000-0000-0000-0000-000000000007', 'Cooking Oils & Ghee', 'cooking-oils-ghee', 'Refined sunflower oil, mustard oil, and pure desi ghee', '/images/categories/cooking-oils-ghee.jpg', 7),
('c0000000-0000-0000-0000-000000000008', 'Beverages & Syrups', 'beverages-syrups', 'Cold drinks, juices, instant coffee, tea leaves and sharbat', '/images/categories/beverages-syrups.jpg', 8),
('c0000000-0000-0000-0000-000000000009', 'Spices & Whole Masalas', 'spices-masalas', 'Aromatic turmeric, red chilli, garam masala, cumin & hing', '/images/categories/spices-masalas.jpg', 9),
('c0000000-0000-0000-0000-000000000010', 'Dals, Pulses & Legumes', 'dals-pulses', 'High-protein chana dal, toor dal, moong, rajma and kabuli chana', '/images/categories/dals-pulses.jpg', 10),
('c0000000-0000-0000-0000-000000000011', 'Breakfast, Cereals & Oats', 'breakfast-cereals', 'Wholesome corn flakes, rolled oats, sooji, and roasted poha', '/images/categories/breakfast-cereals.jpg', 11),
('c0000000-0000-0000-0000-000000000012', 'Dairy & Packaged Foods', 'dairy-packaged', 'Fresh butter, cheese slices, milk powder, and dairy essentials', '/images/categories/dairy-packaged.jpg', 12),
('c0000000-0000-0000-0000-000000000013', 'Tea, Coffee & Health Drinks', 'tea-coffee', 'Strong CTC tea, filter coffee, Nescafe, and Bournvita jars', '/images/categories/tea-coffee.jpg', 13),
('c0000000-0000-0000-0000-000000000014', 'Sauces, Spreads & Jams', 'sauces-spreads', 'Sweet fruit jams, tangy tomato ketchups, and pure honey', '/images/categories/sauces-spreads.jpg', 14),
('c0000000-0000-0000-0000-000000000015', 'Personal Care & Hygiene', 'personal-care', 'Soaps, toothpastes, shampoos, and laundry detergent powders', '/images/categories/personal-care.jpg', 15),
('c0000000-0000-0000-0000-000000000016', 'Pooja & Festive Essentials', 'pooja-essentials', 'Bhimseni camphor, fragrant agarbatti, dhoop and cotton batti', '/images/categories/pooja-essentials.jpg', 16)
ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    slug = EXCLUDED.slug,
    description = EXCLUDED.description,
    image_url = EXCLUDED.image_url,
    sort_order = EXCLUDED.sort_order;

-- 3. Upsert Products Across All Categories
INSERT INTO public.products (
    category_id, name, slug, description, image_url, price, sale_price, unit_type, unit_value, sku, stock_quantity, is_available, is_featured, is_active
) VALUES
-- Biscuits & Cookies
('c0000000-0000-0000-0000-000000000001', 'Parle-G Gold Biscuits', 'parle-g-gold-biscuits', 'Iconic glucose biscuits with rich taste and energy for the entire family.', '/images/products/parle-g-gold-biscuits.jpg', 25.00, 22.00, 'packet', 1, 'PARLE-01', 150, TRUE, TRUE, TRUE),
('c0000000-0000-0000-0000-000000000001', 'Britannia Good Day Cashew', 'britannia-good-day-cashew', 'Rich butter cookies with delightful crunchy cashew nuts.', '/images/products/britannia-good-day-cashew.jpg', 40.00, 38.00, 'packet', 1, 'BRIT-01', 80, TRUE, TRUE, TRUE),
('c0000000-0000-0000-0000-000000000001', 'Oreo Vanilla Creme', 'oreo-vanilla-creme', 'Classic crunchy chocolate cookies with sweet vanilla cream filling.', '/images/products/oreo-vanilla-creme.jpg', 35.00, 35.00, 'packet', 1, 'OREO-01', 120, TRUE, FALSE, TRUE),
('c0000000-0000-0000-0000-000000000001', 'Britannia Bourbon Chocolate', 'britannia-bourbon-chocolate', 'Crisp chocolate biscuits with rich smooth chocolate cream and sugar crystals.', '/images/products/britannia-bourbon-chocolate.jpg', 30.00, 28.00, 'packet', 1, 'BOUR-01', 75, TRUE, FALSE, TRUE),

-- Chocolates & Candies
('c0000000-0000-0000-0000-000000000002', 'Cadbury Dairy Milk Silk', 'cadbury-dairy-milk-silk', 'Pure, smooth and velvety milk chocolate experience.', '/images/products/cadbury-dairy-milk-silk.jpg', 85.00, 80.00, 'piece', 1, 'CAD-SILK-01', 60, TRUE, TRUE, TRUE),
('c0000000-0000-0000-0000-000000000002', 'Ferrero Rocher Box (16 pcs)', 'ferrero-rocher-box-16', 'Crispy hazelnut and milk chocolate specialty pralines in a golden gift box.', '/images/products/ferrero-rocher-box-16.jpg', 549.00, 499.00, 'box', 1, 'FERR-16', 25, TRUE, TRUE, TRUE),
('c0000000-0000-0000-0000-000000000002', 'Assorted Toffee Gift Pack', 'assorted-toffee-gift-pack', 'Mixed butter toffees, eclairs, and fruit candies in an attractive pack.', '/images/products/assorted-toffee-gift-pack.jpg', NULL, NULL, 'packet', 1, 'TOFF-GIFT-01', 40, TRUE, FALSE, TRUE),
('c0000000-0000-0000-0000-000000000002', 'KitKat 4-Finger Chocolate Bar', 'kitkat-4-finger-pack', 'Crisp wafer fingers covered in creamy milk chocolate.', '/images/products/kitkat-4-finger-pack.jpg', 30.00, 28.00, 'piece', 1, 'KITKAT-01', 90, TRUE, FALSE, TRUE),

-- Namkeen & Savories
('c0000000-0000-0000-0000-000000000003', 'Haldiram Aloo Bhujia', 'haldiram-aloo-bhujia', 'Spicy potato sev with classic Indian spices.', '/images/products/haldiram-aloo-bhujia.jpg', 55.00, 50.00, 'packet', 1, 'HAL-ALOO-01', 90, TRUE, TRUE, TRUE),
('c0000000-0000-0000-0000-000000000003', 'Bikaji Navratna Mixture', 'bikaji-navratna-mixture', 'Delicious blend of crispy chickpeas, lentils, peanuts, and sev.', '/images/products/bikaji-navratna-mixture.jpg', 60.00, 58.00, 'packet', 1, 'BIK-NAV-01', 45, TRUE, FALSE, TRUE),
('c0000000-0000-0000-0000-000000000003', 'Lays India Magic Masala', 'lays-india-magic-masala', 'Spicy aromatic potato wafers seasoned with Indian herbs and spices.', '/images/products/lays-india-magic-masala.jpg', 20.00, 20.00, 'packet', 1, 'LAYS-MM-01', 110, TRUE, FALSE, TRUE),
('c0000000-0000-0000-0000-000000000003', 'Roasted Salted Peanuts (Moongphali)', 'roasted-salted-peanuts', 'Crispy oven-roasted golden peanuts sprinkled with iodized salt.', '/images/products/roasted-salted-peanuts.jpg', 40.00, 38.00, 'packet', 1, 'PEA-SALT-01', 50, TRUE, FALSE, TRUE),

-- Bakery & Rusks
('c0000000-0000-0000-0000-000000000004', 'Supper Club Premium Cake Rusk', 'premium-cake-rusk', 'Twice-baked aromatic bakery rusks infused with cardamom and butter.', '/images/products/premium-cake-rusk.jpg', 120.00, 110.00, 'box', 1, 'RUSK-01', 30, TRUE, TRUE, TRUE),
('c0000000-0000-0000-0000-000000000004', 'Britannia Premium Suji Rusk', 'britannia-suji-rusk', 'Crispy suji rusks enhanced with the natural aroma of elaichi.', '/images/products/britannia-suji-rusk.jpg', 50.00, 48.00, 'packet', 1, 'RUSK-SUJI-01', 65, TRUE, FALSE, TRUE),
('c0000000-0000-0000-0000-000000000004', 'Fresh Mixed Fruit Cake Slices', 'fresh-fruit-cake-slice', 'Soft and moist golden sponge cake infused with colourful candied tutti frutti.', '/images/products/fresh-fruit-cake-slice.jpg', 30.00, 28.00, 'packet', 1, 'CAKE-FRUIT-01', 40, TRUE, FALSE, TRUE),

-- Dry Fruits & Nuts
('c0000000-0000-0000-0000-000000000005', 'California Almonds (Badam Giri)', 'california-almonds', 'Premium quality, sweet, crunchy whole almonds rich in protein.', '/images/products/california-almonds.jpg', 480.00, 460.00, 'kg', 0.5, 'DRY-ALM-500', 40, TRUE, TRUE, TRUE),
('c0000000-0000-0000-0000-000000000005', 'Whole Cashews (Kaju W320)', 'whole-cashews-kaju', 'Plump, spotless white whole cashew nuts.', '/images/products/whole-cashews-kaju.jpg', 550.00, 520.00, 'kg', 0.5, 'DRY-KAJU-500', 35, TRUE, TRUE, TRUE),
('c0000000-0000-0000-0000-000000000005', 'Kashmiri Walnut Kernels (Akhrot Giri)', 'kashmiri-walnut-kernels', 'Light quarter and half walnut kernels with high natural omega-3 oil content.', '/images/products/kashmiri-walnut-kernels.jpg', NULL, NULL, 'kg', 0.5, 'DRY-WAL-500', 20, TRUE, FALSE, TRUE),
('c0000000-0000-0000-0000-000000000005', 'Long Green Seedless Raisins (Kishmish)', 'green-raisins-kishmish', 'Naturally sweet, sun-dried green raisins, clean and free from stems.', '/images/products/green-raisins-kishmish.jpg', 180.00, 170.00, 'kg', 0.5, 'DRY-RAIS-500', 30, TRUE, FALSE, TRUE),
('c0000000-0000-0000-0000-000000000005', 'Royal Festive Dry Fruit Box', 'royal-festive-dry-fruit-box', 'Custom-packed luxury gift hamper with almonds, cashews, raisins, and pistachios.', '/images/products/royal-festive-dry-fruit-box.jpg', NULL, NULL, 'box', 1, 'DRY-GIFT-ROYAL', 15, TRUE, TRUE, TRUE),

-- Staples & Grocery
('c0000000-0000-0000-0000-000000000006', 'Aashirvaad Shudh Chakki Atta', 'aashirvaad-shudh-chakki-atta', '100% whole wheat flour for soft, fluffy rotis.', '/images/products/aashirvaad-shudh-chakki-atta.jpg', 245.00, 235.00, 'kg', 5, 'GR-ATTA-5KG', 50, TRUE, TRUE, TRUE),
('c0000000-0000-0000-0000-000000000006', 'Refined Fine Sugar (Khandsari)', 'refined-fine-sugar', 'Clean, sparkling crystal sugar for tea, sweets, and everyday baking.', '/images/products/refined-fine-sugar.jpg', 48.00, 46.00, 'kg', 1, 'GR-SUGAR-1KG', 200, TRUE, FALSE, TRUE),
('c0000000-0000-0000-0000-000000000006', 'Daawat Super Basmati Rice', 'daawat-super-basmati-rice', 'Long grain aged aromatic rice, perfect for biryanis and pulao.', '/images/products/daawat-super-basmati-rice.jpg', 145.00, 140.00, 'kg', 1, 'GR-RICE-1KG', 80, TRUE, TRUE, TRUE),
('c0000000-0000-0000-0000-000000000006', 'Tata Salt Vaccum Evaporated', 'tata-salt-vaccum-evaporated', 'Iodized table salt with essential nutrients.', '/images/products/tata-salt-vaccum-evaporated.jpg', 28.00, 26.00, 'packet', 1, 'GR-SALT-1KG', 120, TRUE, FALSE, TRUE),

-- Cooking Oils & Ghee
('c0000000-0000-0000-0000-000000000007', 'Fortune Sunlite Refined Sunflower Oil', 'fortune-sunlite-sunflower-oil', 'Light and healthy cooking oil enriched with vitamins A & D.', '/images/products/fortune-sunlite-sunflower-oil.jpg', 145.00, 138.00, 'litre', 1, 'OIL-FORT-1L', 60, TRUE, TRUE, TRUE),
('c0000000-0000-0000-0000-000000000007', 'Amul Pure Desi Ghee Tin', 'amul-pure-desi-ghee-tin', 'Traditional golden aromatic pure cow & buffalo milk ghee.', '/images/products/amul-pure-desi-ghee-tin.jpg', 610.00, 595.00, 'litre', 1, 'GHEE-AMUL-1L', 30, TRUE, TRUE, TRUE),
('c0000000-0000-0000-0000-000000000007', 'Fortune Kachi Ghani Mustard Oil', 'fortune-kachi-ghani-mustard-oil', 'Cold pressed mustard oil with strong pungency and authentic aroma for pickles and curries.', '/images/products/fortune-kachi-ghani-mustard-oil.jpg', 165.00, 155.00, 'litre', 1, 'OIL-MUST-1L', 45, TRUE, FALSE, TRUE),

-- Beverages & Syrups
('c0000000-0000-0000-0000-000000000008', 'Thums Up Cold Drink Bottle (750ml)', 'thums-up-bottle-750ml', 'Strong, fizzy carbonated cola refreshment.', '/images/products/thums-up-bottle-750ml.jpg', 40.00, 38.00, 'piece', 1, 'BEV-THUMS-750', 50, TRUE, FALSE, TRUE),
('c0000000-0000-0000-0000-000000000008', 'Hamdard Rooh Afza Sharbat Bottle', 'rooh-afza-sharbat-bottle', 'Refreshing natural herbal syrup with rose extracts, ideal for summer drinks and milkshakes.', '/images/products/rooh-afza-sharbat-bottle.jpg', 170.00, 160.00, 'piece', 1, 'BEV-ROOH-750', 35, TRUE, TRUE, TRUE),
('c0000000-0000-0000-0000-000000000008', 'Frooti Fresh Mango Drink (Tetrapack)', 'frooti-mango-drink-pack', 'Classic sweet juicy mango drink made from real mango pulp.', '/images/products/frooti-mango-drink-pack.jpg', 10.00, 10.00, 'piece', 1, 'BEV-FROO-160', 100, TRUE, FALSE, TRUE),

-- Spices & Whole Masalas
('c0000000-0000-0000-0000-000000000009', 'Pure Turmeric Powder (Haldi)', 'turmeric-powder-haldi', 'Vibrant golden ground turmeric with high natural curcumin content.', '/images/products/turmeric-powder-haldi.jpg', 55.00, 52.00, 'packet', 1, 'SPICE-HAL-200', 80, TRUE, TRUE, TRUE),
('c0000000-0000-0000-0000-000000000009', 'Kashmiri Red Chilli Powder (Deggi Mirch)', 'kashmiri-red-chilli-powder', 'Mild pungency with deep radiant red color for curries.', '/images/products/kashmiri-red-chilli-powder.jpg', 75.00, 70.00, 'packet', 1, 'SPICE-MIRCH-200', 70, TRUE, TRUE, TRUE),
('c0000000-0000-0000-0000-000000000009', 'MDH Super Garam Masala', 'mdh-garam-masala', 'Traditional blend of whole spices for rich authentic gravy and vegetable curries.', '/images/products/mdh-garam-masala.jpg', 88.00, 85.00, 'box', 1, 'SPICE-MDH-100', 60, TRUE, FALSE, TRUE),
('c0000000-0000-0000-0000-000000000009', 'Whole Cumin Seeds (Sabut Jeera)', 'cumin-seeds-sabut-jeera', 'Machine-cleaned aromatic whole cumin seeds for tempering.', '/images/products/cumin-seeds-sabut-jeera.jpg', 95.00, 90.00, 'packet', 1, 'SPICE-JEERA-200', 65, TRUE, FALSE, TRUE),

-- Dals, Pulses & Legumes
('c0000000-0000-0000-0000-000000000010', 'Desi Chana Dal', 'chana-dal-desi', 'Unpolished protein-rich split Bengal gram, cooks evenly.', '/images/products/chana-dal-desi.jpg', 95.00, 90.00, 'kg', 1, 'DAL-CHANA-1KG', 85, TRUE, TRUE, TRUE),
('c0000000-0000-0000-0000-000000000010', 'Punjabi Chitra Rajma (Kidney Beans)', 'punjabi-chitra-rajma', 'Soft-boiling speckled red kidney beans for authentic Punjabi rajma-chawal.', '/images/products/punjabi-chitra-rajma.jpg', 160.00, 150.00, 'kg', 1, 'DAL-RAJ-1KG', 50, TRUE, TRUE, TRUE),
('c0000000-0000-0000-0000-000000000010', 'Moong Dal Dhuli (Yellow Lentils)', 'moong-dal-dhuli', 'Easy-to-digest washed yellow split lentils for khichdi and everyday soup.', '/images/products/moong-dal-dhuli.jpg', 130.00, 125.00, 'kg', 1, 'DAL-MOONG-1KG', 60, TRUE, FALSE, TRUE),
('c0000000-0000-0000-0000-000000000010', 'Big Size Kabuli Chana (Chole)', 'kabuli-chana-big', 'Spotless large white chickpeas, perfect for Amritsari Pindi Chole.', '/images/products/kabuli-chana-big.jpg', 155.00, 145.00, 'kg', 1, 'DAL-CHOLE-1KG', 55, TRUE, TRUE, TRUE),

-- Breakfast, Cereals & Oats
('c0000000-0000-0000-0000-000000000011', 'Kellogg''s Original Corn Flakes', 'kelloggs-corn-flakes', 'Crunchy golden corn flakes enriched with vitamins and iron.', '/images/products/kelloggs-corn-flakes.jpg', 185.00, 175.00, 'box', 1, 'BF-CORN-475', 40, TRUE, TRUE, TRUE),
('c0000000-0000-0000-0000-000000000011', 'Quaker Rolled Whole Oats', 'quaker-rolled-oats', '100% whole grain oats for heart-healthy breakfast porridge and smoothies.', '/images/products/quaker-rolled-oats.jpg', 190.00, 180.00, 'packet', 1, 'BF-OATS-1KG', 45, TRUE, FALSE, TRUE),
('c0000000-0000-0000-0000-000000000011', 'Roasted Thick Poha (Flattened Rice)', 'roasted-poha-thick', 'Clean, flattened rice flakes for quick breakfast poha or evening snacks.', '/images/products/roasted-poha-thick.jpg', 55.00, 50.00, 'kg', 1, 'BF-POHA-1KG', 70, TRUE, FALSE, TRUE),

-- Dairy & Packaged Foods
('c0000000-0000-0000-0000-000000000012', 'Amul Pasteurised Butter', 'amul-pasteurised-butter', 'Utterly butterly delicious salted table butter.', '/images/products/amul-pasteurised-butter.jpg', 275.00, 270.00, 'packet', 1, 'DAIRY-BUTTER-500', 60, TRUE, TRUE, TRUE),
('c0000000-0000-0000-0000-000000000012', 'Britannia Cheese Slices (10 pcs)', 'britannia-cheese-slices', 'Individually wrapped creamy processed cheddar cheese slices for sandwiches and burgers.', '/images/products/britannia-cheese-slices.jpg', 150.00, 140.00, 'packet', 1, 'DAIRY-CHEESE-10', 35, TRUE, FALSE, TRUE),
('c0000000-0000-0000-0000-000000000012', 'Nestle Everyday Dairy Whitener', 'nestle-everyday-dairy-whitener', 'Speciality milk powder that mixes seamlessly with tea and coffee.', '/images/products/nestle-everyday-dairy-whitener.jpg', 240.00, 230.00, 'packet', 1, 'DAIRY-MILK-400', 45, TRUE, FALSE, TRUE),

-- Tea, Coffee & Health Drinks
('c0000000-0000-0000-0000-000000000013', 'Wagh Bakri Premium CTC Leaf Tea', 'wagh-bakri-premium-tea', 'Strong, consistent blend of finest Assam tea leaves for refreshing morning chai.', '/images/products/wagh-bakri-premium-tea.jpg', 280.00, 265.00, 'packet', 1, 'TEA-WAGH-500', 60, TRUE, TRUE, TRUE),
('c0000000-0000-0000-0000-000000000013', 'Nescafe Classic Instant Coffee Jar', 'nescafe-classic-instant-coffee', '100% pure instant coffee with unmistakable aroma and bold taste.', '/images/products/nescafe-classic-instant-coffee.jpg', 175.00, 165.00, 'piece', 1, 'COFF-NES-50G', 50, TRUE, TRUE, TRUE),
('c0000000-0000-0000-0000-000000000013', 'Cadbury Bournvita Health Drink Jar', 'cadbury-bournvita-health-drink', 'Malted chocolate health drink with essential vitamins, iron, and calcium.', '/images/products/cadbury-bournvita-health-drink.jpg', 245.00, 235.00, 'piece', 1, 'DRINK-BOURN-500', 40, TRUE, FALSE, TRUE),

-- Sauces, Spreads & Jams
('c0000000-0000-0000-0000-000000000014', 'Kissan Mixed Fruit Jam Jar', 'kissan-mixed-fruit-jam', 'Blend of 8 real fruits for delicious morning toast and roti rolls.', '/images/products/kissan-mixed-fruit-jam.jpg', 160.00, 150.00, 'piece', 1, 'JAM-KISS-500', 45, TRUE, TRUE, TRUE),
('c0000000-0000-0000-0000-000000000014', 'Maggi Rich Tomato Ketchup Bottle', 'maggi-rich-tomato-ketchup', 'Classic tangy tomato sauce bottle made from vine-ripened tomatoes.', '/images/products/maggi-rich-tomato-ketchup.jpg', 130.00, 120.00, 'piece', 1, 'SAUCE-MAG-500', 60, TRUE, FALSE, TRUE),
('c0000000-0000-0000-0000-000000000014', 'Dabur 100% Pure Honey Squeezy', 'dabur-pure-honey-squeezy', 'Natural pure honey in an easy-squeeze drip-free bottle.', '/images/products/dabur-pure-honey-squeezy.jpg', 199.00, 185.00, 'piece', 1, 'HONEY-DAB-400', 35, TRUE, TRUE, TRUE),

-- Personal Care & Hygiene
('c0000000-0000-0000-0000-000000000015', 'Dettol Original Antiseptic Soap (Pack of 3)', 'dettol-original-soap-bar', 'Trusted 99.9% germ protection bar soap with classic pine fragrance.', '/images/products/dettol-original-soap-bar.jpg', 125.00, 115.00, 'packet', 1, 'PC-DETT-3PK', 50, TRUE, TRUE, TRUE),
('c0000000-0000-0000-0000-000000000015', 'Colgate Strong Teeth Toothpaste', 'colgate-strong-teeth-paste', 'Calcium-boost formula for strong teeth and fresh breath.', '/images/products/colgate-strong-teeth-paste.jpg', 110.00, 100.00, 'piece', 1, 'PC-COLG-200', 70, TRUE, FALSE, TRUE),
('c0000000-0000-0000-0000-000000000015', 'Surf Excel Easy Wash Detergent Powder', 'surf-excel-easy-wash-powder', 'Advanced stain removal detergent powder for sparkling clean clothes.', '/images/products/surf-excel-easy-wash-powder.jpg', 145.00, 138.00, 'kg', 1, 'PC-SURF-1KG', 65, TRUE, FALSE, TRUE),

-- Pooja & Festive Essentials
('c0000000-0000-0000-0000-000000000016', 'Pure Bhimseni Camphor (Kapoori Tablets)', 'pure-bhimseni-camphor', '100% pure organic camphor flakes for daily pooja, havan, and pleasant fragrance.', '/images/products/pure-bhimseni-camphor.jpg', 120.00, 110.00, 'box', 1, 'POOJA-KAP-100', 40, TRUE, TRUE, TRUE),
('c0000000-0000-0000-0000-000000000016', 'Cycle Pure Agarbatti Zipper Pack', 'cycle-pure-agarbatti-pack', 'Long-lasting fragrant incense sticks for prayer and peaceful ambiance.', '/images/products/cycle-pure-agarbatti-pack.jpg', 60.00, 55.00, 'packet', 1, 'POOJA-AGAR-1', 75, TRUE, TRUE, TRUE),
('c0000000-0000-0000-0000-000000000016', 'Pure Cotton Phool Batti (Diya Wicks)', 'pure-cotton-phool-batti', 'Hand-rolled round cotton wicks for oil and ghee brass diyas.', '/images/products/pure-cotton-phool-batti.jpg', 35.00, 30.00, 'packet', 1, 'POOJA-BATTI-100', 90, TRUE, FALSE, TRUE)
ON CONFLICT (slug) DO UPDATE SET
    category_id = EXCLUDED.category_id,
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    image_url = EXCLUDED.image_url,
    price = EXCLUDED.price,
    sale_price = EXCLUDED.sale_price,
    unit_type = EXCLUDED.unit_type,
    unit_value = EXCLUDED.unit_value,
    sku = EXCLUDED.sku,
    stock_quantity = EXCLUDED.stock_quantity,
    is_available = EXCLUDED.is_available,
    is_featured = EXCLUDED.is_featured,
    is_active = EXCLUDED.is_active;

-- ==========================================================
-- OPTIONAL HELPER: Switch to Supabase Storage Bucket URLs
-- ==========================================================
-- When you drag-and-drop the images from `public/images/categories/` and
-- `public/images/products/` into your Supabase Storage bucket 'store',
-- run the two lines below (replace YOUR_SUPABASE_PROJECT_ID with your real ID):
--
-- UPDATE public.categories
-- SET image_url = REPLACE(image_url, '/images/categories/', 'https://YOUR_SUPABASE_PROJECT_ID.supabase.co/storage/v1/object/public/store/categories/');
--
-- UPDATE public.products
-- SET image_url = REPLACE(image_url, '/images/products/', 'https://YOUR_SUPABASE_PROJECT_ID.supabase.co/storage/v1/object/public/store/products/');
