"use client";
import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight, CheckCircle, Flame } from "lucide-react";
import dynamic from "next/dynamic";
import type { SiteContent } from "@/lib/types";

const ThreeBackground = dynamic(() => import("@/components/three/ThreeBackground"), {
  ssr: false,
  loading: () => <div className="absolute inset-0" style={{ background: "#0a0a0f" }} />,
});

interface HeroProps {
  content: SiteContent | null;
}

function AnimatedCounter({ target, suffix = "" }: { target: number; suffix?: string }) {
  const [count, setCount] = useState(0);
  const started = useRef(false);
  useEffect(() => {
    if (started.current) return;
    started.current = true;
    let n = 0;
    const step = Math.ceil(target / 50);
    const timer = setInterval(() => {
      n += step;
      if (n >= target) { setCount(target); clearInterval(timer); }
      else setCount(n);
    }, 28);
    return () => clearInterval(timer);
  }, [target]);
  return <>{count}{suffix}</>;
}

const BULLETS = [
  "IEEE Projects",
  "AI & Robotics",
  "IoT & Embedded",
  "Web & App Dev",
  "Source Code Included",
];

const TORCH_LABELS = [
  { label: "flame.active", value: "true", top: "20%", right: "6%" },
  { label: "torch.intensity", value: "100%", top: "44%", right: "2%" },
  { label: "vision.lit", value: "engaged", top: "68%", right: "8%" },
];

export default function Hero({ content }: HeroProps) {
  const prefersReduced = useReducedMotion();

  const projectsCount = parseInt(content?.projectsCount ?? "100") || 100;
  const domainsCount = parseInt(content?.domainsCount ?? "12") || 12;
  const heroSubtitle =
    content?.heroSubtitle ?? "From students to industries — we ship real tech.";

  function scrollTo(id: string) {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  }

  const fade = (d: number) => ({
    initial: { opacity: 0, y: prefersReduced ? 0 : 24 },
    animate: { opacity: 1, y: 0 },
    transition: {
      delay: prefersReduced ? 0 : d,
      duration: 0.55,
      ease: [0.16, 1, 0.3, 1] as [number, number, number, number],
    },
  });

  return (
    <section
      className="relative min-h-screen flex items-center overflow-hidden"
      style={{ background: "#0a0a0f" }}
    >
      {/* Subtle grid */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(204,120,92,0.6) 1px, transparent 1px), linear-gradient(90deg, rgba(204,120,92,0.6) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      {/* Coral glow */}
      <div
        className="pointer-events-none absolute -bottom-32 -left-32 h-[500px] w-[500px] rounded-full opacity-10 blur-3xl"
        style={{ background: "radial-gradient(circle, #cc785c, transparent 70%)" }}
      />

      <div className="relative mx-auto grid w-full max-w-7xl grid-cols-1 gap-8 px-6 pb-16 pt-32 md:grid-cols-2 md:gap-4 md:pb-24">
        {/* Left: copy */}
        <div className="flex flex-col justify-center">
          <motion.div
            {...fade(0.1)}
            className="mb-7 inline-flex w-fit items-center gap-2 rounded-full px-5 py-2 text-xs font-semibold uppercase tracking-widest"
            style={{
              background: "rgba(204,120,92,0.18)",
              border: "1px solid rgba(204,120,92,0.4)",
              color: "#cc785c",
            }}
          >
            <Flame size={12} />
            India&apos;s Technology Partner
          </motion.div>

          <motion.h1
            {...fade(0.22)}
            className="font-cormorant font-semibold leading-[1.07] tracking-tight text-white"
            style={{ fontSize: "clamp(38px, 6vw, 68px)" }}
          >
            We Light the Way to<br />
            <span style={{ color: "#cc785c" }} className="italic">
              Tomorrow&apos;s Technology
            </span>
          </motion.h1>

          <motion.p
            {...fade(0.36)}
            className="mt-5 max-w-sm font-inter text-base leading-relaxed"
            style={{ color: "rgba(250,249,245,0.65)" }}
          >
            {heroSubtitle}
          </motion.p>

          <motion.div {...fade(0.46)} className="mt-5 flex flex-wrap gap-x-4 gap-y-2">
            {BULLETS.map((b) => (
              <span
                key={b}
                className="flex items-center gap-1.5 font-inter text-xs"
                style={{ color: "rgba(250,249,245,0.55)" }}
              >
                <CheckCircle size={11} style={{ color: "#cc785c", flexShrink: 0 }} />
                {b}
              </span>
            ))}
          </motion.div>

          <motion.div {...fade(0.56)} className="mt-8 flex flex-wrap gap-3">
            <button
              onClick={() => scrollTo("contact")}
              className="flex items-center gap-2 rounded-full px-8 py-3.5 text-sm font-semibold text-white transition-all hover:brightness-110 active:scale-95 cursor-pointer"
              style={{
                background: "#cc785c",
                boxShadow: "0 0 24px rgba(204,120,92,0.35)",
              }}
            >
              Get Free Consultation
              <ArrowRight size={15} />
            </button>
            <button
              onClick={() => scrollTo("projects")}
              className="rounded-full px-8 py-3.5 text-sm font-semibold transition-all active:scale-95 cursor-pointer"
              style={{
                border: "1px solid rgba(250,249,245,0.15)",
                color: "rgba(250,249,245,0.8)",
              }}
            >
              View Our Projects
            </button>
          </motion.div>

          <motion.p
            {...fade(0.68)}
            className="mt-5 font-inter text-xs"
            style={{ color: "rgba(250,249,245,0.35)" }}
          >
            ✓ Free consultation &nbsp;·&nbsp; ✓ End-to-end delivery &nbsp;·&nbsp; ✓ Replies within 6 hrs
          </motion.p>

          <motion.div {...fade(0.76)} className="mt-10 grid grid-cols-4 gap-3">
            {[
              { value: projectsCount, suffix: "+", label: "Projects" },
              { value: domainsCount, suffix: "+", label: "Domains" },
              { value: 500, suffix: "+", label: "Students" },
              { value: 99, suffix: "%", label: "Satisfaction" },
            ].map((stat) => (
              <div
                key={stat.label}
                className="rounded-2xl px-2 py-4 text-center"
                style={{
                  background: "rgba(255,255,255,0.04)",
                  border: "1px solid rgba(255,255,255,0.08)",
                }}
              >
                <div
                  className="font-cormorant text-2xl font-semibold leading-none"
                  style={{ color: "#cc785c" }}
                >
                  <AnimatedCounter target={stat.value} suffix={stat.suffix} />
                </div>
                <div
                  className="mt-1 font-inter text-xs font-medium"
                  style={{ color: "rgba(250,249,245,0.45)" }}
                >
                  {stat.label}
                </div>
              </div>
            ))}
          </motion.div>
        </div>

        {/* Right: 3D torch */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: prefersReduced ? 0 : 0.3, duration: 0.8 }}
          className="relative min-h-[360px] md:min-h-[560px]"
        >
          <ThreeBackground />

          {/* Tech labels */}
          {TORCH_LABELS.map((l) => (
            <div
              key={l.label}
              className="pointer-events-none absolute hidden md:flex items-center gap-2"
              style={{ top: l.top, right: l.right }}
            >
              <div
                className="rounded-full px-3 py-1 font-mono text-[10px]"
                style={{
                  background: "rgba(10,10,15,0.7)",
                  border: "1px solid rgba(204,120,92,0.3)",
                  color: "rgba(250,249,245,0.6)",
                }}
              >
                <span style={{ color: "#cc785c" }}>{l.label}</span>
                <span style={{ color: "rgba(250,249,245,0.4)" }}> // </span>
                {l.value}
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
