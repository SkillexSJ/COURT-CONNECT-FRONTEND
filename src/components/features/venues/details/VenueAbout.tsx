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
  // Sample amenity icons - map amenity names to meaningful descriptions
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

  return (
    <div className="space-y-24">
      {/* Experience Narrative Section */}
      <section className="space-y-8">
        <div className="flex items-center gap-4">
          <h2 className="font-headline font-black text-3xl uppercase tracking-tighter text-primary">
            Experience
          </h2>
          <div className="h-0.5 grow bg-primary/15" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-12 items-start">
          {/* Court Type Badge */}
          <div className="md:col-span-2 space-y-4">
            <div className="inline-block bg-secondary/10 border border-secondary/30 px-4 py-2 rounded-sm">
              <p className="text-secondary font-headline font-bold text-sm uppercase tracking-widest">
                {venue.type}
              </p>
            </div>
            <p className="text-primary font-body text-sm leading-relaxed">
              Professional-grade facility designed for athletes and enthusiasts.
            </p>
          </div>

          {/* Description */}
          <div className="md:col-span-3 space-y-6 text-primary leading-relaxed font-body">
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
      <section className="space-y-8">
        <div className="flex items-center gap-4">
          <h2 className="font-headline font-black text-3xl uppercase tracking-tighter text-primary">
            Amenities
          </h2>
          <div className="h-0.5 grow bg-primary/15" />
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {venue.amenities && venue.amenities.length > 0
            ? venue.amenities.slice(0, 4).map((amenity) => (
                <div
                  key={amenity.id}
                  className="group p-8 border border-primary/10 bg-primary/5 hover:bg-primary hover:text-secondary transition-all duration-300 rounded-sm cursor-pointer"
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
                  className="group p-8 border border-primary/10 bg-primary/5 hover:bg-primary hover:text-secondary transition-all duration-300 rounded-sm"
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
