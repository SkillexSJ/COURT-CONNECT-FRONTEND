"use client";

import { useMemo } from "react";
import { ArrowUpRight, MapPin, ShieldCheck } from "lucide-react";

import { useHomeLandingCourtsQuery } from "@/hooks/queries/use-courts-query";
import type { CourtListItem } from "@/types/court.types";

import { trendingVenues } from "./data";
import Link from "next/link";
import Image from "next/image";

type TrendingVenueCard = {
  id: string;
  slug?: string;
  name: string;
  location: string;
  pricePerHour: number;
  verified?: boolean;
  image: string;
  createdAt?: string;
  bookings: number;
  score: number;
};

const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1547347298-4074fc3086f0?auto=format&fit=crop&w=1400&q=80";

// HELPER FUNCTIONS
const getPriceNumber = (value: string | number) => {
  if (typeof value === "number") return value;
  const parsed = Number.parseFloat(value);
  return Number.isFinite(parsed) ? parsed : 0;
};

const computeTrendScore = (court: CourtListItem, now: Date) => {
  const bookings = court._count?.bookings ?? 0;
  const bookingSignal = Math.log1p(bookings) * 0.7;

  const createdAt = new Date(court.createdAt);
  const ageDays = Number.isNaN(createdAt.getTime())
    ? 30
    : Math.max(
        0,
        (now.getTime() - createdAt.getTime()) / (1000 * 60 * 60 * 24),
      );
  const recencySignal = Math.exp(-ageDays / 14) * 0.3;

  return bookingSignal + recencySignal;
};

const mapCourtToTrendingCard = (
  court: CourtListItem,
  now: Date,
): TrendingVenueCard => {
  const primaryImage =
    court.media?.find((item) => item.isPrimary)?.url ??
    court.media?.[0]?.url ??
    FALLBACK_IMAGE;

  return {
    id: court.id,
    slug: court.slug,
    name: court.name,
    location: court.locationLabel,
    pricePerHour: getPriceNumber(court.basePrice),
    verified: (court._count?.bookings ?? 0) >= 5,
    image: primaryImage,
    createdAt: court.createdAt,
    bookings: court._count?.bookings ?? 0,
    score: computeTrendScore(court, now),
  };
};

export function TrendingVenuesSection() {
  // QUERIES
  const courtsQuery = useHomeLandingCourtsQuery();

  const venues = useMemo<TrendingVenueCard[]>(() => {
    const now = new Date();

    const apiVenues = (courtsQuery.data?.data ?? [])
      .map((court) => mapCourtToTrendingCard(court, now))
      .sort((a, b) => b.score - a.score)
      .slice(0, 8);

    if (apiVenues.length > 0) return apiVenues;

    return trendingVenues.map((venue, index) => ({
      id: venue.id,
      slug: undefined,
      name: venue.name,
      location: venue.location,
      pricePerHour: venue.pricePerHour,
      image: venue.image,
      createdAt: undefined,
      bookings: Math.max(0, 8 - index),
      score: 0,
      verified: venue.verified,
    }));
  }, [courtsQuery.data?.data]);

  return (
    <section className="relative overflow-hidden min-h-screen bg-surface px-6 py-28 md:px-12">
      <div className="mx-auto max-w-screen-2xl">
        <div className="mb-14 flex items-end justify-between gap-6">
          <div>
            <h2 className="font-display text-5xl font-black uppercase leading-[0.9] tracking-tight text-primary md:text-7xl lg:text-8xl">
              Trending
              <br />
              <span className="mt-1 inline-block bg-secondary px-3 py-1 text-primary">
                Venues
              </span>
            </h2>
            <p className="mt-3 text-[10px] font-bold uppercase tracking-[0.2em] text-on-surface-variant">
              Ranked by recent bookings and freshness
            </p>
          </div>
          <Link
            href="/venues"
            className="hidden items-center gap-2 border border-primary/20 bg-primary px-5 py-3 font-display text-xs font-black uppercase tracking-[0.16em] text-secondary transition hover:brightness-110 md:inline-flex"
          >
            View All <ArrowUpRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="overflow-x-auto pb-4 md:overflow-visible [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <div className="flex w-max items-stretch gap-6 pr-6 md:grid md:w-full md:grid-cols-2 lg:grid-cols-4 md:pr-0 xl:gap-8">
            {venues.map((venue, index) => (
              <article
                key={venue.id}
                className="group relative flex h-[500px] w-[86vw] shrink-0 flex-col overflow-hidden rounded-2xl border border-primary/10 bg-surface-container-lowest shadow-[0_20px_80px_-40px_rgba(1,45,29,0.35)] transition-transform duration-300 hover:-translate-y-1 sm:w-[60vw] md:h-[460px] md:w-auto"
              >
                <div className="relative h-[240px] shrink-0 overflow-hidden">
                  <Image
                    src={venue.image}
                    loading="eager"
                    alt={venue.name}
                    fill
                    sizes="(max-width: 768px) 86vw, 25vw"
                    priority={index < 4}
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="pointer-events-none absolute inset-0 bg-linear-to-t from-primary/75 via-primary/15 to-transparent" />

                  <div className="absolute left-4 top-4 flex items-center gap-2 bg-black/30 px-3 py-1.5 backdrop-blur-md xl:rounded-sm">
                    <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-secondary">
                      #{String(index + 1).padStart(2, "0")} Trending
                    </span>
                  </div>

                  {venue.verified ? (
                    <div className="absolute right-4 top-4 flex items-center gap-1.5 rounded-sm bg-secondary px-3 py-1.5 text-primary shadow-md">
                      <ShieldCheck className="h-3.5 w-3.5" />
                      <span className="text-[10px] font-black uppercase tracking-[0.16em]">
                        Verified
                      </span>
                    </div>
                  ) : null}
                </div>

                <div className="flex grow flex-col justify-between gap-4 p-5 md:p-6">
                  <div>
                    <h3 className="line-clamp-2 font-display text-xl font-black uppercase tracking-tight text-primary xl:text-2xl">
                      {venue.name}
                    </h3>
                    <p className="mt-2 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.18em] text-on-surface-variant">
                      <MapPin className="h-4 w-4 shrink-0 text-primary/60" />
                      <span className="truncate">{venue.location}</span>
                    </p>
                    <p className="mt-2 text-[10px] font-bold uppercase tracking-[0.16em] text-primary/60">
                      {courtsQuery.isLoading
                        ? "Loading score..."
                        : `${venue.bookings} bookings signal`}
                    </p>
                  </div>

                  <div className="flex items-end justify-between border-t border-primary/10 pt-4">
                    <p className="font-display text-3xl font-black text-primary xl:text-4xl">
                      ${venue.pricePerHour}
                      <span className="ml-1 text-sm font-bold text-primary/70">
                        /hr
                      </span>
                    </p>

                    <a
                      href={venue.slug ? `/venues/${venue.slug}` : "/venues"}
                      className="inline-flex shrink-0 items-center gap-1.5 border border-primary/20 px-3 py-2 text-[10px] font-black uppercase tracking-[0.16em] text-primary transition hover:bg-primary hover:text-secondary"
                    >
                      Explore <ArrowUpRight className="h-3.5 w-3.5" />
                    </a>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>

        <div className="mt-8 md:hidden">
          <Link
            href="/venues"
            className="inline-flex w-full items-center justify-center gap-2 border border-primary/20 bg-primary px-5 py-3 font-display text-xs font-black uppercase tracking-[0.16em] text-secondary transition hover:brightness-110"
          >
            View All <ArrowUpRight className="h-4 w-4" />
          </Link>
        </div>

        {courtsQuery.isError ? (
          <p className="mt-4 text-xs font-bold uppercase tracking-[0.14em] text-primary/60">
            Could not fetch live trends. Showing fallback venues.
          </p>
        ) : null}
      </div>
    </section>
  );
}
