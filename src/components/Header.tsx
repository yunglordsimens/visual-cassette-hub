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

  return (
    <header className="sticky top-0 z-30 bg-[#0d0f14]/95 backdrop-blur-md border-b border-slate-800/80 px-3 sm:px-6 lg:px-8 py-3 transition-all">
      <div className="max-w-7xl mx-auto flex flex-col gap-3">
        {/* Top Row: Logo, Search, Settings & Main Actions */}
        <div className="flex items-center justify-between gap-3">
          {/* Brand / Logo */}
          <div
            onClick={() => onTabChange('vault')}
            className="flex items-center gap-2.5 min-w-max cursor-pointer group"
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-violet-600 via-pink-600 to-amber-500 p-[1.5px] shadow-lg shadow-violet-500/20 flex-shrink-0 group-hover:scale-105 transition-transform">
              <div className="w-full h-full bg-[#0d0f14] rounded-[10px] flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-violet-400 animate-pulse" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h1 className="text-sm sm:text-base font-bold tracking-tight text-white font-mono">
                  ART<span className="text-violet-400 font-extrabold">PLAYGROUND</span>
                </h1>
              </div>
              <p className="text-[11px] text-slate-400 hidden sm:block">
                Visual Lab & Generative Studio
              </p>
            </div>
          </div>

          {/* Center Navigation Tabs (Desktop & Tablet) */}
          <nav className="flex items-center bg-slate-900/90 border border-slate-800 rounded-xl p-1 shadow-inner">
            {/* Tab 1: Vault / Cassettes */}
            <button
              onClick={() => onTabChange('vault')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
                activeTab === 'vault'
                  ? 'bg-violet-600 text-white shadow-md shadow-violet-600/30'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Code2 className="w-3.5 h-3.5" />
              <span>Кассеты</span>
              <span
                className={`text-[10px] font-mono px-1.5 py-0.2 rounded-full ${
                  activeTab === 'vault'
                    ? 'bg-violet-800 text-violet-100'
                    : 'bg-slate-800 text-slate-400'
                }`}
              >
                {cassettesCount}
              </span>
            </button>

            {/* Tab 2: Moodboard / References */}
            <button
              onClick={() => onTabChange('references')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
                activeTab === 'references'
                  ? 'bg-pink-600 text-white shadow-md shadow-pink-600/30'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <ImageIcon className="w-3.5 h-3.5" />
              <span>Референсы</span>
              <span
                className={`text-[10px] font-mono px-1.5 py-0.2 rounded-full ${
                  activeTab === 'references'
                    ? 'bg-pink-800 text-pink-100'
                    : 'bg-slate-800 text-slate-400'
                }`}
              >
                {referencesCount}
              </span>
            </button>

            {/* Tab 3: Projects / Assembler */}
            <button
              onClick={() => onTabChange('projects')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
                activeTab === 'projects'
                  ? 'bg-amber-600 text-white shadow-md shadow-amber-600/30'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Boxes className="w-3.5 h-3.5" />
              <span>Проекты</span>
              <span
                className={`text-[10px] font-mono px-1.5 py-0.2 rounded-full ${
                  activeTab === 'projects'
                    ? 'bg-amber-800 text-amber-100'
                    : 'bg-slate-800 text-slate-400'
                }`}
              >
                {projectsCount}
              </span>
            </button>
          </nav>

          {/* Action Controls */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            {/* Gemini AI Settings Button */}
            <button
              onClick={onOpenGeminiSettings}
              title="Gemini AI Configuration & Status"
              className="px-2.5 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-violet-500/30 text-violet-300 text-xs font-medium transition-all flex items-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5 text-violet-400 animate-pulse" />
              <span className="hidden lg:inline">Gemini AI</span>
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
              <span className="hidden xl:inline">Export ZIP</span>
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
      </div>
    </header>
  );
};

