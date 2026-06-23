"use client";
import { useState, useEffect } from "react";
import { subscribeSiteContent } from "@/lib/firestore";
import type { SiteContent } from "@/lib/types";

const DEFAULT_CONTENT: SiteContent = {
  heroHeadline: "We Light the Way to Tomorrow's Technology",
  heroSubtitle:
    "Project services across 12 technology domains for students, colleges, and industries across India.",
  phone: "+91 6303987443",
  email: "hello@torchbearersolutions.in",
  website: "tbsolutions.web.app",
  projectsCount: "100+",
  domainsCount: "12",
};

export function useSiteContent() {
  const [content, setContent] = useState<SiteContent>(DEFAULT_CONTENT);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = subscribeSiteContent((c) => {
      setContent(c);
      setLoading(false);
    });
    setTimeout(() => setLoading(false), 3000);
    return unsub;
  }, []);

  return { content, loading };
}
