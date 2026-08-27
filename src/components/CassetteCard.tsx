import React, { useState, useMemo } from 'react';
import {
  Play,
  Pause,
  Maximize2,
  Copy,
  Check,
  Heart,
  Plus,
  Layers,
  Sparkles,
  Palette,
  Boxes,
  Terminal,
  Code2,
  Download
} from 'lucide-react';
import { Cassette, CassetteType } from '../types';
import { buildSandboxedHtml } from '../utils/runner';
import { downloadCassetteZip } from '../utils/storage';

interface CassetteCardProps {
  cassette: Cassette;
  isFavorite: boolean;
  isInMix: boolean;
  onSelect: (cassette: Cassette) => void;
  onToggleFavorite: (id: string) => void;
  onToggleMix: (cassette: Cassette) => void;
  onTagClick?: (tag: string) => void;
}

export const CassetteCard: React.FC<CassetteCardProps> = ({
  cassette,
  isFavorite,
  isInMix,
  onSelect,
  onToggleFavorite,
  onToggleMix,
  onTagClick
}) => {
  const [isPlaying, setIsPlaying] = useState(true);
  const [copied, setCopied] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const { manifest, code, isCustom } = cassette;

  const sandboxedSrcDoc = useMemo(() => {
    return buildSandboxedHtml(manifest.type, code);
  }, [manifest.type, code]);

  const handleCopyCode = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  const handleDownload = (e: React.MouseEvent) => {
    e.stopPropagation();
    downloadCassetteZip(cassette);
  };

  const getTypeBadge = (type: CassetteType) => {
    switch (type) {
      case 'p5':
        return {
          label: 'p5.js',
          bg: 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30',
          icon: Palette
        };
      case 'three':
        return {
          label: 'Three.js 3D',
          bg: 'bg-cyan-500/10 text-cyan-300 border-cyan-500/30',
          icon: Boxes
        };
      case 'canvas':
        return {
          label: 'Canvas / Shader',
          bg: 'bg-amber-500/10 text-amber-300 border-amber-500/30',
          icon: Terminal
        };
      case 'react':
        return {
          label: 'React JSX',
          bg: 'bg-violet-500/10 text-violet-300 border-violet-500/30',
          icon: Code2
        };
      case 'html':
      default:
        return {
          label: 'HTML / CSS',
          bg: 'bg-rose-500/10 text-rose-300 border-rose-500/30',
          icon: Code2
        };
    }
  };

  const typeConfig = getTypeBadge(manifest.type);
  const TypeIcon = typeConfig.icon;

  return (
    <div
      id={`cassette-card-${manifest.id}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="group relative flex flex-col bg-[#12151d] hover:bg-[#161a24] rounded-2xl border border-slate-800/80 hover:border-violet-500/50 shadow-lg shadow-black/40 hover:shadow-violet-950/20 transition-all duration-300 overflow-hidden"
    >
      {/* Visual Canvas Stage / Sandbox Thumbnail */}
      <div className="relative w-full aspect-[16/10] bg-[#0a0c10] overflow-hidden cursor-pointer" onClick={() => onSelect(cassette)}>
        {/* The Sandboxed Iframe Preview */}
        <iframe
          srcDoc={sandboxedSrcDoc}
          title={manifest.title}
          sandbox="allow-scripts allow-same-origin"
          loading="lazy"
          className={`w-full h-full border-none transition-opacity duration-300 ${
            isPlaying ? 'opacity-100' : 'opacity-40 grayscale'
          }`}
          style={{ pointerEvents: isHovered ? 'auto' : 'none' }}
        />

        {/* Top Badges Overlay */}
        <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between pointer-events-none">
          <div className="flex items-center gap-1.5 pointer-events-auto">
            <span
              className={`text-[11px] font-mono font-medium px-2 py-0.5 rounded-full border backdrop-blur-md flex items-center gap-1 shadow-sm ${typeConfig.bg}`}
            >
              <TypeIcon className="w-3 h-3" />
              {typeConfig.label}
            </span>
            {isCustom && (
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded-full bg-violet-500/20 text-violet-300 border border-violet-500/40">
                Custom
              </span>
            )}
          </div>

          {/* Quick Overlay Action Icons */}
          <div className="flex items-center gap-1 pointer-events-auto">
            {/* Mix Basket Toggle */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                onToggleMix(cassette);
              }}
              title={isInMix ? 'Remove from Mix Basket' : 'Add to Mix Basket'}
              className={`p-1.5 rounded-lg backdrop-blur-md border transition-all ${
                isInMix
                  ? 'bg-pink-600 text-white border-pink-500 shadow-md'
                  : 'bg-black/60 hover:bg-black/80 text-slate-300 hover:text-white border-slate-700/60'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
            </button>

            {/* Favorite Heart */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                onToggleFavorite(manifest.id);
              }}
              title={isFavorite ? 'Remove Favorite' : 'Add to Favorites'}
              className={`p-1.5 rounded-lg backdrop-blur-md border transition-all ${
                isFavorite
                  ? 'bg-rose-500/30 text-rose-300 border-rose-500/60'
                  : 'bg-black/60 hover:bg-black/80 text-slate-300 hover:text-rose-400 border-slate-700/60'
              }`}
            >
              <Heart
                className={`w-3.5 h-3.5 ${isFavorite ? 'fill-rose-500 text-rose-500' : ''}`}
              />
            </button>
          </div>
        </div>

        {/* Hover Controls Bar (Bottom of preview) */}
        <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-auto">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setIsPlaying(!isPlaying);
            }}
            className="px-2 py-1 rounded-md bg-black/70 hover:bg-black/90 text-slate-200 text-[11px] font-mono border border-slate-700/50 backdrop-blur-sm flex items-center gap-1"
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
            onClick={() => onSelect(cassette)}
            className="px-2.5 py-1 rounded-md bg-violet-600/90 hover:bg-violet-600 text-white text-[11px] font-medium border border-violet-400/30 backdrop-blur-sm flex items-center gap-1 shadow-sm"
          >
            <Maximize2 className="w-3 h-3" />
            <span>Open Studio</span>
          </button>
        </div>
      </div>

      {/* Cassette Info Body */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          {/* Title & Created Date */}
          <div className="flex items-start justify-between gap-2 mb-1.5">
            <h3
              onClick={() => onSelect(cassette)}
              className="text-sm font-semibold text-slate-100 hover:text-violet-300 transition-colors cursor-pointer line-clamp-1"
              title={manifest.title}
            >
              {manifest.title}
            </h3>
            <span className="text-[11px] font-mono text-slate-500 flex-shrink-0">
              {manifest.created}
            </span>
          </div>

          {/* Description */}
          <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed mb-3">
            {manifest.description}
          </p>

          {/* Tags */}
          <div className="flex items-center gap-1.5 flex-wrap mb-3.5">
            {manifest.groups && manifest.groups[0] && (
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-pink-950/60 text-pink-300 border border-pink-800/40">
                {manifest.groups[0]}
              </span>
            )}
            {manifest.tags.map((tag) => (
              <span
                key={tag}
                onClick={(e) => {
                  e.stopPropagation();
                  onTagClick?.(tag);
                }}
                className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-slate-900/90 text-slate-400 hover:text-pink-300 hover:bg-pink-950/30 border border-slate-800 hover:border-pink-800/40 cursor-pointer transition-colors"
              >
                #{tag}
              </span>
            ))}
          </div>

          {/* Comments preview if available */}
          {manifest.comments && manifest.comments.length > 0 && (
            <div className="mb-2.5 px-2.5 py-1.5 rounded-lg bg-slate-900/60 border border-slate-800 text-[11px] text-slate-300 line-clamp-1 italic">
              💬 {manifest.comments[0]}
            </div>
          )}
        </div>

        {/* Bottom Actions Bar */}
        <div className="pt-2.5 border-t border-slate-800/60 flex items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-1 text-slate-400 font-mono text-[11px]">
            <span>ID:</span>
            <span className="text-slate-300 max-w-[100px] truncate">{manifest.id}</span>
          </div>

          <div className="flex items-center gap-1.5">
            {/* Quick Copy Code */}
            <button
              onClick={handleCopyCode}
              title="Copy snippet code"
              className={`p-1.5 rounded-lg border text-xs font-medium transition-all flex items-center gap-1 ${
                copied
                  ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                  : 'bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border-slate-800'
              }`}
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-[10px]">Copied</span>
                </>
              ) : (
                <Copy className="w-3.5 h-3.5" />
              )}
            </button>

            {/* Quick Download ZIP */}
            <button
              onClick={handleDownload}
              title="Download cassette ZIP bundle"
              className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 transition-colors"
            >
              <Download className="w-3.5 h-3.5 text-cyan-400" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
