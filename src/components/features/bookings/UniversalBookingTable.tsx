"use client";
"use no memo";


/**
 * THIS IS A ROBUST AND SHAREABLE BOOKING TABLE COMPONENT
 * MADE WITH TANSTACK TABLE
 */



import { useMemo, useState } from "react";
import Image from "next/image";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { format } from "date-fns";
import { IconAdjustmentsHorizontal, IconEye } from "@tabler/icons-react";
import { CheckCircle2, Clock3, CalendarClock } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  AVATAR_FALLBACK_IMAGE,
  VENUE_FALLBACK_IMAGE,
  getInitials,
} from "@/lib/placeholders";
import { DashboardStatCard } from "@/components/features/dashboard/shared/DashboardStatCard";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { Booking } from "@/types/booking.types";

export type BookingActorRole = "USER" | "ORGANIZER" | "ADMIN";

type BookingTab = "UPCOMING" | "PENDING" | "COMPLETED" | "CANCELLED";

type UniversalBookingTableProps = {
  role: BookingActorRole;
  bookings: Booking[];
  loading?: boolean;
  onView?: (booking: Booking) => void;
  onPay?: (booking: Booking) => void;
  onCancel?: (booking: Booking) => void;
  onApprove?: (booking: Booking) => void;
  onReject?: (booking: Booking) => void;
  heading?: string;
};

/**
 * HELPERS FOR BOOKING TABLE
 */
const mapStatusColor = (status: Booking["status"]) => {
  if (status === "PAID") return "bg-secondary text-primary";
  if (status === "PENDING") return "bg-amber-100 text-amber-700";
  if (status === "COMPLETED") return "bg-emerald-100 text-emerald-700";
  return "bg-red-100 text-red-700";
};

const toTime = (minutes: number) => {
  const hour = Math.floor(minutes / 60)
    .toString()
    .padStart(2, "0");
  const minute = (minutes % 60).toString().padStart(2, "0");
  return `${hour}:${minute}`;
};

const getTimeRange = (booking: Booking) => {
  if (!booking.slots || booking.slots.length === 0) return "--:-- - --:--";
  const starts = booking.slots.map((slot) => slot.startMinute);
  const ends = booking.slots.map((slot) => slot.endMinute);
  return `${toTime(Math.min(...starts))} - ${toTime(Math.max(...ends))}`;
};

const isUpcomingBooking = (booking: Booking) => {
  const bookingDate = new Date(booking.bookingDate);
  const today = new Date();
  bookingDate.setHours(0, 0, 0, 0);
  today.setHours(0, 0, 0, 0);
  return bookingDate >= today && ["PENDING", "PAID"].includes(booking.status);
};

const getVenueName = (booking: Booking) => {
  const name = booking.court?.name?.trim();
  return name && name.length > 0
    ? name
    : `Court ${booking.courtId.slice(0, 6)}`;
};

const getVenueImage = (booking: Booking) => {
  const primaryMedia = booking.court?.media?.find((media) => media.isPrimary);
  return (
    primaryMedia?.url ?? booking.court?.media?.[0]?.url ?? VENUE_FALLBACK_IMAGE
  );
};

export function UniversalBookingTable({
  role,
  bookings,
  loading,
  onView,
  onPay,
  onCancel,
  onApprove,
  onReject,
  heading = "Booking Management",
}: UniversalBookingTableProps) {
  const [activeTab, setActiveTab] = useState<BookingTab>("UPCOMING");
  const [searchValue, setSearchValue] = useState("");

  // USEMEMO FOR FILTERED BOOKINGS
  const filteredBookings = useMemo(() => {
    const tabFiltered = bookings.filter((booking) => {
      if (activeTab === "UPCOMING") return isUpcomingBooking(booking);
      if (activeTab === "PENDING") return booking.status === "PENDING";
      if (activeTab === "COMPLETED") return booking.status === "COMPLETED";
      return booking.status === "CANCELLED";
    });

    if (!searchValue.trim()) return tabFiltered;

    const search = searchValue.toLowerCase();
    return tabFiltered.filter((booking) => {
      const athleteName = booking.user?.name?.toLowerCase() ?? "";
      const athleteEmail = booking.user?.email?.toLowerCase() ?? "";
      const venue = getVenueName(booking).toLowerCase();
      const code = booking.bookingCode.toLowerCase();
      return (
        athleteName.includes(search) ||
        athleteEmail.includes(search) ||
        venue.includes(search) ||
        code.includes(search)
      );
    });
  }, [activeTab, bookings, searchValue]);

  const pendingCount = bookings.filter(
    (booking) => booking.status === "PENDING",
  ).length;
  const activeCount = bookings.filter(
    (booking) => booking.status === "PAID",
  ).length;
  const completionRate =
    bookings.length === 0
      ? 0
      : Math.round(
          (bookings.filter((booking) => booking.status === "COMPLETED").length /
            bookings.length) *
            100,
        );

  // USEMEMO FOR COLUMNS
  const columns = useMemo<ColumnDef<Booking>[]>(() => {
    return [
      {
        accessorKey: "athlete",
        header: "Athlete",
        cell: ({ row }) => {
          const booking = row.original;
          return (
            <div className="flex items-center gap-2.5">
              <Avatar size="sm" className="rounded-md">
                <AvatarImage
                  src={booking.user?.avatarUrl ?? AVATAR_FALLBACK_IMAGE}
                  alt={booking.user?.name ?? "Athlete"}
                />
                <AvatarFallback className="rounded-md bg-muted text-[10px]">
                  {getInitials(booking.user?.name ?? "Guest Athlete")}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="font-heading text-sm font-bold text-primary">
                  {booking.user?.name ?? "Guest Athlete"}
                </p>
                <p className="text-xs text-muted-foreground">
                  {booking.user?.email ?? "N/A"}
                </p>
              </div>
            </div>
          );
        },
      },
      {
        accessorKey: "venue",
        header: "Venue / Court",
        cell: ({ row }) => {
          const booking = row.original;
          return (
            <div className="flex items-center gap-3">
              <div className="relative h-10 w-14 overflow-hidden rounded-sm border border-border/70">
                <Image
                  src={getVenueImage(booking)}
                  alt={getVenueName(booking)}
                  fill
                  className="object-cover"
                  sizes="56px"
                />
              </div>
              <div>
                <p className="font-heading text-sm font-bold text-primary">
                  {getVenueName(booking)}
                </p>
                <p className="text-xs text-muted-foreground">
                  {booking.bookingCode}
                </p>
              </div>
            </div>
          );
        },
      },
      {
        accessorKey: "date",
        header: "Date & Time",
        cell: ({ row }) => {
          const booking = row.original;
          return (
            <div>
              <p className="font-heading text-sm font-bold text-primary">
                {format(new Date(booking.bookingDate), "MMM dd, yyyy")}
              </p>
              <p className="text-xs text-muted-foreground">
                {getTimeRange(booking)}
              </p>
            </div>
          );
        },
      },
      {
        accessorKey: "payment",
        header: "Payment",
        cell: ({ row }) => {
          const status = row.original.status;
          return (
            <Badge
              className={`rounded-none px-2 py-1 text-[10px] tracking-[0.14em] ${mapStatusColor(status)}`}
            >
              {status}
            </Badge>
          );
        },
      },
      {
        id: "actions",
        header: "Actions",
        cell: ({ row }) => {
          const booking = row.original;
          const canModerate = role === "ORGANIZER";
          const canCancel = role !== "ADMIN";
          const isPending = booking.status === "PENDING";

          return (
            <div className="flex flex-wrap items-center gap-2">
              {onView && (
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  onClick={() => onView(booking)}
                >
                  <IconEye className="size-3.5" />
                  View
                </Button>
              )}

              {role === "USER" && isPending && onPay && (
                <Button
                  type="button"
                  size="sm"
                  variant="secondary"
                  onClick={() => onPay(booking)}
                >
                  Pay
                </Button>
              )}

              {canModerate && isPending && onApprove && (
                <Button
                  type="button"
                  size="sm"
                  variant="secondary"
                  onClick={() => onApprove(booking)}
                >
                  Approve
                </Button>
              )}

              {canModerate && isPending && onReject && (
                <Button
                  type="button"
                  size="sm"
                  variant="destructive"
                  onClick={() => onReject(booking)}
                >
                  Reject
                </Button>
              )}

              {canCancel &&
                onCancel &&
                ["PENDING", "PAID"].includes(booking.status) && (
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    onClick={() => onCancel(booking)}
                  >
                    Cancel
                  </Button>
                )}
            </div>
          );
        },
      },
    ];
  }, [onApprove, onCancel, onPay, onReject, onView, role]);

  const table = useReactTable({
    data: filteredBookings,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: {
      pagination: {
        pageSize: 10,
      },
    },
  });

  const pageRows = table.getRowModel().rows;
  const rowCountStart =
    filteredBookings.length === 0
      ? 0
      : table.getState().pagination.pageIndex *
          table.getState().pagination.pageSize +
        1;
  const rowCountEnd = Math.min(
    (table.getState().pagination.pageIndex + 1) *
      table.getState().pagination.pageSize,
    filteredBookings.length,
  );

  return (
    <div className="space-y-6">
      <header className="space-y-4">
        <h1 className="font-heading text-5xl font-black tracking-tight text-primary">
          {heading}
        </h1>
      </header>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <DashboardStatCard
          label="Pending Approvals"
          value={String(pendingCount)}
          icon={Clock3}
          subtitle="Bookings awaiting confirmation"
        />

        <DashboardStatCard
          label="Active Reservations"
          value={String(activeCount)}
          icon={CalendarClock}
          subtitle="Paid bookings currently active"
        />

        <DashboardStatCard
          label="Historical Total"
          value={`${bookings.length}`}
          icon={CheckCircle2}
          subtitle={`${completionRate}% completion rate`}
          accent
        />
      </div>

      <div className="space-y-4 rounded-sm border border-border bg-card p-4">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <Tabs
            value={activeTab}
            onValueChange={(value) => setActiveTab(value as BookingTab)}
          >
            <TabsList variant="line" className="-mx-1 bg-transparent">
              <TabsTrigger
                value="UPCOMING"
                className="px-3 text-sm font-semibold"
              >
                Upcoming
              </TabsTrigger>
              <TabsTrigger
                value="PENDING"
                className="px-3 text-sm font-semibold"
              >
                Pending
              </TabsTrigger>
              <TabsTrigger
                value="COMPLETED"
                className="px-3 text-sm font-semibold"
              >
                Completed
              </TabsTrigger>
              <TabsTrigger
                value="CANCELLED"
                className="px-3 text-sm font-semibold"
              >
                Cancelled
              </TabsTrigger>
            </TabsList>
          </Tabs>

          <div className="flex items-center gap-2">
            <Input
              value={searchValue}
              onChange={(event) => setSearchValue(event.target.value)}
              placeholder="Search athlete, venue or code"
              className="h-9 w-56"
            />
            <Button
              type="button"
              variant="outline"
              className="h-9 rounded-none text-[11px] uppercase tracking-[0.12em]"
            >
              <IconAdjustmentsHorizontal className="size-3.5" />
              Advanced Filter
            </Button>
          </div>
        </div>

        <div className="overflow-hidden rounded-sm border border-border">
          <Table>
            <TableHeader className="bg-muted/30">
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>

            <TableBody>
              {loading && (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="py-12 text-center text-muted-foreground"
                  >
                    <LoadingSpinner
                      label="Loading bookings..."
                      className="justify-center"
                    />
                  </TableCell>
                </TableRow>
              )}

              {!loading && pageRows.length === 0 && (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="py-12 text-center text-muted-foreground"
                  >
                    No bookings found for this filter.
                  </TableCell>
                </TableRow>
              )}

              {!loading &&
                pageRows.map((row) => (
                  <TableRow key={row.id}>
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext(),
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </div>

        <div className="flex flex-col gap-3 text-xs text-muted-foreground md:flex-row md:items-center md:justify-between">
          <p className="uppercase tracking-[0.12em]">
            Showing {rowCountStart} to {rowCountEnd} of{" "}
            {filteredBookings.length} bookings
          </p>
          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
              className="rounded-none uppercase"
            >
              Prev
            </Button>
            <Button
              type="button"
              variant="secondary"
              size="sm"
              className="rounded-none"
            >
              {String(table.getState().pagination.pageIndex + 1).padStart(
                2,
                "0",
              )}
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
              className="rounded-none uppercase"
            >
              Next
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
