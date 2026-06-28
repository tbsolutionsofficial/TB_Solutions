"use client";
import { useEffect, useState, useRef } from "react";
import { motion, useInView } from "framer-motion";
import { ArrowRight, Tag } from "lucide-react";
import { getActiveOffers } from "@/lib/firestore";
import type { Offer } from "@/lib/types";

export default function OffersSection() {
  const [offers, setOffers] = useState<Offer[]>([]);
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  useEffect(() => { getActiveOffers().then(setOffers); }, []);

  if (offers.length === 0) return null;

  return (
    <section id="offers" ref={ref} className="relative py-20 px-6 overflow-hidden">
      <div className="absolute inset-0 mesh-bg" />
      <div className="relative max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="text-center mb-10"
        >
          <div className="flex items-center justify-center gap-2 mb-3">
            <Tag size={18} className="text-coral" />
            <span className="font-inter text-xs text-coral uppercase tracking-[3px]">Special Offers</span>
          </div>
          <h2 className="font-cormorant text-[clamp(32px,5vw,52px)] text-ink tracking-[-1px]">
            Exclusive Deals for You
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {offers.map((offer, i) => (
            <motion.div
              key={offer.id}
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: i * 0.08, duration: 0.5 }}
              className="glass-light glass-shimmer rounded-3xl p-6 flex flex-col gap-4 border border-hairline"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex flex-wrap gap-1.5">
                  {offer.badge && (
                    <span className="text-xs glass-coral text-white px-2.5 py-1 rounded-full font-inter font-medium">
                      {offer.badge}
                    </span>
                  )}
                  {offer.discount && (
                    <span className="text-xs bg-green-500/10 text-green-600 border border-green-500/20 px-2.5 py-1 rounded-full font-inter font-bold">
                      {offer.discount}
                    </span>
                  )}
                </div>
              </div>
              <div className="flex-1">
                <h3 className="font-cormorant text-xl text-ink tracking-tight">{offer.title}</h3>
                <p className="font-inter text-sm text-body mt-1.5 leading-relaxed">{offer.description}</p>
              </div>
              {offer.domains.length > 0 && (
                <div className="flex flex-wrap gap-1.5">
                  {offer.domains.map((d) => (
                    <span key={d} className="text-xs bg-white/40 text-muted px-2.5 py-1 rounded-full font-inter">
                      {d.split(" ")[0]}
                    </span>
                  ))}
                </div>
              )}
              {offer.validUntil && (
                <p className="font-inter text-xs text-amber-600">Valid until: {offer.validUntil}</p>
              )}
              <button
                onClick={() => document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" })}
                className="flex items-center justify-center gap-2 glass-coral text-white font-inter font-medium text-sm px-5 py-2.5 rounded-full hover:brightness-110 transition-all cursor-pointer mt-auto"
              >
                Claim Offer <ArrowRight size={14} />
              </button>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
