"use client";
export const dynamic = "force-dynamic";
import { useEffect, useState } from "react";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { getAllOffers, createOffer, updateOffer, deleteOffer } from "@/lib/firestore";
import type { Offer } from "@/lib/types";
import { DOMAINS } from "@/lib/types";
import AdminHeader from "@/components/admin/AdminHeader";
import GlassButton from "@/components/ui/GlassButton";
import GlassModal from "@/components/ui/GlassModal";
import { GlassInput, GlassTextarea } from "@/components/ui/GlassInput";
import ImageUploader from "@/components/admin/ImageUploader";
import { toast } from "sonner";

const EMPTY: Omit<Offer, "id" | "createdAt"> = {
  title: "", description: "", discount: "", domains: [], validUntil: "", badge: "LIMITED TIME", imageUrl: "", active: true, sortOrder: 0,
};

export default function AdminOffersPage() {
  const [offers, setOffers] = useState<Offer[]>([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(false);
  const [form, setForm] = useState(EMPTY);
  const [editId, setEditId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  useEffect(() => { getAllOffers().then((o) => { setOffers(o); setLoading(false); }); }, []);

  function openAdd() { setForm(EMPTY); setEditId(null); setModal(true); }
  function openEdit(o: Offer) {
    setForm({ title: o.title, description: o.description, discount: o.discount, domains: o.domains, validUntil: o.validUntil, badge: o.badge, imageUrl: o.imageUrl || "", active: o.active, sortOrder: o.sortOrder });
    setEditId(o.id);
    setModal(true);
  }

  function toggleDomain(d: string) {
    setForm((f) => ({
      ...f,
      domains: f.domains.includes(d) ? f.domains.filter((x) => x !== d) : [...f.domains, d],
    }));
  }

  async function handleSave() {
    if (!form.title.trim()) { toast.error("Title is required."); return; }
    setSaving(true);
    try {
      if (editId) {
        await updateOffer(editId, form);
        setOffers((prev) => prev.map((o) => o.id === editId ? { ...o, ...form } : o));
        toast.success("Offer updated.");
      } else {
        const id = await createOffer(form);
        setOffers((prev) => [...prev, { id, ...form, createdAt: null as never }]);
        toast.success("Offer created.");
      }
      setModal(false);
    } catch { toast.error("Failed to save."); }
    finally { setSaving(false); }
  }

  async function handleDelete(id: string) {
    try { await deleteOffer(id); setOffers((prev) => prev.filter((o) => o.id !== id)); toast.success("Deleted."); }
    catch { toast.error("Failed."); }
    finally { setDeleteId(null); }
  }

  return (
    <>
      <AdminHeader title="Offers" />
      <div className="flex-1 p-6 pb-24 md:pb-6 space-y-6">
        <GlassButton variant="coral" size="sm" onClick={openAdd}><Plus size={16} /> Add Offer</GlassButton>

        <div className="grid gap-4">
          {loading ? (
            <div className="glass-dark rounded-2xl p-8 text-center font-inter text-sm text-white/40">Loading...</div>
          ) : offers.length === 0 ? (
            <div className="glass-dark rounded-2xl p-12 text-center font-inter text-sm text-white/40">No offers yet.</div>
          ) : offers.map((o) => (
            <div key={o.id} className="glass-dark rounded-2xl p-5 flex items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1 flex-wrap">
                  {o.badge && <span className="text-xs glass-coral text-white px-2 py-0.5 rounded-full font-inter">{o.badge}</span>}
                  {o.discount && <span className="text-xs bg-green-400/10 text-green-400 px-2 py-0.5 rounded-full font-inter font-bold">{o.discount}</span>}
                  <span className={`text-xs px-2 py-0.5 rounded-full font-inter ${o.active ? "bg-green-400/10 text-green-400" : "bg-white/10 text-white/40"}`}>
                    {o.active ? "Active" : "Hidden"}
                  </span>
                </div>
                <h3 className="font-inter text-sm font-medium text-white">{o.title}</h3>
                <p className="font-inter text-xs text-white/50 mt-0.5 line-clamp-2">{o.description}</p>
                {o.validUntil && <p className="font-inter text-xs text-amber-400/70 mt-1">Valid until: {o.validUntil}</p>}
                {o.domains.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-2">
                    {o.domains.map((d) => <span key={d} className="text-xs bg-white/5 text-white/40 px-2 py-0.5 rounded-full font-inter">{d}</span>)}
                  </div>
                )}
              </div>
              <div className="flex gap-2 shrink-0">
                <button onClick={() => openEdit(o)} className="text-white/40 hover:text-coral transition-colors cursor-pointer"><Pencil size={15} /></button>
                <button onClick={() => setDeleteId(o.id)} className="text-white/40 hover:text-red-400 transition-colors cursor-pointer"><Trash2 size={15} /></button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <GlassModal open={modal} onClose={() => setModal(false)} title={editId ? "Edit Offer" : "Add Offer"}>
        <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-1">
          <GlassInput label="Title *" placeholder="e.g. Student Project Special" value={form.title} onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))} />
          <GlassTextarea label="Description" placeholder="Describe the offer..." value={form.description} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))} rows={3} />
          <div className="grid grid-cols-2 gap-3">
            <GlassInput label="Discount" placeholder="e.g. 20% OFF" value={form.discount} onChange={(e) => setForm((f) => ({ ...f, discount: e.target.value }))} />
            <GlassInput label="Badge" placeholder="e.g. LIMITED TIME" value={form.badge} onChange={(e) => setForm((f) => ({ ...f, badge: e.target.value }))} />
          </div>
          <GlassInput label="Valid Until" placeholder="e.g. July 31, 2026" value={form.validUntil} onChange={(e) => setForm((f) => ({ ...f, validUntil: e.target.value }))} />
          <div>
            <label className="text-xs font-inter font-medium text-white/70 block mb-1.5">Offer Image (optional)</label>
            <ImageUploader
              projectId={editId || "new-offer"}
              images={form.imageUrl ? [form.imageUrl] : []}
              onChange={(imgs) => setForm((f) => ({ ...f, imageUrl: imgs[0] || "" }))}
            />
          </div>
          <div>
            <label className="text-xs font-inter font-medium text-white/70 block mb-2">Applicable Domains (select all that apply)</label>
            <div className="flex flex-wrap gap-2">
              {DOMAINS.map((d) => (
                <button
                  key={d}
                  type="button"
                  onClick={() => toggleDomain(d)}
                  className={`text-xs px-3 py-1.5 rounded-full font-inter transition-all cursor-pointer ${
                    form.domains.includes(d) ? "glass-coral text-white" : "glass-dark text-white/50 hover:text-white"
                  }`}
                >
                  {d}
                </button>
              ))}
            </div>
          </div>
          <label className="flex items-center gap-3 cursor-pointer">
            <div onClick={() => setForm((f) => ({ ...f, active: !f.active }))}
              className={`w-10 h-5 rounded-full transition-all relative cursor-pointer ${form.active ? "bg-coral" : "bg-white/20"}`}>
              <span className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-all ${form.active ? "left-5" : "left-0.5"}`} />
            </div>
            <span className="font-inter text-sm text-white/70">Show on website</span>
          </label>
          <div className="flex gap-3 pt-2">
            <GlassButton variant="light" onClick={() => setModal(false)}>Cancel</GlassButton>
            <GlassButton variant="coral" loading={saving} onClick={handleSave}>{editId ? "Update" : "Create Offer"}</GlassButton>
          </div>
        </div>
      </GlassModal>

      <GlassModal open={!!deleteId} onClose={() => setDeleteId(null)} title="Delete Offer">
        <p className="font-inter text-body mb-6">Remove this offer from the website?</p>
        <div className="flex gap-3">
          <GlassButton variant="light" onClick={() => setDeleteId(null)}>Cancel</GlassButton>
          <GlassButton variant="coral" onClick={() => deleteId && handleDelete(deleteId)} className="!bg-red-500/80">Delete</GlassButton>
        </div>
      </GlassModal>
    </>
  );
}
