/* eslint-disable @next/next/no-img-element */

import { MapPin } from "lucide-react";

export function FeaturedSpotlightSection() {
  return (
    <section className="relative overflow-hidden bg-primary px-6 py-28 text-surface md:px-12 md:py-40">
      <div className="absolute right-0 top-0 h-full w-1/2 bg-[radial-gradient(circle_at_right,rgba(193,241,0,0.2),transparent_60%)]" />

      <div className="relative z-10 mx-auto grid max-w-screen-2xl grid-cols-1 items-center gap-16 lg:grid-cols-2">
        <div>
          <p className="mb-8 inline-block bg-secondary px-4 py-1 font-display text-[10px] font-bold uppercase tracking-widest text-primary">
            Venue of the Month
          </p>
          <h2 className="font-display text-5xl font-black uppercase leading-[0.9] tracking-tight md:text-7xl">
            The <span className="text-secondary">Titanium</span>
            <br />
            Monolith
          </h2>
          <p className="mt-6 flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-surface/70">
            <MapPin className="h-4 w-4" /> Los Angeles District, CA
          </p>
          <p className="mt-8 max-w-xl text-lg leading-relaxed text-surface/80">
            Designed for elite-level performance with hybrid turf technology and
            broadcast-grade lighting.
          </p>
          <div className="mt-10 flex flex-wrap gap-4">
            <button className="btn-primary px-8 py-4 text-xs font-black uppercase tracking-widest">
              Book This Space
            </button>
            <button className="border border-surface/30 px-8 py-4 font-display text-xs font-black uppercase tracking-widest text-surface transition hover:bg-surface hover:text-primary">
              Explore Tour
            </button>
          </div>
        </div>

        <div className="relative">
          <div className="aspect-4/5 overflow-hidden bg-surface-container">
            <img
              src="https://images.unsplash.com/photo-1521412644187-c49fa049e84d?auto=format&fit=crop&w=1000&q=80"
              alt="Featured venue"
              className="h-full w-full object-cover"
            />
          </div>
          <div className="absolute -bottom-8 -left-8 hidden bg-secondary p-6 md:block">
            <p className="font-display text-4xl font-black text-primary">
              $450
            </p>
            <p className="text-[10px] font-bold uppercase tracking-widest text-primary">
              Premium Session Rate
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
