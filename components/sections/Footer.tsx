import Link from "next/link";
import Image from "next/image";
import { Mail, Phone, MapPin, ExternalLink } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t border-border bg-cream/50">
      <div className="mx-auto max-w-7xl px-5 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-2">
          <div>
            <Link href="/" className="flex items-center gap-3">
              <Image src="/logo.png" alt="TorchBearer Solutions" width={48} height={48} className="h-12 w-auto object-contain" />
              <span className="font-display text-xl font-bold text-foreground">TorchBearer Solutions</span>
            </Link>
            <p className="mt-4 max-w-md text-base leading-relaxed text-muted-foreground">
              Guiding ideas, empowering impact. Your trusted partner for final year projects, AI, automation, robotics, IoT, and digital transformation across India.
            </p>
            <div className="mt-6 flex gap-3">
              <a
                href="https://www.linkedin.com/company/torchbearer-solutions"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-secondary text-muted-foreground transition-colors hover:bg-primary hover:text-primary-foreground"
                aria-label="LinkedIn"
              >
                <ExternalLink className="h-5 w-5" />
              </a>
              <a
                href="https://www.instagram.com/tbsolutions.official"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-secondary text-muted-foreground transition-colors hover:bg-primary hover:text-primary-foreground"
                aria-label="Instagram"
              >
                <ExternalLink className="h-5 w-5" />
              </a>
            </div>
          </div>

          <div className="grid gap-8 sm:grid-cols-2">
            <div>
              <h4 className="font-display text-sm font-bold uppercase tracking-wider text-foreground">Quick links</h4>
              <ul className="mt-4 space-y-3">
                {[
                  { label: "Expertise", href: "#expertise" },
                  { label: "About us", href: "#about" },
                  { label: "Our process", href: "#process" },
                  { label: "Contact", href: "#contact" },
                  { label: "Terms & Conditions", href: "/terms" },
                ].map((link) => (
                  <li key={link.href}>
                    <a href={link.href} className="text-muted-foreground transition-colors hover:text-primary">
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="font-display text-sm font-bold uppercase tracking-wider text-foreground">Contact</h4>
              <ul className="mt-4 space-y-3">
                <li className="flex items-start gap-3 text-muted-foreground">
                  <Mail className="mt-0.5 h-4 w-4 shrink-0 text-copper" />
                  <span>tbsolutions.official@gmail.com</span>
                </li>
                <li className="flex items-start gap-3 text-muted-foreground">
                  <Phone className="mt-0.5 h-4 w-4 shrink-0 text-copper" />
                  <span>+91 63039 87443</span>
                </li>
                <li className="flex items-start gap-3 text-muted-foreground">
                  <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-copper" />
                  <span>India — serving students nationwide</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-border pt-8 sm:flex-row">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} TorchBearer Solutions. All rights reserved.
          </p>
          <p className="text-sm text-muted-foreground">Guiding Ideas. Empowering Impact.</p>
        </div>
      </div>
    </footer>
  );
}
