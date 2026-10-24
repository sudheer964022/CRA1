const xlsx = require('xlsx');
const path = require('path');

const filePath = path.join(__dirname, '../public/CRL TEST MENU FINAL 07.10.2026 (KKK).xlsx');
const wb = xlsx.readFile(filePath);
console.log('Sheet Names:', wb.SheetNames);

for (const name of wb.SheetNames) {
  const ws = wb.Sheets[name];
  const rows = xlsx.utils.sheet_to_json(ws, { header: 1 });
  console.log('=== Sheet:', name, 'Total rows:', rows.length);
  for (let i = 0; i < Math.min(10, rows.length); i++) {
    console.log(`Row ${i}:`, JSON.stringify(rows[i]));
  }
}
