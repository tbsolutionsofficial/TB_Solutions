"use client";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";
import { saveContactSubmission } from "@/lib/firestore";

const schema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  message: z.string().min(10, "Message must be at least 10 characters"),
});

type FormData = z.infer<typeof schema>;
type Phase = "idle" | "loading" | "ring" | "hologram" | "success";

export function ContactFormMagic() {
  const [phase, setPhase] = useState<Phase>("idle");
  const { register, handleSubmit, reset, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  async function onSubmit(data: FormData) {
    setPhase("loading");
    try {
      await saveContactSubmission({ ...data, phone: "", company: "", domain: "General" });
      setPhase("ring");
      setTimeout(() => setPhase("hologram"), 1200);
      setTimeout(() => {
        setPhase("success");
        confetti({ particleCount: 120, spread: 80, origin: { y: 0.6 }, colors: ["#cc785c", "#d4a96a", "#fff"] });
      }, 2400);
      setTimeout(() => { setPhase("idle"); reset(); }, 5000);
    } catch {
      setPhase("idle");
    }
  }

  if (phase !== "idle" && phase !== "loading") {
    return (
      <div className="flex flex-col items-center justify-center min-h-[340px] gap-6">
        <AnimatePresence mode="wait">
          {phase === "ring" && (
            <motion.div
              key="ring"
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 1.5, opacity: 0 }}
              className="relative flex items-center justify-center"
            >
              <div className="w-32 h-32 rounded-full border-4 border-primary animate-ping opacity-30 absolute" />
              <div className="w-24 h-24 rounded-full border-4 border-primary animate-pulse" />
              <span className="absolute font-display text-sm font-bold text-primary">Sending…</span>
            </motion.div>
          )}
          {phase === "hologram" && (
            <motion.div
              key="hologram"
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 1.5, opacity: 0 }}
              className="relative flex items-center justify-center"
            >
              <div className="w-40 h-40 rounded-full bg-gradient-to-br from-primary/30 to-copper-dark/30 backdrop-blur-xl border border-primary/40 flex items-center justify-center">
                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary/50 to-copper-dark/50 animate-pulse flex items-center justify-center">
                  <span className="text-3xl">✉️</span>
                </div>
              </div>
            </motion.div>
          )}
          {phase === "success" && (
            <motion.div
              key="success"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="flex flex-col items-center gap-4 text-center"
            >
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary to-copper-dark flex items-center justify-center text-4xl text-white font-bold">
                ✓
              </div>
              <div>
                <h3 className="font-display text-2xl font-bold text-foreground">Message Sent!</h3>
                <p className="mt-1 text-muted-foreground">We&apos;ll get back to you within 24 hours.</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <div>
        <input
          {...register("name")}
          placeholder="Your Name"
          className="w-full rounded-2xl glass border border-white/10 bg-transparent px-5 py-3.5 text-foreground placeholder:text-muted-foreground outline-none focus:border-primary/60 transition-colors"
        />
        {errors.name && <p className="mt-1 text-xs text-destructive">{errors.name.message}</p>}
      </div>
      <div>
        <input
          {...register("email")}
          type="email"
          placeholder="Email Address"
          className="w-full rounded-2xl glass border border-white/10 bg-transparent px-5 py-3.5 text-foreground placeholder:text-muted-foreground outline-none focus:border-primary/60 transition-colors"
        />
        {errors.email && <p className="mt-1 text-xs text-destructive">{errors.email.message}</p>}
      </div>
      <div>
        <textarea
          {...register("message")}
          rows={4}
          placeholder="Tell us about your project…"
          className="w-full resize-none rounded-2xl glass border border-white/10 bg-transparent px-5 py-3.5 text-foreground placeholder:text-muted-foreground outline-none focus:border-primary/60 transition-colors"
        />
        {errors.message && <p className="mt-1 text-xs text-destructive">{errors.message.message}</p>}
      </div>
      <button
        type="submit"
        disabled={phase === "loading"}
        className="w-full rounded-2xl bg-gradient-to-r from-primary to-copper-dark py-4 font-semibold text-white transition-all hover:shadow-lg hover:shadow-primary/30 disabled:opacity-60"
      >
        {phase === "loading" ? "Sending…" : "Send Message"}
      </button>
    </form>
  );
}
