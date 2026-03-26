"use client";

import { useState } from "react";
import { Star } from "lucide-react";
import { useCreateReviewMutation } from "@/hooks/queries/use-review-mutation";
import { toast } from "sonner";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";

interface VenueReviewFormProps {
  courtId: string;
}

export default function VenueReviewForm({ courtId }: VenueReviewFormProps) {
  const router = useRouter();
  const { data: session } = authClient.useSession();

  // MUTATION
  const mutation = useCreateReviewMutation({ courtId });

  // STATES
  const [rating, setRating] = useState<number>(0);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [comment, setComment] = useState("");

  // HANDLERS
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!session?.user) {
      toast.error("Please sign in to leave a review");
      router.push("/signin");
      return;
    }

    if (rating === 0) {
      toast.error("Please select a star rating");
      return;
    }
    if (comment.trim().length <= 2) {
      toast.error("Review comment must be longer than 2 characters");
      return;
    }

    mutation.mutate(
      { courtId, rating, comment },
      {
        onSuccess: () => {
          setRating(0);
          setComment("");
        },
      },
    );
  };

  return (
    <div className="bg-primary p-6 sm:p-8 rounded-sm">
      <h3 className="font-headline text-lg sm:text-xl font-black uppercase text-secondary tracking-tight mb-8">
        Share Your Experience
      </h3>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Rating Selection */}
        <div className="space-y-3">
          <label className="text-[10px] sm:text-xs font-bold uppercase tracking-widest text-primary-foreground/60 text-surface">
            Your Rating
          </label>
          <div className="flex gap-1" onMouseLeave={() => setHoverRating(0)}>
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                type="button"
                key={star}
                className="focus:outline-none transition-transform hover:scale-110"
                onClick={() => setRating(star)}
                onMouseEnter={() => setHoverRating(star)}
              >
                <Star
                  className={`w-8 h-8 ${
                    (hoverRating || rating) >= star
                      ? "fill-secondary text-secondary"
                      : "text-white"
                  } transition-colors duration-200`}
                />
              </button>
            ))}
          </div>
        </div>

        {/* Comment Textarea */}
        <div className="space-y-3">
          <label
            htmlFor="comment"
            className="text-[10px] sm:text-xs font-bold uppercase tracking-widest text-primary-foreground/60 text-surface"
          >
            Review Details
          </label>
          <textarea
            id="comment"
            rows={4}
            className="w-full text-white bg-surface/5 border border-surface/20 rounded-sm p-4 text-surface placeholder:text-surface/40 focus:outline-none focus:border-secondary transition-colors resize-none"
            placeholder="Describe the court conditions, amenities, or staff..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            disabled={mutation.isPending}
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={mutation.isPending}
          className="w-full bg-secondary hover:bg-secondary/90 text-primary font-headline font-black text-sm sm:text-base uppercase tracking-widest py-4 transition-colors rounded-sm disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {mutation.isPending ? "Submitting..." : "Submit Review"}
        </button>
      </form>
    </div>
  );
}
