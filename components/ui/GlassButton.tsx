"use client";
import { type ButtonHTMLAttributes, forwardRef } from "react";
import { Loader2 } from "lucide-react";

interface GlassButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "coral" | "light" | "dark" | "ghost";
  size?: "sm" | "md" | "lg";
  loading?: boolean;
  fullWidth?: boolean;
}

const GlassButton = forwardRef<HTMLButtonElement, GlassButtonProps>(
  ({ variant = "coral", size = "md", loading, fullWidth, children, className = "", disabled, ...props }, ref) => {
    const base =
      "relative inline-flex items-center justify-center gap-2 rounded-full font-inter font-medium transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-coral focus-visible:ring-offset-2 cursor-pointer select-none";

    const variants = {
      coral: "glass-coral text-white hover:brightness-110 active:scale-95",
      light: "glass-light text-ink hover:brightness-105 active:scale-95",
      dark: "glass-dark text-white hover:brightness-125 active:scale-95",
      ghost: "border border-hairline text-body hover:bg-white/10 active:scale-95",
    };

    const sizes = {
      sm: "px-4 py-2 text-sm",
      md: "px-6 py-3 text-sm",
      lg: "px-8 py-4 text-base",
    };

    return (
      <button
        ref={ref}
        disabled={disabled || loading}
        className={`${base} ${variants[variant]} ${sizes[size]} ${fullWidth ? "w-full" : ""} ${disabled || loading ? "opacity-60 pointer-events-none" : ""} ${className}`}
        {...props}
      >
        {loading && <Loader2 size={16} className="animate-spin" />}
        {children}
      </button>
    );
  }
);

GlassButton.displayName = "GlassButton";
export default GlassButton;
