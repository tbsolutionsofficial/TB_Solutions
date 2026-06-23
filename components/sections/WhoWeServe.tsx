"use client";
import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { GraduationCap, Building2 } from "lucide-react";

const CARDS = [
  {
    icon: GraduationCap,
    title: "Students & Colleges",
    subtitle: "Academic project excellence",
    bullets: [
      "Final year B.E. / B.Tech / M.Tech projects",
      "IEEE paper prototypes and mini-projects",
      "Lab setup and department-wide project drives",
      "Internship and training programs",
    ],
    cta: "Get Your Project Done",
  },
  {
    icon: Building2,
    title: "Industries & Companies",
    subtitle: "Enterprise-grade solutions",
    bullets: [
      "R&D prototyping and proof-of-concept",
      "Factory automation and IoT integration",
      "AI/ML model development and deployment",
      "Custom web, app, and embedded solutions",
    ],
    cta: "Partner With Us",
  },
];

export default function WhoWeServe() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section className="relative py-24 px-6 overflow-hidden">
      <div className="absolute inset-0 mesh-bg-dark" />

      <div className="relative max-w-7xl mx-auto">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 40 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="text-center mb-14"
        >
          <p className="font-inter text-xs font-medium text-coral uppercase tracking-[3px] mb-4">WHO WE SERVE</p>
          <h2 className="font-cormorant text-[clamp(36px,6vw,56px)] text-white tracking-[-1px]">
            Built for Builders
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {CARDS.map((card, i) => {
            const Icon = card.icon;
            return (
              <motion.div
                key={card.title}
                initial={{ opacity: 0, y: 30 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: i * 0.15, duration: 0.5 }}
                className="glass-dark glass-shimmer relative rounded-2xl p-10"
              >
                <div className="text-coral mb-6">
                  <Icon size={40} />
                </div>
                <h3 className="font-cormorant text-3xl text-white mb-1">{card.title}</h3>
                <p className="font-inter text-sm text-white/50 mb-6">{card.subtitle}</p>
                <ul className="space-y-3 mb-8">
                  {card.bullets.map((b) => (
                    <li key={b} className="flex items-start gap-3 font-inter text-sm text-white/70">
                      <span className="text-coral mt-0.5 text-lg leading-none">›</span>
                      {b}
                    </li>
                  ))}
                </ul>
                <button
                  onClick={() => document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" })}
                  className="glass-coral text-white font-inter font-medium px-6 py-3 rounded-full hover:brightness-110 active:scale-95 transition-all cursor-pointer"
                >
                  {card.cta}
                </button>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
