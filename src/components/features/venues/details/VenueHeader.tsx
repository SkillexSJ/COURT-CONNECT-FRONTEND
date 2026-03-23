"use client";

import Image from "next/image";
import { MapPin, Star } from "lucide-react";
import { CourtDetails } from "@/types/court.types";

interface VenueHeaderProps {
  venue: CourtDetails;
}

export default function VenueHeader({ venue }: VenueHeaderProps) {
  const primaryImage =
    venue.media?.find((m) => m.isPrimary)?.url || venue.media?.[0]?.url;
  const bookingCount = venue._count?.bookings || 0;
  const averageRating = 4.8; // TODO: Get from actual rating data

  return (
    <section className="relative h-[85vh] w-full overflow-hidden">
      {/* Hero Image */}
      {primaryImage ? (
        <Image
          alt={venue.name}
          src={primaryImage}
          fill
          className="w-full h-full object-cover"
          priority
        />
      ) : (
        <div className="w-full h-full bg-linear-to-br from-primary/20 to-primary/5" />
      )}

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-linear-to-t from-primary via-primary/40 to-primary/10" />

      {/* Content */}
      <div className="absolute bottom-0 left-0 w-full p-8 md:p-16 flex flex-col md:flex-row justify-between items-end gap-8">
        <div className="space-y-4 max-w-4xl">
          {/* Location Badge */}
          <div className="flex items-center gap-3 text-secondary font-headline font-bold text-xs uppercase tracking-[0.2em]">
            <MapPin className="w-4 h-4" />
            <span>{venue.locationLabel}</span>
            <span className="mx-2 opacity-30">|</span>
            <span>Verified Venue</span>
          </div>

          {/* Title */}
          <h1 className="font-headline font-black text-6xl md:text-8xl text-white leading-[0.85] tracking-tighter uppercase">
            {venue.name}
          </h1>
        </div>

        {/* Info Card */}
        <div className="flex items-center gap-6 bg-primary/50 backdrop-blur-md p-6 border border-white/10 rounded-sm">
          {/* Rating */}
          <div className="text-center">
            <p className="text-[10px] uppercase font-bold text-white/60 tracking-widest">
              Rating
            </p>
            <div className="flex items-center gap-1 text-secondary">
              <Star className="w-5 h-5 fill-current" />
              <span className="font-headline font-bold text-2xl">
                {averageRating}
              </span>
            </div>
          </div>

          <div className="h-10 w-px bg-white/20" />

          {/* Bookings */}
          <div className="text-center">
            <p className="text-[10px] uppercase font-bold text-white/60 tracking-widest">
              Total Bookings
            </p>
            <p className="font-headline font-bold text-2xl text-white">
              {bookingCount}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
