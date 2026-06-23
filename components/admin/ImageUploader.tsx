"use client";
import { useRef, useState } from "react";
import Image from "next/image";
import { Upload, X, Link as LinkIcon, Plus } from "lucide-react";

interface ImageUploaderProps {
  projectId: string;
  images: string[];
  onChange: (images: string[]) => void;
}

export default function ImageUploader({ projectId: _projectId, images, onChange }: ImageUploaderProps) {
  const [uploading, setUploading] = useState<Record<string, number>>({});
  const [urlInput, setUrlInput] = useState("");
  const [urlError, setUrlError] = useState("");
  const [mode, setMode] = useState<"upload" | "url">("url");
  const inputRef = useRef<HTMLInputElement>(null);

  // Try Firebase Storage upload — falls back to URL mode if Storage isn't configured
  async function handleFiles(files: FileList | null) {
    if (!files) return;
    const allowed = Array.from(files).filter(
      (f) => f.size <= 5 * 1024 * 1024 && f.type.startsWith("image/")
    );
    if (images.length + allowed.length > 5) {
      alert("Maximum 5 images allowed.");
      return;
    }
    for (const file of allowed) {
      const key = file.name + Date.now();
      setUploading((p) => ({ ...p, [key]: 0 }));
      try {
        // Dynamic import so the page doesn't crash if Storage isn't enabled
        const { uploadProjectImage } = await import("@/lib/storage");
        const url = await uploadProjectImage(_projectId, file, (pct) => {
          setUploading((p) => ({ ...p, [key]: pct }));
        });
        onChange([...images, url]);
      } catch (err) {
        const msg = err instanceof Error ? err.message : "";
        if (msg.includes("storage") || msg.includes("Firebase") || msg.includes("permission")) {
          alert("Firebase Storage is not enabled on your plan.\nUse the 'Paste URL' tab to add images from any hosting service.");
        } else {
          alert("Upload failed. Please try again.");
        }
      } finally {
        setUploading((p) => { const n = { ...p }; delete n[key]; return n; });
      }
    }
  }

  function addUrl() {
    setUrlError("");
    const trimmed = urlInput.trim();
    if (!trimmed) return;
    try {
      new URL(trimmed); // validates URL format
    } catch {
      setUrlError("Please enter a valid URL (starting with https://)");
      return;
    }
    if (images.length >= 5) {
      setUrlError("Maximum 5 images allowed.");
      return;
    }
    if (images.includes(trimmed)) {
      setUrlError("This URL is already added.");
      return;
    }
    onChange([...images, trimmed]);
    setUrlInput("");
  }

  function removeImage(url: string) {
    onChange(images.filter((i) => i !== url));
  }

  const uploadKeys = Object.keys(uploading);

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="text-xs font-inter font-medium text-white/70">Project Images (max 5)</label>
        {/* Mode toggle */}
        <div className="flex gap-1 glass-dark rounded-full p-1">
          <button
            type="button"
            onClick={() => setMode("url")}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-inter transition-all cursor-pointer ${
              mode === "url" ? "glass-coral text-white" : "text-white/50 hover:text-white"
            }`}
          >
            <LinkIcon size={11} /> Paste URL
          </button>
          <button
            type="button"
            onClick={() => setMode("upload")}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-inter transition-all cursor-pointer ${
              mode === "upload" ? "glass-coral text-white" : "text-white/50 hover:text-white"
            }`}
          >
            <Upload size={11} /> Upload File
          </button>
        </div>
      </div>

      {mode === "url" ? (
        /* URL paste mode — works without Firebase Storage */
        <div className="space-y-2">
          <div className="flex gap-2">
            <input
              type="url"
              value={urlInput}
              onChange={(e) => { setUrlInput(e.target.value); setUrlError(""); }}
              onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addUrl())}
              placeholder="https://i.imgur.com/... or any image URL"
              className="flex-1 glass-dark rounded-full px-4 py-2.5 text-sm font-inter text-white placeholder:text-white/30 outline-none focus:ring-2 focus:ring-coral"
            />
            <button
              type="button"
              onClick={addUrl}
              className="glass-coral text-white rounded-full px-4 py-2.5 text-sm font-inter hover:brightness-110 transition-all cursor-pointer flex items-center gap-1.5"
            >
              <Plus size={14} /> Add
            </button>
          </div>
          {urlError && <p className="text-xs text-red-400 px-1">{urlError}</p>}
          <p className="text-xs text-white/30 px-1">
            Upload your image to{" "}
            <a href="https://imgbb.com" target="_blank" rel="noopener noreferrer" className="text-coral hover:underline">imgbb.com</a>
            {" "}or{" "}
            <a href="https://postimages.org" target="_blank" rel="noopener noreferrer" className="text-coral hover:underline">postimages.org</a>
            {" "}(free), then paste the direct link here.
          </p>
        </div>
      ) : (
        /* File upload mode — requires Firebase Storage (Blaze plan) */
        <div>
          <div
            onClick={() => inputRef.current?.click()}
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => { e.preventDefault(); handleFiles(e.dataTransfer.files); }}
            className="glass-dark rounded-2xl border-2 border-dashed border-white/20 p-8 text-center cursor-pointer hover:border-coral/40 transition-colors"
          >
            <Upload size={28} className="text-white/40 mx-auto mb-3" />
            <p className="font-inter text-sm text-white/60">Drag & drop or click to browse</p>
            <p className="font-inter text-xs text-white/30 mt-1">JPG, PNG, WebP — max 5MB each</p>
            <p className="font-inter text-xs text-amber-400/70 mt-2">⚠ Requires Firebase Storage (Blaze plan)</p>
            <input
              ref={inputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp,image/gif"
              multiple
              className="hidden"
              onChange={(e) => handleFiles(e.target.files)}
            />
          </div>

          {/* Upload progress */}
          {uploadKeys.map((key) => (
            <div key={key} className="glass-dark rounded-xl p-3 mt-2">
              <div className="flex items-center justify-between mb-1.5">
                <span className="font-inter text-xs text-white/60">Uploading...</span>
                <span className="font-inter text-xs text-coral">{Math.round(uploading[key])}%</span>
              </div>
              <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                <div
                  className="h-full glass-coral rounded-full transition-all duration-300"
                  style={{ width: `${uploading[key]}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Thumbnails */}
      {images.length > 0 && (
        <div className="flex flex-wrap gap-3 pt-1">
          {images.map((url, i) => (
            <div key={url} className="relative w-24 h-16 rounded-lg overflow-hidden group border border-white/10">
              <Image
                src={url}
                alt={`Image ${i + 1}`}
                fill
                className="object-cover"
                unoptimized={!url.includes("firebasestorage")}
              />
              <button
                type="button"
                onClick={() => removeImage(url)}
                className="absolute inset-0 flex items-center justify-center bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity text-white"
              >
                <X size={18} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
