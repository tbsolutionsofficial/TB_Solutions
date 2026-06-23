"use client";
import { useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion, useInView } from "framer-motion";
import { toast } from "sonner";
import { Phone, Mail, MessageCircle, Globe } from "lucide-react";
import { DOMAINS } from "@/lib/types";
import { GlassInput, GlassTextarea, GlassSelect } from "@/components/ui/GlassInput";
import GlassButton from "@/components/ui/GlassButton";

const contactSchema = z.object({
  name: z.string().min(2, "Name is required"),
  company: z.string().min(1, "College/Company is required"),
  email: z.string().email("Valid email required"),
  phone: z.string().min(10, "Valid phone number required"),
  domain: z.string().min(1, "Please select a domain"),
  message: z.string().min(10, "Message must be at least 10 characters"),
});
type ContactFormData = z.infer<typeof contactSchema>;

const CONTACT_LINKS = [
  { icon: Phone, label: "+91 6303987443", href: "tel:+916303987443" },
  { icon: Mail, label: "hello@torchbearersolutions.in", href: "mailto:hello@torchbearersolutions.in" },
  { icon: MessageCircle, label: "WhatsApp", href: "https://wa.me/916303987443" },
  { icon: Globe, label: "tbsolutions.web.app", href: "https://tbsolutions.web.app" },
];

export default function ContactSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
  });

  async function onSubmit(data: ContactFormData) {
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Failed");
      toast.success("Message sent! We'll get back to you soon.");
      reset();
    } catch {
      toast.error("Failed to send message. Please try WhatsApp or email directly.");
    }
  }

  return (
    <section id="contact" className="relative py-24 px-6 overflow-hidden">
      <div className="absolute inset-0 mesh-bg-coral" />

      <div className="relative max-w-4xl mx-auto">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 40 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h2 className="font-cormorant text-[clamp(36px,6vw,56px)] text-white tracking-[-1px] mb-3">
            Ready to Build Something?
          </h2>
          <p className="font-inter text-white/80 text-lg">
            Tell us your project. We&apos;ll light the way.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="glass-light glass-shimmer relative rounded-3xl p-8 md:p-10"
        >
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <GlassInput
                label="Full Name *"
                variant="light"
                placeholder="Your name"
                {...register("name")}
                error={errors.name?.message}
              />
              <GlassInput
                label="College / Company *"
                variant="light"
                placeholder="Your institution"
                {...register("company")}
                error={errors.company?.message}
              />
              <GlassInput
                label="Email Address *"
                type="email"
                variant="light"
                placeholder="you@example.com"
                {...register("email")}
                error={errors.email?.message}
              />
              <GlassInput
                label="Phone Number *"
                type="tel"
                variant="light"
                placeholder="+91 XXXXX XXXXX"
                {...register("phone")}
                error={errors.phone?.message}
              />
            </div>
            <GlassSelect
              label="Domain of Interest *"
              variant="light"
              {...register("domain")}
              error={errors.domain?.message}
            >
              <option value="">Select a domain</option>
              {DOMAINS.map((d) => <option key={d} value={d}>{d}</option>)}
            </GlassSelect>
            <GlassTextarea
              label="Project Message *"
              variant="light"
              placeholder="Describe your project idea, requirements, timeline..."
              rows={4}
              {...register("message")}
              error={errors.message?.message}
            />
            <GlassButton type="submit" variant="coral" fullWidth loading={isSubmitting} size="lg">
              Send Message
            </GlassButton>
          </form>

          {/* Contact Chips */}
          <div className="flex flex-wrap gap-3 mt-8 pt-8 border-t border-hairline">
            {CONTACT_LINKS.map(({ icon: Icon, label, href }) => (
              <a
                key={label}
                href={href}
                target={href.startsWith("http") ? "_blank" : undefined}
                rel="noopener noreferrer"
                className="flex items-center gap-2 glass-light text-body text-sm font-inter px-4 py-2.5 rounded-full hover:text-ink transition-colors"
              >
                <Icon size={15} className="text-coral" />
                {label}
              </a>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
