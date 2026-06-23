import { type HTMLAttributes } from "react";

interface GlassBadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: "coral" | "light" | "dark" | "outline";
}

export default function GlassBadge({
  variant = "coral",
  children,
  className = "",
  ...props
}: GlassBadgeProps) {
  const variants = {
    coral: "glass-coral text-white",
    light: "glass-light text-ink",
    dark: "glass-dark text-white",
    outline: "border border-hairline text-muted",
  };

  return (
    <span
      className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-inter font-medium ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </span>
  );
}
