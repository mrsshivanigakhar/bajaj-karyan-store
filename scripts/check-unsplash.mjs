import fs from 'fs';
import { createClient } from '@supabase/supabase-js';

process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

const env = fs.readFileSync('e:/bajajkaryanastore/.env.local', 'utf8');
const getEnv = (key) => {
  const m = env.match(new RegExp('^' + key + '=(.*)$', 'm'));
  return m ? m[1].trim() : '';
};

const supabase = createClient(
  getEnv('NEXT_PUBLIC_SUPABASE_URL'),
  getEnv('SUPABASE_SERVICE_ROLE_KEY') || getEnv('NEXT_PUBLIC_SUPABASE_ANON_KEY')
);

async function main() {
  const { data: unsplashProducts } = await supabase
    .from('products')
    .select('id, name, slug, image_url')
    .ilike('image_url', '%unsplash%');

  console.log('Unsplash products count:', unsplashProducts.length);
  unsplashProducts.slice(0, 15).forEach(p => console.log(` - ${p.name} (${p.slug}): ${p.image_url}`));
}

main().catch(console.error);
