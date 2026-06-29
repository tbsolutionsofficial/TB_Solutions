"use client";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";
import type { SiteContent } from "@/lib/types";

interface HeroProps {
  content: SiteContent | null;
}

export default function Hero({ content }: HeroProps) {
  const projectsCount = content?.projectsCount ?? "100+";
  const domainsCount = content?.domainsCount ?? "12";
  const heroSubtitle =
    content?.heroSubtitle ??
    "Project services across 12 technology domains for students, colleges, and industries across India.";

  function scrollTo(id: string) {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  }

  return (
    <section className="relative min-h-screen flex items-center justify-center pt-24 pb-16 px-6 overflow-hidden">
      <div className="absolute inset-0 -z-10 mesh-bg" />
      {/* Decorative blobs */}
      <div className="absolute top-1/4 -left-32 w-96 h-96 rounded-full opacity-20 blur-3xl pointer-events-none"
        style={{ background: "radial-gradient(circle, #cc785c 0%, transparent 70%)" }} />
      <div className="absolute bottom-1/4 -right-32 w-80 h-80 rounded-full opacity-15 blur-3xl pointer-events-none"
        style={{ background: "radial-gradient(circle, #e8a55a 0%, transparent 70%)" }} />

      <div className="w-full max-w-[860px] mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="glass-light glass-shimmer relative rounded-3xl px-8 py-12 md:px-16 md:py-16 text-center"
        >
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.4 }}
            className="inline-flex items-center gap-2 glass-coral text-white text-xs font-inter font-semibold px-5 py-2 rounded-full mb-8 tracking-wider uppercase"
          >
            <Sparkles size={11} />
            India&apos;s Technology Partner
          </motion.div>

          {/* Headline */}
          <h1 className="font-cormorant font-semibold text-[clamp(38px,7.5vw,72px)] leading-[1.08] tracking-[-1px] text-ink mb-5">
            We Light the Way to<br />
            <span className="text-coral italic">Tomorrow&apos;s Technology</span>
          </h1>

          {/* Subtitle */}
          <p className="font-inter text-base md:text-lg text-body max-w-[520px] mx-auto mb-10 leading-relaxed font-normal">
            {heroSubtitle}
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={() => scrollTo("projects")}
              className="glass-coral text-white font-inter font-semibold text-sm px-8 py-3.5 rounded-full hover:brightness-110 active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg"
            >
              View Our Projects
              <ArrowRight size={16} />
            </button>
            <button
              onClick={() => scrollTo("contact")}
              className="font-inter font-semibold text-sm px-8 py-3.5 rounded-full active:scale-95 transition-all cursor-pointer border border-ink/15 text-ink hover:bg-ink/5"
            >
              Start a Project
            </button>
          </div>
        </motion.div>

        {/* Stats Row */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45, duration: 0.5, ease: "easeOut" }}
          className="grid grid-cols-3 gap-3 mt-4"
        >
          {[
            { value: projectsCount, label: "Projects Delivered" },
            { value: domainsCount, label: "Tech Domains" },
            { value: "Pan-India", label: "Reach" },
          ].map((stat) => (
            <div key={stat.label} className="glass-light rounded-2xl px-4 py-4 text-center">
              <div className="font-cormorant font-semibold text-2xl md:text-3xl text-ink leading-none">
                {stat.value}
              </div>
              <div className="font-inter text-xs text-muted mt-1 font-medium tracking-wide">
                {stat.label}
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
