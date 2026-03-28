"use client";

import { useEffect, useMemo, useState } from "react";
import {
  PaymentElement,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js";
import { BookingService } from "@/service/booking.service";
import type { Booking } from "@/types/booking.types";
import { CheckoutOrderPanel } from "./CheckoutOrderPanel";
import { CheckoutSidebarPanel } from "./CheckoutSidebarPanel";
import Loading from "@/app/loading";
import { Info } from "lucide-react";

type CheckoutPaymentContentProps = {
  bookingId: string;
};

const hasBookingExpired = (expiresAt?: string | null) => {
  if (!expiresAt) return false;
  return new Date(expiresAt).getTime() <= Date.now();
};

export function CheckoutPaymentContent({
  bookingId,
}: CheckoutPaymentContentProps) {
  const stripe = useStripe();
  const elements = useElements();

  // STATE
  const [booking, setBooking] = useState<Booking | null>(null);
  const [loadingBooking, setLoadingBooking] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // LOAD BOOKING DETAILS
  useEffect(() => {
    const loadBooking = async () => {
      try {
        setLoadingBooking(true);
        setError(null);
        const data = await BookingService.getBookingById(bookingId);
        setBooking(data);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to load booking details",
        );
      } finally {
        setLoadingBooking(false);
      }
    };

    loadBooking();
  }, [bookingId]);

  // DERIVED STATE
  const isExpired = useMemo(
    () => hasBookingExpired(booking?.expiresAt),
    [booking?.expiresAt],
  );

  const totalAmount = useMemo(
    () => Number(booking?.totalAmount ?? 0),
    [booking?.totalAmount],
  );

  // PAYMENT SUBMISSION HANDLER
  const onPayNow = async (event: React.SyntheticEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!stripe || !elements || isExpired) {
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      const latestBooking = await BookingService.getBookingById(bookingId);
      setBooking(latestBooking);

      if (hasBookingExpired(latestBooking.expiresAt)) {
        setError("This booking has expired. Please create a new booking.");
        return;
      }

      const submitResult = await elements.submit();
      if (submitResult.error) {
        setError(
          submitResult.error.message ?? "Unable to submit payment details",
        );
        return;
      }

      const result = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/checkout/success?bookingId=${bookingId}`,
        },
      });

      if (result.error) {
        setError(result.error.message ?? "Payment failed");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unexpected payment error");
    } finally {
      setSubmitting(false);
    }
  };

  if (loadingBooking) {
    return <Loading />;
  }

  if (!booking) {
    return (
      <div className="rounded-sm border border-red-300 bg-red-50 p-4">
        <p className="text-sm font-semibold text-red-700">
          Booking was not found.
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={onPayNow}
      className="grid grid-cols-1 gap-10 lg:grid-cols-[minmax(0,1fr)_420px] lg:gap-16"
    >
      <div className="space-y-10">
        <header className="space-y-3">
          <h1 className="text-5xl font-heading font-black uppercase tracking-tight text-primary md:text-6xl">
            Secure Checkout
          </h1>
          <p className="text-sm font-medium tracking-wide text-primary/65">
            Finalize your elite booking experience.
          </p>
        </header>

        <CheckoutOrderPanel booking={booking} isExpired={isExpired} />

        <section className="space-y-8">
          <div className="flex items-center gap-2">
            <span className="h-1 w-8 bg-secondary" />
            <h2 className="text-[11px] font-heading font-black uppercase tracking-[0.2em] text-primary/65">
              Payment Method
            </h2>
          </div>

          <div className="flex items-center justify-between border-2 border-primary bg-white px-5 py-4">
            <span className="font-heading text-sm font-bold uppercase tracking-[0.16em] text-primary">
              Card Payment
            </span>
            <span className="h-3.5 w-3.5 rounded-full border-[3px] border-primary bg-secondary" />
          </div>

          <div className="space-y-3 rounded-sm border border-primary/15 bg-card p-5">
            <div className="mb-4 flex items-start gap-3 rounded-sm border border-blue-200 bg-blue-50 p-4 text-sm text-blue-800">
              <Info className="mt-0.5 h-4 w-4 shrink-0 text-blue-600" />
              <div>
                <p className="font-bold">Test Mode Active</p>
                <p className="mt-1 text-blue-700">
                  Please use the test card <span className="font-mono font-bold select-all tracking-widest">4242 4242 4242 4242</span> with any valid future date and any CVC (e.g., <span className="font-mono font-bold select-all">123</span>) to complete this demo payment.
                </p>
              </div>
            </div>

            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary/55">
              Card Details
            </p>
            {isExpired ? (
              <div className="rounded-sm border border-red-300 bg-red-50 p-4">
                <p className="text-sm font-semibold text-red-700">
                  Booking expired. You can not complete checkout for this
                  booking.
                </p>
              </div>
            ) : (
              <PaymentElement />
            )}
          </div>
        </section>

        {error && (
          <div className="rounded-sm border border-red-300 bg-red-50 p-4">
            <p className="text-sm font-semibold text-red-700">{error}</p>
          </div>
        )}
      </div>

      <CheckoutSidebarPanel
        totalAmount={totalAmount}
        loading={submitting}
        isExpired={isExpired}
      />
    </form>
  );
}
