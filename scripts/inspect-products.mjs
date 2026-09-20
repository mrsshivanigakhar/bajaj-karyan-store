import fs from 'fs';

process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

const env = fs.readFileSync('.env.local', 'utf8');
const getEnv = (key) => {
  const m = env.match(new RegExp('^' + key + '=(.*)$', 'm'));
  return m ? m[1].trim() : '';
};

const url = getEnv('NEXT_PUBLIC_SUPABASE_URL');
const key = getEnv('SUPABASE_SERVICE_ROLE_KEY') || getEnv('NEXT_PUBLIC_SUPABASE_ANON_KEY');

async function run() {
  const res = await fetch(`${url}/rest/v1/products?select=id,name,slug,category_id,image_url&order=name.asc`, {
    headers: {
      'apikey': key,
      'Authorization': `Bearer ${key}`
    }
  });
  const products = await res.json();
  console.log('Total products:', products.length);
  products.slice(0, 50).forEach(p => console.log(`${p.name} | ${p.slug} | ${p.image_url}`));
}
run();
