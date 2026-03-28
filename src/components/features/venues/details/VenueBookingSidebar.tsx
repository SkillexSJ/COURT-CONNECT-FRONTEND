"use client";

import { format } from "date-fns";

interface VenueBookingSidebarProps {
  selectedDate?: Date;
  selectedSlot?: string;
  basePrice: number | string;
  totalPrice?: number;
  couponCode?: string;
  onCouponCodeChange?: (value: string) => void;
  onApplyCoupon?: () => void;
  onRemoveCoupon?: () => void;
  appliedCouponCode?: string | null;
  discountAmount?: number;
  isApplyingCoupon?: boolean;
  onBookNow?: () => void;
  isLoading?: boolean;
}

export default function VenueBookingSidebar({
  selectedDate,
  selectedSlot,
  basePrice,
  totalPrice = 0,
  couponCode = "",
  onCouponCodeChange,
  onApplyCoupon,
  onRemoveCoupon,
  appliedCouponCode,
  discountAmount = 0,
  isApplyingCoupon = false,
  onBookNow,
  isLoading = false,
}: VenueBookingSidebarProps) {

  // HELPERS
  const priceValue =
    typeof basePrice === "string" ? parseFloat(basePrice) : basePrice;
  const hasProvidedDiscountedBase =
    typeof totalPrice === "number" && totalPrice > 0;
  const total = hasProvidedDiscountedBase
    ? totalPrice
    : Math.max(0, priceValue - discountAmount);

  return (
    <div className="lg:col-span-4">
      <div className="space-y-7 rounded-sm bg-primary p-5 shadow-2xl sm:p-7 lg:sticky lg:top-32 lg:space-y-10 lg:p-10">
        {/* Header */}
        <div className="flex justify-between items-start">
          <div>
            <p className="text-white/60 text-xs uppercase tracking-widest font-bold">
              Booking Summary
            </p>
            <h3 className="mt-1 font-headline text-lg font-bold text-white uppercase sm:text-xl">
              Reservation
            </h3>
          </div>
        </div>

        {/* Selected Info */}
        <div className="space-y-4">
          {/* Selected Date */}
          <div className="group border-l-4 border-secondary bg-white/5 p-4 transition-colors hover:bg-white/10 sm:p-5">
            <p className="text-white/60 font-bold text-xs uppercase tracking-widest group-hover:text-white">
              Selected Date
            </p>
            <p className="mt-2 font-headline text-base font-bold text-white sm:text-lg">
              {selectedDate
                ? format(selectedDate, "MMM dd, yyyy")
                : "Not Selected"}
            </p>
          </div>

          {/* Selected Time */}
          <div className="group border-l-4 border-secondary bg-white/5 p-4 transition-colors hover:bg-white/10 sm:p-5">
            <p className="text-white/60 font-bold text-xs uppercase tracking-widest group-hover:text-white">
              Selected Time
            </p>
            <p className="mt-2 font-headline text-base font-bold text-white sm:text-lg">
              {selectedSlot || "Not Selected"}
            </p>
          </div>
        </div>

        {/* Price Breakdown */}
        <div className="space-y-4 border-t border-white/10 pt-5 sm:pt-6">
          <div className="flex justify-between text-white/60 font-medium text-xs uppercase tracking-widest">
            <span>Base Price</span>
            <span>${priceValue.toFixed(2)}</span>
          </div>
          {appliedCouponCode ? (
            <div className="flex justify-between text-secondary font-medium text-xs uppercase tracking-widest">
              <span>Discount ({appliedCouponCode})</span>
              <span>-${discountAmount.toFixed(2)}</span>
            </div>
          ) : null}
          <div className="flex items-end justify-between border-t border-white/20 pt-5 sm:pt-6">
            <span className="text-white/60 font-bold text-xs uppercase tracking-widest">
              Total Amount
            </span>
            <span className="font-headline text-2xl font-black text-secondary sm:text-3xl">
              ${total.toFixed(2)}
            </span>
          </div>
        </div>

        <div className="space-y-3 border-t border-white/10 pt-5 sm:pt-6">
          <p className="text-white/60 font-bold text-xs uppercase tracking-widest">
            Promo Code
          </p>
          <div className="flex gap-2">
            <input
              value={couponCode}
              onChange={(event) => onCouponCodeChange?.(event.target.value)}
              placeholder="Enter code"
              className="h-11 w-full rounded-sm border border-white/15 bg-white/5 px-3 text-sm uppercase tracking-[0.12em] text-white placeholder:text-white/35"
            />
            <button
              type="button"
              disabled={isApplyingCoupon || !couponCode.trim()}
              onClick={onApplyCoupon}
              className="rounded-sm border border-secondary/60 px-4 text-xs font-bold uppercase tracking-[0.12em] text-secondary transition-colors hover:bg-secondary/15 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isApplyingCoupon ? "..." : "Apply"}
            </button>
          </div>

          {appliedCouponCode ? (
            <div className="flex items-center justify-between rounded-sm border border-secondary/30 bg-secondary/10 px-3 py-2 text-xs font-semibold uppercase tracking-widest text-secondary">
              <span>{appliedCouponCode} applied</span>
              <button
                type="button"
                onClick={onRemoveCoupon}
                className="text-secondary underline-offset-2 hover:underline"
              >
                Remove
              </button>
            </div>
          ) : null}
        </div>

        {/* CTA Button */}
        <div className="space-y-4">
          <button
            onClick={onBookNow}
            disabled={isLoading || !selectedDate || !selectedSlot}
            className="w-full rounded-sm bg-secondary py-4 text-sm font-headline font-black tracking-[0.2em] text-primary shadow-lg transition-all hover:bg-secondary/80 active:scale-95 disabled:cursor-not-allowed disabled:opacity-50 sm:py-5 sm:tracking-[0.25em]"
          >
            {isLoading ? "Booking..." : "Book Now"}
          </button>
        </div>
      </div>
    </div>
  );
}
