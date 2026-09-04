import React, { useState, useEffect } from "react";
import { Link2, ExternalLink, X } from "lucide-react";

interface LinkModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (url: string, text: string, openInNewTab: boolean) => void;
  onRemove?: () => void;
  initialUrl?: string;
  initialText?: string;
  initialOpenInNewTab?: boolean;
}

export const LinkModal: React.FC<LinkModalProps> = ({
  isOpen,
  onClose,
  onSave,
  onRemove,
  initialUrl = "",
  initialText = "",
  initialOpenInNewTab = true,
}) => {
  const [url, setUrl] = useState("");
  const [text, setText] = useState("");
  const [openInNewTab, setOpenInNewTab] = useState(true);

  useEffect(() => {
    if (isOpen) {
      setUrl(initialUrl);
      setText(initialText);
      setOpenInNewTab(initialOpenInNewTab);
    }
  }, [isOpen, initialUrl, initialText, initialOpenInNewTab]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    let trimmedUrl = url.trim();
    if (!trimmedUrl) return;

    // Auto prefix http/https if missing
    if (!/^https?:\/\//i.test(trimmedUrl) && !trimmedUrl.startsWith("/") && !trimmedUrl.startsWith("#") && !trimmedUrl.startsWith("mailto:")) {
      trimmedUrl = `https://${trimmedUrl}`;
    }

    onSave(trimmedUrl, text.trim(), openInNewTab);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 animate-fadeIn">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl overflow-hidden border border-neutral-200">
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-neutral-100 bg-neutral-50/60">
          <div className="flex items-center gap-2 text-sm font-bold text-neutral-900">
            <Link2 className="w-4 h-4 text-red-600" />
            <span>{initialUrl ? "Edit Link" : "Insert Hyperlink"}</span>
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
          <div>
            <label className="block text-xs font-semibold text-neutral-700 mb-1">Destination URL *</label>
            <input
              type="text"
              required
              placeholder="https://example.com/item"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="w-full px-3 py-2 border border-neutral-200 rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-black"
              autoFocus
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-neutral-700 mb-1">Link Text</label>
            <input
              type="text"
              placeholder="Display text (optional if text is selected)"
              value={text}
              onChange={(e) => setText(e.target.value)}
              className="w-full px-3 py-2 border border-neutral-200 rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-black"
            />
          </div>

          <label className="flex items-center gap-2.5 text-xs font-medium text-neutral-700 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={openInNewTab}
              onChange={(e) => setOpenInNewTab(e.target.checked)}
              className="rounded border-neutral-300 text-red-600 focus:ring-red-500 w-4 h-4"
            />
            <span className="flex items-center gap-1">
              Open link in a new tab <ExternalLink className="w-3 h-3 text-neutral-400" />
            </span>
          </label>

          <div className="flex items-center justify-between pt-2">
            {initialUrl && onRemove ? (
              <button
                type="button"
                onClick={() => {
                  onRemove();
                  onClose();
                }}
                className="px-3 py-1.5 text-xs font-semibold text-red-600 hover:bg-red-50 rounded-lg transition"
              >
                Remove Link
              </button>
            ) : <div />}

            <div className="flex items-center gap-2">
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
                {initialUrl ? "Update Link" : "Insert Link"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
