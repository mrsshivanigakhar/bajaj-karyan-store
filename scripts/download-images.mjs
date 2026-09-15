import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

const categoriesDir = path.join(rootDir, 'public', 'images', 'categories');
const productsDir = path.join(rootDir, 'public', 'images', 'products');

fs.mkdirSync(categoriesDir, { recursive: true });
fs.mkdirSync(productsDir, { recursive: true });

// List of categories with image URLs
export const categoryImages = [
  {
    slug: 'biscuits-cookies',
    url: 'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?auto=format&fit=crop&w=600&q=80',
  },
  {
    slug: 'chocolates-candies',
    url: 'https://images.unsplash.com/photo-1511381939415-e44015466834?auto=format&fit=crop&w=600&q=80',
  },
  {
    slug: 'namkeen-savories',
    url: 'https://images.unsplash.com/photo-1566478989037-eec170784d0b?auto=format&fit=crop&w=600&q=80',
  },
  {
    slug: 'bakery-rusks',
    url: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=600&q=80',
  },
  {
    slug: 'dry-fruits-nuts',
    url: 'https://images.unsplash.com/photo-1596591606975-97ee5cef3a1e?auto=format&fit=crop&w=600&q=80',
  },
  {
    slug: 'staples-grocery',
    url: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=600&q=80',
  },
  {
    slug: 'cooking-oils-ghee',
    url: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&w=600&q=80',
  },
  {
    slug: 'beverages-syrups',
    url: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?auto=format&fit=crop&w=600&q=80',
  },
  {
    slug: 'spices-masalas',
    url: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=600&q=80',
  },
  {
    slug: 'dals-pulses',
    url: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=600&q=80',
  },
  {
    slug: 'breakfast-cereals',
    url: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=600&q=80',
  },
  {
    slug: 'dairy-packaged',
    url: 'https://images.unsplash.com/photo-1628088062854-d1870b4553da?auto=format&fit=crop&w=600&q=80',
  },
  {
    slug: 'tea-coffee',
    url: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=600&q=80',
  },
  {
    slug: 'sauces-spreads',
    url: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=600&q=80',
  },
  {
    slug: 'personal-care',
    url: 'https://images.unsplash.com/photo-1608248597359-56134b9d0b67?auto=format&fit=crop&w=600&q=80',
  },
  {
    slug: 'pooja-essentials',
    url: 'https://images.unsplash.com/photo-1609137144813-7d9921338f24?auto=format&fit=crop&w=600&q=80',
  },
];

// List of products with image URLs
export const productImages = [
  // Biscuits & Cookies
  {
    slug: 'parle-g-gold-biscuits',
    url: 'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?auto=format&fit=crop&w=600&q=80',
  },
  {
    slug: 'britannia-good-day-cashew',
    url: 'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?auto=format&fit=crop&w=600&q=80',
  },
  {
    slug: 'oreo-vanilla-creme',
    url: 'https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?auto=format&fit=crop&w=600&q=80',
  },
  {
    slug: 'britannia-bourbon-chocolate',
    url: 'https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?auto=format&fit=crop&w=600&q=80',
  },

  // Chocolates & Candies
  {
    slug: 'cadbury-dairy-milk-silk',
    url: 'https://images.unsplash.com/photo-1549007994-cb92caebd54b?auto=format&fit=crop&w=600&q=80',
  },
  {
    slug: 'ferrero-rocher-box-16',
    url: 'https://images.unsplash.com/photo-1548741487-18d16a145e80?auto=format&fit=crop&w=600&q=80',
  },
  {
    slug: 'assorted-toffee-gift-pack',
    url: 'https://images.unsplash.com/photo-1582058091505-f87a2e55a40f?auto=format&fit=crop&w=600&q=80',
  },
  {
    slug: 'kitkat-4-finger-pack',
    url: 'https://images.unsplash.com/photo-1549007994-cb92caebd54b?auto=format&fit=crop&w=600&q=80',
  },

  // Namkeen & Savories
  {
    slug: 'haldiram-aloo-bhujia',
    url: 'https://images.unsplash.com/photo-1566478989037-eec170784d0b?auto=format&fit=crop&w=600&q=80',
  },
  {
    slug: 'bikaji-navratna-mixture',
    url: 'https://images.unsplash.com/photo-1566478989037-eec170784d0b?auto=format&fit=crop&w=600&q=80',
  },
  {
    slug: 'lays-india-magic-masala',
    url: 'https://images.unsplash.com/photo-1566478989037-eec170784d0b?auto=format&fit=crop&w=600&q=80',
  },
  {
    slug: 'roasted-salted-peanuts',
    url: 'https://images.unsplash.com/photo-1566478989037-eec170784d0b?auto=format&fit=crop&w=600&q=80',
  },

  // Bakery & Rusks
  {
    slug: 'premium-cake-rusk',
    url: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=600&q=80',
  },
  {
    slug: 'britannia-suji-rusk',
    url: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=600&q=80',
  },
  {
    slug: 'fresh-fruit-cake-slice',
    url: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=600&q=80',
  },

  // Dry Fruits & Nuts
  {
    slug: 'california-almonds',
    url: 'https://images.unsplash.com/photo-1596591606975-97ee5cef3a1e?auto=format&fit=crop&w=600&q=80',
  },
  {
    slug: 'whole-cashews-kaju',
    url: 'https://images.unsplash.com/photo-1536591375315-1b83681e3be6?auto=format&fit=crop&w=600&q=80',
  },
  {
    slug: 'kashmiri-walnut-kernels',
    url: 'https://images.unsplash.com/photo-1596591606975-97ee5cef3a1e?auto=format&fit=crop&w=600&q=80',
  },
  {
    slug: 'green-raisins-kishmish',
    url: 'https://images.unsplash.com/photo-1596591606975-97ee5cef3a1e?auto=format&fit=crop&w=600&q=80',
  },
  {
    slug: 'royal-festive-dry-fruit-box',
    url: 'https://images.unsplash.com/photo-1596591606975-97ee5cef3a1e?auto=format&fit=crop&w=600&q=80',
  },

  // Staples & Grocery
  {
    slug: 'aashirvaad-shudh-chakki-atta',
    url: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=600&q=80',
  },
  {
    slug: 'refined-fine-sugar',
    url: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=600&q=80',
  },
  {
    slug: 'daawat-super-basmati-rice',
    url: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=600&q=80',
  },
  {
    slug: 'tata-salt-vaccum-evaporated',
    url: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=600&q=80',
  },

  // Cooking Oils & Ghee
  {
    slug: 'fortune-sunlite-sunflower-oil',
    url: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&w=600&q=80',
  },
  {
    slug: 'amul-pure-desi-ghee-tin',
    url: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&w=600&q=80',
  },
  {
    slug: 'fortune-kachi-ghani-mustard-oil',
    url: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&w=600&q=80',
  },

  // Beverages & Syrups
  {
    slug: 'thums-up-bottle-750ml',
    url: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?auto=format&fit=crop&w=600&q=80',
  },
  {
    slug: 'rooh-afza-sharbat-bottle',
    url: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?auto=format&fit=crop&w=600&q=80',
  },
  {
    slug: 'frooti-mango-drink-pack',
    url: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?auto=format&fit=crop&w=600&q=80',
  },

  // Spices & Whole Masalas
  {
    slug: 'turmeric-powder-haldi',
    url: 'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&w=600&q=80',
  },
  {
    slug: 'kashmiri-red-chilli-powder',
    url: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=600&q=80',
  },
  {
    slug: 'mdh-garam-masala',
    url: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=600&q=80',
  },
  {
    slug: 'cumin-seeds-sabut-jeera',
    url: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=600&q=80',
  },

  // Dals, Pulses & Legumes
  {
    slug: 'chana-dal-desi',
    url: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=600&q=80',
  },
  {
    slug: 'punjabi-chitra-rajma',
    url: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=600&q=80',
  },
  {
    slug: 'moong-dal-dhuli',
    url: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=600&q=80',
  },
  {
    slug: 'kabuli-chana-big',
    url: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=600&q=80',
  },

  // Breakfast, Cereals & Oats
  {
    slug: 'kelloggs-corn-flakes',
    url: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=600&q=80',
  },
  {
    slug: 'quaker-rolled-oats',
    url: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=600&q=80',
  },
  {
    slug: 'roasted-poha-thick',
    url: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=600&q=80',
  },

  // Dairy & Packaged Foods
  {
    slug: 'amul-pasteurised-butter',
    url: 'https://images.unsplash.com/photo-1628088062854-d1870b4553da?auto=format&fit=crop&w=600&q=80',
  },
  {
    slug: 'britannia-cheese-slices',
    url: 'https://images.unsplash.com/photo-1628088062854-d1870b4553da?auto=format&fit=crop&w=600&q=80',
  },
  {
    slug: 'nestle-everyday-dairy-whitener',
    url: 'https://images.unsplash.com/photo-1628088062854-d1870b4553da?auto=format&fit=crop&w=600&q=80',
  },

  // Tea, Coffee & Health Drinks
  {
    slug: 'wagh-bakri-premium-tea',
    url: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=600&q=80',
  },
  {
    slug: 'nescafe-classic-instant-coffee',
    url: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=600&q=80',
  },
  {
    slug: 'cadbury-bournvita-health-drink',
    url: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=600&q=80',
  },

  // Sauces, Spreads & Jams
  {
    slug: 'kissan-mixed-fruit-jam',
    url: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=600&q=80',
  },
  {
    slug: 'maggi-rich-tomato-ketchup',
    url: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=600&q=80',
  },
  {
    slug: 'dabur-pure-honey-squeezy',
    url: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=600&q=80',
  },

  // Personal Care & Hygiene
  {
    slug: 'dettol-original-soap-bar',
    url: 'https://images.unsplash.com/photo-1608248597359-56134b9d0b67?auto=format&fit=crop&w=600&q=80',
  },
  {
    slug: 'colgate-strong-teeth-paste',
    url: 'https://images.unsplash.com/photo-1608248597359-56134b9d0b67?auto=format&fit=crop&w=600&q=80',
  },
  {
    slug: 'surf-excel-easy-wash-powder',
    url: 'https://images.unsplash.com/photo-1608248597359-56134b9d0b67?auto=format&fit=crop&w=600&q=80',
  },

  // Pooja & Festive Essentials
  {
    slug: 'pure-bhimseni-camphor',
    url: 'https://images.unsplash.com/photo-1609137144813-7d9921338f24?auto=format&fit=crop&w=600&q=80',
  },
  {
    slug: 'cycle-pure-agarbatti-pack',
    url: 'https://images.unsplash.com/photo-1609137144813-7d9921338f24?auto=format&fit=crop&w=600&q=80',
  },
  {
    slug: 'pure-cotton-phool-batti',
    url: 'https://images.unsplash.com/photo-1609137144813-7d9921338f24?auto=format&fit=crop&w=600&q=80',
  },
];

async function downloadFile(url, destPath) {
  try {
    const res = await fetch(url);
    if (!res.ok) {
      console.error(`Failed ${url}: HTTP ${res.status}`);
      return false;
    }
    const buffer = Buffer.from(await res.arrayBuffer());
    fs.writeFileSync(destPath, buffer);
    console.log(`Saved: ${path.basename(destPath)} (${(buffer.length / 1024).toFixed(1)} KB)`);
    return true;
  } catch (err) {
    console.error(`Error downloading ${url}:`, err.message);
    return false;
  }
}

async function run() {
  console.log('--- Downloading Category Images ---');
  for (const cat of categoryImages) {
    const dest = path.join(categoriesDir, `${cat.slug}.jpg`);
    await downloadFile(cat.url, dest);
  }

  console.log('\n--- Downloading Product Images ---');
  for (const prod of productImages) {
    const dest = path.join(productsDir, `${prod.slug}.jpg`);
    await downloadFile(prod.url, dest);
  }

  console.log('\nDownload complete! All images stored in public/images/categories/ and public/images/products/');
}

run();
