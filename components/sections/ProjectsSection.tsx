"use client";
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useInView } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { Play, ArrowRight } from "lucide-react";
import { DOMAINS, type Project } from "@/lib/types";
import { getProjects } from "@/lib/firestore";
import DomainIcon from "@/components/DomainIcon";
import GlassBadge from "@/components/ui/GlassBadge";
import type { QueryDocumentSnapshot } from "firebase/firestore";

interface ProjectsSectionProps {
  initialFilter?: string;
}

function ProjectSkeleton() {
  return (
    <div className="glass-light rounded-2xl overflow-hidden">
      <div className="skeleton aspect-video w-full rounded-t-2xl" style={{ background: "rgba(200,190,180,0.3)" }} />
      <div className="p-6 space-y-3">
        <div className="skeleton h-4 w-24 rounded-full" style={{ background: "rgba(200,190,180,0.3)" }} />
        <div className="skeleton h-6 w-3/4 rounded" style={{ background: "rgba(200,190,180,0.3)" }} />
        <div className="skeleton h-4 w-full rounded" style={{ background: "rgba(200,190,180,0.3)" }} />
        <div className="skeleton h-4 w-2/3 rounded" style={{ background: "rgba(200,190,180,0.3)" }} />
      </div>
    </div>
  );
}

function ProjectCard({ project }: { project: Project }) {
  const hasImages = project.images.length > 0;

  return (
    <Link href={`/projects/${project.id}`} className="block group">
      <motion.div
        layout
        className="glass-light glass-shimmer relative rounded-2xl overflow-hidden hover:-translate-y-1.5 transition-all duration-200 hover:shadow-2xl cursor-pointer"
      >
        {/* Image / Placeholder */}
        <div className="relative aspect-video w-full overflow-hidden">
          {hasImages ? (
            <Image src={project.images[0]} alt={project.title} fill className="object-cover" />
          ) : (
            <div className="absolute inset-0 mesh-bg flex items-center justify-center">
              <div className="text-coral/40">
                <DomainIcon domain={project.domain} size={48} />
              </div>
            </div>
          )}
          {project.videoUrl && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="glass-dark text-white rounded-full p-3">
                <Play size={20} fill="white" />
              </div>
            </div>
          )}
        </div>

        <div className="p-6">
          <GlassBadge variant="coral" className="mb-3 text-xs">{project.domain}</GlassBadge>
          <h3 className="font-cormorant text-[22px] text-ink leading-snug mb-1">{project.title}</h3>
          <p className="font-inter text-xs text-muted mb-3">{project.client}</p>
          <p className="font-inter text-sm text-body line-clamp-2 mb-4">{project.description}</p>

          {/* Tags */}
          {project.tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mb-4">
              {project.tags.slice(0, 3).map((tag) => (
                <span key={tag} className="glass-light text-muted text-xs px-2.5 py-0.5 rounded-full border border-hairline">
                  {tag}
                </span>
              ))}
              {project.tags.length > 3 && (
                <span className="text-muted text-xs px-2 py-0.5">+{project.tags.length - 3} more</span>
              )}
            </div>
          )}

          {project.outcome && (
            <p className="font-inter text-sm text-coral font-medium mb-4">{project.outcome}</p>
          )}

          <div className="flex items-center justify-between border-t border-hairline pt-4">
            <span className="font-inter text-xs text-muted">
              {project.createdAt?.toDate?.()
                ? project.createdAt.toDate().toLocaleDateString("en-IN", { month: "short", year: "numeric" })
                : "—"}
            </span>
            <span className="font-inter text-sm text-coral font-medium flex items-center gap-1 group-hover:gap-2 transition-all">
              View Details <ArrowRight size={14} />
            </span>
          </div>
        </div>
      </motion.div>
    </Link>
  );
}

export default function ProjectsSection({ initialFilter }: ProjectsSectionProps) {
  const [activeFilter, setActiveFilter] = useState(initialFilter ?? "All");
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [hasMore, setHasMore] = useState(false);
  const [lastDoc, setLastDoc] = useState<QueryDocumentSnapshot | null>(null);
  const [loadingMore, setLoadingMore] = useState(false);

  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  const filters = ["All", ...DOMAINS];

  useEffect(() => {
    if (initialFilter) setActiveFilter(initialFilter);
  }, [initialFilter]);

  useEffect(() => {
    loadProjects(activeFilter, true);
  }, [activeFilter]);

  async function loadProjects(filter: string, reset: boolean) {
    if (reset) setLoading(true);
    const result = await getProjects(filter === "All" ? undefined : filter, 6, reset ? undefined : lastDoc ?? undefined);
    if (reset) {
      setProjects(result.projects);
    } else {
      setProjects((prev) => [...prev, ...result.projects]);
    }
    setLastDoc(result.lastDoc);
    setHasMore(result.hasMore);
    setLoading(false);
    setLoadingMore(false);
  }

  async function handleLoadMore() {
    setLoadingMore(true);
    await loadProjects(activeFilter, false);
  }

  return (
    <section id="projects" className="relative py-24 px-6">
      <div className="absolute inset-0 mesh-bg -z-10" />

      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 40 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h2 className="font-cormorant text-[clamp(36px,6vw,56px)] text-ink tracking-[-1px] mb-3">
            Our Work Speaks
          </h2>
          <p className="font-inter text-body text-lg">Real projects. Real results.</p>
        </motion.div>

        {/* Filter Bar */}
        <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-2 mb-10 justify-start lg:justify-center">
          {filters.map((f) => (
            <button
              key={f}
              onClick={() => setActiveFilter(f)}
              className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-inter font-medium transition-all duration-200 cursor-pointer ${
                activeFilter === f
                  ? "glass-coral text-white"
                  : "glass-light text-body hover:text-ink"
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        {/* Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <ProjectSkeleton key={i} />
            ))}
          </div>
        ) : projects.length === 0 ? (
          <div className="glass-light rounded-2xl p-16 text-center max-w-lg mx-auto">
            <p className="font-cormorant text-2xl text-muted">Projects coming soon.</p>
          </div>
        ) : (
          <AnimatePresence mode="wait">
            <motion.div
              key={activeFilter}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {projects.map((project, i) => (
                <motion.div
                  key={project.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.08, duration: 0.4 }}
                >
                  <ProjectCard project={project} />
                </motion.div>
              ))}
            </motion.div>
          </AnimatePresence>
        )}

        {/* Load More */}
        {hasMore && !loading && (
          <div className="flex justify-center mt-10">
            <button
              onClick={handleLoadMore}
              disabled={loadingMore}
              className="glass-light text-body font-inter font-medium px-8 py-3.5 rounded-full hover:brightness-105 active:scale-95 transition-all cursor-pointer disabled:opacity-60"
            >
              {loadingMore ? "Loading..." : "Load More Projects"}
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
