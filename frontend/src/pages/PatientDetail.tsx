import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, CheckCircle2, AlertTriangle } from 'lucide-react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from 'recharts';
import { Patient } from '../types';
import { PatientAPI } from '../services/api';
import { RiskBadge, StageBadge, TrendBadge, LabRow, LoadingSpinner } from '../components/UI';

type Tab = 'diagnostic' | 'labs' | 'medications';

export default function PatientDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [patient, setPatient] = useState<Patient | null>(null);
  const [activeTab, setActiveTab] = useState<Tab>('diagnostic');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    PatientAPI.getById(id).then(data => { setPatient(data); setLoading(false); });
  }, [id]);

  if (loading) return <LoadingSpinner />;
  if (!patient) return <div className="p-8 text-red-500">Patient not found.</div>;

  const sortedLabs = [...patient.labs].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  const sortedVitals = [...patient.vitals].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  const latestLab = sortedLabs[sortedLabs.length - 1];
  const latestVital = sortedVitals[sortedVitals.length - 1];

  const chartData = sortedLabs.map(l => ({
    date: new Date(l.date).toLocaleDateString('en-IN', { month: 'short', year: '2-digit' }),
    eGFR: l.egfr,
    UACR: Math.round(l.uacr / 30), // scale for dual axis readability
    uacrRaw: l.uacr,
  }));

  const bpData = sortedVitals.map(v => ({
    date: new Date(v.date).toLocaleDateString('en-IN', { month: 'short', year: '2-digit' }),
    Systolic: v.systolic,
    Diastolic: v.diastolic,
  }));

  const kdigo90Days = patient.observationSpanDays >= 90;
  const kdigoEgfr = (latestLab?.egfr ?? 100) < 60;
  const kdigoUacr = (latestLab?.uacr ?? 0) > 30;

  const tabs: { key: Tab; label: string }[] = [
    { key: 'diagnostic', label: 'Diagnostic Audit' },
    { key: 'labs', label: `Labs (${patient.labs.length} Points)` },
    { key: 'medications', label: 'Medications' },
  ];

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Back */}
      <button onClick={() => navigate('/')} className="flex items-center gap-2 text-sm text-gray-500 hover:text-blue-600 mb-5 transition-colors">
        <ArrowLeft size={16} /> Back to Dashboard
      </button>

      {/* Patient header */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6 mb-6 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-5">
          <div className="w-16 h-16 bg-blue-600 rounded-xl flex items-center justify-center text-white text-2xl font-bold">
            {patient.name.charAt(0)}
          </div>
          <div>
            <div className="flex items-center gap-3 mb-1">
              <h2 className="text-2xl font-bold text-gray-900">{patient.name}</h2>
              {patient.isVerifiedCKD && (
                <span className="bg-green-50 text-green-700 border border-green-200 text-xs font-semibold px-3 py-1 rounded-full flex items-center gap-1">
                  <CheckCircle2 size={12} /> Diagnostically Verified
                </span>
              )}
            </div>
            <p className="text-gray-500 text-sm">
              ID: {patient.id} • {patient.age}y • <span className="text-blue-600 font-semibold">Stage {patient.gStage}</span>
            </p>
          </div>
        </div>
        <div className="flex items-center gap-8 text-right">
          <div>
            <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">6-Mo Prediction</p>
            <p className="text-2xl font-bold text-blue-600">eGFR {patient.predictedEgfr6Mo}</p>
          </div>
          <div>
            <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Risk Stratification</p>
            <RiskBadge level={patient.riskLevel} />
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6">
        {tabs.map(t => (
          <button
            key={t.key}
            onClick={() => setActiveTab(t.key)}
            className={`px-5 py-2 rounded-lg text-sm font-medium transition-colors ${
              activeTab === t.key
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-gray-600 hover:bg-gray-100 border border-gray-200'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-3 gap-6">
        {/* Main panel */}
        <div className="col-span-2 space-y-6">
          {activeTab === 'diagnostic' && (
            <>
              {/* KDIGO Checklist */}
              <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-gray-900">KDIGO Diagnostic Checklist</h3>
                  <span className="text-xs text-gray-400 italic">Reference: KDIGO 2024 Guidelines</span>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  {[
                    { check: kdigoEgfr, label: 'eGFR < 60', desc: 'Functional impairment in current labs.' },
                    { check: kdigoUacr, label: 'UACR > 30', desc: 'Evidence of structural kidney damage (Albuminuria).' },
                    { check: kdigo90Days, label: '> 90 Days', desc: `Abnormalities persisted for ${patient.observationSpanDays} days.` },
                  ].map(({ check, label, desc }) => (
                    <div key={label} className={`rounded-xl p-4 text-center border ${check ? 'bg-green-50 border-green-200' : 'bg-amber-50 border-amber-200'}`}>
                      {check
                        ? <CheckCircle2 className="mx-auto text-green-600 mb-2" size={28} />
                        : <AlertTriangle className="mx-auto text-amber-500 mb-2" size={28} />
                      }
                      <p className="font-semibold text-sm text-gray-800">{label}</p>
                      <p className="text-xs text-gray-500 mt-1">{desc}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* GFR Trend Chart */}
              <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
                <h3 className="font-semibold text-gray-900 mb-4">Longitudinal GFR Trend (Linear Regression)</h3>
                <ResponsiveContainer width="100%" height={240}>
                  <LineChart data={chartData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="date" tick={{ fontSize: 11 }} />
                    <YAxis yAxisId="left" domain={[0, 20]} tick={{ fontSize: 11 }} />
                    <YAxis yAxisId="right" orientation="right" domain={[0, 20]} tick={{ fontSize: 11 }} />
                    <Tooltip formatter={(val, name) => name === 'UACR' ? [`${Number(val) * 30} mg/g`, 'UACR'] : [val, name]} />
                    <Legend />
                    <Line yAxisId="left" type="monotone" dataKey="eGFR" stroke="#3b82f6" strokeWidth={2.5} dot={{ r: 4 }} />
                    <Line yAxisId="right" type="monotone" dataKey="UACR" stroke="#f59e0b" strokeWidth={2} strokeDasharray="5 5" dot={{ r: 4 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              {/* Clinical Logic Trace */}
              <div className="bg-slate-900 text-white rounded-2xl p-6">
                <p className="text-sm font-semibold text-slate-300 mb-4 flex items-center gap-2">🔬 Clinical Analysis Logic Trace</p>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-slate-800 rounded-xl p-4">
                    <p className="text-xs text-slate-400 uppercase tracking-wider mb-2">Annualized Slope</p>
                    <p className={`text-2xl font-bold ${patient.annualizedSlope < 0 ? 'text-red-400' : 'text-green-400'}`}>
                      {patient.annualizedSlope > 0 ? '+' : ''}{patient.annualizedSlope} ml/min/yr
                    </p>
                  </div>
                  <div className="bg-slate-800 rounded-xl p-4">
                    <p className="text-xs text-slate-400 uppercase tracking-wider mb-2">Observation Span</p>
                    <p className="text-2xl font-bold text-green-400">{patient.observationSpanDays} <span className="text-sm font-normal text-slate-400">Days</span></p>
                  </div>
                </div>
                <div className="mt-4 bg-slate-800 rounded-xl p-4">
                  <p className="text-xs text-slate-400 uppercase tracking-wider mb-2">6-Month Forward Projection</p>
                  <p className="text-sm text-slate-200">
                    Predicted eGFR in 6 months: <span className="font-bold text-blue-300">{patient.predictedEgfr6Mo} ml/min</span> — current stage: <span className="font-bold text-amber-300">{patient.gStage}</span>
                  </p>
                </div>
              </div>
            </>
          )}

          {activeTab === 'labs' && (
            <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm space-y-6">
              <div className="grid grid-cols-3 gap-6">
                <div>
                  <p className="text-xs font-bold uppercase text-gray-400 tracking-wider mb-3">Kidney Function</p>
                  <LabRow label="eGFR" value={latestLab?.egfr ?? 0} unit="ml/min" refRange="> 90" flagHigh={(latestLab?.egfr ?? 100) < 60} />
                  <LabRow label="Creatinine" value={latestLab?.creatinine ?? 0} unit="mg/dL" refRange="0.7-1.3" flagHigh={(latestLab?.creatinine ?? 0) > 1.3} />
                  <LabRow label="BUN" value={latestLab?.bun ?? 0} unit="mg/dL" refRange="7-20" flagHigh={(latestLab?.bun ?? 0) > 20} />
                  <LabRow label="UACR" value={latestLab?.uacr ?? 0} unit="mg/g" refRange="< 30" flagHigh={(latestLab?.uacr ?? 0) > 30} />
                  <LabRow label="Uric Acid" value={latestLab?.uricAcid ?? 0} unit="mg/dL" refRange="3.5-7.2" flagHigh={(latestLab?.uricAcid ?? 0) > 7.2} />
                </div>
                <div>
                  <p className="text-xs font-bold uppercase text-gray-400 tracking-wider mb-3">Electrolytes</p>
                  <LabRow label="Potassium" value={latestLab?.potassium ?? 0} unit="mEq/L" refRange="3.5-5.1" flagHigh={(latestLab?.potassium ?? 0) > 5.1} />
                  <LabRow label="Sodium" value={latestLab?.sodium ?? 0} unit="mEq/L" refRange="135-145" />
                  <LabRow label="Calcium" value={latestLab?.calcium ?? 0} unit="mg/dL" refRange="8.5-10.2" />
                  <LabRow label="Phosphate" value={latestLab?.phosphate ?? 0} unit="mg/dL" refRange="2.5-4.5" flagHigh={(latestLab?.phosphate ?? 0) > 4.5} />
                  <LabRow label="Bicarbonate" value={latestLab?.bicarbonate ?? 0} unit="mEq/L" refRange="22-28" flagHigh={(latestLab?.bicarbonate ?? 0) < 22} />
                </div>
                <div>
                  <p className="text-xs font-bold uppercase text-gray-400 tracking-wider mb-3">Anemia</p>
                  <LabRow label="Hemoglobin" value={latestLab?.hemoglobin ?? 0} unit="g/dL" refRange="13.5-17.5" flagHigh={(latestLab?.hemoglobin ?? 15) < 11} />
                  <LabRow label="Hematocrit" value={latestLab?.hematocrit ?? 0} unit="%" refRange="41-50" />
                  <LabRow label="Ferritin" value={latestLab?.ferritin ?? 0} unit="ng/mL" refRange="30-400" />
                  <LabRow label="TSAT" value={latestLab?.tsat ?? 0} unit="%" refRange="20-50" />
                  <LabRow label="Albumin" value={latestLab?.albumin ?? 0} unit="g/dL" refRange="3.4-5.4" flagHigh={(latestLab?.albumin ?? 4) < 3.4} />
                </div>
              </div>
            </div>
          )}

          {activeTab === 'medications' && (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              {patient.medications.length === 0 ? (
                <div className="p-8 text-center text-gray-400 text-sm">No active medications recorded.</div>
              ) : (
                <table className="w-full text-sm">
                  <thead className="bg-gray-50 border-b border-gray-100">
                    <tr>
                      <th className="text-left px-6 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">Medication</th>
                      <th className="text-left px-6 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">Dosage</th>
                      <th className="text-left px-6 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">Indication</th>
                    </tr>
                  </thead>
                  <tbody>
                    {patient.medications.map((med, i) => (
                      <tr key={i} className="border-b border-gray-50 hover:bg-gray-50">
                        <td className="px-6 py-4 font-semibold text-gray-900">{med.name}</td>
                        <td className="px-6 py-4 text-gray-600">{med.dosage}</td>
                        <td className="px-6 py-4 text-gray-500 italic">{med.indication}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          )}
        </div>

        {/* Right sidebar */}
        <div className="space-y-5">
          {/* BP Chart */}
          <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
            <h4 className="font-semibold text-sm text-gray-700 mb-3">BP Stability (mmHg)</h4>
            <ResponsiveContainer width="100%" height={160}>
              <LineChart data={bpData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="date" tick={{ fontSize: 10 }} />
                <YAxis domain={[40, 220]} tick={{ fontSize: 10 }} />
                <Tooltip />
                <Line type="monotone" dataKey="Systolic" stroke="#ef4444" strokeWidth={2} dot={{ r: 3 }} />
                <Line type="monotone" dataKey="Diastolic" stroke="#f87171" strokeWidth={2} strokeDasharray="4 4" dot={{ r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Latest Profile Summary */}
          <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
            <p className="text-xs font-bold uppercase text-gray-400 tracking-wider mb-3">Latest Profile</p>
            <div className="space-y-2">
              {[
                { label: 'eGFR', value: `${latestLab?.egfr} ml/min`, ref: '> 90', flag: (latestLab?.egfr ?? 100) < 60 },
                { label: 'Creatinine', value: `${latestLab?.creatinine} mg/dL`, ref: '0.7-1.3', flag: (latestLab?.creatinine ?? 0) > 1.3 },
                { label: 'BUN', value: `${latestLab?.bun} mg/dL`, ref: '7-20', flag: (latestLab?.bun ?? 0) > 20 },
                { label: 'UACR', value: `${latestLab?.uacr} mg/g`, ref: '< 30', flag: (latestLab?.uacr ?? 0) > 30 },
              ].map(({ label, value, ref, flag }) => (
                <div key={label} className="flex justify-between items-center">
                  <div>
                    <p className="text-sm text-gray-600">{label}</p>
                    <p className="text-xs text-gray-400">Ref: {ref}</p>
                  </div>
                  <span className={`text-sm font-bold ${flag ? 'text-red-600' : 'text-gray-900'}`}>{value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Comorbidities */}
          <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
            <p className="text-xs font-bold uppercase text-gray-400 tracking-wider mb-3">Comorbidities</p>
            {Object.entries(patient.comorbidities).map(([key, val]) => (
              <div key={key} className="flex justify-between py-1.5 border-b border-gray-50 last:border-0">
                <span className="text-sm text-gray-600 capitalize">{key.replace(/([A-Z])/g, ' $1')}</span>
                <span className={`text-sm font-bold ${val ? 'text-red-500' : 'text-green-500'}`}>{val ? 'YES' : 'NO'}</span>
              </div>
            ))}
          </div>

          {/* Trend badge */}
          <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
            <p className="text-xs font-bold uppercase text-gray-400 tracking-wider mb-3">eGFR Trajectory</p>
            <TrendBadge trend={patient.egfrTrend} slope={patient.annualizedSlope} />
            <p className="text-xs text-gray-400 mt-2">Based on {patient.labs.length} data points over {patient.observationSpanDays} days</p>
          </div>
        </div>
      </div>
    </div>
  );
}
