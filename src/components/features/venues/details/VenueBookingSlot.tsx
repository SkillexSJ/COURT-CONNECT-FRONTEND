"use client";

import { CourtSlotTemplate } from "@/types/court.types";
interface VenueBookingSlotProps {
  slot: CourtSlotTemplate;
  date: Date;
  isAvailable?: boolean;
  isSelected?: boolean;
  onSelect?: (slot: CourtSlotTemplate) => void;
  price?: number;
}

export default function VenueBookingSlot({
  slot,
  date,
  isAvailable = true,
  isSelected = false,
  onSelect,
  price = 50,
}: VenueBookingSlotProps) {
  const startHour = Math.floor(slot.startMinute / 60);
  const startMin = slot.startMinute % 60;
  const endHour = Math.floor(slot.endMinute / 60);
  const endMin = slot.endMinute % 60;

  const timeDisplay = `${startHour.toString().padStart(2, "0")}:${startMin.toString().padStart(2, "0")} - ${endHour.toString().padStart(2, "0")}:${endMin.toString().padStart(2, "0")}`;

  const handleSelect = () => {
    if (isAvailable && onSelect) {
      onSelect(slot);
    }
  };

  if (isSelected) {
    return (
      <button
        onClick={handleSelect}
        className="rounded-sm border-2 border-primary bg-primary px-2 py-3 text-center font-headline text-xs font-bold tracking-wide text-secondary uppercase shadow-lg transition-shadow hover:shadow-xl sm:py-5 sm:text-sm sm:tracking-widest"
      >
        {timeDisplay}
        <div className="text-xs mt-1 opacity-90">${price}</div>
      </button>
    );
  }

  if (!isAvailable) {
    return (
      <button
        disabled
        className="cursor-not-allowed rounded-sm border border-primary/10 bg-surface-variant/50 px-2 py-3 text-center font-headline text-xs font-bold tracking-wide text-primary uppercase opacity-40 line-through sm:py-5 sm:text-sm sm:tracking-widest"
      >
        {timeDisplay}
        <div className="text-xs mt-1 opacity-90">Full</div>
      </button>
    );
  }

  return (
    <button
      onClick={handleSelect}
      className="group rounded-sm border border-primary/20 px-2 py-3 text-center font-headline text-xs font-bold tracking-wide text-primary uppercase transition-all hover:border-primary hover:bg-primary/10 hover:text-primary sm:py-5 sm:text-sm sm:tracking-widest"
    >
      <div>{timeDisplay}</div>
      <div className="text-xs text-primary/70 group-hover:text-primary mt-1">
        ${price}
      </div>
    </button>
  );
}
