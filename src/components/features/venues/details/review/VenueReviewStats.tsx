import { useMemo } from "react";
import { Star, StarHalf } from "lucide-react";
import type { Review } from "@/types/review.types";

interface VenueReviewStatsProps {
  reviews: Review[];
}

export default function VenueReviewStats({ reviews }: VenueReviewStatsProps) {
  // MEMOIZED STATS
  const stats = useMemo(() => {
    const total = reviews.length;
    if (total === 0) {
      return {
        average: 0,
        total,
        counts: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 },
        percentages: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 },
      };
    }

    const counts = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    let sum = 0;

    reviews.forEach((r) => {
      const rating = r.rating ?? 0;
      if (rating >= 1 && rating <= 5) {
        counts[rating as keyof typeof counts]++;
        sum += rating;
      }
    });

    const average = Number((sum / total).toFixed(1));
    const percentages = {
      5: Math.round((counts[5] / total) * 100),
      4: Math.round((counts[4] / total) * 100),
      3: Math.round((counts[3] / total) * 100),
      2: Math.round((counts[2] / total) * 100),
      1: Math.round((counts[1] / total) * 100),
    };

    return { average, total, counts, percentages };
  }, [reviews]);

  // Render Stars for Average
  const renderAverageStars = () => {
    const stars = [];
    const fullStars = Math.floor(stats.average);
    const hasHalfStar = stats.average - fullStars >= 0.5;

    for (let i = 1; i <= 5; i++) {
      if (i <= fullStars) {
        stars.push(
          <Star key={i} className="w-5 h-5 fill-secondary text-secondary" />,
        );
      } else if (i === fullStars + 1 && hasHalfStar) {
        stars.push(
          <StarHalf
            key={i}
            className="w-5 h-5 fill-secondary text-secondary"
          />,
        );
      } else {
        stars.push(<Star key={i} className="w-5 h-5 text-secondary" />);
      }
    }
    return stars;
  };

  return (
    <div className="bg-surface-variant p-8 rounded-sm border border-primary/10 flex flex-col justify-center">
      <div className="flex items-center gap-6 mb-8">
        <div className="font-headline text-6xl font-black text-primary leading-none">
          {stats.average.toFixed(1)}
        </div>
        <div>
          <div className="flex gap-1 mb-1">{renderAverageStars()}</div>
          <p className="text-[10px] uppercase font-bold tracking-widest text-primary/60">
            BASED ON {stats.total} REVIEWS
          </p>
        </div>
      </div>

      <div className="space-y-3">
        {[5, 4, 3, 2, 1].map((star) => (
          <div
            key={star}
            className="flex items-center gap-4 text-xs font-bold text-primary/70"
          >
            <span className="w-12">{star} STAR</span>
            <div className="flex-1 h-2.5 bg-primary/10 rounded-full overflow-hidden">
              <div
                className="h-full bg-primary rounded-full transition-all duration-500 ease-out"
                style={{
                  width: `${stats.percentages[star as keyof typeof stats.percentages]}%`,
                }}
              />
            </div>
            <span className="w-8 text-right">
              {stats.percentages[star as keyof typeof stats.percentages]}%
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
