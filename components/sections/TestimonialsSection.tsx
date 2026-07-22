"use client";
import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Star } from "lucide-react";
import { getApprovedReviews } from "@/lib/firestore";
import type { Review } from "@/lib/types";

function ReviewCard({ review }: { review: Review }) {
  const stars = review.stars ?? review.rating ?? 5;
  return (
    <div className="mx-3 w-72 shrink-0 rounded-2xl glass p-5 sm:w-80">
      <div className="flex gap-0.5 mb-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star
            key={i}
            className={`h-4 w-4 ${i < stars ? "fill-amber-400 text-amber-400" : "fill-none text-muted-foreground/30"}`}
          />
        ))}
      </div>
      <p className="text-sm text-foreground/85 leading-relaxed line-clamp-4">&quot;{review.review}&quot;</p>
      <div className="mt-4 flex items-center gap-3">
        {review.avatar ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={review.avatar} alt={review.name} className="h-9 w-9 rounded-full object-cover" />
        ) : (
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary">
            {review.name[0]}
          </div>
        )}
        <div>
          <p className="text-sm font-semibold text-foreground">{review.name}</p>
          <p className="text-xs text-muted-foreground">{review.company ?? review.college} · {review.domain}</p>
        </div>
      </div>
    </div>
  );
}

export default function TestimonialsSection() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [paused, setPaused] = useState(false);
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    getApprovedReviews().then(setReviews).catch(() => {});
  }, []);

  if (reviews.length === 0) return null;

  const doubled = [...reviews, ...reviews];

  return (
    <section id="testimonials" className="overflow-hidden py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mb-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <span className="inline-block rounded-full bg-primary/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-primary">
            Testimonials
          </span>
          <h2 className="mt-4 font-display text-4xl font-bold text-foreground sm:text-5xl">
            Loved by Builders
          </h2>
        </motion.div>
      </div>

      <div
        className="relative"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
      >
        <div className="pointer-events-none absolute left-0 top-0 z-10 h-full w-24 bg-gradient-to-r from-background to-transparent" />
        <div className="pointer-events-none absolute right-0 top-0 z-10 h-full w-24 bg-gradient-to-l from-background to-transparent" />
        <div
          ref={trackRef}
          className="flex"
          style={{
            animation: paused ? "none" : `marquee ${reviews.length * 5}s linear infinite`,
          }}
        >
          {doubled.map((r, i) => (
            <ReviewCard key={`${r.id}-${i}`} review={r} />
          ))}
        </div>
      </div>

      <style>{`
        @keyframes marquee {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
      `}</style>
    </section>
  );
}
