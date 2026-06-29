"use client";
import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { FileCode2, BookOpen, Headphones, Clock, IndianRupee, Medal } from "lucide-react";

const REASONS = [
  { icon: FileCode2, title: "Source Code Included", desc: "Full source code + documentation with every project. No hidden files." },
  { icon: BookOpen, title: "Viva & Report Support", desc: "We help you present your project confidently in front of your panel." },
  { icon: Headphones, title: "After-Delivery Support", desc: "Get 2 weeks of free support after delivery for bugs or changes." },
  { icon: Clock, title: "On-Time Delivery", desc: "98% of projects delivered before the agreed deadline, always." },
  { icon: IndianRupee, title: "Affordable Pricing", desc: "Student-friendly pricing starting from ₹2,999. No hidden charges." },
  { icon: Medal, title: "IEEE & Publication Ready", desc: "Projects built to IEEE standards, ready for conferences & journals." },
];

const COLLEGES = [
  "VIT", "SRM", "JNTU", "Anna University", "MVIT", "PSG Tech", "Amrita", "Manipal", "NIT", "BITS",
];

export default function WhyChooseUs() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <section ref={ref} className="relative py-20 px-6 overflow-hidden">
      <div className="absolute inset-0 mesh-bg -z-10" />
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <p className="section-label mb-3">Why Us</p>
          <h2 className="section-heading mb-3">Why Students & Industries Choose Us</h2>
          <p className="section-sub mx-auto">Every project comes with complete support — from idea to viva to deployment.</p>
        </motion.div>

        {/* Reasons Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-14">
          {REASONS.map((r, i) => (
            <motion.div
              key={r.title}
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: i * 0.07, duration: 0.4 }}
              className="glass-light glass-shimmer rounded-2xl p-6 flex gap-4 items-start border border-hairline hover:-translate-y-1 transition-transform duration-200"
            >
              <div className="w-10 h-10 glass-coral rounded-xl flex items-center justify-center flex-shrink-0">
                <r.icon size={18} className="text-white" />
              </div>
              <div>
                <h3 className="font-inter font-semibold text-sm text-ink mb-1">{r.title}</h3>
                <p className="font-inter text-xs text-body leading-relaxed">{r.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* College trust strip */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="text-center"
        >
          <p className="font-inter text-xs text-muted uppercase tracking-[0.18em] font-semibold mb-5">
            Trusted by students from top colleges across India
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            {COLLEGES.map((college) => (
              <span
                key={college}
                className="font-inter text-xs font-semibold text-muted/80 glass-light px-4 py-2 rounded-full border border-hairline"
              >
                {college}
              </span>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
