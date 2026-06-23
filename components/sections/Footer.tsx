import Link from "next/link";
import { Phone, Mail, Globe } from "lucide-react";

function InstagramIcon({ size = 13 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
    </svg>
  );
}

function LinkedinIcon({ size = 13 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
      <rect x="2" y="9" width="4" height="12" />
      <circle cx="4" cy="4" r="2" />
    </svg>
  );
}

function TorchIcon({ size = 24 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path d="M12 2L10 8H14L12 2Z" fill="#cc785c" />
      <rect x="10" y="8" width="4" height="10" rx="2" fill="#cc785c" />
      <ellipse cx="12" cy="18" rx="3" ry="1.5" fill="#a9583e" />
      <path d="M12 4C12 4 14 6 14 7.5C14 9 13 9.5 12 9.5C11 9.5 10 9 10 7.5C10 6 12 4 12 4Z" fill="#e8a55a" opacity="0.8" />
    </svg>
  );
}

const FOOTER_LINKS = {
  Services: [
    "Artificial Intelligence",
    "Robotics",
    "IoT",
    "Web Development",
    "App Development",
    "Embedded Systems",
  ],
  "Quick Links": [
    { label: "Projects", href: "#projects" },
    { label: "Reviews", href: "#reviews" },
    { label: "How We Work", href: "#" },
    { label: "Contact", href: "#contact" },
  ],
  Contact: [
    { icon: Phone, label: "+91 6303987443", href: "tel:+916303987443" },
    { icon: Mail, label: "hello@torchbearersolutions.in", href: "mailto:hello@torchbearersolutions.in" },
    { icon: Globe, label: "tbsolutions.web.app", href: "https://tbsolutions.web.app" },
  ],
  "Follow Us": [
    { icon: InstagramIcon, label: "Instagram", href: "#" },
    { icon: LinkedinIcon, label: "LinkedIn", href: "#" },
  ],
};

export default function Footer() {
  return (
    <footer className="relative py-16 px-6 overflow-hidden">
      <div className="absolute inset-0 mesh-bg-dark" />

      <div className="relative max-w-7xl mx-auto">
        {/* Brand */}
        <div className="flex flex-col items-center mb-12">
          <div className="flex items-center gap-3 mb-2">
            <TorchIcon size={36} />
            <span className="font-cormorant text-2xl text-white">TorchBearer Solutions</span>
          </div>
          <em className="font-cormorant text-coral text-lg not-italic">We Light the Way</em>
        </div>

        {/* Links Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
          {/* Services */}
          <div>
            <h4 className="font-inter text-xs font-medium text-white/40 uppercase tracking-[2px] mb-4">Services</h4>
            <ul className="space-y-2">
              {FOOTER_LINKS.Services.map((s) => (
                <li key={s}>
                  <span className="font-inter text-sm text-white/60 hover:text-coral transition-colors cursor-default">
                    {s}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-inter text-xs font-medium text-white/40 uppercase tracking-[2px] mb-4">Quick Links</h4>
            <ul className="space-y-2">
              {FOOTER_LINKS["Quick Links"].map((l) => (
                <li key={l.label}>
                  <button
                    onClick={() => {
                      const id = l.href.replace("#", "");
                      if (id) document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
                    }}
                    className="font-inter text-sm text-white/60 hover:text-coral transition-colors cursor-pointer"
                  >
                    {l.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-inter text-xs font-medium text-white/40 uppercase tracking-[2px] mb-4">Contact</h4>
            <ul className="space-y-2">
              {FOOTER_LINKS.Contact.map(({ icon: Icon, label, href }) => (
                <li key={label}>
                  <a
                    href={href}
                    target={href.startsWith("http") ? "_blank" : undefined}
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 font-inter text-sm text-white/60 hover:text-coral transition-colors"
                  >
                    <Icon size={13} />
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Follow */}
          <div>
            <h4 className="font-inter text-xs font-medium text-white/40 uppercase tracking-[2px] mb-4">Follow Us</h4>
            <ul className="space-y-2">
              {FOOTER_LINKS["Follow Us"].map(({ icon: Icon, label, href }) => (
                <li key={label}>
                  <a
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 font-inter text-sm text-white/60 hover:text-coral transition-colors"
                  >
                    <Icon size={13} />
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-white/10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="font-inter text-xs text-white/40">
            © 2026 TorchBearer Solutions. All rights reserved.
          </p>
          <Link href="/admin" className="font-inter text-xs text-white/30 hover:text-white/60 transition-colors">
            Admin
          </Link>
        </div>
      </div>
    </footer>
  );
}
