"use client";
import { motion } from "framer-motion";

interface ProcessCardProps {
  step: number;
  title: string;
  description: string;
  bannerImage: string;
  bannerTitle: string;
  bannerDescription: string;
}

export function ProcessCard({ step, title, description, bannerImage, bannerTitle, bannerDescription }: ProcessCardProps) {
  return (
    <motion.div
      className="group relative overflow-hidden rounded-3xl glass h-[340px] cursor-pointer"
      whileHover="hover"
      initial="rest"
    >
      {/* Default face */}
      <motion.div
        variants={{ rest: { opacity: 1 }, hover: { opacity: 0 } }}
        transition={{ duration: 0.3 }}
        className="absolute inset-0 flex flex-col justify-between p-8"
      >
        <span className="font-display text-7xl font-bold text-primary/20 leading-none">
          {String(step).padStart(2, "0")}
        </span>
        <div>
          <h3 className="font-display text-2xl font-bold text-foreground mb-2">{title}</h3>
          <p className="text-muted-foreground text-sm leading-relaxed">{description}</p>
        </div>
      </motion.div>

      {/* Hover face */}
      <motion.div
        variants={{ rest: { opacity: 0 }, hover: { opacity: 1 } }}
        transition={{ duration: 0.3 }}
        className="absolute inset-0"
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={bannerImage} alt={bannerTitle} className="h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-espresso/90 via-espresso/40 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-8">
          <motion.span
            variants={{ rest: { y: 10, opacity: 0 }, hover: { y: 0, opacity: 1 } }}
            transition={{ delay: 0.1, duration: 0.3 }}
            className="mb-3 inline-block rounded-full bg-primary px-3 py-1 text-xs font-semibold text-white"
          >
            Step {step}
          </motion.span>
          <motion.h3
            variants={{ rest: { y: 10, opacity: 0 }, hover: { y: 0, opacity: 1 } }}
            transition={{ delay: 0.15, duration: 0.3 }}
            className="font-display text-xl font-bold text-white mb-1"
          >
            {bannerTitle}
          </motion.h3>
          <motion.p
            variants={{ rest: { y: 10, opacity: 0 }, hover: { y: 0, opacity: 1 } }}
            transition={{ delay: 0.2, duration: 0.3 }}
            className="text-white/80 text-sm"
          >
            {bannerDescription}
          </motion.p>
        </div>
      </motion.div>
    </motion.div>
  );
}
