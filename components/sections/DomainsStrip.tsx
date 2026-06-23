"use client";
import { motion } from "framer-motion";
import { useRef } from "react";
import { useInView } from "framer-motion";
import { DOMAINS } from "@/lib/types";
import DomainIcon from "@/components/DomainIcon";

interface DomainsStripProps {
  onDomainClick?: (domain: string) => void;
}

export default function DomainsStrip({ onDomainClick }: DomainsStripProps) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  function handleClick(domain: string) {
    onDomainClick?.(domain);
    document.getElementById("projects")?.scrollIntoView({ behavior: "smooth" });
  }

  return (
    <section id="domains" className="relative py-24 px-6 overflow-hidden">
      <div className="absolute inset-0 mesh-bg-dark" />

      <div className="relative max-w-7xl mx-auto">
        <div className="text-center mb-14">
          <p className="font-inter text-xs font-medium text-coral uppercase tracking-[3px] mb-4">Our Expertise</p>
          <h2 className="font-cormorant text-[clamp(36px,6vw,56px)] text-white leading-tight tracking-[-1px]">
            Every Domain. One Partner.
          </h2>
        </div>

        <div
          ref={ref}
          className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4"
        >
          {DOMAINS.map((domain, i) => (
            <motion.button
              key={domain}
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: i * 0.06, duration: 0.4 }}
              onClick={() => handleClick(domain)}
              className="glass-dark rounded-2xl p-6 flex flex-col items-center gap-3 hover:brightness-125 active:scale-95 transition-all duration-200 text-center cursor-pointer group"
            >
              <div className="text-coral group-hover:scale-110 transition-transform duration-200">
                <DomainIcon domain={domain} size={28} />
              </div>
              <span className="font-inter text-sm text-white/80 leading-snug">{domain}</span>
            </motion.button>
          ))}
        </div>
      </div>
    </section>
  );
}
