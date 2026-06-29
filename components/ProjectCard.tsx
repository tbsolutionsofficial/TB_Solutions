import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Play, Trophy } from "lucide-react";
import type { Project } from "@/lib/types";
import GlassBadge from "@/components/ui/GlassBadge";
import DomainIcon from "@/components/DomainIcon";

export default function ProjectCard({ project }: { project: Project }) {
  const hasImages = project.images.length > 0;

  return (
    <Link href={`/projects/${project.id}`} className="block group">
      <div className="glass-light glass-shimmer relative rounded-2xl overflow-hidden hover:-translate-y-2 transition-all duration-300 hover:shadow-2xl cursor-pointer h-full flex flex-col">
        {/* Image */}
        <div className="relative aspect-video w-full overflow-hidden flex-shrink-0">
          {hasImages ? (
            <Image src={project.images[0]} alt={project.title} fill className="object-cover group-hover:scale-105 transition-transform duration-500" unoptimized />
          ) : (
            <div className="absolute inset-0 mesh-bg flex items-center justify-center">
              <div className="text-coral/30">
                <DomainIcon domain={project.domain} size={52} />
              </div>
            </div>
          )}
          {project.videoUrl && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="glass-dark text-white rounded-full p-3 group-hover:scale-110 transition-transform">
                <Play size={20} fill="white" />
              </div>
            </div>
          )}
          {/* Status badge */}
          <div className="absolute top-3 left-3">
            <span className={`font-inter text-[10px] font-semibold px-2.5 py-1 rounded-full ${
              project.status === "completed"
                ? "bg-green-500/90 text-white"
                : "bg-amber-500/90 text-white"
            }`}>
              {project.status === "completed" ? "✓ Completed" : "● Ongoing"}
            </span>
          </div>
        </div>

        <div className="p-5 flex flex-col flex-1">
          <GlassBadge variant="coral" className="mb-2.5 text-xs self-start">{project.domain}</GlassBadge>
          <h3 className="font-cormorant font-semibold text-[21px] text-ink leading-snug mb-1">{project.title}</h3>
          <p className="font-inter text-xs text-muted mb-2.5">{project.client}</p>
          <p className="font-inter text-sm text-body line-clamp-2 leading-relaxed mb-3">{project.description}</p>

          {/* Outcome metric — highlighted */}
          {project.outcome && (
            <div className="flex items-center gap-1.5 bg-coral/8 border border-coral/15 rounded-xl px-3 py-2 mb-3">
              <Trophy size={12} className="text-coral flex-shrink-0" />
              <p className="font-inter text-xs text-coral font-semibold">{project.outcome}</p>
            </div>
          )}

          {/* Tech stack pills */}
          {project.tags && project.tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mb-3">
              {project.tags.slice(0, 4).map((tag) => (
                <span key={tag} className="font-inter text-[10px] font-medium bg-ink/6 text-muted px-2 py-0.5 rounded-full border border-hairline">
                  {tag}
                </span>
              ))}
              {project.tags.length > 4 && (
                <span className="font-inter text-[10px] text-muted/60 px-1 py-0.5">+{project.tags.length - 4}</span>
              )}
            </div>
          )}

          <div className="flex items-center justify-between border-t border-hairline pt-3 mt-auto">
            <span className="font-inter text-xs text-muted">
              {project.createdAt?.toDate?.()
                ? project.createdAt.toDate().toLocaleDateString("en-IN", { month: "short", year: "numeric" })
                : "—"}
            </span>
            <span className="font-inter text-sm text-coral font-semibold flex items-center gap-1 group-hover:gap-2 transition-all">
              View Details <ArrowRight size={14} />
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
