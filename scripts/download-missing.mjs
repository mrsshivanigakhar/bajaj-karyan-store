import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

const categoriesDir = path.join(rootDir, 'public', 'images', 'categories');
const productsDir = path.join(rootDir, 'public', 'images', 'products');

const missingItems = [
  {
    dest: path.join(categoriesDir, 'personal-care.jpg'),
    url: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=600&q=80',
  },
  {
    dest: path.join(productsDir, 'ferrero-rocher-box-16.jpg'),
    url: 'https://images.unsplash.com/photo-1549007994-cb92caebd54b?auto=format&fit=crop&w=600&q=80',
  },
  {
    dest: path.join(productsDir, 'whole-cashews-kaju.jpg'),
    url: 'https://images.unsplash.com/photo-1509914398867-12da5475b78a?auto=format&fit=crop&w=600&q=80',
  },
  {
    dest: path.join(productsDir, 'dettol-original-soap-bar.jpg'),
    url: 'https://images.unsplash.com/photo-1607083206869-4c7672e72a8a?auto=format&fit=crop&w=600&q=80',
  },
  {
    dest: path.join(productsDir, 'colgate-strong-teeth-paste.jpg'),
    url: 'https://images.unsplash.com/photo-1559599101-f09722fb4948?auto=format&fit=crop&w=600&q=80',
  },
  {
    dest: path.join(productsDir, 'surf-excel-easy-wash-powder.jpg'),
    url: 'https://images.unsplash.com/photo-1585421514738-01798e348b17?auto=format&fit=crop&w=600&q=80',
  },
];

async function download() {
  for (const item of missingItems) {
    try {
      const res = await fetch(item.url);
      if (res.ok) {
        const buffer = Buffer.from(await res.arrayBuffer());
        fs.writeFileSync(item.dest, buffer);
        console.log(`Saved: ${path.basename(item.dest)} (${(buffer.length / 1024).toFixed(1)} KB)`);
      } else {
        console.error(`Failed ${item.url}: HTTP ${res.status}`);
      }
    } catch (e) {
      console.error(e.message);
    }
  }
}

download();
