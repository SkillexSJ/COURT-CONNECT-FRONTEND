import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { CourtAmenity } from "@/types/court.types";

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

type Props = {
  amenities: CourtAmenity[];
  isLoading: boolean;
  selectedAmenityIds: string[];
  onToggleAmenity: (amenityId: string) => void;
};

const FALLBACK_AMENITIES: Array<{ name: string; icon: string }> = [
  { name: "Free WiFi", icon: "wifi" },
  { name: "Parking", icon: "parking" },
  { name: "Changing Room", icon: "shower" },
  { name: "Cafe", icon: "coffee" },
  { name: "Equipment Rental", icon: "dumbbell" },
  { name: "Wheelchair Access", icon: "accessibility" },
];

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

export function AmenitiesSection({
  amenities,
  isLoading,
  selectedAmenityIds,
  onToggleAmenity,
}: Props) {
  return (
    <Card className="rounded-sm border-border bg-card">
      <CardHeader>
        <CardTitle className="font-heading text-xl font-black uppercase tracking-tight text-primary">
          III. Amenities
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <LoadingSpinner
            label="Loading amenities..."
            className="text-sm text-muted-foreground"
          />
        ) : amenities.length === 0 ? (
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              No admin amenities found yet. Showing example amenities as
              fallback.
            </p>
            <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3">
              {FALLBACK_AMENITIES.map((amenity) => (
                <div
                  key={amenity.name}
                  className="border border-dashed border-border bg-background px-4 py-4"
                >
                  <div className="mb-2 flex items-center gap-2">
                    <AmenityIcon icon={amenity.icon} className="size-4" />
                    <p className="font-heading text-sm font-bold uppercase tracking-wide">
                      {amenity.name}
                    </p>
                  </div>
                  <p className="text-[11px] text-muted-foreground">
                    Demo fallback only
                  </p>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3">
            {amenities.map((amenity) => {
              const selected = selectedAmenityIds.includes(amenity.id);
              return (
                <button
                  type="button"
                  key={amenity.id}
                  onClick={() => onToggleAmenity(amenity.id)}
                  className={`border px-4 py-4 text-left transition-colors ${
                    selected
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-border bg-background hover:border-primary/50"
                  }`}
                >
                  <div className="mb-2 flex items-center gap-2">
                    <AmenityIcon icon={amenity.icon} className="size-4" />
                    <p className="font-heading text-sm font-bold uppercase tracking-wide">
                      {amenity.name}
                    </p>
                  </div>
                  <p className="font-heading text-sm font-bold uppercase tracking-wide">
                    {selected ? "Selected" : "Tap to select"}
                  </p>
                </button>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
