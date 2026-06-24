import express from 'express';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { mockPatients } from './data/mockData.js';
import { recalculatePatient } from './services/riskEngine.js';
import { getMLPrediction } from './services/mlService.js';
import { Patient, Alert } from '../frontend/src/types/index.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;

const PATIENTS_DB = path.join(__dirname, '../patients_db.json');
const ALERTS_DB = path.join(__dirname, '../alerts_db.json');

app.use(cors());
app.use(express.json());

// ── DB helpers ──────────────────────────────────────────────────────────────

function loadPatients(): Patient[] {
  if (fs.existsSync(PATIENTS_DB)) {
    return JSON.parse(fs.readFileSync(PATIENTS_DB, 'utf-8'));
  }
  // Seed from mock data on first run
  const seeded = mockPatients.map(p => recalculatePatient(p as Patient));
  fs.writeFileSync(PATIENTS_DB, JSON.stringify(seeded, null, 2));
  return seeded;
}

function savePatients(patients: Patient[]) {
  fs.writeFileSync(PATIENTS_DB, JSON.stringify(patients, null, 2));
}

function loadAlerts(): Alert[] {
  if (fs.existsSync(ALERTS_DB)) {
    return JSON.parse(fs.readFileSync(ALERTS_DB, 'utf-8'));
  }
  return [];
}

function saveAlerts(alerts: Alert[]) {
  fs.writeFileSync(ALERTS_DB, JSON.stringify(alerts, null, 2));
}

function generateAlertsForPatient(patient: Patient): Alert[] {
  const alerts: Alert[] = [];
  const latest = [...patient.labs].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0];
  if (!latest) return alerts;

  const ts = new Date().toISOString();

  if (patient.egfrTrend === 'rapid-decline') {
    alerts.push({
      id: `${patient.id}-rapid-${Date.now()}`,
      patientId: patient.id,
      patientName: patient.name,
      type: 'RAPID_DETERIORATION',
      message: `eGFR declining rapidly at ${patient.annualizedSlope} ml/min/yr. Immediate review required.`,
      timestamp: ts,
      read: false,
    });
  }

  if (latest.hemoglobin < 10) {
    alerts.push({
      id: `${patient.id}-hb-${Date.now()}`,
      patientId: patient.id,
      patientName: patient.name,
      type: 'ABNORMAL_LAB',
      message: `Hemoglobin dropped to ${latest.hemoglobin} g/dL. Clinical anemia review required.`,
      timestamp: ts,
      read: false,
    });
  }

  if (latest.potassium > 5.5) {
    alerts.push({
      id: `${patient.id}-k-${Date.now()}`,
      patientId: patient.id,
      patientName: patient.name,
      type: 'RAPID_DETERIORATION',
      message: `Hyperkalemia detected (K+ ${latest.potassium} mEq/L). Cardiac risk — urgent review.`,
      timestamp: ts,
      read: false,
    });
  }

  if (patient.gStage === 'G5') {
    alerts.push({
      id: `${patient.id}-g5-${Date.now()}`,
      patientId: patient.id,
      patientName: patient.name,
      type: 'CRITICAL_THRESHOLD',
      message: `Critical G5 status: eGFR has declined to ${latest.egfr} ml/min. Dialysis planning required.`,
      timestamp: ts,
      read: false,
    });
  }

  if (patient.riskLevel === 'HIGH' && patient.egfrTrend !== 'rapid-decline') {
    alerts.push({
      id: `${patient.id}-risk-${Date.now()}`,
      patientId: patient.id,
      patientName: patient.name,
      type: 'RISK_CHANGE',
      message: `Risk elevated to HIGH due to combined lab deterioration and comorbidity burden.`,
      timestamp: ts,
      read: false,
    });
  }

  return alerts;
}

// ── Routes ───────────────────────────────────────────────────────────────────

// GET all patients
app.get('/api/patients', (_req, res) => {
  const patients = loadPatients();
  res.json(patients);
});

// GET single patient
app.get('/api/patients/:id', (req, res) => {
  const patients = loadPatients();
  const patient = patients.find(p => p.id === req.params.id);
  if (!patient) return res.status(404).json({ error: 'Patient not found' });
  res.json(patient);
});

// POST save/update patient → recalculate risk
app.post('/api/patients/:id', async (req, res) => {
  const patients = loadPatients();
  const idx = patients.findIndex(p => p.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'Patient not found' });

  let updated = recalculatePatient({ ...patients[idx], ...req.body });

  // Run the ML engine alongside the existing KDIGO rule engine.
  // This never blocks or breaks the existing flow - if the ML service
  // is unreachable or the patient lacks the extra fields, mlAssessment
  // simply stays undefined and everything else works exactly as before.
  const mlResult = await getMLPrediction(updated);
  if (mlResult) {
    updated = { ...updated, mlAssessment: mlResult };
  }

  patients[idx] = updated;
  savePatients(patients);

  // Regenerate alerts for this patient
  const allAlerts = loadAlerts().filter(a => a.patientId !== updated.id);
  const newAlerts = generateAlertsForPatient(updated);
  saveAlerts([...allAlerts, ...newAlerts]);

  res.json(updated);
});

// POST bulk import patients
app.post('/api/patients', (req, res) => {
  const incoming: Patient[] = req.body;
  const recalculated = incoming.map(p => recalculatePatient(p));
  savePatients(recalculated);

  // Regenerate all alerts
  const newAlerts = recalculated.flatMap(p => generateAlertsForPatient(p));
  saveAlerts(newAlerts);

  res.json({ message: `Imported ${recalculated.length} patients`, patients: recalculated });
});

// GET alerts
app.get('/api/alerts', (_req, res) => {
  const alerts = loadAlerts();
  res.json(alerts.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()));
});

// POST mark alert as read
app.post('/api/alerts/:id/read', (req, res) => {
  const alerts = loadAlerts();
  const alert = alerts.find(a => a.id === req.params.id);
  if (!alert) return res.status(404).json({ error: 'Alert not found' });
  alert.read = true;
  saveAlerts(alerts);
  res.json(alert);
});

// POST mark all alerts read
app.post('/api/alerts/read-all', (_req, res) => {
  const alerts = loadAlerts().map(a => ({ ...a, read: true }));
  saveAlerts(alerts);
  res.json({ message: 'All alerts marked as read' });
});

// DELETE alert
app.delete('/api/alerts/:id', (req, res) => {
  const alerts = loadAlerts().filter(a => a.id !== req.params.id);
  saveAlerts(alerts);
  res.json({ message: 'Alert dismissed' });
});

// GET export patients as JSON
app.get('/api/export', (_req, res) => {
  const patients = loadPatients();
  res.setHeader('Content-Disposition', 'attachment; filename=ckd_patients.json');
  res.json(patients);
});

// POST AI chat (STUB — plug in your LLM API key here later)
app.post('/api/chat', (req, res) => {
  const { message, patientContext } = req.body;
  // TODO: Replace this stub with your preferred LLM (Claude / OpenAI)
  // Example for Claude:
  //   const Anthropic = require('@anthropic-ai/sdk');
  //   const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
  //   const response = await client.messages.create({ ... });
  console.log('AI chat stub received:', message, patientContext?.name);
  res.json({
    reply: `[AI KDIGO Guard — STUB] You asked: "${message}" for patient ${patientContext?.name ?? 'unknown'}. Connect your LLM API key in server.ts /api/chat route to activate this feature.`,
    isStub: true,
  });
});

// POST Lab Digitizer (STUB — plug in Vision API here later)
app.post('/api/lab-digitizer', (req, res) => {
  // TODO: Accept multipart image upload, run OCR via Claude Vision / Google Vision API
  // Return structured LabResult JSON
  console.log('Lab Digitizer stub called');
  res.json({
    message: 'Lab Digitizer stub. Upload your lab report image here. Connect a Vision API to extract values automatically.',
    isStub: true,
    extractedLabs: null,
  });
});

app.listen(PORT, () => {
  console.log(`✅ CKD Platform backend running on port ${PORT}`);
  // Seed DB on startup if empty
  loadPatients();
  const patients = loadPatients();
  const alerts = loadAlerts();
  if (alerts.length === 0) {
    const newAlerts = patients.flatMap(p => generateAlertsForPatient(p));
    saveAlerts(newAlerts);
    console.log(`✅ Seeded ${newAlerts.length} alerts`);
  }
});

export default app;
