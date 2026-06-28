"use client";
export const dynamic = "force-dynamic";
import { useEffect, useState } from "react";
import { Mail, Phone, Trash2, Eye, EyeOff } from "lucide-react";
import { getAllContacts, markContactRead, deleteContact } from "@/lib/firestore";
import type { ContactSubmission } from "@/lib/types";
import AdminHeader from "@/components/admin/AdminHeader";
import GlassButton from "@/components/ui/GlassButton";
import GlassModal from "@/components/ui/GlassModal";
import { toast } from "sonner";

export default function AdminContactsPage() {
  const [contacts, setContacts] = useState<ContactSubmission[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<ContactSubmission | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  useEffect(() => { getAllContacts().then((c) => { setContacts(c); setLoading(false); }); }, []);

  async function handleOpen(c: ContactSubmission) {
    setSelected(c);
    if (!c.read) {
      await markContactRead(c.id);
      setContacts((prev) => prev.map((x) => x.id === c.id ? { ...x, read: true } : x));
    }
  }

  async function handleDelete(id: string) {
    try { await deleteContact(id); setContacts((prev) => prev.filter((c) => c.id !== id)); toast.success("Deleted."); }
    catch { toast.error("Failed to delete."); }
    finally { setDeleteId(null); setSelected(null); }
  }

  const unread = contacts.filter((c) => !c.read).length;

  return (
    <>
      <AdminHeader title={`Contacts${unread > 0 ? ` (${unread} new)` : ""}`} />
      <div className="flex-1 p-6 pb-24 md:pb-6 space-y-4">
        {loading ? (
          <div className="glass-dark rounded-2xl p-12 text-center font-inter text-sm text-white/40">Loading...</div>
        ) : contacts.length === 0 ? (
          <div className="glass-dark rounded-2xl p-12 text-center font-inter text-sm text-white/40">
            No contact submissions yet. They will appear here when someone fills the contact form.
          </div>
        ) : contacts.map((c) => (
          <div
            key={c.id}
            className={`glass-dark rounded-2xl p-5 cursor-pointer hover:bg-white/5 transition-colors border ${c.read ? "border-transparent" : "border-coral/30"}`}
            onClick={() => handleOpen(c)}
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  {!c.read && <span className="w-2 h-2 rounded-full bg-coral flex-shrink-0" />}
                  <p className="font-inter font-medium text-sm text-white">{c.name}</p>
                  <span className="text-xs glass-coral text-white px-2 py-0.5 rounded-full font-inter">{c.domain}</span>
                </div>
                <p className="font-inter text-xs text-white/50">{c.company} · {c.email}</p>
                <p className="font-inter text-xs text-white/30 mt-1 line-clamp-1">{c.message}</p>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                {c.read ? <EyeOff size={14} className="text-white/20" /> : <Eye size={14} className="text-coral" />}
                <button
                  onClick={(e) => { e.stopPropagation(); setDeleteId(c.id); }}
                  className="text-white/30 hover:text-red-400 transition-colors cursor-pointer"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Detail modal */}
      <GlassModal open={!!selected} onClose={() => setSelected(null)} title="Contact Message">
        {selected && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="glass-dark rounded-xl p-3">
                <p className="font-inter text-xs text-white/40 mb-0.5">Name</p>
                <p className="font-inter text-sm text-white font-medium">{selected.name}</p>
              </div>
              <div className="glass-dark rounded-xl p-3">
                <p className="font-inter text-xs text-white/40 mb-0.5">Domain</p>
                <p className="font-inter text-sm text-white">{selected.domain}</p>
              </div>
              <div className="glass-dark rounded-xl p-3">
                <p className="font-inter text-xs text-white/40 mb-0.5">College / Company</p>
                <p className="font-inter text-sm text-white">{selected.company}</p>
              </div>
              <div className="glass-dark rounded-xl p-3">
                <p className="font-inter text-xs text-white/40 mb-0.5">Phone</p>
                <a href={`tel:${selected.phone}`} className="font-inter text-sm text-coral hover:underline flex items-center gap-1">
                  <Phone size={12} />{selected.phone}
                </a>
              </div>
            </div>
            <div className="glass-dark rounded-xl p-3">
              <p className="font-inter text-xs text-white/40 mb-0.5">Email</p>
              <a href={`mailto:${selected.email}`} className="font-inter text-sm text-coral hover:underline flex items-center gap-1">
                <Mail size={12} />{selected.email}
              </a>
            </div>
            <div className="glass-dark rounded-xl p-3">
              <p className="font-inter text-xs text-white/40 mb-2">Message</p>
              <p className="font-inter text-sm text-white/80 leading-relaxed whitespace-pre-wrap">{selected.message}</p>
            </div>
            <div className="flex gap-3 pt-2">
              <a href={`mailto:${selected.email}`} className="flex-1">
                <GlassButton variant="coral" fullWidth>Reply via Email</GlassButton>
              </a>
              <GlassButton variant="light" onClick={() => { setDeleteId(selected.id); }}>Delete</GlassButton>
            </div>
          </div>
        )}
      </GlassModal>

      <GlassModal open={!!deleteId} onClose={() => setDeleteId(null)} title="Delete Message">
        <p className="font-inter text-body mb-6">Permanently delete this contact message?</p>
        <div className="flex gap-3">
          <GlassButton variant="light" onClick={() => setDeleteId(null)}>Cancel</GlassButton>
          <GlassButton variant="coral" onClick={() => deleteId && handleDelete(deleteId)} className="!bg-red-500/80">Delete</GlassButton>
        </div>
      </GlassModal>
    </>
  );
}
