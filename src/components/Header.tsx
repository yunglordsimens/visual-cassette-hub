import React from 'react';
import {
  Sparkles,
  Plus,
  Github,
  Layers,
  Download,
  Settings,
  Search,
  Image as ImageIcon,
  Boxes,
  Code2,
  Wand2
} from 'lucide-react';
import { GitHubSyncConfig, NavigationTab } from '../types';

interface HeaderProps {
  activeTab: NavigationTab;
  onTabChange: (tab: NavigationTab) => void;
  cassettesCount: number;
  referencesCount: number;
  projectsCount: number;
  mixCount: number;
  githubConfig: GitHubSyncConfig;
  onOpenNewCassette: () => void;
  onOpenNewReference: () => void;
  onOpenNewProject: () => void;
  onOpenGitHubSettings: () => void;
  onOpenGeminiSettings: () => void;
  onOpenMixBasket: () => void;
  onExportAllZip: () => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  onTabChange,
  cassettesCount,
  referencesCount,
  projectsCount,
  mixCount,
  githubConfig,
  onOpenNewCassette,
  onOpenNewReference,
  onOpenNewProject,
  onOpenGitHubSettings,
  onOpenGeminiSettings,
  onOpenMixBasket,
  onExportAllZip,
  searchQuery,
  onSearchChange
}) => {
  const isGitHubConfigured = Boolean(githubConfig.owner && githubConfig.repo);

  const TABS: { id: NavigationTab; label: string; icon: React.FC<{ className?: string }>; count: number; on: string; badge: string }[] = [
    { id: 'vault', label: 'Кассеты', icon: Code2, count: cassettesCount, on: 'bg-violet-600 shadow-violet-600/30', badge: 'bg-violet-800 text-violet-100' },
    { id: 'references', label: 'Референсы', icon: ImageIcon, count: referencesCount, on: 'bg-pink-600 shadow-pink-600/30', badge: 'bg-pink-800 text-pink-100' },
    { id: 'projects', label: 'Проекты', icon: Boxes, count: projectsCount, on: 'bg-amber-600 shadow-amber-600/30', badge: 'bg-amber-800 text-amber-100' }
  ];

  const tabs = TABS.map((t) => {
    const Icon = t.icon;
    const active = activeTab === t.id;
    return (
      <button
        key={t.id}
        onClick={() => onTabChange(t.id)}
        className={`min-w-0 px-2 sm:px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center justify-center gap-1.5 whitespace-nowrap ${
          active ? `${t.on} text-white shadow-md` : 'text-slate-400 hover:text-slate-200'
        }`}
      >
        <Icon className="w-3.5 h-3.5 shrink-0 hidden sm:block" />
        <span>{t.label}</span>
        <span className={`hidden sm:inline text-[10px] font-mono px-1.5 rounded-full ${active ? t.badge : 'bg-slate-800 text-slate-400'}`}>{t.count}</span>
      </button>
    );
  });

  return (
    <header className="sticky top-0 z-30 bg-[#0d0f14]/95 backdrop-blur-md border-b border-slate-800/80 px-4 sm:px-6 lg:px-8 py-2.5 sm:py-3 transition-all">
      <div className="max-w-7xl mx-auto flex flex-col gap-2.5">
        {/* Top Row: Logo, Search, Settings & Main Actions */}
        <div className="flex items-center justify-between gap-3">
          {/* Brand / Logo */}
          <div
            onClick={() => onTabChange('vault')}
            className="flex items-center gap-2.5 shrink-0 cursor-pointer group"
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-violet-600 via-pink-600 to-amber-500 p-[1.5px] shadow-lg shadow-violet-500/20 flex-shrink-0 group-hover:scale-105 transition-transform">
              <div className="w-full h-full bg-[#0d0f14] rounded-[10px] flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-violet-400 animate-pulse" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h1 className="text-sm sm:text-base font-bold tracking-tight text-white font-mono whitespace-nowrap">
                  ART<span className="text-violet-400 font-extrabold">PLAYGROUND</span>
                </h1>
              </div>
              <p className="text-[11px] text-slate-400 hidden sm:block whitespace-nowrap">
                Visual Lab & Generative Studio
              </p>
            </div>
          </div>

          {/* Center Navigation Tabs (desktop) */}
          <nav className="hidden lg:flex items-center bg-slate-900/90 border border-slate-800 rounded-xl p-1 shadow-inner">
            {tabs}
          </nav>

          {/* Action Controls */}
          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            {/* Gemini AI Settings Button */}
            <button
              onClick={onOpenGeminiSettings}
              title="Gemini AI Configuration & Status"
              className="px-2.5 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-violet-500/30 text-violet-300 text-xs font-medium transition-all flex items-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5 text-violet-400 animate-pulse" />
              <span className="hidden lg:inline whitespace-nowrap">Gemini AI</span>
            </button>

            {/* GitHub Sync Status */}
            <button
              onClick={onOpenGitHubSettings}
              title={
                isGitHubConfigured
                  ? `Connected to ${githubConfig.owner}/${githubConfig.repo}`
                  : 'Configure GitHub Repository Sync'
              }
              className={`px-2.5 py-1.5 rounded-xl border text-xs font-medium transition-all flex items-center gap-1.5 ${
                isGitHubConfigured
                  ? 'bg-slate-900 border-emerald-500/40 text-emerald-300 hover:bg-slate-800'
                  : 'bg-slate-900 border-slate-700/60 text-slate-400 hover:text-slate-200'
              }`}
            >
              <Github className="w-3.5 h-3.5" />
              <span className="hidden xl:inline">
                {isGitHubConfigured ? `${githubConfig.owner}/${githubConfig.repo}` : 'GitHub'}
              </span>
              <span
                className={`w-1.5 h-1.5 rounded-full ${
                  isGitHubConfigured ? 'bg-emerald-400 animate-pulse' : 'bg-slate-600'
                }`}
              />
            </button>

            {/* Download Full Backup ZIP */}
            <button
              onClick={onExportAllZip}
              title="Export all cassettes, references & projects as ZIP"
              className="hidden sm:flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700/60 text-slate-300 hover:text-white text-xs font-medium transition-all"
            >
              <Download className="w-3.5 h-3.5 text-cyan-400" />
              <span className="hidden xl:inline whitespace-nowrap">Export ZIP</span>
            </button>

            {/* Primary Contextual "+ Add" Button */}
            {activeTab === 'vault' && (
              <button
                onClick={onOpenNewCassette}
                className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-violet-600 to-pink-600 hover:from-violet-500 hover:to-pink-500 text-white font-bold text-xs shadow-md shadow-violet-600/25 transition-all flex items-center gap-1 active:scale-95 whitespace-nowrap"
              >
                <Plus className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">New Cassette</span>
                <span className="sm:hidden">New</span>
              </button>
            )}

            {activeTab === 'references' && (
              <button
                onClick={onOpenNewReference}
                className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-pink-600 to-violet-600 hover:from-pink-500 hover:to-violet-500 text-white font-bold text-xs shadow-md shadow-pink-600/25 transition-all flex items-center gap-1 active:scale-95 whitespace-nowrap"
              >
                <Plus className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Add Reference</span>
                <span className="sm:hidden">Add Ref</span>
              </button>
            )}

            {activeTab === 'projects' && (
              <button
                onClick={onOpenNewProject}
                className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-amber-600 to-pink-600 hover:from-amber-500 hover:to-pink-500 text-white font-bold text-xs shadow-md shadow-amber-600/25 transition-all flex items-center gap-1 active:scale-95 whitespace-nowrap"
              >
                <Plus className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">New Project</span>
                <span className="sm:hidden">Project</span>
              </button>
            )}
          </div>
        </div>

        {/* Navigation Tabs (phones & tablets): full-width segmented control */}
        <nav className="lg:hidden grid grid-cols-3 gap-1 bg-slate-900/90 border border-slate-800 rounded-xl p-1">
          {tabs}
        </nav>
      </div>
    </header>
  );
};

