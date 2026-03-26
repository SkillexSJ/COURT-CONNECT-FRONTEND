"use client";

import { useMemo } from "react";
import { MapPin } from "lucide-react";
import Image from "next/image";
import { useHomeLandingCourtsQuery } from "@/hooks/queries/use-courts-query";
import { VENUE_FALLBACK_IMAGE } from "@/lib/placeholders";
import type { CourtListItem } from "@/types/court.types";
import Link from "next/link";

// TYPES
type SpotlightVenue = {
  titleMain: string;
  titleAccent: string;
  location: string;
  description: string;
  image: string;
  imageAlt: string;
  price: number;
  detailHref: string;
};

// FALLBACK
const staticFallbackVenue: SpotlightVenue = {
  titleMain: "The Titanium",
  titleAccent: "Monolith",
  location: "Los Angeles District, CA",
  description:
    "Designed by world-renowned architects, the Monolith represents the pinnacle of urban sports infrastructure. Featuring hybrid turf technology and elite broadcast capabilities.",
  image: "/image2.png",
  imageAlt: "Premium arena architecture",
  price: 450,
  detailHref: "/venues",
};

// HELPER
const toPriceNumber = (value: string | number) => {
  if (typeof value === "number") return value;
  const parsed = Number.parseFloat(value);
  return Number.isFinite(parsed) ? parsed : 0;
};

const mapCourtToSpotlightVenue = (court: CourtListItem): SpotlightVenue => {
  const venueNameParts = court.name.trim().split(/\s+/).filter(Boolean);
  const hasAccentSplit = venueNameParts.length > 1;

  const titleMain = hasAccentSplit
    ? venueNameParts.slice(0, -1).join(" ")
    : court.name;
  const titleAccent = hasAccentSplit
    ? venueNameParts[venueNameParts.length - 1]
    : "Spotlight";

  const image =
    court.media?.find((item) => item.isPrimary)?.url ??
    court.media?.[0]?.url ??
    VENUE_FALLBACK_IMAGE;

  return {
    titleMain,
    titleAccent,
    location: court.locationLabel,
    description:
      "This venue is currently leading booking demand across the platform. Explore the court profile and secure your slot before prime hours are gone.",
    image,
    imageAlt: `${court.name} venue image`,
    price: toPriceNumber(court.basePrice),
    detailHref: `/venues/${court.slug}`,
  };
};

export function FeaturedSpotlightSection() {
  // QUERY
  const courtsQuery = useHomeLandingCourtsQuery();

  const spotlightVenue = useMemo<SpotlightVenue>(() => {
    const courts = courtsQuery.data?.data ?? [];
    const topBookedCourt = [...courts]
      .filter((court) => (court._count?.bookings ?? 0) > 0)
      .sort((a, b) => (b._count?.bookings ?? 0) - (a._count?.bookings ?? 0))[0];

    return topBookedCourt
      ? mapCourtToSpotlightVenue(topBookedCourt)
      : staticFallbackVenue;
  }, [courtsQuery.data?.data]);

  return (
    <section className="relative  overflow-hidden bg-primary px-5 py-18 text-primary-foreground sm:px-6 md:px-10 md:py-24 lg:px-12 lg:py-28">
      {/* <div className="pointer-events-none absolute inset-y-0 right-0 w-[55%] bg-black/12" />
      <div className="pointer-events-none absolute left-0 top-0 h-full w-1/2 bg-black/10" /> */}

      <div className="relative z-10 mx-auto grid w-full max-w-screen-2xl grid-cols-1 items-center gap-14 lg:grid-cols-[1.06fr_0.94fr] lg:gap-18">
        <div className="max-w-2xl">
          <p className="mb-7 inline-flex bg-secondary px-3 py-1 font-display text-[10px] font-black uppercase tracking-[0.16em] text-secondary-foreground">
            Featured Venue
          </p>

          <h2 className="font-display text-5xl font-black uppercase leading-[0.86] tracking-tight text-primary-foreground sm:text-6xl lg:text-7xl xl:text-8xl">
            {spotlightVenue.titleMain}
            <br />
            <span className="text-secondary">{spotlightVenue.titleAccent}</span>
          </h2>

          <p className="mt-7 flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.16em] text-primary-foreground/65">
            <MapPin className="h-4 w-4" /> {spotlightVenue.location}
          </p>

          <p className="mt-7 max-w-xl text-lg leading-relaxed text-primary-foreground/82">
            {spotlightVenue.description}
          </p>

          <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:gap-4">
            <Link
              href={spotlightVenue.detailHref}
              className="bg-secondary max-w-1/2  px-8 py-4 text-center font-display text-xs font-black uppercase tracking-[0.16em] text-secondary-foreground transition hover:opacity-90 sm:px-10"
            >
              Book This Space
            </Link>
            {/* <a
              href={spotlightVenue.detailHref}
              className="border border-primary-foreground/30 bg-transparent px-8 py-4 text-center font-display text-xs font-black uppercase tracking-[0.16em] text-primary-foreground transition hover:bg-primary-foreground hover:text-primary sm:px-10"
            >
              Explore Tour
            </a> */}
          </div>
        </div>

        <div className="relative mx-auto w-full max-w-150 lg:mx-0">
          <div className="relative aspect-square overflow-hidden border border-primary-foreground/10 bg-black/35 lg:rounded-sm">
            <Image
              src={spotlightVenue.image}
              loading="eager"
              alt={spotlightVenue.imageAlt}
              className="h-full w-full object-cover"
              fill
            />
            <div className="absolute inset-0 bg-primary/35" />
          </div>

          <div className="absolute -bottom-7 left-4 border border-secondary/50 bg-secondary px-5 py-4 shadow-lg sm:left-6 sm:px-6 sm:py-5 md:left-8">
            <p className="font-display text-4xl font-black leading-none text-secondary-foreground sm:text-5xl">
              ${spotlightVenue.price}
            </p>
            <p className="mt-1 text-[10px] font-bold uppercase tracking-[0.16em] text-secondary-foreground/90">
              Hourly Rate Session
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
