import React from 'react';
import {
  Search,
  SlidersHorizontal,
  Sparkles,
  Heart,
  Tag,
  ArrowUpDown,
  X,
  Code2,
  Boxes,
  Palette,
  Terminal
} from 'lucide-react';
import { FilterState, SortOption, CassetteType } from '../types';

interface FilterBarProps {
  filters: FilterState;
  onFilterChange: (filters: FilterState) => void;
  availableTags: { tag: string; count: number }[];
  typeCounts: Record<string, number>;
  totalCount: number;
  availableGroups?: { group: string; count: number }[];
}

const TYPE_OPTIONS: { id: string; label: string; icon: React.FC<{ className?: string }> }[] = [
  { id: 'all', label: 'All Experiments', icon: Sparkles },
  { id: 'p5', label: 'p5.js', icon: Palette },
  { id: 'three', label: 'Three.js 3D', icon: Boxes },
  { id: 'canvas', label: 'Canvas / Shader', icon: Terminal },
  { id: 'react', label: 'React JSX', icon: Code2 },
  { id: 'html', label: 'HTML / CSS', icon: Code2 }
];

export const FilterBar: React.FC<FilterBarProps> = ({
  filters,
  onFilterChange,
  availableTags,
  typeCounts,
  totalCount,
  availableGroups = []
}) => {
  const selectedGroups = filters.selectedGroups || [];
  const toggleGroup = (group: string) => {
    const next = selectedGroups.includes(group) ? [] : [group];
    onFilterChange({ ...filters, selectedGroups: next });
  };
  const toggleTag = (tag: string) => {
    const exists = filters.selectedTags.includes(tag);
    const newTags = exists
      ? filters.selectedTags.filter((t) => t !== tag)
      : [...filters.selectedTags, tag];
    onFilterChange({ ...filters, selectedTags: newTags });
  };

  const hasActiveFilters =
    filters.search ||
    filters.type !== 'all' ||
    filters.selectedTags.length > 0 ||
    selectedGroups.length > 0 ||
    filters.favoritesOnly;

  const clearAllFilters = () => {
    onFilterChange({
      search: '',
      type: 'all',
      selectedTags: [],
      selectedGroups: [],
      sortBy: 'newest',
      favoritesOnly: false
    });
  };

  return (
    <div className="space-y-3.5 mb-6">
      {/* Mobile Search Bar */}
      <div className="md:hidden">
        <div className="relative w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={filters.search}
            onChange={(e) => onFilterChange({ ...filters, search: e.target.value })}
            placeholder="Search experiments by name or tag..."
            className="w-full pl-9 pr-8 py-2 text-sm bg-slate-900 text-slate-100 placeholder-slate-500 rounded-xl border border-slate-700/60 focus:border-violet-500 focus:outline-none"
          />
          {filters.search && (
            <button
              onClick={() => onFilterChange({ ...filters, search: '' })}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Collections (semantic groups) */}
      {availableGroups.length > 0 && (
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar -mx-4 px-4 sm:mx-0 sm:px-0">
          <span className="text-[11px] font-mono uppercase tracking-wider text-slate-500 mr-1 shrink-0 hidden sm:inline">Коллекции</span>
          {availableGroups.map(({ group, count }) => {
            const isSelected = selectedGroups.includes(group);
            return (
              <button
                key={group}
                onClick={() => toggleGroup(group)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all flex items-center gap-1.5 cursor-pointer ${
                  isSelected
                    ? 'bg-fuchsia-600 text-white shadow-md shadow-fuchsia-600/30'
                    : 'bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 hover:border-slate-700'
                }`}
              >
                <span>{group}</span>
                <span className={`text-[10px] px-1.5 rounded-full ${isSelected ? 'bg-white/20' : 'bg-slate-800 text-slate-400'}`}>{count}</span>
              </button>
            );
          })}
        </div>
      )}

      {/* Main Filter Row: Type Pills & Sort */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        {/* Type Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 max-w-full no-scrollbar">
          {TYPE_OPTIONS.map((opt) => {
            const Icon = opt.icon;
            const isSelected = filters.type === opt.id;
            const count = opt.id === 'all' ? totalCount : typeCounts[opt.id] || 0;

            return (
              <button
                key={opt.id}
                onClick={() => onFilterChange({ ...filters, type: opt.id })}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all flex items-center gap-1.5 cursor-pointer ${
                  isSelected
                    ? 'bg-violet-600 text-white shadow-md shadow-violet-600/30'
                    : 'bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 hover:border-slate-700'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isSelected ? 'text-white' : 'text-slate-400'}`} />
                <span>{opt.label}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                    isSelected ? 'bg-white/20 text-white' : 'bg-slate-800 text-slate-400'
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Right side: Favorites + Sort */}
        <div className="flex items-center gap-2">
          {/* Favorites Filter */}
          <button
            onClick={() => onFilterChange({ ...filters, favoritesOnly: !filters.favoritesOnly })}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 ${
              filters.favoritesOnly
                ? 'bg-rose-500/20 border border-rose-500/50 text-rose-300'
                : 'bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-400 hover:text-slate-200'
            }`}
          >
            <Heart
              className={`w-3.5 h-3.5 ${
                filters.favoritesOnly ? 'fill-rose-500 text-rose-500' : 'text-slate-400'
              }`}
            />
            <span className="hidden sm:inline">Favorites</span>
          </button>

          {/* Sort Dropdown */}
          <div className="relative flex items-center bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-300">
            <ArrowUpDown className="w-3.5 h-3.5 text-slate-400 mr-1.5" />
            <select
              value={filters.sortBy}
              onChange={(e) =>
                onFilterChange({ ...filters, sortBy: e.target.value as SortOption })
              }
              className="bg-transparent text-slate-200 text-xs focus:outline-none cursor-pointer pr-2"
            >
              <option value="newest" className="bg-slate-900 text-slate-200">
                Newest First
              </option>
              <option value="oldest" className="bg-slate-900 text-slate-200">
                Oldest First
              </option>
              <option value="alphabetical" className="bg-slate-900 text-slate-200">
                Title (A-Z)
              </option>
              <option value="type" className="bg-slate-900 text-slate-200">
                Type (p5, 3D, Canvas)
              </option>
            </select>
          </div>

          {/* Clear Filters Button */}
          {hasActiveFilters && (
            <button
              onClick={clearAllFilters}
              className="px-2.5 py-1.5 rounded-lg bg-rose-950/40 hover:bg-rose-950/70 border border-rose-800/40 text-rose-300 text-xs transition-colors flex items-center gap-1"
              title="Reset all filters"
            >
              <X className="w-3 h-3" />
              <span className="hidden sm:inline">Reset</span>
            </button>
          )}
        </div>
      </div>

      {/* Popular Tags Row */}
      {availableTags.length > 0 && (
        <div className="flex items-center gap-1.5 flex-nowrap overflow-x-auto no-scrollbar -mx-4 px-4 sm:mx-0 sm:px-0 sm:flex-wrap sm:overflow-visible pt-1">
          <div className="flex items-center gap-1 text-slate-400 text-xs mr-1 font-mono shrink-0">
            <Tag className="w-3 h-3" />
            <span className="hidden sm:inline">Tags:</span>
          </div>
          {availableTags.slice(0, 14).map(({ tag, count }) => {
            const isSelected = filters.selectedTags.includes(tag);
            return (
              <button
                key={tag}
                onClick={() => toggleTag(tag)}
                className={`shrink-0 whitespace-nowrap px-2 py-0.5 rounded-md text-[11px] font-mono transition-all ${
                  isSelected
                    ? 'bg-pink-500/20 text-pink-300 border border-pink-500/40'
                    : 'bg-slate-900/80 text-slate-400 hover:text-slate-200 border border-slate-800 hover:border-slate-700'
                }`}
              >
                #{tag} <span className="opacity-60 text-[10px]">({count})</span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};
