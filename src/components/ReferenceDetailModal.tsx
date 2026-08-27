import React, { useState } from 'react';
import {
  X,
  Sparkles,
  Wand2,
  Trash2,
  Save,
  Tag,
  Plus,
  MessageSquare,
  Calendar,
  Layers,
  ExternalLink,
  ZoomIn,
  Check
} from 'lucide-react';
import { ReferenceItem } from '../types';
import { autoTagAsset } from '../utils/gemini';

interface ReferenceDetailModalProps {
  reference: ReferenceItem;
  isOpen: boolean;
  onClose: () => void;
  onUpdateReference: (updated: ReferenceItem) => void;
  onDeleteReference: (id: string) => void;
  onGenerateLanding: (reference: ReferenceItem) => void;
}

export const ReferenceDetailModal: React.FC<ReferenceDetailModalProps> = ({
  reference,
  isOpen,
  onClose,
  onUpdateReference,
  onDeleteReference,
  onGenerateLanding
}) => {
  const [title, setTitle] = useState(reference.title);
  const [comments, setComments] = useState<string[]>(reference.comments || []);
  const [newComment, setNewComment] = useState('');
  const [tags, setTags] = useState<string[]>(reference.tags || []);
  const [groups, setGroups] = useState<string[]>(reference.groups || []);
  const [newTag, setNewTag] = useState('');
  const [isAutoTagging, setIsAutoTagging] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  if (!isOpen) return null;

  const handleAddComment = () => {
    if (!newComment.trim()) return;
    setComments([...comments, newComment.trim()]);
    setNewComment('');
  };

  const handleDeleteComment = (idx: number) => {
    setComments(comments.filter((_, i) => i !== idx));
  };

  const handleAddTag = () => {
    if (!newTag.trim()) return;
    const clean = newTag.trim().toLowerCase().replace(/^#/, '');
    if (!tags.includes(clean)) {
      setTags([...tags, clean]);
    }
    setNewTag('');
  };

  const handleDeleteTag = (t: string) => {
    setTags(tags.filter((item) => item !== t));
  };

  const handleAutoTag = async () => {
    setIsAutoTagging(true);
    const res = await autoTagAsset({
      title,
      comments,
      description: reference.description,
      type: 'reference'
    });
    setIsAutoTagging(false);

    if (res.success && res.tags) {
      setTags(Array.from(new Set([...tags, ...res.tags])));
      if (res.groups && res.groups.length > 0) {
        setGroups(Array.from(new Set([...groups, ...res.groups])));
      }
    }
  };

  const handleSave = () => {
    const updated: ReferenceItem = {
      ...reference,
      title: title.trim(),
      comments,
      tags,
      groups
    };
    onUpdateReference(updated);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-2 sm:p-4 md:p-6 animate-fade-in">
      <div className="w-full h-full max-w-5xl bg-[#0d0f14] border border-slate-800 rounded-2xl shadow-2xl flex flex-col overflow-hidden">
        {/* Top Header */}
        <div className="px-5 py-3.5 bg-[#12151d] border-b border-slate-800 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-3 min-w-0">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-medium bg-pink-500/10 border border-pink-500/30 text-pink-300">
              MOODBOARD REF
            </span>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="text-sm sm:text-base font-bold text-white bg-transparent border-b border-transparent hover:border-slate-700 focus:border-violet-500 focus:outline-none px-1"
            />
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onGenerateLanding(reference)}
              className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-violet-600 to-pink-600 hover:from-violet-500 hover:to-pink-500 text-white text-xs font-bold shadow-md shadow-violet-600/25 transition-all flex items-center gap-1.5"
            >
              <Wand2 className="w-3.5 h-3.5" />
              <span>✨ Generate page</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
          {/* Left / High-res image display */}
          <div className="flex-1 bg-[#07090e] p-4 flex items-center justify-center overflow-auto border-b md:border-b-0 md:border-r border-slate-800">
            <div className="max-h-full max-w-full rounded-xl overflow-hidden border border-slate-800 shadow-2xl bg-black flex items-center justify-center">
              <img
                src={reference.image}
                alt={reference.title}
                className="max-h-[75vh] w-auto object-contain"
              />
            </div>
          </div>

          {/* Right / Inspector & Comments Panel */}
          <div className="w-full md:w-[380px] bg-[#0f121a] flex flex-col overflow-hidden flex-shrink-0">
            <div className="p-4 flex-1 overflow-y-auto space-y-4 text-xs">
              {/* Metadata Info */}
              <div className="flex items-center justify-between text-slate-400 font-mono text-[11px] pb-2 border-b border-slate-800">
                <span className="flex items-center gap-1">
                  <Calendar className="w-3 h-3 text-slate-500" />
                  {reference.created}
                </span>
                <span>ID: {reference.id}</span>
              </div>

              {/* Comments Section */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="font-semibold text-slate-200 flex items-center gap-1.5">
                    <MessageSquare className="w-3.5 h-3.5 text-violet-400" />
                    <span>Заметки и комментарии ({comments.length})</span>
                  </h4>
                </div>

                <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                  {comments.map((comm, idx) => (
                    <div
                      key={idx}
                      className="group p-2.5 rounded-xl bg-slate-900/90 border border-slate-800 text-slate-300 text-xs flex items-start justify-between gap-2"
                    >
                      <p className="flex-1 leading-relaxed">{comm}</p>
                      <button
                        onClick={() => handleDeleteComment(idx)}
                        className="opacity-0 group-hover:opacity-100 p-1 text-slate-500 hover:text-rose-400 transition-opacity"
                        title="Delete note"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>

                {/* Add new comment */}
                <div className="flex gap-1.5 pt-1">
                  <input
                    type="text"
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleAddComment()}
                    placeholder="Добавить заметку..."
                    className="flex-1 px-3 py-1.5 bg-slate-900 border border-slate-700/80 rounded-xl text-white text-xs focus:outline-none focus:border-violet-500"
                  />
                  <button
                    onClick={handleAddComment}
                    className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium text-xs transition-colors"
                  >
                    Add
                  </button>
                </div>
              </div>

              {/* Tags & Groups */}
              <div className="space-y-2 pt-2 border-t border-slate-800">
                <div className="flex items-center justify-between">
                  <h4 className="font-semibold text-slate-200 flex items-center gap-1.5">
                    <Tag className="w-3.5 h-3.5 text-pink-400" />
                    <span>Теги и группы</span>
                  </h4>
                  <button
                    onClick={handleAutoTag}
                    disabled={isAutoTagging}
                    className="text-[11px] px-2 py-0.5 rounded-lg bg-violet-950/70 hover:bg-violet-900 border border-violet-700/60 text-violet-300 flex items-center gap-1 transition-colors"
                  >
                    <Sparkles className={`w-3 h-3 ${isAutoTagging ? 'animate-spin' : ''}`} />
                    <span>{isAutoTagging ? 'Tagging...' : 'Auto-tag'}</span>
                  </button>
                </div>

                {/* Groups */}
                {groups.length > 0 && (
                  <div className="flex flex-wrap gap-1 items-center">
                    <span className="text-[10px] text-slate-500 mr-1">Группы:</span>
                    {groups.map((g) => (
                      <span
                        key={g}
                        className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-pink-950/70 border border-pink-700/60 text-pink-300"
                      >
                        {g}
                      </span>
                    ))}
                  </div>
                )}

                {/* Tags */}
                <div className="flex flex-wrap gap-1">
                  {tags.map((t) => (
                    <span
                      key={t}
                      className="group text-[10px] font-mono px-2 py-0.5 rounded bg-slate-900 border border-slate-700 text-slate-300 flex items-center gap-1"
                    >
                      #{t}
                      <button
                        onClick={() => handleDeleteTag(t)}
                        className="hover:text-rose-400"
                      >
                        <X className="w-2.5 h-2.5" />
                      </button>
                    </span>
                  ))}
                </div>

                {/* Add custom tag */}
                <div className="flex gap-1.5 pt-1">
                  <input
                    type="text"
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleAddTag()}
                    placeholder="New tag..."
                    className="flex-1 px-2.5 py-1 bg-slate-900 border border-slate-700 rounded-lg text-white text-xs font-mono focus:border-violet-500 focus:outline-none"
                  />
                  <button
                    onClick={handleAddTag}
                    className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="p-4 bg-[#12151d] border-t border-slate-800 flex items-center justify-between flex-shrink-0">
              {showDeleteConfirm ? (
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => {
                      onDeleteReference(reference.id);
                      onClose();
                    }}
                    className="px-2.5 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs"
                  >
                    Confirm Delete
                  </button>
                  <button
                    onClick={() => setShowDeleteConfirm(false)}
                    className="px-2 py-1.5 rounded-lg bg-slate-800 text-slate-400 text-xs"
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setShowDeleteConfirm(true)}
                  className="text-xs text-rose-400 hover:text-rose-300 flex items-center gap-1"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Delete</span>
                </button>
              )}

              <button
                onClick={handleSave}
                className="px-4 py-2 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-bold text-xs shadow-md shadow-violet-600/25 flex items-center gap-1.5 transition-all"
              >
                {isSaved ? <Check className="w-3.5 h-3.5 text-emerald-300" /> : <Save className="w-3.5 h-3.5" />}
                <span>{isSaved ? 'Saved!' : 'Save changes'}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
