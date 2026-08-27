import React, { useState } from 'react';
import { Plus, Boxes, Image as ImageIcon, Sparkles, X, Code2 } from 'lucide-react';

interface MobileActionFabProps {
  onAddCassette: () => void;
  onAddReference: () => void;
  onNewProject: () => void;
  onOpenAiSettings: () => void;
}

export const MobileActionFab: React.FC<MobileActionFabProps> = ({
  onAddCassette,
  onAddReference,
  onNewProject,
  onOpenAiSettings
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggle = () => setIsOpen(!isOpen);

  return (
    <div className="fixed bottom-6 right-6 z-40 sm:hidden">
      {/* Expanded Menu Actions */}
      {isOpen && (
        <div className="flex flex-col items-end gap-2.5 mb-3 animate-fade-in">
          {/* Action 1: Add Cassette */}
          <button
            onClick={() => {
              setIsOpen(false);
              onAddCassette();
            }}
            className="flex items-center gap-2 px-3.5 py-2 rounded-full bg-[#12151d] border border-violet-500/50 text-violet-300 shadow-xl text-xs font-bold active:scale-95 transition-all"
          >
            <span>+ Cassette</span>
            <div className="w-7 h-7 rounded-full bg-violet-600/30 text-violet-400 flex items-center justify-center">
              <Code2 className="w-3.5 h-3.5" />
            </div>
          </button>

          {/* Action 2: Add Reference */}
          <button
            onClick={() => {
              setIsOpen(false);
              onAddReference();
            }}
            className="flex items-center gap-2 px-3.5 py-2 rounded-full bg-[#12151d] border border-pink-500/50 text-pink-300 shadow-xl text-xs font-bold active:scale-95 transition-all"
          >
            <span>+ Reference</span>
            <div className="w-7 h-7 rounded-full bg-pink-600/30 text-pink-400 flex items-center justify-center">
              <ImageIcon className="w-3.5 h-3.5" />
            </div>
          </button>

          {/* Action 3: New Project */}
          <button
            onClick={() => {
              setIsOpen(false);
              onNewProject();
            }}
            className="flex items-center gap-2 px-3.5 py-2 rounded-full bg-[#12151d] border border-amber-500/50 text-amber-300 shadow-xl text-xs font-bold active:scale-95 transition-all"
          >
            <span>+ Project</span>
            <div className="w-7 h-7 rounded-full bg-amber-600/30 text-amber-400 flex items-center justify-center">
              <Boxes className="w-3.5 h-3.5" />
            </div>
          </button>

          {/* Action 4: Gemini AI */}
          <button
            onClick={() => {
              setIsOpen(false);
              onOpenAiSettings();
            }}
            className="flex items-center gap-2 px-3.5 py-2 rounded-full bg-[#12151d] border border-slate-700 text-slate-300 shadow-xl text-xs font-bold active:scale-95 transition-all"
          >
            <span>Gemini AI</span>
            <div className="w-7 h-7 rounded-full bg-slate-800 text-violet-400 flex items-center justify-center">
              <Sparkles className="w-3.5 h-3.5" />
            </div>
          </button>
        </div>
      )}

      {/* Main Trigger Button */}
      <button
        onClick={toggle}
        className="w-13 h-13 rounded-full bg-gradient-to-tr from-violet-600 via-pink-600 to-amber-500 text-white shadow-2xl shadow-violet-600/50 flex items-center justify-center active:scale-90 transition-transform"
        aria-label="Quick Actions"
      >
        {isOpen ? <X className="w-6 h-6" /> : <Plus className="w-6 h-6" />}
      </button>
    </div>
  );
};
