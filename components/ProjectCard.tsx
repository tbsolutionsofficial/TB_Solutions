import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Play } from "lucide-react";
import type { Project } from "@/lib/types";
import GlassBadge from "@/components/ui/GlassBadge";
import DomainIcon from "@/components/DomainIcon";

export default function ProjectCard({ project }: { project: Project }) {
  const hasImages = project.images.length > 0;

  return (
    <Link href={`/projects/${project.id}`} className="block group">
      <div className="glass-light glass-shimmer relative rounded-2xl overflow-hidden hover:-translate-y-1.5 transition-all duration-200 hover:shadow-2xl cursor-pointer">
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
      </div>
    </Link>
  );
}
