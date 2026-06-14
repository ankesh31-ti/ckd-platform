import { Patient, GStage, RiskLevel, EGFRTrend, LabResult } from '../types';

export function classifyGStage(egfr: number): GStage {
  if (egfr >= 90) return 'G1';
  if (egfr >= 60) return 'G2';
  if (egfr >= 45) return 'G3a';
  if (egfr >= 30) return 'G3b';
  if (egfr >= 15) return 'G4';
  return 'G5';
}

export function calculateLinearSlope(labs: LabResult[]): {
  slope: number;
  trend: EGFRTrend;
  predictedEgfr6Mo: number;
  observationSpanDays: number;
} {
  if (labs.length < 2) {
    const latest = labs[0]?.egfr ?? 60;
    return { slope: 0, trend: 'stable', predictedEgfr6Mo: latest, observationSpanDays: 0 };
  }

  const sorted = [...labs].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  const t0 = new Date(sorted[0].date).getTime();
  const tLast = new Date(sorted[sorted.length - 1].date).getTime();
  const observationSpanDays = Math.round((tLast - t0) / (1000 * 60 * 60 * 24));

  // Least-squares linear regression (time in fractional years)
  const points = sorted.map(l => ({
    x: (new Date(l.date).getTime() - t0) / (1000 * 60 * 60 * 24 * 365.25),
    y: l.egfr,
  }));

  const n = points.length;
  const sumX = points.reduce((s, p) => s + p.x, 0);
  const sumY = points.reduce((s, p) => s + p.y, 0);
  const sumXY = points.reduce((s, p) => s + p.x * p.y, 0);
  const sumX2 = points.reduce((s, p) => s + p.x * p.x, 0);

  const denom = n * sumX2 - sumX * sumX;
  const slope = denom === 0 ? 0 : (n * sumXY - sumX * sumY) / denom;

  const latestEgfr = sorted[sorted.length - 1].egfr;
  const predictedEgfr6Mo = Math.max(0, latestEgfr + slope * 0.5);

  let trend: EGFRTrend;
  if (slope >= 1) trend = 'improving';
  else if (slope >= -5) trend = slope >= -2 ? 'stable' : 'declining';
  else trend = 'rapid-decline';

  return { slope: Math.round(slope * 100) / 100, trend, predictedEgfr6Mo: Math.round(predictedEgfr6Mo * 10) / 10, observationSpanDays };
}

export function verifyChronicKidneyDisease(labs: LabResult[], observationSpanDays: number): boolean {
  if (labs.length < 2 || observationSpanDays < 90) return false;
  const sorted = [...labs].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  const first = sorted[0];
  const last = sorted[sorted.length - 1];
  const functionalMarker = last.egfr < 60;
  const structuralMarker = last.uacr > 30;
  const firstFunctionalMarker = first.egfr < 60;
  const firstStructuralMarker = first.uacr > 30;
  return (functionalMarker && firstFunctionalMarker) || (structuralMarker && firstStructuralMarker);
}

export function stratifyRisk(patient: Omit<Patient, 'riskLevel'>): RiskLevel {
  const latest = [...patient.labs].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0];
  if (!latest) return 'LOW';

  let risk: RiskLevel = 'LOW';

  // G-stage base risk
  if (['G4', 'G5'].includes(patient.gStage)) risk = 'HIGH';
  else if (patient.gStage === 'G3b') risk = 'MEDIUM';

  // Rapid decline → HIGH
  if (patient.egfrTrend === 'rapid-decline') risk = 'HIGH';

  // Albuminuria escalation (KDIGO CGA matrix)
  if (latest.uacr >= 300) risk = 'HIGH';
  else if (latest.uacr >= 30 && risk === 'LOW') risk = 'MEDIUM';

  // Hyperkalemia → HIGH
  if (latest.potassium > 5.5) risk = 'HIGH';

  // Uncontrolled BP escalation
  const latestVital = [...patient.vitals].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0];
  if (latestVital && (latestVital.systolic > 160 || latestVital.diastolic > 100)) {
    if (risk === 'MEDIUM') risk = 'HIGH';
    else if (risk === 'LOW') risk = 'MEDIUM';
  }

  // Severe anemia → HIGH
  if (latest.hemoglobin < 8) risk = 'HIGH';

  return risk;
}

export function recalculatePatient(patient: Patient): Patient {
  const { slope, trend, predictedEgfr6Mo, observationSpanDays } = calculateLinearSlope(patient.labs);
  const latestLab = [...patient.labs].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0];
  const gStage = classifyGStage(latestLab?.egfr ?? 60);
  const isVerifiedCKD = verifyChronicKidneyDisease(patient.labs, observationSpanDays);

  const updated: Patient = {
    ...patient,
    gStage,
    egfrTrend: trend,
    annualizedSlope: slope,
    predictedEgfr6Mo,
    observationSpanDays,
    isVerifiedCKD,
    riskLevel: 'LOW',
  };

  updated.riskLevel = stratifyRisk(updated);
  return updated;
}
