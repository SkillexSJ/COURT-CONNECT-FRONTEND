"use client";

import {
  Accessibility,
  Car,
  Coffee,
  Dumbbell,
  ShowerHead,
  Utensils,
  Wifi,
  type LucideIcon,
} from "lucide-react";

import { CourtDetails, CourtAmenity } from "@/types/court.types";

interface VenueAboutProps {
  venue: CourtDetails;
}

const ICON_MAP: Record<string, LucideIcon> = {
  wifi: Wifi,
  parking: Car,
  shower: ShowerHead,
  changingroom: ShowerHead,
  coffee: Coffee,
  cafe: Coffee,
  food: Utensils,
  restaurant: Utensils,
  dumbbell: Dumbbell,
  gym: Dumbbell,
  accessibility: Accessibility,
  accessible: Accessibility,
};

const normalizeIconKey = (value: string) =>
  value.toLowerCase().replace(/[^a-z0-9]/g, "");

const AmenityIcon = ({
  icon,
  className,
}: {
  icon: string | null;
  className?: string;
}) => {
  const Icon = icon ? ICON_MAP[normalizeIconKey(icon)] : undefined;
  const SafeIcon = Icon ?? Coffee;
  return <SafeIcon className={className} />;
};

export default function VenueAbout({ venue }: VenueAboutProps) {
  //  amenity icons
  const amenityDescriptions: Record<string, string> = {
    Parking: "Free Parking Available",
    WiFi: "High-Speed WiFi",
    Lighting: "Professional Lighting",
    Seating: "Comfortable Seating",
    Restroom: "Clean Restrooms",
    "Changing Room": "Changing Facilities",
    Equipment: "Equipment Available",
    Food: "Food & Beverages",
  };

  // const organizerName =
  //   venue.organizer.businessName?.trim() ||
  //   venue.organizer.user?.name?.trim() ||
  //   "Organizer";
  // const organizerAvatar =
  //   venue.organizer.user?.avatarUrl || AVATAR_FALLBACK_IMAGE;

  return (
    <div className="space-y-14 lg:space-y-24">
      {/* <section className="rounded-sm border border-primary/15 bg-primary/3 p-6 md:p-8">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-4">
            <Avatar className="size-14 border border-primary/20">
              <AvatarImage src={organizerAvatar} alt={organizerName} />
              <AvatarFallback className="bg-primary/10 text-primary">
                {getInitials(organizerName)}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="text-[10px] uppercase tracking-[0.16em] text-primary/60">
                Organization
              </p>
              <p className="font-headline text-xl font-black uppercase tracking-tight text-primary">
                {organizerName}
              </p>
            </div>
          </div>
          {venue.organizer.bio && (
            <p className="max-w-2xl text-sm leading-relaxed text-primary/80">
              {venue.organizer.bio}
            </p>
          )}
        </div>
      </section> */}

      {/* Experience Narrative Section */}
      <section className="space-y-6 sm:space-y-8">
        <div className="flex items-center gap-3 sm:gap-4">
          <h2 className="font-headline text-2xl font-black uppercase tracking-tight text-primary sm:text-3xl sm:tracking-tighter">
            Experience
          </h2>
          <div className="h-0.5 grow bg-primary/15" />
        </div>

        <div className="grid grid-cols-1 items-start gap-6 sm:gap-8 md:grid-cols-5 md:gap-12">
          {/* Court Type Badge */}
          <div className="space-y-3 md:col-span-2 md:space-y-4">
            <div className="inline-block bg-primary border border-secondary/30 px-4 py-2 rounded-sm">
              <p className="font-headline text-xs font-bold uppercase tracking-widest text-secondary sm:text-sm">
                {venue.type}
              </p>
            </div>
            <p className="text-primary font-body text-sm leading-relaxed">
              Professional-grade facility designed for athletes and enthusiasts.
            </p>
          </div>

          {/* Description */}
          <div className="space-y-4 font-body leading-relaxed text-primary md:col-span-3 md:space-y-6">
            <p>
              {venue.description ||
                "Welcome to our premier sports facility. This venue is equipped with state-of-the-art amenities and designed to provide an exceptional experience for all athletes."}
            </p>
            <p>
              Whether you&apos;re training, competing, or enjoying recreational
              play, our facility offers the perfect environment to pursue your
              passion for sports.
            </p>
          </div>
        </div>
      </section>

      {/* Amenities Section */}
      <section className="space-y-6 sm:space-y-8">
        <div className="flex items-center gap-3 sm:gap-4">
          <h2 className="font-headline text-2xl font-black uppercase tracking-tight text-primary sm:text-3xl sm:tracking-tighter">
            Amenities
          </h2>
          <div className="h-0.5 grow bg-primary/15" />
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 md:grid-cols-4">
          {venue.amenities && venue.amenities.length > 0
            ? venue.amenities.slice(0, 4).map((amenity) => (
                <div
                  key={amenity.id}
                  className="group cursor-pointer rounded-sm border border-primary/10 bg-primary/5 p-5 transition-all duration-300 hover:bg-primary hover:text-secondary sm:p-8"
                >
                  <AmenityIcon
                    icon={amenity.icon}
                    className="w-6 h-6 mb-4 text-primary group-hover:text-secondary"
                  />
                  <p className="font-headline font-bold text-sm uppercase tracking-widest text-primary group-hover:text-secondary">
                    {amenity.name}
                  </p>
                  <p className="text-xs text-primary/60 group-hover:text-secondary/80 mt-2">
                    {amenityDescriptions[amenity.name] || amenity.name}
                  </p>
                </div>
              ))
            : // Placeholder amenities
              ["Parking", "WiFi", "Lighting", "Seating"].map((name, idx) => (
                <div
                  key={idx}
                  className="group rounded-sm border border-primary/10 bg-primary/5 p-5 transition-all duration-300 hover:bg-primary hover:text-secondary sm:p-8"
                >
                  <AmenityIcon
                    icon={
                      idx === 0
                        ? "parking"
                        : idx === 1
                          ? "wifi"
                          : idx === 2
                            ? "dumbbell"
                            : "coffee"
                    }
                    className="w-6 h-6 mb-4 text-primary group-hover:text-secondary"
                  />
                  <p className="font-headline font-bold text-sm uppercase tracking-widest text-primary group-hover:text-secondary">
                    {name}
                  </p>
                  <p className="text-xs text-primary/60 group-hover:text-secondary/80 mt-2">
                    {amenityDescriptions[name]}
                  </p>
                </div>
              ))}
        </div>
      </section>
    </div>
  );
}
