"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { useEffect, useState, Suspense } from "react";
import { CheckCircle2, Clock3, ReceiptText, AlertCircle, CreditCard, XCircle } from "lucide-react";
import { BookingService } from "@/service/booking.service";
import { Booking } from "@/types/booking.types";
import Loading from "@/app/loading";
import { toast } from "sonner";
import QRCode from "react-qr-code";

import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

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

  const isPaid = booking.status === "PAID" || booking.status === "COMPLETED";
  const isCancelled = booking.status === "CANCELLED";
  const isPending = booking.status === "PENDING";

  return (
    <main className="mx-auto mt-10 w-full max-w-6xl bg-background py-8 sm:py-10 lg:py-14">
      <div className="mx-auto w-full max-w-4xl px-4 sm:px-6 lg:px-8">
        <div className="overflow-hidden rounded-sm border border-border bg-card shadow-md">
          <div className="bg-primary px-5 py-8 text-primary-foreground sm:px-8 sm:py-10">
            <div className="flex flex-col items-center gap-5 text-center">
              <div className="rounded-full border border-primary-foreground/30 bg-primary-foreground/10 p-3">
                {isPaid ? (
                  <CheckCircle2 className="h-10 w-10 text-secondary" />
                ) : isCancelled ? (
                  <XCircle className="h-10 w-10 text-destructive" />
                ) : (
                  <Clock3 className="h-10 w-10 text-amber-400" />
                )}
              </div>

              <div className="space-y-2">
                <h1 className="font-heading text-3xl font-black uppercase tracking-tight text-white sm:text-4xl">
                  {isPaid
                    ? "Payment Successful!"
                    : isCancelled
                      ? "Booking Cancelled"
                      : "Payment Pending!"}
                </h1>
                <p className="mx-auto max-w-xl text-sm text-primary-foreground/80 sm:text-base">
                  {isPaid
                    ? "Your booking has been confirmed and payment is completed."
                    : isCancelled
                      ? "This booking has been cancelled and is no longer valid."
                      : "Your booking is reserved, but payment has not been completed yet."}
                </p>
              </div>

              <div className="mt-4 grid w-full max-w-2xl grid-cols-1 gap-3 text-left sm:grid-cols-3">
                <div className="rounded-sm border border-primary-foreground/20 bg-primary-foreground/8 px-3 py-2">
                  <p className="text-[10px] uppercase tracking-[0.16em] text-primary-foreground/70">
                    Status
                  </p>
                  <p
                    className={`mt-1 font-heading text-base font-black ${isPaid ? "text-secondary" : isCancelled ? "text-destructive" : "text-amber-400"}`}
                  >
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
            <div className="flex flex-col gap-4">
              {isPaid && booking && (
                <div className="flex w-full flex-col items-center gap-3 rounded-sm border border-border bg-card p-5 shadow-sm">
                  <p className="text-center text-[10px] font-bold uppercase tracking-[0.2em] text-primary/60">
                    Your Digital Ticket
                  </p>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <button className="flex w-full items-center justify-center gap-2 rounded-sm bg-primary px-6 py-3 font-heading text-sm font-black uppercase tracking-widest text-primary-foreground transition-all hover:scale-[1.02] hover:bg-primary/90 sm:w-fit">
                        <ReceiptText className="h-4 w-4" />
                        Show QR Code
                      </button>
                    </AlertDialogTrigger>
                    
                    <AlertDialogContent className="flex w-[90%] max-w-sm flex-col items-center rounded-sm border-2 border-primary bg-background p-6 sm:p-8">
                      <AlertDialogHeader className="w-full space-y-2 text-center">
                        <AlertDialogTitle className="w-full text-center font-heading text-2xl font-black uppercase tracking-tight text-primary">
                          Entry Ticket
                        </AlertDialogTitle>
                        <AlertDialogDescription className="w-full text-center text-sm text-muted-foreground">
                          Please present this QR code to the organizer or host when entering the court.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      
                      <div className="my-6 flex w-fit flex-col items-center gap-2 rounded-md border border-border bg-white p-4 shadow-inner">
                        <QRCode
                          value={booking.id}
                          size={220}
                          style={{ height: "auto", maxWidth: "100%", width: "100%" }}
                          viewBox={`0 0 220 220`}
                        />
                      </div>
                      
                      <AlertDialogFooter className="flex w-full flex-col gap-2 sm:flex-row sm:justify-center">
                        <AlertDialogCancel className="w-full rounded-sm border border-secondary font-heading font-bold uppercase tracking-widest text-secondary transition-colors hover:bg-secondary hover:text-white sm:w-full">
                          Close Ticket
                        </AlertDialogCancel>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                  <p className="mt-1 text-center text-[10px] uppercase text-muted-foreground">
                    Required for entry
                  </p>
                </div>
              )}

              {isPaid ? (
                <div className="h-fit rounded-sm border border-secondary/40 bg-secondary/15 p-4">
                  <p className="text-sm text-primary">
                    <span className="font-bold">Note:</span> Your booking is now
                    confirmed. Any older pending bookings from previous attempts
                    will auto-expire after 24 hours.
                  </p>
                </div>
              ) : isPending ? (
                <div className="h-fit rounded-sm border border-amber-300 bg-amber-50 p-4">
                  <p className="text-sm text-amber-800">
                    <span className="font-bold">Action Required:</span> You need to
                    finish your payment to secure this reservation before it expires.
                  </p>
                </div>
              ) : (
                <div className="h-fit rounded-sm border border-destructive/40 bg-destructive/10 p-4">
                  <p className="text-sm text-destructive">
                    <span className="font-bold">Cancelled:</span> This booking can
                    no longer be paid for or used.
                  </p>
                </div>
              )}
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
                    label={isPaid ? "Amount Paid" : "Amount Due"}
                    value={`USD ${Number(booking.totalAmount).toFixed(2)}`}
                    className="sm:col-span-2"
                    emphasized
                  />
                </div>
              </section>
            )}
          </div>

          <div className="space-y-4 border-t border-border px-5 py-6 sm:px-8 sm:py-8">
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {isPending ? (
                <Link
                  href={`/checkout?bookingId=${booking.id}`}
                  className="inline-flex items-center justify-center gap-2 rounded-sm bg-primary px-4 py-3 text-center font-heading text-sm font-black uppercase tracking-widest text-primary-foreground transition-colors hover:bg-primary/90"
                >
                  <CreditCard className="h-4 w-4" />
                  Complete Payment
                </Link>
              ) : (
                <Link
                  href="/dashboard/bookings"
                  className="inline-flex items-center justify-center gap-2 rounded-sm bg-primary px-4 py-3 text-center font-heading text-sm font-black uppercase tracking-widest text-primary-foreground transition-colors hover:bg-primary/90"
                >
                  View My Bookings
                </Link>
              )}

              <Link
                href="/"
                className="inline-flex items-center justify-center gap-2 rounded-sm border border-secondary bg-secondary px-4 py-3 text-center font-heading text-sm font-black uppercase tracking-widest text-primary transition-colors hover:bg-secondary/90"
              >
                Back to Home
              </Link>
            </div>

            {isPaid && (
              <p className="mt-4 text-center text-xs text-muted-foreground">
                A confirmation email has been sent to your registered address.
              </p>
            )}
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
