"use client";

import { useMemo, useState } from "react";
import type { SyntheticEvent } from "react";
import { useRouter } from "next/navigation";
import { CalendarDays, MapPin, Search, Swords } from "lucide-react";
import Image from "next/image";
import { SPORT_TYPES } from "@/lib/constants/sports";

export function HeroSection() {
  const router = useRouter();

  // STATES
  const [mobileQuery, setMobileQuery] = useState("");
  const [sport, setSport] = useState("");
  const [location, setLocation] = useState("");
  const [date, setDate] = useState("");

  const today = useMemo(() => new Date().toISOString().split("T")[0], []);

  // HANDLERS
  const submitSearch = (event: SyntheticEvent<HTMLFormElement>) => {
    event.preventDefault();

    const mobileValue = mobileQuery.trim();
    const sportValue = sport.trim();
    const locationValue = location.trim() || mobileValue;
    const exactMatchedSport = SPORT_TYPES.find(
      (item) => item.toLowerCase() === mobileValue.toLowerCase(),
    );

    const params = new URLSearchParams();

    if (locationValue) {
      params.set("searchTerm", locationValue);
    }

    if (sportValue) {
      params.set("type", sportValue);
    } else if (exactMatchedSport) {
      params.set("type", exactMatchedSport);
    }

    if (date) {
      params.set("date", date);
    }

    const query = params.toString();
    router.push(query ? `/venues?${query}` : "/venues");
  };

  return (
    <section className="relative flex min-h-[87vh] md:min-h-[94vh] items-center overflow-hidden pt-20">
      <div className="absolute inset-0">
        <Image
          src="/hero.jpg"
          alt="Athletic action"
          className="h-full w-full object-cover"
          fill
        />
        <div className="absolute inset-0 bg-linear-to-t from-primary via-primary/30 to-transparent" />
      </div>

      <div className="relative z-10 mx-auto w-full max-w-screen-2xl px-6 md:px-12">
        <div className="mx-auto max-w-4xl md:mx-0">
          <h1 className="text-center font-display text-[clamp(3.8rem,18vw,8rem)] font-bold uppercase leading-[0.82] tracking-tight text-white md:text-left">
            The Arena
            <br />
            <span className="text-secondary">Awaits.</span>
          </h1>
        </div>

        <form
          onSubmit={submitSearch}
          className="mt-12 max-w-6xl border border-primary/10 bg-surface/95 p-3 backdrop-blur-sm"
        >
          <div className="flex gap-2 md:hidden">
            <label className="flex grow items-center gap-3 rounded-sm border border-primary/10 bg-white/85 px-4 py-4 transition-colors focus-within:border-primary/40">
              <Search className="h-4 w-4 text-primary/70" />
              <input
                value={mobileQuery}
                onChange={(event) => setMobileQuery(event.target.value)}
                className="w-full border-0 bg-transparent p-0 font-display text-base font-bold text-primary outline-none"
                placeholder="Search by sport or city"
              />
            </label>
            <button
              type="submit"
              className="flex min-h-16 items-center justify-center bg-primary px-5 font-display text-xs font-black uppercase tracking-widest text-secondary transition hover:brightness-110"
            >
              Go
            </button>
          </div>

          <div className="hidden gap-2 md:grid lg:grid-cols-[1fr_1fr_1fr_auto]">
            <label className="rounded-sm border border-primary/10 bg-white/80 p-4 transition-colors focus-within:border-primary/40">
              <p className="mb-2 text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">
                What sport?
              </p>
              <div className="flex items-center gap-3">
                <Swords className="h-4 w-4 text-primary/70" />
                <input
                  value={sport}
                  onChange={(event) => setSport(event.target.value)}
                  list="hero-sport-suggestions"
                  className="w-full border-0 bg-transparent p-0 font-display text-base font-bold text-primary outline-none md:text-lg"
                  placeholder="Football, Tennis..."
                />
              </div>
            </label>

            <label className="rounded-sm border border-primary/10 bg-white/80 p-4 transition-colors focus-within:border-primary/40">
              <p className="mb-2 text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">
                Where?
              </p>
              <div className="flex items-center gap-3">
                <MapPin className="h-4 w-4 text-primary/70" />
                <input
                  value={location}
                  onChange={(event) => setLocation(event.target.value)}
                  className="w-full border-0 bg-transparent p-0 font-display text-base font-bold text-primary outline-none md:text-lg"
                  placeholder="Enter city or area"
                />
              </div>
            </label>

            <label className="rounded-sm border border-primary/10 bg-white/80 p-4 transition-colors focus-within:border-primary/40">
              <p className="mb-2 text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">
                Date
              </p>
              <div className="flex items-center gap-3">
                <CalendarDays className="h-4 w-4 text-primary/70" />
                <input
                  type="date"
                  min={today}
                  value={date}
                  onChange={(event) => setDate(event.target.value)}
                  className="w-full border-0 bg-transparent p-0 font-display text-base font-bold text-primary outline-none md:text-lg"
                />
              </div>
            </label>

            <button
              type="submit"
              className="flex min-h-16 items-center justify-center gap-2 bg-primary px-8 py-4 font-display text-sm font-black uppercase tracking-widest text-secondary transition hover:brightness-110"
            >
              <Search className="h-4 w-4" />
              Search
            </button>
          </div>

          <datalist id="hero-sport-suggestions">
            {SPORT_TYPES.map((item) => (
              <option key={item} value={item} />
            ))}
          </datalist>

          <div className="mt-3 hidden flex-wrap items-center gap-2 px-1 md:flex">
            {SPORT_TYPES.map((item) => {
              const isActive =
                sport.trim().toLowerCase() === item.toLowerCase();

              return (
                <button
                  key={item}
                  type="button"
                  onClick={() => setSport(item)}
                  className={`rounded-full border px-3 py-1 text-[10px] font-bold uppercase tracking-[0.16em] transition-colors ${
                    isActive
                      ? "border-primary bg-primary text-secondary"
                      : "border-primary/20 bg-white/70 text-primary hover:border-primary/40"
                  }`}
                >
                  {item}
                </button>
              );
            })}
          </div>
        </form>
      </div>
    </section>
  );
}
