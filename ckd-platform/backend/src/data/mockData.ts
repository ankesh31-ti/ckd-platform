import { Patient } from '../../frontend/src/types';

function daysAgo(n: number): string {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d.toISOString().split('T')[0];
}

export const mockPatients: Omit<Patient, 'gStage' | 'riskLevel' | 'egfrTrend' | 'annualizedSlope' | 'predictedEgfr6Mo' | 'observationSpanDays' | 'isVerifiedCKD'>[] = [
  {
    id: 'P1', name: 'Rajesh Kumar', age: 64, gender: 'Male', lastUpdated: daysAgo(0),
    labs: [
      { date: daysAgo(150), egfr: 14, creatinine: 2.1, bun: 38, uacr: 480, uricAcid: 7.1, potassium: 5.2, sodium: 136, calcium: 9.1, phosphate: 5.1, bicarbonate: 21, hemoglobin: 9.8, hematocrit: 30, ferritin: 280, tsat: 25, albumin: 3.6 },
      { date: daysAgo(120), egfr: 12, creatinine: 2.3, bun: 40, uacr: 510, uricAcid: 7.3, potassium: 5.4, sodium: 135, calcium: 9.0, phosphate: 5.3, bicarbonate: 20, hemoglobin: 9.5, hematocrit: 29, ferritin: 290, tsat: 24, albumin: 3.5 },
      { date: daysAgo(90), egfr: 10, creatinine: 2.6, bun: 44, uacr: 530, uricAcid: 7.5, potassium: 5.5, sodium: 134, calcium: 8.9, phosphate: 5.5, bicarbonate: 19, hemoglobin: 9.2, hematocrit: 28, ferritin: 300, tsat: 23, albumin: 3.4 },
      { date: daysAgo(30), egfr: 8, creatinine: 2.9, bun: 48, uacr: 560, uricAcid: 7.8, potassium: 5.7, sodium: 133, calcium: 8.8, phosphate: 5.7, bicarbonate: 18, hemoglobin: 8.8, hematocrit: 27, ferritin: 320, tsat: 22, albumin: 3.3 },
    ],
    vitals: [{ date: daysAgo(30), systolic: 158, diastolic: 98, weight: 74 }, { date: daysAgo(90), systolic: 162, diastolic: 100, weight: 75 }],
    medications: [{ name: 'Ramipril', dosage: '10mg', indication: 'HTN / Renal Protection', timeOfDay: 'morning' }, { name: 'Furosemide', dosage: '40mg', indication: 'Fluid Management', timeOfDay: 'evening' }, { name: 'Sodium Bicarbonate', dosage: '650mg', indication: 'Acidosis', timeOfDay: 'morning' }],
    comorbidities: { diabetes: true, hypertension: true, heartDisease: false, obesity: false, anemia: true },
  },
  {
    id: 'P2', name: 'Ankur Sharma', age: 58, gender: 'Male', lastUpdated: daysAgo(1),
    labs: [
      { date: daysAgo(140), egfr: 16, creatinine: 2.0, bun: 35, uacr: 420, uricAcid: 6.9, potassium: 6.1, sodium: 137, calcium: 9.2, phosphate: 4.9, bicarbonate: 22, hemoglobin: 10.2, hematocrit: 31, ferritin: 260, tsat: 27, albumin: 3.7 },
      { date: daysAgo(90), egfr: 13, creatinine: 2.4, bun: 39, uacr: 450, uricAcid: 7.0, potassium: 6.2, sodium: 136, calcium: 9.1, phosphate: 5.0, bicarbonate: 21, hemoglobin: 9.9, hematocrit: 30, ferritin: 270, tsat: 26, albumin: 3.6 },
      { date: daysAgo(30), egfr: 8, creatinine: 2.8, bun: 46, uacr: 470, uricAcid: 7.2, potassium: 6.3, sodium: 135, calcium: 9.0, phosphate: 5.2, bicarbonate: 20, hemoglobin: 9.6, hematocrit: 29, ferritin: 280, tsat: 25, albumin: 3.5 },
    ],
    vitals: [{ date: daysAgo(30), systolic: 165, diastolic: 102, weight: 82 }],
    medications: [{ name: 'Amlodipine', dosage: '5mg', indication: 'Hypertension', timeOfDay: 'morning' }, { name: 'Patiromer', dosage: '8.4g', indication: 'Hyperkalemia', timeOfDay: 'evening' }],
    comorbidities: { diabetes: true, hypertension: true, heartDisease: true, obesity: false, anemia: true },
  },
  {
    id: 'P3', name: 'Aashi Verma', age: 45, gender: 'Female', lastUpdated: daysAgo(2),
    labs: [
      { date: daysAgo(160), egfr: 58, creatinine: 1.1, bun: 22, uacr: 180, uricAcid: 5.8, potassium: 4.2, sodium: 139, calcium: 9.5, phosphate: 3.8, bicarbonate: 24, hemoglobin: 11.8, hematocrit: 36, ferritin: 120, tsat: 30, albumin: 4.0 },
      { date: daysAgo(100), egfr: 52, creatinine: 1.2, bun: 25, uacr: 200, uricAcid: 5.9, potassium: 4.3, sodium: 138, calcium: 9.4, phosphate: 3.9, bicarbonate: 23, hemoglobin: 11.5, hematocrit: 35, ferritin: 125, tsat: 29, albumin: 3.9 },
      { date: daysAgo(30), egfr: 44, creatinine: 1.4, bun: 28, uacr: 220, uricAcid: 6.0, potassium: 4.4, sodium: 138, calcium: 9.3, phosphate: 4.0, bicarbonate: 23, hemoglobin: 11.2, hematocrit: 34, ferritin: 130, tsat: 28, albumin: 3.8 },
    ],
    vitals: [{ date: daysAgo(30), systolic: 148, diastolic: 92, weight: 61 }],
    medications: [{ name: 'Losartan', dosage: '50mg', indication: 'HTN / Renal Protection', timeOfDay: 'morning' }, { name: 'Dapagliflozin', dosage: '10mg', indication: 'CKD Progression', timeOfDay: 'morning' }],
    comorbidities: { diabetes: false, hypertension: true, heartDisease: false, obesity: false, anemia: false },
  },
  {
    id: 'P4', name: 'Aman Singh', age: 69, gender: 'Male', lastUpdated: daysAgo(1),
    labs: [
      { date: daysAgo(180), egfr: 38, creatinine: 1.6, bun: 30, uacr: 350, uricAcid: 6.5, potassium: 4.8, sodium: 137, calcium: 9.3, phosphate: 4.2, bicarbonate: 22, hemoglobin: 10.8, hematocrit: 33, ferritin: 200, tsat: 28, albumin: 3.8 },
      { date: daysAgo(90), egfr: 32, creatinine: 1.9, bun: 34, uacr: 380, uricAcid: 6.7, potassium: 4.9, sodium: 136, calcium: 9.2, phosphate: 4.4, bicarbonate: 21, hemoglobin: 10.5, hematocrit: 32, ferritin: 210, tsat: 27, albumin: 3.7 },
      { date: daysAgo(30), egfr: 24, creatinine: 2.2, bun: 38, uacr: 410, uricAcid: 6.9, potassium: 5.0, sodium: 135, calcium: 9.1, phosphate: 4.6, bicarbonate: 21, hemoglobin: 10.2, hematocrit: 31, ferritin: 220, tsat: 26, albumin: 3.6 },
    ],
    vitals: [{ date: daysAgo(30), systolic: 155, diastolic: 96, weight: 79 }],
    medications: [{ name: 'Telmisartan', dosage: '40mg', indication: 'HTN / Renal Protection', timeOfDay: 'morning' }, { name: 'Allopurinol', dosage: '100mg', indication: 'Hyperuricemia', timeOfDay: 'evening' }],
    comorbidities: { diabetes: true, hypertension: true, heartDisease: false, obesity: true, anemia: true },
  },
  {
    id: 'P5', name: 'Pooja Mehta', age: 52, gender: 'Female', lastUpdated: daysAgo(0),
    labs: [
      { date: daysAgo(130), egfr: 18, creatinine: 1.9, bun: 36, uacr: 490, uricAcid: 7.0, potassium: 5.1, sodium: 136, calcium: 9.0, phosphate: 5.0, bicarbonate: 20, hemoglobin: 9.5, hematocrit: 29, ferritin: 250, tsat: 24, albumin: 3.5 },
      { date: daysAgo(60), egfr: 14, creatinine: 2.3, bun: 42, uacr: 520, uricAcid: 7.2, potassium: 5.3, sodium: 135, calcium: 8.9, phosphate: 5.2, bicarbonate: 19, hemoglobin: 9.2, hematocrit: 28, ferritin: 260, tsat: 23, albumin: 3.4 },
      { date: daysAgo(14), egfr: 11, creatinine: 2.7, bun: 47, uacr: 550, uricAcid: 7.4, potassium: 5.5, sodium: 134, calcium: 8.8, phosphate: 5.4, bicarbonate: 18, hemoglobin: 8.9, hematocrit: 27, ferritin: 275, tsat: 22, albumin: 3.3 },
    ],
    vitals: [{ date: daysAgo(14), systolic: 170, diastolic: 105, weight: 65 }],
    medications: [{ name: 'Carvedilol', dosage: '6.25mg', indication: 'HTN / Heart Protection', timeOfDay: 'both' }, { name: 'Erythropoietin', dosage: '4000IU', indication: 'Anemia of CKD', timeOfDay: 'morning' }],
    comorbidities: { diabetes: true, hypertension: true, heartDisease: true, obesity: false, anemia: true },
  },
  {
    id: 'P6', name: 'Neha Gupta', age: 41, gender: 'Female', lastUpdated: daysAgo(3),
    labs: [
      { date: daysAgo(120), egfr: 48, creatinine: 1.2, bun: 20, uacr: 280, uricAcid: 5.5, potassium: 4.5, sodium: 140, calcium: 9.6, phosphate: 3.7, bicarbonate: 24, hemoglobin: 12.0, hematocrit: 37, ferritin: 90, tsat: 32, albumin: 4.1 },
      { date: daysAgo(60), egfr: 41, creatinine: 1.4, bun: 23, uacr: 310, uricAcid: 5.7, potassium: 4.6, sodium: 139, calcium: 9.5, phosphate: 3.8, bicarbonate: 23, hemoglobin: 11.7, hematocrit: 36, ferritin: 95, tsat: 31, albumin: 4.0 },
      { date: daysAgo(10), egfr: 33, creatinine: 1.7, bun: 27, uacr: 340, uricAcid: 5.9, potassium: 4.8, sodium: 139, calcium: 9.4, phosphate: 3.9, bicarbonate: 23, hemoglobin: 11.4, hematocrit: 35, ferritin: 100, tsat: 30, albumin: 3.9 },
    ],
    vitals: [{ date: daysAgo(10), systolic: 145, diastolic: 90, weight: 58 }],
    medications: [{ name: 'Empagliflozin', dosage: '10mg', indication: 'CKD / Diabetes', timeOfDay: 'morning' }],
    comorbidities: { diabetes: true, hypertension: false, heartDisease: false, obesity: false, anemia: false },
  },
  {
    id: 'P7', name: 'Vikram Patel', age: 73, gender: 'Male', lastUpdated: daysAgo(2),
    labs: [
      { date: daysAgo(200), egfr: 22, creatinine: 2.0, bun: 33, uacr: 380, uricAcid: 6.8, potassium: 5.0, sodium: 137, calcium: 9.1, phosphate: 4.8, bicarbonate: 21, hemoglobin: 10.0, hematocrit: 30, ferritin: 190, tsat: 26, albumin: 3.7 },
      { date: daysAgo(100), egfr: 19, creatinine: 2.3, bun: 37, uacr: 400, uricAcid: 7.0, potassium: 5.2, sodium: 136, calcium: 9.0, phosphate: 5.0, bicarbonate: 20, hemoglobin: 9.7, hematocrit: 29, ferritin: 200, tsat: 25, albumin: 3.6 },
      { date: daysAgo(20), egfr: 16, creatinine: 2.7, bun: 42, uacr: 430, uricAcid: 7.2, potassium: 5.4, sodium: 135, calcium: 8.9, phosphate: 5.2, bicarbonate: 19, hemoglobin: 9.4, hematocrit: 28, ferritin: 215, tsat: 24, albumin: 3.5 },
    ],
    vitals: [{ date: daysAgo(20), systolic: 152, diastolic: 94, weight: 71 }],
    medications: [{ name: 'Perindopril', dosage: '4mg', indication: 'HTN / Renal Protection', timeOfDay: 'morning' }, { name: 'Sevelamer', dosage: '800mg', indication: 'Hyperphosphatemia', timeOfDay: 'both' }],
    comorbidities: { diabetes: false, hypertension: true, heartDisease: true, obesity: false, anemia: true },
  },
  {
    id: 'P8', name: 'Sunita Rao', age: 55, gender: 'Female', lastUpdated: daysAgo(4),
    labs: [
      { date: daysAgo(150), egfr: 55, creatinine: 1.0, bun: 18, uacr: 45, uricAcid: 5.2, potassium: 4.1, sodium: 140, calcium: 9.7, phosphate: 3.5, bicarbonate: 25, hemoglobin: 12.5, hematocrit: 38, ferritin: 85, tsat: 33, albumin: 4.2 },
      { date: daysAgo(75), egfr: 52, creatinine: 1.1, bun: 20, uacr: 48, uricAcid: 5.3, potassium: 4.2, sodium: 139, calcium: 9.6, phosphate: 3.6, bicarbonate: 24, hemoglobin: 12.3, hematocrit: 37, ferritin: 88, tsat: 32, albumin: 4.1 },
      { date: daysAgo(15), egfr: 50, creatinine: 1.1, bun: 21, uacr: 52, uricAcid: 5.4, potassium: 4.2, sodium: 139, calcium: 9.5, phosphate: 3.7, bicarbonate: 24, hemoglobin: 12.1, hematocrit: 37, ferritin: 90, tsat: 31, albumin: 4.1 },
    ],
    vitals: [{ date: daysAgo(15), systolic: 132, diastolic: 82, weight: 63 }],
    medications: [{ name: 'Olmesartan', dosage: '20mg', indication: 'Hypertension', timeOfDay: 'morning' }],
    comorbidities: { diabetes: false, hypertension: true, heartDisease: false, obesity: false, anemia: false },
  },
  {
    id: 'P9', name: 'Deepak Joshi', age: 60, gender: 'Male', lastUpdated: daysAgo(1),
    labs: [
      { date: daysAgo(170), egfr: 32, creatinine: 1.7, bun: 28, uacr: 290, uricAcid: 6.3, potassium: 4.7, sodium: 138, calcium: 9.2, phosphate: 4.1, bicarbonate: 22, hemoglobin: 11.0, hematocrit: 33, ferritin: 160, tsat: 29, albumin: 3.9 },
      { date: daysAgo(85), egfr: 26, creatinine: 2.0, bun: 33, uacr: 320, uricAcid: 6.5, potassium: 4.9, sodium: 137, calcium: 9.1, phosphate: 4.3, bicarbonate: 22, hemoglobin: 10.7, hematocrit: 32, ferritin: 170, tsat: 28, albumin: 3.8 },
      { date: daysAgo(20), egfr: 20, creatinine: 2.4, bun: 38, uacr: 355, uricAcid: 6.7, potassium: 5.1, sodium: 136, calcium: 9.0, phosphate: 4.5, bicarbonate: 21, hemoglobin: 10.4, hematocrit: 31, ferritin: 180, tsat: 27, albumin: 3.7 },
    ],
    vitals: [{ date: daysAgo(20), systolic: 148, diastolic: 92, weight: 77 }],
    medications: [{ name: 'Valsartan', dosage: '80mg', indication: 'HTN / Renal Protection', timeOfDay: 'morning' }, { name: 'Cinacalcet', dosage: '30mg', indication: 'Secondary Hyperparathyroidism', timeOfDay: 'evening' }],
    comorbidities: { diabetes: true, hypertension: true, heartDisease: false, obesity: true, anemia: true },
  },
  {
    id: 'P10', name: 'Priya Nair', age: 38, gender: 'Female', lastUpdated: daysAgo(5),
    labs: [
      { date: daysAgo(110), egfr: 72, creatinine: 0.9, bun: 15, uacr: 22, uricAcid: 4.8, potassium: 3.9, sodium: 141, calcium: 9.8, phosphate: 3.4, bicarbonate: 25, hemoglobin: 13.0, hematocrit: 39, ferritin: 75, tsat: 35, albumin: 4.3 },
      { date: daysAgo(55), egfr: 68, creatinine: 0.9, bun: 16, uacr: 25, uricAcid: 4.9, potassium: 4.0, sodium: 141, calcium: 9.7, phosphate: 3.5, bicarbonate: 25, hemoglobin: 12.8, hematocrit: 39, ferritin: 78, tsat: 34, albumin: 4.2 },
      { date: daysAgo(10), egfr: 65, creatinine: 1.0, bun: 17, uacr: 27, uricAcid: 5.0, potassium: 4.0, sodium: 140, calcium: 9.7, phosphate: 3.5, bicarbonate: 24, hemoglobin: 12.7, hematocrit: 38, ferritin: 80, tsat: 33, albumin: 4.2 },
    ],
    vitals: [{ date: daysAgo(10), systolic: 126, diastolic: 78, weight: 55 }],
    medications: [{ name: 'Lisinopril', dosage: '5mg', indication: 'Early Renal Protection', timeOfDay: 'morning' }],
    comorbidities: { diabetes: false, hypertension: false, heartDisease: false, obesity: false, anemia: false },
  },
  {
    id: 'P11', name: 'Harish Iyer', age: 67, gender: 'Male', lastUpdated: daysAgo(2),
    labs: [
      { date: daysAgo(160), egfr: 26, creatinine: 1.9, bun: 31, uacr: 360, uricAcid: 6.6, potassium: 5.0, sodium: 137, calcium: 9.1, phosphate: 4.6, bicarbonate: 21, hemoglobin: 10.3, hematocrit: 31, ferritin: 175, tsat: 27, albumin: 3.7 },
      { date: daysAgo(80), egfr: 21, creatinine: 2.2, bun: 36, uacr: 390, uricAcid: 6.8, potassium: 5.2, sodium: 136, calcium: 9.0, phosphate: 4.8, bicarbonate: 21, hemoglobin: 10.0, hematocrit: 30, ferritin: 185, tsat: 26, albumin: 3.6 },
      { date: daysAgo(15), egfr: 17, creatinine: 2.6, bun: 41, uacr: 420, uricAcid: 7.0, potassium: 5.4, sodium: 135, calcium: 8.9, phosphate: 5.0, bicarbonate: 20, hemoglobin: 9.7, hematocrit: 29, ferritin: 195, tsat: 25, albumin: 3.5 },
    ],
    vitals: [{ date: daysAgo(15), systolic: 156, diastolic: 97, weight: 72 }],
    medications: [{ name: 'Candesartan', dosage: '8mg', indication: 'HTN / Renal Protection', timeOfDay: 'morning' }, { name: 'Furosemide', dosage: '20mg', indication: 'Edema', timeOfDay: 'morning' }],
    comorbidities: { diabetes: true, hypertension: true, heartDisease: false, obesity: false, anemia: true },
  },
  {
    id: 'P12', name: 'Kavya Reddy', age: 49, gender: 'Female', lastUpdated: daysAgo(3),
    labs: [
      { date: daysAgo(130), egfr: 44, creatinine: 1.3, bun: 22, uacr: 155, uricAcid: 5.5, potassium: 4.3, sodium: 139, calcium: 9.4, phosphate: 3.8, bicarbonate: 23, hemoglobin: 11.8, hematocrit: 36, ferritin: 110, tsat: 30, albumin: 4.0 },
      { date: daysAgo(65), egfr: 39, creatinine: 1.5, bun: 25, uacr: 175, uricAcid: 5.7, potassium: 4.4, sodium: 139, calcium: 9.3, phosphate: 3.9, bicarbonate: 23, hemoglobin: 11.5, hematocrit: 35, ferritin: 115, tsat: 29, albumin: 3.9 },
      { date: daysAgo(10), egfr: 34, creatinine: 1.7, bun: 28, uacr: 195, uricAcid: 5.9, potassium: 4.5, sodium: 138, calcium: 9.2, phosphate: 4.0, bicarbonate: 22, hemoglobin: 11.2, hematocrit: 34, ferritin: 120, tsat: 28, albumin: 3.9 },
    ],
    vitals: [{ date: daysAgo(10), systolic: 140, diastolic: 88, weight: 66 }],
    medications: [{ name: 'Irbesartan', dosage: '150mg', indication: 'HTN / Diabetic Nephropathy', timeOfDay: 'morning' }, { name: 'Metformin', dosage: '500mg', indication: 'Diabetes', timeOfDay: 'both' }],
    comorbidities: { diabetes: true, hypertension: true, heartDisease: false, obesity: false, anemia: false },
  },
  {
    id: 'P13', name: 'Suresh Pillai', age: 76, gender: 'Male', lastUpdated: daysAgo(1),
    labs: [
      { date: daysAgo(190), egfr: 12, creatinine: 2.4, bun: 42, uacr: 580, uricAcid: 7.5, potassium: 5.6, sodium: 133, calcium: 8.7, phosphate: 5.8, bicarbonate: 17, hemoglobin: 8.5, hematocrit: 26, ferritin: 340, tsat: 20, albumin: 3.2 },
      { date: daysAgo(90), egfr: 9, creatinine: 2.9, bun: 50, uacr: 610, uricAcid: 7.7, potassium: 5.8, sodium: 132, calcium: 8.6, phosphate: 6.0, bicarbonate: 16, hemoglobin: 8.2, hematocrit: 25, ferritin: 355, tsat: 19, albumin: 3.1 },
      { date: daysAgo(20), egfr: 7, creatinine: 3.4, bun: 56, uacr: 640, uricAcid: 7.9, potassium: 6.0, sodium: 131, calcium: 8.5, phosphate: 6.2, bicarbonate: 15, hemoglobin: 7.9, hematocrit: 24, ferritin: 370, tsat: 18, albumin: 3.0 },
    ],
    vitals: [{ date: daysAgo(20), systolic: 172, diastolic: 108, weight: 68 }],
    medications: [{ name: 'Enalapril', dosage: '5mg', indication: 'HTN / Renal Protection', timeOfDay: 'morning' }, { name: 'Darbepoetin alfa', dosage: '25mcg', indication: 'Anemia of CKD', timeOfDay: 'morning' }, { name: 'Sodium Bicarbonate', dosage: '650mg', indication: 'Severe Acidosis', timeOfDay: 'both' }],
    comorbidities: { diabetes: true, hypertension: true, heartDisease: true, obesity: false, anemia: true },
  },
  {
    id: 'P14', name: 'Meena Chaudhary', age: 54, gender: 'Female', lastUpdated: daysAgo(4),
    labs: [
      { date: daysAgo(145), egfr: 36, creatinine: 1.6, bun: 26, uacr: 230, uricAcid: 5.9, potassium: 4.6, sodium: 138, calcium: 9.2, phosphate: 4.1, bicarbonate: 22, hemoglobin: 11.2, hematocrit: 34, ferritin: 145, tsat: 29, albumin: 3.8 },
      { date: daysAgo(70), egfr: 30, creatinine: 1.9, bun: 30, uacr: 260, uricAcid: 6.1, potassium: 4.7, sodium: 137, calcium: 9.1, phosphate: 4.3, bicarbonate: 22, hemoglobin: 10.9, hematocrit: 33, ferritin: 155, tsat: 28, albumin: 3.7 },
      { date: daysAgo(10), egfr: 24, creatinine: 2.2, bun: 35, uacr: 295, uricAcid: 6.3, potassium: 4.9, sodium: 137, calcium: 9.0, phosphate: 4.5, bicarbonate: 21, hemoglobin: 10.6, hematocrit: 32, ferritin: 165, tsat: 27, albumin: 3.6 },
    ],
    vitals: [{ date: daysAgo(10), systolic: 150, diastolic: 95, weight: 70 }],
    medications: [{ name: 'Spironolactone', dosage: '25mg', indication: 'Renal Protection', timeOfDay: 'morning' }, { name: 'Atorvastatin', dosage: '20mg', indication: 'Dyslipidemia', timeOfDay: 'evening' }],
    comorbidities: { diabetes: false, hypertension: true, heartDisease: false, obesity: true, anemia: false },
  },
  {
    id: 'P15', name: 'Arjun Bhatia', age: 44, gender: 'Male', lastUpdated: daysAgo(6),
    labs: [
      { date: daysAgo(120), egfr: 62, creatinine: 0.9, bun: 16, uacr: 18, uricAcid: 4.9, potassium: 4.0, sodium: 141, calcium: 9.7, phosphate: 3.4, bicarbonate: 25, hemoglobin: 14.0, hematocrit: 42, ferritin: 70, tsat: 36, albumin: 4.4 },
      { date: daysAgo(60), egfr: 60, creatinine: 1.0, bun: 17, uacr: 20, uricAcid: 5.0, potassium: 4.0, sodium: 140, calcium: 9.6, phosphate: 3.5, bicarbonate: 25, hemoglobin: 13.8, hematocrit: 42, ferritin: 72, tsat: 35, albumin: 4.3 },
      { date: daysAgo(10), egfr: 59, creatinine: 1.0, bun: 17, uacr: 21, uricAcid: 5.0, potassium: 4.1, sodium: 140, calcium: 9.6, phosphate: 3.5, bicarbonate: 24, hemoglobin: 13.7, hematocrit: 41, ferritin: 73, tsat: 35, albumin: 4.3 },
    ],
    vitals: [{ date: daysAgo(10), systolic: 122, diastolic: 76, weight: 72 }],
    medications: [],
    comorbidities: { diabetes: false, hypertension: false, heartDisease: false, obesity: false, anemia: false },
  },
  {
    id: 'P16', name: 'Lakshmi Subramaniam', age: 61, gender: 'Female', lastUpdated: daysAgo(2),
    labs: [
      { date: daysAgo(155), egfr: 28, creatinine: 1.8, bun: 29, uacr: 310, uricAcid: 6.2, potassium: 4.8, sodium: 138, calcium: 9.1, phosphate: 4.3, bicarbonate: 22, hemoglobin: 10.6, hematocrit: 32, ferritin: 165, tsat: 28, albumin: 3.7 },
      { date: daysAgo(75), egfr: 22, creatinine: 2.1, bun: 33, uacr: 340, uricAcid: 6.4, potassium: 5.0, sodium: 137, calcium: 9.0, phosphate: 4.5, bicarbonate: 21, hemoglobin: 10.3, hematocrit: 31, ferritin: 175, tsat: 27, albumin: 3.6 },
      { date: daysAgo(10), egfr: 17, creatinine: 2.5, bun: 38, uacr: 370, uricAcid: 6.6, potassium: 5.2, sodium: 136, calcium: 8.9, phosphate: 4.7, bicarbonate: 20, hemoglobin: 10.0, hematocrit: 30, ferritin: 185, tsat: 26, albumin: 3.5 },
    ],
    vitals: [{ date: daysAgo(10), systolic: 158, diastolic: 99, weight: 67 }],
    medications: [{ name: 'Azilsartan', dosage: '40mg', indication: 'HTN / Renal Protection', timeOfDay: 'morning' }, { name: 'Calcitriol', dosage: '0.25mcg', indication: 'Vitamin D Deficiency', timeOfDay: 'evening' }],
    comorbidities: { diabetes: true, hypertension: true, heartDisease: false, obesity: false, anemia: true },
  },
  {
    id: 'P17', name: 'Rahul Banerjee', age: 48, gender: 'Male', lastUpdated: daysAgo(3),
    labs: [
      { date: daysAgo(100), egfr: 54, creatinine: 1.1, bun: 19, uacr: 38, uricAcid: 5.1, potassium: 4.2, sodium: 140, calcium: 9.5, phosphate: 3.6, bicarbonate: 24, hemoglobin: 13.5, hematocrit: 41, ferritin: 80, tsat: 34, albumin: 4.2 },
      { date: daysAgo(50), egfr: 50, creatinine: 1.2, bun: 20, uacr: 42, uricAcid: 5.2, potassium: 4.3, sodium: 139, calcium: 9.4, phosphate: 3.7, bicarbonate: 24, hemoglobin: 13.3, hematocrit: 40, ferritin: 82, tsat: 33, albumin: 4.1 },
      { date: daysAgo(10), egfr: 47, creatinine: 1.3, bun: 21, uacr: 45, uricAcid: 5.3, potassium: 4.3, sodium: 139, calcium: 9.3, phosphate: 3.8, bicarbonate: 23, hemoglobin: 13.1, hematocrit: 40, ferritin: 85, tsat: 32, albumin: 4.1 },
    ],
    vitals: [{ date: daysAgo(10), systolic: 135, diastolic: 84, weight: 80 }],
    medications: [{ name: 'Metoprolol', dosage: '25mg', indication: 'Hypertension', timeOfDay: 'both' }],
    comorbidities: { diabetes: false, hypertension: true, heartDisease: false, obesity: false, anemia: false },
  },
  {
    id: 'P18', name: 'Geeta Malhotra', age: 66, gender: 'Female', lastUpdated: daysAgo(1),
    labs: [
      { date: daysAgo(180), egfr: 20, creatinine: 2.1, bun: 34, uacr: 410, uricAcid: 6.9, potassium: 5.1, sodium: 136, calcium: 9.0, phosphate: 4.9, bicarbonate: 20, hemoglobin: 9.9, hematocrit: 30, ferritin: 220, tsat: 25, albumin: 3.6 },
      { date: daysAgo(90), egfr: 16, creatinine: 2.5, bun: 39, uacr: 440, uricAcid: 7.1, potassium: 5.3, sodium: 135, calcium: 8.9, phosphate: 5.1, bicarbonate: 19, hemoglobin: 9.6, hematocrit: 29, ferritin: 230, tsat: 24, albumin: 3.5 },
      { date: daysAgo(15), egfr: 13, creatinine: 2.9, bun: 45, uacr: 470, uricAcid: 7.3, potassium: 5.5, sodium: 134, calcium: 8.8, phosphate: 5.3, bicarbonate: 18, hemoglobin: 9.3, hematocrit: 28, ferritin: 245, tsat: 23, albumin: 3.4 },
    ],
    vitals: [{ date: daysAgo(15), systolic: 162, diastolic: 101, weight: 60 }],
    medications: [{ name: 'Benazepril', dosage: '10mg', indication: 'HTN / Renal Protection', timeOfDay: 'morning' }, { name: 'Calcium Carbonate', dosage: '500mg', indication: 'Hypocalcemia', timeOfDay: 'both' }],
    comorbidities: { diabetes: true, hypertension: true, heartDisease: true, obesity: false, anemia: true },
  },
  {
    id: 'P19', name: 'Tarun Kapoor', age: 39, gender: 'Male', lastUpdated: daysAgo(7),
    labs: [
      { date: daysAgo(95), egfr: 78, creatinine: 0.8, bun: 14, uacr: 12, uricAcid: 4.5, potassium: 3.8, sodium: 142, calcium: 9.9, phosphate: 3.3, bicarbonate: 26, hemoglobin: 14.5, hematocrit: 44, ferritin: 60, tsat: 38, albumin: 4.5 },
      { date: daysAgo(45), egfr: 75, creatinine: 0.9, bun: 14, uacr: 14, uricAcid: 4.6, potassium: 3.9, sodium: 141, calcium: 9.8, phosphate: 3.4, bicarbonate: 26, hemoglobin: 14.3, hematocrit: 43, ferritin: 62, tsat: 37, albumin: 4.4 },
      { date: daysAgo(10), egfr: 73, creatinine: 0.9, bun: 15, uacr: 15, uricAcid: 4.7, potassium: 3.9, sodium: 141, calcium: 9.8, phosphate: 3.4, bicarbonate: 25, hemoglobin: 14.2, hematocrit: 43, ferritin: 63, tsat: 37, albumin: 4.4 },
    ],
    vitals: [{ date: daysAgo(10), systolic: 118, diastolic: 74, weight: 68 }],
    medications: [],
    comorbidities: { diabetes: false, hypertension: false, heartDisease: false, obesity: false, anemia: false },
  },
  {
    id: 'P20', name: 'Sarita Dubey', age: 57, gender: 'Female', lastUpdated: daysAgo(2),
    labs: [
      { date: daysAgo(140), egfr: 40, creatinine: 1.4, bun: 24, uacr: 210, uricAcid: 5.8, potassium: 4.5, sodium: 138, calcium: 9.3, phosphate: 4.0, bicarbonate: 23, hemoglobin: 11.4, hematocrit: 35, ferritin: 130, tsat: 30, albumin: 3.9 },
      { date: daysAgo(70), egfr: 34, creatinine: 1.7, bun: 28, uacr: 240, uricAcid: 6.0, potassium: 4.6, sodium: 138, calcium: 9.2, phosphate: 4.2, bicarbonate: 22, hemoglobin: 11.1, hematocrit: 34, ferritin: 140, tsat: 29, albumin: 3.8 },
      { date: daysAgo(10), egfr: 28, creatinine: 2.0, bun: 33, uacr: 270, uricAcid: 6.2, potassium: 4.8, sodium: 137, calcium: 9.1, phosphate: 4.4, bicarbonate: 22, hemoglobin: 10.8, hematocrit: 33, ferritin: 150, tsat: 28, albumin: 3.7 },
    ],
    vitals: [{ date: daysAgo(10), systolic: 144, diastolic: 90, weight: 65 }],
    medications: [{ name: 'Fosinopril', dosage: '10mg', indication: 'HTN / Renal Protection', timeOfDay: 'morning' }],
    comorbidities: { diabetes: true, hypertension: true, heartDisease: false, obesity: false, anemia: false },
  },
  {
    id: 'P21', name: 'Mohan Trivedi', age: 71, gender: 'Male', lastUpdated: daysAgo(1),
    labs: [
      { date: daysAgo(165), egfr: 15, creatinine: 2.2, bun: 38, uacr: 500, uricAcid: 7.2, potassium: 5.3, sodium: 135, calcium: 8.9, phosphate: 5.3, bicarbonate: 19, hemoglobin: 9.0, hematocrit: 27, ferritin: 295, tsat: 22, albumin: 3.4 },
      { date: daysAgo(80), egfr: 11, creatinine: 2.7, bun: 44, uacr: 530, uricAcid: 7.4, potassium: 5.5, sodium: 134, calcium: 8.8, phosphate: 5.5, bicarbonate: 18, hemoglobin: 8.7, hematocrit: 26, ferritin: 310, tsat: 21, albumin: 3.3 },
      { date: daysAgo(10), egfr: 8, creatinine: 3.1, bun: 50, uacr: 560, uricAcid: 7.6, potassium: 5.7, sodium: 133, calcium: 8.7, phosphate: 5.7, bicarbonate: 17, hemoglobin: 8.4, hematocrit: 25, ferritin: 325, tsat: 20, albumin: 3.2 },
    ],
    vitals: [{ date: daysAgo(10), systolic: 168, diastolic: 104, weight: 66 }],
    medications: [{ name: 'Hydralazine', dosage: '25mg', indication: 'Hypertension', timeOfDay: 'both' }, { name: 'Ferrous Sulfate', dosage: '325mg', indication: 'Iron Deficiency Anemia', timeOfDay: 'morning' }],
    comorbidities: { diabetes: false, hypertension: true, heartDisease: true, obesity: false, anemia: true },
  },
  {
    id: 'P22', name: 'Divya Krishnamurthy', age: 43, gender: 'Female', lastUpdated: daysAgo(5),
    labs: [
      { date: daysAgo(100), egfr: 58, creatinine: 1.0, bun: 18, uacr: 28, uricAcid: 5.0, potassium: 4.1, sodium: 140, calcium: 9.6, phosphate: 3.6, bicarbonate: 24, hemoglobin: 12.8, hematocrit: 39, ferritin: 78, tsat: 33, albumin: 4.2 },
      { date: daysAgo(50), egfr: 55, creatinine: 1.1, bun: 19, uacr: 30, uricAcid: 5.1, potassium: 4.1, sodium: 140, calcium: 9.5, phosphate: 3.7, bicarbonate: 24, hemoglobin: 12.6, hematocrit: 38, ferritin: 80, tsat: 32, albumin: 4.1 },
      { date: daysAgo(10), egfr: 53, creatinine: 1.1, bun: 19, uacr: 32, uricAcid: 5.1, potassium: 4.2, sodium: 139, calcium: 9.4, phosphate: 3.7, bicarbonate: 23, hemoglobin: 12.4, hematocrit: 38, ferritin: 82, tsat: 32, albumin: 4.1 },
    ],
    vitals: [{ date: daysAgo(10), systolic: 128, diastolic: 80, weight: 57 }],
    medications: [{ name: 'Losartan', dosage: '25mg', indication: 'Early Renal Protection', timeOfDay: 'morning' }],
    comorbidities: { diabetes: false, hypertension: false, heartDisease: false, obesity: false, anemia: false },
  },
  {
    id: 'P23', name: 'Sanjay Agarwal', age: 62, gender: 'Male', lastUpdated: daysAgo(2),
    labs: [
      { date: daysAgo(175), egfr: 30, creatinine: 1.8, bun: 30, uacr: 320, uricAcid: 6.4, potassium: 4.8, sodium: 138, calcium: 9.2, phosphate: 4.3, bicarbonate: 22, hemoglobin: 10.8, hematocrit: 33, ferritin: 168, tsat: 28, albumin: 3.8 },
      { date: daysAgo(85), egfr: 24, creatinine: 2.1, bun: 35, uacr: 350, uricAcid: 6.6, potassium: 5.0, sodium: 137, calcium: 9.1, phosphate: 4.5, bicarbonate: 21, hemoglobin: 10.5, hematocrit: 32, ferritin: 178, tsat: 27, albumin: 3.7 },
      { date: daysAgo(15), egfr: 18, creatinine: 2.5, bun: 40, uacr: 380, uricAcid: 6.8, potassium: 5.2, sodium: 136, calcium: 9.0, phosphate: 4.7, bicarbonate: 20, hemoglobin: 10.2, hematocrit: 31, ferritin: 188, tsat: 26, albumin: 3.6 },
    ],
    vitals: [{ date: daysAgo(15), systolic: 153, diastolic: 96, weight: 75 }],
    medications: [{ name: 'Quinapril', dosage: '10mg', indication: 'HTN / Renal Protection', timeOfDay: 'morning' }, { name: 'Febuxostat', dosage: '40mg', indication: 'Gout / Hyperuricemia', timeOfDay: 'evening' }],
    comorbidities: { diabetes: true, hypertension: true, heartDisease: false, obesity: true, anemia: true },
  },
  {
    id: 'P24', name: 'Ananya Bose', age: 36, gender: 'Female', lastUpdated: daysAgo(8),
    labs: [
      { date: daysAgo(110), egfr: 85, creatinine: 0.7, bun: 12, uacr: 8, uricAcid: 4.2, potassium: 3.7, sodium: 142, calcium: 9.9, phosphate: 3.2, bicarbonate: 26, hemoglobin: 13.5, hematocrit: 41, ferritin: 55, tsat: 39, albumin: 4.5 },
      { date: daysAgo(55), egfr: 82, creatinine: 0.8, bun: 13, uacr: 9, uricAcid: 4.3, potassium: 3.8, sodium: 142, calcium: 9.9, phosphate: 3.3, bicarbonate: 26, hemoglobin: 13.4, hematocrit: 41, ferritin: 57, tsat: 38, albumin: 4.5 },
      { date: daysAgo(10), egfr: 80, creatinine: 0.8, bun: 13, uacr: 10, uricAcid: 4.4, potassium: 3.8, sodium: 141, calcium: 9.8, phosphate: 3.3, bicarbonate: 25, hemoglobin: 13.3, hematocrit: 40, ferritin: 58, tsat: 38, albumin: 4.4 },
    ],
    vitals: [{ date: daysAgo(10), systolic: 115, diastolic: 72, weight: 52 }],
    medications: [],
    comorbidities: { diabetes: false, hypertension: false, heartDisease: false, obesity: false, anemia: false },
  },
  {
    id: 'P25', name: 'Ravi Shankar', age: 70, gender: 'Male', lastUpdated: daysAgo(1),
    labs: [
      { date: daysAgo(195), egfr: 24, creatinine: 2.0, bun: 32, uacr: 370, uricAcid: 6.7, potassium: 5.0, sodium: 137, calcium: 9.1, phosphate: 4.6, bicarbonate: 21, hemoglobin: 10.4, hematocrit: 31, ferritin: 180, tsat: 26, albumin: 3.7 },
      { date: daysAgo(100), egfr: 19, creatinine: 2.4, bun: 37, uacr: 400, uricAcid: 6.9, potassium: 5.2, sodium: 136, calcium: 9.0, phosphate: 4.8, bicarbonate: 20, hemoglobin: 10.1, hematocrit: 30, ferritin: 190, tsat: 25, albumin: 3.6 },
      { date: daysAgo(20), egfr: 14, creatinine: 2.8, bun: 43, uacr: 430, uricAcid: 7.1, potassium: 5.4, sodium: 135, calcium: 8.9, phosphate: 5.0, bicarbonate: 19, hemoglobin: 9.8, hematocrit: 29, ferritin: 200, tsat: 24, albumin: 3.5 },
    ],
    vitals: [{ date: daysAgo(20), systolic: 160, diastolic: 100, weight: 70 }],
    medications: [{ name: 'Lisinopril', dosage: '10mg', indication: 'HTN / Renal Protection', timeOfDay: 'morning' }, { name: 'Fludrocortisone', dosage: '0.1mg', indication: 'Postural Hypotension', timeOfDay: 'morning' }],
    comorbidities: { diabetes: true, hypertension: true, heartDisease: false, obesity: false, anemia: true },
  },
  {
    id: 'P26', name: 'Shweta Tiwari', age: 50, gender: 'Female', lastUpdated: daysAgo(3),
    labs: [
      { date: daysAgo(130), egfr: 46, creatinine: 1.3, bun: 21, uacr: 160, uricAcid: 5.6, potassium: 4.4, sodium: 139, calcium: 9.4, phosphate: 3.9, bicarbonate: 23, hemoglobin: 11.6, hematocrit: 35, ferritin: 112, tsat: 30, albumin: 4.0 },
      { date: daysAgo(65), egfr: 40, creatinine: 1.5, bun: 24, uacr: 185, uricAcid: 5.8, potassium: 4.5, sodium: 138, calcium: 9.3, phosphate: 4.0, bicarbonate: 23, hemoglobin: 11.3, hematocrit: 34, ferritin: 118, tsat: 29, albumin: 3.9 },
      { date: daysAgo(10), egfr: 35, creatinine: 1.7, bun: 27, uacr: 205, uricAcid: 6.0, potassium: 4.6, sodium: 138, calcium: 9.2, phosphate: 4.1, bicarbonate: 22, hemoglobin: 11.0, hematocrit: 33, ferritin: 125, tsat: 28, albumin: 3.9 },
    ],
    vitals: [{ date: daysAgo(10), systolic: 142, diastolic: 89, weight: 68 }],
    medications: [{ name: 'Valsartan', dosage: '160mg', indication: 'HTN / Diabetic Nephropathy', timeOfDay: 'morning' }],
    comorbidities: { diabetes: true, hypertension: true, heartDisease: false, obesity: false, anemia: false },
  },
  {
    id: 'P27', name: 'Kiran Desai', age: 53, gender: 'Male', lastUpdated: daysAgo(4),
    labs: [
      { date: daysAgo(150), egfr: 50, creatinine: 1.2, bun: 20, uacr: 55, uricAcid: 5.3, potassium: 4.3, sodium: 139, calcium: 9.5, phosphate: 3.7, bicarbonate: 24, hemoglobin: 13.0, hematocrit: 39, ferritin: 90, tsat: 32, albumin: 4.2 },
      { date: daysAgo(75), egfr: 46, creatinine: 1.3, bun: 22, uacr: 60, uricAcid: 5.5, potassium: 4.4, sodium: 139, calcium: 9.4, phosphate: 3.8, bicarbonate: 24, hemoglobin: 12.8, hematocrit: 38, ferritin: 93, tsat: 31, albumin: 4.1 },
      { date: daysAgo(15), egfr: 43, creatinine: 1.4, bun: 23, uacr: 65, uricAcid: 5.6, potassium: 4.4, sodium: 138, calcium: 9.3, phosphate: 3.9, bicarbonate: 23, hemoglobin: 12.6, hematocrit: 38, ferritin: 96, tsat: 31, albumin: 4.1 },
    ],
    vitals: [{ date: daysAgo(15), systolic: 138, diastolic: 86, weight: 78 }],
    medications: [{ name: 'Ramipril', dosage: '5mg', indication: 'HTN / Renal Protection', timeOfDay: 'morning' }],
    comorbidities: { diabetes: false, hypertension: true, heartDisease: false, obesity: false, anemia: false },
  },
  {
    id: 'P28', name: 'Preeti Saxena', age: 47, gender: 'Female', lastUpdated: daysAgo(5),
    labs: [
      { date: daysAgo(120), egfr: 42, creatinine: 1.4, bun: 23, uacr: 145, uricAcid: 5.4, potassium: 4.4, sodium: 139, calcium: 9.4, phosphate: 3.9, bicarbonate: 23, hemoglobin: 11.9, hematocrit: 36, ferritin: 108, tsat: 31, albumin: 4.0 },
      { date: daysAgo(60), egfr: 37, creatinine: 1.6, bun: 26, uacr: 168, uricAcid: 5.6, potassium: 4.5, sodium: 138, calcium: 9.3, phosphate: 4.0, bicarbonate: 23, hemoglobin: 11.6, hematocrit: 35, ferritin: 113, tsat: 30, albumin: 3.9 },
      { date: daysAgo(10), egfr: 32, creatinine: 1.8, bun: 29, uacr: 188, uricAcid: 5.8, potassium: 4.6, sodium: 138, calcium: 9.2, phosphate: 4.1, bicarbonate: 22, hemoglobin: 11.3, hematocrit: 34, ferritin: 118, tsat: 29, albumin: 3.8 },
    ],
    vitals: [{ date: daysAgo(10), systolic: 143, diastolic: 89, weight: 62 }],
    medications: [{ name: 'Candesartan', dosage: '4mg', indication: 'HTN / Renal Protection', timeOfDay: 'morning' }, { name: 'Metformin', dosage: '500mg', indication: 'Diabetes', timeOfDay: 'both' }],
    comorbidities: { diabetes: true, hypertension: true, heartDisease: false, obesity: false, anemia: false },
  },
  {
    id: 'P29', name: 'Ajay Kulkarni', age: 59, gender: 'Male', lastUpdated: daysAgo(2),
    labs: [
      { date: daysAgo(145), egfr: 34, creatinine: 1.7, bun: 27, uacr: 270, uricAcid: 6.2, potassium: 4.7, sodium: 138, calcium: 9.2, phosphate: 4.2, bicarbonate: 22, hemoglobin: 11.0, hematocrit: 33, ferritin: 155, tsat: 29, albumin: 3.8 },
      { date: daysAgo(70), egfr: 27, creatinine: 2.0, bun: 32, uacr: 300, uricAcid: 6.4, potassium: 4.9, sodium: 137, calcium: 9.1, phosphate: 4.4, bicarbonate: 21, hemoglobin: 10.7, hematocrit: 32, ferritin: 165, tsat: 28, albumin: 3.7 },
      { date: daysAgo(10), egfr: 21, creatinine: 2.3, bun: 37, uacr: 330, uricAcid: 6.6, potassium: 5.1, sodium: 136, calcium: 9.0, phosphate: 4.6, bicarbonate: 21, hemoglobin: 10.4, hematocrit: 31, ferritin: 175, tsat: 27, albumin: 3.7 },
    ],
    vitals: [{ date: daysAgo(10), systolic: 150, diastolic: 93, weight: 76 }],
    medications: [{ name: 'Enalapril', dosage: '10mg', indication: 'HTN / Renal Protection', timeOfDay: 'morning' }, { name: 'Allopurinol', dosage: '200mg', indication: 'Hyperuricemia', timeOfDay: 'evening' }],
    comorbidities: { diabetes: true, hypertension: true, heartDisease: false, obesity: false, anemia: true },
  },
  {
    id: 'P30', name: 'Radha Gopalan', age: 64, gender: 'Female', lastUpdated: daysAgo(1),
    labs: [
      { date: daysAgo(170), egfr: 18, creatinine: 2.0, bun: 35, uacr: 460, uricAcid: 7.0, potassium: 5.2, sodium: 136, calcium: 9.0, phosphate: 5.0, bicarbonate: 20, hemoglobin: 9.2, hematocrit: 28, ferritin: 265, tsat: 23, albumin: 3.5 },
      { date: daysAgo(85), egfr: 14, creatinine: 2.5, bun: 41, uacr: 490, uricAcid: 7.2, potassium: 5.4, sodium: 135, calcium: 8.9, phosphate: 5.2, bicarbonate: 19, hemoglobin: 8.9, hematocrit: 27, ferritin: 278, tsat: 22, albumin: 3.4 },
      { date: daysAgo(15), egfr: 10, creatinine: 3.0, bun: 48, uacr: 520, uricAcid: 7.4, potassium: 5.6, sodium: 134, calcium: 8.8, phosphate: 5.4, bicarbonate: 18, hemoglobin: 8.6, hematocrit: 26, ferritin: 292, tsat: 21, albumin: 3.3 },
    ],
    vitals: [{ date: daysAgo(15), systolic: 164, diastolic: 102, weight: 62 }],
    medications: [{ name: 'Ramipril', dosage: '10mg', indication: 'HTN / Renal Protection', timeOfDay: 'morning' }, { name: 'Patiromer', dosage: '16.8g', indication: 'Hyperkalemia', timeOfDay: 'evening' }, { name: 'Darbepoetin alfa', dosage: '40mcg', indication: 'Severe Anemia', timeOfDay: 'morning' }],
    comorbidities: { diabetes: true, hypertension: true, heartDisease: false, obesity: false, anemia: true },
  },
];
