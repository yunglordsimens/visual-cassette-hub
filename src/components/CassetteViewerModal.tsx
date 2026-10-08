import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  X,
  Play,
  Pause,
  RotateCcw,
  Copy,
  Check,
  Download,
  Github,
  GitFork,
  Trash2,
  ExternalLink,
  Code2,
  Eye,
  Save,
  Sparkles,
  MessageSquare
} from 'lucide-react';
import { Cassette, GitHubSyncConfig } from '../types';
import { buildSandboxedHtml } from '../utils/runner';
import { getCassetteCode, resolveLibraryUrl } from '../utils/library';
import { downloadCassetteZip } from '../utils/storage';
import { pushCassetteToGitHub, getGitHubWebUrl } from '../utils/github';
import { autoTagAsset } from '../utils/gemini';

interface CassetteViewerModalProps {
  cassette: Cassette;
  githubConfig: GitHubSyncConfig;
  onClose: () => void;
  onUpdateCassette: (updated: Cassette) => void;
  onDeleteCassette: (id: string) => void;
  onForkCassette: (cassette: Cassette) => void;
}

export const CassetteViewerModal: React.FC<CassetteViewerModalProps> = ({
  cassette,
  githubConfig,
  onClose,
  onUpdateCassette,
  onDeleteCassette,
  onForkCassette
}) => {
  const [activeTab, setActiveTab] = useState<'preview' | 'code'>('preview');
  const [editedCode, setEditedCode] = useState(cassette.code);
  const [originalCode, setOriginalCode] = useState(cassette.code);
  const [comments, setComments] = useState<string[]>(cassette.manifest.comments || []);
  const [newComment, setNewComment] = useState('');
  const [tags, setTags] = useState<string[]>(cassette.manifest.tags || []);
  const [groups, setGroups] = useState<string[]>(cassette.manifest.groups || []);
  const [isAutoTagging, setIsAutoTagging] = useState(false);
  const [isPlaying, setIsPlaying] = useState(true);
  const [aspectRatio, setAspectRatio] = useState<'fluid' | '16:9' | '1:1' | '9:16'>('fluid');
  const [copied, setCopied] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [syncStatus, setSyncStatus] = useState<{ type: 'idle' | 'success' | 'error'; msg: string }>({
    type: 'idle',
    msg: ''
  });
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [keyCounter, setKeyCounter] = useState(0);

  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    setEditedCode(cassette.code);
    setOriginalCode(cassette.code);
    setComments(cassette.manifest.comments || []);
    setTags(cassette.manifest.tags || []);
    setGroups(cassette.manifest.groups || []);
    setKeyCounter((k) => k + 1);
    if (!cassette.code) {
      let alive = true;
      getCassetteCode(cassette).then((c) => {
        if (!alive) return;
        setOriginalCode(c);
        setEditedCode(c);
      });
      return () => {
        alive = false;
      };
    }
  }, [cassette]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  // Unedited library cassettes run from their prebuilt page
  const previewSrc =
    cassette.manifest.previewUrl && editedCode === originalCode ? resolveLibraryUrl(cassette.manifest.previewUrl) : null;

  const sandboxedSrcDoc = useMemo(() => {
    if (previewSrc) return '';
    return buildSandboxedHtml(cassette.manifest.type, editedCode);
  }, [cassette.manifest.type, editedCode, keyCounter, previewSrc]);

  const handleCopyCode = () => {
    navigator.clipboard.writeText(editedCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleRestart = () => {
    setKeyCounter((k) => k + 1);
  };

  const handleAutoTag = async () => {
    setIsAutoTagging(true);
    const res = await autoTagAsset({
      title: cassette.manifest.title,
      description: cassette.manifest.description,
      comments,
      code: editedCode,
      type: cassette.manifest.type
    });
    setIsAutoTagging(false);

    if (res.success && res.tags) {
      const mergedTags = Array.from(new Set([...tags, ...res.tags]));
      const mergedGroups = res.groups ? Array.from(new Set([...groups, ...res.groups])) : groups;
      setTags(mergedTags);
      setGroups(mergedGroups);

      const updated: Cassette = {
        ...cassette,
        manifest: {
          ...cassette.manifest,
          tags: mergedTags,
          groups: mergedGroups,
          comments
        },
        code: editedCode,
        updatedAt: new Date().toISOString()
      };
      onUpdateCassette(updated);
      setSyncStatus({ type: 'success', msg: 'AI tags and groups updated!' });
      setTimeout(() => setSyncStatus({ type: 'idle', msg: '' }), 3000);
    }
  };

  const handleAddComment = () => {
    if (!newComment.trim()) return;
    const nextComments = [...comments, newComment.trim()];
    setComments(nextComments);
    setNewComment('');

    const updated: Cassette = {
      ...cassette,
      manifest: {
        ...cassette.manifest,
        comments: nextComments,
        tags,
        groups
      },
      code: editedCode,
      updatedAt: new Date().toISOString()
    };
    onUpdateCassette(updated);
  };

  const handleDeleteComment = (idx: number) => {
    const nextComments = comments.filter((_, i) => i !== idx);
    setComments(nextComments);

    const updated: Cassette = {
      ...cassette,
      manifest: {
        ...cassette.manifest,
        comments: nextComments,
        tags,
        groups
      },
      code: editedCode,
      updatedAt: new Date().toISOString()
    };
    onUpdateCassette(updated);
  };

  const handleSaveLocal = () => {
    const updated: Cassette = {
      ...cassette,
      manifest: {
        ...cassette.manifest,
        comments,
        tags,
        groups
      },
      code: editedCode,
      updatedAt: new Date().toISOString()
    };
    onUpdateCassette(updated);
    setSyncStatus({ type: 'success', msg: 'Saved to local library!' });
    setTimeout(() => setSyncStatus({ type: 'idle', msg: '' }), 3000);
  };

  const handlePushGitHub = async () => {
    if (!githubConfig.owner || !githubConfig.repo) {
      setSyncStatus({
        type: 'error',
        msg: 'Please set GitHub Repository in Settings first!'
      });
      return;
    }
    setIsSaving(true);
    setSyncStatus({ type: 'idle', msg: 'Pushing to GitHub...' });

    const currentCassette: Cassette = {
      ...cassette,
      manifest: {
        ...cassette.manifest,
        comments,
        tags,
        groups
      },
      code: editedCode
    };

    const res = await pushCassetteToGitHub(githubConfig, currentCassette);
    setIsSaving(false);
    if (res.success) {
      onUpdateCassette(currentCassette);
      setSyncStatus({ type: 'success', msg: res.message });
    } else {
      setSyncStatus({ type: 'error', msg: res.message });
    }
    setTimeout(() => setSyncStatus({ type: 'idle', msg: '' }), 4000);
  };

  const gitHubWebUrl = getGitHubWebUrl(githubConfig, cassette);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-2 sm:p-4 md:p-6 animate-fade-in">
      <div className="w-full h-full max-w-7xl bg-[#0d0f14] border border-slate-800 rounded-2xl shadow-2xl flex flex-col overflow-hidden">
        {/* Top Studio Header */}
        <div className="px-4 py-3 bg-[#12151d] border-b border-slate-800 flex flex-wrap items-center justify-between gap-3 flex-shrink-0">
          {/* Left info: Title, Type badge, created */}
          <div className="flex items-center gap-2.5 min-w-0">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-medium bg-violet-500/10 border border-violet-500/30 text-violet-300">
              {cassette.manifest.type.toUpperCase()}
            </span>
            <div className="min-w-0">
              <h2 className="text-sm sm:text-base font-bold text-white truncate">
                {cassette.manifest.title}
              </h2>
              <p className="text-[11px] text-slate-400 font-mono hidden sm:block truncate">
                ID: {cassette.manifest.id} · Added: {cassette.manifest.created}
              </p>
            </div>
          </div>

          {/* Center Tabs for Mobile & Tablet */}
          <div className="flex lg:hidden items-center bg-slate-900 border border-slate-800 rounded-lg p-1">
            <button
              onClick={() => setActiveTab('preview')}
              className={`px-3 py-1 rounded-md text-xs font-medium transition-all flex items-center gap-1.5 ${
                activeTab === 'preview'
                  ? 'bg-violet-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Eye className="w-3.5 h-3.5" />
              <span>Preview</span>
            </button>
            <button
              onClick={() => setActiveTab('code')}
              className={`px-3 py-1 rounded-md text-xs font-medium transition-all flex items-center gap-1.5 ${
                activeTab === 'code'
                  ? 'bg-violet-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Code2 className="w-3.5 h-3.5" />
              <span>Code</span>
            </button>
          </div>

          {/* Right Toolbar Actions */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            {/* Auto-tag AI Button */}
            <button
              onClick={handleAutoTag}
              disabled={isAutoTagging}
              title="Auto-tag with Gemini AI"
              className="px-2.5 py-1.5 rounded-lg bg-violet-950/70 hover:bg-violet-900 border border-violet-700/60 text-violet-300 text-xs font-medium transition-all flex items-center gap-1.5"
            >
              <Sparkles className={`w-3.5 h-3.5 ${isAutoTagging ? 'animate-spin' : ''}`} />
              <span className="hidden md:inline">{isAutoTagging ? 'Tagging...' : 'Auto-tag'}</span>
            </button>

            {/* Quick Copy Code */}
            <button
              onClick={handleCopyCode}
              title="Copy code"
              className={`px-2.5 py-1.5 rounded-lg border text-xs font-medium transition-all flex items-center gap-1.5 ${
                copied
                  ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-300'
                  : 'bg-slate-900 hover:bg-slate-800 border-slate-700/60 text-slate-300 hover:text-white'
              }`}
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span className="hidden sm:inline">{copied ? 'Copied' : 'Copy Code'}</span>
            </button>

            {/* Fork / Remix Button */}
            <button
              onClick={() => onForkCassette(cassette)}
              title="Remix / Duplicate into new cassette"
              className="px-2.5 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700/60 text-pink-300 hover:text-pink-200 text-xs font-medium transition-all flex items-center gap-1.5"
            >
              <GitFork className="w-3.5 h-3.5 text-pink-400" />
              <span className="hidden md:inline">Remix</span>
            </button>

            {/* Download ZIP */}
            <button
              onClick={() => downloadCassetteZip(cassette)}
              title="Download Cassette ZIP bundle"
              className="p-1.5 sm:px-2.5 sm:py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700/60 text-cyan-300 hover:text-cyan-200 text-xs font-medium transition-all flex items-center gap-1.5"
            >
              <Download className="w-3.5 h-3.5 text-cyan-400" />
              <span className="hidden md:inline">Export</span>
            </button>

            {/* Edit on GitHub Web Link */}
            <a
              href={gitHubWebUrl}
              target="_blank"
              rel="noopener noreferrer"
              title="Open / Edit directly in GitHub repository"
              className="p-1.5 sm:px-2.5 sm:py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700/60 text-slate-300 hover:text-white text-xs font-medium transition-all flex items-center gap-1.5"
            >
              <Github className="w-3.5 h-3.5" />
              <span className="hidden md:inline">GitHub</span>
              <ExternalLink className="w-3 h-3 text-slate-500" />
            </a>

            {/* Delete Cassette */}
            <button
              onClick={() => setShowDeleteConfirm(true)}
              title="Delete this cassette"
              className="p-1.5 rounded-lg bg-rose-950/30 hover:bg-rose-900/50 border border-rose-800/40 text-rose-300 hover:text-rose-200 text-xs transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>

            {/* Close Modal */}
            <button
              onClick={onClose}
              title="Close viewer (Esc)"
              className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-400 hover:text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Sync / Save Status Banner */}
        {syncStatus.msg && (
          <div
            className={`px-4 py-2 text-xs font-mono flex items-center justify-between ${
              syncStatus.type === 'success'
                ? 'bg-emerald-950/80 text-emerald-300 border-b border-emerald-800/50'
                : 'bg-rose-950/80 text-rose-300 border-b border-rose-800/50'
            }`}
          >
            <span>{syncStatus.msg}</span>
            <button onClick={() => setSyncStatus({ type: 'idle', msg: '' })} className="hover:text-white">
              ✕
            </button>
          </div>
        )}

        {/* Studio Body: Split View (Desktop) or Tab View (Mobile) */}
        <div className="flex-1 flex flex-col lg:flex-row overflow-hidden relative">
          {/* Left Canvas Preview Panel */}
          <div
            className={`flex-1 flex flex-col bg-[#08090d] relative overflow-hidden ${
              activeTab === 'code' ? 'hidden lg:flex' : 'flex'
            }`}
          >
            {/* Top Canvas Controls Bar */}
            <div className="px-3 py-2 bg-[#0e1118]/80 border-b border-slate-800/80 flex items-center justify-between gap-2 text-xs">
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="px-2 py-1 rounded bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-750 flex items-center gap-1 font-mono text-[11px]"
                >
                  {isPlaying ? (
                    <>
                      <Pause className="w-3 h-3 text-amber-400" /> Pause
                    </>
                  ) : (
                    <>
                      <Play className="w-3 h-3 text-emerald-400" /> Play
                    </>
                  )}
                </button>

                <button
                  onClick={handleRestart}
                  title="Reload / Restart canvas simulation"
                  className="px-2 py-1 rounded bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-750 flex items-center gap-1 font-mono text-[11px]"
                >
                  <RotateCcw className="w-3 h-3 text-cyan-400" /> Restart
                </button>
              </div>

              {/* Aspect Ratio Switcher */}
              <div className="flex items-center gap-1 bg-slate-900 border border-slate-800 rounded p-0.5 text-[11px] font-mono">
                {(['fluid', '16:9', '1:1', '9:16'] as const).map((ratio) => (
                  <button
                    key={ratio}
                    onClick={() => setAspectRatio(ratio)}
                    className={`px-2 py-0.5 rounded transition-colors ${
                      aspectRatio === ratio
                        ? 'bg-violet-600 text-white font-medium'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {ratio}
                  </button>
                ))}
              </div>
            </div>

            {/* Sandbox Runner Container */}
            <div className="flex-1 flex items-center justify-center p-2 sm:p-4 overflow-hidden bg-dot-grid">
              <div
                className={`transition-all duration-300 bg-[#0a0c10] rounded-xl overflow-hidden shadow-2xl border border-slate-800/80 ${
                  aspectRatio === 'fluid'
                    ? 'w-full h-full'
                    : aspectRatio === '16:9'
                    ? 'w-full max-w-4xl aspect-[16/9]'
                    : aspectRatio === '1:1'
                    ? 'h-full max-h-[540px] aspect-square'
                    : 'h-full max-h-[580px] aspect-[9/16]'
                }`}
              >
                <iframe
                  key={keyCounter}
                  ref={iframeRef}
                  {...(previewSrc ? { src: previewSrc } : { srcDoc: sandboxedSrcDoc })}
                  title={cassette.manifest.title}
                  sandbox="allow-scripts allow-same-origin"
                  className={`w-full h-full border-none ${
                    isPlaying ? 'opacity-100' : 'opacity-40 grayscale'
                  }`}
                />
              </div>
            </div>

            {/* Tags & Groups Footer */}
            <div className="px-4 py-2.5 bg-[#0e1118]/90 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-2 text-xs">
              <p className="text-slate-400 max-w-xl text-[12px]">{cassette.manifest.description}</p>
              <div className="flex flex-wrap gap-1 items-center">
                {groups.map((g) => (
                  <span
                    key={g}
                    className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-pink-950/60 text-pink-300 border border-pink-700/50"
                  >
                    {g}
                  </span>
                ))}
                {tags.map((t) => (
                  <span
                    key={t}
                    className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-900 text-slate-400 border border-slate-800"
                  >
                    #{t}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Right Code Editor & Comments Panel */}
          <div
            className={`w-full lg:w-[480px] xl:w-[540px] flex flex-col bg-[#10131b] border-l border-slate-800/80 ${
              activeTab === 'preview' ? 'hidden lg:flex' : 'flex'
            }`}
          >
            {/* Code Panel Header */}
            <div className="px-4 py-2.5 bg-[#141822] border-b border-slate-800 flex items-center justify-between gap-2 text-xs font-mono">
              <div className="flex items-center gap-2 text-slate-300">
                <Code2 className="w-4 h-4 text-violet-400" />
                <span>source.{cassette.manifest.type === 'html' ? 'html' : cassette.manifest.type === 'react' ? 'jsx' : 'js'}</span>
                {editedCode !== originalCode && (
                  <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" title="Unsaved edits" />
                )}
              </div>

              <div className="flex items-center gap-1.5">
                {/* Save Local */}
                <button
                  onClick={handleSaveLocal}
                  disabled={editedCode === originalCode}
                  className={`px-2.5 py-1 rounded-md text-xs font-medium transition-all flex items-center gap-1 ${
                    editedCode !== originalCode
                      ? 'bg-violet-600 hover:bg-violet-500 text-white shadow-sm'
                      : 'bg-slate-800 text-slate-500 cursor-not-allowed'
                  }`}
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>Save</span>
                </button>

                {/* Direct Commit to GitHub */}
                {githubConfig.token && (
                  <button
                    onClick={handlePushGitHub}
                    disabled={isSaving}
                    className="px-2.5 py-1 rounded-md bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-medium transition-all flex items-center gap-1"
                  >
                    <Github className="w-3.5 h-3.5" />
                    <span>{isSaving ? 'Pushing...' : 'Push Git'}</span>
                  </button>
                )}
              </div>
            </div>

            {/* Code Textarea Editor */}
            <div className="flex-1 p-3 bg-[#0d0f15] overflow-auto">
              <textarea
                value={editedCode}
                onChange={(e) => setEditedCode(e.target.value)}
                spellCheck={false}
                className="w-full h-full bg-transparent text-slate-200 font-mono text-[12px] leading-relaxed resize-none focus:outline-none placeholder-slate-600 select-text"
                placeholder="// Write or paste your creative code snippet here..."
              />
            </div>

            {/* Comments Drawer in code panel */}
            <div className="p-3 bg-[#12151d] border-t border-slate-800 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-slate-300 flex items-center gap-1">
                  <MessageSquare className="w-3.5 h-3.5 text-pink-400" />
                  Заметки художника ({comments.length})
                </span>
              </div>

              {/* Comments list */}
              {comments.length > 0 && (
                <div className="space-y-1 max-h-24 overflow-y-auto pr-1">
                  {comments.map((c, i) => (
                    <div
                      key={i}
                      className="group p-1.5 rounded-lg bg-slate-900/80 border border-slate-800 text-[11px] text-slate-300 flex items-start justify-between gap-1.5"
                    >
                      <span className="leading-tight">{c}</span>
                      <button
                        onClick={() => handleDeleteComment(i)}
                        className="opacity-0 group-hover:opacity-100 text-slate-500 hover:text-rose-400"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* Add comment row */}
              <div className="flex gap-1.5">
                <input
                  type="text"
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleAddComment()}
                  placeholder="Добавить заметку к кассете..."
                  className="flex-1 px-2.5 py-1 bg-slate-900 border border-slate-700/80 rounded-lg text-white text-xs focus:outline-none focus:border-violet-500"
                />
                <button
                  onClick={handleAddComment}
                  className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium"
                >
                  Add
                </button>
              </div>
            </div>

            {/* Live Update Run Trigger */}
            <div className="p-3 bg-[#141822] border-t border-slate-800 flex items-center justify-between text-xs">
              <span className="text-slate-400 font-mono text-[11px]">
                {editedCode.split('\n').length} lines · {editedCode.length} characters
              </span>
              <button
                onClick={handleRestart}
                className="px-3 py-1.5 rounded-lg bg-violet-600/30 hover:bg-violet-600/50 border border-violet-500/40 text-violet-300 text-xs font-medium flex items-center gap-1.5 transition-colors"
              >
                <Play className="w-3 h-3 text-violet-400" />
                <span>Re-run sandbox</span>
              </button>
            </div>
          </div>
        </div>

        {/* Delete Confirmation Modal */}
        {showDeleteConfirm && (
          <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
            <div className="max-w-md w-full bg-[#161a24] border border-rose-500/40 rounded-2xl p-6 shadow-2xl space-y-4">
              <div className="flex items-center gap-3 text-rose-400">
                <Trash2 className="w-6 h-6" />
                <h3 className="text-base font-bold text-white">Delete Cassette?</h3>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                Are you sure you want to remove <strong>"{cassette.manifest.title}"</strong> ({cassette.manifest.id}) from your art collection?
              </p>
              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    onDeleteCassette(cassette.manifest.id);
                    onClose();
                  }}
                  className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-medium transition-colors shadow-lg shadow-rose-600/30"
                >
                  Delete Permanently
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
