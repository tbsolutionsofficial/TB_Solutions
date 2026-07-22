import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import { getDomainBySlug, getDomains } from "@/lib/firestore";
import { ArrowLeft, ChevronRight, MessageCircle } from "lucide-react";

interface Props { params: Promise<{ slug: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const domain = await getDomainBySlug(slug).catch(() => null);
  if (!domain) return { title: "Domain Not Found" };
  return {
    title: `${domain.title} — TorchBearer Solutions`,
    description: domain.short,
  };
}

export async function generateStaticParams() {
  try {
    const domains = await getDomains();
    return domains.map((d) => ({ slug: d.slug }));
  } catch {
    return [];
  }
}

export default async function DomainPage({ params }: Props) {
  const { slug } = await params;
  const [domain, allDomains] = await Promise.all([
    getDomainBySlug(slug).catch(() => null),
    getDomains().catch(() => []),
  ]);

  if (!domain) notFound();

  const related = allDomains.filter((d) => d.slug !== slug).slice(0, 3);

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-5xl px-4 py-24 sm:px-6 lg:px-8">
        <Link
          href="/#domains"
          className="mb-8 inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
        >
          <ArrowLeft className="h-4 w-4" /> Back to domains
        </Link>

        <div className="mb-12">
          <h1 className="font-display text-4xl font-bold text-foreground sm:text-5xl lg:text-6xl">
            {domain.title}
          </h1>
          <p className="mt-4 max-w-2xl text-lg text-muted-foreground">{domain.short}</p>
        </div>

        {domain.overview && (
          <section className="mb-16">
            <h2 className="mb-4 font-display text-2xl font-bold text-foreground">Overview</h2>
            <p className="text-foreground/80 leading-relaxed">{domain.overview}</p>
          </section>
        )}

        {domain.items.length > 0 && (
          <section className="mb-16">
            <h2 className="mb-6 font-display text-2xl font-bold text-foreground">What We Cover</h2>
            <div className="grid gap-3 sm:grid-cols-2">
              {domain.items.map((item) => (
                <div key={item} className="flex items-start gap-3 rounded-2xl glass p-4">
                  <ChevronRight className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                  <span className="text-sm text-foreground">{item}</span>
                </div>
              ))}
            </div>
          </section>
        )}

        {domain.services.length > 0 && (
          <section className="mb-16">
            <h2 className="mb-6 font-display text-2xl font-bold text-foreground">Our Services</h2>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {domain.services.map((svc) => (
                <div key={svc.title} className="rounded-2xl glass p-5">
                  <h3 className="font-semibold text-foreground">{svc.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">{svc.description}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {domain.faq.length > 0 && (
          <section className="mb-16">
            <h2 className="mb-6 font-display text-2xl font-bold text-foreground">FAQ</h2>
            <div className="space-y-4">
              {domain.faq.map((item) => (
                <div key={item.q} className="rounded-2xl glass p-5">
                  <p className="font-semibold text-foreground">{item.q}</p>
                  <p className="mt-2 text-sm text-muted-foreground">{item.a}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        <section className="mb-16 rounded-3xl bg-gradient-to-br from-espresso to-copper-dark p-8 text-center text-white sm:p-12">
          <h2 className="font-display text-3xl font-bold">Start your {domain.title} project</h2>
          <p className="mt-3 text-white/80">Tell us about your idea and we&apos;ll respond within 24 hours.</p>
          <a
            href="https://wa.me/916303987443"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-6 inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-semibold text-espresso hover:shadow-xl transition-all"
          >
            <MessageCircle className="h-4 w-4" /> Chat on WhatsApp
          </a>
        </section>

        {related.length > 0 && (
          <section>
            <h2 className="mb-6 font-display text-2xl font-bold text-foreground">Explore More Domains</h2>
            <div className="grid gap-4 sm:grid-cols-3">
              {related.map((d) => (
                <Link
                  key={d.slug}
                  href={`/domains/${d.slug}`}
                  className="group rounded-2xl glass p-5 transition-all hover:-translate-y-1 hover:shadow-lg"
                >
                  <p className="font-semibold text-foreground group-hover:text-primary transition-colors">{d.title}</p>
                  <p className="mt-1 text-sm text-muted-foreground line-clamp-2">{d.short}</p>
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
