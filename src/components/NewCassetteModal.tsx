import React, { useState, useEffect, useMemo } from 'react';
import {
  X,
  Sparkles,
  Plus,
  Play,
  Save,
  Download,
  Github,
  Code2,
  Eye,
  Layers,
  FileCode,
  Tag,
  Palette,
  Boxes,
  Terminal,
  HelpCircle,
  FileText
} from 'lucide-react';
import { Cassette, CassetteType, GitHubSyncConfig } from '../types';
import { STARTER_TEMPLATES } from '../cassettes/starterTemplates';
import { buildSandboxedHtml } from '../utils/runner';
import { pushCassetteToGitHub } from '../utils/github';
import { downloadCassetteZip } from '../utils/storage';

interface NewCassetteModalProps {
  initialCassette?: Cassette | null;
  githubConfig: GitHubSyncConfig;
  onClose: () => void;
  onSave: (cassette: Cassette) => void;
}

export const NewCassetteModal: React.FC<NewCassetteModalProps> = ({
  initialCassette,
  githubConfig,
  onClose,
  onSave
}) => {
  const isFork = Boolean(initialCassette);

  // Form State
  const [title, setTitle] = useState(
    initialCassette ? `${initialCassette.manifest.title} (Remix)` : ''
  );
  const [id, setId] = useState(
    initialCassette ? `${initialCassette.manifest.id}-remix` : ''
  );
  const [type, setType] = useState<CassetteType>(
    initialCassette ? initialCassette.manifest.type : 'p5'
  );
  const [tagsInput, setTagsInput] = useState(
    initialCassette ? initialCassette.manifest.tags.join(', ') : 'generative, art'
  );
  const [description, setDescription] = useState(
    initialCassette
      ? `Remix of ${initialCassette.manifest.title}`
      : 'Visual generative code experiment.'
  );
  const [code, setCode] = useState(
    initialCassette
      ? initialCassette.code
      : STARTER_TEMPLATES[0].defaultCode
  );

  const [activeTab, setActiveTab] = useState<'editor' | 'preview'>('editor');
  const [isSaving, setIsSaving] = useState(false);
  const [statusMsg, setStatusMsg] = useState<{ type: 'error' | 'success'; text: string } | null>(
    null
  );

  // Auto-generate ID from title if user hasn't manually altered ID
  const [manuallyChangedId, setManuallyChangedId] = useState(false);
  const handleTitleChange = (newTitle: string) => {
    setTitle(newTitle);
    if (!manuallyChangedId && !isFork) {
      const slug = newTitle
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');
      setId(slug || 'untitled-cassette');
    }
  };

  // Switch starter template
  const handleSelectTemplate = (tmplId: string) => {
    const tmpl = STARTER_TEMPLATES.find((t) => t.id === tmplId);
    if (!tmpl) return;
    setType(tmpl.type);
    setCode(tmpl.defaultCode);
    setTagsInput(tmpl.defaultTags.join(', '));
    if (!title) {
      setTitle(tmpl.name);
      handleTitleChange(tmpl.name);
    }
  };

  // Compile sandboxed preview
  const sandboxedSrcDoc = useMemo(() => {
    return buildSandboxedHtml(type, code);
  }, [type, code]);

  const parsedTags = useMemo(() => {
    return tagsInput
      .split(',')
      .map((t) => t.trim().toLowerCase().replace(/[^a-z0-9_-]/g, ''))
      .filter((t) => t.length > 0);
  }, [tagsInput]);

  const constructCassette = (): Cassette => {
    const finalId = id.trim() || 'cassette-' + Date.now();
    return {
      manifest: {
        id: finalId,
        title: title.trim() || 'Untitled Cassette',
        type,
        tags: parsedTags.length > 0 ? parsedTags : ['art', 'experiment'],
        description: description.trim() || 'Visual experiment',
        created: new Date().toISOString().split('T')[0],
        author: 'Artist'
      },
      code,
      isCustom: true
    };
  };

  const handleSaveLocal = () => {
    if (!title.trim()) {
      setStatusMsg({ type: 'error', text: 'Please enter a title for the cassette.' });
      return;
    }
    const newCassette = constructCassette();
    onSave(newCassette);
    onClose();
  };

  const handleSaveGitHub = async () => {
    if (!title.trim()) {
      setStatusMsg({ type: 'error', text: 'Please enter a title for the cassette.' });
      return;
    }
    if (!githubConfig.owner || !githubConfig.repo || !githubConfig.token) {
      setStatusMsg({
        type: 'error',
        text: 'GitHub Sync requires Owner, Repo, and Token in Settings!'
      });
      return;
    }

    setIsSaving(true);
    setStatusMsg(null);
    const newCassette = constructCassette();

    const res = await pushCassetteToGitHub(githubConfig, newCassette);
    setIsSaving(false);
    if (res.success) {
      onSave(newCassette);
      onClose();
    } else {
      setStatusMsg({ type: 'error', text: res.message });
    }
  };

  const handleDownload = () => {
    const newCassette = constructCassette();
    downloadCassetteZip(newCassette);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-2 sm:p-4 md:p-6 animate-fade-in overflow-y-auto">
      <div className="w-full max-w-5xl bg-[#0d0f14] border border-slate-800 rounded-2xl shadow-2xl flex flex-col max-h-[95vh] overflow-hidden my-auto">
        {/* Header */}
        <div className="px-5 py-3.5 bg-[#12151d] border-b border-slate-800 flex items-center justify-between gap-3 flex-shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-600 to-pink-600 flex items-center justify-center text-white">
              <Plus className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">
                {isFork ? 'Remix / Fork Cassette' : 'Create New Art Cassette'}
              </h2>
              <p className="text-xs text-slate-400">
                Add a new creative code visual experiment to your vault
              </p>
            </div>
          </div>

          {/* Tab Switcher (Mobile / Split) */}
          <div className="flex items-center gap-2">
            <div className="flex lg:hidden bg-slate-900 border border-slate-800 rounded-lg p-1">
              <button
                onClick={() => setActiveTab('editor')}
                className={`px-3 py-1 rounded-md text-xs font-medium ${
                  activeTab === 'editor' ? 'bg-violet-600 text-white' : 'text-slate-400'
                }`}
              >
                Code & Form
              </button>
              <button
                onClick={() => setActiveTab('preview')}
                className={`px-3 py-1 rounded-md text-xs font-medium ${
                  activeTab === 'preview' ? 'bg-violet-600 text-white' : 'text-slate-400'
                }`}
              >
                Test Preview
              </button>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-400 hover:text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Status Error/Success Banner */}
        {statusMsg && (
          <div
            className={`px-4 py-2 text-xs font-mono flex items-center justify-between ${
              statusMsg.type === 'error'
                ? 'bg-rose-950/80 text-rose-300 border-b border-rose-800/50'
                : 'bg-emerald-950/80 text-emerald-300 border-b border-emerald-800/50'
            }`}
          >
            <span>{statusMsg.text}</span>
            <button onClick={() => setStatusMsg(null)} className="hover:text-white">
              ✕
            </button>
          </div>
        )}

        {/* Modal Body */}
        <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
          {/* Left: Metadata & Code Form */}
          <div
            className={`flex-1 flex flex-col p-4 sm:p-5 overflow-y-auto space-y-4 ${
              activeTab === 'preview' ? 'hidden lg:flex' : 'flex'
            }`}
          >
            {/* Template Selector Pills (if not forking) */}
            {!isFork && (
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-400 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-violet-400" />
                  Quick Starter Template:
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {STARTER_TEMPLATES.map((tmpl) => (
                    <button
                      key={tmpl.id}
                      type="button"
                      onClick={() => handleSelectTemplate(tmpl.id)}
                      className={`p-2.5 rounded-xl text-left border transition-all ${
                        type === tmpl.type
                          ? 'bg-violet-600/20 border-violet-500/50 text-white shadow-sm'
                          : 'bg-slate-900/80 hover:bg-slate-900 border-slate-800 text-slate-300'
                      }`}
                    >
                      <div className="text-xs font-semibold truncate">{tmpl.name}</div>
                      <div className="text-[10px] text-slate-400 font-mono mt-0.5">{tmpl.type}</div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Inputs Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Title */}
              <div>
                <label className="text-xs font-medium text-slate-300 block mb-1">
                  Title <span className="text-rose-400">*</span>
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => handleTitleChange(e.target.value)}
                  placeholder="e.g. Neon Quantum Wave"
                  className="w-full px-3 py-2 text-xs bg-slate-900 border border-slate-700/80 rounded-xl text-white focus:outline-none focus:border-violet-500"
                />
              </div>

              {/* ID / Folder Name */}
              <div>
                <label className="text-xs font-medium text-slate-300 block mb-1">
                  Folder / ID <span className="text-slate-500 font-mono text-[11px]">(/src/cassettes/...)</span>
                </label>
                <input
                  type="text"
                  value={id}
                  onChange={(e) => {
                    setId(e.target.value);
                    setManuallyChangedId(true);
                  }}
                  placeholder="e.g. neon-quantum-wave"
                  className="w-full px-3 py-2 text-xs font-mono bg-slate-900 border border-slate-700/80 rounded-xl text-violet-300 focus:outline-none focus:border-violet-500"
                />
              </div>

              {/* Type */}
              <div>
                <label className="text-xs font-medium text-slate-300 block mb-1">Engine / Type</label>
                <select
                  value={type}
                  onChange={(e) => setType(e.target.value as CassetteType)}
                  className="w-full px-3 py-2 text-xs bg-slate-900 border border-slate-700/80 rounded-xl text-slate-200 focus:outline-none focus:border-violet-500 cursor-pointer"
                >
                  <option value="p5">p5.js (Processing)</option>
                  <option value="three">Three.js (3D WebGL)</option>
                  <option value="canvas">HTML5 Canvas / Shader</option>
                  <option value="react">React JSX Micro-App</option>
                  <option value="html">Pure HTML / CSS / JS</option>
                </select>
              </div>

              {/* Tags */}
              <div>
                <label className="text-xs font-medium text-slate-300 block mb-1">
                  Tags <span className="text-slate-500 text-[11px]">(comma-separated)</span>
                </label>
                <input
                  type="text"
                  value={tagsInput}
                  onChange={(e) => setTagsInput(e.target.value)}
                  placeholder="generative, particles, cyber"
                  className="w-full px-3 py-2 text-xs bg-slate-900 border border-slate-700/80 rounded-xl text-pink-300 focus:outline-none focus:border-violet-500"
                />
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="text-xs font-medium text-slate-300 block mb-1">Description</label>
              <input
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Brief description of the visual algorithm..."
                className="w-full px-3 py-2 text-xs bg-slate-900 border border-slate-700/80 rounded-xl text-slate-300 focus:outline-none focus:border-violet-500"
              />
            </div>

            {/* Code Input */}
            <div className="flex-1 flex flex-col min-h-[220px]">
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-medium text-slate-300 flex items-center gap-1.5">
                  <Code2 className="w-3.5 h-3.5 text-cyan-400" />
                  Code Content
                </label>
                <span className="text-[11px] font-mono text-slate-500">
                  {code.split('\n').length} lines
                </span>
              </div>
              <textarea
                value={code}
                onChange={(e) => setCode(e.target.value)}
                spellCheck={false}
                placeholder="// Enter your generative code here..."
                className="flex-1 w-full p-3 bg-[#090b10] border border-slate-800 rounded-xl font-mono text-xs text-slate-200 resize-none focus:outline-none focus:border-violet-500 leading-relaxed"
                onKeyDown={(e) => {
                  if (e.key === 'Tab') {
                    e.preventDefault();
                    const target = e.currentTarget;
                    const start = target.selectionStart;
                    const end = target.selectionEnd;
                    const newCode = code.substring(0, start) + '  ' + code.substring(end);
                    setCode(newCode);
                    setTimeout(() => {
                      target.selectionStart = target.selectionEnd = start + 2;
                    }, 0);
                  }
                }}
              />
            </div>
          </div>

          {/* Right: Live Interactive Test Preview */}
          <div
            className={`w-full lg:w-[440px] xl:w-[480px] bg-[#08090d] border-l border-slate-800/80 flex flex-col ${
              activeTab === 'editor' ? 'hidden lg:flex' : 'flex'
            }`}
          >
            <div className="px-4 py-2.5 bg-[#12151d] border-b border-slate-800 flex items-center justify-between text-xs font-mono text-slate-400">
              <span className="flex items-center gap-1.5">
                <Eye className="w-3.5 h-3.5 text-violet-400" />
                Live Test Sandbox
              </span>
              <span className="text-[10px] text-emerald-400 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Active
              </span>
            </div>

            <div className="flex-1 p-3 flex items-center justify-center overflow-hidden bg-dot-grid">
              <div className="w-full h-full bg-[#0a0c10] rounded-xl overflow-hidden shadow-xl border border-slate-800/60">
                <iframe
                  srcDoc={sandboxedSrcDoc}
                  title="Test Preview"
                  sandbox="allow-scripts allow-same-origin"
                  className="w-full h-full border-none"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Modal Actions Footer */}
        <div className="px-5 py-3.5 bg-[#12151d] border-t border-slate-800 flex flex-wrap items-center justify-between gap-3 flex-shrink-0">
          <button
            type="button"
            onClick={handleDownload}
            className="px-3 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-cyan-300 border border-slate-700 text-xs font-medium transition-colors flex items-center gap-1.5"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download ZIP</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-slate-200 text-xs font-medium transition-colors"
            >
              Cancel
            </button>

            {/* Commit to GitHub if token available */}
            {githubConfig.token && (
              <button
                type="button"
                onClick={handleSaveGitHub}
                disabled={isSaving}
                className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-medium shadow-md shadow-emerald-600/30 transition-all flex items-center gap-1.5"
              >
                <Github className="w-3.5 h-3.5" />
                <span>{isSaving ? 'Pushing...' : 'Push to GitHub'}</span>
              </button>
            )}

            {/* Save to Local Library */}
            <button
              type="button"
              onClick={handleSaveLocal}
              className="px-5 py-2 rounded-xl bg-gradient-to-r from-violet-600 to-pink-600 hover:from-violet-500 hover:to-pink-500 text-white text-xs font-bold shadow-md shadow-violet-600/30 transition-all flex items-center gap-1.5 active:scale-95"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Save to Library</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
