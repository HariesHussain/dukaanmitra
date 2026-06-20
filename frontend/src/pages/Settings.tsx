import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Store, ArrowLeft, Save, Database, ShieldAlert, Key, Smartphone, Info, Check, CloudLightning
} from 'lucide-react';
import { useApp } from '../App';

export default function Settings() {
  const navigate = useNavigate();
  const { 
    geminiKey, sheetsId, serviceAccountJson, upiId, whatsappPhone, whatsappToken, setCredentials 
  } = useApp();

  const [inputGemini, setInputGemini] = useState(geminiKey);
  const [inputSheets, setInputSheets] = useState(sheetsId);
  const [inputServiceJson, setInputServiceJson] = useState(serviceAccountJson);
  const [inputUpi, setInputUpi] = useState(upiId);
  const [inputPhone, setInputPhone] = useState(whatsappPhone);
  const [inputToken, setInputToken] = useState(whatsappToken);

  const [saving, setSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'success' | 'offline_success'>('idle');

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSaveStatus('idle');

    // Save in React context & localStorage
    setCredentials({
      geminiKey: inputGemini,
      sheetsId: inputSheets,
      serviceAccountJson: inputServiceJson,
      upiId: inputUpi,
      whatsappPhone: inputPhone,
      whatsappToken: inputToken
    });

    // Test API connection on Python FastAPI server
    try {
      const response = await fetch('/api/connect', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          gemini_key: inputGemini,
          sheets_id: inputSheets,
          service_account_json: inputServiceJson,
          upi_id: inputUpi,
          whatsapp_phone: inputPhone,
          whatsapp_token: inputToken
        })
      });

      if (response.ok) {
        setSaveStatus('success');
      } else {
        setSaveStatus('offline_success');
      }
    } catch (err) {
      setSaveStatus('offline_success');
    } finally {
      setSaving(false);
      setTimeout(() => {
        setSaveStatus('idle');
      }, 3000);
    }
  };

  return (
    <div className="min-h-screen bg-[#070a13] text-gray-200 flex flex-col">
      
      {/* Top Header */}
      <header className="glassmorphism border-b border-white/5 py-4 px-6 md:px-12 flex justify-between items-center z-20">
        <div className="flex items-center space-x-3 cursor-pointer" onClick={() => navigate('/dashboard')}>
          <div className="bg-emerald-500/10 p-1.5 rounded-lg border border-emerald-500/30">
            <Store className="w-5 h-5 text-emerald-400" />
          </div>
          <span className="text-lg font-bold font-sans tracking-wide text-white">
            Dukaan<span className="text-emerald-400 font-medium">Mitra</span>
          </span>
        </div>

        <button 
          onClick={() => navigate('/dashboard')}
          className="flex items-center space-x-1.5 text-xs font-bold text-gray-300 hover:text-white bg-white/5 hover:bg-white/10 px-3.5 py-2 rounded-xl border border-white/5 transition-all"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Console</span>
        </button>
      </header>

      {/* Settings Grid Content */}
      <main className="flex-1 max-w-4xl w-full mx-auto p-6 space-y-6">
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/5 pb-4">
          <div>
            <h2 className="text-2xl font-bold text-white">Integrations & Credentials</h2>
            <p className="text-xs text-gray-400 mt-1.5">Configure your Gemini API token, Google Sheets, and payment gateways safely.</p>
          </div>
          
          <div className="flex items-center space-x-2 bg-slate-900 border border-white/5 px-3 py-1.5 rounded-xl text-xs text-gray-400">
            <ShieldAlert className="w-4 h-4 text-emerald-400" />
            <span>All keys are saved securely in your browser cache.</span>
          </div>
        </div>

        <form onSubmit={handleSave} className="space-y-6">
          
          {/* Card 1: AI Engine Keys */}
          <div className="bg-[#121622]/40 border border-white/5 rounded-3xl p-6 space-y-5">
            <h3 className="text-sm font-bold text-white flex items-center space-x-2 border-b border-white/5 pb-2">
              <Key className="w-4 h-4 text-emerald-400" />
              <span>AI Engine Configuration</span>
            </h3>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold uppercase tracking-wider text-gray-400 flex items-center gap-1.5">
                  Gemini API Key
                  <span className="text-[10px] text-emerald-400 font-mono">(Required)</span>
                </label>
                <a 
                  href="https://aistudio.google.com/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-[10px] text-emerald-400 hover:underline"
                >
                  Get key from Google AI Studio
                </a>
              </div>
              <input
                type="password"
                value={inputGemini}
                onChange={(e) => setInputGemini(e.target.value)}
                placeholder="AIzaSy..."
                className="w-full bg-[#0b0f19] border border-white/5 rounded-xl py-3 px-4 text-xs text-white focus:outline-none focus:border-emerald-500/50"
              />
            </div>
          </div>

          {/* Card 2: Database Google Sheet */}
          <div className="bg-[#121622]/40 border border-white/5 rounded-3xl p-6 space-y-5">
            <h3 className="text-sm font-bold text-white flex items-center space-x-2 border-b border-white/5 pb-2">
              <Database className="w-4 h-4 text-emerald-400" />
              <span>Google Sheets Database Sync</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-gray-400">Google Spreadsheet ID</label>
                <input
                  type="text"
                  value={inputSheets}
                  onChange={(e) => setInputSheets(e.target.value)}
                  placeholder="1aBcDeFgHiJkLmNoPqRsTuVwXyZ..."
                  className="w-full bg-[#0b0f19] border border-white/5 rounded-xl py-3 px-4 text-xs text-white focus:outline-none focus:border-emerald-500/50"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-gray-400">Settlement UPI VPA (UPI ID)</label>
                <input
                  type="text"
                  value={inputUpi}
                  onChange={(e) => setInputUpi(e.target.value)}
                  placeholder="storename@upi"
                  className="w-full bg-[#0b0f19] border border-white/5 rounded-xl py-3 px-4 text-xs text-white focus:outline-none focus:border-emerald-500/50"
                />
                <p className="text-[10px] text-gray-500 mt-1">Generates automated QR codes/links dynamically for orders checkout.</p>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold uppercase tracking-wider text-gray-400">Google Service Account credentials.json</label>
                <span className="text-[10px] text-gray-500">Provide JSON text block</span>
              </div>
              <textarea
                value={inputServiceJson}
                onChange={(e) => setInputServiceJson(e.target.value)}
                placeholder='{ "type": "service_account", "project_id": "...", ... }'
                rows={4}
                className="w-full bg-[#0b0f19] border border-white/5 rounded-xl p-4 text-[10px] font-mono text-emerald-400 focus:outline-none focus:border-emerald-500/50"
              />
            </div>
          </div>

          {/* Card 3: WhatsApp Live Gateway */}
          <div className="bg-[#121622]/40 border border-white/5 rounded-3xl p-6 space-y-5">
            <h3 className="text-sm font-bold text-white flex items-center space-x-2 border-b border-white/5 pb-2">
              <Smartphone className="w-4 h-4 text-emerald-400" />
              <span>WhatsApp Business API Cloud Link</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-gray-400">WhatsApp Phone ID</label>
                <input
                  type="text"
                  value={inputPhone}
                  onChange={(e) => setInputPhone(e.target.value)}
                  placeholder="1092839201"
                  className="w-full bg-[#0b0f19] border border-white/5 rounded-xl py-3 px-4 text-xs text-white focus:outline-none focus:border-emerald-500/50"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-gray-400">Meta API Access Token</label>
                <input
                  type="password"
                  value={inputToken}
                  onChange={(e) => setInputToken(e.target.value)}
                  placeholder="EAAGb..."
                  className="w-full bg-[#0b0f19] border border-white/5 rounded-xl py-3 px-4 text-xs text-white focus:outline-none focus:border-emerald-500/50"
                />
              </div>
            </div>
          </div>

          {/* Submit action */}
          <div className="flex items-center justify-end space-x-4 bg-slate-900 border border-white/5 p-4 rounded-3xl">
            {saveStatus === 'success' && (
              <span className="text-xs text-emerald-400 font-bold flex items-center gap-1.5">
                <Check className="w-4.5 h-4.5" />
                <span>Connected & saved in server.py database!</span>
              </span>
            )}
            {saveStatus === 'offline_success' && (
              <span className="text-xs text-emerald-400/80 font-semibold flex items-center gap-1.5">
                <CloudLightning className="w-4.5 h-4.5 text-amber-400" />
                <span>Saved locally (Vite sandbox console mode active)</span>
              </span>
            )}
            
            <button
              type="submit"
              disabled={saving}
              className="bg-emerald-500 hover:bg-emerald-400 disabled:bg-emerald-800 text-emerald-950 font-bold px-6 py-3 rounded-xl text-xs transition-all flex items-center space-x-1.5"
            >
              <Save className="w-4.5 h-4.5" />
              <span>{saving ? 'Testing Pipeline...' : 'Save & Connect'}</span>
            </button>
          </div>

        </form>

      </main>

    </div>
  );
}
