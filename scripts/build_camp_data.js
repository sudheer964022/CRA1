const xlsx = require('xlsx');
const fs = require('fs');
const path = require('path');

const wb = xlsx.readFile(path.join(__dirname, '../public/CRL TEST MENU FINAL 07.10.2026 (KKK).xlsx'));

const lplProfilesRaw = xlsx.utils.sheet_to_json(wb.Sheets['LPL PROFILE']);
const lplTestsRaw = xlsx.utils.sheet_to_json(wb.Sheets['LPL TESTS']);

function toTitleCase(str) {
  if (!str) return '';
  return str
    .toLowerCase()
    .split(' ')
    .map(word => {
      if (word.startsWith('(')) {
        return '(' + word.charAt(1).toUpperCase() + word.slice(2);
      }
      return word.charAt(0).toUpperCase() + word.slice(1);
    })
    .join(' ')
    .replace(/\b(sgpt|sgot|tsh|cbc|hba|amyl|lase|vb12|vitdt|ferr|secu|sezn|crp|apoa|apob|lpa|hscrp|homo|bketo|fruct|rfac|foli|chol|trig|hcho|ldl|prot|salb|alkp|bild|bilt|ggt|bun|calc|scre|uric|urea|iron|tibc|tt3|tt4|utsh|ft3|ft4|ama|lh|fsh|prl|amh|fbhcg|pappa|bhcg|afp|e3|erpr|her2|esr|pt|inr)\b/gi, m => m.toUpperCase());
}

const testDescriptionsMap = {
  'SGPT': 'Alanine Transaminase (SGPT)',
  'SALB': 'Albumin - Serum',
  'ALKP': 'Alkaline Phosphatase',
  'SGOT': 'Aspartate Aminotransferase (SGOT)',
  'BILD': 'Bilirubin - Direct',
  'BILT': 'Bilirubin - Total',
  'CHOL': 'Total Cholesterol',
  'FBS': 'Fasting Blood Sugar (FBS)',
  'PPBS': 'Postprandial Blood Sugar (PPBS)',
  'RBS': 'Random Blood Sugar (RBS)',
  'TRIG': 'Triglycerides',
  'UTSH': 'Thyroid-Stimulating Hormone (TSH)',
  'LDH': 'Lactate Dehydrogenase (LDH)',
  'HBA': 'Glycated Hemoglobin (HbA1c)',
  'CBC': 'Complete Blood Count (CBC)',
  'VB12': 'Vitamin B12 (Cobalamin)',
  'VITDT': 'Vitamin D Total (25-OH)',
  'FERR': 'Serum Ferritin',
  'CRP': 'C-Reactive Protein (CRP)',
  'HSCRP': 'High-Sensitivity CRP (hs-CRP)',
  'HSCPRP': 'High-Sensitivity CRP (hs-CRP)',
  'APOA': 'Apolipoprotein A1',
  'APOB': 'Apolipoprotein B',
  'LPA': 'Lipoprotein (a)',
  'HOMO': 'Homocysteine',
  'RFAC': 'Rheumatoid Factor (RA/RF)',
  'FOLI': 'Serum Folate',
  'AMYL': 'Serum Amylase',
  'LASE': 'Serum Lipase',
  'BUN': 'Blood Urea Nitrogen (BUN)',
  'CALC': 'Serum Calcium',
  'SCRE': 'Serum Creatinine',
  'URIC': 'Uric Acid',
  'UREA': 'Blood Urea',
  'IRON': 'Serum Iron',
  'TIBC': 'Total Iron Binding Capacity',
  'MG': 'Serum Magnesium',
  'PHOS': 'Serum Phosphorus',
  'SOD': 'Serum Sodium',
  'POT': 'Serum Potassium',
  'CHL': 'Serum Chloride',
  'SEZN': 'Serum Zinc',
  'SECU': 'Serum Copper',
  'A1c': 'HbA1c (Glycosylated Hemoglobin)',
  'AMH': 'Anti-Müllerian Hormone (AMH)',
  'ESR': 'Erythrocyte Sedimentation Rate (ESR)'
};

const profileParamMap = {
  'Kidney Profile': { count: 8, offer: 125, contents: 'BUN, Calcium, Serum Creatinine, Uric Acid, Urea, BUN/Creatinine Ratio, Urea/Creatinine Ratio, eGFR' },
  'Lipid Profile': { count: 10, offer: 125, contents: 'Total Cholesterol, Triglycerides, HDL Cholesterol, LDL Cholesterol, VLDL, Non-HDL, TC/HDL Ratio, LDL/HDL Ratio, HDL/LDL Ratio, Triglyceride/HDL Ratio' },
  'Iron Profile': { count: 4, offer: 150, contents: 'Serum Iron, Total Iron Binding Capacity (TIBC), UIBC, % Transferrin Saturation' },
  'Liver Profile': { count: 12, offer: 150, contents: 'Bilirubin - Total, Bilirubin - Direct, Bilirubin - Indirect, SGOT/AST, SGPT/ALT, SGOT/SGPT Ratio, Alkaline Phosphatase, Total Protein, Albumin, Globulin, A/G Ratio, GGT' },
  'Total Thyoid Profile': { count: 3, offer: 150, contents: 'Total Triiodothyronine (T3), Total Thyroxine (T4), Thyroid Stimulating Hormone (TSH)' },
  'Advance Thyroid Profile': { count: 5, offer: 250, contents: 'Total T3, Total T4, TSH, Free T3 (FT3), Free T4 (FT4)' },
  'Pancreatic Profile': { count: 2, offer: 250, contents: 'Serum Amylase, Serum Lipase' },
  'Vitamin Profile': { count: 2, offer: 400, contents: 'Vitamin B12 (Cyanocobalamin), Vitamin D Total (25-OH)' },
  'AVM 1 Profile': { count: 65, offer: 400, contents: 'TSH + Complete Lipid Profile (10) + Liver Profile (12) + Kidney Profile (8) + Iron Profile (4) + Magnesium + Phosphorus' },
  'AVM 2 Profile': { count: 75, offer: 750, contents: 'AVM 1 Profile (65) + Serum Amylase + Serum Lipase + HbA1c + Complete Blood Count (CBC)' },
  'AVM 3 Profile': { count: 83, offer: 1500, contents: 'AVM 2 Profile (75) + Vitamin B12 + Vitamin D Total + Ferritin + Serum Copper + Serum Zinc + High-Sensitivity CRP' },
  'AVM 4 Profile': { count: 88, offer: 1800, contents: 'AVM 3 Profile (83) + Apolipoprotein A1 + Apolipoprotein B + Lipoprotein (a) + hs-CRP' },
  'AVM 5 Profile': { count: 95, offer: 3000, contents: 'AVM 4 Profile (88) + Homocysteine + Beta-Ketone + Fructosamine + Rheumatoid Factor + Serum Folate' },
  'EGG RESERVE PROFILE (ERP)': { count: 7, offer: 800, contents: 'LH, FSH, PRL, AMH, TSH, HbA1c, Hemoglobin' },
  'AVM THYROID PROFILE (T6)': { count: 6, offer: 400, contents: 'Total T3, Total T4, TSH, Free T3, Free T4, Anti-Microsomal Antibody (AMA)' },
  'DOUBLE MARKER PROFILE (8 to 13 Weeks)': { count: 2, offer: 500, contents: 'Free Beta hCG (FBHCG), Pregnancy-Associated Plasma Protein A (PAPP-A)' }
};

// Process ALL 16 profiles from Excel without CAMP or CRA
const profiles = lplProfilesRaw.map((p, idx) => {
  const rawName = String(p.Profile || '').trim();
  const meta = profileParamMap[rawName] || {};
  const catalogue = Number(p.B2C) || 0;
  const offer = meta.offer || (catalogue ? Math.round(catalogue / 2) : 0);
  const paramCount = meta.count || (p['Contents '] ? p['Contents '].split('+').length : 1);
  const contents = meta.contents || String(p['Contents '] || '').trim();
  const displayName = toTitleCase(rawName) + ' (' + paramCount + ')';

  return {
    id: idx + 1,
    name: toTitleCase(rawName),
    paramCount,
    displayName,
    contents,
    offerRate: offer,
    catalogueRate: catalogue,
  };
});

// Process ALL 79 tests from Excel
const tests = lplTestsRaw.map((t, idx) => {
  const code = String(t.Code || '').trim();
  const rawDesc = String(t.Description || '').trim();
  const description = testDescriptionsMap[code] || toTitleCase(rawDesc);
  const technologyRaw = String(t.Technology || 'PHOTOMETRY').trim().toUpperCase();
  let techDisplay = 'Photometry';
  if (technologyRaw.includes('C.L.I.A') || technologyRaw.includes('CLIA')) techDisplay = 'C.L.I.A';
  else if (technologyRaw.includes('H.P.L.C') || technologyRaw.includes('HPLC')) techDisplay = 'H.P.L.C';
  else if (technologyRaw.includes('I.S.E') || technologyRaw.includes('ISE')) techDisplay = 'I.S.E';
  else if (technologyRaw.includes('HEMATOLOGY')) techDisplay = 'Hematology';
  else if (technologyRaw.includes('MICROSCOPY')) techDisplay = 'Microscopy';
  else if (technologyRaw.includes('MANUAL')) techDisplay = 'Manual';

  const sampleRaw = String(t.Sample || 'SERUM').trim().toUpperCase();
  let sampleDisplay = 'Serum';
  if (sampleRaw.includes('FLUORIDE')) sampleDisplay = 'Fluoride';
  else if (sampleRaw.includes('EDTA')) sampleDisplay = 'EDTA';
  else if (sampleRaw.includes('URINE')) sampleDisplay = 'Urine';

  const catalogue = Number(t.B2C) || 100;
  const offer = Math.round(catalogue / 2);

  return {
    id: idx + 1,
    code,
    description,
    technology: techDisplay,
    sample: sampleDisplay,
    offerRate: offer,
    catalogueRate: catalogue,
  };
});

const tsContent = `export interface ProfileItem {
  id: number;
  name: string;
  paramCount: number;
  displayName: string;
  contents: string;
  offerRate: number;
  catalogueRate: number;
}

export interface TestItem {
  id: number;
  code: string;
  description: string;
  technology: string;
  sample: string;
  offerRate: number;
  catalogueRate: number;
}

export const LPL_PROFILES: ProfileItem[] = ${JSON.stringify(profiles, null, 2)};

export const LPL_TESTS: TestItem[] = ${JSON.stringify(tests, null, 2)};
`;

fs.writeFileSync(path.join(__dirname, '../src/data/rateListData.ts'), tsContent, 'utf8');
console.log('Generated clean rateListData.ts with NO CAMP and NO CRA');
