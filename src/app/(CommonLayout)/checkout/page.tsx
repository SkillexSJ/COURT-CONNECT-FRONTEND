"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { CheckoutPaymentContent } from "@/components/features/checkout/CheckoutPaymentContent";
import { BookingService } from "@/service/booking.service";

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!,
);

export default function CheckoutPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const bookingId = searchParams.get("bookingId");
  const initRef = useRef(false);

  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [initializingPayment, setInitializingPayment] = useState(false);
  const [paymentInitError, setPaymentInitError] = useState<string | null>(null);

  useEffect(() => {
    if (initRef.current) return;
    initRef.current = true;

    if (!bookingId) {
      router.push("/");
    }
  }, [bookingId, router]);

  useEffect(() => {
    if (!bookingId) return;

    const initializePayment = async () => {
      try {
        setInitializingPayment(true);
        setPaymentInitError(null);
        const paymentData = await BookingService.initiatePayment({ bookingId });
        setClientSecret(paymentData.clientSecret);
      } catch (err) {
        setPaymentInitError(
          err instanceof Error ? err.message : "Failed to initialize payment",
        );
      } finally {
        setInitializingPayment(false);
      }
    };

    initializePayment();
  }, [bookingId]);

  if (!bookingId) {
    return null;
  }

  return (
    <main className="min-h-screen bg-background px-6 pb-20 pt-24 md:px-12">
      <div className="mx-auto max-w-375">
        {initializingPayment && (
          <div className="flex min-h-80 items-center justify-center">
            <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-secondary" />
          </div>
        )}

        {paymentInitError && (
          <div className="mx-auto max-w-3xl rounded-sm border border-red-300 bg-red-50 p-4">
            <p className="text-sm font-semibold text-red-700">
              {paymentInitError}
            </p>
          </div>
        )}

        {!initializingPayment && !paymentInitError && clientSecret && (
          <Elements
            stripe={stripePromise}
            options={{
              clientSecret,
              appearance: {
                theme: "stripe",
                variables: {
                  colorPrimary: "#012d1d",
                  colorBackground: "#f7f5ee",
                  colorText: "#151712",
                },
              },
            }}
          >
            <CheckoutPaymentContent bookingId={bookingId} />
          </Elements>
        )}
      </div>
    </main>
  );
}
