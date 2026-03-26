"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ArrowRight, MapPin, CalendarClock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { BookingService } from "@/service/booking.service";
import { courtService } from "@/service/court.service";
import { cn } from "@/lib/utils";
import { VENUE_FALLBACK_IMAGE } from "@/lib/placeholders";
import type { Booking } from "@/types/booking.types";
import type { CourtListItem } from "@/types/court.types";
import {
  UniversalBookingTable,
  type BookingActorRole,
} from "./UniversalBookingTable";


/**
 * THIS IS A ROBUST AND SHAREABLE BOOKING VIEW COMPONENT
 * 
 * 
 */


type RoleBookingsViewProps = {
  role: BookingActorRole;
};

export function RoleBookingsView({ role }: RoleBookingsViewProps) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [selectedCourtId, setSelectedCourtId] = useState<string>("");

  const heading = useMemo(() => {
    if (role === "ADMIN") return "Booking Management";
    if (role === "ORGANIZER") return "Venue Booking Control";
    return "My Bookings";
  }, [role]);

  // QUERY FOR COURTS
  const courtsQuery = useQuery<CourtListItem[]>({
    queryKey: ["bookings-courts", role],
    enabled: role !== "USER",
    queryFn: async () => {
      const response =
        role === "ORGANIZER"
          ? await courtService.getOrganizerCourts({ limit: 100 })
          : await courtService.getAllCourts({ limit: 100 });
      return Array.isArray(response.data) ? response.data : [];
    },
    staleTime: 60_000,
  });

  // USEMEMO FOR COURTS
  const courts = useMemo(() => courtsQuery.data ?? [], [courtsQuery.data]);
  const selectedCourt =
    role === "USER"
      ? null
      : (courts.find((court) => court.id === selectedCourtId) ?? null);
  const effectiveCourtId = role === "USER" ? "self" : (selectedCourt?.id ?? "");
  const bookingScopeKey = role === "USER" ? "self" : effectiveCourtId;
  const isVenueSelected = role === "USER" || selectedCourt !== null;

  // QUERY FOR BOOKINGS
  const bookingsQuery = useQuery<Booking[]>({
    queryKey: ["role-bookings", role, bookingScopeKey],
    enabled: role === "USER" || Boolean(selectedCourt),
    queryFn: async () => {
      if (role === "USER") {
        const result = await BookingService.getUserBookings({ limit: 100 });
        return Array.isArray(result.data) ? result.data : [];
      }

      const result = await BookingService.getCourtBookings(effectiveCourtId, {
        limit: 100,
      });
      return Array.isArray(result.data) ? result.data : [];
    },
    staleTime: 30_000,
  });

  // REFRESH BOOKINGS
  const refreshBookings = async () => {
    await queryClient.invalidateQueries({
      queryKey: ["role-bookings", role],
    });
  };

  // APPROVE BOOKING MUTATION
  const approveMutation = useMutation({
    mutationFn: (bookingId: string) => BookingService.approveBooking(bookingId),
    onSuccess: async () => {
      toast.success("Booking approved");
      await refreshBookings();
    },
    onError: (error) => {
      toast.error(error instanceof Error ? error.message : "Failed to approve");
    },
  });

  // REJECT BOOKING MUTATION
  const rejectMutation = useMutation({
    mutationFn: (bookingId: string) => BookingService.rejectBooking(bookingId),
    onSuccess: async () => {
      toast.success("Booking rejected");
      await refreshBookings();
    },
    onError: (error) => {
      toast.error(error instanceof Error ? error.message : "Failed to reject");
    },
  });

  // CANCEL BOOKING MUTATION
  const cancelMutation = useMutation({
    mutationFn: (bookingId: string) => BookingService.cancelBooking(bookingId),
    onSuccess: async () => {
      toast.success("Booking cancelled");
      await refreshBookings();
    },
    onError: (error) => {
      toast.error(error instanceof Error ? error.message : "Failed to cancel");
    },
  });

  /**
   * HANDLER FOR CHANGING COURTS
   */
  const onCourtChange = (courtId: string) => {
    setSelectedCourtId(courtId);
  };

  const handleApprove = (booking: Booking) => {
    approveMutation.mutate(booking.id);
  };

  const handleReject = (booking: Booking) => {
    rejectMutation.mutate(booking.id);
  };

  const handleCancel = (booking: Booking) => {
    cancelMutation.mutate(booking.id);
  };

  const handlePay = (booking: Booking) => {
    router.push(`/checkout?bookingId=${booking.id}`);
  };

  const handleView = (booking: Booking) => {
    router.push(`/checkout/success?bookingId=${booking.id}`);
  };

  const loading =
    bookingsQuery.isLoading || (role !== "USER" && courtsQuery.isLoading);
  const bookings = useMemo(
    () =>
      (bookingsQuery.data ?? []).map((booking) => {
        if (booking.court?.name) return booking;

        const fallbackCourt = courts.find(
          (court) => court.id === booking.courtId,
        );
        if (!fallbackCourt) return booking;

        return {
          ...booking,
          court: {
            id: fallbackCourt.id,
            name: fallbackCourt.name,
            slug: fallbackCourt.slug,
            basePrice: fallbackCourt.basePrice,
            media: fallbackCourt.media,
          },
        };
      }),
    [bookingsQuery.data, courts],
  );

  /**
   * SIDE EFFECTS FOR BOOKINGS QUERY
   */
  useEffect(() => {
    if (!bookingsQuery.error) return;

    toast.error(
      bookingsQuery.error instanceof Error
        ? bookingsQuery.error.message
        : "Failed to fetch bookings",
    );
  }, [bookingsQuery.error]);

  useEffect(() => {
    if (role === "USER" || !courtsQuery.error) return;

    toast.error(
      courtsQuery.error instanceof Error
        ? courtsQuery.error.message
        : "Failed to load courts",
    );
  }, [courtsQuery.error, role]);

  if (role !== "USER" && !isVenueSelected) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-heading text-xl font-black uppercase tracking-tight text-primary">
            Select Venue
          </h2>
          <p className="text-xs uppercase tracking-[0.12em] text-muted-foreground">
            {courts.length} venues available
          </p>
        </div>

        {courts.length === 0 && !loading && (
          <Card className="rounded-none border border-border bg-card">
            <CardContent className="p-6 text-sm text-muted-foreground">
              No venues found. Create a venue first to manage bookings.
            </CardContent>
          </Card>
        )}

        <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
          {courts.map((court) => {
            const totalBookings = court._count?.bookings ?? 0;
            const venueImage =
              court.media?.find((media) => media.isPrimary)?.url ??
              court.media?.[0]?.url ??
              VENUE_FALLBACK_IMAGE;
            const isActive = court.status === "ACTIVE";

            return (
              <button
                key={court.id}
                type="button"
                onClick={() => onCourtChange(court.id)}
                className={cn(
                  "group relative w-full overflow-hidden rounded-sm border bg-card text-left transition-all",
                  "border-border hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-[0_12px_28px_-18px_rgba(7,58,39,0.85)]",
                )}
              >
                <div className="relative h-40 w-full overflow-hidden border-b border-border/80">
                  <Image
                    src={venueImage}
                    alt={court.name}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
                  />
                  <div className="absolute inset-0 bg-linear-to-t from-black/60 via-black/20 to-transparent" />
                  <Badge
                    className={cn(
                      "absolute left-3 top-3 rounded-none px-2 py-1 text-[10px] uppercase tracking-[0.14em]",
                      isActive
                        ? "bg-secondary text-primary"
                        : "bg-background/85 text-foreground",
                    )}
                  >
                    {court.status.replaceAll("_", " ")}
                  </Badge>
                  <p className="absolute bottom-3 left-3 right-3 font-heading text-lg font-black tracking-tight text-white">
                    {court.name}
                  </p>
                </div>

                <div className="space-y-4 p-4">
                  <div className="space-y-2 text-xs text-muted-foreground">
                    <p className="flex items-start gap-1.5 leading-relaxed">
                      <MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                      <span className="line-clamp-2">
                        {court.locationLabel}
                      </span>
                    </p>
                    <p className="uppercase tracking-widest">{court.type}</p>
                  </div>

                  <div className="rounded-sm border border-border/80 bg-muted/30 p-3">
                    <div className="flex items-center justify-between text-xs">
                      <span className="flex items-center gap-1.5 uppercase tracking-[0.12em] text-muted-foreground">
                        <CalendarClock className="h-3.5 w-3.5" />
                        Bookings
                      </span>
                      <span className="font-heading text-base font-black text-primary">
                        {totalBookings}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
                      Open Booking Control
                    </span>
                    <ArrowRight className="h-4 w-4 text-primary transition-transform group-hover:translate-x-1" />
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {role !== "USER" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-heading text-xl font-black uppercase tracking-tight text-primary">
              {selectedCourt?.name ?? "Venue"}
            </h2>
            <Button
              type="button"
              variant="outline"
              className="rounded-none"
              onClick={() => setSelectedCourtId("")}
            >
              Back To Venue Grid
            </Button>
          </div>
        </div>
      )}

      <UniversalBookingTable
        role={role}
        heading={heading}
        bookings={bookings}
        loading={loading}
        onView={handleView}
        onPay={role === "USER" ? handlePay : undefined}
        onCancel={role === "ADMIN" ? undefined : handleCancel}
        onApprove={role === "ORGANIZER" ? handleApprove : undefined}
        onReject={role === "ORGANIZER" ? handleReject : undefined}
      />
    </div>
  );
}
