"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { CheckCircle2, MessageCircle, Send, Phone } from "lucide-react";
import GlassNav from "@/components/ui/GlassNav";
import Footer from "@/components/sections/Footer";
import DomainsSection from "@/components/sections/DomainsSection";
import GallerySection from "@/components/sections/GallerySection";
import TestimonialsSection from "@/components/sections/TestimonialsSection";
import { ProcessCard } from "@/components/process-card";
import { MagneticButton } from "@/components/magnetic-button";
import { CountUp } from "@/components/count-up";
import { ContactFormMagic } from "@/components/contact-form-magic";

const whyUs = [
  "Cross-domain expertise from AI to hardware",
  "End-to-end project consultancy model",
  "Source code + documentation with every delivery",
  "2 weeks of free post-delivery support",
  "IEEE & publication-ready research builds",
  "Transparent pricing from ₹2,999",
];

const STATS = [
  { end: 150, suffix: "+", label: "Projects Delivered" },
  { end: 11, suffix: "", label: "Tech Domains" },
  { end: 92, suffix: "%", label: "Client Retention" },
];

const PROCESS = [
  {
    step: 1,
    title: "Discover",
    description: "We understand your goals, constraints, and vision through deep consultation.",
    bannerImage: "/assets/proj-ai.jpg",
    bannerTitle: "Deep Requirements Analysis",
    bannerDescription: "Understanding your vision before writing a single line of code.",
  },
  {
    step: 2,
    title: "Design",
    description: "Architecture, tech stack selection, and a phased roadmap tailored to your project.",
    bannerImage: "/assets/proj-saas.jpg",
    bannerTitle: "Blueprint & Architecture",
    bannerDescription: "Every great product starts with an even greater plan.",
  },
  {
    step: 3,
    title: "Deliver",
    description: "Agile sprints, continuous feedback loops, and rigorous testing — on time, every time.",
    bannerImage: "/assets/proj-automation.jpg",
    bannerTitle: "Production-Ready Delivery",
    bannerDescription: "IEEE-ready builds shipped with source code and full documentation.",
  },
];

export default function HomePage() {
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const robotY = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const robotOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      <GlassNav />

      {/* ── Hero ── */}
      <section
        ref={heroRef}
        id="home"
        className="relative flex min-h-screen items-center overflow-hidden px-5 pt-20 sm:px-8 lg:px-12"
      >
        {/* Ambient blobs */}
        <div className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute left-1/4 top-1/3 h-[600px] w-[600px] rounded-full bg-primary/8 blur-[140px]" />
          <div className="absolute bottom-1/4 right-1/4 h-[400px] w-[400px] rounded-full bg-copper-light/10 blur-[120px]" />
        </div>

        {/* Floating drone — top right */}
        <motion.img
          src="/assets/drone.png"
          alt=""
          aria-hidden
          className="pointer-events-none absolute right-8 top-28 h-20 w-auto opacity-70 sm:h-28 lg:h-36"
          animate={{ y: [0, -14, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        />

        <div className="mx-auto w-full max-w-7xl py-16 lg:py-0">
          <div className="grid items-center gap-8 lg:grid-cols-2 lg:gap-0">
            {/* Left — text */}
            <motion.div
              initial="hidden"
              animate="visible"
              variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
              className="relative z-10"
            >
              <motion.p
                variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
                className="mb-4 font-mono text-sm font-semibold uppercase tracking-[0.2em] text-primary"
              >
                TorchBearer Solutions
              </motion.p>

              <motion.h1
                variants={{ hidden: { opacity: 0, y: 24 }, visible: { opacity: 1, y: 0 } }}
                className="font-display text-5xl font-bold leading-[1.05] text-foreground sm:text-6xl lg:text-7xl xl:text-8xl"
              >
                Guiding Ideas.
                <br />
                <span className="text-gradient-copper">Empowering</span>
                <br />
                Impact.
              </motion.h1>

              <motion.p
                variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
                className="mt-6 max-w-md text-lg leading-relaxed text-muted-foreground"
              >
                Your trusted partner across AI, automation, software, robotics, IoT and digital
                transformation. From final-year projects to industry solutions.
              </motion.p>

              <motion.div
                variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
                className="mt-8 flex flex-wrap gap-4"
              >
                <MagneticButton
                  href="#domains"
                  className="inline-flex items-center gap-2 rounded-full bg-primary px-8 py-4 text-sm font-semibold text-white transition-all hover:bg-copper-dark hover:shadow-xl hover:shadow-primary/30"
                >
                  Explore Our Work
                </MagneticButton>
                <MagneticButton
                  href="#contact"
                  className="inline-flex items-center gap-2 rounded-full border border-border bg-background/60 px-8 py-4 text-sm font-semibold text-foreground backdrop-blur-sm transition-all hover:border-primary/40 hover:bg-primary/5"
                >
                  Start a Project
                </MagneticButton>
              </motion.div>

              <motion.div
                variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
                className="mt-12 flex flex-wrap gap-10"
              >
                {STATS.map((s) => (
                  <div key={s.label}>
                    <div className="font-display text-4xl font-bold text-copper-dark">
                      <CountUp end={s.end} suffix={s.suffix} />
                    </div>
                    <div className="mt-1 text-sm text-muted-foreground">{s.label}</div>
                  </div>
                ))}
              </motion.div>
            </motion.div>

            {/* Right — parallax robot */}
            <div className="relative flex items-end justify-center lg:justify-end">
              {/* Energy orb */}
              <motion.img
                src="/assets/energy-orb.png"
                alt=""
                aria-hidden
                className="pointer-events-none absolute bottom-0 left-8 h-24 w-auto opacity-60 lg:h-32"
                animate={{ scale: [1, 1.15, 1], opacity: [0.6, 0.9, 0.6] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              />

              {/* Robot with parallax */}
              <motion.div style={{ y: robotY, opacity: robotOpacity }}>
                {/* Chest glow */}
                <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none">
                  <motion.div
                    className="h-20 w-20 rounded-full bg-primary/40 blur-2xl"
                    animate={{ scale: [1, 1.4, 1], opacity: [0.5, 0.9, 0.5] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                  />
                </div>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/assets/hero-robot.png"
                  alt="TorchBearer AI Robot"
                  className="relative h-[480px] w-auto max-w-[500px] object-contain drop-shadow-2xl sm:h-[560px] lg:h-[640px]"
                />
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Torch Strip ── */}
      <section className="relative overflow-hidden bg-espresso py-16 lg:py-20">
        <div className="mx-auto flex max-w-7xl flex-col items-center gap-10 px-5 sm:px-8 lg:flex-row lg:gap-16">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="flex-1"
          >
            <p className="font-mono text-xs uppercase tracking-widest text-primary mb-3">Our Mission</p>
            <h2 className="font-display text-3xl font-bold text-white sm:text-4xl lg:text-5xl">
              Illuminating ideas with{" "}
              <span className="text-gradient-copper">next-gen technology</span>
            </h2>
            <p className="mt-5 max-w-lg text-white/70 leading-relaxed">
              We bridge the gap between academic innovation and real-world application, delivering
              research-grade solutions that stand up to industry scrutiny.
            </p>
          </motion.div>

          <motion.img
            src="/assets/robotic-hand-torch.png"
            alt="Robotic hand holding torch"
            className="h-48 w-auto object-contain opacity-90 sm:h-60 lg:h-72"
            animate={{ y: [0, -12, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 0.9, x: 0 }}
            viewport={{ once: true }}
          />
        </div>
      </section>

      {/* ── Domains ── */}
      <DomainsSection />

      {/* ── Gallery ── */}
      <GallerySection />

      {/* ── Testimonials ── */}
      <TestimonialsSection />

      {/* ── About ── */}
      <section id="about" className="relative overflow-hidden px-5 py-20 sm:px-8 lg:py-28">
        {/* Companion robot — floating top right */}
        <motion.img
          src="/assets/companion-robot.png"
          alt=""
          aria-hidden
          className="pointer-events-none absolute right-0 top-0 h-56 w-auto opacity-25 sm:h-72 lg:h-96"
          animate={{ y: [0, -16, 0] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
        />

        <div className="mx-auto max-w-7xl">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <motion.div
              initial={{ opacity: 0, x: -24 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.6 }}
            >
              <span className="inline-block rounded-full bg-primary/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-primary">
                Why TorchBearer
              </span>
              <h2 className="mt-5 font-display text-3xl font-bold text-foreground sm:text-4xl lg:text-5xl">
                Technology moves fast.
                <br />
                <span className="text-gradient-copper">We keep you ahead.</span>
              </h2>
              <p className="mt-5 text-muted-foreground leading-relaxed max-w-lg">
                We don&apos;t just build projects — we architect outcomes. Our team blends research,
                engineering, and design thinking to deliver solutions that are robust, IEEE-ready,
                and built for the real world.
              </p>
              <ul className="mt-8 space-y-3">
                {whyUs.map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                    <span className="text-foreground">{item}</span>
                  </li>
                ))}
              </ul>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 24 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.6 }}
              className="grid gap-5 sm:grid-cols-1"
            >
              {STATS.map((s) => (
                <div
                  key={s.label}
                  className="glass rounded-3xl p-8 text-center transition-all hover:shadow-xl hover:shadow-primary/10"
                >
                  <div className="font-display text-5xl font-bold text-copper-dark">
                    <CountUp end={s.end} suffix={s.suffix} />
                  </div>
                  <div className="mt-2 text-sm font-medium uppercase tracking-wider text-muted-foreground">
                    {s.label}
                  </div>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── Phoenix Divider ── */}
      <div className="flex justify-center py-8 overflow-hidden">
        <motion.img
          src="/assets/phoenix.png"
          alt=""
          aria-hidden
          className="h-32 w-auto opacity-30 sm:h-40"
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 0.3, scale: 1 }}
          viewport={{ once: true }}
        />
      </div>

      {/* ── Process ── */}
      <section id="process" className="px-5 py-20 sm:px-8 lg:py-28">
        <div className="mx-auto max-w-7xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-14 text-center"
          >
            <span className="inline-block rounded-full bg-primary/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-primary">
              How We Work
            </span>
            <h2 className="mt-5 font-display text-3xl font-bold text-foreground sm:text-4xl lg:text-5xl">
              Our Process
            </h2>
          </motion.div>
          <div className="grid gap-6 sm:grid-cols-3">
            {PROCESS.map((p, i) => (
              <motion.div
                key={p.step}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.12 }}
              >
                <ProcessCard {...p} />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Contact ── */}
      <section id="contact" className="relative overflow-hidden px-5 py-20 sm:px-8 lg:py-28">
        {/* Drone floating decoration */}
        <motion.img
          src="/assets/drone.png"
          alt=""
          aria-hidden
          className="pointer-events-none absolute right-10 top-10 h-16 w-auto opacity-30 sm:h-24"
          animate={{ y: [0, -12, 0], rotate: [0, 3, 0] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
        />

        <div className="mx-auto max-w-7xl">
          <div className="grid gap-12 lg:grid-cols-2">
            {/* Left info */}
            <motion.div
              initial={{ opacity: 0, x: -24 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <span className="inline-block rounded-full bg-primary/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-primary">
                Contact
              </span>
              <h2 className="mt-5 font-display text-3xl font-bold text-foreground sm:text-4xl lg:text-5xl">
                Let&apos;s build something remarkable.
              </h2>
              <p className="mt-5 text-muted-foreground leading-relaxed max-w-md">
                Tell us about your project. We&apos;ll respond within 24 hours with a tailored
                approach and transparent quote.
              </p>

              <div className="mt-10 space-y-6">
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                    <Send className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground">Email</div>
                    <div className="font-medium text-foreground">tbsolutions.official@gmail.com</div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                    <Phone className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground">Call / WhatsApp</div>
                    <div className="font-medium text-foreground">+91 63039 87443</div>
                  </div>
                </div>
                <a
                  href="https://wa.me/916303987443"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-2 inline-flex items-center gap-2 rounded-full bg-green-500 px-6 py-3 text-sm font-semibold text-white transition-all hover:bg-green-600 hover:shadow-lg"
                >
                  <MessageCircle className="h-4 w-4" />
                  Chat on WhatsApp
                </a>
              </div>
            </motion.div>

            {/* Right — animated form */}
            <motion.div
              initial={{ opacity: 0, x: 24 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="glass rounded-3xl p-8 sm:p-10"
            >
              <ContactFormMagic />
            </motion.div>
          </div>
        </div>
      </section>

      <Footer />

      {/* WhatsApp FAB */}
      <a
        href="https://wa.me/916303987443"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-green-500 shadow-lg shadow-green-500/30 transition-all hover:scale-110 hover:bg-green-600"
        aria-label="WhatsApp"
      >
        <MessageCircle className="h-7 w-7 text-white" />
      </a>
    </div>
  );
}
