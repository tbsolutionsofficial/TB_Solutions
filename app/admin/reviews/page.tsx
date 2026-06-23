"use client";
export const dynamic = "force-dynamic";
import { useEffect, useState } from "react";
import { subscribeReviews, approveReview, revokeReview, deleteReview } from "@/lib/firestore";
import type { Review } from "@/lib/types";
import AdminHeader from "@/components/admin/AdminHeader";
import GlassButton from "@/components/ui/GlassButton";
import GlassModal from "@/components/ui/GlassModal";
import StarRating from "@/components/ui/StarRating";
import GlassBadge from "@/components/ui/GlassBadge";
import { toast } from "sonner";

export default function AdminReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [tab, setTab] = useState<"pending" | "approved">("pending");
  const [deleteId, setDeleteId] = useState<string | null>(null);

  useEffect(() => {
    return subscribeReviews(setReviews);
  }, []);

  const pending = reviews.filter((r) => !r.approved);
  const approved = reviews.filter((r) => r.approved);
  const displayed = tab === "pending" ? pending : approved;

  async function handleApprove(id: string) {
    await approveReview(id);
    toast.success("Review approved and live on site.");
  }

  async function handleRevoke(id: string) {
    await revokeReview(id);
    toast.info("Review revoked.");
  }

  async function handleDelete(id: string) {
    await deleteReview(id);
    setDeleteId(null);
    toast.success("Review deleted.");
  }

  return (
    <>
      <AdminHeader title="Reviews" />
      <div className="flex-1 p-6 pb-24 md:pb-6 space-y-6">
        {/* Tabs */}
        <div className="flex gap-2">
          {(["pending", "approved"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-5 py-2.5 rounded-full font-inter text-sm transition-all cursor-pointer capitalize ${
                tab === t ? "glass-coral text-white" : "glass-dark text-white/60 hover:text-white"
              }`}
            >
              {t} ({t === "pending" ? pending.length : approved.length})
            </button>
          ))}
        </div>

        {/* Cards */}
        {displayed.length === 0 ? (
          <div className="glass-dark rounded-2xl p-12 text-center">
            <p className="font-inter text-white/40">
              No {tab} reviews.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {displayed.map((review) => (
              <div key={review.id} className="glass-dark rounded-2xl p-6">
                <div className="flex flex-col sm:flex-row gap-4 sm:items-start sm:justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-2">
                      <StarRating rating={review.rating} size={16} />
                      <GlassBadge variant="outline" className="text-xs">{review.domain}</GlassBadge>
                    </div>
                    <p className="font-inter text-white/80 text-sm mb-3 leading-relaxed">
                      &ldquo;{review.review}&rdquo;
                    </p>
                    <p className="font-inter font-medium text-white text-sm">{review.name}</p>
                    <p className="font-inter text-xs text-white/40">
                      {review.role} · {review.college}
                    </p>
                    {review.createdAt?.toDate?.() && (
                      <p className="font-inter text-xs text-white/30 mt-1">
                        {review.createdAt.toDate().toLocaleDateString("en-IN")}
                      </p>
                    )}
                  </div>

                  <div className="flex sm:flex-col gap-2 flex-shrink-0">
                    {tab === "pending" ? (
                      <>
                        <GlassButton variant="coral" size="sm" onClick={() => handleApprove(review.id)}>
                          Approve ✓
                        </GlassButton>
                        <GlassButton
                          variant="ghost"
                          size="sm"
                          onClick={() => setDeleteId(review.id)}
                          className="text-red-400 border-red-400/30"
                        >
                          Delete ✗
                        </GlassButton>
                      </>
                    ) : (
                      <>
                        <GlassButton variant="dark" size="sm" onClick={() => handleRevoke(review.id)}>
                          Revoke
                        </GlassButton>
                        <GlassButton
                          variant="ghost"
                          size="sm"
                          onClick={() => setDeleteId(review.id)}
                          className="text-red-400 border-red-400/30"
                        >
                          Delete ✗
                        </GlassButton>
                      </>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <GlassModal open={!!deleteId} onClose={() => setDeleteId(null)} title="Delete Review">
        <p className="font-inter text-body mb-6">Are you sure you want to delete this review?</p>
        <div className="flex gap-3">
          <GlassButton variant="light" onClick={() => setDeleteId(null)}>Cancel</GlassButton>
          <GlassButton variant="coral" onClick={() => deleteId && handleDelete(deleteId)} className="!bg-red-500/80">
            Delete
          </GlassButton>
        </div>
      </GlassModal>
    </>
  );
}

