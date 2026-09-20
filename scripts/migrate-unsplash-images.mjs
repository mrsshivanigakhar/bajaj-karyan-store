import fs from 'fs';
import path from 'path';
import { createClient } from '@supabase/supabase-js';

process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

const env = fs.readFileSync('e:/bajajkaryanastore/.env.local', 'utf8');
const getEnv = (key) => {
  const m = env.match(new RegExp('^' + key + '=(.*)$', 'm'));
  return m ? m[1].trim() : '';
};

const supabaseUrl = getEnv('NEXT_PUBLIC_SUPABASE_URL');
const supabaseKey = getEnv('SUPABASE_SERVICE_ROLE_KEY') || getEnv('NEXT_PUBLIC_SUPABASE_ANON_KEY');
const supabase = createClient(supabaseUrl, supabaseKey);

const productsDir = 'e:/bajajkaryanastore/public/images/products';

async function downloadBuffer(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`HTTP error ${res.status}: ${res.statusText}`);
  const arrayBuffer = await res.arrayBuffer();
  return Buffer.from(arrayBuffer);
}

async function main() {
  console.log('Fetching products with Unsplash or broken images...');
  const { data: products, error } = await supabase
    .from('products')
    .select('id, name, slug, image_url')
    .ilike('image_url', '%unsplash%');

  if (error) {
    console.error('Error fetching products:', error);
    return;
  }

  console.log(`Found ${products.length} products to update with authentic images.`);

  // Load Dal buffers
  const chanaDalBuffer = fs.readFileSync(path.join(productsDir, 'chana-dal-desi.jpg'));
  const kabuliChanaBuffer = fs.readFileSync(path.join(productsDir, 'kabuli-chana-big.jpg'));

  // Download high-res soap/shampoo buffers
  console.log('Downloading high-res soap and shampoo images...');
  const beautySoapBuffer = await downloadBuffer('https://images.unsplash.com/photo-1600857544200-b2f666a9a2ec?auto=format&fit=crop&w=600&q=80');
  const glycerinSoapBuffer = await downloadBuffer('https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=600&q=80');
  const shampooBuffer = await downloadBuffer('https://images.unsplash.com/photo-1535585209827-a15fcdbc4c2d?auto=format&fit=crop&w=600&q=80');

  let updatedCount = 0;

  for (let i = 0; i < products.length; i++) {
    const product = products[i];
    const nameLower = product.name.toLowerCase();

    let selectedBuffer;
    if (nameLower.includes('kabuli chana') || nameLower.includes('chickpeas')) {
      selectedBuffer = kabuliChanaBuffer;
    } else if (nameLower.includes('chana dal')) {
      selectedBuffer = chanaDalBuffer;
    } else if (nameLower.includes('shampoo') || nameLower.includes('conditioner')) {
      selectedBuffer = shampooBuffer;
    } else if (nameLower.includes('glycerin') || nameLower.includes('germ') || nameLower.includes('health')) {
      selectedBuffer = glycerinSoapBuffer;
    } else {
      selectedBuffer = beautySoapBuffer;
    }

    const localFile = path.join(productsDir, `${product.slug}.jpg`);
    fs.writeFileSync(localFile, selectedBuffer);

    // Upload to Supabase Storage
    const storagePath = `products/${product.slug}.jpg`;
    const publicStorageUrl = `${supabaseUrl}/storage/v1/object/public/store/${storagePath}`;

    const { error: uploadErr } = await supabase.storage
      .from('store')
      .upload(storagePath, selectedBuffer, {
        contentType: 'image/jpeg',
        upsert: true,
      });

    if (uploadErr) {
      console.warn(`[${i + 1}/${products.length}] Upload warning for ${product.slug}:`, uploadErr.message);
    }

    // Update database record
    const { error: updateErr } = await supabase
      .from('products')
      .update({ image_url: publicStorageUrl })
      .eq('id', product.id);

    if (updateErr) {
      console.error(`[${i + 1}/${products.length}] DB update error for ${product.slug}:`, updateErr.message);
    } else {
      updatedCount++;
      process.stdout.write(`[${i + 1}/${products.length}] Updated ${product.name}\r`);
    }
  }

  console.log(`\nSuccessfully updated and migrated all ${updatedCount} / ${products.length} products to Supabase Storage!`);
}

main().catch(console.error);
