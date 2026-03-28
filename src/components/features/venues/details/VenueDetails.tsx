"use client";

import { useState, useMemo, useEffect } from "react";
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
import { useVenueAnnouncementsQuery } from "@/hooks/queries/use-announcement-query";
import { BookingService } from "@/service/booking.service";
import { courtService } from "@/service/court.service";
import { scheduleService } from "@/service/schedule.service";
import { couponService } from "@/service/coupon.service";
import { Badge } from "@/components/ui/badge";
import VenueHeader from "./VenueHeader";
import VenueAbout from "./VenueAbout";
import VenueBookingSidebar from "./VenueBookingSidebar";
import VenueBookingSlot from "./VenueBookingSlot";
import VenueReviews from "./review/VenueReviews";
import { VENUE_FALLBACK_IMAGE } from "@/lib/placeholders";
import { authClient } from "@/lib/auth-client";
import type { ValidateCouponResponse } from "@/types/coupon.types";

/**
 * THIS COMPONENT IS ENCOURAGED FROM MY SKILLBRIDGE PROJECT
 */

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
  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] =
    useState<ValidateCouponResponse | null>(null);
  const [isApplyingCoupon, setIsApplyingCoupon] = useState(false);

  // Fetch slot templates for the court
  const { isLoading: templatesLoading } = useSlotTemplatesQuery(venue.id);

  // Fetch available slots for selected date
  const dateString = selectedDate ? format(selectedDate, "yyyy-MM-dd") : "";
  const {
    data: availableSlotsResponse,
    isLoading: slotsLoading,
    error: slotsError,
  } = useAvailableSlotsQuery(venue.id, dateString);

  // QUERY FOR ANNOUNCEMENTS
  const venueAnnouncementsQuery = useVenueAnnouncementsQuery(venue.id, {
    limit: 6,
    sortBy: "-publishedAt",
  });

  // QUERY FOR RELATED VENUES
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

  const [availableDateSet, setAvailableDateSet] = useState<Set<string>>(
    () => new Set(),
  );

  useEffect(() => {
    let isActive = true;

    const loadDateAvailability = async () => {
      const nextAvailableDates = new Set<string>();

      for (const date of nextDates) {
        const dayKey = format(date, "yyyy-MM-dd");

        try {
          const response = await scheduleService.getAvailableSlots(
            venue.id,
            dayKey,
          );

          if ((response.data?.length ?? 0) > 0) {
            nextAvailableDates.add(dayKey);
          }
        } catch {
          // Ignore per-day failures; selected date query handles user-facing errors.
        }
      }

      if (isActive) {
        setAvailableDateSet(nextAvailableDates);
      }
    };

    if (venue.id) {
      void loadDateAvailability();
    }

    return () => {
      isActive = false;
    };
  }, [nextDates, venue.id]);

  useEffect(() => {
    setAppliedCoupon(null);
  }, [selectedDate, selectedSlot?.id]);

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
  const venueAnnouncements = venueAnnouncementsQuery.data?.data ?? [];
  const organizationLabel =
    venue.organizer.businessName?.trim() ||
    venue.organizer.user?.name?.trim() ||
    "the Organization";

  const slotBasePrice = useMemo(() => {
    if (selectedSlot && typeof selectedSlot.priceOverride === "number") {
      return selectedSlot.priceOverride;
    }

    if (typeof venue.basePrice === "string") {
      return Number(venue.basePrice);
    }

    return Number(venue.basePrice ?? 0);
  }, [selectedSlot, venue.basePrice]);

  // HANDLER FOR APPLYING COUPON
  const handleApplyCoupon = async () => {
    if (!session?.user) {
      router.push("/signin");
      return;
    }

    if (!selectedDate || !selectedSlot) {
      setBookingError("Select date and slot before applying a coupon");
      return;
    }

    const code = couponCode.trim();
    if (!code) {
      setBookingError("Enter a coupon code to apply");
      return;
    }

    setBookingError(null);
    setIsApplyingCoupon(true);

    try {
      // CALLING API TO VALIDATE COUPON
      const response = await couponService.validateCoupon(code, slotBasePrice);
      setAppliedCoupon(response.data);
      setCouponCode(response.data.coupon.code);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to validate coupon";
      setAppliedCoupon(null);
      setBookingError(message);
    } finally {
      setIsApplyingCoupon(false);
    }
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setCouponCode("");
  };

  // HANDLER FOR BOOKING NOW
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
        couponCode: appliedCoupon?.coupon.code,
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
    <main className=" mb-25 bg-surface">
      {/* Hero Header */}
      <VenueHeader venue={venue} />

      {/* Main Content Layout */}
      <div className="mx-auto grid max-w-360 grid-cols-1 gap-10 px-4 py-10 sm:px-6 sm:py-14 lg:grid-cols-12 lg:gap-16 lg:px-8 lg:py-20">
        {/* Left Column: Content */}
        <div className="space-y-14 lg:col-span-8 lg:space-y-24">
          {/* About Section */}
          <VenueAbout venue={venue} />

          <section className="space-y-6 sm:space-y-8">
            <div className="flex items-center gap-3 sm:gap-4">
              <h2 className="font-headline text-2xl font-black uppercase tracking-tight text-primary sm:text-3xl sm:tracking-tighter">
                Venue Announcements
              </h2>
              <div className="h-0.5 grow bg-primary/15" />
            </div>

            {venueAnnouncementsQuery.isLoading ? (
              <div className="grid grid-cols-1 gap-3">
                {Array.from({ length: 2 }).map((_, index) => (
                  <div
                    key={index}
                    className="h-24 animate-pulse rounded-sm border border-primary/15 bg-primary/5"
                  />
                ))}
              </div>
            ) : venueAnnouncements.length === 0 ? (
              <div className="rounded-sm border border-primary/15 bg-primary/5 p-5 text-sm text-primary/70">
                No active announcements for this venue right now.
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-3">
                {venueAnnouncements.map((announcement) => (
                  <article
                    key={announcement.id}
                    className="space-y-2 rounded-sm border border-primary/15 bg-primary/5 p-4"
                  >
                    <div className="flex flex-wrap items-center gap-2">
                      <Badge className="rounded-none bg-secondary px-2 py-1 text-[10px] uppercase tracking-[0.14em] text-primary">
                        {announcement.type}
                      </Badge>
                      {announcement.publishedAt ? (
                        <span className="text-[11px] uppercase tracking-[0.12em] text-primary/60">
                          {format(
                            new Date(announcement.publishedAt),
                            "MMM dd, yyyy",
                          )}
                        </span>
                      ) : null}
                    </div>
                    <h3 className="font-headline text-lg font-black uppercase tracking-tight text-primary">
                      {announcement.title}
                    </h3>
                    <p className="text-sm text-primary/80">
                      {announcement.content}
                    </p>
                  </article>
                ))}
              </div>
            )}
          </section>

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
              {nextDates.map((date) => {
                const dayKey = format(date, "yyyy-MM-dd");
                const hasSlots = availableDateSet.has(dayKey);
                const isSelected =
                  selectedDate?.toDateString() === date.toDateString();

                return (
                  <button
                    key={date.toISOString()}
                    onClick={() => setSelectedDate(date)}
                    className={`flex h-24 w-20 shrink-0 flex-col items-center justify-center gap-1 rounded-sm border transition-all sm:h-32 sm:w-28 ${
                      isSelected
                        ? "border-primary bg-primary text-secondary shadow-xl"
                        : hasSlots
                          ? "border-secondary/55 bg-secondary/12 text-primary hover:bg-secondary/22"
                          : "border-primary/15 bg-surface-variant text-primary hover:bg-primary hover:text-secondary"
                    }`}
                  >
                    <p className="font-headline text-xl font-black sm:text-2xl">
                      {format(date, "d")}
                    </p>
                    <p className="text-[10px] uppercase font-bold sm:text-xs">
                      {format(date, "EEE")}
                    </p>
                    {hasSlots ? (
                      <span
                        className={`h-1.5 w-1.5 rounded-full ${
                          isSelected ? "bg-secondary" : "bg-secondary/90"
                        }`}
                      />
                    ) : null}
                  </button>
                );
              })}
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

          <section className="hidden space-y-10 sm:space-y-10 lg:block">
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
                          loading="eager"
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
          basePrice={slotBasePrice}
          couponCode={couponCode}
          onCouponCodeChange={(value) => {
            setCouponCode(value.toUpperCase());
            if (appliedCoupon && value.trim() !== appliedCoupon.coupon.code) {
              setAppliedCoupon(null);
            }
          }}
          onApplyCoupon={handleApplyCoupon}
          onRemoveCoupon={handleRemoveCoupon}
          appliedCouponCode={appliedCoupon?.coupon.code ?? null}
          discountAmount={appliedCoupon?.discountAmount ?? 0}
          isApplyingCoupon={isApplyingCoupon}
          isLoading={isBooking || isLoadingSlots || templatesLoading}
          onBookNow={handleBookNow}
        />

        <section className="space-y-6 mt-10  lg:hidden">
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
                        loading="eager"
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

        {/* Reviews & Community Section  */}
        <div className="lg:col-span-8 lg:col-start-1 lg:mt-5">
          <VenueReviews 
            courtId={venue.id} 
            hostUserId={venue.organizer.user?.id} 
          />
        </div>
      </div>
    </main>
  );
}
