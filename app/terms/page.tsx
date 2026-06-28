"use client";
export const dynamic = "force-dynamic";
import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { getSiteContent } from "@/lib/firestore";
import GlassNav from "@/components/ui/GlassNav";
import Footer from "@/components/sections/Footer";

export default function TermsPage() {
  const [content, setContent] = useState<string>("");
  const [lastUpdated, setLastUpdated] = useState<string>("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getSiteContent().then((c) => {
      setContent(c?.termsContent || "Terms and Conditions content will be available soon.");
      setLastUpdated(c?.termsLastUpdated || "");
      setLoading(false);
    });
  }, []);

  return (
    <>
      <GlassNav />
      <main className="min-h-screen pt-28 pb-16 px-6">
        <div className="max-w-3xl mx-auto">
          <Link href="/" className="inline-flex items-center gap-2 font-inter text-sm text-muted hover:text-coral transition-colors mb-8">
            <ArrowLeft size={16} /> Back to Home
          </Link>
          <div className="glass-light glass-shimmer rounded-3xl p-8 md:p-12 border border-hairline">
            <h1 className="font-cormorant text-[clamp(32px,5vw,52px)] text-ink tracking-[-1px] mb-2">
              Terms & Conditions
            </h1>
            {lastUpdated && (
              <p className="font-inter text-sm text-muted mb-8">Last updated: {lastUpdated}</p>
            )}
            {loading ? (
              <div className="space-y-3">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="h-4 rounded bg-ink/5 animate-pulse" style={{ width: `${70 + i * 7}%` }} />
                ))}
              </div>
            ) : (
              <div className="font-inter text-body text-sm leading-7 space-y-4 whitespace-pre-wrap">
                {content}
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
