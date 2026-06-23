"use client";
export const dynamic = "force-dynamic";
import { useState, useEffect } from "react";
import { use } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight, ExternalLink } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { getProjectById, getRelatedProjects } from "@/lib/firestore";
import type { Project } from "@/lib/types";
import GlassNav from "@/components/ui/GlassNav";
import GlassBadge from "@/components/ui/GlassBadge";
import DomainIcon from "@/components/DomainIcon";
import Footer from "@/components/sections/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import Lightbox from "@/components/ui/Lightbox";
import ProjectCard from "@/components/ProjectCard";

export default function ProjectDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [project, setProject] = useState<Project | null | undefined>(undefined);
  const [related, setRelated] = useState<Project[]>([]);
  const [activeImage, setActiveImage] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  useEffect(() => {
    getProjectById(id).then((p) => {
      setProject(p);
      if (p) getRelatedProjects(p.domain, p.id).then(setRelated);
    });
  }, [id]);

  if (project === undefined) {
    return (
      <div className="min-h-screen mesh-bg flex items-center justify-center">
        <div className="glass-light rounded-2xl p-12 text-center">
          <div className="font-cormorant text-2xl text-muted">Loading project...</div>
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <>
        <GlassNav />
        <div className="min-h-screen mesh-bg flex items-center justify-center pt-24">
          <div className="glass-light rounded-3xl p-16 text-center max-w-lg">
            <h1 className="font-cormorant text-4xl text-ink mb-4">Project not found</h1>
            <p className="font-inter text-muted mb-8">This project may have been removed or doesn&apos;t exist.</p>
            <Link
              href="/#projects"
              className="glass-coral text-white font-inter px-6 py-3 rounded-full hover:brightness-110 transition-all"
            >
              ← Back to Projects
            </Link>
          </div>
        </div>
      </>
    );
  }

  const hasImages = project.images.length > 0;
  const embedUrl = project.videoUrl?.includes("watch?v=")
    ? project.videoUrl.replace("watch?v=", "embed/")
    : project.videoUrl;

  return (
    <>
      <GlassNav />

      <main className="pt-24 pb-16 min-h-screen">
        {/* Hero */}
        <section className="relative px-6 pb-12">
          <div className="absolute inset-0 mesh-bg -z-10" />
          <div className="max-w-6xl mx-auto">
            {/* Breadcrumb */}
            <div className="flex items-center gap-2 font-inter text-sm text-muted mb-6">
              <Link href="/" className="hover:text-coral transition-colors">Home</Link>
              <span>›</span>
              <Link href="/#projects" className="hover:text-coral transition-colors">Projects</Link>
              <span>›</span>
              <span className="text-ink">{project.title}</span>
            </div>

            <GlassBadge variant="coral" className="mb-4">{project.domain}</GlassBadge>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="font-cormorant text-[clamp(32px,6vw,56px)] text-ink tracking-[-1px] leading-tight mb-4 max-w-4xl"
            >
              {project.title}
            </motion.h1>

            <div className="flex flex-wrap items-center gap-4 font-inter text-sm text-muted mb-4">
              <span>{project.client}</span>
              <span>·</span>
              <span className={`px-3 py-1 rounded-full text-xs ${
                project.status === "completed"
                  ? "bg-green-100 text-green-700"
                  : "bg-amber-100 text-amber-700"
              }`}>
                {project.status === "completed" ? "Completed" : "Ongoing"}
              </span>
              {project.createdAt?.toDate?.() && (
                <>
                  <span>·</span>
                  <span>{project.createdAt.toDate().toLocaleDateString("en-IN", { month: "long", year: "numeric" })}</span>
                </>
              )}
            </div>

            {project.outcome && (
              <p className="font-cormorant text-2xl text-coral italic">{project.outcome}</p>
            )}
          </div>
        </section>

        {/* Content */}
        <section className="px-6 pb-16">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-8">
              {/* Left: Media + Description */}
              <div>
                {/* Media Gallery */}
                {hasImages && (
                  <div className="mb-8">
                    <div
                      className="relative aspect-video rounded-2xl overflow-hidden cursor-pointer mb-3"
                      onClick={() => setLightboxOpen(true)}
                    >
                      <AnimatePresence mode="wait">
                        <motion.div
                          key={activeImage}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: 0.3 }}
                          className="absolute inset-0"
                        >
                          <Image
                            src={project.images[activeImage]}
                            alt={`${project.title} - image ${activeImage + 1}`}
                            fill
                            className="object-cover"
                          />
                        </motion.div>
                      </AnimatePresence>
                      {/* Nav arrows */}
                      {project.images.length > 1 && (
                        <>
                          <button
                            onClick={(e) => { e.stopPropagation(); setActiveImage((i) => Math.max(0, i - 1)); }}
                            disabled={activeImage === 0}
                            className="absolute left-3 top-1/2 -translate-y-1/2 glass-dark text-white rounded-full p-2 disabled:opacity-30"
                          >
                            <ChevronLeft size={20} />
                          </button>
                          <button
                            onClick={(e) => { e.stopPropagation(); setActiveImage((i) => Math.min(project.images.length - 1, i + 1)); }}
                            disabled={activeImage === project.images.length - 1}
                            className="absolute right-3 top-1/2 -translate-y-1/2 glass-dark text-white rounded-full p-2 disabled:opacity-30"
                          >
                            <ChevronRight size={20} />
                          </button>
                        </>
                      )}
                    </div>

                    {/* Thumbnails */}
                    {project.images.length > 1 && (
                      <div className="flex gap-2 overflow-x-auto scrollbar-hide">
                        {project.images.map((img, i) => (
                          <button
                            key={i}
                            onClick={() => setActiveImage(i)}
                            className={`relative w-20 h-14 flex-shrink-0 rounded-lg overflow-hidden transition-all ${
                              i === activeImage ? "ring-2 ring-coral" : "opacity-60 hover:opacity-90"
                            }`}
                          >
                            <Image src={img} alt="" fill className="object-cover" />
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {!hasImages && (
                  <div className="aspect-video rounded-2xl mesh-bg flex items-center justify-center mb-8">
                    <div className="text-coral/30">
                      <DomainIcon domain={project.domain} size={64} />
                    </div>
                  </div>
                )}

                {/* Video */}
                {embedUrl && (
                  <div className="mb-8">
                    <iframe
                      src={embedUrl}
                      title="Project Video"
                      className="w-full aspect-video rounded-2xl border border-hairline"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      loading="lazy"
                    />
                  </div>
                )}

                {/* Description */}
                <div className="glass-light glass-shimmer relative rounded-2xl p-8 mb-6">
                  <h2 className="font-cormorant text-2xl text-ink mb-4">About This Project</h2>
                  <p className="font-inter text-base text-body leading-relaxed">{project.description}</p>
                </div>

                {/* Tags */}
                {project.tags.length > 0 && (
                  <div className="glass-light glass-shimmer relative rounded-2xl p-8">
                    <h2 className="font-cormorant text-2xl text-ink mb-4">Technologies Used</h2>
                    <div className="flex flex-wrap gap-2">
                      {project.tags.map((tag) => (
                        <span key={tag} className="glass-coral text-white font-inter text-sm px-4 py-1.5 rounded-full">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Right: Sidebar */}
              <div>
                <div className="glass-dark glass-shimmer relative rounded-2xl p-8 sticky top-28">
                  <div className="space-y-4 mb-8">
                    {[
                      { label: "Domain", value: project.domain },
                      { label: "Client", value: project.client },
                      { label: "Status", value: project.status === "completed" ? "Completed" : "Ongoing" },
                      project.createdAt?.toDate?.()
                        ? { label: "Date", value: project.createdAt.toDate().toLocaleDateString("en-IN", { month: "long", year: "numeric" }) }
                        : null,
                      project.outcome ? { label: "Outcome", value: project.outcome } : null,
                    ]
                      .filter(Boolean)
                      .map((item) => (
                        <div key={item!.label}>
                          <p className="font-inter text-xs text-white/40 uppercase tracking-wider mb-1">{item!.label}</p>
                          <p className="font-inter text-sm text-white/90">{item!.value}</p>
                        </div>
                      ))}
                  </div>

                  <div className="border-t border-white/10 pt-6">
                    <p className="font-cormorant text-lg text-white mb-4">Need a Similar Project?</p>
                    <Link
                      href="/#contact"
                      className="flex items-center justify-center gap-2 glass-coral text-white font-inter font-medium px-5 py-3 rounded-full hover:brightness-110 transition-all w-full"
                    >
                      <ExternalLink size={15} />
                      Let&apos;s Talk
                    </Link>
                  </div>
                </div>
              </div>
            </div>

            {/* Related Projects */}
            {related.length > 0 && (
              <div className="mt-16">
                <h2 className="font-cormorant text-3xl text-ink mb-8">More in {project.domain}</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {related.map((rp) => (
                    <ProjectCard key={rp.id} project={rp} />
                  ))}
                </div>
              </div>
            )}

            {/* Back */}
            <div className="mt-12">
              <Link
                href="/#projects"
                className="inline-flex items-center gap-2 glass-light text-body font-inter px-6 py-3 rounded-full hover:brightness-105 transition-all"
              >
                <ChevronLeft size={16} />
                Back to Projects
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
      <WhatsAppButton />

      {/* Lightbox */}
      <AnimatePresence>
        {lightboxOpen && hasImages && (
          <Lightbox
            images={project.images}
            currentIndex={activeImage}
            onClose={() => setLightboxOpen(false)}
            onNavigate={setActiveImage}
          />
        )}
      </AnimatePresence>
    </>
  );
}
