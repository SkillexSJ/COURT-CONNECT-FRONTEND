"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { ArrowUpRight, Building2, Search } from "lucide-react";
import { useQuery } from "@tanstack/react-query";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AVATAR_FALLBACK_IMAGE, getInitials } from "@/lib/placeholders";
import { organizerService } from "@/service/organizer.service";

type OrganizerFilter = "ALL" | "TOP" | "VERIFIED" | "NEW";

type OrganizerGroup = {
  id: string;
  name: string;
  avatarUrl: string;
  isVerified: boolean;
  createdAt: string;
  totalVenues: number;
  totalBookings: number;
};

const FILTERS: Array<{ label: string; value: OrganizerFilter }> = [
  { label: "All Organizers", value: "ALL" },
  { label: "Top Rated", value: "TOP" },
  { label: "Verified Only", value: "VERIFIED" },
  { label: "New Partners", value: "NEW" },
];

export default function OrganizerListingPage() {
  const [activeFilter, setActiveFilter] = useState<OrganizerFilter>("ALL");
  const [searchValue, setSearchValue] = useState("");

  // QUERIES FOR ORGANIZER LISTING
  const organizersQuery = useQuery({
    queryKey: ["organizers-directory"],
    queryFn: async () => {
      const response = await organizerService.getPublicDirectory({
        limit: 120,
        sortBy: "-createdAt",
      });
      return response.data ?? [];
    },
    staleTime: 60_000,
  });

  // MEMOIZED ORGANIZER GROUPS
  const organizerGroups = useMemo<OrganizerGroup[]>(() => {
    return (organizersQuery.data ?? []).map((organizer) => {
      const bookingsFromVenues = organizer.venues.reduce(
        (sum, venue) => sum + (venue._count?.bookings ?? 0),
        0,
      );

      return {
        id: organizer.id,
        name:
          organizer.businessName?.trim() ||
          organizer.user?.name ||
          "Independent Organizer",
        avatarUrl: organizer.user?.avatarUrl || AVATAR_FALLBACK_IMAGE,
        isVerified: organizer.isVerified,
        createdAt: organizer.createdAt,
        totalVenues: organizer.totalVenues,
        totalBookings: bookingsFromVenues,
      };
    });
  }, [organizersQuery.data]);

  // MEMOIZED FILTERED ORGANIZERS
  const filteredOrganizers = useMemo(() => {
    const normalizedSearch = searchValue.trim().toLowerCase();

    const searched = organizerGroups.filter((group) => {
      if (!normalizedSearch) return true;

      return group.name.toLowerCase().includes(normalizedSearch);
    });

    const byCreatedAtDesc = (a: OrganizerGroup, b: OrganizerGroup) =>
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();

    if (activeFilter === "TOP") {
      return searched
        .filter((group) => group.totalBookings >= 1)
        .slice()
        .sort(
          (a, b) => b.totalBookings - a.totalBookings || byCreatedAtDesc(a, b),
        )
        .slice(0, 12);
    }

    if (activeFilter === "VERIFIED") {
      return searched
        .filter((group) => group.isVerified)
        .sort(
          (a, b) =>
            b.totalBookings - a.totalBookings ||
            b.totalVenues - a.totalVenues ||
            byCreatedAtDesc(a, b),
        );
    }

    if (activeFilter === "NEW") {
      return searched.slice().sort(byCreatedAtDesc).slice(0, 12);
    }

    return searched
      .slice()
      .sort(
        (a, b) =>
          Number(b.isVerified) - Number(a.isVerified) ||
          b.totalBookings - a.totalBookings ||
          byCreatedAtDesc(a, b),
      );
  }, [activeFilter, organizerGroups, searchValue]);

  // TOTAL VENUES AND BOOKINGS
  const totalVenues = organizerGroups.reduce(
    (sum, group) => sum + group.totalVenues,
    0,
  );
  const totalBookings = organizerGroups.reduce(
    (sum, group) => sum + group.totalBookings,
    0,
  );

  return (
    <section className="mx-auto w-full max-w-360 space-y-8 px-4 pb-16 pt-24 sm:px-6 lg:px-8">
      <header className="grid gap-4 lg:grid-cols-[2fr_1fr]">
        <div className="space-y-3 bg-primary p-5 text-primary-foreground sm:p-6">
          <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-secondary">
            Organizers Directory
          </p>
          <h1 className="font-heading text-4xl font-black uppercase leading-[0.9] tracking-tight sm:text-6xl">
            The Partners
          </h1>
          <p className="max-w-2xl text-sm text-primary-foreground/80">
            New to Court Connect? Explore verified organizations, compare their
            venue footprint, and jump into their portfolio instantly.
          </p>
        </div>

        <aside className="grid grid-cols-2 gap-3 bg-card p-5 shadow-sm">
          <div>
            <p className="text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
              Organizers
            </p>
            <p className="font-heading text-3xl font-black text-primary">
              {organizerGroups.length}
            </p>
          </div>
          <div>
            <p className="text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
              Total Venues
            </p>
            <p className="font-heading text-3xl font-black text-primary">
              {totalVenues}
            </p>
          </div>
          <div className="col-span-2 bg-secondary p-3 text-secondary-foreground">
            <p className="text-[10px] uppercase tracking-[0.14em] text-secondary-foreground/70">
              Network Bookings
            </p>
            <p className="font-heading text-2xl font-black">{totalBookings}</p>
          </div>
        </aside>
      </header>

      <div className="space-y-3 bg-card p-3 shadow-sm sm:p-4">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div className="grid grid-cols-2 gap-2 md:flex md:flex-wrap">
            {FILTERS.map((filter) => (
              <Button
                key={filter.value}
                type="button"
                size="sm"
                variant={activeFilter === filter.value ? "default" : "ghost"}
                className={`h-8 rounded-none border-0 text-[10px] uppercase tracking-[0.14em] ${
                  activeFilter === filter.value
                    ? "bg-secondary text-secondary-foreground hover:bg-secondary/90"
                    : "text-muted-foreground hover:bg-accent"
                }`}
                onClick={() => setActiveFilter(filter.value)}
              >
                {filter.label}
              </Button>
            ))}
          </div>

          <div className="relative w-full lg:w-72">
            <Search className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={searchValue}
              onChange={(event) => setSearchValue(event.target.value)}
              placeholder="Search organizer"
              className="h-8 rounded-none border-border bg-background pl-8 text-xs"
            />
          </div>
        </div>
      </div>

      {organizersQuery.isLoading ? (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <div key={index} className="h-80 animate-pulse bg-muted" />
          ))}
        </div>
      ) : filteredOrganizers.length === 0 ? (
        <div className="bg-card p-8 text-center text-sm text-muted-foreground shadow-sm">
          No organizers found for the selected filters.
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {filteredOrganizers.map((group) => {
            return (
              <article
                key={group.id}
                className="group overflow-hidden bg-primary text-primary-foreground shadow-md"
              >
                <div className="space-y-4 p-4">
                  <div className="flex items-center justify-between gap-3">
                    <Link
                      href={`/organizers/${group.id}`}
                      className="flex min-w-0 items-center gap-3"
                    >
                      <Avatar className="size-10 border border-border/70">
                        <AvatarImage src={group.avatarUrl} alt={group.name} />
                        <AvatarFallback className="bg-primary-foreground/20 text-primary-foreground">
                          {getInitials(group.name)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="min-w-0">
                        <p className="truncate font-heading text-sm font-black uppercase tracking-[0.04em] text-primary-foreground">
                          {group.name}
                        </p>
                        <p className="text-[10px] uppercase tracking-[0.14em] text-primary-foreground/70">
                          {group.totalVenues} venues • {group.totalBookings}{" "}
                          bookings
                        </p>
                      </div>
                    </Link>
                    <span
                      className={`inline-flex items-center gap-1 px-2 py-1 text-[10px] font-black uppercase tracking-[0.12em] ${
                        group.isVerified
                          ? "bg-secondary text-secondary-foreground"
                          : "bg-primary-foreground/20 text-primary-foreground"
                      }`}
                    >
                      <Building2 className="h-3 w-3" />
                      {group.isVerified ? "Verified" : "Unverified"}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-3 border-t border-primary-foreground/20 pt-3">
                    <div className="bg-primary-foreground/10 p-3">
                      <p className="text-[10px] uppercase tracking-[0.14em] text-primary-foreground/70">
                        Venues
                      </p>
                      <p className="font-heading text-2xl font-black text-primary-foreground">
                        {group.totalVenues}
                      </p>
                    </div>
                    <div className="bg-primary-foreground/10 p-3">
                      <p className="text-[10px] uppercase tracking-[0.14em] text-primary-foreground/70">
                        Bookings
                      </p>
                      <p className="font-heading text-2xl font-black text-primary-foreground">
                        {group.totalBookings}
                      </p>
                    </div>
                  </div>

                  <div className="border-t border-primary-foreground/20 pt-3">
                    <Link
                      href={`/organizers/${group.id}`}
                      className="inline-flex items-center gap-1 text-[10px] font-black uppercase tracking-[0.14em] text-secondary"
                    >
                      Open Organizer Profile
                      <ArrowUpRight className="h-3.5 w-3.5" />
                    </Link>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </section>
  );
}
