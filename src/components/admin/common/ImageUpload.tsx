import { useState, useRef } from "react";
import { adminApi } from "../../../api/admin";
import { resolveImageUrl } from "../../../utils/store";

interface ImageUploadProps {
  label?: string;
  value?: string | null;
  onChange: (url: string) => void;
  folder?: string;
  className?: string;
}

export function ImageUpload({
  label = "Upload Image from PC",
  value,
  onChange,
  folder = "uploads",
  className = "",
}: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = async (file: File) => {
    if (!file.type.startsWith("image/")) {
      setError("Please select a valid image file (PNG, JPG, WebP, SVG)");
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setError("Image size must be less than 10MB");
      return;
    }

    setError(null);
    setUploading(true);

    try {
      const res = await adminApi.uploadMedia(file, folder);
      onChange(res.url);
    } catch (err: any) {
      setError(err.message || "Failed to upload image from PC");
    } finally {
      setUploading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  return (
    <div className={`space-y-1.5 ${className}`}>
      {label && <label className="block text-xs font-semibold text-neutral-700">{label}</label>}

      {value ? (
        <div className="relative group rounded-xl border border-neutral-200 bg-neutral-50 p-2 flex items-center gap-3">
          <div className="h-16 w-16 flex-shrink-0 rounded-lg overflow-hidden border border-neutral-200 bg-white flex items-center justify-center">
            <img src={resolveImageUrl(value)} alt="Preview" className="h-full w-full object-contain" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-medium text-neutral-800 truncate">{value.split("/").pop()}</p>
            <p className="text-[10px] text-emerald-600 font-semibold mt-0.5">Uploaded from PC ✓</p>
          </div>
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="px-2.5 py-1.5 text-xs font-medium bg-white hover:bg-neutral-100 border border-neutral-300 rounded-lg transition"
            >
              Change
            </button>
            <button
              type="button"
              onClick={() => onChange("")}
              className="p-1.5 text-neutral-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
              title="Remove image"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      ) : (
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setDragOver(true);
          }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`border-2 border-dashed rounded-xl p-4 text-center cursor-pointer transition ${
            dragOver
              ? "border-red-500 bg-red-50/40"
              : "border-neutral-200 hover:border-neutral-400 bg-neutral-50/50 hover:bg-neutral-50"
          }`}
        >
          {uploading ? (
            <div className="flex flex-col items-center justify-center py-2">
              <div className="h-6 w-6 animate-spin rounded-full border-2 border-neutral-300 border-t-red-600 mb-2" />
              <p className="text-xs text-neutral-600 font-medium">Uploading from PC...</p>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-1">
              <div className="h-9 w-9 rounded-full bg-white border border-neutral-200 flex items-center justify-center text-neutral-500 mb-2 shadow-xs">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <p className="text-xs font-semibold text-neutral-800">
                <span className="text-red-600 hover:underline">Click to upload from PC</span> or drag & drop
              </p>
              <p className="text-[10px] text-neutral-400 mt-0.5">PNG, JPG, WebP, SVG up to 10MB</p>
            </div>
          )}
        </div>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept="image/png,image/jpeg,image/jpg,image/webp,image/svg+xml"
        onChange={handleFileChange}
        className="hidden"
      />

      {error && <p className="text-xs text-red-600">{error}</p>}
    </div>
  );
}
