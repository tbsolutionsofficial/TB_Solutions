"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  FolderOpen,
  Star,
  FileText,
  Settings,
  LogOut,
  ExternalLink,
} from "lucide-react";
import { signOut } from "@/lib/auth";
import { toast } from "sonner";

const NAV_ITEMS = [
  { label: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
  { label: "Projects", href: "/admin/projects", icon: FolderOpen },
  { label: "Reviews", href: "/admin/reviews", icon: Star },
  { label: "Site Content", href: "/admin/content", icon: FileText },
  { label: "Settings", href: "/admin/settings", icon: Settings },
];

function TorchIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
      <path d="M12 2L10 8H14L12 2Z" fill="#cc785c" />
      <rect x="10" y="8" width="4" height="10" rx="2" fill="#cc785c" />
      <ellipse cx="12" cy="18" rx="3" ry="1.5" fill="#a9583e" />
      <path d="M12 4C12 4 14 6 14 7.5C14 9 13 9.5 12 9.5C11 9.5 10 9 10 7.5C10 6 12 4 12 4Z" fill="#e8a55a" opacity="0.8" />
    </svg>
  );
}

export default function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();

  async function handleLogout() {
    await signOut();
    toast.success("Logged out.");
    router.push("/admin");
  }

  return (
    <aside className="hidden md:flex flex-col w-60 min-h-screen glass-dark border-r border-white/10 fixed left-0 top-0 z-30">
      {/* Brand */}
      <div className="flex items-center gap-2.5 px-6 py-5 border-b border-white/10">
        <TorchIcon />
        <span className="font-cormorant text-white text-lg">TB Solutions</span>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {NAV_ITEMS.map(({ label, href, icon: Icon }) => {
          const active = pathname === href || pathname.startsWith(href + "/");
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl font-inter text-sm transition-all duration-200 ${
                active
                  ? "glass-coral text-white"
                  : "text-white/60 hover:text-white hover:bg-white/5"
              }`}
            >
              <Icon size={18} />
              {label}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="px-3 pb-4 space-y-1 border-t border-white/10 pt-4">
        <a
          href="/"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-3 px-4 py-3 rounded-xl font-inter text-sm text-white/60 hover:text-white hover:bg-white/5 transition-all"
        >
          <ExternalLink size={18} />
          View Site
        </a>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl font-inter text-sm text-white/60 hover:text-red-400 hover:bg-red-400/5 transition-all cursor-pointer"
        >
          <LogOut size={18} />
          Logout
        </button>
      </div>
    </aside>
  );
}
