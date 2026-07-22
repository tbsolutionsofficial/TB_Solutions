"use client";
import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronLeft, ChevronRight, ZoomIn } from "lucide-react";
import { getGalleryItems } from "@/lib/firestore";
import type { GalleryItem } from "@/lib/types";

const CATEGORIES = ["All", "AI", "Robotics", "IoT", "Drones", "Software"] as const;
type Cat = (typeof CATEGORIES)[number];

const spanClass: Record<string, string> = {
  sm: "row-span-2",
  md: "row-span-2 sm:col-span-2",
  lg: "row-span-3",
  xl: "row-span-3 sm:col-span-2",
};

export default function GallerySection() {
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [cat, setCat] = useState<Cat>("All");
  const [lightbox, setLightbox] = useState<number | null>(null);

  useEffect(() => {
    getGalleryItems().then(setItems).catch(() => {});
  }, []);

  const filtered = cat === "All" ? items : items.filter((i) => i.category === cat);

  const closeLightbox = useCallback(() => setLightbox(null), []);
  const prev = useCallback(() => setLightbox((i) => (i == null || i === 0 ? filtered.length - 1 : i - 1)), [filtered.length]);
  const next = useCallback(() => setLightbox((i) => (i == null ? 0 : (i + 1) % filtered.length)), [filtered.length]);

  useEffect(() => {
    if (lightbox == null) return;
    const handle = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeLightbox();
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
    };
    window.addEventListener("keydown", handle);
    return () => window.removeEventListener("keydown", handle);
  }, [lightbox, closeLightbox, prev, next]);

  return (
    <section id="gallery" className="py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-12 text-center"
        >
          <span className="inline-block rounded-full bg-primary/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-primary">
            Our Work
          </span>
          <h2 className="mt-4 font-display text-4xl font-bold text-foreground sm:text-5xl">Project Gallery</h2>
        </motion.div>

        <div className="mb-8 flex flex-wrap justify-center gap-2">
          {CATEGORIES.map((c) => (
            <button
              key={c}
              onClick={() => setCat(c)}
              className={`rounded-full px-4 py-1.5 text-sm font-medium transition-all ${
                cat === c ? "bg-primary text-primary-foreground" : "bg-secondary text-foreground hover:bg-primary/20"
              }`}
            >
              {c}
            </button>
          ))}
        </div>

        {items.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
            <ZoomIn className="mb-4 h-12 w-12 opacity-30" />
            <p className="text-lg font-medium">Gallery coming soon</p>
            <p className="mt-1 text-sm">Add images in the admin panel</p>
          </div>
        ) : (
          <div className="grid auto-rows-[120px] grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
            {filtered.map((item, idx) => (
              <motion.button
                key={item.id}
                onClick={() => setLightbox(idx)}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3 }}
                className={`group relative overflow-hidden rounded-2xl ${spanClass[item.span ?? "sm"] ?? "row-span-2"}`}
              >
                {item.type === "video" ? (
                  <video src={item.src} poster={item.poster} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" muted playsInline />
                ) : (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={item.src} alt={item.title} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" loading="lazy" />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-espresso/70 via-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                <div className="absolute inset-x-0 bottom-0 translate-y-2 p-3 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
                  <p className="text-left text-xs font-semibold text-white">{item.title}</p>
                  <p className="text-left text-xs text-white/70">{item.category}</p>
                </div>
              </motion.button>
            ))}
          </div>
        )}
      </div>

      <AnimatePresence>
        {lightbox != null && filtered[lightbox] && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[80] flex items-center justify-center bg-espresso/95 backdrop-blur-xl"
            onClick={closeLightbox}
          >
            <button onClick={closeLightbox} className="absolute right-4 top-4 rounded-full bg-white/10 p-2 text-white hover:bg-white/20" aria-label="Close">
              <X className="h-6 w-6" />
            </button>
            <button onClick={(e) => { e.stopPropagation(); prev(); }} className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full bg-white/10 p-2 text-white hover:bg-white/20" aria-label="Previous">
              <ChevronLeft className="h-6 w-6" />
            </button>
            <button onClick={(e) => { e.stopPropagation(); next(); }} className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full bg-white/10 p-2 text-white hover:bg-white/20" aria-label="Next">
              <ChevronRight className="h-6 w-6" />
            </button>
            <motion.div
              key={lightbox}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative max-h-[85vh] max-w-5xl"
              onClick={(e) => e.stopPropagation()}
            >
              {filtered[lightbox].type === "video" ? (
                <video
                  src={filtered[lightbox].src}
                  poster={filtered[lightbox].poster}
                  controls
                  className="max-h-[80vh] rounded-2xl object-contain"
                />
              ) : (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={filtered[lightbox].src}
                  alt={filtered[lightbox].title}
                  className="max-h-[80vh] rounded-2xl object-contain"
                />
              )}
              <p className="mt-3 text-center text-sm font-medium text-white/80">{filtered[lightbox].title}</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
