import { Patient, LabResult } from '../types.js';
const ML_SERVICE_URL = process.env.ML_SERVICE_URL || 'http://localhost:8000';

export interface MLPredictionResult {
  prediction: 'ckd' | 'notckd';
  predictionBinary: number;
  confidenceCkd: number;
  modelVersion: string;
  timestamp: string;
}

function boolToBinary(value: boolean): number {
  return value ? 1 : 0;
}

function categoricalToBinary(
  value: string | undefined,
  oneValue: string
): number | null {
  if (value === undefined) return null;
  return value === oneValue ? 1 : 0;
}

function buildMLPayload(patient: Patient): Record<string, number> | null {
  const latestLab: LabResult | undefined = [...patient.labs].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  )[0];
  const latestVital = [...patient.vitals].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  )[0];

  if (!latestLab || !latestVital) return null;

  const requiredNewFields: (keyof LabResult)[] = [
    'urineSpecificGravity',
    'urineAlbuminDipstick',
    'urineSugar',
    'rbcUrine',
    'pusCells',
    'pusCellClumps',
    'bacteria',
    'bloodGlucoseRandom',
    'wbcCount',
    'rbcCount',
    'appetite',
  ];
  const missing = requiredNewFields.filter((f) => latestLab[f] === undefined);
  if (missing.length > 0) {
    console.log(`ML prediction skipped for ${patient.id}: missing fields ${missing.join(', ')}`);
    return null;
  }

  const payload = {
    age: patient.age,
    bp: latestVital.diastolic,
    sg: latestLab.urineSpecificGravity!,
    al: latestLab.urineAlbuminDipstick!,
    su: latestLab.urineSugar!,
    rbc: categoricalToBinary(latestLab.rbcUrine, 'abnormal'),
    pc: categoricalToBinary(latestLab.pusCells, 'abnormal'),
    pcc: categoricalToBinary(latestLab.pusCellClumps, 'present'),
    ba: categoricalToBinary(latestLab.bacteria, 'present'),
    bgr: latestLab.bloodGlucoseRandom!,
    bu: latestLab.bun,
    sc: latestLab.creatinine,
    sod: latestLab.sodium,
    pot: latestLab.potassium,
    hemo: latestLab.hemoglobin,
    pcv: latestLab.hematocrit,
    wbcc: latestLab.wbcCount!,
    rbcc: latestLab.rbcCount!,
    htn: boolToBinary(patient.comorbidities.hypertension),
    dm: boolToBinary(patient.comorbidities.diabetes),
    cad: boolToBinary(patient.comorbidities.heartDisease),
    appet: categoricalToBinary(latestLab.appetite, 'poor'),
    pe: latestLab.pedalEdema !== undefined ? boolToBinary(latestLab.pedalEdema) : null,
    ane: boolToBinary(patient.comorbidities.anemia),
  };

  if (Object.values(payload).some((v) => v === null)) return null;

  return payload as Record<string, number>;
}

export async function getMLPrediction(patient: Patient): Promise<MLPredictionResult | null> {
  const payload = buildMLPayload(patient);
  if (!payload) return null;

  try {
    const response = await fetch(`${ML_SERVICE_URL}/predict`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      console.error(`ML service returned ${response.status} for patient ${patient.id}`);
      return null;
    }

    const result = await response.json();
    return {
      prediction: result.prediction,
      predictionBinary: result.prediction_binary,
      confidenceCkd: result.confidence_ckd,
      modelVersion: result.model_version,
      timestamp: new Date().toISOString(),
    };
  } catch (err) {
    console.error(`ML service call failed for patient ${patient.id}:`, err);
    return null;
  }
}
