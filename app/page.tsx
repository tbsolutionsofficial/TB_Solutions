"use client";
export const dynamic = "force-dynamic";
import { useState } from "react";
import GlassNav from "@/components/ui/GlassNav";
import Hero from "@/components/sections/Hero";
import DomainsStrip from "@/components/sections/DomainsStrip";
import ProjectsSection from "@/components/sections/ProjectsSection";
import HowWeWork from "@/components/sections/HowWeWork";
import WhoWeServe from "@/components/sections/WhoWeServe";
import ReviewsSection from "@/components/sections/ReviewsSection";
import ContactSection from "@/components/sections/ContactSection";
import Footer from "@/components/sections/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import { useSiteContent } from "@/hooks/useSiteContent";

export default function HomePage() {
  const { content } = useSiteContent();
  const [domainFilter, setDomainFilter] = useState<string | undefined>(undefined);

  return (
    <>
      <GlassNav />
      <main>
        <Hero content={content} />
        <DomainsStrip onDomainClick={(d) => setDomainFilter(d)} />
        <ProjectsSection initialFilter={domainFilter} />
        <HowWeWork />
        <WhoWeServe />
        <ReviewsSection />
        <ContactSection />
      </main>
      <Footer />
      <WhatsAppButton />
    </>
  );
}
