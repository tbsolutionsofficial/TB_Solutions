"use client";
import Link from "next/link";
import Image from "next/image";
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
      <div className="flex items-center justify-center px-4 py-4 border-b border-white/10">
        <div className="bg-white/95 rounded-xl px-3 py-1.5">
          <Image
            src="/logo.png"
            alt="TB Solutions"
            width={160}
            height={44}
            className="h-12 w-auto object-contain"
            priority
          />
        </div>
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
