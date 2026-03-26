"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { MapPin, Star, Image as ImageIcon } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { AVATAR_FALLBACK_IMAGE, getInitials } from "@/lib/placeholders";
import { CourtDetails } from "@/types/court.types";
import { useReviewsQuery } from "@/hooks/queries/use-reviews-query";

interface VenueHeaderProps {
  venue: CourtDetails;
}

export default function VenueHeader({ venue }: VenueHeaderProps) {
  // Query for dynamic reviews
  const { data: reviewsData } = useReviewsQuery({
    courtId: venue.id,
    limit: 100,
  });
  const reviews = reviewsData?.data ?? [];

  const averageRating =
    reviews.length > 0
      ? (
          reviews.reduce((acc, curr) => acc + (curr.rating ?? 0), 0) /
          reviews.length
        ).toFixed(1)
      : "0.0";

  // Dynamic Image State
  const defaultImage =
    venue.media?.find((m) => m.isPrimary)?.url || venue.media?.[0]?.url;
  const [activeImage, setActiveImage] = useState<string | undefined>(
    defaultImage,
  );

  const bookingCount = venue._count?.bookings || 0;
  const organizerName =
    venue.organizer.businessName?.trim() ||
    venue.organizer.user?.name?.trim() ||
    "Organizer";
  const organizerAvatar =
    venue.organizer.user?.avatarUrl || AVATAR_FALLBACK_IMAGE;

  return (
    <section className="relative h-[72vh] min-h-130 w-full overflow-hidden sm:h-[78vh] lg:h-[85vh]">
      {/* Hero Image */}
      {activeImage ? (
        <Image
          alt={venue.name}
          src={activeImage}
          fill
          loading="eager"
          className="w-full h-full object-cover transition-opacity duration-500 ease-in-out"
          sizes="100vw"
          priority
        />
      ) : (
        <div className="w-full h-full bg-linear-to-br from-primary/20 to-primary/5" />
      )}

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-linear-to-t from-primary via-primary/40 to-primary/10" />

      {/* Top Gallery Tool (if multiple images) */}
      {venue.media && venue.media.length > 1 && (
        <div className="absolute top-24 right-4 sm:top-32 sm:right-8 flex flex-col items-end gap-3 z-10">
          <div className="flex items-center gap-2 px-3 py-1.5 bg-primary/60 backdrop-blur-md border border-white/20 rounded-sm text-secondary text-[10px] uppercase font-bold tracking-widest">
            <ImageIcon className="w-3.5 h-3.5" />
            Media Gallery
          </div>
          <div className="flex gap-2 max-w-[50vw] sm:max-w-md overflow-x-auto hide-scrollbar p-1">
            {venue.media.map((img, idx) => (
              <button
                key={idx}
                onClick={() => setActiveImage(img.url)}
                className={`relative h-12 w-16 sm:h-16 sm:w-24 shrink-0 rounded-xs overflow-hidden border-2 transition-all ${
                  activeImage === img.url
                    ? "border-secondary scale-105"
                    : "border-white/20 opacity-70 hover:opacity-100 hover:border-white/50"
                }`}
              >
                <Image
                  src={img.url}
                  alt={`Gallery thumbnail ${idx + 1}`}
                  fill
                  loading="eager"
                  className="object-cover"
                  sizes="(max-width: 768px) 100px, 150px"
                />
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Content */}
      <div className="absolute bottom-0 left-0 flex w-full flex-col items-start justify-between gap-6 p-4 sm:p-8 md:flex-row md:items-end md:gap-8 md:p-16">
        <div className="max-w-4xl space-y-3 sm:space-y-4">
          {/* Location Badge */}
          <div className="flex flex-wrap items-center gap-2 text-[10px] font-bold uppercase tracking-[0.16em] text-secondary sm:gap-3 sm:text-xs sm:tracking-[0.2em]">
            <MapPin className="h-4 w-4" />
            <span>{venue.locationLabel}</span>
            <span className="mx-2 opacity-30">|</span>
            <span>Verified Venue</span>
          </div>

          {/* Title */}
          <h1 className="font-headline text-4xl leading-[0.88] font-black tracking-tight text-white uppercase sm:text-5xl md:text-7xl lg:text-8xl lg:tracking-tighter">
            {venue.name}
          </h1>

          <div className="inline-flex items-center gap-3 rounded-sm border border-white/20 bg-primary/35 px-3 py-2 backdrop-blur-sm sm:px-4">
            <Avatar className="size-9 border border-white/30">
              <AvatarImage src={organizerAvatar} alt={organizerName} />
              <AvatarFallback className="bg-white/20 text-white">
                {getInitials(organizerName)}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="text-[10px] uppercase tracking-[0.16em] text-white/65">
                Organized By
              </p>
              <p className="font-headline text-sm font-bold uppercase tracking-wide text-secondary">
                {organizerName}
              </p>
              <Link
                href={`/organizers/${venue.organizer.id}`}
                className="text-[10px] font-bold uppercase tracking-[0.14em] text-white/80 underline decoration-secondary/50 underline-offset-4 hover:text-secondary"
              >
                View Organizer Profile
              </Link>
            </div>
          </div>
        </div>

        {/* Info Card */}
        <div className="flex w-full items-center justify-center gap-4 rounded-sm border border-white/10 bg-primary/50 p-4 backdrop-blur-md sm:p-6 md:w-auto md:gap-6">
          {/* Rating */}
          <div className="text-center">
            <p className="text-[10px] font-bold tracking-widest text-white/60 uppercase">
              Rating
            </p>
            <div className="flex items-center gap-1 text-secondary">
              <Star className="h-5 w-5 fill-current" />
              <span className="font-headline text-xl font-bold sm:text-2xl">
                {averageRating}
              </span>
            </div>
          </div>

          <div className="h-9 w-px bg-white/20 sm:h-10" />

          {/* Bookings */}
          <div className="text-center">
            <p className="text-[10px] font-bold tracking-widest text-white/60 uppercase">
              Total Bookings
            </p>
            <p className="font-headline text-xl font-bold text-white sm:text-2xl">
              {bookingCount}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
