"use client";

import { CourtSlotTemplate } from "@/types/court.types";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";

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
        className="py-5 border-2 border-primary text-center font-headline font-bold text-sm bg-primary text-secondary rounded-sm uppercase tracking-widest shadow-lg hover:shadow-xl transition-shadow"
      >
        {timeDisplay}
        <div className="text-xs mt-1 opacity-90">₹{price}</div>
      </button>
    );
  }

  if (!isAvailable) {
    return (
      <button
        disabled
        className="py-5 border border-primary/10 text-center font-headline font-bold text-sm bg-surface-variant/50 opacity-40 cursor-not-allowed rounded-sm uppercase tracking-widest line-through"
      >
        {timeDisplay}
        <div className="text-xs mt-1 opacity-90">Full</div>
      </button>
    );
  }

  return (
    <button
      onClick={handleSelect}
      className="py-5 border border-primary/20 text-center font-headline font-bold text-sm text-primary hover:border-primary hover:bg-primary/10 hover:text-primary transition-all rounded-sm uppercase tracking-widest group"
    >
      <div>{timeDisplay}</div>
      <div className="text-xs text-primary/70 group-hover:text-primary mt-1">
        ₹{price}
      </div>
    </button>
  );
}
