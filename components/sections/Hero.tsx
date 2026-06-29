"use client";
import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles, CheckCircle } from "lucide-react";
import type { SiteContent } from "@/lib/types";

interface HeroProps {
  content: SiteContent | null;
}

function AnimatedCounter({ target, suffix = "" }: { target: number; suffix?: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef(false);
  useEffect(() => {
    if (ref.current) return;
    ref.current = true;
    let start = 0;
    const step = Math.ceil(target / 50);
    const timer = setInterval(() => {
      start += step;
      if (start >= target) { setCount(target); clearInterval(timer); }
      else setCount(start);
    }, 30);
    return () => clearInterval(timer);
  }, [target]);
  return <>{count}{suffix}</>;
}

const BULLETS = ["IEEE Projects", "AI & Robotics", "IoT & Embedded", "Web & App Dev", "Industrial Automation", "Source Code Included"];

export default function Hero({ content }: HeroProps) {
  const projectsCount = parseInt(content?.projectsCount ?? "100") || 100;
  const domainsCount = parseInt(content?.domainsCount ?? "12") || 12;
  const heroSubtitle = content?.heroSubtitle ?? "From students to industries — we ship real tech.";

  function scrollTo(id: string) {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  }

  return (
    <section className="relative min-h-screen flex items-center justify-center pt-24 pb-16 px-6 overflow-hidden">
      <div className="absolute inset-0 -z-10 mesh-bg" />
      <div className="absolute top-1/4 -left-32 w-96 h-96 rounded-full opacity-20 blur-3xl pointer-events-none"
        style={{ background: "radial-gradient(circle, #cc785c 0%, transparent 70%)" }} />
      <div className="absolute bottom-1/4 -right-32 w-80 h-80 rounded-full opacity-15 blur-3xl pointer-events-none"
        style={{ background: "radial-gradient(circle, #e8a55a 0%, transparent 70%)" }} />

      <div className="w-full max-w-[880px] mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="glass-light glass-shimmer relative rounded-3xl px-8 py-12 md:px-16 md:py-14 text-center"
        >
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.4 }}
            className="inline-flex items-center gap-2 glass-coral text-white text-xs font-inter font-semibold px-5 py-2 rounded-full mb-7 tracking-wider uppercase"
          >
            <Sparkles size={11} />
            India&apos;s Technology Partner
          </motion.div>

          {/* Headline */}
          <h1 className="font-cormorant font-semibold text-[clamp(38px,7.5vw,70px)] leading-[1.08] tracking-[-1px] text-ink mb-4">
            We Light the Way to<br />
            <span className="text-coral italic">Tomorrow&apos;s Technology</span>
          </h1>

          {/* Subtitle — punchy single line */}
          <p className="font-inter text-base md:text-lg text-body max-w-[480px] mx-auto mb-3 leading-relaxed font-normal">
            {heroSubtitle}
          </p>

          {/* Bullet proof points */}
          <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-1.5 mb-8">
            {BULLETS.map((b) => (
              <span key={b} className="flex items-center gap-1.5 font-inter text-xs text-body">
                <CheckCircle size={12} className="text-coral flex-shrink-0" />
                {b}
              </span>
            ))}
          </div>

          {/* CTAs — clear hierarchy */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={() => scrollTo("contact")}
              className="glass-coral text-white font-inter font-semibold text-sm px-9 py-3.5 rounded-full hover:brightness-110 active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg"
            >
              Get Free Consultation
              <ArrowRight size={16} />
            </button>
            <button
              onClick={() => scrollTo("projects")}
              className="font-inter font-semibold text-sm px-9 py-3.5 rounded-full active:scale-95 transition-all cursor-pointer border border-ink/20 text-ink hover:bg-ink/5"
            >
              View Our Projects
            </button>
          </div>

          {/* Trust line */}
          <p className="font-inter text-xs text-muted mt-5">
            ✓ Free consultation &nbsp;·&nbsp; ✓ End-to-end delivery &nbsp;·&nbsp; ✓ Usually replies within 6 hours
          </p>
        </motion.div>

        {/* Animated Stats Row */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45, duration: 0.5 }}
          className="grid grid-cols-4 gap-3 mt-4"
        >
          {[
            { value: projectsCount, suffix: "+", label: "Projects" },
            { value: domainsCount, suffix: "+", label: "Domains" },
            { value: 500, suffix: "+", label: "Students" },
            { value: 99, suffix: "%", label: "Satisfaction" },
          ].map((stat) => (
            <div key={stat.label} className="glass-light rounded-2xl px-3 py-4 text-center">
              <div className="font-cormorant font-semibold text-2xl md:text-3xl text-coral leading-none">
                <AnimatedCounter target={stat.value} suffix={stat.suffix} />
              </div>
              <div className="font-inter text-xs text-muted mt-1 font-medium">
                {stat.label}
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
