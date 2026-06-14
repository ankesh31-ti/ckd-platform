import { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Plug } from 'lucide-react';
import { Patient } from '../types';
import { PatientAPI, ChatAPI } from '../services/api';

interface Message { role: 'user' | 'assistant'; text: string; isStub?: boolean; }

export default function ClinicalAIChat() {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [selectedId, setSelectedId] = useState<string>('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => { PatientAPI.getAll().then(setPatients); }, []);
  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);

  const selectedPatient = patients.find(p => p.id === selectedId);

  const send = async () => {
    if (!input.trim()) return;
    const userMsg = input.trim();
    setInput('');
    setMessages(m => [...m, { role: 'user', text: userMsg }]);
    setLoading(true);

    try {
      const { reply, isStub } = await ChatAPI.send(userMsg, selectedPatient ? {
        name: selectedPatient.name,
        gStage: selectedPatient.gStage,
        riskLevel: selectedPatient.riskLevel,
        labs: selectedPatient.labs,
        medications: selectedPatient.medications,
        comorbidities: selectedPatient.comorbidities,
      } : undefined);
      setMessages(m => [...m, { role: 'assistant', text: reply, isStub }]);
    } catch {
      setMessages(m => [...m, { role: 'assistant', text: 'Error contacting AI. Check your API connection.' }]);
    }
    setLoading(false);
  };

  return (
    <div className="p-6 max-w-4xl mx-auto h-full flex flex-col">
      <div className="mb-4">
        <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
          <Bot size={28} className="text-blue-600" /> Clinical AI Chat
        </h1>
        <p className="text-gray-500 mt-1">KDIGO Guard — context-aware nephrology clinical decision support.</p>
      </div>

      {/* Stub notice */}
      <div className="flex items-center gap-3 bg-amber-50 border border-amber-200 rounded-xl p-4 mb-4">
        <Plug size={18} className="text-amber-600 flex-shrink-0" />
        <p className="text-sm text-amber-700">
          <strong>AI stub active.</strong> Connect your LLM API key in <code className="bg-amber-100 px-1 rounded">backend/src/server.ts</code> → <code className="bg-amber-100 px-1 rounded">/api/chat</code> route to enable full KDIGO AI responses.
        </p>
      </div>

      {/* Patient context selector */}
      <div className="mb-4">
        <label className="text-sm font-medium text-gray-600 mb-1 block">Patient Context (optional)</label>
        <select
          value={selectedId}
          onChange={e => setSelectedId(e.target.value)}
          className="border border-gray-200 rounded-lg px-3 py-2 text-sm w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">No patient selected — general KDIGO query</option>
          {patients.map(p => (
            <option key={p.id} value={p.id}>{p.name} ({p.id}) — Stage {p.gStage}</option>
          ))}
        </select>
        {selectedPatient && (
          <p className="text-xs text-blue-600 mt-1">
            Context loaded: {selectedPatient.name} | eGFR {[...selectedPatient.labs].sort((a,b) => new Date(b.date).getTime()-new Date(a.date).getTime())[0]?.egfr} | K+ {[...selectedPatient.labs].sort((a,b) => new Date(b.date).getTime()-new Date(a.date).getTime())[0]?.potassium}
          </p>
        )}
      </div>

      {/* Chat window */}
      <div className="flex-1 bg-gray-50 rounded-2xl border border-gray-100 p-4 overflow-y-auto min-h-64 max-h-96 mb-4 space-y-4">
        {messages.length === 0 && (
          <div className="text-center py-10 text-gray-400 text-sm">
            <Bot size={36} className="mx-auto mb-3 opacity-30" />
            <p>Ask a KDIGO clinical question or select a patient for context-aware guidance.</p>
            <div className="mt-4 space-y-2">
              {[
                'What is the KDIGO 2024 recommendation for SGLT2i in CKD?',
                'This patient has K+ 5.8 mEq/L — what are the management options?',
                'When should dialysis preparation begin for Stage G4 patients?',
              ].map(q => (
                <button key={q} onClick={() => setInput(q)} className="block mx-auto text-xs text-blue-500 hover:text-blue-700 hover:underline">
                  "{q}"
                </button>
              ))}
            </div>
          </div>
        )}
        {messages.map((m, i) => (
          <div key={i} className={`flex gap-3 ${m.role === 'user' ? 'flex-row-reverse' : ''}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${m.role === 'user' ? 'bg-blue-600' : 'bg-slate-700'}`}>
              {m.role === 'user' ? <User size={16} className="text-white" /> : <Bot size={16} className="text-white" />}
            </div>
            <div className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm ${m.role === 'user' ? 'bg-blue-600 text-white rounded-tr-none' : 'bg-white border border-gray-100 text-gray-800 rounded-tl-none'}`}>
              {m.text}
              {m.isStub && <p className="text-xs text-amber-500 mt-2 italic">[Stub response — connect LLM to activate]</p>}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex gap-3">
            <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center">
              <Bot size={16} className="text-white" />
            </div>
            <div className="bg-white border border-gray-100 rounded-2xl rounded-tl-none px-4 py-3">
              <div className="flex gap-1">
                {[0,1,2].map(i => <div key={i} className="w-2 h-2 bg-gray-300 rounded-full animate-bounce" style={{ animationDelay: `${i * 150}ms` }} />)}
              </div>
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="flex gap-3">
        <input
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && !e.shiftKey && send()}
          placeholder="Ask a KDIGO clinical question..."
          className="flex-1 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          disabled={loading}
        />
        <button
          onClick={send}
          disabled={loading || !input.trim()}
          className="bg-blue-600 text-white rounded-xl px-5 py-3 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <Send size={18} />
        </button>
      </div>
    </div>
  );
}
