"use client";

import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useEffect, useState } from "react";
import { BookingService } from "@/service/booking.service";
import { Booking } from "@/types/booking.types";

export default function SuccessPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const bookingId = searchParams.get("bookingId");
  const [booking, setBooking] = useState<Booking | null>(null);
  const [loading, setLoading] = useState(true);

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
        console.error("Failed to fetch booking:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBooking();
  }, [bookingId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-secondary"></div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-surface py-20">
      <div className="max-w-2xl mx-auto px-6">
        {/* Success Card */}
        <div className="bg-white rounded-lg p-12 shadow-lg text-center space-y-8">
          {/* Success Icon */}
          <div className="flex justify-center">
            <div className="rounded-full bg-green-100 p-4">
              <svg
                className="w-12 h-12 text-green-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
          </div>

          {/* Header */}
          <div>
            <h1 className="font-headline font-black text-4xl uppercase tracking-tighter text-primary mb-2">
              Payment Successful!
            </h1>
            <p className="text-primary/60">
              Your booking has been confirmed and paid.
            </p>
          </div>

          {/* 24-Hour Hold Info */}
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg text-left">
            <p className="text-blue-700 text-sm">
              <strong>ℹ️ Note:</strong> Your booking is now confirmed. If you
              have any PENDING bookings from previous attempts, they will
              automatically expire after 24 hours.
            </p>
          </div>

          {/* Booking Details */}
          {booking && (
            <div className="space-y-6 text-left bg-primary/5 p-6 rounded-lg border border-primary/10">
              <h2 className="font-headline font-bold text-lg text-primary">
                Booking Details
              </h2>

              <div className="space-y-3 text-sm">
                <div className="flex justify-between pb-3 border-b border-primary/10">
                  <span className="text-primary/60">Booking Code:</span>
                  <span className="font-mono font-bold text-primary">
                    {booking.bookingCode}
                  </span>
                </div>

                <div className="flex justify-between pb-3 border-b border-primary/10">
                  <span className="text-primary/60">Court:</span>
                  <span className="font-bold text-primary">
                    {booking.court?.name}
                  </span>
                </div>

                <div className="flex justify-between pb-3 border-b border-primary/10">
                  <span className="text-primary/60">Date:</span>
                  <span className="font-bold text-primary">
                    {new Date(booking.bookingDate).toLocaleDateString("en-US", {
                      weekday: "long",
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </span>
                </div>

                <div className="flex justify-between pb-3 border-b border-primary/10">
                  <span className="text-primary/60">Time Slots:</span>
                  <div className="text-right">
                    {booking.slots?.map((slot) => {
                      const startHour = Math.floor(slot.startMinute / 60);
                      const startMin = slot.startMinute % 60;
                      const endHour = Math.floor(slot.endMinute / 60);
                      const endMin = slot.endMinute % 60;
                      return (
                        <div key={slot.id} className="text-primary font-bold">
                          {startHour.toString().padStart(2, "0")}:
                          {startMin.toString().padStart(2, "0")} -{" "}
                          {endHour.toString().padStart(2, "0")}:
                          {endMin.toString().padStart(2, "0")}
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="flex justify-between pt-3">
                  <span className="text-primary/60">Total Amount Paid:</span>
                  <span className="font-headline font-black text-secondary text-xl">
                    ₹{Number(booking.totalAmount).toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Status Badge */}
          {booking && (
            <div className="inline-block bg-green-50 border border-green-200 rounded-lg px-4 py-2">
              <p className="text-green-700 font-bold text-sm">
                Status: {booking.status}
              </p>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-4 pt-6">
            <Link
              href="/bookings"
              className="flex-1 bg-primary text-white font-headline font-black py-3 uppercase text-sm tracking-[0.1em] shadow-lg hover:bg-primary/90 transition-all rounded-sm"
            >
              View My Bookings
            </Link>
            <Link
              href="/"
              className="flex-1 bg-secondary/20 text-primary font-headline font-black py-3 uppercase text-sm tracking-[0.1em] shadow-lg hover:bg-secondary/30 transition-all rounded-sm border border-secondary"
            >
              Back to Home
            </Link>
          </div>

          {/* Confirmation Email */}
          <p className="text-xs text-primary/50">
            A confirmation email has been sent to your registered email address.
          </p>
        </div>
      </div>
    </main>
  );
}
