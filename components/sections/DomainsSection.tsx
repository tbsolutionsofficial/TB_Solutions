"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { getDomains } from "@/lib/firestore";
import type { DomainDoc } from "@/lib/types";
import { DomainCard } from "@/components/domain-card";

export default function DomainsSection() {
  const [domains, setDomains] = useState<DomainDoc[]>([]);

  useEffect(() => {
    getDomains().then(setDomains).catch(() => {});
  }, []);

  return (
    <section id="domains" className="py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-16 text-center"
        >
          <span className="inline-block rounded-full bg-primary/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-primary">
            What We Do
          </span>
          <h2 className="mt-4 font-display text-4xl font-bold text-foreground sm:text-5xl">
            Every Domain.<br />One Partner.
          </h2>
          <p className="mx-auto mt-5 max-w-2xl text-muted-foreground">
            From AI research to embedded systems, our specialists deliver production-grade solutions
            across the full technology spectrum.
          </p>
        </motion.div>

        {domains.length === 0 ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-72 animate-pulse rounded-3xl bg-secondary sm:h-80" />
            ))}
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {domains.map((domain, i) => (
              <DomainCard key={domain.slug} domain={domain} index={i} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
