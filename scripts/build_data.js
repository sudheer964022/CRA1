const xlsx = require('xlsx');
const fs = require('fs');
const path = require('path');

const wb = xlsx.readFile(path.join(__dirname, '../public/CRL TEST MENU FINAL 07.10.2026 (KKK).xlsx'));

const lplProfilesRaw = xlsx.utils.sheet_to_json(wb.Sheets['LPL PROFILE']);
const lplTestsRaw = xlsx.utils.sheet_to_json(wb.Sheets['LPL TESTS']);

const profiles = lplProfilesRaw.map(p => ({
  id: p['S.No'] || p['SrNo'] || 0,
  name: String(p['Profile'] || '').trim(),
  contents: String(p['Contents '] || p['Contents'] || '').trim(),
  b2b: Number(p['B2B']) || 0,
  b2c: Number(p['B2C']) || 0,
  discountedPrice: Math.round((Number(p['B2C']) || 0) * 0.75),
  incentive: Math.min(500, Math.round(((Number(p['B2C']) || 0) * 0.75) * 0.25)),
  cprt: Number(p['CPRT']) || 0,
}));

const tests = lplTestsRaw.map(t => ({
  id: Number(t['SrNo']) || 0,
  code: String(t['Code'] || '').trim(),
  description: String(t['Description'] || '').trim(),
  technology: String(t['Technology'] || '').trim(),
  sample: String(t['Sample'] || '').trim(),
  b2b: Number(t['B2B']) || 0,
  b2c: Number(t['B2C']) || 0,
  discountedPrice: Math.round((Number(t['B2C']) || 0) * 0.75),
  category: String(t['Category'] || '').trim(),
  analyzer: String(t['Analyzer '] || '').trim(),
}));

const targetDir = path.join(__dirname, '../src/data');
if (!fs.existsSync(targetDir)) {
  fs.mkdirSync(targetDir, { recursive: true });
}

const fileContent = `export interface RateListProfile {
  id: number;
  name: string;
  contents: string;
  b2b: number;
  b2c: number;
  discountedPrice: number;
  incentive: number;
  cprt: number;
}

export interface RateListTest {
  id: number;
  code: string;
  description: string;
  technology: string;
  sample: string;
  b2b: number;
  b2c: number;
  discountedPrice: number;
  category: string;
  analyzer: string;
}

export const LPL_PROFILES: RateListProfile[] = ${JSON.stringify(profiles, null, 2)};

export const LPL_TESTS: RateListTest[] = ${JSON.stringify(tests, null, 2)};
`;

fs.writeFileSync(path.join(targetDir, 'rateListData.ts'), fileContent, 'utf8');
console.log('Successfully created src/data/rateListData.ts');
