"use client";
import { Star } from "lucide-react";

interface StarRatingProps {
  rating: number;
  maxRating?: number;
  interactive?: boolean;
  onChange?: (rating: number) => void;
  size?: number;
}

export default function StarRating({
  rating,
  maxRating = 5,
  interactive = false,
  onChange,
  size = 20,
}: StarRatingProps) {
  return (
    <div className="flex gap-1">
      {Array.from({ length: maxRating }, (_, i) => i + 1).map((star) => (
        <button
          key={star}
          type={interactive ? "button" : undefined}
          onClick={() => interactive && onChange?.(star)}
          className={interactive ? "cursor-pointer hover:scale-110 transition-transform" : "cursor-default"}
          disabled={!interactive}
        >
          <Star
            size={size}
            className={star <= rating ? "fill-coral text-coral" : "text-hairline"}
          />
        </button>
      ))}
    </div>
  );
}
