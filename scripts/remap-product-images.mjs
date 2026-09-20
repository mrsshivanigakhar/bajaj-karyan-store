import fs from 'fs';
import path from 'path';
import XLSX from 'xlsx';
import { fileURLToPath } from 'url';

process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const productsDir = path.join(rootDir, 'public', 'images', 'products');

fs.mkdirSync(productsDir, { recursive: true });

const env = fs.readFileSync(path.join(rootDir, '.env.local'), 'utf8');
const getEnv = (key) => {
  const m = env.match(new RegExp('^' + key + '=(.*)$', 'm'));
  return m ? m[1].trim() : '';
};

const supabaseUrl = getEnv('NEXT_PUBLIC_SUPABASE_URL');
const supabaseKey = getEnv('SUPABASE_SERVICE_ROLE_KEY') || getEnv('NEXT_PUBLIC_SUPABASE_ANON_KEY');

// Curated authentic, high-resolution Unsplash images accurately representing each specific item
const itemImageMap = {
  // Flours & Grains
  'wheat-atta': 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?auto=format&fit=crop&w=600&q=80',
  'besan': 'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&w=600&q=80', // yellow chickpea flour
  'maida': 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=600&q=80', // refined white flour / baking
  'basmati-rice': 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=600&q=80', // long grain basmati rice
  'parmal-rice': 'https://images.unsplash.com/photo-1536304929831-ee1ca9d44906?auto=format&fit=crop&w=600&q=80', // regular white grain rice
  'sona-masuri-rice': 'https://images.unsplash.com/photo-1536304929831-ee1ca9d44906?auto=format&fit=crop&w=600&q=80',
  'poha': 'https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?auto=format&fit=crop&w=600&q=80', // flattened rice flakes
  'oats': 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=600&q=80',
  'corn-flakes': 'https://images.unsplash.com/photo-1521483451569-e33803c0330c?auto=format&fit=crop&w=600&q=80',

  // Dals & Pulses
  'chana-dal': 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=600&q=80', // split yellow chana dal
  'kabuli-chana': 'https://images.unsplash.com/photo-1585994192730-9886b17425aa?auto=format&fit=crop&w=600&q=80', // white chickpeas
  'moong-dal': 'https://images.unsplash.com/photo-1515543237350-b3eea1ec8082?auto=format&fit=crop&w=600&q=80', // yellow split moong
  'toor-dal': 'https://images.unsplash.com/photo-1599940824399-b87987ceb72a?auto=format&fit=crop&w=600&q=80', // yellow pigeon peas
  'urad-dal': 'https://images.unsplash.com/photo-1607672632458-9eb56696346b?auto=format&fit=crop&w=600&q=80', // black gram urad dal
  'masoor-dal': 'https://images.unsplash.com/photo-1599940824399-b87987ceb72a?auto=format&fit=crop&w=600&q=80', // red/orange lentils
  'rajma': 'https://images.unsplash.com/photo-1583064313642-a7614904143e?auto=format&fit=crop&w=600&q=80', // red kidney beans

  // Dairy, Ghee & Butter
  'ghee': 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=600&q=80', // golden clarified butter ghee jar
  'butter': 'https://images.unsplash.com/photo-1589985270826-4b7bb135bc9d?auto=format&fit=crop&w=600&q=80', // authentic yellow butter block
  'paneer': 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?auto=format&fit=crop&w=600&q=80', // fresh white paneer cottage cheese
  'milk': 'https://images.unsplash.com/photo-1550583724-b2692b85b150?auto=format&fit=crop&w=600&q=80', // fresh dairy milk bottle
  'dahi': 'https://images.unsplash.com/photo-1488477181946-6428a0291777?auto=format&fit=crop&w=600&q=80', // fresh curd / yogurt

  // Cooking Oils
  'mustard-oil': 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&w=600&q=80', // pungent golden mustard oil
  'sunflower-oil': 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&w=600&q=80', // refined sunflower oil
  'soyabean-oil': 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&w=600&q=80', // refined soybean oil
  'groundnut-oil': 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&w=600&q=80', // peanut oil

  // Spices & Masalas
  'turmeric': 'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&w=600&q=80', // bright yellow turmeric powder
  'red-chilli': 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=600&q=80', // vibrant red chilli powder
  'coriander': 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=600&q=80', // ground coriander powder
  'cumin': 'https://images.unsplash.com/photo-1509358271058-acd22cc93898?auto=format&fit=crop&w=600&q=80', // whole cumin jeera seeds
  'garam-masala': 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=600&q=80', // dark rich spice mix
  'cardamom': 'https://images.unsplash.com/photo-1509358271058-acd22cc93898?auto=format&fit=crop&w=600&q=80', // green cardamom pods
  'mustard-seeds': 'https://images.unsplash.com/photo-1509358271058-acd22cc93898?auto=format&fit=crop&w=600&q=80', // small black mustard seeds
  'black-pepper': 'https://images.unsplash.com/photo-1509358271058-acd22cc93898?auto=format&fit=crop&w=600&q=80', // whole black peppercorns

  // Beverages & Soft Drinks
  'cola': 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?auto=format&fit=crop&w=600&q=80', // carbonated dark cola bottle/glass
  'lemon-lime': 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=600&q=80', // bubbly green/lemon lime soda
  'mango-drink': 'https://images.unsplash.com/photo-1546173159-315724a31696?auto=format&fit=crop&w=600&q=80', // rich yellow mango juice
  'orange-soda': 'https://images.unsplash.com/photo-1600271886742-f049cd451bba?auto=format&fit=crop&w=600&q=80', // fizzy orange soda
  'sharbat': 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=600&q=80', // rose sharbat

  // Tea & Coffee
  'tea': 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=600&q=80', // authentic black tea leaves / chai
  'green-tea': 'https://images.unsplash.com/photo-1564890369478-c89ca6d9cde9?auto=format&fit=crop&w=600&q=80', // fresh green tea leaves
  'coffee': 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=600&q=80', // roasted ground coffee & beans

  // Biscuits, Cookies & Bakery
  'glucose-biscuits': 'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?auto=format&fit=crop&w=600&q=80', // tea biscuits
  'marie-biscuits': 'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?auto=format&fit=crop&w=600&q=80', // round tea biscuits
  'cream-biscuits': 'https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?auto=format&fit=crop&w=600&q=80', // chocolate cream sandwich biscuits
  'cookies': 'https://images.unsplash.com/photo-1499636136210-6f4ee915583e?auto=format&fit=crop&w=600&q=80', // chocolate chip & cashew cookies
  'rusk': 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=600&q=80', // crunchy baked toast rusk
  'bread': 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=600&q=80', // sliced sandwich bread

  // Namkeen & Snacks
  'bhujia': 'https://images.unsplash.com/photo-1566478989037-eec170784d0b?auto=format&fit=crop&w=600&q=80', // crispy yellow sev bhujia
  'moong-dal-namkeen': 'https://images.unsplash.com/photo-1566478989037-eec170784d0b?auto=format&fit=crop&w=600&q=80', // salted fried moong dal
  'navratan-mixture': 'https://images.unsplash.com/photo-1566478989037-eec170784d0b?auto=format&fit=crop&w=600&q=80', // traditional mixture namkeen
  'potato-chips-salted': 'https://images.unsplash.com/photo-1527842891421-42eec6e703ea?auto=format&fit=crop&w=600&q=80', // golden salted potato chips
  'potato-chips-masala': 'https://images.unsplash.com/photo-1566478989037-eec170784d0b?auto=format&fit=crop&w=600&q=80', // spicy potato crisps
  'kurkure': 'https://images.unsplash.com/photo-1566478989037-eec170784d0b?auto=format&fit=crop&w=600&q=80', // crunchy puffs

  // Personal Care
  'soap-beauty': 'https://images.unsplash.com/photo-1600857544200-b2f666a9a2ec?auto=format&fit=crop&w=600&q=80', // creamy white beauty soap bar
  'soap-health': 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=600&q=80', // antiseptic health soap bar
  'soap-glycerin': 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=600&q=80', // translucent amber glycerin bar
  'shampoo': 'https://images.unsplash.com/photo-1535585209827-a15fcdbc4c2d?auto=format&fit=crop&w=600&q=80', // hair care shampoo bottle
  'toothpaste': 'https://images.unsplash.com/photo-1559591937-e62fb330bc1f?auto=format&fit=crop&w=600&q=80', // fresh toothpaste on brush

  // Household & Cleaning
  'dishwash': 'https://images.unsplash.com/photo-1585421514738-01798e348b17?auto=format&fit=crop&w=600&q=80', // dishwashing soap & sponge
  'detergent': 'https://images.unsplash.com/photo-1582735689369-4fe89db7114c?auto=format&fit=crop&w=600&q=80', // clean laundry washing powder
  'toilet-cleaner': 'https://images.unsplash.com/photo-1585421514738-01798e348b17?auto=format&fit=crop&w=600&q=80', // bathroom cleaner bottle
  'floor-cleaner': 'https://images.unsplash.com/photo-1585421514738-01798e348b17?auto=format&fit=crop&w=600&q=80', // disinfectant cleaner
};

// Match product name/slug to the most accurate item key
function determineItemKey(name, slug) {
  const text = `${name} ${slug}`.toLowerCase();

  // Beverages
  if (text.includes('mango') || text.includes('maaza') || text.includes('frooti')) return 'mango-drink';
  if (text.includes('cola') || text.includes('thums up') || text.includes('pepsi') || text.includes('coca-cola')) return 'cola';
  if (text.includes('lemon') || text.includes('lime') || text.includes('sprite') || text.includes('7up')) return 'lemon-lime';
  if (text.includes('orange') || text.includes('mirinda') || text.includes('fanta')) return 'orange-soda';
  if (text.includes('rooh afza') || text.includes('sharbat')) return 'sharbat';

  // Flours & Grains
  if (text.includes('besan') || text.includes('gram flour')) return 'besan';
  if (text.includes('maida') || text.includes('refined flour')) return 'maida';
  if (text.includes('atta') || text.includes('wheat flour')) return 'wheat-atta';
  if (text.includes('poha')) return 'poha';
  if (text.includes('basmati')) return 'basmati-rice';
  if (text.includes('sona masuri')) return 'sona-masuri-rice';
  if (text.includes('parmal') || text.includes('rice')) return 'parmal-rice';
  if (text.includes('oats')) return 'oats';
  if (text.includes('corn flakes')) return 'corn-flakes';

  // Dals & Pulses
  if (text.includes('kabuli chana') || text.includes('chickpeas') || text.includes('chole')) return 'kabuli-chana';
  if (text.includes('chana dal')) return 'chana-dal';
  if (text.includes('moong dal')) return 'moong-dal';
  if (text.includes('toor dal') || text.includes('arhar dal')) return 'toor-dal';
  if (text.includes('urad dal')) return 'urad-dal';
  if (text.includes('masoor dal')) return 'masoor-dal';
  if (text.includes('rajma')) return 'rajma';

  // Dairy & Fats
  if (text.includes('butter')) return 'butter';
  if (text.includes('ghee')) return 'ghee';
  if (text.includes('paneer')) return 'paneer';
  if (text.includes('dahi') || text.includes('curd')) return 'dahi';
  if (text.includes('milk') || text.includes('dairy whitener')) return 'milk';

  // Oils
  if (text.includes('mustard oil') || text.includes('sarson')) return 'mustard-oil';
  if (text.includes('sunflower oil')) return 'sunflower-oil';
  if (text.includes('soyabean oil')) return 'soyabean-oil';
  if (text.includes('groundnut oil') || text.includes('peanut oil')) return 'groundnut-oil';

  // Spices
  if (text.includes('haldi') || text.includes('turmeric')) return 'turmeric';
  if (text.includes('chilli') || text.includes('mirch')) return 'red-chilli';
  if (text.includes('dhaniya') || text.includes('coriander')) return 'coriander';
  if (text.includes('jeera') || text.includes('cumin')) return 'cumin';
  if (text.includes('garam masala')) return 'garam-masala';
  if (text.includes('elaichi') || text.includes('cardamom')) return 'cardamom';
  if (text.includes('rai') || text.includes('mustard seed')) return 'mustard-seeds';
  if (text.includes('black pepper') || text.includes('kali mirch')) return 'black-pepper';

  // Tea & Coffee
  if (text.includes('coffee')) return 'coffee';
  if (text.includes('green tea')) return 'green-tea';
  if (text.includes('tea') || text.includes('chai')) return 'tea';

  // Biscuits & Bakery
  if (text.includes('parle-g') || text.includes('glucose')) return 'glucose-biscuits';
  if (text.includes('marie')) return 'marie-biscuits';
  if (text.includes('cream biscuit') || text.includes('bourbon') || text.includes('oreo')) return 'cream-biscuits';
  if (text.includes('cookie') || text.includes('good day')) return 'cookies';
  if (text.includes('rusk')) return 'rusk';
  if (text.includes('bread')) return 'bread';

  // Snacks & Namkeen
  if (text.includes('bhujia') || text.includes('sev')) return 'bhujia';
  if (text.includes('moong dal namkeen')) return 'moong-dal-namkeen';
  if (text.includes('navratan') || text.includes('mixture')) return 'navratan-mixture';
  if (text.includes('salted') && text.includes('chips')) return 'potato-chips-salted';
  if (text.includes('masala') && text.includes('chips')) return 'potato-chips-masala';
  if (text.includes('kurkure')) return 'kurkure';

  // Personal Care
  if (text.includes('glycerin soap') || text.includes('pears')) return 'soap-glycerin';
  if (text.includes('dettol') || text.includes('lifebuoy') || text.includes('germ') || text.includes('health')) return 'soap-health';
  if (text.includes('soap') || text.includes('dove') || text.includes('lux') || text.includes('cinthol')) return 'soap-beauty';
  if (text.includes('shampoo') || text.includes('conditioner')) return 'shampoo';
  if (text.includes('paste') || text.includes('colgate') || text.includes('close-up') || text.includes('pepsodent') || text.includes('dant kanti')) return 'toothpaste';

  // Cleaning
  if (text.includes('dish') || text.includes('vim') || text.includes('exo')) return 'dishwash';
  if (text.includes('toilet') || text.includes('harpic')) return 'toilet-cleaner';
  if (text.includes('floor') || text.includes('lizol')) return 'floor-cleaner';
  if (text.includes('detergent') || text.includes('surf excel') || text.includes('ariel') || text.includes('tide') || text.includes('rin') || text.includes('wheel')) return 'detergent';

  return 'wheat-atta'; // fallback
}

async function downloadBuffer(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`HTTP ${res.status}: ${res.statusText}`);
  const ab = await res.arrayBuffer();
  return Buffer.from(ab);
}

async function run() {
  console.log('--- Product Image Accurate Remapping & Synchronization ---');

  // Step 1: Pre-download all unique images into cache
  console.log('Downloading base images for all product categories...');
  const imageBuffers = {};
  for (const [key, url] of Object.entries(itemImageMap)) {
    try {
      imageBuffers[key] = await downloadBuffer(url);
      process.stdout.write(`✓ Cached ${key}\n`);
    } catch (err) {
      console.warn(`Failed to download ${key}:`, err.message);
    }
  }

  // Step 2: Fetch all products from Supabase
  console.log('\nFetching products from Supabase...');
  const res = await fetch(`${supabaseUrl}/rest/v1/products?select=id,name,slug,image_url&order=name.asc`, {
    headers: {
      apikey: supabaseKey,
      Authorization: `Bearer ${supabaseKey}`,
    },
  });
  const products = await res.json();
  console.log(`Found ${products.length} products to remap.`);

  const slugToNewUrl = {};
  let updatedCount = 0;

  for (let i = 0; i < products.length; i++) {
    const product = products[i];
    const key = determineItemKey(product.name, product.slug);
    const buffer = imageBuffers[key];

    if (!buffer) {
      console.warn(`No buffer found for key: ${key} (${product.name})`);
      continue;
    }

    // Save to public/images/products/<slug>.jpg
    const localFile = path.join(productsDir, `${product.slug}.jpg`);
    fs.writeFileSync(localFile, buffer);

    // Upload to Supabase Storage
    const storagePath = `products/${product.slug}.jpg`;
    const publicStorageUrl = `${supabaseUrl}/storage/v1/object/public/store/${storagePath}`;
    slugToNewUrl[product.slug] = publicStorageUrl;

    const uploadRes = await fetch(`${supabaseUrl}/storage/v1/object/store/${storagePath}`, {
      method: 'POST',
      headers: {
        apikey: supabaseKey,
        Authorization: `Bearer ${supabaseKey}`,
        'Content-Type': 'image/jpeg',
        'x-upsert': 'true',
      },
      body: buffer,
    });

    if (!uploadRes.ok) {
      const errText = await uploadRes.text();
      console.warn(`[${i + 1}/${products.length}] Upload warning for ${product.slug}:`, errText);
    }

    // Update DB record
    const updateRes = await fetch(`${supabaseUrl}/rest/v1/products?id=eq.${product.id}`, {
      method: 'PATCH',
      headers: {
        apikey: supabaseKey,
        Authorization: `Bearer ${supabaseKey}`,
        'Content-Type': 'application/json',
        Prefer: 'return=representation',
      },
      body: JSON.stringify({ image_url: publicStorageUrl }),
    });

    if (updateRes.ok) {
      updatedCount++;
      if (i % 25 === 0 || i === products.length - 1) {
        console.log(`[${i + 1}/${products.length}] Remapped: ${product.name} -> ${key}`);
      }
    } else {
      console.error(`[${i + 1}/${products.length}] DB Update failed for ${product.slug}`);
    }
  }

  console.log(`\nSuccessfully remapped and updated ${updatedCount} / ${products.length} products in Supabase!`);

  // Step 3: Update public/product list.xlsx
  const excelPath = path.join(rootDir, 'public', 'product list.xlsx');
  if (fs.existsSync(excelPath)) {
    console.log('\nUpdating public/product list.xlsx with accurate image URLs...');
    const wb = XLSX.readFile(excelPath);
    const sheetName = wb.SheetNames[0];
    const rows = XLSX.utils.sheet_to_json(wb.Sheets[sheetName]);

    const updatedRows = rows.map((row) => {
      const name = row['Product SKU Name'] || '';
      const slug = name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
      const key = determineItemKey(name, slug);
      const originalUrl = itemImageMap[key] || itemImageMap['wheat-atta'];
      const storageUrl = slugToNewUrl[slug] || `${supabaseUrl}/storage/v1/object/public/store/products/${slug}.jpg`;

      return {
        ...row,
        'Image Download Link (Placeholder)': originalUrl,
        'Supabase Storage URL': storageUrl,
      };
    });

    const newSheet = XLSX.utils.json_to_sheet(updatedRows);
    wb.Sheets[sheetName] = newSheet;
    XLSX.writeFile(wb, excelPath);
    console.log(`Successfully updated ${updatedRows.length} rows in ${excelPath}!`);
  }
}

run().catch(console.error);
