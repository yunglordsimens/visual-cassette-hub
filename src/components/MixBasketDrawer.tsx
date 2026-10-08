import React, { useState } from 'react';
import { withCode } from '../utils/library';
import {
  X,
  Layers,
  Trash2,
  Download,
  Copy,
  Check,
  Sparkles,
  ExternalLink,
  Code2,
  FileArchive
} from 'lucide-react';
import { Cassette } from '../types';
import { downloadAllCassettesZip } from '../utils/storage';

interface MixBasketDrawerProps {
  isOpen: boolean;
  mixList: Cassette[];
  onClose: () => void;
  onRemoveFromMix: (id: string) => void;
  onClearMix: () => void;
  onSelectCassette: (cassette: Cassette) => void;
}

export const MixBasketDrawer: React.FC<MixBasketDrawerProps> = ({
  isOpen,
  mixList,
  onClose,
  onRemoveFromMix,
  onClearMix,
  onSelectCassette
}) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleExportZip = () => {
    if (mixList.length === 0) return;
    downloadAllCassettesZip(mixList);
  };

  const handleCopyBundle = async () => {
    const resolved = await withCode(mixList);
    const bundleText = resolved
      .map(
        (c) =>
          `/* =========================================================\n` +
          ` * CASSETTE: ${c.manifest.title} (${c.manifest.id})\n` +
          ` * TYPE: ${c.manifest.type} | TAGS: ${c.manifest.tags.join(', ')}\n` +
          ` * DESCRIPTION: ${c.manifest.description}\n` +
          ` * ========================================================= */\n\n` +
          c.code +
          `\n\n`
      )
      .join('\n');

    navigator.clipboard.writeText(bundleText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2200);
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/70 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-md bg-[#0e1118] border-l border-slate-800 h-full flex flex-col shadow-2xl animate-slide-left">
        {/* Drawer Header */}
        <div className="p-4 bg-[#12151d] border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-pink-600/20 text-pink-400 border border-pink-500/30">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                Mix Basket
                <span className="px-2 py-0.2 rounded-full bg-pink-600 text-white text-xs font-mono">
                  {mixList.length}
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                Staged assets ready for project export & remix
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

        {/* Mix Items List */}
        <div className="flex-1 p-4 overflow-y-auto space-y-3">
          {mixList.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 text-slate-500 space-y-3">
              <Layers className="w-12 h-12 stroke-1 text-slate-600" />
              <div>
                <p className="text-sm font-medium text-slate-300">Your basket is empty</p>
                <p className="text-xs text-slate-500 mt-1 max-w-xs">
                  Click the layer icon on any cassette card to collect your favorite visual snippets for mixing!
                </p>
              </div>
            </div>
          ) : (
            mixList.map((cassette) => (
              <div
                key={cassette.manifest.id}
                className="group flex items-center justify-between p-3 bg-[#141822] hover:bg-[#181d2a] rounded-xl border border-slate-800 transition-all gap-3"
              >
                <div
                  onClick={() => {
                    onSelectCassette(cassette);
                    onClose();
                  }}
                  className="flex-1 min-w-0 cursor-pointer"
                >
                  <div className="flex items-center gap-1.5 mb-1">
                    <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-slate-800 text-violet-300 uppercase">
                      {cassette.manifest.type}
                    </span>
                    <h4 className="text-xs font-semibold text-slate-200 group-hover:text-violet-300 truncate">
                      {cassette.manifest.title}
                    </h4>
                  </div>
                  <p className="text-[11px] text-slate-400 line-clamp-1">
                    {cassette.manifest.description}
                  </p>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => onRemoveFromMix(cassette.manifest.id)}
                    title="Remove from basket"
                    className="p-1.5 rounded-lg bg-slate-900 hover:bg-rose-950/50 text-slate-500 hover:text-rose-400 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Drawer Actions Footer */}
        {mixList.length > 0 && (
          <div className="p-4 bg-[#12151d] border-t border-slate-800 space-y-2.5">
            <div className="flex items-center gap-2">
              {/* Copy Combined Snippets */}
              <button
                onClick={handleCopyBundle}
                className="flex-1 py-2.5 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 text-xs font-medium transition-all flex items-center justify-center gap-2"
              >
                {copied ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-400" />
                    <span>Copied All Code!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4 text-slate-400" />
                    <span>Copy Merged Bundle</span>
                  </>
                )}
              </button>

              {/* Clear All */}
              <button
                onClick={onClearMix}
                title="Clear basket"
                className="p-2.5 rounded-xl bg-slate-900 hover:bg-rose-950/40 border border-slate-800 text-slate-400 hover:text-rose-300 text-xs transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>

            {/* Export All as ZIP */}
            <button
              onClick={handleExportZip}
              className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-pink-600 to-violet-600 hover:from-pink-500 hover:to-violet-500 text-white text-xs font-bold shadow-lg shadow-pink-600/20 transition-all flex items-center justify-center gap-2 active:scale-95"
            >
              <FileArchive className="w-4 h-4" />
              <span>Export {mixList.length} Cassettes as ZIP</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
