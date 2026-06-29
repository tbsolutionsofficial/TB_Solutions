"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Menu, X, MessageCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const NAV_LINKS = [
  { label: "Services", href: "#domains" },
  { label: "Projects", href: "#projects" },
  { label: "Reviews", href: "#reviews" },
  { label: "Contact", href: "#contact" },
];

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
        <div className="flex items-center justify-between px-4 py-2">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <Image
              src="/logo.png"
              alt="TB Solutions"
              width={160}
              height={44}
              className="h-14 w-auto object-contain"
              priority
            />
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
              href="https://wa.me/916303987443?text=Hi%20TorchBearer%20Solutions!%20I%20need%20help%20with%20my%20project."
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted hover:text-coral transition-colors p-2"
              aria-label="WhatsApp"
            >
              <MessageCircle size={20} />
            </a>
            <button
              onClick={() => scrollTo("#contact")}
              className="glass-coral text-white text-sm font-inter font-semibold px-6 py-2.5 rounded-full hover:brightness-110 transition-all cursor-pointer shadow-sm"
            >
              Get Free Quote
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
            <Link href="/" className="mb-4" onClick={() => setMobileOpen(false)}>
              <Image
                src="/logo.png"
                alt="TB Solutions"
                width={240}
                height={66}
                className="h-20 w-auto object-contain"
              />
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
