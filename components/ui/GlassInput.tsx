"use client";
import { forwardRef, type InputHTMLAttributes, type TextareaHTMLAttributes } from "react";

interface GlassInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  variant?: "light" | "dark";
}

interface GlassTextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  variant?: "light" | "dark";
}

const inputBase =
  "w-full rounded-2xl px-4 py-3 text-sm font-inter transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-coral focus-visible:ring-offset-0 placeholder:text-muted";

const inputVariants = {
  light: "glass-light text-ink",
  dark: "glass-dark text-white placeholder:text-white/40",
};

export const GlassInput = forwardRef<HTMLInputElement, GlassInputProps>(
  ({ label, error, variant = "dark", className = "", ...props }, ref) => (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label className={`text-xs font-inter font-medium ${variant === "dark" ? "text-white/70" : "text-muted"}`}>
          {label}
        </label>
      )}
      <input
        ref={ref}
        className={`${inputBase} ${inputVariants[variant]} ${error ? "ring-2 ring-red-400" : ""} ${className}`}
        {...props}
      />
      {error && <p className="text-xs text-red-400">{error}</p>}
    </div>
  )
);
GlassInput.displayName = "GlassInput";

export const GlassTextarea = forwardRef<HTMLTextAreaElement, GlassTextareaProps>(
  ({ label, error, variant = "dark", className = "", rows = 4, ...props }, ref) => (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label className={`text-xs font-inter font-medium ${variant === "dark" ? "text-white/70" : "text-muted"}`}>
          {label}
        </label>
      )}
      <textarea
        ref={ref}
        rows={rows}
        className={`${inputBase} ${inputVariants[variant]} resize-none ${error ? "ring-2 ring-red-400" : ""} ${className}`}
        {...props}
      />
      {error && <p className="text-xs text-red-400">{error}</p>}
    </div>
  )
);
GlassTextarea.displayName = "GlassTextarea";

export const GlassSelect = forwardRef<
  HTMLSelectElement,
  React.SelectHTMLAttributes<HTMLSelectElement> & { label?: string; error?: string; variant?: "light" | "dark" }
>(({ label, error, variant = "dark", className = "", children, ...props }, ref) => (
  <div className="flex flex-col gap-1.5">
    {label && (
      <label className={`text-xs font-inter font-medium ${variant === "dark" ? "text-white/70" : "text-muted"}`}>
        {label}
      </label>
    )}
    <select
      ref={ref}
      className={`${inputBase} ${inputVariants[variant]} ${error ? "ring-2 ring-red-400" : ""} ${className}`}
      {...props}
    >
      {children}
    </select>
    {error && <p className="text-xs text-red-400">{error}</p>}
  </div>
));
GlassSelect.displayName = "GlassSelect";
