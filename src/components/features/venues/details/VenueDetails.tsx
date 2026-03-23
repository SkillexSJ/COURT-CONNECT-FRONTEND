"use client";

import { useState, useMemo } from "react";
import { format, addDays, startOfToday } from "date-fns";
import { CourtDetails, CourtSlotTemplate } from "@/types/court.types";
import {
  useSlotTemplatesQuery,
  useAvailableSlotsQuery,
} from "@/hooks/queries/use-schedule-query";
import VenueHeader from "./VenueHeader";
import VenueAbout from "./VenueAbout";
import VenueBookingSidebar from "./VenueBookingSidebar";
import VenueBookingSlot from "./VenueBookingSlot";
import { Button } from "@/components/ui/button";

interface VenueDetailsProps {
  venue: CourtDetails;
}

export default function VenueDetails({ venue }: VenueDetailsProps) {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();
  const [selectedSlot, setSelectedSlot] = useState<
    CourtSlotTemplate | undefined
  >();
  const [selectedSlotDisplay, setSelectedSlotDisplay] = useState<string>("");

  // Fetch slot templates for the court
  const {
    data: slotTemplatesResponse,
    isLoading: templatesLoading,
    error: templatesError,
  } = useSlotTemplatesQuery(venue.id);

  // Fetch available slots for selected date
  const dateString = selectedDate ? format(selectedDate, "yyyy-MM-dd") : "";
  const {
    data: availableSlotsResponse,
    isLoading: slotsLoading,
    error: slotsError,
  } = useAvailableSlotsQuery(venue.id, dateString);

  const nextDates = useMemo(() => {
    const today = startOfToday();
    return Array.from({ length: 7 }, (_, i) => addDays(today, i));
  }, []);

  // Convert AvailableSlot to CourtSlotTemplate format for rendering
  const getAvailableSlotsForDate = (date: Date): CourtSlotTemplate[] => {
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

  const handleSlotSelect = (slot: CourtSlotTemplate) => {
    const startHour = Math.floor(slot.startMinute / 60);
    const startMin = slot.startMinute % 60;
    const endHour = Math.floor(slot.endMinute / 60);
    const endMin = slot.endMinute % 60;
    const timeDisplay = `${startHour.toString().padStart(2, "0")}:${startMin.toString().padStart(2, "0")} - ${endHour.toString().padStart(2, "0")}:${endMin.toString().padStart(2, "0")}`;

    setSelectedSlot(slot);
    setSelectedSlotDisplay(timeDisplay);
  };

  const availableSlots = selectedDate
    ? getAvailableSlotsForDate(selectedDate)
    : [];

  const isLoadingSlots = Boolean(selectedDate && slotsLoading);
  const hasError = slotsError || templatesError;

  return (
    <main className="w-full bg-surface">
      {/* Hero Header */}
      <VenueHeader venue={venue} />

      {/* Main Content Layout */}
      <div className="max-w-360 mx-auto px-8 py-20 grid grid-cols-1 lg:grid-cols-12 gap-16">
        {/* Left Column: Content */}
        <div className="lg:col-span-8 space-y-24">
          {/* About Section */}
          <VenueAbout venue={venue} />

          {/* Availability Section */}
          <section className="space-y-8">
            <div className="flex justify-between items-end">
              <div className="flex items-center gap-4 grow">
                <h2 className="font-headline font-black text-3xl uppercase tracking-tighter text-primary">
                  Availability
                </h2>
                <div className="h-0.5 grow bg-primary/15" />
              </div>
              <button className="ml-6 text-[10px] uppercase font-black text-secondary border-b-2 border-secondary pb-1 hover:text-secondary/80 transition-colors">
                View Calendar
              </button>
            </div>

            {/* Date Selector */}
            <div className="flex gap-3 overflow-x-auto hide-scrollbar pb-6">
              {nextDates.map((date) => (
                <button
                  key={date.toISOString()}
                  onClick={() => setSelectedDate(date)}
                  className={`shrink-0 w-28 h-32 flex flex-col items-center justify-center gap-1 rounded-sm transition-all ${
                    selectedDate?.toDateString() === date.toDateString()
                      ? "bg-primary text-secondary shadow-xl"
                      : "bg-surface-variant hover:bg-primary hover:text-secondary border border-primary/15 text-primary"
                  }`}
                >
                  <p className="font-headline font-black text-2xl">
                    {format(date, "d")}
                  </p>
                  <p className="text-xs uppercase font-bold">
                    {format(date, "EEE")}
                  </p>
                </button>
              ))}
            </div>

            {/* Time Slots */}
            {selectedDate ? (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {isLoadingSlots ? (
                  // Loading skeleton
                  Array.from({ length: 4 }).map((_, i) => (
                    <div
                      key={i}
                      className="py-5 bg-primary/10 border border-primary/20 rounded-sm animate-pulse h-20"
                    />
                  ))
                ) : slotsError ? (
                  <div className="col-span-2 md:col-span-4 p-8 bg-red-50 border border-red-200 rounded-sm text-center">
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
                  <div className="col-span-2 md:col-span-4 p-8 bg-primary/5 border border-primary/20 rounded-sm text-center">
                    <p className="text-primary font-body">
                      No slots available for this date
                    </p>
                  </div>
                )}
              </div>
            ) : (
              <div className="p-8 bg-primary/5 border border-primary/20 rounded-sm text-center">
                <p className="text-primary font-body">
                  Select a date to view available time slots
                </p>
              </div>
            )}
          </section>
        </div>

        {/* Right Column: Booking Sidebar */}
        <VenueBookingSidebar
          selectedDate={selectedDate}
          selectedSlot={selectedSlotDisplay}
          basePrice={venue.basePrice}
          isLoading={isLoadingSlots || templatesLoading}
          onBookNow={() => {
            // TODO: Implement booking functionality
            console.log("Book now clicked", { selectedDate, selectedSlot });
          }}
        />
      </div>
    </main>
  );
}
