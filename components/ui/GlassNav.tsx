"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";

const navLinks = [
  { label: "Domains", href: "#domains" },
  { label: "Projects", href: "#projects" },
  { label: "Gallery", href: "#gallery" },
  { label: "Testimonials", href: "#testimonials" },
  { label: "About", href: "#about" },
  { label: "Process", href: "#process" },
  { label: "Contact", href: "#contact" },
];

export default function GlassNav() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [active, setActive] = useState("");

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => { if (e.isIntersecting) setActive("#" + e.target.id); });
      },
      { rootMargin: "-45% 0px -50% 0px" }
    );
    navLinks.forEach(({ href }) => {
      const el = document.getElementById(href.replace("#", ""));
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  return (
    <>
      <motion.header
        initial={{ y: -24, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className={`fixed left-0 right-0 top-0 z-50 transition-all duration-500 ${scrolled ? "py-2" : "py-4"}`}
      >
        <nav className={`mx-auto px-4 sm:px-6 lg:px-8 transition-all duration-500 ${scrolled ? "max-w-6xl" : "max-w-7xl"}`}>
          <div className={`flex items-center justify-between rounded-full transition-all duration-500 ${scrolled ? "glass-strong shadow-xl px-3 py-2" : "glass px-4 py-2.5"}`}>
            <Link href="/" className="flex items-center" aria-label="TorchBearer Solutions home">
              <Image
                src="/logo.png"
                alt="TorchBearer Solutions"
                width={160}
                height={56}
                className={`w-auto object-contain transition-all duration-500 ${scrolled ? "h-11" : "h-14"}`}
                priority
              />
            </Link>

            <div className="hidden items-center gap-0.5 lg:flex">
              {navLinks.map((link) => {
                const isActive = active === link.href;
                return (
                  <a
                    key={link.href}
                    href={link.href}
                    className={`relative rounded-full px-3.5 py-2 text-sm font-medium transition-colors ${isActive ? "text-primary" : "text-foreground/75 hover:text-primary"}`}
                  >
                    {isActive && (
                      <motion.span
                        layoutId="nav-pill"
                        className="absolute inset-0 rounded-full bg-primary/10"
                        transition={{ type: "spring", stiffness: 380, damping: 30 }}
                      />
                    )}
                    <span className="relative">{link.label}</span>
                  </a>
                );
              })}
            </div>

            <div className="hidden lg:block">
              <a
                href="#contact"
                className={`group relative inline-flex items-center justify-center overflow-hidden rounded-full bg-primary font-semibold text-primary-foreground transition-all hover:shadow-lg hover:shadow-copper/40 ${scrolled ? "px-4 py-2 text-xs" : "px-5 py-2.5 text-sm"}`}
              >
                <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/25 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
                <span className="relative">Get In Touch</span>
              </a>
            </div>

            <button
              onClick={() => setMobileOpen(true)}
              className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-secondary lg:hidden"
              aria-label="Open menu"
            >
              <Menu className="h-5 w-5 text-foreground" />
            </button>
          </div>
        </nav>
      </motion.header>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] bg-background/95 backdrop-blur-xl"
          >
            <div className="flex h-full flex-col p-6">
              <div className="flex items-center justify-between">
                <Link href="/" onClick={() => setMobileOpen(false)}>
                  <Image src="/logo.png" alt="TorchBearer Solutions" width={120} height={48} className="h-12 w-auto object-contain" />
                </Link>
                <button
                  onClick={() => setMobileOpen(false)}
                  className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-secondary"
                  aria-label="Close menu"
                >
                  <X className="h-5 w-5 text-foreground" />
                </button>
              </div>
              <nav className="mt-10 flex flex-col gap-1">
                {navLinks.map((link, i) => (
                  <motion.a
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileOpen(false)}
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: i * 0.05 }}
                    className="rounded-2xl px-4 py-4 font-display text-2xl font-bold text-foreground transition-colors hover:bg-primary/10"
                  >
                    {link.label}
                  </motion.a>
                ))}
              </nav>
              <div className="mt-auto">
                <a
                  href="#contact"
                  onClick={() => setMobileOpen(false)}
                  className="flex w-full items-center justify-center rounded-full bg-primary px-6 py-4 text-base font-semibold text-primary-foreground transition-all hover:bg-copper-dark"
                >
                  Get In Touch
                </a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
