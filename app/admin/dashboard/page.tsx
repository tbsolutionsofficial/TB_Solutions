"use client";
export const dynamic = "force-dynamic";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Plus, Star, Clock } from "lucide-react";
import { getAllProjects, getAllReviews, approveReview, deleteReview } from "@/lib/firestore";
import { seedDatabase } from "@/lib/seed";
import type { Project, Review } from "@/lib/types";
import AdminHeader from "@/components/admin/AdminHeader";
import GlassButton from "@/components/ui/GlassButton";
import { toast } from "sonner";
import GlassModal from "@/components/ui/GlassModal";

export default function DashboardPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  useEffect(() => {
    Promise.all([getAllProjects(), getAllReviews()]).then(([p, r]) => {
      setProjects(p);
      setReviews(r);
      setLoading(false);
    });
  }, []);

  const pending = reviews.filter((r) => !r.approved);
  const approved = reviews.filter((r) => r.approved);
  const domains = new Set(projects.map((p) => p.domain)).size;

  async function handleApprove(id: string) {
    await approveReview(id);
    setReviews((prev) => prev.map((r) => r.id === id ? { ...r, approved: true } : r));
    toast.success("Review approved and live on site.");
  }

  async function handleDelete(id: string) {
    await deleteReview(id);
    setReviews((prev) => prev.filter((r) => r.id !== id));
    setDeleteId(null);
    toast.success("Review deleted.");
  }

  const STATS = [
    { label: "Total Projects", value: projects.length, color: "text-coral" },
    { label: "Pending Reviews", value: pending.length, color: "text-amber-400" },
    { label: "Approved Reviews", value: approved.length, color: "text-green-400" },
    { label: "Domains Active", value: domains, color: "text-blue-400" },
  ];

  return (
    <>
      <AdminHeader title="Dashboard" />
      <div className="flex-1 p-6 pb-24 md:pb-6 space-y-8">
        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {STATS.map((s) => (
            <div key={s.label} className="glass-dark rounded-2xl p-6">
              <div className={`font-cormorant text-4xl ${s.color} mb-1`}>
                {loading ? "—" : s.value}
              </div>
              <div className="font-inter text-xs text-white/50">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="flex flex-wrap gap-3">
          <Link href="/admin/projects/new">
            <GlassButton variant="coral" size="sm">
              <Plus size={16} /> Add New Project
            </GlassButton>
          </Link>
          <Link href="/admin/reviews">
            <GlassButton variant="dark" size="sm">
              <Star size={16} /> Review Approvals
            </GlassButton>
          </Link>
          {projects.length === 0 && !loading && (
            <GlassButton
              variant="ghost"
              size="sm"
              className="border-coral/40 text-coral"
              onClick={async () => {
                try {
                  await seedDatabase();
                  toast.success("Sample data loaded! Refresh to see it.");
                  const [p, r] = await Promise.all([getAllProjects(), getAllReviews()]);
                  setProjects(p);
                  setReviews(r);
                } catch {
                  toast.error("Seed failed. Check Firebase connection.");
                }
              }}
            >
              ✦ Load Sample Data
            </GlassButton>
          )}
        </div>

        {/* Recent Projects */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-cormorant text-xl text-white">Recent Projects</h2>
            <Link href="/admin/projects" className="font-inter text-xs text-coral hover:underline">
              View all →
            </Link>
          </div>
          <div className="glass-dark rounded-2xl overflow-hidden">
            {projects.slice(0, 5).map((p, i) => (
              <div
                key={p.id}
                className={`flex items-center gap-4 px-6 py-4 ${i > 0 ? "border-t border-white/5" : ""} hover:bg-white/5 transition-colors`}
              >
                <div className="flex-1 min-w-0">
                  <p className="font-inter text-sm text-white truncate">{p.title}</p>
                  <p className="font-inter text-xs text-white/40">{p.domain} · {p.client}</p>
                </div>
                <span className={`text-xs px-2.5 py-1 rounded-full font-inter ${
                  p.status === "completed" ? "bg-green-400/10 text-green-400" : "bg-amber-400/10 text-amber-400"
                }`}>
                  {p.status}
                </span>
                <Link href={`/admin/projects/${p.id}/edit`} className="text-white/40 hover:text-coral transition-colors text-sm font-inter">
                  Edit
                </Link>
              </div>
            ))}
            {!loading && projects.length === 0 && (
              <div className="px-6 py-8 text-center font-inter text-sm text-white/40">No projects yet.</div>
            )}
          </div>
        </div>

        {/* Pending Reviews */}
        {pending.length > 0 && (
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Clock size={18} className="text-amber-400" />
              <h2 className="font-cormorant text-xl text-white">Pending Reviews ({pending.length})</h2>
            </div>
            <div className="space-y-3">
              {pending.slice(0, 3).map((r) => (
                <div key={r.id} className="glass-dark rounded-2xl p-5">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="font-inter text-sm text-white font-medium">{r.name}</p>
                      <p className="font-inter text-xs text-white/40 mb-2">{r.role} · {r.college}</p>
                      <p className="font-inter text-sm text-white/70 line-clamp-2">&ldquo;{r.review}&rdquo;</p>
                    </div>
                    <div className="flex flex-col gap-2 flex-shrink-0">
                      <GlassButton variant="coral" size="sm" onClick={() => handleApprove(r.id)}>
                        Approve
                      </GlassButton>
                      <GlassButton
                        variant="ghost"
                        size="sm"
                        onClick={() => setDeleteId(r.id)}
                        className="text-red-400 border-red-400/30 hover:bg-red-400/10"
                      >
                        Delete
                      </GlassButton>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <GlassModal open={!!deleteId} onClose={() => setDeleteId(null)} title="Delete Review">
        <p className="font-inter text-body mb-6">Are you sure you want to delete this review? This cannot be undone.</p>
        <div className="flex gap-3">
          <GlassButton variant="ghost" onClick={() => setDeleteId(null)}>Cancel</GlassButton>
          <GlassButton variant="coral" onClick={() => deleteId && handleDelete(deleteId)} className="bg-red-500/80 hover:bg-red-500">
            Delete
          </GlassButton>
        </div>
      </GlassModal>
    </>
  );
}

