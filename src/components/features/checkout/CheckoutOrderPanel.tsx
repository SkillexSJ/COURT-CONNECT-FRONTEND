import Image from "next/image";
import type { Booking } from "@/types/booking.types";

type CheckoutOrderPanelProps = {
  booking: Booking;
  isExpired: boolean;
};

// CONSTANTS & HELPERS
const toTime = (minutes: number) => {
  const hour = Math.floor(minutes / 60)
    .toString()
    .padStart(2, "0");
  const minute = (minutes % 60).toString().padStart(2, "0");
  return `${hour}:${minute}`;
};

const getSlotRange = (booking: Booking) => {
  if (!booking.slots || booking.slots.length === 0) {
    return "N/A";
  }

  const starts = booking.slots.map((slot) => slot.startMinute);
  const ends = booking.slots.map((slot) => slot.endMinute);
  return `${toTime(Math.min(...starts))} - ${toTime(Math.max(...ends))}`;
};

export function CheckoutOrderPanel({
  booking,
  isExpired,
}: CheckoutOrderPanelProps) {
  // const venueImageUrl =
  //   booking.court?.media?.find((media) => media.isPrimary)?.url ||
  //   booking.court?.media?.[0]?.url ||
  //   VENUE_FALLBACK_IMAGE;

  return (
    <section className="space-y-8">
      <div className="flex items-center gap-2">
        <span className="h-1 w-8 bg-secondary" />
        <h2 className="text-[11px] font-heading font-black uppercase tracking-[0.2em] text-primary/65">
          Order Summary
        </h2>
      </div>

      {isExpired && (
        <div className="rounded-sm border border-red-300 bg-red-50 p-4">
          <p className="text-sm font-bold text-red-700">
            This booking has expired. Please create a new booking.
          </p>
        </div>
      )}

      <div className="grid grid-cols-1 gap-8 bg-card p-6 md:grid-cols-2">
        <div className="space-y-6">
          <div>
            <p className="mb-1 text-[10px] font-bold uppercase tracking-[0.2em] text-primary/55">
              Venue
            </p>
            <p className="text-3xl font-heading font-black tracking-tight text-primary">
              {booking.court?.name ?? "Selected Court"}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="mb-1 text-[10px] font-bold uppercase tracking-[0.2em] text-primary/55">
                Date
              </p>
              <p className="font-heading font-bold text-primary">
                {new Date(booking.bookingDate).toLocaleDateString()}
              </p>
            </div>
            <div>
              <p className="mb-1 text-[10px] font-bold uppercase tracking-[0.2em] text-primary/55">
                Time
              </p>
              <p className="font-heading font-bold text-primary">
                {getSlotRange(booking)}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="mb-1 text-[10px] font-bold uppercase tracking-[0.2em] text-primary/55">
                Booking
              </p>
              <p className="font-heading font-bold text-primary">
                {booking.bookingCode}
              </p>
            </div>
            <div>
              <p className="mb-1 text-[10px] font-bold uppercase tracking-[0.2em] text-primary/55">
                Hold
              </p>
              <p
                className={`font-heading font-bold ${
                  isExpired ? "text-red-700" : "text-primary"
                }`}
              >
                {isExpired ? "Expired" : "Expires if unpaid"}
              </p>
            </div>
          </div>
        </div>

        <div className="relative min-h-56 overflow-hidden bg-muted">
          <Image
            src={"/image2.png"}
            alt={booking.court?.name ?? "Venue image"}
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-black/20" />
          <div className="absolute right-3 top-3 bg-secondary px-2 py-1 text-[10px] font-black uppercase tracking-tight text-primary">
            Verified
          </div>
        </div>
      </div>
    </section>
  );
}
