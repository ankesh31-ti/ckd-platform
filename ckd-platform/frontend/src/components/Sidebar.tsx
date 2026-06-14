import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Bell, MessageSquare, ScanLine, User, Activity } from 'lucide-react';

const links = [
  { to: '/', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/alerts', icon: Bell, label: 'Clinical Alerts' },
  { to: '/chat', icon: MessageSquare, label: 'Clinical AI Chat' },
  { to: '/lab-digitizer', icon: ScanLine, label: 'Lab Digitizer' },
  { to: '/portal', icon: User, label: 'Patient Portal' },
];

export default function Sidebar({ unreadCount }: { unreadCount: number }) {
  return (
    <aside className="w-60 min-h-screen bg-slate-900 text-white flex flex-col">
      <div className="p-5 border-b border-slate-700">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-blue-600 rounded-lg flex items-center justify-center font-bold text-sm">CK</div>
          <div>
            <p className="font-semibold text-sm">PREDICTIVE</p>
            <p className="text-xs text-slate-400">CARE PLATFORM</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 p-3 space-y-1 mt-2">
        {links.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${
                isActive ? 'bg-blue-600 text-white font-medium' : 'text-slate-400 hover:bg-slate-800 hover:text-white'
              }`
            }
          >
            <Icon size={18} />
            <span>{label}</span>
            {label === 'Clinical Alerts' && unreadCount > 0 && (
              <span className="ml-auto bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
          </NavLink>
        ))}
      </nav>

      <div className="p-4 border-t border-slate-700">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-blue-800 rounded-full flex items-center justify-center text-sm font-semibold">I</div>
          <div>
            <p className="text-sm font-medium">Dr. Ishan</p>
            <p className="text-xs text-slate-400">Lead Nephrologist</p>
          </div>
        </div>
        <div className="mt-3 flex items-center gap-2">
          <Activity size={12} className="text-green-400" />
          <span className="text-xs text-slate-400">System Status: Optimal</span>
        </div>
      </div>
    </aside>
  );
}
