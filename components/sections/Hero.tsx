"use client";
import { motion } from "framer-motion";
import { ArrowRight, Zap } from "lucide-react";
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
    <section className="relative min-h-screen flex items-center justify-center pt-24 pb-16 px-6">
      <div className="absolute inset-0 -z-10 mesh-bg" />

      <div className="w-full max-w-[840px] mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="glass-light glass-shimmer relative rounded-3xl p-10 md:p-16 text-center"
        >
          {/* Badge */}
          <div className="inline-flex items-center gap-2 glass-coral text-white text-xs font-inter font-medium px-4 py-2 rounded-full mb-8">
            <Zap size={12} />
            INDIA&apos;S TECHNOLOGY PARTNER
          </div>

          {/* Headline */}
          <h1 className="font-cormorant text-[clamp(40px,8vw,72px)] leading-[1.05] tracking-[-1.5px] text-ink mb-6">
            We Light the Way to
            <br />
            <em className="text-coral not-italic">Tomorrow&apos;s Technology</em>
          </h1>

          {/* Subtitle */}
          <p className="font-inter text-[17px] text-body max-w-xl mx-auto mb-10 leading-relaxed">
            {heroSubtitle}
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => scrollTo("projects")}
              className="glass-coral text-white font-inter font-medium px-8 py-4 rounded-full hover:brightness-110 active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              View Our Projects
              <ArrowRight size={18} />
            </button>
            <button
              onClick={() => scrollTo("contact")}
              className="glass-light text-ink font-inter font-medium px-8 py-4 rounded-full hover:brightness-105 active:scale-95 transition-all cursor-pointer"
            >
              Start a Project
            </button>
          </div>
        </motion.div>

        {/* Stats Row */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="grid grid-cols-3 gap-4 mt-6"
        >
          {[
            { value: `${projectsCount}`, label: "Projects" },
            { value: `${domainsCount}`, label: "Domains" },
            { value: "Pan-India", label: "Reach" },
          ].map((stat) => (
            <div key={stat.label} className="glass-light rounded-2xl p-4 text-center">
              <div className="font-cormorant text-2xl text-ink font-normal">{stat.value}</div>
              <div className="font-inter text-xs text-muted mt-0.5">{stat.label}</div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
