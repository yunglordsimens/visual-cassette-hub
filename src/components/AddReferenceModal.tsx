import React, { useState, useRef } from 'react';
import {
  X,
  Upload,
  Image as ImageIcon,
  Sparkles,
  Tag,
  Save,
  Trash2,
  Check,
  AlertCircle,
  MessageSquarePlus
} from 'lucide-react';
import { ReferenceItem } from '../types';
import { autoTagAsset } from '../utils/gemini';

interface AddReferenceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaveReference: (newRef: ReferenceItem) => void;
}

export const AddReferenceModal: React.FC<AddReferenceModalProps> = ({
  isOpen,
  onClose,
  onSaveReference
}) => {
  const [title, setTitle] = useState('');
  const [imagePreview, setImagePreview] = useState<string>('');
  const [commentsText, setCommentsText] = useState('');
  const [tagsInput, setTagsInput] = useState('typography, layout, moodboard');
  const [groups, setGroups] = useState<string[]>(['Шрифты', 'Сетка']);
  const [isAutoTagging, setIsAutoTagging] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleFileChange = (file: File) => {
    if (!file.type.startsWith('image/')) {
      setErrorMsg('Please select a valid image file (PNG, JPG, SVG, WebP, GIF)');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target?.result) {
        setImagePreview(e.target.result as string);
        if (!title) {
          const autoName = file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' ');
          setTitle(autoName.charAt(0).toUpperCase() + autoName.slice(1));
        }
        setErrorMsg('');
      }
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileChange(e.dataTransfer.files[0]);
    }
  };

  const handleAutoTag = async () => {
    if (!title && !commentsText) {
      setErrorMsg('Please provide a title or comments first for AI auto-tagging.');
      return;
    }

    setIsAutoTagging(true);
    setErrorMsg('');

    const commentsList = commentsText
      .split('\n')
      .map((c) => c.trim())
      .filter(Boolean);

    const res = await autoTagAsset({
      title,
      comments: commentsList,
      description: `Visual reference moodboard asset: ${title}`,
      type: 'reference'
    });

    setIsAutoTagging(false);

    if (res.success && res.tags) {
      setTagsInput(res.tags.join(', '));
      if (res.groups && res.groups.length > 0) {
        setGroups(res.groups);
      }
    } else {
      setErrorMsg(res.error || 'Failed to auto-tag. Check Gemini connection.');
    }
  };

  const handleSave = () => {
    if (!imagePreview) {
      setErrorMsg('Please upload an image for the reference.');
      return;
    }
    if (!title.trim()) {
      setErrorMsg('Please provide a title for the reference.');
      return;
    }

    const commentsList = commentsText
      .split('\n')
      .map((c) => c.trim().replace(/^[-•*]\s*/, ''))
      .filter(Boolean);

    const tagsList = tagsInput
      .split(',')
      .map((t) => t.trim().toLowerCase().replace(/^#/, ''))
      .filter(Boolean);

    const newId = `ref-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 5)}`;

    const newRef: ReferenceItem = {
      id: newId,
      title: title.trim(),
      image: imagePreview,
      comments: commentsList.length > 0 ? commentsList : ['Новый визуальный референс'],
      tags: tagsList.length > 0 ? tagsList : ['reference', 'moodboard'],
      groups: groups.length > 0 ? groups : ['Структура', 'Цвета'],
      created: new Date().toISOString().split('T')[0]
    };

    onSaveReference(newRef);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-fade-in">
      <div className="w-full max-w-xl bg-[#0d0f14] border border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-5 py-4 bg-[#12151d] border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-pink-600/20 text-pink-400 border border-pink-500/30">
              <ImageIcon className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">Add Moodboard Reference</h2>
              <p className="text-xs text-slate-400">
                Upload visual inspiration with notes and AI tagging
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

        {/* Content Form */}
        <div className="p-5 overflow-y-auto space-y-4 text-xs">
          {/* Image Drag & Drop Area */}
          <div>
            <label className="text-slate-300 font-semibold block mb-1">
              Reference Image <span className="text-rose-400">*</span>
            </label>

            {imagePreview ? (
              <div className="relative group rounded-xl overflow-hidden border border-slate-700 bg-slate-950 aspect-video flex items-center justify-center">
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="w-full h-full object-contain"
                />
                <button
                  type="button"
                  onClick={() => setImagePreview('')}
                  className="absolute top-2 right-2 p-1.5 rounded-lg bg-black/70 hover:bg-rose-600 text-white transition-colors"
                  title="Remove image"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div
                onDragOver={(e) => e.preventDefault()}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-slate-700 hover:border-violet-500/80 rounded-xl p-6 flex flex-col items-center justify-center text-center cursor-pointer bg-slate-900/40 hover:bg-slate-900 transition-all gap-2"
              >
                <div className="p-3 rounded-full bg-slate-800 text-violet-400">
                  <Upload className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-slate-200">
                    Drag and drop your reference image here
                  </p>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    or click to browse files (PNG, JPG, SVG, WebP)
                  </p>
                </div>
              </div>
            )}
            <input
              type="file"
              ref={fileInputRef}
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                if (e.target.files && e.target.files[0]) {
                  handleFileChange(e.target.files[0]);
                }
              }}
            />
          </div>

          {/* Title */}
          <div>
            <label className="text-slate-300 font-semibold block mb-1">
              Reference Title <span className="text-rose-400">*</span>
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Minimalist Swiss Poster or Kinetic Cyber UI"
              className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-violet-500 font-medium"
            />
          </div>

          {/* Comments / Notes (Textarea) */}
          <div>
            <label className="text-slate-300 font-semibold block mb-1">
              Комментарии и заметки (по одной строке на заметку):
            </label>
            <textarea
              rows={3}
              value={commentsText}
              onChange={(e) => setCommentsText(e.target.value)}
              placeholder="e.g.&#10;Использовать крупный неоновый акцент #ec4899&#10;12-колоночная сетка с тонкими линиями&#10;Плавный hover-эффект на карточках"
              className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-violet-500 text-xs resize-none"
            />
          </div>

          {/* AI Auto-tagging & Tags */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-slate-300 font-semibold">Теги и категории:</label>
              <button
                type="button"
                onClick={handleAutoTag}
                disabled={isAutoTagging}
                className="text-[11px] px-2.5 py-1 rounded-lg bg-violet-950/70 hover:bg-violet-900/80 border border-violet-700/60 text-violet-300 flex items-center gap-1 transition-colors"
              >
                <Sparkles className={`w-3.5 h-3.5 ${isAutoTagging ? 'animate-spin' : ''}`} />
                <span>{isAutoTagging ? 'Analyzing...' : '🏷 Auto-tag with AI'}</span>
              </button>
            </div>

            <input
              type="text"
              value={tagsInput}
              onChange={(e) => setTagsInput(e.target.value)}
              placeholder="comma-separated tags: typography, neon, 3d, dark-ui..."
              className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-violet-500 font-mono text-xs"
            />

            {/* Semantic Groups Badges */}
            {groups.length > 0 && (
              <div className="flex items-center gap-1.5 flex-wrap pt-1">
                <span className="text-[11px] text-slate-400">Группы:</span>
                {groups.map((g) => (
                  <span
                    key={g}
                    className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-pink-950/60 border border-pink-700/60 text-pink-300"
                  >
                    {g}
                  </span>
                ))}
              </div>
            )}
          </div>

          {errorMsg && (
            <div className="p-2.5 rounded-xl bg-rose-950/40 border border-rose-800 text-rose-300 text-xs flex items-start gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5 text-rose-400" />
              <span>{errorMsg}</span>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-5 py-3.5 bg-[#12151d] border-t border-slate-800 flex items-center justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-slate-200 font-medium transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="px-5 py-2 rounded-xl bg-gradient-to-r from-pink-600 to-violet-600 hover:from-pink-500 hover:to-violet-500 text-white font-bold transition-all shadow-md shadow-pink-600/25 flex items-center gap-1.5"
          >
            <Save className="w-3.5 h-3.5" />
            <span>Save Reference</span>
          </button>
        </div>
      </div>
    </div>
  );
};
