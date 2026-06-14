import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import PatientDetail from './pages/PatientDetail';
import ClinicalAlerts from './pages/ClinicalAlerts';
import ClinicalAIChat from './pages/ClinicalAIChat';
import LabDigitizer from './pages/LabDigitizer';
import PatientPortal from './pages/PatientPortal';
import DataEntry from './pages/DataEntry';
import { AlertAPI } from './services/api';

export default function App() {
  const [unreadAlerts, setUnreadAlerts] = useState(0);

  useEffect(() => {
    AlertAPI.getAll().then(alerts => setUnreadAlerts(alerts.filter(a => !a.read).length));
  }, []);

  return (
    <BrowserRouter>
      <div className="flex min-h-screen bg-gray-50 font-sans">
        <Sidebar unreadCount={unreadAlerts} />
        <main className="flex-1 overflow-auto">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/patients/:id" element={<PatientDetail />} />
            <Route path="/data-entry" element={<DataEntry />} />
            <Route path="/alerts" element={<ClinicalAlerts onAlertsChange={setUnreadAlerts} />} />
            <Route path="/chat" element={<ClinicalAIChat />} />
            <Route path="/lab-digitizer" element={<LabDigitizer />} />
            <Route path="/portal" element={<PatientPortal />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}
