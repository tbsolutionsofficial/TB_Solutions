"use client";
export const dynamic = "force-dynamic";

import { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import {
  ArrowRight,
  CheckCircle2,
  Send,
  Phone,
  MessageCircle,
} from "lucide-react";
import { toast } from "sonner";
import GlassNav from "@/components/ui/GlassNav";
import Footer from "@/components/sections/Footer";
import DomainsSection from "@/components/sections/DomainsSection";
import GallerySection from "@/components/sections/GallerySection";
import TestimonialsSection from "@/components/sections/TestimonialsSection";
import ProcessSection from "@/components/sections/ProcessSection";
import { saveContactSubmission } from "@/lib/firestore";

const fadeInUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0 },
};

const whyUs = [
  "Cross-domain expertise from AI to hardware",
  "End-to-end project consultancy model",
  "Source code + documentation with every delivery",
  "2 weeks of free post-delivery support",
  "IEEE & publication-ready research builds",
  "Transparent pricing from ₹2,999",
];

export default function HomePage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    company: "",
    phone: "",
    message: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await saveContactSubmission({
        name: formData.name,
        company: formData.company || "",
        email: formData.email,
        phone: formData.phone || "",
        domain: "General",
        message: formData.message,
      });

      fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      }).catch(() => {});

      setSubmitted(true);
      toast.success("Message sent! We'll reply within 24 hours.");
    } catch {
      toast.error("Something went wrong. Please try WhatsApp instead.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <GlassNav />

      {/* Hero */}
      <section className="relative flex min-h-screen items-center overflow-hidden px-5 pt-24 sm:px-6 lg:px-8">
        <div className="absolute inset-0 -z-10">
          <div className="absolute left-1/4 top-1/4 h-[500px] w-[500px] rounded-full bg-copper/10 blur-[120px]" />
          <div className="absolute bottom-1/4 right-1/4 h-[400px] w-[400px] rounded-full bg-copper-light/15 blur-[100px]" />
        </div>

        <div className="mx-auto w-full max-w-7xl py-12">
          <div className="grid items-center gap-8 lg:grid-cols-2 lg:gap-12">
            {/* Left — text content */}
            <motion.div
              initial="hidden"
              animate="visible"
              variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
            >
              <motion.div variants={fadeInUp} className="mb-6">
                <Image
                  src="/logo.png"
                  alt="TorchBearer Solutions"
                  width={160}
                  height={160}
                  className="h-20 w-auto object-contain sm:h-24"
                  priority
                />
              </motion.div>

              <motion.h1
                variants={fadeInUp}
                className="font-display text-4xl font-bold leading-[1.1] text-foreground sm:text-5xl lg:text-6xl xl:text-7xl"
              >
                Guiding Ideas.
                <br />
                <span className="text-gradient-copper">Empowering Impact.</span>
              </motion.h1>

              <motion.p
                variants={fadeInUp}
                className="mt-6 max-w-xl text-lg leading-relaxed text-muted-foreground sm:text-xl"
              >
                TorchBearer Solutions is your trusted project partner across AI,
                automation, software, robotics, IoT, and digital transformation.
                From final year projects to industry solutions — we turn ideas into reality.
              </motion.p>

              <motion.div
                variants={fadeInUp}
                className="mt-8 flex flex-col gap-4 sm:flex-row"
              >
                <a
                  href="#expertise"
                  className="group inline-flex items-center justify-center gap-2 rounded-full bg-primary px-8 py-4 text-base font-semibold text-primary-foreground transition-all hover:bg-copper-dark hover:shadow-xl hover:shadow-copper/20"
                >
                  Explore our expertise
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </a>
                <a
                  href="#contact"
                  className="inline-flex items-center justify-center gap-2 rounded-full border border-border bg-background/50 px-8 py-4 text-base font-semibold text-foreground transition-all hover:bg-secondary"
                >
                  Start a project
                </a>
              </motion.div>

              <motion.div variants={fadeInUp} className="mt-10 flex flex-wrap gap-8">
                {[
                  { value: "150+", label: "Projects Delivered" },
                  { value: "11", label: "Tech Domains" },
                  { value: "98%", label: "On-Time Delivery" },
                ].map((s) => (
                  <div key={s.label}>
                    <div className="font-display text-3xl font-bold text-copper-dark">{s.value}</div>
                    <div className="mt-1 text-sm text-muted-foreground">{s.label}</div>
                  </div>
                ))}
              </motion.div>
            </motion.div>

            {/* Right — transparent character overlay */}
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1], delay: 0.15 }}
              className="flex items-end justify-center lg:justify-end"
            >
              <video
                src="/hero-animation.mp4"
                autoPlay
                loop
                muted
                playsInline
                className="w-full max-w-[520px] object-contain"
                style={{ mixBlendMode: "multiply" }}
              />
            </motion.div>
          </div>
        </div>
      </section>

      <DomainsSection />

      <GallerySection />

      {/* About / Why us */}
      <section id="about" className="bg-cream px-5 py-20 sm:px-6 lg:px-8 lg:py-28">
        <div className="mx-auto max-w-7xl">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <motion.div
              initial={{ opacity: 0, x: -24 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6 }}
            >
              <span className="inline-flex items-center gap-2 rounded-full bg-secondary px-4 py-1.5 text-sm font-semibold text-copper-dark">
                Why TorchBearer Solutions
              </span>
              <h2 className="mt-6 font-display text-3xl font-bold leading-tight text-foreground sm:text-4xl lg:text-5xl">
                Technology moves fast.
                <br />
                <span className="text-gradient-copper">We keep you ahead.</span>
              </h2>
              <p className="mt-6 text-lg leading-relaxed text-foreground/80">
                We don&apos;t just build projects — we architect outcomes. Our team
                blends research, engineering, and design thinking to deliver
                solutions that are robust, IEEE-ready, and built for the real world.
              </p>

              <ul className="mt-8 space-y-4">
                {whyUs.map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-copper" />
                    <span className="text-foreground">{item}</span>
                  </li>
                ))}
              </ul>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 24 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6 }}
              className="grid gap-6"
            >
              {[
                { label: "Projects Delivered", value: "150+" },
                { label: "Technology Domains", value: "11+" },
                { label: "On-Time Delivery Rate", value: "98%" },
              ].map((stat) => (
                <div
                  key={stat.label}
                  className="glass rounded-3xl p-8 text-center transition-all hover:shadow-xl hover:shadow-copper/10"
                >
                  <div className="font-display text-4xl font-bold text-copper-dark sm:text-5xl">
                    {stat.value}
                  </div>
                  <div className="mt-2 text-sm font-medium uppercase tracking-wider text-foreground/70">
                    {stat.label}
                  </div>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      <TestimonialsSection />

      <ProcessSection />

      {/* Contact */}
      <section id="contact" className="bg-cream/50 px-5 py-20 sm:px-6 lg:px-8 lg:py-28">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-12 lg:grid-cols-2">
            <motion.div
              initial={{ opacity: 0, x: -24 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6 }}
            >
              <span className="inline-flex items-center gap-2 rounded-full bg-secondary px-4 py-1.5 text-sm font-semibold text-copper-dark">
                Contact
              </span>
              <h2 className="mt-6 font-display text-3xl font-bold leading-tight text-foreground sm:text-4xl lg:text-5xl">
                Let&apos;s build something remarkable.
              </h2>
              <p className="mt-6 text-lg leading-relaxed text-muted-foreground">
                Tell us about your project. We&apos;ll respond within 24 hours with
                next steps and a tailored approach.
              </p>

              <div className="mt-10 space-y-6">
                <div className="flex items-center gap-4">
                  <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-copper-dark">
                    <Send className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">Email us</div>
                    <div className="font-medium text-foreground">tbsolutions.official@gmail.com</div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-copper-dark">
                    <Phone className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">Call / WhatsApp</div>
                    <div className="font-medium text-foreground">+91 63039 87443</div>
                  </div>
                </div>
                <a
                  href="https://wa.me/916303987443"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 inline-flex items-center gap-2 rounded-full bg-green-500 px-6 py-3 text-sm font-semibold text-white transition-all hover:bg-green-600 hover:shadow-lg"
                >
                  <MessageCircle className="h-4 w-4" />
                  Chat on WhatsApp
                </a>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 24 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6 }}
              className="glass rounded-3xl p-8 sm:p-10"
            >
              {submitted ? (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-copper-dark">
                    <CheckCircle2 className="h-8 w-8" />
                  </div>
                  <h3 className="mt-6 font-display text-2xl font-bold text-foreground">
                    Message received!
                  </h3>
                  <p className="mt-2 text-muted-foreground">
                    We&apos;ll get back to you within 24 hours.
                  </p>
                  <button
                    onClick={() => {
                      setSubmitted(false);
                      setFormData({ name: "", email: "", company: "", phone: "", message: "" });
                    }}
                    className="mt-6 text-sm font-medium text-copper-dark hover:underline"
                  >
                    Send another message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div>
                    <label htmlFor="name" className="mb-2 block text-sm font-medium text-foreground">
                      Name *
                    </label>
                    <input
                      id="name"
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full rounded-2xl border border-input bg-background/60 px-4 py-3 text-foreground outline-none transition-all placeholder:text-muted-foreground/60 focus:border-copper focus:ring-2 focus:ring-copper/20"
                      placeholder="Your name"
                    />
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label htmlFor="email" className="mb-2 block text-sm font-medium text-foreground">
                        Email *
                      </label>
                      <input
                        id="email"
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full rounded-2xl border border-input bg-background/60 px-4 py-3 text-foreground outline-none transition-all placeholder:text-muted-foreground/60 focus:border-copper focus:ring-2 focus:ring-copper/20"
                        placeholder="you@email.com"
                      />
                    </div>
                    <div>
                      <label htmlFor="phone" className="mb-2 block text-sm font-medium text-foreground">
                        Phone
                      </label>
                      <input
                        id="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="w-full rounded-2xl border border-input bg-background/60 px-4 py-3 text-foreground outline-none transition-all placeholder:text-muted-foreground/60 focus:border-copper focus:ring-2 focus:ring-copper/20"
                        placeholder="+91 00000 00000"
                      />
                    </div>
                  </div>
                  <div>
                    <label htmlFor="company" className="mb-2 block text-sm font-medium text-foreground">
                      College / Company
                    </label>
                    <input
                      id="company"
                      type="text"
                      value={formData.company}
                      onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                      className="w-full rounded-2xl border border-input bg-background/60 px-4 py-3 text-foreground outline-none transition-all placeholder:text-muted-foreground/60 focus:border-copper focus:ring-2 focus:ring-copper/20"
                      placeholder="Your college or company"
                    />
                  </div>
                  <div>
                    <label htmlFor="message" className="mb-2 block text-sm font-medium text-foreground">
                      Project details *
                    </label>
                    <textarea
                      id="message"
                      rows={4}
                      required
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      className="w-full resize-none rounded-2xl border border-input bg-background/60 px-4 py-3 text-foreground outline-none transition-all placeholder:text-muted-foreground/60 focus:border-copper focus:ring-2 focus:ring-copper/20"
                      placeholder="Tell us about your project..."
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="flex w-full items-center justify-center gap-2 rounded-full bg-primary px-6 py-4 text-base font-semibold text-primary-foreground transition-all hover:bg-copper-dark hover:shadow-xl hover:shadow-copper/20 disabled:opacity-60"
                  >
                    {submitting ? "Sending…" : "Start the conversation"}
                    {!submitting && <ArrowRight className="h-4 w-4" />}
                  </button>
                </form>
              )}
            </motion.div>
          </div>
        </div>
      </section>

      <Footer />

      {/* WhatsApp floating button */}
      <a
        href="https://wa.me/916303987443"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-green-500 shadow-lg shadow-green-500/30 transition-all hover:bg-green-600 hover:scale-110"
        aria-label="WhatsApp"
      >
        <MessageCircle className="h-7 w-7 text-white" />
      </a>
    </div>
  );
}
