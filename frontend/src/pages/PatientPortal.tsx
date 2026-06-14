import { useState, useEffect } from 'react';
import { Heart, CheckCircle2, Circle, MessageSquare, TrendingDown } from 'lucide-react';
import { Patient } from '../types';
import { PatientAPI } from '../services/api';

export default function PatientPortal() {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [selectedId, setSelectedId] = useState<string>('P1');
  const [checked, setChecked] = useState<Record<string, boolean>>({});
  const [symptoms, setSymptoms] = useState<string[]>([]);

  useEffect(() => { PatientAPI.getAll().then(setPatients); }, []);

  const patient = patients.find(p => p.id === selectedId);
  const latestLab = patient ? [...patient.labs].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0] : null;
  const completion = patient
    ? Math.round((patient.medications.filter((_, i) => checked[`med-${i}`]).length / Math.max(patient.medications.length, 1)) * 100)
    : 0;

  const toggleSymptom = (s: string) =>
    setSymptoms(prev => prev.includes(s) ? prev.filter(x => x !== s) : [...prev, s]);

  const symptomList = ['Tiredness', 'Swelling', 'Low Appetite', 'Breathlessness', 'Nausea', 'Muscle Cramps'];

  return (
    <div className="p-6 max-w-5xl mx-auto">
      {/* Patient selector */}
      <div className="mb-4">
        <select
          value={selectedId}
          onChange={e => { setSelectedId(e.target.value); setChecked({}); setSymptoms([]); }}
          className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {patients.map(p => <option key={p.id} value={p.id}>{p.name} ({p.gStage})</option>)}
        </select>
      </div>

      {patient && (
        <div className="grid grid-cols-3 gap-6">
          {/* Left: welcome + vitals */}
          <div className="col-span-2 space-y-5">
            {/* Welcome card */}
            <div className="bg-white rounded-2xl border border-gray-100 p-6 flex items-center justify-between shadow-sm">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-full bg-blue-600 flex items-center justify-center text-white text-xl font-bold">
                  {patient.name.charAt(0)}
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Hello, {patient.name.split(' ')[0]}!</h2>
                  <span className="inline-block bg-blue-100 text-blue-700 text-xs font-semibold px-3 py-1 rounded-full mt-1">Stage {patient.gStage}</span>
                  <p className="text-sm text-gray-400 mt-1">Your treatment plan is on track.</p>
                </div>
              </div>
              <button className="flex items-center gap-2 bg-slate-900 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors">
                <MessageSquare size={16} /> Message Clinic
              </button>
            </div>

            {/* Vital Trends */}
            <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
              <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Heart size={18} className="text-red-500" /> Your Vital Trends
              </h3>
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Kidney Power (eGFR)</p>
                  <p className="text-3xl font-bold text-gray-900">{latestLab?.egfr} <span className="text-sm font-normal text-gray-400">/ 100</span></p>
                  <div className="w-full bg-gray-100 rounded-full h-2 mt-2">
                    <div className="bg-red-500 h-2 rounded-full transition-all" style={{ width: `${Math.min(latestLab?.egfr ?? 0, 100)}%` }} />
                  </div>
                  <p className="text-xs text-gray-400 mt-1">Click for details • Stage {patient.gStage}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Filter Stress (UACR)</p>
                  <p className="text-3xl font-bold text-gray-900">{latestLab?.uacr} <span className="text-sm font-normal text-gray-400">mg/g</span></p>
                  <div className="w-full bg-gray-100 rounded-full h-2 mt-2">
                    <div className="bg-red-500 h-2 rounded-full transition-all" style={{ width: `${Math.min((latestLab?.uacr ?? 0) / 10, 100)}%` }} />
                  </div>
                  <p className="text-xs text-gray-400 mt-1">Protein levels {(latestLab?.uacr ?? 0) > 300 ? '• High' : (latestLab?.uacr ?? 0) > 30 ? '• Moderate' : '• Normal'}</p>
                </div>
              </div>
            </div>

            {/* Symptoms */}
            <div className="bg-slate-900 text-white rounded-2xl p-6">
              <h3 className="font-semibold mb-1">How are you feeling today?</h3>
              <p className="text-slate-400 text-sm mb-4">Tracking your daily symptoms helps your care team spot trends early.</p>
              <div className="flex flex-wrap gap-2">
                {symptomList.map(s => (
                  <button
                    key={s}
                    onClick={() => toggleSymptom(s)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors border ${
                      symptoms.includes(s)
                        ? 'bg-blue-600 border-blue-600 text-white'
                        : 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700'
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
              {symptoms.length > 0 && (
                <p className="text-xs text-slate-400 mt-3">Selected: {symptoms.join(', ')}. These will be shared with your care team at next review.</p>
              )}
            </div>

            {/* eGFR trend mini */}
            <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm flex items-center gap-4">
              <TrendingDown size={24} className="text-red-500" />
              <div>
                <p className="font-semibold text-sm text-gray-800">eGFR Slope: {patient.annualizedSlope} ml/min/yr</p>
                <p className="text-xs text-gray-400">Your kidney function is {patient.egfrTrend.replace('-', ' ')}. Predicted eGFR in 6 months: {patient.predictedEgfr6Mo} ml/min.</p>
              </div>
            </div>
          </div>

          {/* Right: medications + lifestyle */}
          <div className="space-y-5">
            <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
              <div className="flex justify-between items-center mb-3">
                <p className="font-semibold text-sm text-gray-700">Daily Completion</p>
                <span className="text-blue-600 font-bold text-sm">{completion}%</span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-2 mb-5">
                <div className="bg-blue-600 h-2 rounded-full transition-all" style={{ width: `${completion}%` }} />
              </div>

              <p className="text-xs font-bold uppercase text-gray-400 tracking-wider mb-3">Medications</p>
              <div className="space-y-3">
                {patient.medications.length === 0 && <p className="text-xs text-gray-400">No medications listed.</p>}
                {patient.medications.map((med, i) => (
                  <button
                    key={i}
                    onClick={() => setChecked(c => ({ ...c, [`med-${i}`]: !c[`med-${i}`] }))}
                    className="flex items-center gap-3 w-full text-left hover:bg-gray-50 rounded-lg p-1 transition-colors"
                  >
                    {checked[`med-${i}`]
                      ? <CheckCircle2 size={20} className="text-green-500 flex-shrink-0" />
                      : <Circle size={20} className="text-gray-300 flex-shrink-0" />
                    }
                    <div>
                      <p className={`text-sm font-medium ${checked[`med-${i}`] ? 'line-through text-gray-400' : 'text-gray-800'}`}>{med.name} {med.dosage}</p>
                      <p className="text-xs text-gray-400 capitalize">{med.timeOfDay === 'both' ? '08:00 AM & 08:00 PM' : med.timeOfDay === 'morning' ? '08:00 AM' : '08:00 PM'}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Lifestyle Goals */}
            <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
              <p className="text-xs font-bold uppercase text-gray-400 tracking-wider mb-3">Lifestyle Goals</p>
              {[
                { goal: 'Fluid intake < 1.5L/day', done: false },
                { goal: 'Low potassium diet', done: false },
                { goal: 'BP check logged', done: false },
                { goal: 'Daily weight recorded', done: false },
              ].map(({ goal, done }, i) => (
                <div key={i} className="flex items-center gap-2 py-2 border-b border-gray-50 last:border-0">
                  <Circle size={16} className="text-gray-300" />
                  <p className="text-sm text-gray-600">{goal}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
