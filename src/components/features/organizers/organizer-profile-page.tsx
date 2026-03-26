"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import {
  ArrowUpRight,
  CalendarDays,
  Globe,
  MapPin,
  Search,
  ShieldCheck,
} from "lucide-react";

import Loading from "@/app/loading";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import {
  AVATAR_FALLBACK_IMAGE,
  VENUE_FALLBACK_IMAGE,
  getInitials,
} from "@/lib/placeholders";
import { organizerService } from "@/service/organizer.service";

// HELPERS
const getVenueImage = (
  venue: { media?: Array<{ url: string; isPrimary?: boolean }> } | undefined,
) =>
  venue?.media?.find((media) => media.isPrimary)?.url ||
  venue?.media?.[0]?.url ||
  VENUE_FALLBACK_IMAGE;

export default function OrganizerProfilePage() {
  const params = useParams();
  const organizerId = params.organizerId as string;
  const [search, setSearch] = useState("");

  const organizerQuery = useQuery({
    queryKey: ["organizer-public-profile", organizerId],
    queryFn: () => organizerService.getPublicProfile(organizerId),
    enabled: Boolean(organizerId),
    staleTime: 60_000,
  });

  const organizer = organizerQuery.data?.data;

  const filteredVenues = useMemo(() => {
    const venues = organizer?.venues ?? [];
    const normalizedSearch = search.trim().toLowerCase();

    if (!normalizedSearch) return venues;

    return venues.filter((venue) => {
      return (
        venue.name.toLowerCase().includes(normalizedSearch) ||
        venue.locationLabel.toLowerCase().includes(normalizedSearch) ||
        venue.type.toLowerCase().includes(normalizedSearch)
      );
    });
  }, [organizer?.venues, search]);

  if (organizerQuery.isLoading) {
    return <Loading />;
  }

  if (organizerQuery.isError || !organizer) {
    return (
      <section className="mx-auto min-h-[60vh] w-full max-w-360 px-4 pb-16 pt-24 sm:px-6 lg:px-8">
        <div className="bg-card p-8 text-center shadow-sm">
          <h1 className="font-heading text-3xl font-black uppercase text-primary">
            Organizer Not Found
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            This organizer profile is unavailable or may have been removed.
          </p>
          <Link
            href="/organizers"
            className="mt-5 inline-flex bg-primary px-5 py-2.5 text-xs font-black uppercase tracking-[0.12em] text-primary-foreground"
          >
            Back to Organizers
          </Link>
        </div>
      </section>
    );
  }

  const heroImage = getVenueImage(organizer.venues[0]);
  const organizerName =
    organizer.businessName?.trim() ||
    organizer.user?.name?.trim() ||
    "Independent Organizer";

  return (
    <section className="mx-auto w-full max-w-360 space-y-8 px-4 pb-16 pt-24 sm:px-6 lg:px-8">
      <header className="overflow-hidden bg-primary text-primary-foreground shadow-md">
        <div className="relative h-64 sm:h-72 lg:h-80">
          <Image
            src={heroImage}
            alt={organizerName}
            fill
            loading="eager"
            className="object-cover"
            sizes="100vw"
            priority
          />
          <div className="absolute inset-0 bg-linear-to-r from-primary/95 via-primary/75 to-primary/40" />

          <div className="absolute inset-x-0 bottom-0 p-5 sm:p-7">
            <div className="flex flex-wrap items-end gap-4">
              <div className=" hidden md:inline-flex h-16 w-16 items-center justify-center border-2 border-secondary bg-primary text-lg font-black text-secondary sm:h-20 sm:w-20 sm:text-xl">
                {getInitials(organizerName)}
              </div>

              <div className="min-w-0 flex-1 space-y-2">
                <div className="flex flex-wrap items-center gap-2">
                  <h1 className="font-heading text-2xl font-black uppercase tracking-tight sm:text-5xl">
                    {organizerName}
                  </h1>
                  <span
                    className={`inline-flex items-center gap-1 px-2 py-1 text-[10px] font-black uppercase tracking-[0.12em] ${
                      organizer.isVerified
                        ? "bg-secondary text-secondary-foreground"
                        : "bg-primary-foreground/20 text-primary-foreground"
                    }`}
                  >
                    <ShieldCheck className="h-3.5 w-3.5" />
                    {organizer.isVerified ? "Verified" : "Unverified"}
                  </span>
                </div>

                <p className="max-w-3xl text-sm text-primary-foreground/85 sm:text-base">
                  {organizer.bio?.trim() ||
                    "Premium sports venue partner on Court Connect."}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid gap-3 border-t border-primary-foreground/20 bg-primary/90 p-4 text-[11px] uppercase tracking-[0.12em] sm:grid-cols-2 lg:grid-cols-4 sm:p-5">
          <div className="flex items-center gap-2 text-primary-foreground/80">
            <CalendarDays className="h-3.5 w-3.5 text-secondary" />
            Joined {new Date(organizer.createdAt).toLocaleDateString()}
          </div>

          <div className="flex items-center gap-2 text-primary-foreground/80">
            <MapPin className="h-3.5 w-3.5 text-secondary" />
            {organizer.address?.trim() || "Location not specified"}
          </div>

          <div className="flex items-center gap-2 text-primary-foreground/80">
            <Globe className="h-3.5 w-3.5 text-secondary" />
            {organizer.website?.trim() ? (
              <a
                href={organizer.website}
                target="_blank"
                rel="noreferrer"
                className="truncate underline decoration-secondary/50 underline-offset-4 hover:text-secondary"
              >
                Website
              </a>
            ) : (
              "Website unavailable"
            )}
          </div>

          <div className="flex items-center gap-2 text-primary-foreground/80">
            <Avatar className="size-5 border border-primary-foreground/30">
              <AvatarImage
                src={organizer.user?.avatarUrl || AVATAR_FALLBACK_IMAGE}
                alt={organizer.user?.name || organizerName}
              />
              <AvatarFallback className="bg-primary-foreground/20 text-primary-foreground">
                {getInitials(organizer.user?.name || organizerName)}
              </AvatarFallback>
            </Avatar>
            Contact:{" "}
            {organizer.phoneNumber ? (
              <a
                href={`tel:${organizer.phoneNumber}`}
                className="truncate underline decoration-secondary/50 underline-offset-4 hover:text-secondary"
              >
                {organizer.phoneNumber}
              </a>
            ) : (
              organizer.user?.name || "Organizer Team"
            )}
          </div>
        </div>
      </header>

      <section className="space-y-3 bg-card p-4 shadow-sm sm:p-5">
        <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-muted-foreground">
          Organizer Bio
        </p>
        <p className="text-sm leading-relaxed text-foreground/90 sm:text-base">
          {organizer.bio?.trim() ||
            "This organizer has not added a detailed bio yet."}
        </p>
      </section>

      <section className="space-y-4 bg-card p-4 shadow-sm sm:p-5">
        <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-muted-foreground">
              Managed Courts
            </p>
            <h2 className="font-heading text-3xl font-black uppercase tracking-tight text-primary sm:text-4xl">
              {organizer.totalVenues} Venues
            </h2>
            <p className="text-xs uppercase tracking-[0.12em] text-muted-foreground">
              {organizer.totalBookings} network bookings
            </p>
          </div>

          <div className="relative w-full md:w-80">
            <Search className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search courts"
              className="h-9 rounded-none border-border bg-background pl-8 text-xs"
            />
          </div>
        </div>

        {filteredVenues.length === 0 ? (
          <div className="border border-dashed border-border p-8 text-center text-sm text-muted-foreground">
            No venues matched your search.
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {filteredVenues.map((venue) => (
              <article
                key={venue.id}
                className="overflow-hidden border border-border bg-background"
              >
                <Link href={`/venues/${venue.slug}`} className="block">
                  <div className="relative h-44 overflow-hidden">
                    <Image
                      src={getVenueImage(venue)}
                      alt={venue.name}
                      fill
                      loading="eager"
                      className="object-cover transition-transform duration-300 hover:scale-105"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                    <div className="absolute right-2 top-2 bg-secondary px-2 py-1 text-[10px] font-black uppercase tracking-[0.12em] text-secondary-foreground">
                      {venue.type}
                    </div>
                  </div>
                </Link>

                <div className="space-y-3 p-4">
                  <div>
                    <p className="font-heading text-lg font-black uppercase tracking-tight text-primary">
                      {venue.name}
                    </p>
                    <p className="text-[10px] uppercase tracking-[0.12em] text-muted-foreground">
                      {venue.locationLabel}
                    </p>
                  </div>

                  <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-[0.12em] text-muted-foreground">
                    <span>{venue._count?.bookings ?? 0} bookings</span>
                    <span className="font-black text-primary">
                      FROM ${venue.basePrice}
                    </span>
                  </div>

                  <Link
                    href={`/venues/${venue.slug}`}
                    className="inline-flex w-full items-center justify-center gap-1 bg-primary px-4 py-2.5 text-[10px] font-black uppercase tracking-[0.14em] text-primary-foreground hover:bg-primary/90"
                  >
                    Book This Court
                    <ArrowUpRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      <section className="overflow-hidden border border-border bg-card text-foreground shadow-lg">
        <div className="grid grid-cols-1 items-stretch lg:grid-cols-2">
          <div className="space-y-6 p-6 sm:p-8 lg:p-10">
            <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-primary">
              Partner With Court Connect
            </p>
            <h3 className="font-heading text-4xl font-black uppercase leading-[0.9] tracking-tight sm:text-5xl lg:text-6xl">
              Elevate Your Game
              <br />
              As An Organizer
            </h3>
            <p className="max-w-xl text-sm leading-relaxed text-muted-foreground sm:text-base">
              Build your brand, get discovered by more players, and manage all
              your venue operations from one unified dashboard.
            </p>

            <div className="flex flex-col gap-3 sm:flex-row">
              <Link
                href="/dashboard/become-organizer"
                className="inline-flex items-center justify-center bg-secondary px-6 py-3 text-xs font-black uppercase tracking-[0.14em] text-secondary-foreground hover:bg-secondary/90"
              >
                Become an Organizer
              </Link>
              <Link
                href="/organizers"
                className="inline-flex items-center justify-center border border-primary/25 bg-transparent px-6 py-3 text-xs font-black uppercase tracking-[0.14em] text-primary hover:bg-primary/8"
              >
                Explore Organizers
              </Link>
            </div>
          </div>

          <div className="relative min-h-72">
            <Image
              src={"/image3.png"}
              alt="Become an organizer on Court Connect"
              fill
              loading="eager"
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
            <div className="absolute inset-0 bg-linear-to-l from-card/10 via-primary/20 to-primary/45 lg:bg-linear-to-r" />
            <div className="absolute bottom-5 left-5 bg-card px-5 py-4 text-card-foreground shadow-lg">
              <p className="font-heading text-3xl font-black leading-none text-primary">
                10K+
              </p>
              <p className="mt-1 text-[10px] font-bold uppercase tracking-[0.14em] text-muted-foreground">
                Active Members
              </p>
            </div>
          </div>
        </div>
      </section>
    </section>
  );
}
