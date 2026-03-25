"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { format, addDays, startOfToday } from "date-fns";
import { useQuery } from "@tanstack/react-query";
import { CourtDetails, CourtSlotTemplate } from "@/types/court.types";
import {
  useSlotTemplatesQuery,
  useAvailableSlotsQuery,
} from "@/hooks/queries/use-schedule-query";
import { BookingService } from "@/service/booking.service";
import { courtService } from "@/service/court.service";
import VenueHeader from "./VenueHeader";
import VenueAbout from "./VenueAbout";
import VenueBookingSidebar from "./VenueBookingSidebar";
import VenueBookingSlot from "./VenueBookingSlot";
import { VENUE_FALLBACK_IMAGE } from "@/lib/placeholders";
import { authClient } from "@/lib/auth-client";

interface VenueDetailsProps {
  venue: CourtDetails;
}

export default function VenueDetails({ venue }: VenueDetailsProps) {
  const router = useRouter();
  const { data: session } = authClient.useSession();

  // STATES
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();
  const [selectedSlot, setSelectedSlot] = useState<
    CourtSlotTemplate | undefined
  >();
  const [selectedSlotDisplay, setSelectedSlotDisplay] = useState<string>("");
  const [isBooking, setIsBooking] = useState(false);
  const [bookingError, setBookingError] = useState<string | null>(null);

  // Fetch slot templates for the court
  const { isLoading: templatesLoading } = useSlotTemplatesQuery(venue.id);

  // Fetch available slots for selected date
  const dateString = selectedDate ? format(selectedDate, "yyyy-MM-dd") : "";
  const {
    data: availableSlotsResponse,
    isLoading: slotsLoading,
    error: slotsError,
  } = useAvailableSlotsQuery(venue.id, dateString);

  const relatedVenuesQuery = useQuery({
    queryKey: ["more-by-organization", venue.organizer.id, venue.id],
    queryFn: async () => {
      const response = await courtService.getAllCourts({
        organizerId: venue.organizer.id,
        limit: 6,
        sortBy: "-createdAt",
      });

      return (response.data ?? [])
        .filter((court) => court.id !== venue.id)
        .slice(0, 4);
    },
    enabled: Boolean(venue.organizer.id),
    staleTime: 60_000,
  });

  // Generate next 7 days for date selection
  const nextDates = useMemo(() => {
    const today = startOfToday();
    return Array.from({ length: 7 }, (_, i) => addDays(today, i));
  }, []);

  // Convert AvailableSlot to CourtSlotTemplate
  const getAvailableSlotsForDate = (): CourtSlotTemplate[] => {
    if (!availableSlotsResponse?.data) {
      return [];
    }

    return availableSlotsResponse.data.map((slot) => ({
      id: slot.slotTemplateId,
      dayOfWeek: slot.dayOfWeek,
      startMinute: slot.startMinute,
      endMinute: slot.endMinute,
      priceOverride: slot.price,
      isActive: true,
    }));
  };

  // Handle slot selection and format display time
  const handleSlotSelect = (slot: CourtSlotTemplate) => {
    const startHour = Math.floor(slot.startMinute / 60);
    const startMin = slot.startMinute % 60;
    const endHour = Math.floor(slot.endMinute / 60);
    const endMin = slot.endMinute % 60;
    const timeDisplay = `${startHour.toString().padStart(2, "0")}:${startMin.toString().padStart(2, "0")} - ${endHour.toString().padStart(2, "0")}:${endMin.toString().padStart(2, "0")}`;

    setSelectedSlot(slot);
    setSelectedSlotDisplay(timeDisplay);
  };

  const availableSlots = selectedDate ? getAvailableSlotsForDate() : [];

  const isLoadingSlots = Boolean(selectedDate && slotsLoading);
  const relatedVenues = relatedVenuesQuery.data ?? [];
  const organizationLabel =
    venue.organizer.businessName?.trim() ||
    venue.organizer.user?.name?.trim() ||
    "the Organization";

  // Handle booking flow
  const handleBookNow = async () => {
    if (!session?.user) {
      router.push("/signin");
      return;
    }

    if (!selectedDate || !selectedSlot) {
      setBookingError("Please select a date and time slot");
      return;
    }

    setIsBooking(true);
    setBookingError(null);

    try {
      const dateString = format(selectedDate, "yyyy-MM-dd");

      // Create booking and redirect to checkout
      const booking = await BookingService.createBooking({
        courtId: venue.id,
        bookingDate: dateString,
        slotTemplateIds: [selectedSlot.id],
      });

      router.push(`/checkout?bookingId=${booking.id}`);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to create booking";
      setBookingError(errorMessage);
      setIsBooking(false);
    }
  };

  return (
    <main className="w-full bg-surface">
      {/* Hero Header */}
      <VenueHeader venue={venue} />

      {/* Main Content Layout */}
      <div className="mx-auto grid max-w-360 grid-cols-1 gap-10 px-4 py-10 sm:px-6 sm:py-14 lg:grid-cols-12 lg:gap-16 lg:px-8 lg:py-20">
        {/* Left Column: Content */}
        <div className="space-y-14 lg:col-span-8 lg:space-y-24">
          {/* About Section */}
          <VenueAbout venue={venue} />

          {/* Availability Section */}
          <section className="space-y-6 sm:space-y-8">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
              <div className="flex grow items-center gap-3 sm:gap-4">
                <h2 className="font-headline text-2xl font-black uppercase tracking-tight text-primary sm:text-3xl sm:tracking-tighter">
                  Availability
                </h2>
                <div className="h-0.5 grow bg-primary/15" />
              </div>
              <button className="hidden text-[10px] uppercase font-black text-secondary border-b-2 border-secondary pb-1 transition-colors hover:text-secondary/80 sm:inline-block">
                View Calendar
              </button>
            </div>

            {/* Date Selector */}
            <div className="hide-scrollbar flex gap-2 overflow-x-auto pb-2 sm:gap-3 sm:pb-6">
              {nextDates.map((date) => (
                <button
                  key={date.toISOString()}
                  onClick={() => setSelectedDate(date)}
                  className={`flex h-24 w-20 shrink-0 flex-col items-center justify-center gap-1 rounded-sm transition-all sm:h-32 sm:w-28 ${
                    selectedDate?.toDateString() === date.toDateString()
                      ? "bg-primary text-secondary shadow-xl"
                      : "bg-surface-variant hover:bg-primary hover:text-secondary border border-primary/15 text-primary"
                  }`}
                >
                  <p className="font-headline text-xl font-black sm:text-2xl">
                    {format(date, "d")}
                  </p>
                  <p className="text-[10px] uppercase font-bold sm:text-xs">
                    {format(date, "EEE")}
                  </p>
                </button>
              ))}
            </div>

            {/* Time Slots */}
            {selectedDate ? (
              <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-4">
                {isLoadingSlots ? (
                  // Loading skeleton
                  Array.from({ length: 4 }).map((_, i) => (
                    <div
                      key={i}
                      className="h-18 animate-pulse rounded-sm border border-primary/20 bg-primary/10 sm:h-20"
                    />
                  ))
                ) : slotsError ? (
                  <div className="col-span-2 rounded-sm border border-red-200 bg-red-50 p-5 text-center md:col-span-4 sm:p-8">
                    <p className="text-red-600 font-body">
                      Failed to load available slots. Please try again.
                    </p>
                    <button
                      onClick={() => setSelectedDate(undefined)}
                      className="mt-4 text-sm text-red-600 underline hover:text-red-700"
                    >
                      Retry
                    </button>
                  </div>
                ) : availableSlots.length > 0 ? (
                  availableSlots.map((slot) => (
                    <VenueBookingSlot
                      key={slot.id}
                      slot={slot}
                      date={selectedDate}
                      isSelected={selectedSlot?.id === slot.id}
                      onSelect={handleSlotSelect}
                      price={
                        typeof slot.priceOverride === "number"
                          ? slot.priceOverride
                          : typeof venue.basePrice === "string"
                            ? parseInt(venue.basePrice)
                            : venue.basePrice
                      }
                    />
                  ))
                ) : (
                  <div className="col-span-2 rounded-sm border border-primary/20 bg-primary/5 p-5 text-center md:col-span-4 sm:p-8">
                    <p className="text-primary font-body">
                      No slots available for this date
                    </p>
                  </div>
                )}
              </div>
            ) : (
              <div className="rounded-sm border border-primary/20 bg-primary/5 p-5 text-center sm:p-8">
                <p className="text-primary font-body">
                  Select a date to view available time slots
                </p>
              </div>
            )}

            {bookingError ? (
              <div className="rounded-sm border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive">
                {bookingError}
              </div>
            ) : null}
          </section>

          <section className="space-y-6 sm:space-y-8">
            <div className="flex items-center gap-3 sm:gap-4">
              <h2 className="font-headline text-2xl font-black uppercase tracking-tight text-primary sm:text-3xl sm:tracking-tighter">
                More By the Organization
              </h2>
              <div className="h-0.5 grow bg-primary/15" />
            </div>

            <p className="text-sm text-primary/70">
              Explore more venues from {organizationLabel}.
            </p>

            {relatedVenuesQuery.isLoading ? (
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                {Array.from({ length: 2 }).map((_, index) => (
                  <div
                    key={index}
                    className="h-40 animate-pulse rounded-sm border border-primary/15 bg-primary/5 sm:h-44"
                  />
                ))}
              </div>
            ) : relatedVenues.length === 0 ? (
              <div className="rounded-sm border border-primary/15 bg-primary/5 p-6 text-sm text-primary/70">
                No more venues available from this organization right now.
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                {relatedVenues.map((court) => {
                  const primaryImage =
                    court.media?.find((media) => media.isPrimary)?.url ||
                    court.media?.[0]?.url ||
                    VENUE_FALLBACK_IMAGE;

                  return (
                    <Link
                      key={court.id}
                      href={`/venues/${court.slug}`}
                      className="group overflow-hidden rounded-sm border border-primary/15 bg-surface-variant transition-all hover:-translate-y-0.5 hover:border-primary/30"
                    >
                      <div className="relative h-28 w-full sm:h-32">
                        <Image
                          src={primaryImage}
                          alt={court.name}
                          fill
                          className="object-cover transition-transform duration-300 group-hover:scale-105"
                          sizes="(max-width: 768px) 100vw, 40vw"
                        />
                      </div>
                      <div className="space-y-1 p-3 sm:p-4">
                        <p className="font-headline text-base font-black uppercase tracking-tight text-primary sm:text-lg">
                          {court.name}
                        </p>
                        <p className="text-xs uppercase tracking-[0.12em] text-primary/60">
                          {court.locationLabel}
                        </p>
                        <p className="text-xs text-primary/70">
                          {court._count?.bookings ?? 0} bookings
                        </p>
                      </div>
                    </Link>
                  );
                })}
              </div>
            )}
          </section>
        </div>

        {/* Right Column: Booking Sidebar */}
        <VenueBookingSidebar
          selectedDate={selectedDate}
          selectedSlot={selectedSlotDisplay}
          basePrice={venue.basePrice}
          isLoading={isBooking || isLoadingSlots || templatesLoading}
          onBookNow={handleBookNow}
        />
      </div>
    </main>
  );
}
