export interface ProfileItem {
  id: number;
  name: string;
  paramCount: number;
  displayName: string;
  contents: string;
  b2bPrice: number;
  offeredPrice: number;
  offerRate: number;
  catalogueRate: number;
}

export interface TestItem {
  id: number;
  code: string;
  description: string;
  technology: string;
  sample: string;
  b2bPrice: number;
  offeredPrice: number;
  offerRate: number;
  catalogueRate: number;
}

export const LPL_PROFILES: ProfileItem[] = [
  {
    "id": 1,
    "name": "Avm 1 Profile",
    "paramCount": 65,
    "displayName": "Avm 1 Profile (65)",
    "contents": "TSH + Complete Lipid Profile (10) + Liver Profile (12) + Kidney Profile (8) + Iron Profile (4) + Magnesium + Phosphorus",
    "offerRate": 600,
    "catalogueRate": 800,
    "b2bPrice": 250,
    "offeredPrice": 600
  },
  {
    "id": 2,
    "name": "Avm 2 Profile",
    "paramCount": 75,
    "displayName": "Avm 2 Profile (75)",
    "contents": "AVM 1 Profile (65) + Serum Amylase + Serum Lipase + HbA1c + Complete Blood Count (CBC)",
    "offerRate": 1125,
    "catalogueRate": 1500,
    "b2bPrice": 500,
    "offeredPrice": 1125
  },
  {
    "id": 3,
    "name": "Avm 3 Profile",
    "paramCount": 83,
    "displayName": "Avm 3 Profile (83)",
    "contents": "AVM 2 Profile (75) + Vitamin B12 + Vitamin D Total + Ferritin + Serum Copper + Serum Zinc + High-Sensitivity CRP",
    "offerRate": 2250,
    "catalogueRate": 3000,
    "b2bPrice": 900,
    "offeredPrice": 2250
  },
  {
    "id": 4,
    "name": "Avm 4 Profile",
    "paramCount": 88,
    "displayName": "Avm 4 Profile (88)",
    "contents": "AVM 3 Profile (83) + Apolipoprotein A1 + Apolipoprotein B + Lipoprotein (a) + hs-CRP",
    "offerRate": 2700,
    "catalogueRate": 3600,
    "b2bPrice": 1100,
    "offeredPrice": 2700
  },
  {
    "id": 5,
    "name": "Avm 5 Profile",
    "paramCount": 95,
    "displayName": "Avm 5 Profile (95)",
    "contents": "AVM 4 Profile (88) + Homocysteine + Beta-Ketone + Fructosamine + Rheumatoid Factor + Serum Folate",
    "offerRate": 4500,
    "catalogueRate": 6000,
    "b2bPrice": 1600,
    "offeredPrice": 4500
  },
  {
    "id": 6,
    "name": "Lipid Profile",
    "paramCount": 10,
    "displayName": "Lipid Profile (10)",
    "contents": "Total Cholesterol, Triglycerides, HDL Cholesterol, LDL Cholesterol, VLDL, Non-HDL, TC/HDL Ratio, LDL/HDL Ratio, HDL/LDL Ratio, Triglyceride/HDL Ratio",
    "offerRate": 188,
    "catalogueRate": 250,
    "b2bPrice": 40,
    "offeredPrice": 188
  },
  {
    "id": 7,
    "name": "Liver Profile",
    "paramCount": 12,
    "displayName": "Liver Profile (12)",
    "contents": "Bilirubin - Total, Bilirubin - Direct, Bilirubin - Indirect, SGOT/AST, SGPT/ALT, SGOT/SGPT Ratio, Alkaline Phosphatase, Total Protein, Albumin, Globulin, A/G Ratio, GGT",
    "offerRate": 225,
    "catalogueRate": 300,
    "b2bPrice": 70,
    "offeredPrice": 225
  },
  {
    "id": 8,
    "name": "Kidney Profile",
    "paramCount": 8,
    "displayName": "Kidney Profile (8)",
    "contents": "BUN, Calcium, Serum Creatinine, Uric Acid, Urea, BUN/Creatinine Ratio, Urea/Creatinine Ratio, eGFR",
    "offerRate": 188,
    "catalogueRate": 250,
    "b2bPrice": 40,
    "offeredPrice": 188
  },
  {
    "id": 9,
    "name": "IRON Profile",
    "paramCount": 4,
    "displayName": "IRON Profile (4)",
    "contents": "Serum Iron, Total Iron Binding Capacity (TIBC), UIBC, % Transferrin Saturation",
    "offerRate": 225,
    "catalogueRate": 300,
    "b2bPrice": 60,
    "offeredPrice": 225
  },
  {
    "id": 10,
    "name": "Pancreatic Profile",
    "paramCount": 2,
    "displayName": "Pancreatic Profile (2)",
    "contents": "Serum Amylase, Serum Lipase",
    "offerRate": 375,
    "catalogueRate": 500,
    "b2bPrice": 100,
    "offeredPrice": 375
  },
  {
    "id": 11,
    "name": "Total Thyoid Profile",
    "paramCount": 3,
    "displayName": "Total Thyoid Profile (3)",
    "contents": "Total Triiodothyronine (T3), Total Thyroxine (T4), Thyroid Stimulating Hormone (TSH)",
    "offerRate": 225,
    "catalogueRate": 300,
    "b2bPrice": 50,
    "offeredPrice": 225
  },
  {
    "id": 12,
    "name": "Vitamin Profile",
    "paramCount": 2,
    "displayName": "Vitamin Profile (2)",
    "contents": "Vitamin B12 (Cyanocobalamin), Vitamin D Total (25-OH)",
    "offerRate": 600,
    "catalogueRate": 800,
    "b2bPrice": 180,
    "offeredPrice": 600
  },
  {
    "id": 13,
    "name": "Advance Thyroid Profile",
    "paramCount": 5,
    "displayName": "Advance Thyroid Profile (5)",
    "contents": "Total T3, Total T4, TSH, Free T3 (FT3), Free T4 (FT4)",
    "offerRate": 375,
    "catalogueRate": 500,
    "b2bPrice": 90,
    "offeredPrice": 375
  },
  {
    "id": 14,
    "name": "Egg Reserve Profile (Erp)",
    "paramCount": 7,
    "displayName": "Egg Reserve Profile (Erp) (7)",
    "contents": "LH, FSH, PRL, AMH, TSH, HbA1c, Hemoglobin",
    "offerRate": 1200,
    "catalogueRate": 1600,
    "b2bPrice": 800,
    "offeredPrice": 1200
  },
  {
    "id": 15,
    "name": "Avm Thyroid Profile (T6)",
    "paramCount": 6,
    "displayName": "Avm Thyroid Profile (T6) (6)",
    "contents": "Total T3, Total T4, TSH, Free T3, Free T4, Anti-Microsomal Antibody (AMA)",
    "offerRate": 600,
    "catalogueRate": 800,
    "b2bPrice": 400,
    "offeredPrice": 600
  },
  {
    "id": 16,
    "name": "Double Marker Profile (8 To 13 Weeks)",
    "paramCount": 2,
    "displayName": "Double Marker Profile (8 To 13 Weeks) (2)",
    "contents": "Free Beta hCG (FBHCG), Pregnancy-Associated Plasma Protein A (PAPP-A)",
    "offerRate": 750,
    "catalogueRate": 1000,
    "b2bPrice": 600,
    "offeredPrice": 750
  }
];

export const LPL_TESTS: TestItem[] = [
  {
    "id": 1,
    "code": "UTSH",
    "description": "Thyroid-Stimulating Hormone (TSH)",
    "technology": "C.L.I.A",
    "sample": "Serum",
    "offerRate": 75,
    "catalogueRate": 100,
    "b2bPrice": 10,
    "offeredPrice": 75
  },
  {
    "id": 2,
    "code": "CHOL",
    "description": "Total Cholesterol",
    "technology": "Photometry",
    "sample": "Serum",
    "offerRate": 75,
    "catalogueRate": 100,
    "b2bPrice": 10,
    "offeredPrice": 75
  },
  {
    "id": 3,
    "code": "FBS",
    "description": "Fasting Blood Sugar (FBS)",
    "technology": "Photometry",
    "sample": "Fluoride",
    "offerRate": 75,
    "catalogueRate": 100,
    "b2bPrice": 10,
    "offeredPrice": 75
  },
  {
    "id": 4,
    "code": "PPBS",
    "description": "Postprandial Blood Sugar (PPBS)",
    "technology": "Photometry",
    "sample": "Fluoride",
    "offerRate": 75,
    "catalogueRate": 100,
    "b2bPrice": 10,
    "offeredPrice": 75
  },
  {
    "id": 5,
    "code": "RBS",
    "description": "Random Blood Sugar (RBS)",
    "technology": "Photometry",
    "sample": "Fluoride",
    "offerRate": 75,
    "catalogueRate": 100,
    "b2bPrice": 10,
    "offeredPrice": 75
  },
  {
    "id": 6,
    "code": "TRIG",
    "description": "Triglycerides",
    "technology": "Photometry",
    "sample": "Serum",
    "offerRate": 75,
    "catalogueRate": 100,
    "b2bPrice": 10,
    "offeredPrice": 75
  },
  {
    "id": 7,
    "code": "ALKP",
    "description": "Alkaline Phosphatase",
    "technology": "Photometry",
    "sample": "Serum",
    "offerRate": 75,
    "catalogueRate": 100,
    "b2bPrice": 10,
    "offeredPrice": 75
  },
  {
    "id": 8,
    "code": "BILD",
    "description": "Bilirubin - Direct",
    "technology": "Photometry",
    "sample": "Serum",
    "offerRate": 75,
    "catalogueRate": 100,
    "b2bPrice": 10,
    "offeredPrice": 75
  },
  {
    "id": 9,
    "code": "BILT",
    "description": "Bilirubin - Total",
    "technology": "Photometry",
    "sample": "Serum",
    "offerRate": 75,
    "catalogueRate": 100,
    "b2bPrice": 10,
    "offeredPrice": 75
  },
  {
    "id": 10,
    "code": "LDH",
    "description": "Lactate Dehydrogenase (LDH)",
    "technology": "Photometry",
    "sample": "Serum",
    "offerRate": 75,
    "catalogueRate": 100,
    "b2bPrice": 10,
    "offeredPrice": 75
  },
  {
    "id": 11,
    "code": "MG",
    "description": "Serum Magnesium",
    "technology": "Photometry",
    "sample": "Serum",
    "offerRate": 75,
    "catalogueRate": 100,
    "b2bPrice": 10,
    "offeredPrice": 75
  },
  {
    "id": 12,
    "code": "PHOS",
    "description": "Serum Phosphorus",
    "technology": "Photometry",
    "sample": "Serum",
    "offerRate": 75,
    "catalogueRate": 100,
    "b2bPrice": 10,
    "offeredPrice": 75
  },
  {
    "id": 13,
    "code": "PROT",
    "description": "Protein - Total",
    "technology": "Photometry",
    "sample": "Serum",
    "offerRate": 75,
    "catalogueRate": 100,
    "b2bPrice": 10,
    "offeredPrice": 75
  },
  {
    "id": 14,
    "code": "SALB",
    "description": "Albumin - Serum",
    "technology": "Photometry",
    "sample": "Serum",
    "offerRate": 75,
    "catalogueRate": 100,
    "b2bPrice": 10,
    "offeredPrice": 75
  },
  {
    "id": 15,
    "code": "SGOT",
    "description": "Aspartate Aminotransferase (SGOT)",
    "technology": "Photometry",
    "sample": "Serum",
    "offerRate": 75,
    "catalogueRate": 100,
    "b2bPrice": 10,
    "offeredPrice": 75
  },
  {
    "id": 16,
    "code": "SGPT",
    "description": "Alanine Transaminase (SGPT)",
    "technology": "Photometry",
    "sample": "Serum",
    "offerRate": 75,
    "catalogueRate": 100,
    "b2bPrice": 10,
    "offeredPrice": 75
  },
  {
    "id": 17,
    "code": "GGT",
    "description": "Gamma Glutamyl Transferase (GGT)",
    "technology": "Photometry",
    "sample": "Serum",
    "offerRate": 75,
    "catalogueRate": 100,
    "b2bPrice": 10,
    "offeredPrice": 75
  },
  {
    "id": 18,
    "code": "BUN",
    "description": "Blood Urea Nitrogen (BUN)",
    "technology": "Photometry",
    "sample": "Serum",
    "offerRate": 75,
    "catalogueRate": 100,
    "b2bPrice": 10,
    "offeredPrice": 75
  },
  {
    "id": 19,
    "code": "CALC",
    "description": "Serum Calcium",
    "technology": "Photometry",
    "sample": "Serum",
    "offerRate": 75,
    "catalogueRate": 100,
    "b2bPrice": 10,
    "offeredPrice": 75
  },
  {
    "id": 20,
    "code": "SCRE",
    "description": "Serum Creatinine",
    "technology": "Photometry",
    "sample": "Serum",
    "offerRate": 75,
    "catalogueRate": 100,
    "b2bPrice": 10,
    "offeredPrice": 75
  },
  {
    "id": 21,
    "code": "TT3",
    "description": "Total T3",
    "technology": "C.L.I.A",
    "sample": "Serum",
    "offerRate": 75,
    "catalogueRate": 100,
    "b2bPrice": 20,
    "offeredPrice": 75
  },
  {
    "id": 22,
    "code": "TT4",
    "description": "Total T4",
    "technology": "C.L.I.A",
    "sample": "Serum",
    "offerRate": 75,
    "catalogueRate": 100,
    "b2bPrice": 20,
    "offeredPrice": 75
  },
  {
    "id": 23,
    "code": "UREA",
    "description": "Blood Urea",
    "technology": "Photometry",
    "sample": "Serum",
    "offerRate": 75,
    "catalogueRate": 100,
    "b2bPrice": 20,
    "offeredPrice": 75
  },
  {
    "id": 24,
    "code": "URIC",
    "description": "Uric Acid",
    "technology": "Photometry",
    "sample": "Serum",
    "offerRate": 75,
    "catalogueRate": 100,
    "b2bPrice": 20,
    "offeredPrice": 75
  },
  {
    "id": 25,
    "code": "HCHO",
    "description": "Hdl Cholesterol - Direct",
    "technology": "Photometry",
    "sample": "Serum",
    "offerRate": 75,
    "catalogueRate": 100,
    "b2bPrice": 20,
    "offeredPrice": 75
  },
  {
    "id": 26,
    "code": "IRON",
    "description": "Serum Iron",
    "technology": "Photometry",
    "sample": "Serum",
    "offerRate": 75,
    "catalogueRate": 100,
    "b2bPrice": 20,
    "offeredPrice": 75
  },
  {
    "id": 27,
    "code": "LDL",
    "description": "LDL Cholesterol - Direct",
    "technology": "Photometry",
    "sample": "Serum",
    "offerRate": 75,
    "catalogueRate": 100,
    "b2bPrice": 20,
    "offeredPrice": 75
  },
  {
    "id": 28,
    "code": "CRP",
    "description": "C-Reactive Protein (CRP)",
    "technology": "Photometry",
    "sample": "Serum",
    "offerRate": 75,
    "catalogueRate": 100,
    "b2bPrice": 20,
    "offeredPrice": 75
  },
  {
    "id": 29,
    "code": "CHL",
    "description": "Serum Chloride",
    "technology": "I.S.E",
    "sample": "Serum",
    "offerRate": 75,
    "catalogueRate": 100,
    "b2bPrice": 25,
    "offeredPrice": 75
  },
  {
    "id": 30,
    "code": "POT",
    "description": "Serum Potassium",
    "technology": "I.S.E",
    "sample": "Serum",
    "offerRate": 75,
    "catalogueRate": 100,
    "b2bPrice": 25,
    "offeredPrice": 75
  },
  {
    "id": 31,
    "code": "SOD",
    "description": "Serum Sodium",
    "technology": "I.S.E",
    "sample": "Serum",
    "offerRate": 75,
    "catalogueRate": 100,
    "b2bPrice": 25,
    "offeredPrice": 75
  },
  {
    "id": 32,
    "code": "FT3",
    "description": "Free T3",
    "technology": "C.L.I.A",
    "sample": "Serum",
    "offerRate": 75,
    "catalogueRate": 100,
    "b2bPrice": 30,
    "offeredPrice": 75
  },
  {
    "id": 33,
    "code": "FT4",
    "description": "Free T4",
    "technology": "C.L.I.A",
    "sample": "Serum",
    "offerRate": 75,
    "catalogueRate": 100,
    "b2bPrice": 30,
    "offeredPrice": 75
  },
  {
    "id": 34,
    "code": "AMYL",
    "description": "Serum Amylase",
    "technology": "Photometry",
    "sample": "Serum",
    "offerRate": 150,
    "catalogueRate": 200,
    "b2bPrice": 35,
    "offeredPrice": 150
  },
  {
    "id": 35,
    "code": "LPA",
    "description": "Lipoprotein (a)",
    "technology": "Photometry",
    "sample": "Serum",
    "offerRate": 150,
    "catalogueRate": 200,
    "b2bPrice": 35,
    "offeredPrice": 150
  },
  {
    "id": 36,
    "code": "TIBC",
    "description": "Total Iron Binding Capacity",
    "technology": "Photometry",
    "sample": "Serum",
    "offerRate": 150,
    "catalogueRate": 200,
    "b2bPrice": 40,
    "offeredPrice": 150
  },
  {
    "id": 37,
    "code": "APOB",
    "description": "Apolipoprotein B",
    "technology": "Photometry",
    "sample": "Serum",
    "offerRate": 150,
    "catalogueRate": 200,
    "b2bPrice": 45,
    "offeredPrice": 150
  },
  {
    "id": 38,
    "code": "APOA",
    "description": "Apolipoprotein A1",
    "technology": "Photometry",
    "sample": "Serum",
    "offerRate": 150,
    "catalogueRate": 200,
    "b2bPrice": 45,
    "offeredPrice": 150
  },
  {
    "id": 39,
    "code": "A1c",
    "description": "HbA1c (Glycosylated Hemoglobin)",
    "technology": "H.P.L.C",
    "sample": "EDTA",
    "offerRate": 225,
    "catalogueRate": 300,
    "b2bPrice": 50,
    "offeredPrice": 225
  },
  {
    "id": 40,
    "code": "SEZN",
    "description": "Serum Zinc",
    "technology": "Photometry",
    "sample": "Serum",
    "offerRate": 150,
    "catalogueRate": 200,
    "b2bPrice": 50,
    "offeredPrice": 150
  },
  {
    "id": 41,
    "code": "HSCPRP",
    "description": "High-Sensitivity CRP (hs-CRP)",
    "technology": "Photometry",
    "sample": "Serum",
    "offerRate": 150,
    "catalogueRate": 200,
    "b2bPrice": 50,
    "offeredPrice": 150
  },
  {
    "id": 42,
    "code": "CBC",
    "description": "Complete Blood Count (CBC)",
    "technology": "Hematology",
    "sample": "Serum",
    "offerRate": 225,
    "catalogueRate": 300,
    "b2bPrice": 60,
    "offeredPrice": 225
  },
  {
    "id": 43,
    "code": "SECU",
    "description": "Serum Copper",
    "technology": "Photometry",
    "sample": "Serum",
    "offerRate": 150,
    "catalogueRate": 200,
    "b2bPrice": 60,
    "offeredPrice": 150
  },
  {
    "id": 44,
    "code": "LASE",
    "description": "Serum Lipase",
    "technology": "Photometry",
    "sample": "Serum",
    "offerRate": 225,
    "catalogueRate": 300,
    "b2bPrice": 65,
    "offeredPrice": 225
  },
  {
    "id": 45,
    "code": "FRUCT",
    "description": "Fructosamine",
    "technology": "Photometry",
    "sample": "Serum",
    "offerRate": 150,
    "catalogueRate": 200,
    "b2bPrice": 70,
    "offeredPrice": 150
  },
  {
    "id": 46,
    "code": "SAG",
    "description": "Hepatitis B Surface Antigen (Hbsag)",
    "technology": "C.L.I.A",
    "sample": "Serum",
    "offerRate": 150,
    "catalogueRate": 200,
    "b2bPrice": 75,
    "offeredPrice": 150
  },
  {
    "id": 47,
    "code": "CUA",
    "description": "Complete Urine Analysis",
    "technology": "Microscopy",
    "sample": "Urine",
    "offerRate": 225,
    "catalogueRate": 300,
    "b2bPrice": 80,
    "offeredPrice": 225
  },
  {
    "id": 48,
    "code": "VITB",
    "description": "Vitamin B12",
    "technology": "C.L.I.A",
    "sample": "Serum",
    "offerRate": 300,
    "catalogueRate": 400,
    "b2bPrice": 80,
    "offeredPrice": 300
  },
  {
    "id": 49,
    "code": "FSH",
    "description": "Follicle-stimulating Hormone",
    "technology": "C.L.I.A",
    "sample": "Serum",
    "offerRate": 188,
    "catalogueRate": 250,
    "b2bPrice": 80,
    "offeredPrice": 188
  },
  {
    "id": 50,
    "code": "LH",
    "description": "Luteinizing Hormone",
    "technology": "C.L.I.A",
    "sample": "Serum",
    "offerRate": 188,
    "catalogueRate": 250,
    "b2bPrice": 80,
    "offeredPrice": 188
  },
  {
    "id": 51,
    "code": "PRL",
    "description": "Prolactin",
    "technology": "C.L.I.A",
    "sample": "Serum",
    "offerRate": 188,
    "catalogueRate": 250,
    "b2bPrice": 80,
    "offeredPrice": 188
  },
  {
    "id": 52,
    "code": "E2",
    "description": "Estradiol",
    "technology": "C.L.I.A",
    "sample": "Serum",
    "offerRate": 225,
    "catalogueRate": 300,
    "b2bPrice": 85,
    "offeredPrice": 225
  },
  {
    "id": 53,
    "code": "TPSA",
    "description": "Total Psa",
    "technology": "C.L.I.A",
    "sample": "Serum",
    "offerRate": 225,
    "catalogueRate": 300,
    "b2bPrice": 90,
    "offeredPrice": 225
  },
  {
    "id": 54,
    "code": "BHCG",
    "description": "Total Βhcg",
    "technology": "C.L.I.A",
    "sample": "Serum",
    "offerRate": 225,
    "catalogueRate": 300,
    "b2bPrice": 90,
    "offeredPrice": 225
  },
  {
    "id": 55,
    "code": "RFAC",
    "description": "Rheumatoid Factor (RA/RF)",
    "technology": "Photometry",
    "sample": "Serum",
    "offerRate": 225,
    "catalogueRate": 300,
    "b2bPrice": 90,
    "offeredPrice": 225
  },
  {
    "id": 56,
    "code": "HIV",
    "description": "Hiv Ab/ag Combo",
    "technology": "C.L.I.A",
    "sample": "Serum",
    "offerRate": 300,
    "catalogueRate": 400,
    "b2bPrice": 95,
    "offeredPrice": 300
  },
  {
    "id": 57,
    "code": "VITDC",
    "description": "25-oh Vitamin D Total",
    "technology": "C.L.I.A",
    "sample": "Serum",
    "offerRate": 300,
    "catalogueRate": 400,
    "b2bPrice": 100,
    "offeredPrice": 300
  },
  {
    "id": 58,
    "code": "FERR",
    "description": "Serum Ferritin",
    "technology": "C.L.I.A",
    "sample": "Serum",
    "offerRate": 225,
    "catalogueRate": 300,
    "b2bPrice": 100,
    "offeredPrice": 225
  },
  {
    "id": 59,
    "code": "AHCV",
    "description": "Anti Hepatitis C Virus Total",
    "technology": "C.L.I.A",
    "sample": "Serum",
    "offerRate": 450,
    "catalogueRate": 600,
    "b2bPrice": 105,
    "offeredPrice": 450
  },
  {
    "id": 60,
    "code": "TESTO",
    "description": "Testosterone",
    "technology": "C.L.I.A",
    "sample": "Serum",
    "offerRate": 225,
    "catalogueRate": 300,
    "b2bPrice": 105,
    "offeredPrice": 225
  },
  {
    "id": 61,
    "code": "CA125",
    "description": "Ca125",
    "technology": "C.L.I.A",
    "sample": "Serum",
    "offerRate": 413,
    "catalogueRate": 550,
    "b2bPrice": 115,
    "offeredPrice": 413
  },
  {
    "id": 62,
    "code": "CEA",
    "description": "Carcinoembryonic Antigen",
    "technology": "C.L.I.A",
    "sample": "Serum",
    "offerRate": 413,
    "catalogueRate": 550,
    "b2bPrice": 115,
    "offeredPrice": 413
  },
  {
    "id": 63,
    "code": "INSFA",
    "description": "Insulin - Fasting",
    "technology": "C.L.I.A",
    "sample": "Serum",
    "offerRate": 225,
    "catalogueRate": 300,
    "b2bPrice": 115,
    "offeredPrice": 225
  },
  {
    "id": 64,
    "code": "TIGE",
    "description": "Immunoglobulin E",
    "technology": "C.L.I.A",
    "sample": "Serum",
    "offerRate": 225,
    "catalogueRate": 300,
    "b2bPrice": 120,
    "offeredPrice": 225
  },
  {
    "id": 65,
    "code": "CA199",
    "description": "Ca19.9",
    "technology": "C.L.I.A",
    "sample": "Serum",
    "offerRate": 375,
    "catalogueRate": 500,
    "b2bPrice": 130,
    "offeredPrice": 375
  },
  {
    "id": 66,
    "code": "CPEP",
    "description": "C-peptide",
    "technology": "C.L.I.A",
    "sample": "Serum",
    "offerRate": 375,
    "catalogueRate": 500,
    "b2bPrice": 130,
    "offeredPrice": 375
  },
  {
    "id": 67,
    "code": "CORT",
    "description": "Cortisol",
    "technology": "C.L.I.A",
    "sample": "Serum",
    "offerRate": 338,
    "catalogueRate": 450,
    "b2bPrice": 130,
    "offeredPrice": 338
  },
  {
    "id": 68,
    "code": "BKETO",
    "description": "Blood Ketone",
    "technology": "Photometry",
    "sample": "Serum",
    "offerRate": 225,
    "catalogueRate": 300,
    "b2bPrice": 145,
    "offeredPrice": 225
  },
  {
    "id": 69,
    "code": "DHEAS",
    "description": "Dehydroepiandrosterone Sulfate (Dhea-s)",
    "technology": "C.L.I.A",
    "sample": "Serum",
    "offerRate": 450,
    "catalogueRate": 600,
    "b2bPrice": 150,
    "offeredPrice": 450
  },
  {
    "id": 70,
    "code": "FOLI",
    "description": "Serum Folate",
    "technology": "C.L.I.A",
    "sample": "Serum",
    "offerRate": 338,
    "catalogueRate": 450,
    "b2bPrice": 155,
    "offeredPrice": 338
  },
  {
    "id": 71,
    "code": "FBHCG",
    "description": "Free Β-hcg",
    "technology": "C.L.I.A",
    "sample": "Serum",
    "offerRate": 338,
    "catalogueRate": 450,
    "b2bPrice": 160,
    "offeredPrice": 338
  },
  {
    "id": 72,
    "code": "PAPPA",
    "description": "Papp-a",
    "technology": "C.L.I.A",
    "sample": "Serum",
    "offerRate": 338,
    "catalogueRate": 450,
    "b2bPrice": 160,
    "offeredPrice": 338
  },
  {
    "id": 73,
    "code": "AMA",
    "description": "Anti Microsomal Antibody (AMA)",
    "technology": "C.L.I.A",
    "sample": "Serum",
    "offerRate": 375,
    "catalogueRate": 500,
    "b2bPrice": 180,
    "offeredPrice": 375
  },
  {
    "id": 74,
    "code": "SHBG",
    "description": "Sex Hormone-binding Globulin (Shbg)",
    "technology": "C.L.I.A",
    "sample": "Serum",
    "offerRate": 375,
    "catalogueRate": 500,
    "b2bPrice": 180,
    "offeredPrice": 375
  },
  {
    "id": 75,
    "code": "TROP",
    "description": "Troponin",
    "technology": "C.L.I.A",
    "sample": "Serum",
    "offerRate": 450,
    "catalogueRate": 600,
    "b2bPrice": 190,
    "offeredPrice": 450
  },
  {
    "id": 76,
    "code": "ACCP",
    "description": "Anti-cyclic Citrullinated Peptide",
    "technology": "C.L.I.A",
    "sample": "Serum",
    "offerRate": 488,
    "catalogueRate": 650,
    "b2bPrice": 205,
    "offeredPrice": 488
  },
  {
    "id": 77,
    "code": "HOMO",
    "description": "Homocysteine",
    "technology": "Photometry",
    "sample": "Serum",
    "offerRate": 375,
    "catalogueRate": 500,
    "b2bPrice": 205,
    "offeredPrice": 375
  },
  {
    "id": 78,
    "code": "AMH",
    "description": "Anti-Müllerian Hormone (AMH)",
    "technology": "C.L.I.A",
    "sample": "Serum",
    "offerRate": 563,
    "catalogueRate": 750,
    "b2bPrice": 250,
    "offeredPrice": 563
  },
  {
    "id": 79,
    "code": "ESR",
    "description": "Erythrocyte Sedimentation Rate (ESR)",
    "technology": "Manual",
    "sample": "EDTA",
    "offerRate": 75,
    "catalogueRate": 100,
    "b2bPrice": 50,
    "offeredPrice": 75
  }
];
