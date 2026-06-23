"use client";
export const dynamic = "force-dynamic";
import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Plus, Pencil, Trash2, Search } from "lucide-react";
import { getAllProjects, deleteProject, updateProject } from "@/lib/firestore";
import { deleteImageByUrl } from "@/lib/storage";
import type { Project } from "@/lib/types";
import { DOMAINS } from "@/lib/types";
import AdminHeader from "@/components/admin/AdminHeader";
import GlassButton from "@/components/ui/GlassButton";
import GlassModal from "@/components/ui/GlassModal";
import { toast } from "sonner";
import DomainIcon from "@/components/DomainIcon";

const PAGE_SIZE = 10;

export default function AdminProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [domainFilter, setDomainFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [page, setPage] = useState(0);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    getAllProjects().then((p) => { setProjects(p); setLoading(false); });
  }, []);

  const filtered = projects.filter((p) => {
    const q = search.toLowerCase();
    const matchSearch = !q || p.title.toLowerCase().includes(q) || p.client.toLowerCase().includes(q) || p.domain.toLowerCase().includes(q);
    const matchDomain = domainFilter === "All" || p.domain === domainFilter;
    const matchStatus = statusFilter === "All" || p.status === statusFilter.toLowerCase();
    return matchSearch && matchDomain && matchStatus;
  });

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paginated = filtered.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE);

  async function handleDelete(id: string) {
    setDeleting(true);
    try {
      const p = projects.find((x) => x.id === id);
      if (p) {
        for (const url of p.images) await deleteImageByUrl(url);
      }
      await deleteProject(id);
      setProjects((prev) => prev.filter((x) => x.id !== id));
      toast.success("Project deleted.");
    } catch {
      toast.error("Failed to delete project.");
    } finally {
      setDeleting(false);
      setDeleteId(null);
    }
  }

  async function toggleFeatured(p: Project) {
    await updateProject(p.id, { featured: !p.featured });
    setProjects((prev) => prev.map((x) => x.id === p.id ? { ...x, featured: !x.featured } : x));
  }

  return (
    <>
      <AdminHeader title="Projects" />
      <div className="flex-1 p-6 pb-24 md:pb-6 space-y-6">
        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <Link href="/admin/projects/new">
            <GlassButton variant="coral" size="sm">
              <Plus size={16} /> Add New Project
            </GlassButton>
          </Link>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-3">
          <div className="relative flex-1 min-w-[200px]">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40" />
            <input
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(0); }}
              placeholder="Search projects..."
              className="w-full glass-dark rounded-full pl-9 pr-4 py-2.5 text-sm font-inter text-white placeholder:text-white/30 outline-none focus:ring-2 focus:ring-coral"
            />
          </div>
          <select
            value={domainFilter}
            onChange={(e) => { setDomainFilter(e.target.value); setPage(0); }}
            className="glass-dark rounded-full px-4 py-2.5 text-sm font-inter text-white/80 outline-none focus:ring-2 focus:ring-coral"
          >
            <option value="All">All Domains</option>
            {DOMAINS.map((d) => <option key={d} value={d}>{d}</option>)}
          </select>
          <select
            value={statusFilter}
            onChange={(e) => { setStatusFilter(e.target.value); setPage(0); }}
            className="glass-dark rounded-full px-4 py-2.5 text-sm font-inter text-white/80 outline-none focus:ring-2 focus:ring-coral"
          >
            <option value="All">All Status</option>
            <option value="Completed">Completed</option>
            <option value="Ongoing">Ongoing</option>
          </select>
        </div>

        {/* Table */}
        <div className="glass-dark rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/10">
                  {["#", "Image", "Title", "Domain", "Client", "Status", "Featured", "Actions"].map((h) => (
                    <th key={h} className="px-4 py-3 text-left font-inter text-xs text-white/40 uppercase tracking-wider">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  Array.from({ length: 5 }).map((_, i) => (
                    <tr key={i} className="border-b border-white/5">
                      {Array.from({ length: 8 }).map((_, j) => (
                        <td key={j} className="px-4 py-3">
                          <div className="skeleton h-4 rounded" style={{ background: "rgba(255,255,255,0.05)", width: j === 1 ? "48px" : "100%" }} />
                        </td>
                      ))}
                    </tr>
                  ))
                ) : paginated.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="px-6 py-12 text-center font-inter text-sm text-white/40">
                      No projects found.
                    </td>
                  </tr>
                ) : (
                  paginated.map((p, i) => (
                    <tr key={p.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                      <td className="px-4 py-3 font-inter text-xs text-white/40">{page * PAGE_SIZE + i + 1}</td>
                      <td className="px-4 py-3">
                        {p.images[0] ? (
                          <div className="relative w-12 h-9 rounded overflow-hidden">
                            <Image src={p.images[0]} alt="" fill className="object-cover" />
                          </div>
                        ) : (
                          <div className="w-12 h-9 rounded bg-white/5 flex items-center justify-center text-white/30">
                            <DomainIcon domain={p.domain} size={16} />
                          </div>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <Link href={`/admin/projects/${p.id}/edit`} className="font-inter text-sm text-white hover:text-coral transition-colors">
                          {p.title}
                        </Link>
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-xs glass-coral text-white px-2.5 py-1 rounded-full font-inter">
                          {p.domain.split(" ")[0]}
                        </span>
                      </td>
                      <td className="px-4 py-3 font-inter text-sm text-white/60">{p.client}</td>
                      <td className="px-4 py-3">
                        <span className={`text-xs px-2.5 py-1 rounded-full font-inter ${
                          p.status === "completed"
                            ? "bg-green-400/10 text-green-400"
                            : "bg-amber-400/10 text-amber-400"
                        }`}>
                          {p.status}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <button
                          onClick={() => toggleFeatured(p)}
                          className={`w-10 h-5 rounded-full transition-all cursor-pointer ${
                            p.featured ? "bg-coral" : "bg-white/20"
                          } relative`}
                        >
                          <span className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-all ${
                            p.featured ? "left-5" : "left-0.5"
                          }`} />
                        </button>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <Link href={`/admin/projects/${p.id}/edit`} className="text-white/40 hover:text-coral transition-colors">
                            <Pencil size={16} />
                          </Link>
                          <button onClick={() => setDeleteId(p.id)} className="text-white/40 hover:text-red-400 transition-colors cursor-pointer">
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 px-4 py-3 border-t border-white/10">
              {Array.from({ length: totalPages }, (_, i) => (
                <button
                  key={i}
                  onClick={() => setPage(i)}
                  className={`w-8 h-8 rounded-full text-sm font-inter transition-all cursor-pointer ${
                    page === i ? "glass-coral text-white" : "text-white/60 hover:bg-white/10"
                  }`}
                >
                  {i + 1}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      <GlassModal open={!!deleteId} onClose={() => setDeleteId(null)} title="Delete Project">
        <p className="font-inter text-body mb-6">
          This will permanently delete the project and all its images. This action cannot be undone.
        </p>
        <div className="flex gap-3">
          <GlassButton variant="light" onClick={() => setDeleteId(null)}>Cancel</GlassButton>
          <GlassButton
            variant="coral"
            loading={deleting}
            onClick={() => deleteId && handleDelete(deleteId)}
            className="!bg-red-500/80"
          >
            Delete Project
          </GlassButton>
        </div>
      </GlassModal>
    </>
  );
}

