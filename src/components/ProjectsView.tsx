import React, { useState, useMemo } from 'react';
import { withCode } from '../utils/library';
import {
  Plus,
  Layers,
  Sparkles,
  Play,
  RotateCcw,
  Save,
  Check,
  Trash2,
  Eye,
  Code2,
  Search,
  ArrowRight,
  Boxes,
  Palette,
  Image as ImageIcon,
  Copy,
  AlertCircle,
  ExternalLink,
  ChevronRight,
  GripVertical,
  Wand2
} from 'lucide-react';
import { ProjectItem, Cassette, ReferenceItem } from '../types';
import { assembleProject } from '../utils/gemini';
import { buildSandboxedHtml } from '../utils/runner';

interface ProjectsViewProps {
  projects: ProjectItem[];
  cassettes: Cassette[];
  references: ReferenceItem[];
  onSaveProject: (project: ProjectItem) => void;
  onDeleteProject: (id: string) => void;
  onSaveAsCassette: (newCassette: Cassette) => void;
}

export const ProjectsView: React.FC<ProjectsViewProps> = ({
  projects,
  cassettes,
  references,
  onSaveProject,
  onDeleteProject,
  onSaveAsCassette
}) => {
  const [activeProject, setActiveProject] = useState<ProjectItem | null>(
    projects.length > 0 ? projects[0] : null
  );

  // Builder State for active project
  const [projectTitle, setProjectTitle] = useState('');
  const [projectDescription, setProjectDescription] = useState('');
  const [visionPrompt, setVisionPrompt] = useState('');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [assembledCode, setAssembledCode] = useState<string>('');
  const [isAssembling, setIsAssembling] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [previewTab, setPreviewTab] = useState<'preview' | 'code'>('preview');
  const [copied, setCopied] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [leftSearch, setLeftSearch] = useState('');
  const [leftTypeFilter, setLeftTypeFilter] = useState<'all' | 'cassettes' | 'references'>('all');

  // Load project into builder
  const loadProjectToBuilder = (p: ProjectItem) => {
    setActiveProject(p);
    setProjectTitle(p.title);
    setProjectDescription(p.description);
    setVisionPrompt(
      p.siteVisionPrompt ||
        'Harmoniously combine the visual animations, shader effects, typography, color palette, and layout structure from all selected elements into a single responsive, interactive web page.'
    );
    setSelectedIds(p.selectedElementIds || []);
    setAssembledCode(p.assembledCode || '');
    setErrorMsg('');
  };

  // When activeProject changes or mounted
  React.useEffect(() => {
    if (activeProject) {
      loadProjectToBuilder(activeProject);
    }
  }, [activeProject?.id]);

  // Create new blank project
  const handleCreateNewProject = () => {
    const newP: ProjectItem = {
      id: `proj-${Date.now().toString(36)}`,
      title: 'New Creative Web Project',
      description: 'Unified project synthesized from selected creative code cassettes and moodboard references.',
      siteVisionPrompt: 'Combine selected visual effects, typography, and interactive components into a complete responsive site with hero, showcase and footer.',
      selectedElementIds: cassettes.slice(0, 2).map((c) => c.manifest.id),
      tags: ['project', 'custom'],
      groups: ['Структура', 'Интерактив'],
      created: new Date().toISOString().split('T')[0]
    };
    onSaveProject(newP);
    setActiveProject(newP);
  };

  // Lookup for cassettes and references
  const cassetteMap = useMemo(() => new Map(cassettes.map((c) => [c.manifest.id, c])), [cassettes]);
  const referenceMap = useMemo(() => new Map(references.map((r) => [r.id, r])), [references]);

  // Available library elements to pick from (Left Column)
  const availableItems = useMemo(() => {
    const results: Array<{
      id: string;
      title: string;
      kind: 'cassette' | 'reference';
      type?: string;
      tags: string[];
      preview?: string;
    }> = [];

    if (leftTypeFilter === 'all' || leftTypeFilter === 'cassettes') {
      for (const c of cassettes) {
        results.push({
          id: c.manifest.id,
          title: c.manifest.title,
          kind: 'cassette',
          type: c.manifest.type,
          tags: c.manifest.tags || []
        });
      }
    }

    if (leftTypeFilter === 'all' || leftTypeFilter === 'references') {
      for (const r of references) {
        results.push({
          id: r.id,
          title: r.title,
          kind: 'reference',
          type: 'moodboard',
          tags: r.tags || [],
          preview: r.image
        });
      }
    }

    if (!leftSearch.trim()) return results;
    const q = leftSearch.toLowerCase();
    return results.filter(
      (item) =>
        item.title.toLowerCase().includes(q) ||
        item.tags.some((t) => t.toLowerCase().includes(q))
    );
  }, [cassettes, references, leftTypeFilter, leftSearch]);

  // Selected elements in current project (Right Column)
  const selectedElements = useMemo(() => {
    return selectedIds
      .map((id) => {
        if (cassetteMap.has(id)) {
          const c = cassetteMap.get(id)!;
          return {
            id: c.manifest.id,
            title: c.manifest.title,
            kind: 'cassette' as const,
            type: c.manifest.type,
            tags: c.manifest.tags || [],
            comments: c.manifest.comments || [],
            code: c.code,
            description: c.manifest.description
          };
        }
        if (referenceMap.has(id)) {
          const r = referenceMap.get(id)!;
          return {
            id: r.id,
            title: r.title,
            kind: 'reference' as const,
            type: 'moodboard',
            tags: r.tags || [],
            comments: r.comments || [],
            preview: r.image,
            description: r.description || r.title
          };
        }
        return null;
      })
      .filter(Boolean) as Array<{
      id: string;
      title: string;
      kind: 'cassette' | 'reference';
      type: string;
      tags: string[];
      comments: string[];
      code?: string;
      preview?: string;
      description?: string;
    }>;
  }, [selectedIds, cassetteMap, referenceMap]);

  const toggleSelectId = (id: string) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter((item) => item !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };

  const removeSelectedId = (id: string) => {
    setSelectedIds(selectedIds.filter((item) => item !== id));
  };

  const handleAssemble = async () => {
    if (selectedElements.length === 0) {
      setErrorMsg('Please select at least 1 cassette or reference from the library.');
      return;
    }

    setIsAssembling(true);
    setErrorMsg('');

    const codeById = new Map(
      (await withCode(selectedElements.filter((e) => e.kind === 'cassette').map((e) => cassetteMap.get(e.id)!))).map(
        (c) => [c.manifest.id, c.code] as const
      )
    );
    const res = await assembleProject({
      projectName: projectTitle,
      description: projectDescription,
      prompt: visionPrompt,
      items: selectedElements.map((item) => ({
        id: item.id,
        title: item.title,
        kind: item.kind,
        type: item.type,
        code: codeById.get(item.id) ?? item.code,
        comments: item.comments,
        tags: item.tags,
        description: item.description
      }))
    });

    setIsAssembling(false);

    if (res.success && res.html) {
      setAssembledCode(res.html);
      setPreviewTab('preview');

      // Auto-save project state
      if (activeProject) {
        const updated: ProjectItem = {
          ...activeProject,
          title: projectTitle,
          description: projectDescription,
          siteVisionPrompt: visionPrompt,
          selectedElementIds: selectedIds,
          assembledCode: res.html
        };
        onSaveProject(updated);
      }
    } else {
      setErrorMsg(res.error || 'Failed to assemble project. Please check Gemini API connection.');
    }
  };

  const handleSaveProjectDetails = () => {
    if (!activeProject) return;
    const updated: ProjectItem = {
      ...activeProject,
      title: projectTitle,
      description: projectDescription,
      siteVisionPrompt: visionPrompt,
      selectedElementIds: selectedIds,
      assembledCode
    };
    onSaveProject(updated);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2000);
  };

  const handleSaveAsCassette = () => {
    if (!assembledCode) return;

    const newId = `project-site-${Date.now().toString(36)}`;
    const newCassette: Cassette = {
      manifest: {
        id: newId,
        title: `${projectTitle} // Assembled Site`,
        type: 'html',
        description: `Unified assembled site from project «${projectTitle}» combining ${selectedElements.length} components with Gemini AI synthesis.`,
        tags: ['project', 'assembled', 'gemini-ai', 'multi-component'],
        groups: ['Структура', 'Интерактив', '3D / WebGL'],
        comments: [
          `Собрано из элементов: ${selectedElements.map((e) => e.title).join(', ')}`,
          `Видение: ${visionPrompt}`
        ],
        created: new Date().toISOString().split('T')[0],
        author: 'Project Builder'
      },
      code: assembledCode,
      isCustom: true
    };

    onSaveAsCassette(newCassette);
    alert(`Saved «${newCassette.manifest.title}» to your Cassettes Vault!`);
  };

  const sandboxedSrcDoc = buildSandboxedHtml('html', assembledCode);

  return (
    <div className="space-y-6">
      {/* Top Project Selector & Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 bg-[#0d0f14] border border-slate-800/80 rounded-2xl p-4 sm:p-5 shadow-xl">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-violet-600/20 border border-violet-500/30 text-violet-400">
            <Boxes className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              Projects & Site Synthesis
              <span className="text-xs font-mono font-normal px-2 py-0.5 rounded-full bg-slate-800 text-slate-300">
                {projects.length} projects
              </span>
            </h2>
            <p className="text-xs text-slate-400">
              Combine creative code cassettes & moodboard references into unified interactive websites
            </p>
          </div>
        </div>

        {/* Project Selector Pills & + New Project */}
        <div className="flex items-center gap-2 flex-wrap">
          {projects.map((p) => {
            const isActive = activeProject?.id === p.id;
            return (
              <button
                key={p.id}
                onClick={() => loadProjectToBuilder(p)}
                className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
                  isActive
                    ? 'bg-violet-600 text-white shadow-md shadow-violet-600/30 font-bold'
                    : 'bg-slate-900 border border-slate-800 text-slate-300 hover:border-slate-700 hover:text-white'
                }`}
              >
                {p.title}
              </button>
            );
          })}

          <button
            onClick={handleCreateNewProject}
            className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-violet-600 to-pink-600 hover:from-violet-500 hover:to-pink-500 text-white font-bold text-xs shadow-md shadow-violet-600/25 transition-all flex items-center gap-1 active:scale-95"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>New Project</span>
          </button>
        </div>
      </div>

      {/* Main Two-Column Project Builder Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column (5 cols): Library Source Selector & Assembly Prompt */}
        <div className="lg:col-span-5 space-y-4">
          {/* Project Settings Box */}
          <div className="bg-[#0d0f14] border border-slate-800 rounded-2xl p-4 space-y-3 shadow-lg">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-white flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-violet-400" />
                Project Specification
              </span>
              {activeProject && (
                <button
                  onClick={handleSaveProjectDetails}
                  className="text-xs text-violet-400 hover:text-violet-300 flex items-center gap-1"
                >
                  {savedSuccess ? <Check className="w-3 h-3 text-emerald-400" /> : <Save className="w-3 h-3" />}
                  <span>{savedSuccess ? 'Saved' : 'Save Project'}</span>
                </button>
              )}
            </div>

            <input
              type="text"
              value={projectTitle}
              onChange={(e) => setProjectTitle(e.target.value)}
              placeholder="Project Name..."
              className="w-full px-3 py-1.5 bg-slate-900 border border-slate-700/80 rounded-xl text-white text-xs font-bold focus:outline-none focus:border-violet-500"
            />

            <div>
              <label className="text-[11px] font-semibold text-slate-300 block mb-1">
                Описание желаемого сайта (Site Vision & AI Assembly Prompt):
              </label>
              <textarea
                rows={3}
                value={visionPrompt}
                onChange={(e) => setVisionPrompt(e.target.value)}
                placeholder="Опиши, как объединить выбранные элементы (например: частицы на фоне Hero, 3D кристалл в секции О нас, неоновая цветовая палитра из референса)..."
                className="w-full px-3 py-2 bg-slate-900 border border-slate-700/80 rounded-xl text-white text-xs resize-none focus:outline-none focus:border-violet-500"
              />
            </div>
          </div>

          {/* Two-Column Element Picker: Available Library vs. Selected in Project */}
          <div className="bg-[#0d0f14] border border-slate-800 rounded-2xl p-4 shadow-lg space-y-3">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <span className="text-xs font-bold text-white flex items-center gap-1.5">
                <Boxes className="w-3.5 h-3.5 text-pink-400" />
                Selected Elements ({selectedElements.length})
              </span>
              <span className="text-[10px] text-slate-400 font-mono">
                Click + below to add items
              </span>
            </div>

            {/* Selected elements list */}
            {selectedElements.length > 0 ? (
              <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                {selectedElements.map((item, idx) => (
                  <div
                    key={item.id}
                    className="p-2 rounded-xl bg-slate-900/90 border border-slate-800 flex items-center justify-between gap-2 text-xs"
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="w-5 h-5 rounded-full bg-violet-600/20 border border-violet-500/30 text-violet-400 font-mono text-[10px] flex items-center justify-center flex-shrink-0">
                        {idx + 1}
                      </span>
                      <div className="min-w-0">
                        <p className="font-semibold text-white truncate text-xs">{item.title}</p>
                        <p className="text-[10px] text-slate-400 font-mono">
                          {item.kind === 'cassette' ? `Cassette // ${item.type}` : 'Moodboard Reference'}
                        </p>
                      </div>
                    </div>

                    <button
                      onClick={() => removeSelectedId(item.id)}
                      className="p-1 rounded text-slate-500 hover:text-rose-400 transition-colors"
                      title="Remove from project"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-6 text-center text-slate-500 text-xs border border-dashed border-slate-800 rounded-xl">
                No elements selected yet. Choose cassettes and references from library below.
              </div>
            )}

            {/* Library Selector */}
            <div className="pt-2 border-t border-slate-800 space-y-2">
              <div className="flex items-center justify-between gap-2">
                <span className="text-[11px] font-semibold text-slate-300">
                  Add from Vault & Moodboard:
                </span>
                <div className="flex items-center gap-1 bg-slate-900 p-0.5 rounded-lg border border-slate-800">
                  <button
                    onClick={() => setLeftTypeFilter('all')}
                    className={`px-2 py-0.5 rounded text-[10px] font-medium ${
                      leftTypeFilter === 'all' ? 'bg-violet-600 text-white' : 'text-slate-400'
                    }`}
                  >
                    All
                  </button>
                  <button
                    onClick={() => setLeftTypeFilter('cassettes')}
                    className={`px-2 py-0.5 rounded text-[10px] font-medium ${
                      leftTypeFilter === 'cassettes' ? 'bg-violet-600 text-white' : 'text-slate-400'
                    }`}
                  >
                    Cassettes
                  </button>
                  <button
                    onClick={() => setLeftTypeFilter('references')}
                    className={`px-2 py-0.5 rounded text-[10px] font-medium ${
                      leftTypeFilter === 'references' ? 'bg-violet-600 text-white' : 'text-slate-400'
                    }`}
                  >
                    Moodboard
                  </button>
                </div>
              </div>

              {/* Search */}
              <div className="relative">
                <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={leftSearch}
                  onChange={(e) => setLeftSearch(e.target.value)}
                  placeholder="Filter available items..."
                  className="w-full pl-8 pr-3 py-1.5 bg-slate-900 border border-slate-800 rounded-lg text-white text-xs focus:border-violet-500 focus:outline-none"
                />
              </div>

              {/* List of library items */}
              <div className="space-y-1 max-h-52 overflow-y-auto pr-1">
                {availableItems.map((item) => {
                  const isSelected = selectedIds.includes(item.id);
                  return (
                    <div
                      key={item.id}
                      onClick={() => toggleSelectId(item.id)}
                      className={`p-2 rounded-xl border flex items-center justify-between gap-2 cursor-pointer transition-all ${
                        isSelected
                          ? 'bg-violet-950/40 border-violet-700/60 text-white'
                          : 'bg-slate-900/60 border-slate-800/80 text-slate-300 hover:border-slate-700 hover:bg-slate-900'
                      }`}
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <span
                          className={`text-[9px] font-mono px-1.5 py-0.5 rounded ${
                            item.kind === 'cassette'
                              ? 'bg-violet-500/20 text-violet-300'
                              : 'bg-pink-500/20 text-pink-300'
                          }`}
                        >
                          {item.kind === 'cassette' ? item.type?.toUpperCase() : 'REF'}
                        </span>
                        <span className="text-xs font-medium truncate">{item.title}</span>
                      </div>

                      <button
                        type="button"
                        className={`p-1 rounded-lg text-xs font-bold ${
                          isSelected ? 'text-violet-400 font-bold' : 'text-slate-500 hover:text-white'
                        }`}
                      >
                        {isSelected ? <Check className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Assemble Trigger Button */}
            <button
              onClick={handleAssemble}
              disabled={isAssembling || selectedElements.length === 0}
              className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-violet-600 via-pink-600 to-amber-500 hover:from-violet-500 hover:to-pink-500 text-white text-xs font-bold shadow-lg shadow-violet-600/30 transition-all flex items-center justify-center gap-2 active:scale-98 disabled:opacity-50"
            >
              <Sparkles className={`w-4 h-4 ${isAssembling ? 'animate-spin' : ''}`} />
              <span>
                {isAssembling
                  ? 'Gemini is synthesizing & assembling site...'
                  : `🧩 Assemble Site (${selectedElements.length} elements)`}
              </span>
            </button>

            {errorMsg && (
              <div className="p-2.5 rounded-xl bg-rose-950/40 border border-rose-800 text-rose-300 text-xs flex items-start gap-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5 text-rose-400" />
                <span>{errorMsg}</span>
              </div>
            )}
          </div>
        </div>

        {/* Right Column (7 cols): Live Sandboxed Preview & Code Inspector */}
        <div className="lg:col-span-7 bg-[#0d0f14] border border-slate-800 rounded-2xl overflow-hidden shadow-2xl flex flex-col min-h-[500px]">
          {/* Top Bar */}
          <div className="px-4 py-2.5 bg-[#12151d] border-b border-slate-800 flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <div className="flex items-center bg-slate-900 border border-slate-800 rounded-lg p-0.5">
                <button
                  onClick={() => setPreviewTab('preview')}
                  className={`px-3 py-1 rounded-md text-xs font-medium transition-all flex items-center gap-1.5 ${
                    previewTab === 'preview'
                      ? 'bg-violet-600 text-white shadow-sm'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>Live Assembled Preview</span>
                </button>
                <button
                  onClick={() => setPreviewTab('code')}
                  className={`px-3 py-1 rounded-md text-xs font-medium transition-all flex items-center gap-1.5 ${
                    previewTab === 'code'
                      ? 'bg-violet-600 text-white shadow-sm'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <Code2 className="w-3.5 h-3.5" />
                  <span>Unified Code</span>
                </button>
              </div>
            </div>

            {assembledCode && (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(assembledCode);
                    setCopied(true);
                    setTimeout(() => setCopied(false), 2000);
                  }}
                  className="px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 text-xs font-medium transition-colors flex items-center gap-1"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Copied' : 'Copy'}</span>
                </button>

                <button
                  onClick={handleSaveAsCassette}
                  className="px-3 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-sm flex items-center gap-1 transition-all"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>Save as Cassette</span>
                </button>
              </div>
            )}
          </div>

          {/* Body */}
          <div className="flex-1 relative overflow-hidden bg-[#06080c]">
            {!assembledCode && !isAssembling && (
              <div className="h-full flex flex-col items-center justify-center p-8 text-center text-slate-500 space-y-3">
                <div className="w-14 h-14 rounded-2xl bg-slate-900/80 border border-slate-800 flex items-center justify-center text-violet-400">
                  <Boxes className="w-7 h-7 stroke-1" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-slate-300">Ready to Assemble</h3>
                  <p className="text-xs text-slate-500 max-w-sm mt-1">
                    Select cassettes and references on the left, describe your vision, and click «🧩 Assemble Site» to synthesize a unified web page.
                  </p>
                </div>
              </div>
            )}

            {isAssembling && (
              <div className="h-full flex flex-col items-center justify-center p-8 text-center space-y-4">
                <div className="w-16 h-16 rounded-full border-4 border-violet-500/20 border-t-violet-500 animate-spin flex items-center justify-center">
                  <Sparkles className="w-6 h-6 text-violet-400 animate-pulse" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-white">Synthesizing Project Components...</h3>
                  <p className="text-xs text-slate-400 mt-1">
                    Gemini 3.7 Flash is integrating canvas animations, typography styles, and UI layout into a single cohesive experience.
                  </p>
                </div>
              </div>
            )}

            {assembledCode && !isAssembling && previewTab === 'preview' && (
              <iframe
                title="Assembled Site Preview"
                srcDoc={sandboxedSrcDoc}
                sandbox="allow-scripts allow-same-origin"
                className="w-full h-full border-0 bg-white"
              />
            )}

            {assembledCode && !isAssembling && previewTab === 'code' && (
              <textarea
                value={assembledCode}
                onChange={(e) => setAssembledCode(e.target.value)}
                className="w-full h-full p-4 bg-[#0a0c10] text-emerald-300 font-mono text-xs focus:outline-none resize-none selection:bg-violet-600 selection:text-white"
                spellCheck={false}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
