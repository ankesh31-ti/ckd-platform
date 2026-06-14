import { RiskLevel, GStage, EGFRTrend } from '../types';

export function RiskBadge({ level }: { level: RiskLevel }) {
  const styles: Record<RiskLevel, string> = {
    HIGH: 'bg-red-100 text-red-700 border border-red-200',
    MEDIUM: 'bg-amber-100 text-amber-700 border border-amber-200',
    LOW: 'bg-green-100 text-green-700 border border-green-200',
  };
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold uppercase tracking-wide ${styles[level]}`}>
      {level}
    </span>
  );
}

export function StageBadge({ stage }: { stage: GStage }) {
  const color = stage === 'G5' ? 'bg-red-600 text-white' :
    stage === 'G4' ? 'bg-orange-500 text-white' :
    stage === 'G3b' ? 'bg-amber-500 text-white' :
    stage === 'G3a' ? 'bg-yellow-400 text-yellow-900' :
    'bg-blue-100 text-blue-700';
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-bold ${color}`}>
      {stage}
    </span>
  );
}

export function TrendBadge({ trend, slope }: { trend: EGFRTrend; slope: number }) {
  const styles: Record<EGFRTrend, string> = {
    'rapid-decline': 'text-red-600',
    declining: 'text-orange-500',
    stable: 'text-gray-500',
    improving: 'text-green-600',
  };
  const arrows: Record<EGFRTrend, string> = {
    'rapid-decline': '▼▼',
    declining: '▼',
    stable: '→',
    improving: '▲',
  };
  return (
    <span className={`inline-flex items-center gap-1 text-xs font-semibold ${styles[trend]}`}>
      {arrows[trend]} {Math.abs(slope).toFixed(1)} ml/min/yr
    </span>
  );
}

export function StatCard({ label, value, sub, color = 'gray' }: { label: string; value: string | number; sub?: string; color?: string }) {
  return (
    <div className="bg-white rounded-xl border border-gray-100 p-4 flex flex-col gap-1">
      <p className="text-xs text-gray-500 uppercase tracking-wider">{label}</p>
      <p className={`text-2xl font-semibold text-${color}-600`}>{value}</p>
      {sub && <p className="text-xs text-gray-400">{sub}</p>}
    </div>
  );
}

export function LabRow({ label, value, unit, refRange, flagHigh }: {
  label: string; value: number; unit: string; refRange: string; flagHigh?: boolean;
}) {
  const isAbnormal = flagHigh !== undefined ? flagHigh : false;
  return (
    <div className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
      <div>
        <p className="text-sm font-medium text-gray-700">{label}</p>
        <p className="text-xs text-gray-400">Ref: {refRange}</p>
      </div>
      <span className={`text-sm font-semibold ${isAbnormal ? 'text-red-600' : 'text-gray-800'}`}>
        {value} <span className="text-xs font-normal text-gray-400">{unit}</span>
      </span>
    </div>
  );
}

export function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center p-12">
      <div className="w-8 h-8 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin" />
    </div>
  );
}
