import React, { useState, useEffect, useMemo } from 'react';
import {
  Sparkles,
  Plus,
  Layers,
  Heart,
  FolderPlus,
  RefreshCw,
  Search,
  Filter,
  Download,
  Github,
  SlidersHorizontal,
  Compass,
  ArrowRight,
  Boxes,
  Image as ImageIcon,
  Code2
} from 'lucide-react';
import {
  Cassette,
  FilterState,
  GitHubSyncConfig,
  ReferenceItem,
  ProjectItem,
  NavigationTab
} from './types';
import {
  loadAllCassettes,
  saveCassette,
  deleteCassette,
  toggleFavoriteId,
  getFavoriteIds,
  getGitHubConfig,
  saveGitHubConfig,
  downloadAllCassettesZip,
  loadAllReferences,
  saveReference,
  deleteReference,
  loadAllProjects,
  saveProject,
  deleteProject
} from './utils/storage';
import { Header } from './components/Header';
import { FilterBar } from './components/FilterBar';
import { loadLibraryIndex } from './utils/library';
import { CassetteCard } from './components/CassetteCard';
import { CassetteViewerModal } from './components/CassetteViewerModal';
import { NewCassetteModal } from './components/NewCassetteModal';
import { GitHubSettingsModal } from './components/GitHubSettingsModal';
import { MixBasketDrawer } from './components/MixBasketDrawer';
import { MoodboardView } from './components/MoodboardView';
import { AddReferenceModal } from './components/AddReferenceModal';
import { ReferenceDetailModal } from './components/ReferenceDetailModal';
import { GenerateLandingModal } from './components/GenerateLandingModal';
import { GeminiSettingsModal } from './components/GeminiSettingsModal';
import { ProjectsView } from './components/ProjectsView';
import { MobileActionFab } from './components/MobileActionFab';

export default function App() {
  // Navigation
  const [activeTab, setActiveTab] = useState<NavigationTab>('vault');

  // Main Data States
  const [cassettes, setCassettes] = useState<Cassette[]>([]);
  const [references, setReferences] = useState<ReferenceItem[]>([]);
  const [projects, setProjects] = useState<ProjectItem[]>([]);
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [mixList, setMixList] = useState<Cassette[]>([]);
  const [githubConfig, setGithubConfig] = useState<GitHubSyncConfig>({
    owner: '',
    repo: '',
    branch: 'main',
    token: ''
  });

  // Modal / Drawer States for Cassettes
  const [activeViewerCassette, setActiveViewerCassette] = useState<Cassette | null>(null);
  const [isNewModalOpen, setIsNewModalOpen] = useState(false);
  const [forkSourceCassette, setForkSourceCassette] = useState<Cassette | null>(null);
  const [isGitHubSettingsOpen, setIsGitHubSettingsOpen] = useState(false);
  const [isGeminiSettingsOpen, setIsGeminiSettingsOpen] = useState(false);
  const [isMixBasketOpen, setIsMixBasketOpen] = useState(false);

  // Modal States for References & Generation
  const [isAddReferenceOpen, setIsAddReferenceOpen] = useState(false);
  const [activeDetailRef, setActiveDetailRef] = useState<ReferenceItem | null>(null);
  const [generatePageRef, setGeneratePageRef] = useState<ReferenceItem | null>(null);

  // Filters & Search State
  const [filters, setFilters] = useState<FilterState>({
    search: '',
    type: 'all',
    selectedTags: [],
    sortBy: 'newest',
    favoritesOnly: false
  });

  // Initialize on mount
  useEffect(() => {
    const loadedCassettes = loadAllCassettes();
    setCassettes(loadedCassettes);
    // Library cassettes (static files in /public/library) arrive asynchronously
    loadLibraryIndex().then(() => {
      const all = loadAllCassettes();
      setCassettes(all);
      try {
        const savedMix = localStorage.getItem('art_playground_mix_basket_v1');
        if (savedMix) {
          const ids: string[] = JSON.parse(savedMix);
          setMixList(all.filter((c) => ids.includes(c.manifest.id)));
        }
      } catch {}
    });
    setReferences(loadAllReferences());
    setProjects(loadAllProjects());
    setFavorites(getFavoriteIds());
    setGithubConfig(getGitHubConfig());

    // Load saved mix basket if any
    try {
      const savedMix = localStorage.getItem('art_playground_mix_basket_v1');
      if (savedMix) {
        const parsedIds: string[] = JSON.parse(savedMix);
        const matching = loadedCassettes.filter((c) => parsedIds.includes(c.manifest.id));
        setMixList(matching);
      }
    } catch (e) {
      console.error('Failed to load mix basket:', e);
    }
  }, []);

  // Save mix basket updates
  const saveMixState = (newMix: Cassette[]) => {
    setMixList(newMix);
    try {
      const ids = newMix.map((c) => c.manifest.id);
      localStorage.setItem('art_playground_mix_basket_v1', JSON.stringify(ids));
    } catch {}
  };

  // Cassette CRUD
  const handleSaveCassette = (saved: Cassette) => {
    saveCassette(saved);
    const updatedAll = loadAllCassettes();
    setCassettes(updatedAll);
    if (activeViewerCassette?.manifest.id === saved.manifest.id) {
      setActiveViewerCassette(saved);
    }
  };

  const handleDeleteCassette = (id: string) => {
    deleteCassette(id);
    const updatedAll = loadAllCassettes();
    setCassettes(updatedAll);
    saveMixState(mixList.filter((c) => c.manifest.id !== id));
    if (activeViewerCassette?.manifest.id === id) {
      setActiveViewerCassette(null);
    }
  };

  const handleToggleFavorite = (id: string) => {
    toggleFavoriteId(id);
    setFavorites(getFavoriteIds());
    setCassettes(loadAllCassettes());
  };

  const handleToggleMix = (cassette: Cassette) => {
    const exists = mixList.some((c) => c.manifest.id === cassette.manifest.id);
    if (exists) {
      saveMixState(mixList.filter((c) => c.manifest.id !== cassette.manifest.id));
    } else {
      saveMixState([...mixList, cassette]);
    }
  };

  const handleForkCassette = (cassette: Cassette) => {
    setForkSourceCassette(cassette);
    setActiveViewerCassette(null);
    setIsNewModalOpen(true);
  };

  // References CRUD
  const handleSaveReference = (ref: ReferenceItem) => {
    saveReference(ref);
    setReferences(loadAllReferences());
  };

  const handleDeleteReference = (id: string) => {
    deleteReference(id);
    setReferences(loadAllReferences());
    if (activeDetailRef?.id === id) setActiveDetailRef(null);
  };

  // Projects CRUD
  const handleSaveProject = (proj: ProjectItem) => {
    saveProject(proj);
    setProjects(loadAllProjects());
  };

  const handleDeleteProject = (id: string) => {
    deleteProject(id);
    setProjects(loadAllProjects());
  };

  const handleSaveGeneratedPageAsCassette = (newCassette: Cassette) => {
    handleSaveCassette(newCassette);
    setActiveViewerCassette(newCassette);
  };

  const handleSaveGitHubConfig = (cfg: GitHubSyncConfig) => {
    setGithubConfig(cfg);
    saveGitHubConfig(cfg);
  };

  const handleExportAllZip = () => {
    downloadAllCassettesZip(cassettes);
  };

  // Calculate available tags & type counts for Cassette Vault
  const { availableTags, typeCounts } = useMemo(() => {
    const tagCountMap = new Map<string, number>();
    const typeCountMap: Record<string, number> = {};

    for (const c of cassettes) {
      typeCountMap[c.manifest.type] = (typeCountMap[c.manifest.type] || 0) + 1;
      for (const t of c.manifest.tags) {
        tagCountMap.set(t, (tagCountMap.get(t) || 0) + 1);
      }
    }

    const sortedTags = Array.from(tagCountMap.entries())
      .map(([tag, count]) => ({ tag, count }))
      .sort((a, b) => b.count - a.count);

    return { availableTags: sortedTags, typeCounts: typeCountMap };
  }, [cassettes]);

  const availableGroups = useMemo(() => {
    const m = new Map<string, number>();
    for (const c of cassettes) for (const g of c.manifest.groups || []) m.set(g, (m.get(g) || 0) + 1);
    return Array.from(m.entries())
      .map(([group, count]) => ({ group, count }))
      .sort((a, b) => b.count - a.count);
  }, [cassettes]);

  // Filter and sort cassettes
  const filteredCassettes = useMemo(() => {
    return cassettes
      .filter((c) => {
        if (filters.search.trim()) {
          const q = filters.search.toLowerCase().trim();
          const matchTitle = c.manifest.title.toLowerCase().includes(q);
          const matchDesc = c.manifest.description.toLowerCase().includes(q);
          const matchId = c.manifest.id.toLowerCase().includes(q);
          const matchTags = c.manifest.tags.some((t) => t.toLowerCase().includes(q));
          const matchType = c.manifest.type.toLowerCase().includes(q);
          if (!matchTitle && !matchDesc && !matchId && !matchTags && !matchType) {
            return false;
          }
        }

        if (filters.type !== 'all' && c.manifest.type !== filters.type) {
          return false;
        }

        if (filters.selectedTags.length > 0) {
          const hasAllTags = filters.selectedTags.every((st) => c.manifest.tags.includes(st));
          if (!hasAllTags) return false;
        }

        if (filters.selectedGroups && filters.selectedGroups.length > 0) {
          const g = c.manifest.groups || [];
          if (!filters.selectedGroups.some((sg) => g.includes(sg))) return false;
        }

        if (filters.favoritesOnly && !favorites.has(c.manifest.id)) {
          return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (filters.sortBy === 'newest') {
          return (b.manifest.created || '').localeCompare(a.manifest.created || '') || a.manifest.title.localeCompare(b.manifest.title);
        }
        if (filters.sortBy === 'oldest') {
          return (a.manifest.created || '').localeCompare(b.manifest.created || '');
        }
        if (filters.sortBy === 'alphabetical') {
          return a.manifest.title.localeCompare(b.manifest.title);
        }
        if (filters.sortBy === 'type') {
          return a.manifest.type.localeCompare(b.manifest.type);
        }
        return 0;
      });
  }, [cassettes, filters, favorites]);

  return (
    <div className="min-h-screen bg-[#0a0c10] text-slate-100 flex flex-col selection:bg-violet-600 selection:text-white font-sans">
      {/* Top Main Navigation Header */}
      <Header
        activeTab={activeTab}
        onTabChange={setActiveTab}
        cassettesCount={cassettes.length}
        referencesCount={references.length}
        projectsCount={projects.length}
        mixCount={mixList.length}
        githubConfig={githubConfig}
        onOpenNewCassette={() => {
          setForkSourceCassette(null);
          setIsNewModalOpen(true);
        }}
        onOpenNewReference={() => setIsAddReferenceOpen(true)}
        onOpenNewProject={() => {
          setActiveTab('projects');
        }}
        onOpenGitHubSettings={() => setIsGitHubSettingsOpen(true)}
        onOpenGeminiSettings={() => setIsGeminiSettingsOpen(true)}
        onOpenMixBasket={() => setIsMixBasketOpen(true)}
        onExportAllZip={handleExportAllZip}
        searchQuery={filters.search}
        onSearchChange={(q) => setFilters({ ...filters, search: q })}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* VIEW 1: CASSETTES VAULT */}
        {activeTab === 'vault' && (
          <div className="space-y-6">
            {/* Controls & Filter Bar */}
            <FilterBar
              filters={filters}
              onFilterChange={setFilters}
              availableTags={availableTags}
              typeCounts={typeCounts}
              totalCount={cassettes.length}
              availableGroups={availableGroups}
            />

            {/* Gallery Section Header & Count */}
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <h2 className="text-sm sm:text-base font-bold text-slate-200 tracking-tight font-mono flex items-center gap-2">
                  <Compass className="w-4 h-4 text-violet-400" />
                  <span>CASSETTE VAULT</span>
                </h2>
                <span className="text-xs font-mono px-2 py-0.5 rounded-full bg-slate-900 border border-slate-800 text-slate-400">
                  {filteredCassettes.length} of {cassettes.length} experiments
                </span>
              </div>

              <p className="text-xs text-slate-400 hidden sm:block font-mono">
                Hover card to preview · Click to open live studio & AI tools
              </p>
            </div>

            {/* Cassettes Grid */}
            {filteredCassettes.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 sm:gap-6">
                {filteredCassettes.map((cassette) => (
                  <CassetteCard
                    key={cassette.manifest.id}
                    cassette={cassette}
                    isFavorite={favorites.has(cassette.manifest.id)}
                    isInMix={mixList.some((c) => c.manifest.id === cassette.manifest.id)}
                    onSelect={(c) => setActiveViewerCassette(c)}
                    onToggleFavorite={handleToggleFavorite}
                    onToggleMix={handleToggleMix}
                    onTagClick={(tag) => {
                      if (!filters.selectedTags.includes(tag)) {
                        setFilters({ ...filters, selectedTags: [...filters.selectedTags, tag] });
                      }
                    }}
                  />
                ))}
              </div>
            ) : (
              <div className="py-16 px-4 flex flex-col items-center justify-center text-center bg-[#0e1118]/60 border border-slate-800/80 rounded-2xl">
                <div className="w-12 h-12 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-500 mb-3">
                  <Search className="w-6 h-6" />
                </div>
                <h3 className="text-base font-semibold text-slate-200">No matching cassettes found</h3>
                <p className="text-xs text-slate-400 max-w-sm mt-1 mb-4">
                  Try adjusting your search keywords, clearing tag filters, or creating a new visual experiment.
                </p>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() =>
                      setFilters({
                        search: '',
                        type: 'all',
                        selectedTags: [],
                        sortBy: 'newest',
                        favoritesOnly: false
                      })
                    }
                    className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 text-xs font-medium transition-colors"
                  >
                    Reset Filters
                  </button>
                  <button
                    onClick={() => {
                      setForkSourceCassette(null);
                      setIsNewModalOpen(true);
                    }}
                    className="px-4 py-2 rounded-xl bg-violet-600 hover:bg-violet-500 text-white text-xs font-medium transition-all shadow-md shadow-violet-600/30 flex items-center gap-1.5"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Create New Cassette</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* VIEW 2: MOODBOARD & REFERENCES */}
        {activeTab === 'references' && (
          <MoodboardView
            references={references}
            onAddNew={() => setIsAddReferenceOpen(true)}
            onSelectRef={(r) => setActiveDetailRef(r)}
            onGenerateLanding={(r) => setGeneratePageRef(r)}
          />
        )}

        {/* VIEW 3: PROJECTS (SITE ASSEMBLER) */}
        {activeTab === 'projects' && (
          <ProjectsView
            projects={projects}
            cassettes={cassettes}
            references={references}
            onSaveProject={handleSaveProject}
            onDeleteProject={handleDeleteProject}
            onSaveAsCassette={handleSaveGeneratedPageAsCassette}
          />
        )}
      </main>

      {/* Mobile Floating Action Button (FAB) */}
      <MobileActionFab
        onAddCassette={() => {
          setForkSourceCassette(null);
          setIsNewModalOpen(true);
        }}
        onAddReference={() => setIsAddReferenceOpen(true)}
        onNewProject={() => setActiveTab('projects')}
        onOpenAiSettings={() => setIsGeminiSettingsOpen(true)}
      />

      {/* --- ALL MODALS --- */}

      {/* 1. Cassette Studio Viewer & Editor Modal */}
      {activeViewerCassette && (
        <CassetteViewerModal
          cassette={activeViewerCassette}
          githubConfig={githubConfig}
          onClose={() => setActiveViewerCassette(null)}
          onUpdateCassette={handleSaveCassette}
          onDeleteCassette={handleDeleteCassette}
          onForkCassette={handleForkCassette}
        />
      )}

      {/* 2. New / Remix Cassette Modal */}
      {isNewModalOpen && (
        <NewCassetteModal
          initialCassette={forkSourceCassette}
          githubConfig={githubConfig}
          onClose={() => {
            setIsNewModalOpen(false);
            setForkSourceCassette(null);
          }}
          onSave={handleSaveCassette}
        />
      )}

      {/* 3. Add Reference Modal */}
      {isAddReferenceOpen && (
        <AddReferenceModal
          onClose={() => setIsAddReferenceOpen(false)}
          onSave={handleSaveReference}
        />
      )}

      {/* 4. Reference Detail & Tagging Modal */}
      {activeDetailRef && (
        <ReferenceDetailModal
          reference={activeDetailRef}
          onClose={() => setActiveDetailRef(null)}
          onSave={handleSaveReference}
          onDelete={handleDeleteReference}
          onGenerateLanding={(r) => {
            setActiveDetailRef(null);
            setGeneratePageRef(r);
          }}
        />
      )}

      {/* 5. Generate Landing Page from Reference Modal (Gemini AI) */}
      {generatePageRef && (
        <GenerateLandingModal
          reference={generatePageRef}
          onClose={() => setGeneratePageRef(null)}
          onSaveCassette={handleSaveGeneratedPageAsCassette}
        />
      )}

      {/* 6. Gemini AI Settings & Status Modal */}
      {isGeminiSettingsOpen && (
        <GeminiSettingsModal onClose={() => setIsGeminiSettingsOpen(false)} />
      )}

      {/* 7. GitHub Sync Settings Modal */}
      {isGitHubSettingsOpen && (
        <GitHubSettingsModal
          config={githubConfig}
          onClose={() => setIsGitHubSettingsOpen(false)}
          onSaveConfig={handleSaveGitHubConfig}
        />
      )}

      {/* 8. Mix Basket Drawer */}
      <MixBasketDrawer
        isOpen={isMixBasketOpen}
        mixList={mixList}
        onClose={() => setIsMixBasketOpen(false)}
        onRemoveFromMix={(id) => saveMixState(mixList.filter((c) => c.manifest.id !== id))}
        onClearMix={() => saveMixState([])}
        onSelectCassette={(c) => setActiveViewerCassette(c)}
      />
    </div>
  );
}
