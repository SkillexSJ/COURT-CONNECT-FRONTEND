/* eslint-disable @next/next/no-img-element */

import { MapPin } from "lucide-react";

import { trendingVenues } from "./data";

export function TrendingVenuesSection() {
  const [primaryVenue, secondaryVenue] = trendingVenues;

  return (
    <section className="bg-surface px-6 py-28 md:px-12">
      <div className="mx-auto max-w-screen-2xl">
        <div className="mb-12 flex items-end justify-between">
          <div>
            <h2 className="font-display text-5xl font-black uppercase tracking-tight text-primary">
              Trending Venues
            </h2>
            <p className="mt-2 text-[10px] font-bold uppercase tracking-[0.2em] text-on-surface-variant">
              The most sought-after spots this week
            </p>
          </div>
          <a
            href="#"
            className="font-display text-sm font-bold uppercase tracking-widest text-primary underline decoration-secondary"
          >
            View All
          </a>
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-12">
          <article className="relative overflow-hidden bg-surface-container-lowest md:col-span-8">
            <img
              src={primaryVenue.image}
              alt={primaryVenue.name}
              className="aspect-video h-full w-full object-cover"
            />
            {primaryVenue.verified ? (
              <p className="badge-verified absolute right-6 top-6">
                Verified Venue
              </p>
            ) : null}
            <div className="flex items-start justify-between p-6">
              <div>
                <h3 className="font-display text-3xl font-bold uppercase tracking-tight text-primary">
                  {primaryVenue.name}
                </h3>
                <p className="mt-1 flex items-center gap-1 text-xs font-bold uppercase tracking-widest text-on-surface-variant">
                  <MapPin className="h-4 w-4" />
                  {primaryVenue.location}
                </p>
              </div>
              <p className="font-display text-3xl font-black text-primary">
                ${primaryVenue.pricePerHour}
                <span className="text-lg">/hr</span>
              </p>
            </div>
          </article>

          <article className="overflow-hidden bg-surface-container-lowest md:col-span-4">
            <img
              src={secondaryVenue.image}
              alt={secondaryVenue.name}
              className="aspect-square h-full w-full object-cover"
            />
            <div className="p-6">
              <h3 className="font-display text-xl font-bold uppercase text-primary">
                {secondaryVenue.name}
              </h3>
              <p className="mt-2 font-display text-2xl font-black text-primary">
                ${secondaryVenue.pricePerHour}
                <span className="text-sm">/hr</span>
              </p>
            </div>
          </article>
        </div>
      </div>
    </section>
  );
}
