import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell, Zap, FlaskConical, TrendingDown, AlertCircle, CheckCheck, Trash2 } from 'lucide-react';
import { Alert } from '../types';
import { AlertAPI } from '../services/api';
import { LoadingSpinner } from '../components/UI';

const typeConfig = {
  RAPID_DETERIORATION: { icon: Zap, color: 'text-red-500', bg: 'bg-red-50', border: 'border-red-200', label: 'Rapid Deterioration' },
  ABNORMAL_LAB: { icon: FlaskConical, color: 'text-orange-500', bg: 'bg-orange-50', border: 'border-orange-200', label: 'Abnormal Lab' },
  RISK_CHANGE: { icon: TrendingDown, color: 'text-amber-500', bg: 'bg-amber-50', border: 'border-amber-200', label: 'Risk Change' },
  CRITICAL_THRESHOLD: { icon: AlertCircle, color: 'text-red-700', bg: 'bg-red-100', border: 'border-red-300', label: 'Critical Threshold' },
};

export default function ClinicalAlerts({ onAlertsChange }: { onAlertsChange?: (count: number) => void }) {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const refresh = () => {
    AlertAPI.getAll().then(data => {
      setAlerts(data);
      onAlertsChange?.(data.filter(a => !a.read).length);
      setLoading(false);
    });
  };

  useEffect(() => { refresh(); }, []);

  const markAllRead = async () => {
    await AlertAPI.markAllRead();
    refresh();
  };

  const dismiss = async (id: string) => {
    await AlertAPI.dismiss(id);
    refresh();
  };

  const markRead = async (id: string) => {
    await AlertAPI.markRead(id);
    refresh();
  };

  if (loading) return <LoadingSpinner />;

  const unread = alerts.filter(a => !a.read);
  const read = alerts.filter(a => a.read);

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <Bell size={28} className="text-blue-600" /> Clinical Alerts
          </h1>
          <p className="text-gray-500 mt-1">Stay updated on significant patient risk changes and lab anomalies.</p>
        </div>
        {unread.length > 0 && (
          <button onClick={markAllRead} className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-800 border border-blue-200 rounded-lg px-4 py-2 transition-colors">
            <CheckCheck size={16} /> Mark All Read
          </button>
        )}
      </div>

      {alerts.length === 0 && (
        <div className="text-center py-16 text-gray-400">
          <Bell size={40} className="mx-auto mb-3 opacity-40" />
          <p className="text-sm">No alerts at this time. All patients are stable.</p>
        </div>
      )}

      {unread.length > 0 && (
        <div className="mb-6">
          <p className="text-xs font-bold uppercase text-gray-400 tracking-wider mb-3">{unread.length} Unread</p>
          <div className="space-y-3">
            {unread.map(alert => {
              const { icon: Icon, color, bg, border, label } = typeConfig[alert.type];
              return (
                <div key={alert.id} className={`flex items-start gap-4 p-4 rounded-xl border-l-4 ${bg} ${border} border`}>
                  <div className={`w-10 h-10 rounded-full ${bg} flex items-center justify-center flex-shrink-0`}>
                    <Icon size={20} className={color} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="font-semibold text-gray-900">{alert.patientName}</p>
                      <span className={`text-xs font-semibold uppercase ${color}`}>• {label}</span>
                    </div>
                    <p className="text-sm text-gray-600">{alert.message}</p>
                    <p className="text-xs text-gray-400 mt-1">{new Date(alert.timestamp).toLocaleString('en-IN')}</p>
                  </div>
                  <div className="flex gap-2 flex-shrink-0">
                    <button
                      onClick={() => { markRead(alert.id); navigate(`/patients/${alert.patientId}`); }}
                      className="bg-slate-900 text-white text-xs font-semibold px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Review Profile
                    </button>
                    <button onClick={() => dismiss(alert.id)} className="text-gray-400 hover:text-red-500 p-2 transition-colors">
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {read.length > 0 && (
        <div>
          <p className="text-xs font-bold uppercase text-gray-400 tracking-wider mb-3">Read</p>
          <div className="space-y-2">
            {read.map(alert => {
              const { icon: Icon, color, label } = typeConfig[alert.type];
              return (
                <div key={alert.id} className="flex items-start gap-4 p-4 rounded-xl border border-gray-100 bg-gray-50 opacity-60">
                  <Icon size={18} className={color} />
                  <div className="flex-1">
                    <span className="font-medium text-gray-700 text-sm mr-2">{alert.patientName}</span>
                    <span className="text-xs text-gray-400">{label} — {alert.message}</span>
                  </div>
                  <button onClick={() => dismiss(alert.id)} className="text-gray-300 hover:text-red-400 transition-colors">
                    <Trash2 size={14} />
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
