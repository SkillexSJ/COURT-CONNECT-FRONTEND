"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { useEffect, useState, Suspense } from "react";
import { CheckCircle2, Clock3, ReceiptText, AlertCircle } from "lucide-react";
import { BookingService } from "@/service/booking.service";
import { Booking } from "@/types/booking.types";
import Loading from "@/app/loading";
import { toast } from "sonner";

const getStatusLabel = (status?: Booking["status"]) => {
  if (status === "PAID") return "Payment Confirmed";
  if (status === "COMPLETED") return "Completed";
  if (status === "CANCELLED") return "Cancelled";
  return "Pending";
};

function SuccessContent() {
  const searchParams = useSearchParams();
  const bookingId = searchParams.get("bookingId");

  // STATES
  const [booking, setBooking] = useState<Booking | null>(null);
  const [loading, setLoading] = useState(true);

  // EFFECT - FETCH BOOKING DETAILS
  useEffect(() => {
    const fetchBooking = async () => {
      if (!bookingId) {
        setLoading(false);
        return;
      }

      try {
        const data = await BookingService.getBookingById(bookingId);
        setBooking(data);
      } catch (error) {
        toast.error("Failed to fetch booking");
      } finally {
        setLoading(false);
      }
    };

    fetchBooking();
  }, [bookingId]);

  if (loading) {
    return <Loading></Loading>;
  }

  if (!bookingId || !booking) {
    return (
      <main className="flex min-h-[60vh] flex-col items-center justify-center py-10">
        <AlertCircle className="mb-4 h-16 w-16 text-destructive" />
        <h1 className="mb-2 font-heading text-3xl font-black uppercase text-foreground">
          Booking Not Found
        </h1>
        <p className="mb-6 text-muted-foreground">
          We couldn't track down the details for this booking.
        </p>
        <Link
          href="/"
          className="rounded-sm bg-primary px-6 py-3 font-heading text-sm font-black uppercase tracking-widest text-primary-foreground transition-colors hover:bg-primary/90"
        >
          Return to Home
        </Link>
      </main>
    );
  }

  return (
    <main className="w-full max-w-6xl mx-auto mt-10 bg-background py-8 sm:py-10 lg:py-14">
      <div className="mx-auto w-full max-w-4xl px-4 sm:px-6 lg:px-8">
        <div className="overflow-hidden rounded-sm border border-border bg-card shadow-md">
          <div className="bg-primary px-5 py-8 text-primary-foreground sm:px-8 sm:py-10">
            <div className="flex flex-col items-center gap-5 text-center">
              <div className="rounded-full border border-primary-foreground/30 bg-primary-foreground/10 p-3">
                <CheckCircle2 className="h-10 w-10 text-secondary" />
              </div>

              <div className="space-y-2">
                <h1 className="font-heading text-3xl font-black uppercase tracking-tight sm:text-4xl">
                  Payment Successful!
                </h1>
                <p className="mx-auto max-w-xl text-sm text-primary-foreground/80 sm:text-base">
                  Your booking has been confirmed and payment is completed.
                </p>
              </div>

              <div className="grid w-full max-w-2xl grid-cols-1 gap-3 text-left sm:grid-cols-3">
                <div className="rounded-sm border border-primary-foreground/20 bg-primary-foreground/8 px-3 py-2">
                  <p className="text-[10px] uppercase tracking-[0.16em] text-primary-foreground/70">
                    Status
                  </p>
                  <p className="mt-1 font-heading text-base font-black text-secondary">
                    {getStatusLabel(booking?.status)}
                  </p>
                </div>
                <div className="rounded-sm border border-primary-foreground/20 bg-primary-foreground/8 px-3 py-2">
                  <p className="text-[10px] uppercase tracking-[0.16em] text-primary-foreground/70">
                    Booking
                  </p>
                  <p className="mt-1 font-heading text-base font-black">
                    {booking?.bookingCode ?? "Pending"}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6 px-5 py-6 sm:px-8 sm:py-8 lg:grid-cols-[1fr_2fr]">
            <div className="rounded-sm h-fit border border-secondary/40 bg-secondary/15 p-4">
              <p className="text-sm text-primary">
                <span className="font-bold">Note:</span> Your booking is now
                confirmed. Any older pending bookings from previous attempts
                will auto-expire after 24 hours.
              </p>
            </div>

            {booking && (
              <section className="space-y-4 rounded-sm border border-border bg-background p-4 sm:p-5">
                <div className="flex items-center gap-2">
                  <ReceiptText className="h-4 w-4 text-primary" />
                  <h2 className="font-heading text-lg font-black text-primary">
                    Booking Details
                  </h2>
                </div>

                <div className="grid grid-cols-1 gap-3 text-sm sm:grid-cols-2">
                  <DetailItem
                    label="Booking Code"
                    value={booking.bookingCode}
                    mono
                  />
                  <DetailItem
                    label="Court"
                    value={booking.court?.name ?? "N/A"}
                  />
                  <DetailItem
                    label="Date"
                    value={new Date(booking.bookingDate).toLocaleDateString(
                      "en-US",
                      {
                        weekday: "long",
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      },
                    )}
                    className="sm:col-span-2"
                  />

                  <div className="rounded-sm border border-border bg-card p-3 sm:col-span-2">
                    <p className="text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
                      Time Slots
                    </p>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {booking.slots?.map((slot) => {
                        const startHour = Math.floor(slot.startMinute / 60);
                        const startMin = slot.startMinute % 60;
                        const endHour = Math.floor(slot.endMinute / 60);
                        const endMin = slot.endMinute % 60;

                        return (
                          <span
                            key={slot.id}
                            className="rounded-none border border-border bg-muted px-2 py-1 font-mono text-xs font-semibold text-primary"
                          >
                            {startHour.toString().padStart(2, "0")}:
                            {startMin.toString().padStart(2, "0")} -{" "}
                            {endHour.toString().padStart(2, "0")}:
                            {endMin.toString().padStart(2, "0")}
                          </span>
                        );
                      })}
                    </div>
                  </div>

                  <DetailItem
                    label="Amount Paid"
                    value={`USD ${Number(booking.totalAmount).toFixed(2)}`}
                    className="sm:col-span-2"
                    emphasized
                  />
                </div>
              </section>
            )}
          </div>

          <div className="space-y-4 border-t border-border px-5 py-6 sm:px-8 sm:py-8">
            {booking && booking.status !== "PAID" && (
              <div className="inline-flex items-center gap-2 rounded-none border border-amber-300 bg-amber-50 px-3 py-2 text-sm font-bold text-amber-700">
                <Clock3 className="h-4 w-4" />
                Current status: {getStatusLabel(booking.status)}
              </div>
            )}

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <Link
                href="/dashboard/bookings"
                className="inline-flex items-center justify-center rounded-sm bg-primary px-4 py-3 text-center font-heading text-sm font-black uppercase tracking-widest text-primary-foreground transition-colors hover:bg-primary/90"
              >
                View My Bookings
              </Link>
              <Link
                href="/"
                className="inline-flex items-center justify-center rounded-sm border border-secondary bg-secondary px-4 py-3 text-center font-heading text-sm font-black uppercase tracking-widest text-primary transition-colors hover:bg-secondary/90"
              >
                Back to Home
              </Link>
            </div>

            <p className="text-center text-xs text-muted-foreground">
              A confirmation email has been sent to your registered address.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}

export default function SuccessPage() {
  return (
    <Suspense fallback={<Loading />}>
      <SuccessContent />
    </Suspense>
  );
}

// COMPONENT ITEM
function DetailItem({
  label,
  value,
  className,
  mono = false,
  emphasized = false,
}: {
  label: string;
  value: string;
  className?: string;
  mono?: boolean;
  emphasized?: boolean;
}) {
  return (
    <div className={className}>
      <div className="rounded-sm border bg-card p-3">
        <p className="text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
          {label}
        </p>
        <p
          className={`mt-1 text-sm font-bold text-primary ${mono ? "font-mono" : ""} ${emphasized ? "font-heading text-lg text-primary" : ""}`}
        >
          {value}
        </p>
      </div>
    </div>
  );
}
