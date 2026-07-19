"use client";
import { useEffect, useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import Image from "next/image";

export default function WelcomeSplash() {
  const [visible, setVisible] = useState(true);
  const prefersReduced = useReducedMotion();

  useEffect(() => {
    const timer = setTimeout(() => setVisible(false), prefersReduced ? 0 : 1400);
    return () => clearTimeout(timer);
  }, [prefersReduced]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="splash"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6, ease: "easeInOut" }}
          className="fixed inset-0 z-[100] flex items-center justify-center"
          style={{ background: "rgba(248,244,239,0.97)", backdropFilter: "blur(12px)" }}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.05 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col items-center gap-4"
          >
            <Image
              src="/logo.png"
              alt="TorchBearer Solutions"
              width={220}
              height={60}
              className="h-16 w-auto object-contain"
              priority
            />
            <motion.div
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ delay: 0.4, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              className="h-[2px] w-32 rounded-full origin-left"
              style={{ background: "#cc785c" }}
            />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
