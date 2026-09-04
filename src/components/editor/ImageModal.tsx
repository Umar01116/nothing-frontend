import React, { useState, useRef } from "react";
import { Image as ImageIcon, UploadCloud, Link, X, Loader2, Check } from "lucide-react";
import { adminApi } from "../../api/admin";

interface ImageModalProps {
  isOpen: boolean;
  onClose: () => void;
  onInsert: (data: { src: string; alt: string; width: string; alignment: string }) => void;
  folder?: string;
}

export const ImageModal: React.FC<ImageModalProps> = ({
  isOpen,
  onClose,
  onInsert,
  folder = "editor",
}) => {
  const [activeTab, setActiveTab] = useState<"upload" | "url">("upload");
  const [imageUrl, setImageUrl] = useState("");
  const [altText, setAltText] = useState("");
  const [width, setWidth] = useState("100%");
  const [alignment, setAlignment] = useState("center");
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleFileUpload = async (file: File) => {
    setError(null);
    setUploading(true);
    try {
      const res = await adminApi.uploadMedia(file, folder);
      setImageUrl(res.url);
      if (!altText) {
        const cleanName = file.name.split(".")[0].replace(/[-_]/g, " ");
        setAltText(cleanName);
      }
    } catch (err: any) {
      setError(err.message || "Failed to upload image.");
    } finally {
      setUploading(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files[0]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!imageUrl.trim()) {
      setError("Please provide or upload an image first.");
      return;
    }
    onInsert({
      src: imageUrl.trim(),
      alt: altText.trim(),
      width,
      alignment,
    });
    // Reset
    setImageUrl("");
    setAltText("");
    setError(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 animate-fadeIn">
      <div className="w-full max-w-lg bg-white rounded-2xl shadow-xl overflow-hidden border border-neutral-200">
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-neutral-100 bg-neutral-50/60">
          <div className="flex items-center gap-2 text-sm font-bold text-neutral-900">
            <ImageIcon className="w-4 h-4 text-red-600" />
            <span>Insert Image</span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-neutral-400 hover:text-neutral-700 p-1 rounded-lg transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="flex border-b border-neutral-100 px-5 pt-3 gap-4">
          <button
            type="button"
            onClick={() => setActiveTab("upload")}
            className={`pb-2 text-xs font-semibold flex items-center gap-1.5 transition border-b-2 ${
              activeTab === "upload"
                ? "border-black text-black"
                : "border-transparent text-neutral-400 hover:text-neutral-700"
            }`}
          >
            <UploadCloud className="w-3.5 h-3.5" />
            Upload from PC
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("url")}
            className={`pb-2 text-xs font-semibold flex items-center gap-1.5 transition border-b-2 ${
              activeTab === "url"
                ? "border-black text-black"
                : "border-transparent text-neutral-400 hover:text-neutral-700"
            }`}
          >
            <Link className="w-3.5 h-3.5" />
            Image URL
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          {error && (
            <div className="p-2.5 text-xs text-red-600 bg-red-50 rounded-xl border border-red-100">
              {error}
            </div>
          )}

          {activeTab === "upload" ? (
            <div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  if (e.target.files?.[0]) handleFileUpload(e.target.files[0]);
                }}
              />
              <div
                onDragOver={(e) => e.preventDefault()}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition ${
                  imageUrl ? "border-green-400 bg-green-50/20" : "border-neutral-200 hover:border-neutral-400 bg-neutral-50/50"
                }`}
              >
                {uploading ? (
                  <div className="flex flex-col items-center py-2 text-neutral-500">
                    <Loader2 className="w-6 h-6 animate-spin text-red-600 mb-2" />
                    <span className="text-xs font-medium">Uploading image...</span>
                  </div>
                ) : imageUrl ? (
                  <div className="flex flex-col items-center gap-2">
                    <img src={imageUrl} alt="Uploaded preview" className="max-h-32 object-contain rounded-lg shadow-2xs" />
                    <span className="text-xs text-green-700 font-semibold flex items-center gap-1">
                      <Check className="w-3.5 h-3.5" /> Image uploaded successfully
                    </span>
                    <span className="text-[11px] text-neutral-400">Click or drop to replace</span>
                  </div>
                ) : (
                  <div className="flex flex-col items-center py-2">
                    <UploadCloud className="w-8 h-8 text-neutral-400 mb-2" />
                    <span className="text-xs font-bold text-neutral-800">Click to upload or drag & drop</span>
                    <span className="text-[11px] text-neutral-400 mt-1">PNG, JPG, WebP, GIF up to 10MB</span>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div>
              <label className="block text-xs font-semibold text-neutral-700 mb-1">Image URL *</label>
              <input
                type="url"
                placeholder="https://example.com/photo.jpg"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                className="w-full px-3 py-2 border border-neutral-200 rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-black"
              />
            </div>
          )}

          {/* SEO Alt Text */}
          <div>
            <label className="block text-xs font-semibold text-neutral-700 mb-1">
              Alt Text / SEO Description
            </label>
            <input
              type="text"
              placeholder="Describe the image for accessibility & search engines"
              value={altText}
              onChange={(e) => setAltText(e.target.value)}
              className="w-full px-3 py-2 border border-neutral-200 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-black"
            />
          </div>

          {/* Initial Sizing & Alignment */}
          <div className="grid grid-cols-2 gap-3 pt-1">
            <div>
              <label className="block text-[11px] font-semibold text-neutral-600 mb-1">Display Size</label>
              <div className="grid grid-cols-4 gap-1">
                {["25%", "50%", "75%", "100%"].map((sz) => (
                  <button
                    key={sz}
                    type="button"
                    onClick={() => setWidth(sz)}
                    className={`py-1 text-[11px] font-semibold rounded border transition ${
                      width === sz ? "bg-black text-white border-black" : "bg-neutral-50 text-neutral-700 border-neutral-200 hover:bg-neutral-100"
                    }`}
                  >
                    {sz}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-neutral-600 mb-1">Alignment</label>
              <div className="grid grid-cols-4 gap-1">
                {[
                  { id: "left", label: "Left" },
                  { id: "center", label: "Center" },
                  { id: "right", label: "Right" },
                  { id: "full", label: "Full" },
                ].map((al) => (
                  <button
                    key={al.id}
                    type="button"
                    onClick={() => setAlignment(al.id)}
                    className={`py-1 text-[11px] font-semibold rounded border transition ${
                      alignment === al.id ? "bg-black text-white border-black" : "bg-neutral-50 text-neutral-700 border-neutral-200 hover:bg-neutral-100"
                    }`}
                  >
                    {al.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-2 pt-3 border-t border-neutral-100">
            <button
              type="button"
              onClick={onClose}
              className="px-3.5 py-1.5 text-xs font-medium text-neutral-600 hover:bg-neutral-100 rounded-lg transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={uploading}
              className="px-4 py-1.5 text-xs font-semibold text-white bg-black hover:bg-neutral-800 rounded-lg shadow-sm transition disabled:opacity-50"
            >
              Insert Image
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
