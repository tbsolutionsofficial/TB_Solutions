"use client";
import { useRef, useState } from "react";
import Image from "next/image";
import { Upload, X, Link as LinkIcon, Plus, CheckCircle } from "lucide-react";

interface ImageUploaderProps {
  projectId: string;
  images: string[];
  onChange: (images: string[]) => void;
}

const IMGBB_API_KEY = process.env.NEXT_PUBLIC_IMGBB_API_KEY;

async function uploadToImgBB(file: File, onProgress: (pct: number) => void): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = async () => {
      try {
        onProgress(30);
        const base64 = (reader.result as string).split(",")[1];
        const formData = new FormData();
        formData.append("key", IMGBB_API_KEY!);
        formData.append("image", base64);
        formData.append("name", file.name.replace(/\.[^.]+$/, ""));

        onProgress(60);
        const res = await fetch("https://api.imgbb.com/1/upload", {
          method: "POST",
          body: formData,
        });
        const json = await res.json();
        if (!json.success) throw new Error(json.error?.message || "ImgBB upload failed");
        onProgress(100);
        resolve(json.data.url as string);
      } catch (err) {
        reject(err);
      }
    };
    reader.onerror = () => reject(new Error("File read error"));
    onProgress(10);
    reader.readAsDataURL(file);
  });
}

export default function ImageUploader({ images, onChange }: ImageUploaderProps) {
  const [uploading, setUploading] = useState<Record<string, number>>({});
  const [urlInput, setUrlInput] = useState("");
  const [urlError, setUrlError] = useState("");
  const [mode, setMode] = useState<"upload" | "url">(IMGBB_API_KEY ? "upload" : "url");
  const [justDone, setJustDone] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  async function handleFiles(files: FileList | null) {
    if (!files || !IMGBB_API_KEY) return;
    const allowed = Array.from(files).filter(
      (f) => f.size <= 10 * 1024 * 1024 && f.type.startsWith("image/")
    );
    if (images.length + allowed.length > 5) {
      alert("Maximum 5 images allowed.");
      return;
    }

    for (const file of allowed) {
      const key = file.name + Date.now();
      setUploading((p) => ({ ...p, [key]: 0 }));
      try {
        const url = await uploadToImgBB(file, (pct) => {
          setUploading((p) => ({ ...p, [key]: pct }));
        });
        onChange([...images, url]);
        setJustDone((d) => [...d, url]);
        setTimeout(() => setJustDone((d) => d.filter((u) => u !== url)), 2000);
      } catch {
        alert("Upload failed. Check your ImgBB API key or try the Paste URL tab.");
      } finally {
        setUploading((p) => { const n = { ...p }; delete n[key]; return n; });
      }
    }
  }

  function addUrl() {
    setUrlError("");
    const trimmed = urlInput.trim();
    if (!trimmed) return;
    try { new URL(trimmed); } catch {
      setUrlError("Please enter a valid URL (starting with https://)");
      return;
    }
    if (images.length >= 5) { setUrlError("Maximum 5 images allowed."); return; }
    if (images.includes(trimmed)) { setUrlError("This URL is already added."); return; }
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
        <div className="flex gap-1 glass-dark rounded-full p-1">
          <button
            type="button"
            onClick={() => setMode("upload")}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-inter transition-all cursor-pointer ${
              mode === "upload" ? "glass-coral text-white" : "text-white/50 hover:text-white"
            }`}
          >
            <Upload size={11} /> Upload File
          </button>
          <button
            type="button"
            onClick={() => setMode("url")}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-inter transition-all cursor-pointer ${
              mode === "url" ? "glass-coral text-white" : "text-white/50 hover:text-white"
            }`}
          >
            <LinkIcon size={11} /> Paste URL
          </button>
        </div>
      </div>

      {mode === "upload" ? (
        <div className="space-y-2">
          {!IMGBB_API_KEY ? (
            <div className="glass-dark rounded-2xl border border-amber-400/20 p-5 text-center space-y-2">
              <p className="font-inter text-sm text-amber-300">ImgBB API key not configured</p>
              <p className="font-inter text-xs text-white/40">
                Get a free key at{" "}
                <a href="https://api.imgbb.com" target="_blank" rel="noopener noreferrer" className="text-coral hover:underline">api.imgbb.com</a>
                , then add <code className="bg-white/10 px-1 rounded text-white/70">NEXT_PUBLIC_IMGBB_API_KEY</code> to Vercel env vars.
              </p>
              <button
                type="button"
                onClick={() => setMode("url")}
                className="text-xs text-coral hover:underline font-inter cursor-pointer"
              >
                Use Paste URL instead →
              </button>
            </div>
          ) : (
            <div
              onClick={() => images.length < 5 && inputRef.current?.click()}
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => { e.preventDefault(); handleFiles(e.dataTransfer.files); }}
              className={`glass-dark rounded-2xl border-2 border-dashed p-8 text-center transition-colors ${
                images.length >= 5
                  ? "border-white/10 opacity-50 cursor-not-allowed"
                  : "border-white/20 cursor-pointer hover:border-coral/50"
              }`}
            >
              <Upload size={28} className="text-white/40 mx-auto mb-3" />
              <p className="font-inter text-sm text-white/60">Drag & drop or click to upload</p>
              <p className="font-inter text-xs text-white/30 mt-1">JPG, PNG, WebP — max 10MB — uploads to ImgBB (free)</p>
              <input
                ref={inputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp,image/gif"
                multiple
                className="hidden"
                onChange={(e) => handleFiles(e.target.files)}
              />
            </div>
          )}

          {uploadKeys.map((key) => (
            <div key={key} className="glass-dark rounded-xl p-3">
              <div className="flex items-center justify-between mb-1.5">
                <span className="font-inter text-xs text-white/60">Uploading to ImgBB...</span>
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
      ) : (
        <div className="space-y-2">
          <div className="flex gap-2">
            <input
              type="url"
              value={urlInput}
              onChange={(e) => { setUrlInput(e.target.value); setUrlError(""); }}
              onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addUrl())}
              placeholder="https://i.imgur.com/... or any direct image URL"
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
            Upload at{" "}
            <a href="https://imgbb.com" target="_blank" rel="noopener noreferrer" className="text-coral hover:underline">imgbb.com</a>
            {" "}or{" "}
            <a href="https://postimages.org" target="_blank" rel="noopener noreferrer" className="text-coral hover:underline">postimages.org</a>
            {" "}(both free), then paste the direct link above.
          </p>
        </div>
      )}

      {images.length > 0 && (
        <div className="flex flex-wrap gap-3 pt-1">
          {images.map((url, i) => (
            <div key={url} className="relative w-24 h-16 rounded-lg overflow-hidden group border border-white/10">
              <Image
                src={url}
                alt={`Image ${i + 1}`}
                fill
                className="object-cover"
                unoptimized
              />
              {justDone.includes(url) && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                  <CheckCircle size={20} className="text-green-400" />
                </div>
              )}
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
