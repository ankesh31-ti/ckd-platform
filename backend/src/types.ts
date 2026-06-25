// backend/src/types.ts
//
// This is the backend's OWN copy of the types needed from frontend/src/types/index.ts.
// Render deploys backend/ in isolation (Root Directory: backend), so the backend
// cannot reach across into ../frontend/ at build time - each service needs its
// own self-contained source files.
//
// IMPORTANT: if you change frontend/src/types/index.ts in the future, mirror
// the same change here too, since these are now two separate copies.

export type GStage = 'G1' | 'G2' | 'G3a' | 'G3b' | 'G4' | 'G5';
export type RiskLevel = 'LOW' | 'MEDIUM' | 'HIGH';
export type EGFRTrend = 'improving' | 'stable' | 'declining' | 'rapid-decline';

export interface LabResult {
  date: string;
  egfr: number;
  creatinine: number;
  bun: number;
  uacr: number;
  uricAcid: number;
  potassium: number;
  sodium: number;
  calcium: number;
  phosphate: number;
  bicarbonate: number;
  hemoglobin: number;
  hematocrit: number;
  ferritin: number;
  tsat: number;
  albumin: number;
  urineSpecificGravity?: number;
  urineAlbuminDipstick?: number;
  urineSugar?: number;
  rbcUrine?: 'normal' | 'abnormal';
  pusCells?: 'normal' | 'abnormal';
  pusCellClumps?: 'present' | 'notpresent';
  bacteria?: 'present' | 'notpresent';
  bloodGlucoseRandom?: number;
  wbcCount?: number;
  rbcCount?: number;
  appetite?: 'good' | 'poor';
  pedalEdema?: boolean;
}

export interface VitalReading {
  date: string;
  systolic: number;
  diastolic: number;
  weight: number;
}

export interface Medication {
  name: string;
  dosage: string;
  indication: string;
  timeOfDay: 'morning' | 'evening' | 'both';
}

export interface Comorbidities {
  diabetes: boolean;
  hypertension: boolean;
  heartDisease: boolean;
  obesity: boolean;
  anemia: boolean;
}

export interface Patient {
  id: string;
  name: string;
  age: number;
  gender: 'Male' | 'Female';
  gStage: GStage;
  riskLevel: RiskLevel;
  egfrTrend: EGFRTrend;
  annualizedSlope: number;
  predictedEgfr6Mo: number;
  observationSpanDays: number;
  isVerifiedCKD: boolean;
  labs: LabResult[];
  vitals: VitalReading[];
  medications: Medication[];
  comorbidities: Comorbidities;
  lastUpdated: string;
  mlAssessment?: {
    prediction: 'ckd' | 'notckd';
    predictionBinary: number;
    confidenceCkd: number;
    modelVersion: string;
    timestamp: string;
  };
}

export interface Alert {
  id: string;
  patientId: string;
  patientName: string;
  type: 'RAPID_DETERIORATION' | 'ABNORMAL_LAB' | 'RISK_CHANGE' | 'CRITICAL_THRESHOLD';
  message: string;
  timestamp: string;
  read: boolean;
}

export interface DashboardStats {
  total: number;
  highRisk: number;
  mediumRisk: number;
  lowRisk: number;
  rapidProgressors: number;
}
