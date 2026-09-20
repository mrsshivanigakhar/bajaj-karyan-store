import XLSX from 'xlsx';
import fs from 'fs';
import path from 'path';

const updatedFile = 'public/product list (updated).xlsx';
const originalFile = 'public/product list.xlsx';

for (const file of [updatedFile, originalFile]) {
  if (fs.existsSync(file)) {
    const wb = XLSX.readFile(file);
    const sheet = wb.Sheets[wb.SheetNames[0]];
    const rows = XLSX.utils.sheet_to_json(sheet);
    console.log(`\nFile: ${file}`);
    console.log(`Total rows: ${rows.length}`);
    if (rows.length > 0) {
      console.log('Columns in first row:', Object.keys(rows[0]));
      console.log('First row data:', rows[0]);
    }
    const col = 'Image Download Link (Placeholder)';
    const noImg = rows.filter(r => !r[col] || String(r[col]).trim() === '' || String(r[col]).includes('placehold.co'));
    console.log(`Rows without valid image link: ${noImg.length}`);
    if (noImg.length > 0) {
      console.log('Sample rows without image link:');
      noImg.slice(0, 10).forEach(r => console.log(` - ${r['Product SKU Name']}: ${r[col]}`));
    }
  }
}
