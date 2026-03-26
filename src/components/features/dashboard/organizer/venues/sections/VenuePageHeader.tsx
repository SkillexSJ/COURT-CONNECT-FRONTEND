import Image from "next/image";

import { Badge } from "@/components/ui/badge";

export function VenuePageHeader() {
  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_auto] lg:items-end">
      <div>
        <h1 className="font-heading text-4xl font-black leading-[0.95] text-primary uppercase md:text-6xl">
          Court Architecture
          <span className="ml-3 text-transparent [text-stroke:1px_hsl(var(--primary))] [-webkit-text-stroke:1px_hsl(var(--primary))]">
            &amp; Slots
          </span>
        </h1>
        <p className="mt-4 max-w-2xl text-sm text-muted-foreground md:text-base">
          Define your court identity, configure amenities, and create slot
          templates for bookings.
        </p>
      </div>
    </div>
  );
}
