"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { ArrowRight, MapPin, Star } from "lucide-react";

import { Button } from "@/components/ui/button";
import type { CourtListItem } from "@/types/court.types";


// HELPERS
const formatPrice = (value: string | number): string => {
  const numericValue = Number(value);
  if (!Number.isFinite(numericValue)) return "N/A";

  return `$${numericValue.toLocaleString()}`;
};

const getPrimaryImage = (media?: { url: string }[]): string | null => {
  if (!media || media.length === 0) return null;
  return media[0]?.url ?? null;
};

type VenueCardProps = {
  court: CourtListItem;
};

export function VenueCard({ court }: VenueCardProps) {
  const router = useRouter();
  const imageUrl = getPrimaryImage(court.media);
  const bookingCount = court._count?.bookings ?? 0;

  const handleCardClick = () => {
    router.push(`/venues/${court.slug}`);
  };

  return (
    <article
      onClick={handleCardClick}
      className="group cursor-pointer overflow-hidden border border-border/80 bg-card transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
    >
      <div className="relative h-72 overflow-hidden bg-muted/50 sm:h-80 md:h-96">
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={court.name}
            fill
            loading="eager"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="absolute inset-0 bg-linear-to-br from-muted to-accent" />
        )}

        <div className="absolute left-3 top-3 rounded-full bg-background/90 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide text-foreground backdrop-blur">
          {court.type}
        </div>

        <div className="absolute right-3 top-3 rounded-full bg-secondary/95 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide text-secondary-foreground">
          {bookingCount > 25 ? "Premier" : "Verified"}
        </div>

        <div className="absolute inset-x-0 bottom-0 flex items-center justify-between bg-linear-to-t from-black/75 via-black/20 to-transparent px-4 pb-3 pt-8 text-xs text-white">
          <span className="inline-flex items-center gap-1.5">
            <Star className="h-3.5 w-3.5 fill-secondary text-secondary" />
            Popular choice
          </span>
          <span>{bookingCount} bookings</span>
        </div>
      </div>

      <div className="space-y-4 p-4">
        <div>
          <h3 className="text-lg font-semibold tracking-tight text-foreground">
            {court.name}
          </h3>
          <p className="mt-1 inline-flex items-center gap-1.5 text-xs text-muted-foreground">
            <MapPin className="h-3.5 w-3.5" />
            {court.locationLabel}
          </p>
        </div>

        <div className="flex items-center justify-between border-t border-border/70 pt-4">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
              Hourly Rate
            </p>
            <p className="text-xl font-semibold text-foreground">
              {formatPrice(court.basePrice)}
            </p>
          </div>

          <Button
            className="h-9 rounded-sm px-3"
            variant="secondary"
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              handleCardClick();
            }}
          >
            Book
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </article>
  );
}
