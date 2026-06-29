"use client";
export const dynamic = "force-dynamic";
import { useState } from "react";
import GlassNav from "@/components/ui/GlassNav";
import Hero from "@/components/sections/Hero";
import DomainsStrip from "@/components/sections/DomainsStrip";
import BannersSection from "@/components/sections/BannersSection";
import ProjectsSection from "@/components/sections/ProjectsSection";
import OffersSection from "@/components/sections/OffersSection";
import WhyChooseUs from "@/components/sections/WhyChooseUs";
import HowWeWork from "@/components/sections/HowWeWork";
import WhoWeServe from "@/components/sections/WhoWeServe";
import ReviewsSection from "@/components/sections/ReviewsSection";
import ContactSection from "@/components/sections/ContactSection";
import Footer from "@/components/sections/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import MobileStickyBar from "@/components/MobileStickyBar";
import { useSiteContent } from "@/hooks/useSiteContent";

export default function HomePage() {
  const { content } = useSiteContent();
  const [domainFilter, setDomainFilter] = useState<string | undefined>(undefined);

  return (
    <>
      <GlassNav />
      <main className="pb-16 md:pb-0">
        <Hero content={content} />
        <BannersSection onDomainClick={(d) => { setDomainFilter(d); }} />
        <DomainsStrip onDomainClick={(d) => setDomainFilter(d)} />
        <ProjectsSection initialFilter={domainFilter} />
        <WhyChooseUs />
        <OffersSection />
        <HowWeWork />
        <WhoWeServe />
        <ReviewsSection />
        <ContactSection />
      </main>
      <Footer />
      <WhatsAppButton />
      <MobileStickyBar />
    </>
  );
}
