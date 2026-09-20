import fs from 'fs';
import path from 'path';
import XLSX from 'xlsx';
import { fileURLToPath } from 'url';

process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const productsDir = path.join(rootDir, 'public', 'images', 'products');

const env = fs.readFileSync(path.join(rootDir, '.env.local'), 'utf8');
const getEnv = (key) => {
  const m = env.match(new RegExp('^' + key + '=(.*)$', 'm'));
  return m ? m[1].trim() : '';
};

const supabaseUrl = getEnv('NEXT_PUBLIC_SUPABASE_URL');
const supabaseKey = getEnv('SUPABASE_SERVICE_ROLE_KEY') || getEnv('NEXT_PUBLIC_SUPABASE_ANON_KEY');

async function run() {
  console.log('--- Fixing Remaining Products: Toothpaste, Kabuli Chana, Rajma ---');

  // Load existing authentic local image buffers
  const kabuliBuffer = fs.readFileSync(path.join(productsDir, 'kabuli-chana-big.jpg'));
  const rajmaBuffer = fs.readFileSync(path.join(productsDir, 'punjabi-chitra-rajma.jpg'));
  const toothpasteBuffer = fs.readFileSync(path.join(productsDir, 'colgate-strong-teeth-paste.jpg'));

  // Fetch products that might have missed
  const res = await fetch(`${supabaseUrl}/rest/v1/products?select=id,name,slug,image_url&order=name.asc`, {
    headers: {
      apikey: supabaseKey,
      Authorization: `Bearer ${supabaseKey}`,
    },
  });
  const products = await res.json();

  let fixedCount = 0;

  for (let i = 0; i < products.length; i++) {
    const product = products[i];
    const text = `${product.name} ${product.slug}`.toLowerCase();

    let buffer = null;
    let category = null;

    if (text.includes('toothpaste') || text.includes('dant kanti') || text.includes('colgate') || text.includes('pepsodent') || text.includes('close-up')) {
      buffer = toothpasteBuffer;
      category = 'toothpaste';
    } else if (text.includes('kabuli chana') || text.includes('chickpeas') || text.includes('chole')) {
      buffer = kabuliBuffer;
      category = 'kabuli-chana';
    } else if (text.includes('rajma') || text.includes('kidney beans')) {
      buffer = rajmaBuffer;
      category = 'rajma';
    }

    if (!buffer) continue;

    // Save to public/images/products/<slug>.jpg
    const localFile = path.join(productsDir, `${product.slug}.jpg`);
    fs.writeFileSync(localFile, buffer);

    // Upload to Supabase Storage
    const storagePath = `products/${product.slug}.jpg`;
    const publicStorageUrl = `${supabaseUrl}/storage/v1/object/public/store/${storagePath}`;

    await fetch(`${supabaseUrl}/storage/v1/object/store/${storagePath}`, {
      method: 'POST',
      headers: {
        apikey: supabaseKey,
        Authorization: `Bearer ${supabaseKey}`,
        'Content-Type': 'image/jpeg',
        'x-upsert': 'true',
      },
      body: buffer,
    });

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
      fixedCount++;
      if (fixedCount % 15 === 0) {
        console.log(`[${fixedCount}] Fixed: ${product.name} -> ${category}`);
      }
    }
  }

  console.log(`\nSuccessfully fixed and updated ${fixedCount} products!`);
}

run().catch(console.error);
