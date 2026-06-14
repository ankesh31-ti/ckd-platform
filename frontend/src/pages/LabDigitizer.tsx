import { useState, useRef } from 'react';
import { ScanLine, Upload, FileImage, Plug, CheckCircle2 } from 'lucide-react';
import { LabDigitizerAPI } from '../services/api';

export default function LabDigitizer() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [result, setResult] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = (f: File) => {
    setFile(f);
    const url = URL.createObjectURL(f);
    setPreview(url);
    setResult(null);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const f = e.dataTransfer.files[0];
    if (f) handleFile(f);
  };

  const handleUpload = async () => {
    if (!file) return;
    setLoading(true);
    try {
      const res = await LabDigitizerAPI.upload(file);
      setResult(res.message);
    } catch {
      setResult('Error uploading file. Check backend connection.');
    }
    setLoading(false);
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
          <ScanLine size={28} className="text-blue-600" /> Lab Digitizer
        </h1>
        <p className="text-gray-500 mt-1">Upload a printed lab report — extract structured values automatically via Vision AI.</p>
      </div>

      {/* Stub notice */}
      <div className="flex items-center gap-3 bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6">
        <Plug size={18} className="text-amber-600 flex-shrink-0" />
        <p className="text-sm text-amber-700">
          <strong>Vision API stub active.</strong> Connect Claude Vision or Google Vision API in <code className="bg-amber-100 px-1 rounded">backend/src/server.ts</code> → <code className="bg-amber-100 px-1 rounded">/api/lab-digitizer</code> to enable OCR extraction.
        </p>
      </div>

      {/* Steps */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        {[
          { step: '01', title: 'Upload lab report', desc: 'Photo or scanned PDF of printed lab report' },
          { step: '02', title: 'Vision AI extracts values', desc: 'OCR reads eGFR, creatinine, UACR, electrolytes' },
          { step: '03', title: 'Auto-fill patient record', desc: 'Structured data added to patient timeline' },
        ].map(({ step, title, desc }) => (
          <div key={step} className="bg-white rounded-xl border border-gray-100 p-4">
            <p className="text-3xl font-bold text-blue-100 mb-1">{step}</p>
            <p className="font-semibold text-sm text-gray-800">{title}</p>
            <p className="text-xs text-gray-400 mt-1">{desc}</p>
          </div>
        ))}
      </div>

      {/* Upload area */}
      <div
        onClick={() => inputRef.current?.click()}
        onDrop={handleDrop}
        onDragOver={e => e.preventDefault()}
        className="border-2 border-dashed border-gray-200 rounded-2xl p-10 text-center cursor-pointer hover:border-blue-400 hover:bg-blue-50/30 transition-colors mb-6"
      >
        {preview ? (
          <div className="space-y-3">
            <img src={preview} alt="Lab report preview" className="max-h-48 mx-auto rounded-lg object-contain" />
            <p className="text-sm text-gray-600 flex items-center justify-center gap-2">
              <FileImage size={16} /> {file?.name}
            </p>
          </div>
        ) : (
          <>
            <Upload size={40} className="mx-auto text-gray-300 mb-3" />
            <p className="text-gray-500 text-sm">Drag & drop lab report image or <span className="text-blue-600 underline">browse file</span></p>
            <p className="text-xs text-gray-400 mt-1">Supports JPG, PNG, PDF</p>
          </>
        )}
        <input
          ref={inputRef}
          type="file"
          accept="image/*,.pdf"
          className="hidden"
          onChange={e => e.target.files?.[0] && handleFile(e.target.files[0])}
        />
      </div>

      {file && (
        <button
          onClick={handleUpload}
          disabled={loading}
          className="w-full bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-700 disabled:opacity-50 transition-colors flex items-center justify-center gap-2"
        >
          {loading ? (
            <><div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" /> Processing...</>
          ) : (
            <><ScanLine size={18} /> Digitize Lab Report</>
          )}
        </button>
      )}

      {result && (
        <div className="mt-4 flex items-start gap-3 bg-green-50 border border-green-200 rounded-xl p-4">
          <CheckCircle2 size={20} className="text-green-600 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-green-700">{result}</p>
        </div>
      )}
    </div>
  );
}
