"use client";
import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Search, Hammer, Package } from "lucide-react";

const STEPS = [
  {
    number: "01",
    icon: Search,
    title: "Understand",
    desc: "We deep-dive into your requirements, constraints, and goals through structured discovery sessions.",
  },
  {
    number: "02",
    icon: Hammer,
    title: "Build",
    desc: "Our engineers design, prototype, and iterate rapidly with weekly check-ins and transparent progress tracking.",
  },
  {
    number: "03",
    icon: Package,
    title: "Deliver",
    desc: "Fully tested, documented, and deployment-ready. We train you on usage and provide post-delivery support.",
  },
];

export default function HowWeWork() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section className="relative py-24 px-6">
      <div className="absolute inset-0 mesh-bg -z-10" />

      <div className="max-w-7xl mx-auto">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 40 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="text-center mb-14"
        >
          <p className="section-label mb-3">Our Process</p>
          <h2 className="section-heading">From Idea to Reality</h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {STEPS.map((step, i) => {
            const Icon = step.icon;
            return (
              <motion.div
                key={step.number}
                initial={{ opacity: 0, y: 30 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: i * 0.15, duration: 0.5 }}
                className="glass-light glass-shimmer relative rounded-2xl p-10"
              >
                <div className="font-cormorant text-5xl text-coral mb-4 leading-none">{step.number}</div>
                <div className="text-ink mb-4">
                  <Icon size={28} />
                </div>
                <h3 className="font-cormorant font-semibold text-2xl text-ink mb-2">{step.title}</h3>
                <p className="font-inter text-sm text-body leading-relaxed">{step.desc}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
