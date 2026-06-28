"use client";
import { useEffect, useState, useRef } from "react";
import Image from "next/image";
import { motion, useInView } from "framer-motion";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { getActiveBanners } from "@/lib/firestore";
import type { Banner } from "@/lib/types";

export default function BannersSection({ onDomainClick }: { onDomainClick?: (domain: string) => void }) {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [current, setCurrent] = useState(0);
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  useEffect(() => { getActiveBanners().then(setBanners); }, []);

  // Auto-advance every 5s
  useEffect(() => {
    if (banners.length <= 1) return;
    const t = setInterval(() => setCurrent((c) => (c + 1) % banners.length), 5000);
    return () => clearInterval(t);
  }, [banners.length]);

  if (banners.length === 0) return null;

  const b = banners[current];

  return (
    <section ref={ref} className="relative py-10 px-6 overflow-hidden">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="relative glass-coral rounded-3xl overflow-hidden"
          style={{ minHeight: "140px" }}
        >
          {b.imageUrl && (
            <div className="absolute inset-0">
              <Image src={b.imageUrl} alt={b.title} fill className="object-cover opacity-20" unoptimized />
            </div>
          )}
          <div className="relative flex flex-col sm:flex-row items-center justify-between gap-4 px-8 py-7">
            <div>
              <p className="font-inter text-xs text-white/60 uppercase tracking-[2px] mb-1">{b.domain}</p>
              <h3 className="font-cormorant text-2xl sm:text-3xl text-white tracking-tight">{b.title}</h3>
              {b.subtitle && <p className="font-inter text-sm text-white/70 mt-1">{b.subtitle}</p>}
            </div>
            <button
              onClick={() => {
                onDomainClick?.(b.domain);
                const el = document.getElementById("contact");
                el?.scrollIntoView({ behavior: "smooth" });
              }}
              className="flex items-center gap-2 bg-white text-coral font-inter font-semibold text-sm px-6 py-3 rounded-full hover:brightness-95 transition-all whitespace-nowrap shrink-0 cursor-pointer"
            >
              {b.ctaText} <ArrowRight size={15} />
            </button>
          </div>

          {/* Dots */}
          {banners.length > 1 && (
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-1.5">
              {banners.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrent(i)}
                  className={`rounded-full transition-all cursor-pointer ${i === current ? "w-4 h-1.5 bg-white" : "w-1.5 h-1.5 bg-white/40"}`}
                />
              ))}
            </div>
          )}

          {/* Arrows */}
          {banners.length > 1 && (
            <>
              <button
                onClick={() => setCurrent((c) => (c - 1 + banners.length) % banners.length)}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-white/60 hover:text-white transition-colors cursor-pointer"
              >
                <ChevronLeft size={20} />
              </button>
              <button
                onClick={() => setCurrent((c) => (c + 1) % banners.length)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-white/60 hover:text-white transition-colors cursor-pointer"
              >
                <ChevronRight size={20} />
              </button>
            </>
          )}
        </motion.div>
      </div>
    </section>
  );
}
