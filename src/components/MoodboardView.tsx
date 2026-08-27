import React, { useState, useMemo } from 'react';
import {
  Plus,
  Search,
  Wand2,
  Sparkles,
  Tag,
  MessageSquare,
  Filter,
  Image as ImageIcon,
  Trash2,
  ExternalLink,
  Layers,
  ArrowUpDown
} from 'lucide-react';
import { ReferenceItem, Cassette } from '../types';
import { autoTagAsset } from '../utils/gemini';

interface MoodboardViewProps {
  references: ReferenceItem[];
  onOpenAddModal: () => void;
  onOpenDetailModal: (ref: ReferenceItem) => void;
  onOpenGenerateModal: (ref: ReferenceItem) => void;
  onUpdateReference: (ref: ReferenceItem) => void;
  onDeleteReference: (id: string) => void;
}

const COMMON_GROUPS = ['Все', 'Шрифты', 'Цвета', 'Анимация', 'Сетка', '3D / WebGL', 'Интерактив', 'Структура'];

export const MoodboardView: React.FC<MoodboardViewProps> = ({
  references,
  onOpenAddModal,
  onOpenDetailModal,
  onOpenGenerateModal,
  onUpdateReference,
  onDeleteReference
}) => {
  const [search, setSearch] = useState('');
  const [selectedGroup, setSelectedGroup] = useState('Все');
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [autoTaggingId, setAutoTaggingId] = useState<string | null>(null);

  // All unique tags across all references
  const allTags = useMemo(() => {
    const set = new Set<string>();
    for (const r of references) {
      for (const t of r.tags || []) {
        set.add(t);
      }
    }
    return Array.from(set).slice(0, 15);
  }, [references]);

  // Filtered references
  const filteredReferences = useMemo(() => {
    return references.filter((r) => {
      // Search
      if (search.trim()) {
        const q = search.toLowerCase();
        const matchesTitle = r.title.toLowerCase().includes(q);
        const matchesTags = (r.tags || []).some((t) => t.toLowerCase().includes(q));
        const matchesComments = (r.comments || []).some((c) => c.toLowerCase().includes(q));
        if (!matchesTitle && !matchesTags && !matchesComments) return false;
      }

      // Group
      if (selectedGroup !== 'Все') {
        const matchesGroup = (r.groups || []).includes(selectedGroup);
        if (!matchesGroup) return false;
      }

      // Tag
      if (selectedTag) {
        if (!(r.tags || []).includes(selectedTag)) return false;
      }

      return true;
    });
  }, [references, search, selectedGroup, selectedTag]);

  const handleQuickAutoTag = async (e: React.MouseEvent, ref: ReferenceItem) => {
    e.stopPropagation();
    setAutoTaggingId(ref.id);

    const res = await autoTagAsset({
      title: ref.title,
      comments: ref.comments,
      description: ref.description,
      type: 'reference'
    });

    setAutoTaggingId(null);

    if (res.success && res.tags) {
      const updated: ReferenceItem = {
        ...ref,
        tags: Array.from(new Set([...ref.tags, ...res.tags])),
        groups: res.groups ? Array.from(new Set([...(ref.groups || []), ...res.groups])) : ref.groups
      };
      onUpdateReference(updated);
    }
  };

  return (
    <div className="space-y-6">
      {/* Moodboard Header Control Bar */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 bg-[#0d0f14] border border-slate-800/80 rounded-2xl p-4 sm:p-5 shadow-xl">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-pink-600/20 border border-pink-500/30 text-pink-400">
              <ImageIcon className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                Moodboard & References
                <span className="text-xs font-mono font-normal px-2 py-0.5 rounded-full bg-slate-800 text-slate-300">
                  {filteredReferences.length} items
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                Visual inspirations, design ideas, and AI landing generation sources
              </p>
            </div>
          </div>
        </div>

        {/* Actions & Search */}
        <div className="flex items-center gap-2.5 w-full md:w-auto">
          {/* Search Input */}
          <div className="relative flex-1 md:w-64">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search references, notes, tags..."
              className="w-full pl-9 pr-4 py-2 bg-slate-900 border border-slate-700/80 rounded-xl text-white placeholder-slate-500 text-xs focus:outline-none focus:border-pink-500"
            />
          </div>

          <button
            onClick={onOpenAddModal}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-pink-600 to-violet-600 hover:from-pink-500 hover:to-violet-500 text-white font-bold text-xs shadow-md shadow-pink-600/25 transition-all flex items-center gap-1.5 whitespace-nowrap active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>Add reference</span>
          </button>
        </div>
      </div>

      {/* Semantic Groups Filter Bar */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-xs font-medium text-slate-400 flex items-center gap-1 mr-1">
          <Filter className="w-3.5 h-3.5 text-pink-400" />
          <span>Группы:</span>
        </span>
        {COMMON_GROUPS.map((group) => {
          const isSelected = selectedGroup === group;
          return (
            <button
              key={group}
              onClick={() => setSelectedGroup(group)}
              className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
                isSelected
                  ? 'bg-pink-600 text-white shadow-md shadow-pink-600/30'
                  : 'bg-slate-900 border border-slate-800 text-slate-300 hover:border-slate-700 hover:text-white'
              }`}
            >
              {group}
            </button>
          );
        })}

        {/* Tag pills filter */}
        {allTags.length > 0 && (
          <div className="flex items-center gap-1.5 ml-auto flex-wrap">
            {allTags.slice(0, 6).map((tag) => {
              const isTagSelected = selectedTag === tag;
              return (
                <button
                  key={tag}
                  onClick={() => setSelectedTag(isTagSelected ? null : tag)}
                  className={`text-[11px] font-mono px-2 py-0.5 rounded-md transition-all ${
                    isTagSelected
                      ? 'bg-violet-600 text-white'
                      : 'bg-slate-900/80 border border-slate-800 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  #{tag}
                </button>
              );
            })}
            {selectedTag && (
              <button
                onClick={() => setSelectedTag(null)}
                className="text-[10px] text-pink-400 hover:underline"
              >
                Clear tag
              </button>
            )}
          </div>
        )}
      </div>

      {/* Gallery Grid */}
      {filteredReferences.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-5">
          {filteredReferences.map((ref) => {
            const isTaggingThis = autoTaggingId === ref.id;

            return (
              <div
                key={ref.id}
                onClick={() => onOpenDetailModal(ref)}
                className="group bg-[#0d0f14] border border-slate-800 hover:border-pink-500/50 rounded-2xl overflow-hidden shadow-lg transition-all duration-300 flex flex-col cursor-pointer hover:shadow-pink-950/20 hover:-translate-y-0.5"
              >
                {/* Image Preview Container */}
                <div className="relative aspect-[16/10] bg-slate-950 overflow-hidden flex items-center justify-center border-b border-slate-800/80">
                  <img
                    src={ref.image}
                    alt={ref.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />

                  {/* Top Floating Badge */}
                  <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5">
                    {ref.groups && ref.groups[0] && (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-pink-950/80 backdrop-blur-md border border-pink-700/60 text-pink-200 font-semibold shadow-md">
                        {ref.groups[0]}
                      </span>
                    )}
                  </div>

                  {/* Quick Action Overlay Buttons */}
                  <div className="absolute top-2.5 right-2.5 flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onOpenGenerateModal(ref);
                      }}
                      className="p-1.5 rounded-lg bg-black/80 hover:bg-violet-600 backdrop-blur-md text-white border border-white/10 transition-colors shadow-md"
                      title="✨ Generate landing from reference"
                    >
                      <Wand2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={(e) => handleQuickAutoTag(e, ref)}
                      disabled={isTaggingThis}
                      className="p-1.5 rounded-lg bg-black/80 hover:bg-pink-600 backdrop-blur-md text-white border border-white/10 transition-colors shadow-md"
                      title="🏷 Auto-tag with Gemini"
                    >
                      <Sparkles className={`w-3.5 h-3.5 ${isTaggingThis ? 'animate-spin' : ''}`} />
                    </button>
                  </div>
                </div>

                {/* Card Content Details */}
                <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                  <div>
                    <h3 className="text-sm font-bold text-white group-hover:text-pink-300 transition-colors line-clamp-1">
                      {ref.title}
                    </h3>

                    {/* Artist Notes Preview */}
                    {ref.comments && ref.comments.length > 0 && (
                      <div className="mt-2 p-2 rounded-xl bg-slate-900/70 border border-slate-800/80 text-[11px] text-slate-300 flex items-start gap-1.5">
                        <MessageSquare className="w-3.5 h-3.5 text-pink-400 mt-0.5 flex-shrink-0" />
                        <p className="line-clamp-2 italic leading-snug">
                          "{ref.comments[0]}"
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Bottom Tags & Action Bar */}
                  <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between gap-2">
                    <div className="flex flex-wrap gap-1 items-center min-w-0">
                      {(ref.tags || []).slice(0, 3).map((t) => (
                        <span
                          key={t}
                          className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-400"
                        >
                          #{t}
                        </span>
                      ))}
                    </div>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onOpenGenerateModal(ref);
                      }}
                      className="px-2.5 py-1 rounded-lg bg-violet-600/20 hover:bg-violet-600 border border-violet-500/40 text-violet-300 hover:text-white text-[11px] font-bold transition-all flex items-center gap-1 shadow-sm whitespace-nowrap"
                    >
                      <Wand2 className="w-3 h-3" />
                      <span>Generate</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* Empty State */
        <div className="py-16 px-4 bg-[#0d0f14] border border-dashed border-slate-800 rounded-2xl flex flex-col items-center justify-center text-center">
          <div className="w-14 h-14 rounded-2xl bg-pink-600/10 border border-pink-500/20 flex items-center justify-center text-pink-400 mb-3">
            <ImageIcon className="w-7 h-7 stroke-1" />
          </div>
          <h3 className="text-base font-bold text-white">No references found</h3>
          <p className="text-xs text-slate-400 max-w-sm mt-1 mb-4">
            {search || selectedGroup !== 'Все' || selectedTag
              ? 'Try adjusting your search query or group filters.'
              : 'Add your first visual reference to kickstart your moodboard gallery and generate websites.'}
          </p>
          <button
            onClick={onOpenAddModal}
            className="px-4 py-2 rounded-xl bg-pink-600 hover:bg-pink-500 text-white text-xs font-bold transition-all flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>Add reference</span>
          </button>
        </div>
      )}
    </div>
  );
};
