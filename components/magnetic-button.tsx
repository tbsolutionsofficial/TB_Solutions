"use client";
import { useRef } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

interface Props {
  href: string;
  className?: string;
  children: React.ReactNode;
  strength?: number;
  target?: string;
  rel?: string;
}

export function MagneticButton({ strength = 0.35, className, children, href, target, rel }: Props) {
  const ref = useRef<HTMLAnchorElement>(null);
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const sx = useSpring(mx, { stiffness: 200, damping: 15 });
  const sy = useSpring(my, { stiffness: 200, damping: 15 });

  return (
    <motion.a
      ref={ref}
      href={href}
      target={target}
      rel={rel}
      onMouseMove={(e) => {
        const rect = ref.current?.getBoundingClientRect();
        if (!rect) return;
        mx.set((e.clientX - rect.left - rect.width / 2) * strength);
        my.set((e.clientY - rect.top - rect.height / 2) * strength);
      }}
      onMouseLeave={() => { mx.set(0); my.set(0); }}
      style={{ x: sx, y: sy }}
      className={className}
    >
      {children}
    </motion.a>
  );
}
