/* eslint-disable @next/next/no-img-element */

import { Map } from "lucide-react";

import { cityStats } from "./data";

export function GlobalPresenceSection() {
  return (
    <section className="bg-primary px-6 py-28 md:px-12">
      <div className="mx-auto grid max-w-screen-2xl grid-cols-1 items-center gap-16 lg:grid-cols-2">
        <div>
          <h2 className="font-display text-5xl font-black uppercase leading-none tracking-tight text-surface md:text-7xl">
            Global
            <br />
            <span className="text-secondary">Presence.</span>
          </h2>
          <p className="mt-6 max-w-lg text-lg text-surface/70">
            From concrete courts in New York to elite fields in London. We are
            where the game happens.
          </p>
          <div className="mt-10 grid grid-cols-2 gap-6">
            {cityStats.map((item) => (
              <div key={item.city}>
                <p className="font-display text-4xl font-black text-secondary">
                  {item.count}
                </p>
                <p className="mt-2 text-[10px] font-bold uppercase tracking-widest text-surface/60">
                  Venues in {item.city}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="relative aspect-video overflow-hidden bg-black/30">
          <img
            src="https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&w=1200&q=80"
            alt="World map"
            className="h-full w-full object-cover opacity-40"
          />
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-secondary text-primary">
              <Map className="h-8 w-8" />
            </div>
            <p className="font-display text-sm font-black uppercase tracking-widest text-surface">
              Explore Interactive Map
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
