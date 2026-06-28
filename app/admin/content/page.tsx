"use client";
export const dynamic = "force-dynamic";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { getSiteContent, updateSiteContent, initSiteContent } from "@/lib/firestore";
import type { SiteContent } from "@/lib/types";
import AdminHeader from "@/components/admin/AdminHeader";
import { GlassInput, GlassTextarea } from "@/components/ui/GlassInput";
import GlassButton from "@/components/ui/GlassButton";
import { toast } from "sonner";
import { ExternalLink } from "lucide-react";

export default function AdminContentPage() {
  const [loading, setLoading] = useState(true);
  const { register, handleSubmit, reset, formState: { isSubmitting } } = useForm<SiteContent>();

  useEffect(() => {
    getSiteContent().then((c) => {
      if (c) reset(c);
      setLoading(false);
    });
  }, [reset]);

  async function onSubmit(data: SiteContent) {
    try {
      const existing = await getSiteContent();
      if (existing) { await updateSiteContent(data); }
      else { await initSiteContent(data); }
      toast.success("Site content updated!");
    } catch {
      toast.error("Failed to save. Try again.");
    }
  }

  if (loading) {
    return (
      <>
        <AdminHeader title="Site Content" />
        <div className="flex-1 flex items-center justify-center">
          <p className="font-inter text-white/40">Loading...</p>
        </div>
      </>
    );
  }

  return (
    <>
      <AdminHeader title="Site Content" />
      <div className="flex-1 p-6 pb-24 md:pb-6">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="font-cormorant text-2xl text-white">Edit Site Content</h2>
              <p className="font-inter text-sm text-white/40">Changes appear on the public site immediately.</p>
            </div>
            <a
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 glass-dark text-white/70 font-inter text-sm px-4 py-2 rounded-full hover:text-coral transition-colors"
            >
              <ExternalLink size={14} />
              Preview
            </a>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {/* Hero */}
            <div className="glass-dark rounded-2xl p-6 space-y-5">
              <h3 className="font-cormorant text-lg text-coral">Hero Section</h3>
              <GlassInput label="Hero Headline" {...register("heroHeadline")} />
              <GlassTextarea label="Hero Subtitle" rows={3} {...register("heroSubtitle")} />
              <div className="grid grid-cols-2 gap-4">
                <GlassInput label="Projects Count" placeholder="100+" {...register("projectsCount")} />
                <GlassInput label="Domains Count" placeholder="12" {...register("domainsCount")} />
              </div>
            </div>

            {/* Contact */}
            <div className="glass-dark rounded-2xl p-6 space-y-5">
              <h3 className="font-cormorant text-lg text-coral">Contact Info</h3>
              <GlassInput label="Phone Number" {...register("phone")} />
              <GlassInput label="Email Address" type="email" {...register("email")} />
              <GlassInput label="Website URL" {...register("website")} />
              <GlassInput label="WhatsApp Number (digits only)" {...register("whatsapp")} />
            </div>

            {/* Social */}
            <div className="glass-dark rounded-2xl p-6 space-y-5">
              <h3 className="font-cormorant text-lg text-coral">Social Media</h3>
              <GlassInput label="Instagram Handle" placeholder="@youraccount" {...register("instagram")} />
              <GlassInput label="LinkedIn URL" {...register("linkedin")} />
            </div>

            {/* About */}
            <div className="glass-dark rounded-2xl p-6 space-y-5">
              <h3 className="font-cormorant text-lg text-coral">About Section</h3>
              <GlassInput label="About Title" placeholder="About TorchBearer Solutions" {...register("aboutTitle")} />
              <GlassTextarea label="About Text (main paragraph)" rows={5} {...register("aboutText")} />
              <GlassTextarea label="Our Mission" rows={3} {...register("aboutMission")} />
              <GlassTextarea label="Our Vision" rows={3} {...register("aboutVision")} />
            </div>

            {/* Offers Headline */}
            <div className="glass-dark rounded-2xl p-6 space-y-5">
              <h3 className="font-cormorant text-lg text-coral">Offers Section</h3>
              <GlassInput label="Section Headline" placeholder="Exclusive Deals for You" {...register("offersHeadline")} />
              <GlassInput label="Section Subtitle" placeholder="Limited time offers for students and professionals" {...register("offersSubtitle")} />
            </div>

            {/* Terms */}
            <div className="glass-dark rounded-2xl p-6 space-y-5">
              <h3 className="font-cormorant text-lg text-coral">Terms & Conditions</h3>
              <p className="font-inter text-xs text-white/40">Write in plain text. Use blank lines between paragraphs.</p>
              <GlassInput label="Last Updated Date" placeholder="e.g. June 2026" {...register("termsLastUpdated")} />
              <GlassTextarea label="Terms & Conditions Content" rows={12} {...register("termsContent")} />
            </div>

            <GlassButton type="submit" variant="coral" fullWidth size="lg" loading={isSubmitting}>
              Save All Changes
            </GlassButton>
          </form>
        </div>
      </div>
    </>
  );
}
