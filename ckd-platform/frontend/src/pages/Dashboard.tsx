import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Filter } from 'lucide-react';
import { Patient, RiskLevel, GStage } from '../types';
import { PatientAPI } from '../services/api';
import { RiskBadge, StageBadge, TrendBadge, StatCard, LoadingSpinner } from '../components/UI';

type FilterRisk = 'ALL' | RiskLevel;
type FilterStage = 'ALL' | GStage;

export default function Dashboard() {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterRisk, setFilterRisk] = useState<FilterRisk>('ALL');
  const [filterStage, setFilterStage] = useState<FilterStage>('ALL');
  const navigate = useNavigate();

  useEffect(() => {
    PatientAPI.getAll().then(data => { setPatients(data); setLoading(false); });
  }, []);

  const filtered = patients.filter(p => {
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase()) || p.id.toLowerCase().includes(search.toLowerCase());
    const matchRisk = filterRisk === 'ALL' || p.riskLevel === filterRisk;
    const matchStage = filterStage === 'ALL' || p.gStage === filterStage;
    return matchSearch && matchRisk && matchStage;
  }).sort((a, b) => {
    const riskOrder = { HIGH: 0, MEDIUM: 1, LOW: 2 };
    return riskOrder[a.riskLevel] - riskOrder[b.riskLevel];
  });

  const stats = {
    total: patients.length,
    high: patients.filter(p => p.riskLevel === 'HIGH').length,
    medium: patients.filter(p => p.riskLevel === 'MEDIUM').length,
    low: patients.filter(p => p.riskLevel === 'LOW').length,
    rapid: patients.filter(p => p.egfrTrend === 'rapid-decline').length,
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <p className="text-xs text-blue-600 font-semibold uppercase tracking-widest mb-1">Clinical Population Overview</p>
        <h1 className="text-3xl font-bold text-gray-900">Clinician Dashboard</h1>
        <p className="text-gray-500 mt-1">Predictive risk stratification and diagnostic tracking for {stats.total} active patients.</p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <StatCard label="Total Patients" value={stats.total} color="blue" />
        <StatCard label="High Risk" value={stats.high} sub="Action Required" color="red" />
        <StatCard label="Med Risk" value={stats.medium} sub="Monitoring" color="amber" />
        <StatCard label="Rapid Progressors" value={stats.rapid} sub="eGFR slope ≤ −5" color="orange" />
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-5">
        <div className="relative flex-1 min-w-48">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search patient name or ID..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter size={16} className="text-gray-400" />
          <select
            value={filterRisk}
            onChange={e => setFilterRisk(e.target.value as FilterRisk)}
            className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="ALL">All Risk Levels</option>
            <option value="HIGH">High Risk</option>
            <option value="MEDIUM">Medium Risk</option>
            <option value="LOW">Low Risk</option>
          </select>
          <select
            value={filterStage}
            onChange={e => setFilterStage(e.target.value as FilterStage)}
            className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="ALL">All Stages</option>
            {(['G1','G2','G3a','G3b','G4','G5'] as GStage[]).map(s => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Patient table */}
      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
        <div className="grid grid-cols-12 gap-4 px-6 py-3 bg-gray-50 border-b border-gray-100 text-xs text-gray-400 font-semibold uppercase tracking-wider">
          <div className="col-span-3">Patient Profile</div>
          <div className="col-span-2">KDIGO Status</div>
          <div className="col-span-3">Function & Trend</div>
          <div className="col-span-2">Urgency Level</div>
          <div className="col-span-2 text-right">Analysis</div>
        </div>

        {filtered.length === 0 && (
          <div className="p-10 text-center text-gray-400 text-sm">No patients match your filters.</div>
        )}

        {filtered.map(p => {
          const latest = [...p.labs].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0];
          return (
            <div
              key={p.id}
              className="grid grid-cols-12 gap-4 px-6 py-4 border-b border-gray-50 hover:bg-blue-50/30 transition-colors items-center cursor-pointer"
              onClick={() => navigate(`/patients/${p.id}`)}
            >
              {/* Patient Profile */}
              <div className="col-span-3 flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                  {p.name.charAt(0)}
                </div>
                <div>
                  <p className="font-semibold text-gray-900 text-sm">{p.name}</p>
                  <p className="text-xs text-gray-400">{p.age}y • {p.gender} • {p.id}</p>
                </div>
              </div>

              {/* KDIGO Status */}
              <div className="col-span-2 flex items-center gap-2 flex-wrap">
                <StageBadge stage={p.gStage} />
                {p.comorbidities.diabetes && <span className="text-xs text-gray-400">DM+</span>}
                {p.comorbidities.hypertension && <span className="text-xs text-gray-400">HTN+</span>}
              </div>

              {/* Function & Trend */}
              <div className="col-span-3">
                <p className="text-xl font-semibold text-gray-900">{latest?.egfr ?? '—'} <span className="text-xs font-normal text-gray-400">ml/min</span></p>
                <TrendBadge trend={p.egfrTrend} slope={p.annualizedSlope} />
              </div>

              {/* Urgency */}
              <div className="col-span-2">
                <RiskBadge level={p.riskLevel} />
                {p.riskLevel === 'HIGH' && (
                  <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-red-500 inline-block"></span>
                    Urgent Review
                  </p>
                )}
              </div>

              {/* CTA */}
              <div className="col-span-2 flex justify-end">
                <button
                  onClick={e => { e.stopPropagation(); navigate(`/patients/${p.id}`); }}
                  className="bg-slate-900 text-white text-xs font-semibold px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Profile Analysis
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
