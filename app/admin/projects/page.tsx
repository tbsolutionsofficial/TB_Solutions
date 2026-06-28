"use client";
export const dynamic = "force-dynamic";
import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { Plus, Pencil, Trash2, Search, GripVertical } from "lucide-react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
  arrayMove,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { getAllProjects, deleteProject, updateProject, reorderProjects } from "@/lib/firestore";
import { deleteImageByUrl } from "@/lib/storage";
import type { Project } from "@/lib/types";
import { DOMAINS } from "@/lib/types";
import AdminHeader from "@/components/admin/AdminHeader";
import GlassButton from "@/components/ui/GlassButton";
import GlassModal from "@/components/ui/GlassModal";
import { toast } from "sonner";
import DomainIcon from "@/components/DomainIcon";

function SortableRow({ p, index, onDelete, onToggleFeatured }: {
  p: Project;
  index: number;
  onDelete: (id: string) => void;
  onToggleFeatured: (p: Project) => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: p.id });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    background: isDragging ? "rgba(204,120,92,0.08)" : undefined,
  };

  return (
    <tr ref={setNodeRef} style={style} className="border-b border-white/5 hover:bg-white/5 transition-colors">
      <td className="px-2 py-3 w-8">
        <button
          {...attributes}
          {...listeners}
          className="text-white/30 hover:text-white/70 cursor-grab active:cursor-grabbing touch-none"
          aria-label="Drag to reorder"
        >
          <GripVertical size={16} />
        </button>
      </td>
      <td className="px-2 py-3 font-inter text-xs text-white/40 w-8">{index + 1}</td>
      <td className="px-3 py-3">
        {p.images[0] ? (
          <div className="relative w-12 h-9 rounded overflow-hidden">
            <Image src={p.images[0]} alt="" fill className="object-cover" unoptimized />
          </div>
        ) : (
          <div className="w-12 h-9 rounded bg-white/5 flex items-center justify-center text-white/30">
            <DomainIcon domain={p.domain} size={16} />
          </div>
        )}
      </td>
      <td className="px-3 py-3">
        <Link href={`/admin/projects/${p.id}/edit`} className="font-inter text-sm text-white hover:text-coral transition-colors line-clamp-2 max-w-[180px]">
          {p.title}
        </Link>
      </td>
      <td className="px-3 py-3">
        <span className="text-xs glass-coral text-white px-2.5 py-1 rounded-full font-inter whitespace-nowrap">
          {p.domain.split(" ")[0]}
        </span>
      </td>
      <td className="px-3 py-3 font-inter text-sm text-white/60 max-w-[160px] line-clamp-2">{p.client}</td>
      <td className="px-3 py-3">
        <span className={`text-xs px-2.5 py-1 rounded-full font-inter ${
          p.status === "completed" ? "bg-green-400/10 text-green-400" : "bg-amber-400/10 text-amber-400"
        }`}>
          {p.status}
        </span>
      </td>
      <td className="px-3 py-3">
        <button
          onClick={() => onToggleFeatured(p)}
          className={`w-10 h-5 rounded-full transition-all cursor-pointer relative ${p.featured ? "bg-coral" : "bg-white/20"}`}
        >
          <span className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-all ${p.featured ? "left-5" : "left-0.5"}`} />
        </button>
      </td>
      <td className="px-3 py-3">
        <div className="flex items-center gap-2">
          <Link href={`/admin/projects/${p.id}/edit`} className="text-white/40 hover:text-coral transition-colors">
            <Pencil size={16} />
          </Link>
          <button onClick={() => onDelete(p.id)} className="text-white/40 hover:text-red-400 transition-colors cursor-pointer">
            <Trash2 size={16} />
          </button>
        </div>
      </td>
    </tr>
  );
}

export default function AdminProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [domainFilter, setDomainFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [saving, setSaving] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

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

  // Only allow drag when not filtering (so order reflects actual sort)
  const isDragEnabled = !search && domainFilter === "All" && statusFilter === "All";

  async function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const oldIndex = projects.findIndex((p) => p.id === active.id);
    const newIndex = projects.findIndex((p) => p.id === over.id);
    const reordered = arrayMove(projects, oldIndex, newIndex);
    setProjects(reordered);
    setSaving(true);
    try {
      await reorderProjects(reordered.map((p) => p.id));
      toast.success("Order saved — changes are live on the site.");
    } catch {
      toast.error("Failed to save order.");
      setProjects(projects); // revert
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: string) {
    setDeleting(true);
    try {
      const p = projects.find((x) => x.id === id);
      if (p) for (const url of p.images) await deleteImageByUrl(url);
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

  const toggleFeatured = useCallback(async (p: Project) => {
    await updateProject(p.id, { featured: !p.featured });
    setProjects((prev) => prev.map((x) => x.id === p.id ? { ...x, featured: !x.featured } : x));
  }, []);

  return (
    <>
      <AdminHeader title="Projects" />
      <div className="flex-1 p-6 pb-24 md:pb-6 space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <Link href="/admin/projects/new">
            <GlassButton variant="coral" size="sm">
              <Plus size={16} /> Add New Project
            </GlassButton>
          </Link>
          {saving && <span className="text-xs font-inter text-coral animate-pulse">Saving order...</span>}
          {isDragEnabled && !loading && projects.length > 1 && (
            <p className="text-xs font-inter text-white/40">
              <GripVertical size={12} className="inline mr-1" />Drag rows to reorder — changes save instantly
            </p>
          )}
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-3">
          <div className="relative flex-1 min-w-[200px]">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search projects..."
              className="w-full glass-dark rounded-full pl-9 pr-4 py-2.5 text-sm font-inter text-white placeholder:text-white/30 outline-none focus:ring-2 focus:ring-coral"
            />
          </div>
          <select
            value={domainFilter}
            onChange={(e) => setDomainFilter(e.target.value)}
            className="glass-dark rounded-full px-4 py-2.5 text-sm font-inter text-white/80 outline-none focus:ring-2 focus:ring-coral"
          >
            <option value="All">All Domains</option>
            {DOMAINS.map((d) => <option key={d} value={d}>{d}</option>)}
          </select>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="glass-dark rounded-full px-4 py-2.5 text-sm font-inter text-white/80 outline-none focus:ring-2 focus:ring-coral"
          >
            <option value="All">All Status</option>
            <option value="Completed">Completed</option>
            <option value="Ongoing">Ongoing</option>
          </select>
        </div>

        {!isDragEnabled && search || domainFilter !== "All" || statusFilter !== "All" ? (
          <p className="text-xs font-inter text-white/30">Clear filters to enable drag-and-drop reordering.</p>
        ) : null}

        <div className="glass-dark rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/10">
                  {["", "#", "Image", "Title", "Domain", "Client", "Status", "Featured", "Actions"].map((h) => (
                    <th key={h} className="px-3 py-3 text-left font-inter text-xs text-white/40 uppercase tracking-wider">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              {loading ? (
                <tbody>
                  {Array.from({ length: 5 }).map((_, i) => (
                    <tr key={i} className="border-b border-white/5">
                      {Array.from({ length: 9 }).map((_, j) => (
                        <td key={j} className="px-3 py-3">
                          <div className="h-4 rounded" style={{ background: "rgba(255,255,255,0.05)", width: j === 2 ? "48px" : "80%" }} />
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              ) : filtered.length === 0 ? (
                <tbody>
                  <tr>
                    <td colSpan={9} className="px-6 py-12 text-center font-inter text-sm text-white/40">
                      No projects found.
                    </td>
                  </tr>
                </tbody>
              ) : isDragEnabled ? (
                <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                  <SortableContext items={projects.map((p) => p.id)} strategy={verticalListSortingStrategy}>
                    <tbody>
                      {projects.map((p, i) => (
                        <SortableRow
                          key={p.id}
                          p={p}
                          index={i}
                          onDelete={setDeleteId}
                          onToggleFeatured={toggleFeatured}
                        />
                      ))}
                    </tbody>
                  </SortableContext>
                </DndContext>
              ) : (
                <tbody>
                  {filtered.map((p, i) => (
                    <SortableRow
                      key={p.id}
                      p={p}
                      index={i}
                      onDelete={setDeleteId}
                      onToggleFeatured={toggleFeatured}
                    />
                  ))}
                </tbody>
              )}
            </table>
          </div>
        </div>
      </div>

      <GlassModal open={!!deleteId} onClose={() => setDeleteId(null)} title="Delete Project">
        <p className="font-inter text-body mb-6">
          This will permanently delete the project. This action cannot be undone.
        </p>
        <div className="flex gap-3">
          <GlassButton variant="light" onClick={() => setDeleteId(null)}>Cancel</GlassButton>
          <GlassButton variant="coral" loading={deleting} onClick={() => deleteId && handleDelete(deleteId)} className="!bg-red-500/80">
            Delete Project
          </GlassButton>
        </div>
      </GlassModal>
    </>
  );
}
