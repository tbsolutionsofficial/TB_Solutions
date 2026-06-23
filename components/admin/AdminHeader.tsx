"use client";
import { ExternalLink } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

interface AdminHeaderProps {
  title: string;
}

export default function AdminHeader({ title }: AdminHeaderProps) {
  const { user } = useAuth();
  const initials = (user?.email ?? "A").slice(0, 2).toUpperCase();

  return (
    <header className="glass-dark border-b border-white/10 px-6 py-4 flex items-center justify-between sticky top-0 z-20">
      <h1 className="font-cormorant text-2xl text-white">{title}</h1>
      <div className="flex items-center gap-3">
        <a
          href="/"
          target="_blank"
          rel="noopener noreferrer"
          className="hidden sm:flex items-center gap-2 glass-light text-ink font-inter text-sm px-4 py-2 rounded-full hover:brightness-105 transition-all"
        >
          <ExternalLink size={14} />
          View Site
        </a>
        <div className="w-9 h-9 rounded-full glass-coral flex items-center justify-center text-white font-inter font-medium text-sm">
          {initials}
        </div>
      </div>
    </header>
  );
}
