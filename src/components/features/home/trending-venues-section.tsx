/* eslint-disable @next/next/no-img-element */
"use client";

import { useMemo } from "react";
import { ArrowUpRight, MapPin, ShieldCheck } from "lucide-react";

import { useHomeLandingCourtsQuery } from "@/hooks/queries/use-courts-query";
import type { CourtListItem } from "@/types/court.types";

import { trendingVenues } from "./data";
import Link from "next/link";

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

        <div className="overflow-x-auto pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <div className="flex w-max items-stretch gap-6 pr-2 lg:w-full lg:pr-0">
            {venues.map((venue, index) => (
              <article
                key={venue.id}
                className="group relative flex min-h-[66vh] w-[86vw] max-w-140 shrink-0 flex-col overflow-hidden rounded-2xl border border-primary/10 bg-surface-container-lowest shadow-[0_20px_80px_-40px_rgba(1,45,29,0.35)] md:w-[58vw] lg:w-[36vw]"
              >
                <div className="relative">
                  <img
                    src={venue.image}
                    alt={venue.name}
                    className="h-[42vh] w-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="pointer-events-none absolute inset-0 bg-linear-to-t from-primary/75 via-primary/15 to-transparent" />

                  <div className="absolute left-5 top-5 flex items-center gap-2 bg-black/25 px-3 py-1.5 backdrop-blur-md">
                    <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-secondary">
                      #{String(index + 1).padStart(2, "0")} Trending
                    </span>
                  </div>

                  {venue.verified ? (
                    <div className="absolute right-5 top-5 flex items-center gap-1.5 bg-secondary px-3 py-1.5 text-primary">
                      <ShieldCheck className="h-3.5 w-3.5" />
                      <span className="text-[10px] font-black uppercase tracking-[0.16em]">
                        Verified
                      </span>
                    </div>
                  ) : null}
                </div>

                <div className="flex grow flex-col justify-between gap-6 p-6 md:p-7">
                  <div>
                    <h3 className="font-display text-2xl font-black uppercase tracking-tight text-primary md:text-3xl">
                      {venue.name}
                    </h3>
                    <p className="mt-2 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.18em] text-on-surface-variant">
                      <MapPin className="h-4 w-4 text-primary/60" />
                      {venue.location}
                    </p>
                    <p className="mt-2 text-[10px] font-bold uppercase tracking-[0.16em] text-primary/60">
                      {courtsQuery.isLoading
                        ? "Loading score..."
                        : `${venue.bookings} bookings signal`}
                    </p>
                  </div>

                  <div className="flex items-end justify-between border-t border-primary/10 pt-5">
                    <p className="font-display text-4xl font-black text-primary md:text-5xl">
                      ${venue.pricePerHour}
                      <span className="ml-1 text-base font-bold text-primary/70">
                        /hr
                      </span>
                    </p>

                    <a
                      href={venue.slug ? `/venues/${venue.slug}` : "/venues"}
                      className="inline-flex items-center gap-1.5 border border-primary/20 px-3 py-2 text-[10px] font-black uppercase tracking-[0.16em] text-primary transition hover:bg-primary hover:text-secondary"
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
