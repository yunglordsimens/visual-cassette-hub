import React, { useState } from 'react';
import {
  X,
  Github,
  Key,
  FolderGit2,
  GitBranch,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  Save,
  HelpCircle,
  ShieldCheck,
  RefreshCw
} from 'lucide-react';
import { GitHubSyncConfig } from '../types';

interface GitHubSettingsModalProps {
  config: GitHubSyncConfig;
  onClose: () => void;
  onSaveConfig: (config: GitHubSyncConfig) => void;
}

export const GitHubSettingsModal: React.FC<GitHubSettingsModalProps> = ({
  config,
  onClose,
  onSaveConfig
}) => {
  const [owner, setOwner] = useState(config.owner || '');
  const [repo, setRepo] = useState(config.repo || '');
  const [branch, setBranch] = useState(config.branch || 'main');
  const [token, setToken] = useState(config.token || '');
  const [autoSync, setAutoSync] = useState(config.autoSync || false);

  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState<{ success: boolean; msg: string } | null>(null);

  const handleTestConnection = async () => {
    if (!owner || !repo) {
      setTestResult({
        success: false,
        msg: 'Please provide both GitHub Owner and Repository name.'
      });
      return;
    }

    setTesting(true);
    setTestResult(null);

    try {
      const headers: Record<string, string> = {
        Accept: 'application/vnd.github.v3+json'
      };
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const res = await fetch(`https://api.github.com/repos/${owner}/${repo}`, { headers });
      setTesting(false);

      if (res.ok) {
        const data = await res.json();
        setTestResult({
          success: true,
          msg: `Connected to "${data.full_name}" (${data.default_branch} branch)!`
        });
      } else {
        const err = await res.json();
        setTestResult({
          success: false,
          msg: `GitHub Error: ${err.message || res.statusText}`
        });
      }
    } catch (e: any) {
      setTesting(false);
      setTestResult({
        success: false,
        msg: `Connection failed: ${e.message}`
      });
    }
  };

  const handleSave = () => {
    const updated: GitHubSyncConfig = {
      owner: owner.trim(),
      repo: repo.trim(),
      branch: branch.trim() || 'main',
      token: token.trim(),
      autoSync
    };
    onSaveConfig(updated);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-fade-in">
      <div className="w-full max-w-lg bg-[#0d0f14] border border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-5 py-4 bg-[#12151d] border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-slate-900 border border-slate-700 text-white">
              <Github className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">GitHub Sync Settings</h2>
              <p className="text-xs text-slate-400">
                Sync cassettes directly with your GitHub repository
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

        {/* Content Form */}
        <div className="p-5 overflow-y-auto space-y-4 text-xs">
          {/* Owner / Username */}
          <div>
            <label className="text-slate-300 font-medium block mb-1">
              GitHub Username or Organization <span className="text-rose-400">*</span>
            </label>
            <input
              type="text"
              value={owner}
              onChange={(e) => setOwner(e.target.value)}
              placeholder="e.g. marushach"
              className="w-full px-3 py-2 bg-slate-900 border border-slate-700/80 rounded-xl text-white focus:outline-none focus:border-violet-500 font-mono"
            />
          </div>

          {/* Repository Name */}
          <div>
            <label className="text-slate-300 font-medium block mb-1">
              Repository Name <span className="text-rose-400">*</span>
            </label>
            <input
              type="text"
              value={repo}
              onChange={(e) => setRepo(e.target.value)}
              placeholder="e.g. personal-art-playground"
              className="w-full px-3 py-2 bg-slate-900 border border-slate-700/80 rounded-xl text-white focus:outline-none focus:border-violet-500 font-mono"
            />
          </div>

          {/* Branch */}
          <div>
            <label className="text-slate-300 font-medium block mb-1">Target Branch</label>
            <input
              type="text"
              value={branch}
              onChange={(e) => setBranch(e.target.value)}
              placeholder="main"
              className="w-full px-3 py-2 bg-slate-900 border border-slate-700/80 rounded-xl text-white focus:outline-none focus:border-violet-500 font-mono"
            />
          </div>

          {/* Token */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-slate-300 font-medium">
                Personal Access Token (PAT) <span className="text-slate-500">(Optional for direct push)</span>
              </label>
              <a
                href="https://github.com/settings/tokens/new?scopes=repo&description=Art+Playground+Sync"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[11px] text-violet-400 hover:text-violet-300 flex items-center gap-1"
              >
                Create token <ExternalLink className="w-3 h-3" />
              </a>
            </div>
            <input
              type="password"
              value={token}
              onChange={(e) => setToken(e.target.value)}
              placeholder="ghp_xxxxxxxxxxxxxxxxxxxx"
              className="w-full px-3 py-2 bg-slate-900 border border-slate-700/80 rounded-xl text-white focus:outline-none focus:border-violet-500 font-mono"
            />
            <p className="text-[11px] text-slate-500 mt-1">
              Stored exclusively in your local browser storage. Allows creating and committing cassettes directly from your phone or browser!
            </p>
          </div>

          {/* Test Connection Button & Result */}
          <div className="pt-2">
            <button
              type="button"
              onClick={handleTestConnection}
              disabled={testing}
              className="w-full py-2 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 font-medium transition-colors flex items-center justify-center gap-2"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${testing ? 'animate-spin text-violet-400' : ''}`} />
              <span>{testing ? 'Testing connection...' : 'Test GitHub Connection'}</span>
            </button>

            {testResult && (
              <div
                className={`mt-2.5 p-2.5 rounded-xl border text-xs font-mono flex items-start gap-2 ${
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

          {/* Info Card */}
          <div className="p-3 bg-slate-900/60 rounded-xl border border-slate-800 space-y-1.5 text-slate-400 text-[11px]">
            <div className="font-semibold text-slate-300 flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              Zero-Setup Fallback
            </div>
            <p>
              Even without a token, you can always click <strong>"Edit on GitHub Web"</strong> or <strong>"Export ZIP"</strong> to add and update cassettes directly into your repository.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="px-5 py-3.5 bg-[#12151d] border-t border-slate-800 flex items-center justify-end gap-2">
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
            <span>Save Settings</span>
          </button>
        </div>
      </div>
    </div>
  );
};
