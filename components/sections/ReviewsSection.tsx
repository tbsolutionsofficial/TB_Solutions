"use client";
import { useState, useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion, useInView } from "framer-motion";
import { toast } from "sonner";
import { DOMAINS, ROLES, type Review } from "@/lib/types";
import { subscribeApprovedReviews, submitReview } from "@/lib/firestore";
import StarRating from "@/components/ui/StarRating";
import GlassBadge from "@/components/ui/GlassBadge";
import { GlassInput, GlassTextarea, GlassSelect } from "@/components/ui/GlassInput";
import GlassButton from "@/components/ui/GlassButton";

const DEFAULT_REVIEWS: Review[] = [
  {
    id: "d1",
    name: "Arjun R",
    role: "Student",
    college: "PSG College of Technology",
    domain: "Web Development",
    rating: 5,
    review: "TorchBearer built my final year project in 3 weeks. Professional team and impressive results. They understood exactly what I needed and delivered beyond expectations.",
    approved: true,
    createdAt: null as unknown as import("firebase/firestore").Timestamp,
  },
  {
    id: "d2",
    name: "Prof. Kavitha S",
    role: "Professor",
    college: "Sri Eshwar College",
    domain: "Internet of Things (IoT)",
    rating: 5,
    review: "Excellent team for IoT lab projects. On time, within budget, students loved the results. Their technical depth was outstanding throughout the engagement.",
    approved: true,
    createdAt: null as unknown as import("firebase/firestore").Timestamp,
  },
  {
    id: "d3",
    name: "Ravi M",
    role: "Manager",
    college: "Chennai Manufacturing Co.",
    domain: "Artificial Intelligence",
    rating: 5,
    review: "Their AI system cut our QC time by 60%. Best investment in 2025. Highly recommend TorchBearer Solutions for any industrial automation or AI project.",
    approved: true,
    createdAt: null as unknown as import("firebase/firestore").Timestamp,
  },
];

const reviewSchema = z.object({
  name: z.string().min(2, "Name is required"),
  role: z.string().min(1, "Role is required"),
  college: z.string().min(2, "College or Company is required"),
  domain: z.string().min(1, "Domain is required"),
  review: z.string().min(20, "Review must be at least 20 characters"),
});
type ReviewFormData = z.infer<typeof reviewSchema>;

function ReviewCard({ review }: { review: Review }) {
  const initials = review.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <div className="glass-light glass-shimmer relative rounded-2xl p-6 break-inside-avoid mb-4">
      <StarRating rating={review.rating} size={16} />
      <p className="font-cormorant italic text-ink text-lg leading-snug mt-3 mb-4">
        &ldquo;{review.review}&rdquo;
      </p>
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full glass-coral flex items-center justify-center text-white font-inter font-medium text-sm flex-shrink-0">
          {initials}
        </div>
        <div>
          <p className="font-inter font-medium text-ink text-sm">{review.name}</p>
          <p className="font-inter text-xs text-muted">{review.role} · {review.college}</p>
        </div>
      </div>
      <div className="mt-3">
        <GlassBadge variant="outline" className="text-xs">{review.domain}</GlassBadge>
      </div>
    </div>
  );
}

export default function ReviewsSection() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [rating, setRating] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  const { register, handleSubmit, reset, formState: { errors } } = useForm<ReviewFormData>({
    resolver: zodResolver(reviewSchema),
  });

  useEffect(() => {
    const unsub = subscribeApprovedReviews((r) => {
      setReviews(r.length > 0 ? r : DEFAULT_REVIEWS);
    });
    return unsub;
  }, []);

  async function onSubmit(data: ReviewFormData) {
    if (rating === 0) { toast.error("Please select a rating"); return; }
    setSubmitting(true);
    try {
      await submitReview({ ...data, rating });
      toast.success("Thank you! Review pending approval.");
      reset();
      setRating(0);
    } catch {
      toast.error("Failed to submit review. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  const avgRating = reviews.length
    ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1)
    : null;

  return (
    <section id="reviews" className="relative py-24 px-6">
      <div className="absolute inset-0 mesh-bg -z-10" />

      <div className="max-w-7xl mx-auto">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 40 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h2 className="font-cormorant text-[clamp(36px,6vw,56px)] text-ink tracking-[-1px] mb-4">
            What Our Clients Say
          </h2>
          {avgRating && (
            <div className="inline-flex items-center gap-2 glass-light text-ink px-5 py-2.5 rounded-full font-inter text-sm">
              <span className="text-coral">★</span>
              <strong>{avgRating}</strong> — Based on {reviews.length} reviews
            </div>
          )}
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Review Submission Form */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            <div className="glass-light glass-shimmer relative rounded-2xl p-8">
              <h3 className="font-cormorant text-2xl text-ink mb-6">
                Worked with us? Share your experience.
              </h3>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <GlassInput
                  label="Full Name *"
                  variant="light"
                  placeholder="Your full name"
                  {...register("name")}
                  error={errors.name?.message}
                />
                <GlassSelect label="Your Role *" variant="light" {...register("role")} error={errors.role?.message}>
                  <option value="">Select role</option>
                  {ROLES.map((r) => <option key={r} value={r}>{r}</option>)}
                </GlassSelect>
                <GlassInput
                  label="College or Company *"
                  variant="light"
                  placeholder="Institution or company"
                  {...register("college")}
                  error={errors.college?.message}
                />
                <GlassSelect label="Domain *" variant="light" {...register("domain")} error={errors.domain?.message}>
                  <option value="">Select domain</option>
                  {DOMAINS.map((d) => <option key={d} value={d}>{d}</option>)}
                </GlassSelect>
                <div>
                  <label className="text-xs font-inter font-medium text-muted mb-1.5 block">Rating *</label>
                  <StarRating rating={rating} interactive onChange={setRating} size={28} />
                </div>
                <GlassTextarea
                  label="Your Review *"
                  variant="light"
                  placeholder="Share your experience (min 20 characters)..."
                  rows={4}
                  {...register("review")}
                  error={errors.review?.message}
                />
                <GlassButton type="submit" variant="coral" fullWidth loading={submitting}>
                  Submit Review
                </GlassButton>
              </form>
            </div>
          </motion.div>

          {/* Reviews Grid */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="columns-1 sm:columns-2 lg:columns-1 xl:columns-2 gap-4"
          >
            {reviews.slice(0, 6).map((review) => (
              <ReviewCard key={review.id} review={review} />
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
