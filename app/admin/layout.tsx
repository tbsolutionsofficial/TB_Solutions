"use client";
export const dynamic = "force-dynamic";
import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import AdminSidebar from "@/components/admin/AdminSidebar";
import { signOut } from "@/lib/auth";
import {
  LayoutDashboard, FolderOpen, Star, Inbox, Settings
} from "lucide-react";
import Link from "next/link";

const BOTTOM_NAV = [
  { label: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
  { label: "Projects", href: "/admin/projects", icon: FolderOpen },
  { label: "Reviews", href: "/admin/reviews", icon: Star },
  { label: "Contacts", href: "/admin/contacts", icon: Inbox },
  { label: "Settings", href: "/admin/settings", icon: Settings },
];

// Only this email is allowed to access the admin panel
const ADMIN_EMAIL = "tbsolutions.official@gmail.com";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const isLoginPage = pathname === "/admin";

  const isAuthorized = user?.email === ADMIN_EMAIL;

  useEffect(() => {
    if (loading) return;
    if (!user && !isLoginPage) {
      router.replace("/admin");
      return;
    }
    // Signed in but wrong account — sign them out immediately
    if (user && !isAuthorized) {
      signOut().then(() => router.replace("/admin"));
    }
  }, [user, loading, isLoginPage, isAuthorized, router]);

  if (isLoginPage) return <>{children}</>;

  if (loading) {
    return (
      <div className="min-h-screen mesh-bg-dark flex items-center justify-center">
        <div className="glass-dark rounded-2xl p-12 text-center">
          <p className="font-inter text-white/60">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user || !isAuthorized) return null;

  return (
    <div className="min-h-screen mesh-bg-dark">
      <AdminSidebar />

      <div className="md:pl-60 min-h-screen flex flex-col">
        {children}
      </div>

      {/* Mobile bottom tab bar */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 glass-dark border-t border-white/10">
        <div className="flex">
          {BOTTOM_NAV.map(({ label, href, icon: Icon }) => {
            const active = pathname === href || pathname.startsWith(href + "/");
            return (
              <Link
                key={href}
                href={href}
                className={`flex-1 flex flex-col items-center gap-1 py-3 text-xs font-inter transition-colors ${
                  active ? "text-coral" : "text-white/40"
                }`}
              >
                <Icon size={20} />
                {label}
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
