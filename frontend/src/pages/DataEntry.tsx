import { useState, useRef, useEffect } from 'react';
import { UserPlus, Upload, Save, X, CheckCircle2, AlertCircle, FileSpreadsheet, Plus } from 'lucide-react';
import { Patient, GStage } from '../types';
import { PatientAPI } from '../services/api';
import { LoadingSpinner } from '../components/UI';

interface LabFormData {
  patientId: string;
  date: string;
  egfr: string;
  creatinine: string;
  bun: string;
  uacr: string;
  uricAcid: string;
  potassium: string;
  sodium: string;
  calcium: string;
  phosphate: string;
  bicarbonate: string;
  hemoglobin: string;
  hematocrit: string;
  ferritin: string;
  tsat: string;
  albumin: string;
  systolic: string;
  diastolic: string;
  weight: string;
}

interface NewPatientForm {
  name: string;
  age: string;
  gender: 'Male' | 'Female';
  diabetes: boolean;
  hypertension: boolean;
  heartDisease: boolean;
  obesity: boolean;
  anemia: boolean;
}

const EMPTY_LAB: LabFormData = {
  patientId: '', date: new Date().toISOString().split('T')[0],
  egfr: '', creatinine: '', bun: '', uacr: '', uricAcid: '',
  potassium: '', sodium: '', calcium: '', phosphate: '', bicarbonate: '',
  hemoglobin: '', hematocrit: '', ferritin: '', tsat: '', albumin: '',
  systolic: '', diastolic: '', weight: '',
};

const EMPTY_PATIENT: NewPatientForm = {
  name: '', age: '', gender: 'Male',
  diabetes: false, hypertension: false, heartDisease: false, obesity: false, anemia: false,
};

export default function DataEntry() {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'lab' | 'newpatient' | 'excel'>('lab');
  const [labForm, setLabForm] = useState<LabFormData>(EMPTY_LAB);
  const [newPatient, setNewPatient] = useState<NewPatientForm>(EMPTY_PATIENT);
  const [saving, setSaving] = useState(false);
  const [result, setResult] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [excelResult, setExcelResult] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [csvPreview, setCsvPreview] = useState<string[][]>([]);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    PatientAPI.getAll().then(data => { setPatients(data); setLoading(false); });
  }, []);

  // ── Manual Lab Entry ──────────────────────────────────────────────────────
  const saveLabEntry = async () => {
    if (!labForm.patientId) { setResult({ type: 'error', message: 'Please select a patient.' }); return; }
    if (!labForm.egfr || !labForm.creatinine) { setResult({ type: 'error', message: 'eGFR and Creatinine are required.' }); return; }

    setSaving(true);
    setResult(null);
    try {
      const patient = patients.find(p => p.id === labForm.patientId)!;
      const newLab = {
        date: labForm.date,
        egfr: parseFloat(labForm.egfr) || 0,
        creatinine: parseFloat(labForm.creatinine) || 0,
        bun: parseFloat(labForm.bun) || 0,
        uacr: parseFloat(labForm.uacr) || 0,
        uricAcid: parseFloat(labForm.uricAcid) || 0,
        potassium: parseFloat(labForm.potassium) || 0,
        sodium: parseFloat(labForm.sodium) || 0,
        calcium: parseFloat(labForm.calcium) || 0,
        phosphate: parseFloat(labForm.phosphate) || 0,
        bicarbonate: parseFloat(labForm.bicarbonate) || 0,
        hemoglobin: parseFloat(labForm.hemoglobin) || 0,
        hematocrit: parseFloat(labForm.hematocrit) || 0,
        ferritin: parseFloat(labForm.ferritin) || 0,
        tsat: parseFloat(labForm.tsat) || 0,
        albumin: parseFloat(labForm.albumin) || 0,
      };

      const updatedLabs = [...patient.labs, newLab];
      const updatedVitals = labForm.systolic ? [...patient.vitals, {
        date: labForm.date,
        systolic: parseFloat(labForm.systolic),
        diastolic: parseFloat(labForm.diastolic),
        weight: parseFloat(labForm.weight) || 0,
      }] : patient.vitals;

      await PatientAPI.update(labForm.patientId, { labs: updatedLabs, vitals: updatedVitals, lastUpdated: new Date().toISOString() });
      const refreshed = await PatientAPI.getAll();
      setPatients(refreshed);
      setResult({ type: 'success', message: `Lab entry saved for ${patient.name}! Risk score recalculated.` });
      setLabForm({ ...EMPTY_LAB, patientId: labForm.patientId });
    } catch {
      setResult({ type: 'error', message: 'Failed to save. Make sure the backend is running.' });
    }
    setSaving(false);
  };

  // ── New Patient ───────────────────────────────────────────────────────────
  const saveNewPatient = async () => {
    if (!newPatient.name || !newPatient.age) { setResult({ type: 'error', message: 'Name and Age are required.' }); return; }
    setSaving(true);
    setResult(null);
    try {
      const existing = await PatientAPI.getAll();
      const newId = `P${existing.length + 1}`;
      const patient: Patient = {
        id: newId, name: newPatient.name, age: parseInt(newPatient.age),
        gender: newPatient.gender, gStage: 'G1', riskLevel: 'LOW',
        egfrTrend: 'stable', annualizedSlope: 0, predictedEgfr6Mo: 90,
        observationSpanDays: 0, isVerifiedCKD: false,
        labs: [], vitals: [], medications: [],
        comorbidities: { diabetes: newPatient.diabetes, hypertension: newPatient.hypertension, heartDisease: newPatient.heartDisease, obesity: newPatient.obesity, anemia: newPatient.anemia },
        lastUpdated: new Date().toISOString(),
      };
      await PatientAPI.bulkImport([...existing, patient]);
      const refreshed = await PatientAPI.getAll();
      setPatients(refreshed);
      setResult({ type: 'success', message: `Patient ${newPatient.name} added as ${newId}! Now add their lab data.` });
      setNewPatient(EMPTY_PATIENT);
    } catch {
      setResult({ type: 'error', message: 'Failed to add patient. Make sure the backend is running.' });
    }
    setSaving(false);
  };

  // ── CSV / Excel Import ────────────────────────────────────────────────────
  const handleCsvFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      const rows = text.trim().split('\n').map(r => r.split(',').map(c => c.trim().replace(/"/g, '')));
      setCsvPreview(rows.slice(0, 6));
    };
    reader.readAsText(file);
  };

  const importCsv = async () => {
    if (csvPreview.length < 2) { setExcelResult({ type: 'error', message: 'No valid data found in file.' }); return; }
    setSaving(true);
    setExcelResult(null);
    try {
      const headers = csvPreview[0].map(h => h.toLowerCase().trim());
      const rows = csvPreview.slice(1);
      let successCount = 0;

      for (const row of rows) {
        const get = (col: string) => { const i = headers.indexOf(col); return i >= 0 ? row[i] : ''; };
        const pid = get('patient_id') || get('id') || get('patientid');
        const patient = patients.find(p => p.id === pid || p.name.toLowerCase() === get('name').toLowerCase());
        if (!patient) continue;

        const lab = {
          date: get('date') || new Date().toISOString().split('T')[0],
          egfr: parseFloat(get('egfr')) || 0,
          creatinine: parseFloat(get('creatinine')) || 0,
          bun: parseFloat(get('bun')) || 0,
          uacr: parseFloat(get('uacr')) || 0,
          uricAcid: parseFloat(get('uric_acid') || get('uricacid')) || 0,
          potassium: parseFloat(get('potassium') || get('k')) || 0,
          sodium: parseFloat(get('sodium') || get('na')) || 0,
          calcium: parseFloat(get('calcium') || get('ca')) || 0,
          phosphate: parseFloat(get('phosphate') || get('po4')) || 0,
          bicarbonate: parseFloat(get('bicarbonate') || get('hco3')) || 0,
          hemoglobin: parseFloat(get('hemoglobin') || get('hb')) || 0,
          hematocrit: parseFloat(get('hematocrit')) || 0,
          ferritin: parseFloat(get('ferritin')) || 0,
          tsat: parseFloat(get('tsat')) || 0,
          albumin: parseFloat(get('albumin')) || 0,
        };
        await PatientAPI.update(patient.id, { labs: [...patient.labs, lab], lastUpdated: new Date().toISOString() });
        successCount++;
      }

      const refreshed = await PatientAPI.getAll();
      setPatients(refreshed);
      setExcelResult({ type: 'success', message: `✓ Successfully imported ${successCount} lab records! Risk scores recalculated.` });
      setCsvPreview([]);
    } catch {
      setExcelResult({ type: 'error', message: 'Import failed. Check your file format.' });
    }
    setSaving(false);
  };

  if (loading) return <LoadingSpinner />;

  const inputClass = "w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white";
  const labelClass = "block text-xs font-medium text-gray-500 mb-1";

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="mb-6">
        <p className="text-xs text-blue-600 font-semibold uppercase tracking-widest mb-1">Data Management</p>
        <h1 className="text-3xl font-bold text-gray-900">Add Patient Data</h1>
        <p className="text-gray-500 mt-1">Enter lab values manually or import from Excel/CSV — no AI required.</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6">
        {[
          { key: 'lab', icon: <Save size={15} />, label: 'Manual Lab Entry' },
          { key: 'newpatient', icon: <UserPlus size={15} />, label: 'Add New Patient' },
          { key: 'excel', icon: <FileSpreadsheet size={15} />, label: 'Excel / CSV Import' },
        ].map(t => (
          <button key={t.key} onClick={() => { setActiveTab(t.key as typeof activeTab); setResult(null); }}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium transition-colors ${activeTab === t.key ? 'bg-blue-600 text-white shadow-sm' : 'text-gray-600 hover:bg-gray-100 border border-gray-200'}`}>
            {t.icon} {t.label}
          </button>
        ))}
      </div>

      {/* ── MANUAL LAB ENTRY ── */}
      {activeTab === 'lab' && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <h2 className="font-semibold text-gray-900 mb-5 flex items-center gap-2"><Save size={18} className="text-blue-600" /> Enter Lab Results</h2>

          {/* Patient + Date */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div>
              <label className={labelClass}>Patient *</label>
              <select value={labForm.patientId} onChange={e => setLabForm(f => ({ ...f, patientId: e.target.value }))} className={inputClass}>
                <option value="">Select patient...</option>
                {patients.map(p => <option key={p.id} value={p.id}>{p.name} ({p.id}) — Stage {p.gStage}</option>)}
              </select>
            </div>
            <div>
              <label className={labelClass}>Sample Date *</label>
              <input type="date" value={labForm.date} onChange={e => setLabForm(f => ({ ...f, date: e.target.value }))} className={inputClass} />
            </div>
          </div>

          {/* Kidney Function */}
          <div className="mb-5">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3 flex items-center gap-2"><span className="w-4 h-px bg-gray-300 inline-block"></span> Kidney Function</p>
            <div className="grid grid-cols-5 gap-3">
              {[['egfr','eGFR (ml/min)','> 90'],['creatinine','Creatinine (mg/dL)','0.7–1.3'],['bun','BUN (mg/dL)','7–20'],['uacr','UACR (mg/g)','< 30'],['uricAcid','Uric Acid (mg/dL)','3.5–7.2']].map(([k,l,r]) => (
                <div key={k}>
                  <label className={labelClass}>{l}</label>
                  <input type="number" step="0.01" placeholder={r} value={(labForm as any)[k]} onChange={e => setLabForm(f => ({ ...f, [k]: e.target.value }))} className={inputClass} />
                </div>
              ))}
            </div>
          </div>

          {/* Electrolytes */}
          <div className="mb-5">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3 flex items-center gap-2"><span className="w-4 h-px bg-gray-300 inline-block"></span> Electrolytes</p>
            <div className="grid grid-cols-5 gap-3">
              {[['potassium','Potassium (mEq/L)','3.5–5.1'],['sodium','Sodium (mEq/L)','135–145'],['calcium','Calcium (mg/dL)','8.5–10.2'],['phosphate','Phosphate (mg/dL)','2.5–4.5'],['bicarbonate','Bicarbonate (mEq/L)','22–28']].map(([k,l,r]) => (
                <div key={k}>
                  <label className={labelClass}>{l}</label>
                  <input type="number" step="0.01" placeholder={r} value={(labForm as any)[k]} onChange={e => setLabForm(f => ({ ...f, [k]: e.target.value }))} className={inputClass} />
                </div>
              ))}
            </div>
          </div>

          {/* Anemia */}
          <div className="mb-5">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3 flex items-center gap-2"><span className="w-4 h-px bg-gray-300 inline-block"></span> Anemia Markers</p>
            <div className="grid grid-cols-5 gap-3">
              {[['hemoglobin','Hemoglobin (g/dL)','13.5–17.5'],['hematocrit','Hematocrit (%)','41–50'],['ferritin','Ferritin (ng/mL)','30–400'],['tsat','TSAT (%)','20–50'],['albumin','Albumin (g/dL)','3.4–5.4']].map(([k,l,r]) => (
                <div key={k}>
                  <label className={labelClass}>{l}</label>
                  <input type="number" step="0.01" placeholder={r} value={(labForm as any)[k]} onChange={e => setLabForm(f => ({ ...f, [k]: e.target.value }))} className={inputClass} />
                </div>
              ))}
            </div>
          </div>

          {/* Vitals */}
          <div className="mb-6">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3 flex items-center gap-2"><span className="w-4 h-px bg-gray-300 inline-block"></span> Vitals (Optional)</p>
            <div className="grid grid-cols-3 gap-3">
              {[['systolic','Systolic BP (mmHg)','< 130'],['diastolic','Diastolic BP (mmHg)','< 80'],['weight','Weight (kg)','']].map(([k,l,r]) => (
                <div key={k}>
                  <label className={labelClass}>{l}</label>
                  <input type="number" step="0.1" placeholder={r} value={(labForm as any)[k]} onChange={e => setLabForm(f => ({ ...f, [k]: e.target.value }))} className={inputClass} />
                </div>
              ))}
            </div>
          </div>

          {/* Result message */}
          {result && (
            <div className={`flex items-center gap-3 p-4 rounded-xl mb-4 ${result.type === 'success' ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
              {result.type === 'success' ? <CheckCircle2 size={18} className="text-green-600" /> : <AlertCircle size={18} className="text-red-500" />}
              <p className={`text-sm font-medium ${result.type === 'success' ? 'text-green-700' : 'text-red-700'}`}>{result.message}</p>
              <button onClick={() => setResult(null)} className="ml-auto text-gray-400 hover:text-gray-600"><X size={16} /></button>
            </div>
          )}

          <div className="flex gap-3">
            <button onClick={saveLabEntry} disabled={saving} className="flex items-center gap-2 bg-blue-600 text-white px-6 py-2.5 rounded-xl font-semibold hover:bg-blue-700 disabled:opacity-50 transition-colors">
              {saving ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <Save size={16} />}
              {saving ? 'Saving...' : 'Save Lab Entry'}
            </button>
            <button onClick={() => setLabForm({ ...EMPTY_LAB, patientId: labForm.patientId })} className="px-6 py-2.5 rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 text-sm font-medium transition-colors">
              Clear Form
            </button>
          </div>
        </div>
      )}

      {/* ── NEW PATIENT ── */}
      {activeTab === 'newpatient' && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <h2 className="font-semibold text-gray-900 mb-5 flex items-center gap-2"><UserPlus size={18} className="text-blue-600" /> Register New Patient</h2>

          <div className="grid grid-cols-3 gap-4 mb-5">
            <div className="col-span-1">
              <label className={labelClass}>Full Name *</label>
              <input type="text" placeholder="e.g. Ramesh Sharma" value={newPatient.name} onChange={e => setNewPatient(f => ({ ...f, name: e.target.value }))} className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Age *</label>
              <input type="number" placeholder="e.g. 55" value={newPatient.age} onChange={e => setNewPatient(f => ({ ...f, age: e.target.value }))} className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Gender *</label>
              <select value={newPatient.gender} onChange={e => setNewPatient(f => ({ ...f, gender: e.target.value as 'Male' | 'Female' }))} className={inputClass}>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>
            </div>
          </div>

          <div className="mb-6">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Comorbidities</p>
            <div className="flex flex-wrap gap-3">
              {[['diabetes','Diabetes'],['hypertension','Hypertension'],['heartDisease','Heart Disease'],['obesity','Obesity'],['anemia','Anemia']].map(([k,l]) => (
                <label key={k} className={`flex items-center gap-2 px-4 py-2 rounded-lg border cursor-pointer transition-colors ${(newPatient as any)[k] ? 'bg-blue-50 border-blue-300 text-blue-700' : 'border-gray-200 text-gray-600'}`}>
                  <input type="checkbox" className="sr-only" checked={(newPatient as any)[k]} onChange={e => setNewPatient(f => ({ ...f, [k]: e.target.checked }))} />
                  <Plus size={13} /> {l}
                </label>
              ))}
            </div>
          </div>

          {result && (
            <div className={`flex items-center gap-3 p-4 rounded-xl mb-4 ${result.type === 'success' ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
              {result.type === 'success' ? <CheckCircle2 size={18} className="text-green-600" /> : <AlertCircle size={18} className="text-red-500" />}
              <p className={`text-sm font-medium ${result.type === 'success' ? 'text-green-700' : 'text-red-700'}`}>{result.message}</p>
            </div>
          )}

          <button onClick={saveNewPatient} disabled={saving} className="flex items-center gap-2 bg-blue-600 text-white px-6 py-2.5 rounded-xl font-semibold hover:bg-blue-700 disabled:opacity-50 transition-colors">
            {saving ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <UserPlus size={16} />}
            {saving ? 'Adding...' : 'Add Patient'}
          </button>
        </div>
      )}

      {/* ── EXCEL / CSV IMPORT ── */}
      {activeTab === 'excel' && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <h2 className="font-semibold text-gray-900 mb-2 flex items-center gap-2"><FileSpreadsheet size={18} className="text-blue-600" /> Excel / CSV Import</h2>
          <p className="text-sm text-gray-500 mb-5">Export your Excel file as CSV, then upload here. All lab values import automatically.</p>

          {/* Template download */}
          <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 mb-5">
            <p className="text-sm font-medium text-blue-800 mb-2">📋 Required CSV column headers:</p>
            <code className="text-xs text-blue-700 bg-blue-100 px-2 py-1 rounded block overflow-x-auto">
              patient_id, date, egfr, creatinine, bun, uacr, uric_acid, potassium, sodium, calcium, phosphate, bicarbonate, hemoglobin, hematocrit, ferritin, tsat, albumin
            </code>
            <p className="text-xs text-blue-600 mt-2">Example row: P1, 2024-06-01, 14.5, 2.1, 38, 480, 6.8, 5.2, 136, 9.1, 5.1, 21, 9.8, 30, 280, 25, 3.6</p>
            <button
              onClick={() => {
                const header = 'patient_id,date,egfr,creatinine,bun,uacr,uric_acid,potassium,sodium,calcium,phosphate,bicarbonate,hemoglobin,hematocrit,ferritin,tsat,albumin\n';
                const example = 'P1,2024-06-01,14.5,2.1,38,480,6.8,5.2,136,9.1,5.1,21,9.8,30,280,25,3.6\n';
                const blob = new Blob([header + example], { type: 'text/csv' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a'); a.href = url; a.download = 'ckd_lab_template.csv'; a.click();
              }}
              className="mt-3 flex items-center gap-2 text-xs text-blue-600 hover:text-blue-800 font-semibold border border-blue-300 rounded-lg px-3 py-1.5 w-fit transition-colors">
              ⬇ Download Template CSV
            </button>
          </div>

          {/* Upload zone */}
          <div
            onClick={() => fileRef.current?.click()}
            onDragOver={e => e.preventDefault()}
            onDrop={e => { e.preventDefault(); const f = e.dataTransfer.files[0]; if (f) handleCsvFile(f); }}
            className="border-2 border-dashed border-gray-200 rounded-2xl p-10 text-center cursor-pointer hover:border-blue-400 hover:bg-blue-50/30 transition-colors mb-5">
            <Upload size={36} className="mx-auto text-gray-300 mb-3" />
            <p className="text-gray-500 text-sm">Drag & drop CSV file or <span className="text-blue-600 underline">browse</span></p>
            <p className="text-xs text-gray-400 mt-1">Export Excel as CSV first (File → Save As → CSV)</p>
            <input ref={fileRef} type="file" accept=".csv,.txt" className="hidden" onChange={e => e.target.files?.[0] && handleCsvFile(e.target.files[0])} />
          </div>

          {/* Preview */}
          {csvPreview.length > 0 && (
            <div className="mb-5">
              <p className="text-sm font-semibold text-gray-700 mb-2">Preview (first 5 rows):</p>
              <div className="overflow-x-auto rounded-xl border border-gray-100">
                <table className="w-full text-xs">
                  <thead className="bg-gray-50">
                    <tr>{csvPreview[0].map((h, i) => <th key={i} className="px-3 py-2 text-left text-gray-500 font-semibold">{h}</th>)}</tr>
                  </thead>
                  <tbody>
                    {csvPreview.slice(1).map((row, i) => (
                      <tr key={i} className="border-t border-gray-50">
                        {row.map((cell, j) => <td key={j} className="px-3 py-2 text-gray-700">{cell}</td>)}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p className="text-xs text-gray-400 mt-2">{csvPreview.length - 1} data rows detected</p>
            </div>
          )}

          {excelResult && (
            <div className={`flex items-center gap-3 p-4 rounded-xl mb-4 ${excelResult.type === 'success' ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
              {excelResult.type === 'success' ? <CheckCircle2 size={18} className="text-green-600" /> : <AlertCircle size={18} className="text-red-500" />}
              <p className={`text-sm font-medium ${excelResult.type === 'success' ? 'text-green-700' : 'text-red-700'}`}>{excelResult.message}</p>
            </div>
          )}

          {csvPreview.length > 0 && (
            <button onClick={importCsv} disabled={saving} className="flex items-center gap-2 bg-blue-600 text-white px-6 py-2.5 rounded-xl font-semibold hover:bg-blue-700 disabled:opacity-50 transition-colors">
              {saving ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <Upload size={16} />}
              {saving ? 'Importing...' : `Import ${csvPreview.length - 1} Records`}
            </button>
          )}
        </div>
      )}
    </div>
  );
}
