"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { Menu, X, MessageCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const NAV_LINKS = [
  { label: "Services", href: "#domains" },
  { label: "Projects", href: "#projects" },
  { label: "Reviews", href: "#reviews" },
  { label: "Contact", href: "#contact" },
];

function TorchIcon({ size = 24 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 2L10 8H14L12 2Z" fill="#cc785c" />
      <rect x="10" y="8" width="4" height="10" rx="2" fill="#cc785c" />
      <ellipse cx="12" cy="18" rx="3" ry="1.5" fill="#a9583e" />
      <path d="M12 4C12 4 14 6 14 7.5C14 9 13 9.5 12 9.5C11 9.5 10 9 10 7.5C10 6 12 4 12 4Z" fill="#e8a55a" opacity="0.8" />
    </svg>
  );
}

export default function GlassNav() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("");
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const sectionIds = ["domains", "projects", "reviews", "contact"];
    const observers = sectionIds.map((id) => {
      const el = document.getElementById(id);
      if (!el) return null;
      const obs = new IntersectionObserver(
        ([entry]) => { if (entry.isIntersecting) setActiveSection(`#${id}`); },
        { rootMargin: "-40% 0px -60% 0px" }
      );
      obs.observe(el);
      return obs;
    });
    return () => observers.forEach((o) => o?.disconnect());
  }, []);

  function scrollTo(href: string) {
    setMobileOpen(false);
    const id = href.replace("#", "");
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  }

  return (
    <>
      <nav
        className={`fixed top-6 left-1/2 -translate-x-1/2 z-40 w-[calc(100%-48px)] max-w-[1160px] rounded-full glass-nav transition-all duration-300 ${scrolled ? "shadow-2xl" : ""}`}
      >
        <div className="flex items-center justify-between px-6 py-3">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <TorchIcon size={28} />
            <span className="font-cormorant text-lg font-normal text-ink tracking-tight hidden sm:block">
              TB Solutions
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1">
            {NAV_LINKS.map((link) => (
              <button
                key={link.href}
                onClick={() => scrollTo(link.href)}
                className={`px-4 py-2 rounded-full text-sm font-inter font-medium transition-all duration-200 cursor-pointer ${
                  activeSection === link.href
                    ? "text-coral glass-coral"
                    : "text-body hover:text-ink hover:bg-white/20"
                }`}
              >
                {link.label}
              </button>
            ))}
          </div>

          {/* Desktop CTAs */}
          <div className="hidden md:flex items-center gap-3">
            <a
              href="https://wa.me/916303987443"
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted hover:text-coral transition-colors p-2"
              aria-label="WhatsApp"
            >
              <MessageCircle size={20} />
            </a>
            <button
              onClick={() => scrollTo("#contact")}
              className="glass-coral text-white text-sm font-inter font-medium px-5 py-2.5 rounded-full hover:brightness-110 transition-all cursor-pointer"
            >
              Start a Project
            </button>
          </div>

          {/* Mobile Hamburger */}
          <button
            className="md:hidden p-2 text-ink"
            onClick={() => setMobileOpen(true)}
            aria-label="Open menu"
          >
            <Menu size={22} />
          </button>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-50 glass-light flex flex-col items-center justify-center gap-8"
          >
            <button
              className="absolute top-6 right-6 p-2 text-ink"
              onClick={() => setMobileOpen(false)}
              aria-label="Close menu"
            >
              <X size={24} />
            </button>
            <Link href="/" className="flex items-center gap-3 mb-4" onClick={() => setMobileOpen(false)}>
              <TorchIcon size={40} />
              <span className="font-cormorant text-3xl text-ink">TorchBearer Solutions</span>
            </Link>
            {NAV_LINKS.map((link) => (
              <button
                key={link.href}
                onClick={() => scrollTo(link.href)}
                className="font-cormorant text-4xl text-ink hover:text-coral transition-colors cursor-pointer"
              >
                {link.label}
              </button>
            ))}
            <button
              onClick={() => scrollTo("#contact")}
              className="glass-coral text-white font-inter font-medium px-8 py-4 rounded-full text-lg mt-4 hover:brightness-110 transition-all cursor-pointer"
            >
              Start a Project
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
