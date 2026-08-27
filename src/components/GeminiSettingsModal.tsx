import React, { useState, useEffect } from 'react';
import {
  X,
  Sparkles,
  Key,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  Save,
  Trash2,
  RefreshCw,
  Cpu
} from 'lucide-react';
import { getStoredGeminiApiKey, saveStoredGeminiApiKey } from '../utils/gemini';

interface GeminiSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const GeminiSettingsModal: React.FC<GeminiSettingsModalProps> = ({ isOpen, onClose }) => {
  const [apiKey, setApiKey] = useState('');
  const [hasServerKey, setHasServerKey] = useState(false);
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState<{ success: boolean; msg: string } | null>(null);

  useEffect(() => {
    if (isOpen) {
      setApiKey(getStoredGeminiApiKey());
      checkServerKey();
    }
  }, [isOpen]);

  const checkServerKey = async () => {
    try {
      const res = await fetch('/api/health');
      const data = await res.json();
      setHasServerKey(Boolean(data.hasServerKey));
    } catch {
      setHasServerKey(false);
    }
  };

  if (!isOpen) return null;

  const handleTestKey = async () => {
    setTesting(true);
    setTestResult(null);

    try {
      const res = await fetch('/api/gemini/auto-tag', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: 'Test Creative Sketch',
          description: 'Generative typography with neon shaders',
          comments: ['Test comment'],
          apiKey: apiKey.trim() || undefined
        })
      });

      const data = await res.json();
      setTesting(false);

      if (res.ok && data.success) {
        setTestResult({
          success: true,
          msg: `Gemini API is active! Model generated tags: ${data.tags?.slice(0, 3).join(', ')}`
        });
      } else {
        setTestResult({
          success: false,
          msg: data.error || 'Gemini API test failed. Check key permissions or quota.'
        });
      }
    } catch (err: any) {
      setTesting(false);
      setTestResult({
        success: false,
        msg: `Connection error: ${err.message}`
      });
    }
  };

  const handleSave = () => {
    saveStoredGeminiApiKey(apiKey);
    onClose();
  };

  const handleClear = () => {
    setApiKey('');
    saveStoredGeminiApiKey('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-fade-in">
      <div className="w-full max-w-lg bg-[#0d0f14] border border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-5 py-4 bg-[#12151d] border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-violet-600/20 border border-violet-500/30 text-violet-400">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                Gemini AI Engine
                {hasServerKey && (
                  <span className="px-2 py-0.5 rounded-full bg-emerald-950/80 border border-emerald-700/60 text-emerald-300 text-[10px] font-mono">
                    Cloud Key Connected
                  </span>
                )}
              </h2>
              <p className="text-xs text-slate-400">
                Powers Moodboard landing generation, AI auto-tagging & Project assembly
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <div className="p-5 overflow-y-auto space-y-4 text-xs">
          {/* Server status alert */}
          <div
            className={`p-3 rounded-xl border flex items-start gap-2.5 ${
              hasServerKey
                ? 'bg-emerald-950/30 border-emerald-800/60 text-emerald-200'
                : 'bg-violet-950/20 border-violet-800/40 text-violet-200'
            }`}
          >
            <Cpu className="w-4 h-4 mt-0.5 flex-shrink-0 text-violet-400" />
            <div className="space-y-0.5">
              <p className="font-semibold text-xs text-white">
                {hasServerKey
                  ? 'Server-side Gemini 3.7 Flash is ready'
                  : 'Gemini 3.7 Flash Model Provider'}
              </p>
              <p className="text-[11px] text-slate-400">
                Requests are processed securely through the backend proxy. You can also specify your own personal API key below to override server defaults.
              </p>
            </div>
          </div>

          {/* API Key input */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-slate-300 font-medium flex items-center gap-1.5">
                <Key className="w-3.5 h-3.5 text-violet-400" />
                <span>Custom Gemini API Key (Stored in localStorage)</span>
              </label>
              <a
                href="https://aistudio.google.com/app/apikey"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[11px] text-violet-400 hover:text-violet-300 flex items-center gap-1"
              >
                Get Google AI key <ExternalLink className="w-3 h-3" />
              </a>
            </div>
            <input
              type="password"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="AIzaSy..."
              className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-violet-500 font-mono text-xs"
            />
            <p className="text-[11px] text-slate-500 mt-1">
              Your API key never leaves your browser directly; it is transmitted exclusively over encrypted HTTPS requests.
            </p>
          </div>

          {/* Test connection */}
          <div>
            <button
              type="button"
              onClick={handleTestKey}
              disabled={testing}
              className="w-full py-2 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 font-medium transition-colors flex items-center justify-center gap-2"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${testing ? 'animate-spin text-violet-400' : ''}`} />
              <span>{testing ? 'Testing Gemini AI generation...' : 'Test AI Connection'}</span>
            </button>

            {testResult && (
              <div
                className={`mt-2.5 p-2.5 rounded-xl border text-xs flex items-start gap-2 ${
                  testResult.success
                    ? 'bg-emerald-950/40 border-emerald-800 text-emerald-300'
                    : 'bg-rose-950/40 border-rose-800 text-rose-300'
                }`}
              >
                {testResult.success ? (
                  <CheckCircle2 className="w-4 h-4 flex-shrink-0 mt-0.5 text-emerald-400" />
                ) : (
                  <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5 text-rose-400" />
                )}
                <span>{testResult.msg}</span>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="px-5 py-3.5 bg-[#12151d] border-t border-slate-800 flex items-center justify-between">
          {apiKey ? (
            <button
              type="button"
              onClick={handleClear}
              className="text-xs text-rose-400 hover:text-rose-300 flex items-center gap-1"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Clear custom key</span>
            </button>
          ) : (
            <div />
          )}

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-slate-200 font-medium transition-colors"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="px-5 py-2 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-bold transition-all shadow-md shadow-violet-600/25 flex items-center gap-1.5"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Save</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
