"use client";

import { Button } from "@/components/ui/button";
import { AlertCircle } from "lucide-react";
import { format } from "date-fns";

interface VenueBookingSidebarProps {
  selectedDate?: Date;
  selectedSlot?: string;
  basePrice: number | string;
  totalPrice?: number;
  onBookNow?: () => void;
  isLoading?: boolean;
}

export default function VenueBookingSidebar({
  selectedDate,
  selectedSlot,
  basePrice,
  totalPrice = 0,
  onBookNow,
  isLoading = false,
}: VenueBookingSidebarProps) {
  const priceValue =
    typeof basePrice === "string" ? parseFloat(basePrice) : basePrice;
  const taxAmount = (priceValue * 0.18).toFixed(2);
  const total = totalPrice || priceValue + parseFloat(taxAmount);

  return (
    <div className="lg:col-span-4">
      <div className="sticky top-32 bg-primary p-10 rounded-sm shadow-2xl space-y-10">
        {/* Header */}
        <div className="flex justify-between items-start">
          <div>
            <p className="text-white/60 text-xs uppercase tracking-widest font-bold">
              Booking Summary
            </p>
            <h3 className="text-white font-headline font-bold text-xl uppercase mt-1">
              Reservation
            </h3>
          </div>
          <div className="flex items-center gap-1.5 bg-secondary/20 border border-secondary/40 px-3 py-1.5 rounded-sm">
            <AlertCircle className="w-4 h-4 text-secondary" />
            <span className="text-secondary font-bold text-xs">INFO</span>
          </div>
        </div>

        {/* Selected Info */}
        <div className="space-y-4">
          {/* Selected Date */}
          <div className="p-5 bg-white/5 border-l-4 border-secondary group hover:bg-white/10 transition-colors">
            <p className="text-white/60 font-bold text-xs uppercase tracking-widest group-hover:text-white">
              Selected Date
            </p>
            <p className="text-white font-headline font-bold text-lg mt-2">
              {selectedDate
                ? format(selectedDate, "MMM dd, yyyy")
                : "Not Selected"}
            </p>
          </div>

          {/* Selected Time */}
          <div className="p-5 bg-white/5 border-l-4 border-secondary group hover:bg-white/10 transition-colors">
            <p className="text-white/60 font-bold text-xs uppercase tracking-widest group-hover:text-white">
              Selected Time
            </p>
            <p className="text-white font-headline font-bold text-lg mt-2">
              {selectedSlot || "Not Selected"}
            </p>
          </div>
        </div>

        {/* Price Breakdown */}
        <div className="space-y-4 pt-6 border-t border-white/10">
          <div className="flex justify-between text-white/60 font-medium text-xs uppercase tracking-widest">
            <span>Base Price</span>
            <span>₹{priceValue.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-white/60 font-medium text-xs uppercase tracking-widest">
            <span>Tax (18%)</span>
            <span>₹{taxAmount}</span>
          </div>
          <div className="pt-6 border-t border-white/20 flex justify-between items-end">
            <span className="text-white/60 font-bold text-xs uppercase tracking-widest">
              Total Amount
            </span>
            <span className="text-secondary font-headline font-black text-3xl">
              ₹{total.toFixed(2)}
            </span>
          </div>
        </div>

        {/* CTA Button */}
        <div className="space-y-4">
          <button
            onClick={onBookNow}
            disabled={isLoading || !selectedDate || !selectedSlot}
            className="w-full bg-secondary text-primary font-headline font-black py-6 uppercase text-sm tracking-[0.25em] shadow-lg hover:bg-[#d4ff00] transition-all transform active:scale-95 rounded-sm disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? "Booking..." : "Book Now"}
          </button>
          <p className="text-white/50 font-body text-xs text-center leading-relaxed">
            TODO: Booking functionality will be implemented next. Select a date
            and time to prepare your reservation.
          </p>
        </div>
      </div>
    </div>
  );
}
