import Image from "next/image";

import { Badge } from "@/components/ui/badge";

export function VenuePageHeader() {
  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_auto] lg:items-end">
      <div>
        <Badge className="mb-3 rounded-sm bg-primary px-2.5 py-1 text-[10px] font-black tracking-widest text-secondary uppercase">
          Step 2 of 3
        </Badge>
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

      <div className="hidden h-28 w-36 overflow-hidden border border-border md:block">
        <Image
          src="https://images.unsplash.com/photo-1517649763962-0c623066013b?w=600&h=600&fit=crop"
          alt="Venue architectural reference"
          width={600}
          height={600}
          className="h-full w-full object-cover"
        />
      </div>
    </div>
  );
}
