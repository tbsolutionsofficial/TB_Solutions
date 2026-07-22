"use client";
import { motion } from "framer-motion";
import { Search, Pencil, Rocket } from "lucide-react";

const steps = [
  {
    num: "01",
    icon: Search,
    title: "Discover",
    subtitle: "Understanding your vision",
    body: "We begin by deeply understanding your goals, constraints, and domain context. Stakeholder interviews, technical audits, and competitive analysis give us a complete picture before a single line of code is written.",
    color: "from-copper/20 to-copper-dark/10",
  },
  {
    num: "02",
    icon: Pencil,
    title: "Design",
    subtitle: "Architecture that scales",
    body: "Our specialists translate requirements into a detailed system design — choosing the right stack, defining data flows, and mapping out every integration point. Prototypes and wireframes keep you in the loop at every step.",
    color: "from-espresso/20 to-espresso/10",
  },
  {
    num: "03",
    icon: Rocket,
    title: "Deliver",
    subtitle: "Production-ready, every time",
    body: "With the design locked in, we build, test, and deploy with CI/CD pipelines, automated test suites, and robust monitoring. You get a battle-tested solution and ongoing support to keep it running smoothly.",
    color: "from-copper-light/20 to-copper/10",
  },
];

export default function ProcessSection() {
  return (
    <section id="process" className="py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-16 text-center"
        >
          <span className="inline-block rounded-full bg-primary/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-primary">
            How We Work
          </span>
          <h2 className="mt-4 font-display text-4xl font-bold text-foreground sm:text-5xl">
            From Idea to Impact
          </h2>
        </motion.div>

        <div className="grid gap-6 lg:grid-cols-3">
          {steps.map((step, i) => {
            const Icon = step.icon;
            return (
              <motion.div
                key={step.num}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                whileHover={{ y: -8 }}
                className="group relative overflow-hidden rounded-3xl glass p-8 transition-shadow hover:shadow-2xl"
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${step.color} opacity-0 transition-opacity duration-500 group-hover:opacity-100`} />
                <div className="relative">
                  <span className="font-display text-6xl font-black text-muted-foreground/15">{step.num}</span>
                  <div className="mt-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                    <Icon className="h-6 w-6" />
                  </div>
                  <h3 className="mt-4 font-display text-2xl font-bold text-foreground">{step.title}</h3>
                  <p className="mt-1 text-sm font-medium text-primary">{step.subtitle}</p>
                  <p className="mt-4 text-sm text-muted-foreground leading-relaxed">{step.body}</p>
                </div>
                <div className="absolute inset-x-0 bottom-0 h-1 scale-x-0 bg-gradient-to-r from-copper to-copper-dark transition-transform duration-500 group-hover:scale-x-100 origin-left" />
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
