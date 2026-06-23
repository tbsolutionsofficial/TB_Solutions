import { type HTMLAttributes } from "react";

interface GlassCardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: "light" | "dark" | "coral";
  shimmer?: boolean;
  padding?: "none" | "sm" | "md" | "lg";
}

export default function GlassCard({
  variant = "light",
  shimmer = false,
  padding = "lg",
  children,
  className = "",
  ...props
}: GlassCardProps) {
  const variants = {
    light: "glass-light",
    dark: "glass-dark",
    coral: "glass-coral",
  };

  const paddings = {
    none: "",
    sm: "p-4",
    md: "p-6",
    lg: "p-10",
  };

  return (
    <div
      className={`relative rounded-2xl overflow-hidden ${variants[variant]} ${paddings[padding]} ${shimmer ? "glass-shimmer" : ""} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}
