import React, { useState } from "react";
import { Video, X } from "lucide-react";

interface YoutubeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onInsert: (url: string) => void;
}

export const YoutubeModal: React.FC<YoutubeModalProps> = ({ isOpen, onClose, onInsert }) => {
  const [url, setUrl] = useState("");
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = url.trim();
    if (!trimmed) return;

    if (!trimmed.includes("youtube.com") && !trimmed.includes("youtu.be")) {
      setError("Please provide a valid YouTube video URL (e.g. https://www.youtube.com/watch?v=...)");
      return;
    }

    onInsert(trimmed);
    setUrl("");
    setError(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 animate-fadeIn">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl overflow-hidden border border-neutral-200">
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-neutral-100 bg-neutral-50/60">
          <div className="flex items-center gap-2 text-sm font-bold text-neutral-900">
            <Video className="w-4 h-4 text-red-600" />
            <span>Embed YouTube Video</span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-neutral-400 hover:text-neutral-700 p-1 rounded-lg transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          {error && (
            <div className="p-2.5 text-xs text-red-600 bg-red-50 rounded-xl border border-red-100">
              {error}
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-neutral-700 mb-1">YouTube Video URL *</label>
            <input
              type="url"
              required
              placeholder="https://www.youtube.com/watch?v=dQw4w9WgXcQ"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="w-full px-3 py-2 border border-neutral-200 rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-black"
              autoFocus
            />
            <p className="text-[11px] text-neutral-400 mt-1">
              Supports standard YouTube URLs, short links (youtu.be), and embed links.
            </p>
          </div>

          <div className="flex items-center justify-end gap-2 pt-2 border-t border-neutral-100">
            <button
              type="button"
              onClick={onClose}
              className="px-3.5 py-1.5 text-xs font-medium text-neutral-600 hover:bg-neutral-100 rounded-lg transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 text-xs font-semibold text-white bg-black hover:bg-neutral-800 rounded-lg shadow-sm transition"
            >
              Embed Video
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
