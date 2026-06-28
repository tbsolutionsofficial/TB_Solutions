"use client";
export const dynamic = "force-dynamic";
import { useEffect, useState } from "react";
import { Plus, Pencil, Trash2, GripVertical } from "lucide-react";
import { getAllBanners, createBanner, updateBanner, deleteBanner, reorderBanners } from "@/lib/firestore";
import type { Banner } from "@/lib/types";
import { DOMAINS } from "@/lib/types";
import AdminHeader from "@/components/admin/AdminHeader";
import GlassButton from "@/components/ui/GlassButton";
import GlassModal from "@/components/ui/GlassModal";
import { GlassInput, GlassTextarea } from "@/components/ui/GlassInput";
import { toast } from "sonner";
import {
  DndContext, closestCenter, PointerSensor, KeyboardSensor,
  useSensor, useSensors, type DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext, sortableKeyboardCoordinates, useSortable,
  verticalListSortingStrategy, arrayMove,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

const EMPTY: Omit<Banner, "id" | "createdAt"> = {
  title: "", subtitle: "", domain: DOMAINS[0], imageUrl: "", ctaText: "Start Project", active: true, sortOrder: 0,
};

function BannerRow({ b, onEdit, onDelete }: { b: Banner; onEdit: (b: Banner) => void; onDelete: (id: string) => void }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: b.id });
  return (
    <tr ref={setNodeRef} style={{ transform: CSS.Transform.toString(transform), transition, opacity: isDragging ? 0.5 : 1 }}
      className="border-b border-white/5 hover:bg-white/5">
      <td className="px-3 py-3 w-8">
        <button {...attributes} {...listeners} className="text-white/30 hover:text-white/70 cursor-grab touch-none">
          <GripVertical size={15} />
        </button>
      </td>
      <td className="px-3 py-3">
        <p className="font-inter text-sm text-white font-medium">{b.title}</p>
        <p className="font-inter text-xs text-white/40 mt-0.5">{b.subtitle}</p>
      </td>
      <td className="px-3 py-3">
        <span className="text-xs glass-coral text-white px-2.5 py-1 rounded-full font-inter">{b.domain.split(" ")[0]}</span>
      </td>
      <td className="px-3 py-3 font-inter text-sm text-white/60">{b.ctaText}</td>
      <td className="px-3 py-3">
        <span className={`text-xs px-2.5 py-1 rounded-full font-inter ${b.active ? "bg-green-400/10 text-green-400" : "bg-white/10 text-white/40"}`}>
          {b.active ? "Active" : "Hidden"}
        </span>
      </td>
      <td className="px-3 py-3">
        <div className="flex gap-2">
          <button onClick={() => onEdit(b)} className="text-white/40 hover:text-coral transition-colors cursor-pointer"><Pencil size={15} /></button>
          <button onClick={() => onDelete(b.id)} className="text-white/40 hover:text-red-400 transition-colors cursor-pointer"><Trash2 size={15} /></button>
        </div>
      </td>
    </tr>
  );
}

export default function AdminBannersPage() {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(false);
  const [form, setForm] = useState(EMPTY);
  const [editId, setEditId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  useEffect(() => { getAllBanners().then((b) => { setBanners(b); setLoading(false); }); }, []);

  function openAdd() { setForm(EMPTY); setEditId(null); setModal(true); }
  function openEdit(b: Banner) { setForm({ title: b.title, subtitle: b.subtitle, domain: b.domain, imageUrl: b.imageUrl || "", ctaText: b.ctaText, active: b.active, sortOrder: b.sortOrder }); setEditId(b.id); setModal(true); }

  async function handleSave() {
    if (!form.title.trim()) { toast.error("Title is required."); return; }
    setSaving(true);
    try {
      if (editId) {
        await updateBanner(editId, form);
        setBanners((prev) => prev.map((b) => b.id === editId ? { ...b, ...form } : b));
        toast.success("Banner updated.");
      } else {
        const id = await createBanner(form);
        setBanners((prev) => [...prev, { id, ...form, createdAt: null as never }]);
        toast.success("Banner created.");
      }
      setModal(false);
    } catch { toast.error("Failed to save."); }
    finally { setSaving(false); }
  }

  async function handleDelete(id: string) {
    try { await deleteBanner(id); setBanners((prev) => prev.filter((b) => b.id !== id)); toast.success("Deleted."); }
    catch { toast.error("Failed to delete."); }
    finally { setDeleteId(null); }
  }

  async function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const reordered = arrayMove(banners, banners.findIndex((b) => b.id === active.id), banners.findIndex((b) => b.id === over.id));
    setBanners(reordered);
    await reorderBanners(reordered.map((b) => b.id));
    toast.success("Order saved.");
  }

  return (
    <>
      <AdminHeader title="Banners" />
      <div className="flex-1 p-6 pb-24 md:pb-6 space-y-6">
        <div className="flex items-center justify-between">
          <GlassButton variant="coral" size="sm" onClick={openAdd}><Plus size={16} /> Add Banner</GlassButton>
          {!loading && banners.length > 1 && <p className="text-xs text-white/40 font-inter"><GripVertical size={12} className="inline mr-1" />Drag to reorder</p>}
        </div>

        <div className="glass-dark rounded-2xl overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/10">
                {["", "Title / Subtitle", "Domain", "CTA", "Status", "Actions"].map((h) => (
                  <th key={h} className="px-3 py-3 text-left font-inter text-xs text-white/40 uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            {loading ? (
              <tbody><tr><td colSpan={6} className="px-6 py-12 text-center font-inter text-sm text-white/40">Loading...</td></tr></tbody>
            ) : banners.length === 0 ? (
              <tbody><tr><td colSpan={6} className="px-6 py-12 text-center font-inter text-sm text-white/40">No banners yet. Add your first banner above.</td></tr></tbody>
            ) : (
              <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                <SortableContext items={banners.map((b) => b.id)} strategy={verticalListSortingStrategy}>
                  <tbody>
                    {banners.map((b) => <BannerRow key={b.id} b={b} onEdit={openEdit} onDelete={setDeleteId} />)}
                  </tbody>
                </SortableContext>
              </DndContext>
            )}
          </table>
        </div>
      </div>

      {/* Add/Edit Modal */}
      <GlassModal open={modal} onClose={() => setModal(false)} title={editId ? "Edit Banner" : "Add Banner"}>
        <div className="space-y-4">
          <GlassInput label="Title *" placeholder="e.g. AI Projects at 20% Off" value={form.title} onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))} />
          <GlassInput label="Subtitle" placeholder="Short description" value={form.subtitle} onChange={(e) => setForm((f) => ({ ...f, subtitle: e.target.value }))} />
          <div>
            <label className="text-xs font-inter font-medium text-white/70 block mb-1.5">Domain</label>
            <select
              value={form.domain}
              onChange={(e) => setForm((f) => ({ ...f, domain: e.target.value }))}
              className="w-full glass-dark rounded-xl px-4 py-2.5 text-sm font-inter text-white outline-none focus:ring-2 focus:ring-coral"
            >
              {DOMAINS.map((d) => <option key={d} value={d}>{d}</option>)}
            </select>
          </div>
          <GlassInput label="Image URL (optional)" placeholder="https://..." value={form.imageUrl || ""} onChange={(e) => setForm((f) => ({ ...f, imageUrl: e.target.value }))} />
          <GlassInput label="CTA Button Text" placeholder="e.g. Start Project" value={form.ctaText} onChange={(e) => setForm((f) => ({ ...f, ctaText: e.target.value }))} />
          <label className="flex items-center gap-3 cursor-pointer">
            <div
              onClick={() => setForm((f) => ({ ...f, active: !f.active }))}
              className={`w-10 h-5 rounded-full transition-all relative cursor-pointer ${form.active ? "bg-coral" : "bg-white/20"}`}
            >
              <span className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-all ${form.active ? "left-5" : "left-0.5"}`} />
            </div>
            <span className="font-inter text-sm text-white/70">Show on website</span>
          </label>
          <div className="flex gap-3 pt-2">
            <GlassButton variant="light" onClick={() => setModal(false)}>Cancel</GlassButton>
            <GlassButton variant="coral" loading={saving} onClick={handleSave}>
              {editId ? "Update Banner" : "Create Banner"}
            </GlassButton>
          </div>
        </div>
      </GlassModal>

      <GlassModal open={!!deleteId} onClose={() => setDeleteId(null)} title="Delete Banner">
        <p className="font-inter text-body mb-6">This will remove the banner from the website.</p>
        <div className="flex gap-3">
          <GlassButton variant="light" onClick={() => setDeleteId(null)}>Cancel</GlassButton>
          <GlassButton variant="coral" onClick={() => deleteId && handleDelete(deleteId)} className="!bg-red-500/80">Delete</GlassButton>
        </div>
      </GlassModal>
    </>
  );
}
