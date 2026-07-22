"use client";
export const dynamic = "force-dynamic";

import { useState, useEffect } from "react";
import { Plus, Trash2, Upload } from "lucide-react";
import { toast } from "sonner";
import { getGalleryItems, createGalleryItem, deleteGalleryItem } from "@/lib/firestore";
import type { GalleryItem } from "@/lib/types";

const IMGBB_KEY = process.env.NEXT_PUBLIC_IMGBB_API_KEY ?? "";
const CATEGORIES = ["AI", "Robotics", "IoT", "Drones", "Software"] as const;

async function uploadToImgBB(file: File): Promise<string> {
  const form = new FormData();
  form.append("image", file);
  const res = await fetch(`https://api.imgbb.com/1/upload?key=${IMGBB_KEY}`, { method: "POST", body: form });
  if (!res.ok) throw new Error("ImgBB upload failed");
  const json = await res.json();
  return json.data.url as string;
}

export default function AdminGalleryPage() {
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [form, setForm] = useState({ title: "", category: "AI" as (typeof CATEGORIES)[number], type: "image" as "image" | "video" });

  useEffect(() => {
    getGalleryItems()
      .then((g) => { setItems(g); setLoading(false); })
      .catch(() => { toast.error("Failed to load gallery"); setLoading(false); });
  }, []);

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!form.title.trim()) { toast.error("Enter a title first"); return; }
    setUploading(true);
    try {
      const src = await uploadToImgBB(file);
      const id = await createGalleryItem({
        src,
        title: form.title,
        category: form.category,
        type: form.type,
        span: "sm",
        sortOrder: items.length,
      });
      setItems((prev) => [...prev, { id, src, title: form.title, category: form.category, type: form.type, span: "sm", sortOrder: prev.length, createdAt: null as never }]);
      setForm({ title: "", category: "AI", type: "image" });
      toast.success("Image uploaded and saved");
    } catch {
      toast.error("Upload failed");
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  }

  async function remove(id: string) {
    if (!confirm("Delete this gallery item?")) return;
    await deleteGalleryItem(id);
    setItems((prev) => prev.filter((i) => i.id !== id));
    toast.success("Deleted");
  }

  if (loading) return <div className="p-8 text-muted-foreground">Loading gallery…</div>;

  return (
    <div className="p-4 sm:p-8">
      <h1 className="mb-6 font-display text-2xl font-bold text-foreground">Gallery</h1>

      <div className="mb-8 rounded-2xl glass p-5 sm:p-6">
        <h2 className="mb-4 font-semibold text-foreground">Upload new item</h2>
        <div className="grid gap-4 sm:grid-cols-3">
          <div>
            <label className="mb-1 block text-xs font-semibold text-muted-foreground uppercase tracking-wide">Title</label>
            <input
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              placeholder="Project name"
              className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-semibold text-muted-foreground uppercase tracking-wide">Category</label>
            <select
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value as (typeof CATEGORIES)[number] })}
              className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary"
            >
              {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <label className="mb-1 block text-xs font-semibold text-muted-foreground uppercase tracking-wide">Type</label>
            <select
              value={form.type}
              onChange={(e) => setForm({ ...form, type: e.target.value as "image" | "video" })}
              className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary"
            >
              <option value="image">Image</option>
              <option value="video">Video</option>
            </select>
          </div>
        </div>
        <label className={`mt-4 inline-flex cursor-pointer items-center gap-2 rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition-opacity ${uploading ? "opacity-60 pointer-events-none" : ""}`}>
          {uploading ? <><Upload className="h-4 w-4 animate-bounce" /> Uploading…</> : <><Plus className="h-4 w-4" /> Choose & Upload</>}
          <input type="file" accept="image/*,video/*" onChange={handleFileChange} className="sr-only" disabled={uploading} />
        </label>
      </div>

      {items.length === 0 ? (
        <div className="rounded-2xl glass p-12 text-center text-muted-foreground">
          No gallery items yet. Upload the first one above.
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {items.map((item) => (
            <div key={item.id} className="group relative overflow-hidden rounded-2xl glass aspect-square">
              {item.type === "video" ? (
                <video src={item.src} className="h-full w-full object-cover" muted playsInline />
              ) : (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={item.src} alt={item.title} className="h-full w-full object-cover" loading="lazy" />
              )}
              <div className="absolute inset-0 flex flex-col justify-between bg-espresso/0 p-3 transition-colors group-hover:bg-espresso/70">
                <button
                  onClick={() => remove(item.id)}
                  className="ml-auto opacity-0 rounded-full bg-destructive p-1.5 text-white transition-opacity group-hover:opacity-100"
                  aria-label="Delete"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
                <div className="translate-y-2 opacity-0 transition-all group-hover:translate-y-0 group-hover:opacity-100">
                  <p className="text-sm font-semibold text-white">{item.title}</p>
                  <p className="text-xs text-white/70">{item.category}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
