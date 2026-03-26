"use client";

import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { IconPlus, IconTrash } from "@tabler/icons-react";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { courtService } from "@/service/court.service";
import { scheduleService } from "@/service/schedule.service";
import type { CourtListItem } from "@/types/court.types";
import type { SlotTemplate, SlotTemplatesByDay } from "@/types/schedule.types";
import { cn } from "@/lib/utils";

/**
 * A ROBUST SCHEDULE MANAGEMENT PAGE FOR ORGANIZERS
 */

type DayConfig = {
  value: number;
  shortLabel: string;
  fullLabel: string;
};

const DAYS: DayConfig[] = [
  { value: 1, shortLabel: "MON", fullLabel: "Monday" },
  { value: 2, shortLabel: "TUE", fullLabel: "Tuesday" },
  { value: 3, shortLabel: "WED", fullLabel: "Wednesday" },
  { value: 4, shortLabel: "THU", fullLabel: "Thursday" },
  { value: 5, shortLabel: "FRI", fullLabel: "Friday" },
  { value: 6, shortLabel: "SAT", fullLabel: "Saturday" },
  { value: 0, shortLabel: "SUN", fullLabel: "Sunday" },
];

// HELPERS
const timeToMinutes = (value: string) => {
  const [hour, minute] = value.split(":").map(Number);
  return hour * 60 + minute;
};

const minutesToTime = (value: number) => {
  const hour = Math.floor(value / 60)
    .toString()
    .padStart(2, "0");
  const minute = (value % 60).toString().padStart(2, "0");
  return `${hour}:${minute}`;
};

const normalizeSlotsByDay = (data: SlotTemplatesByDay | undefined) => {
  const normalized: Record<number, SlotTemplate[]> = {
    0: [],
    1: [],
    2: [],
    3: [],
    4: [],
    5: [],
    6: [],
  };

  if (!data) return normalized;

  for (const [key, slots] of Object.entries(data)) {
    const numericKey = Number(key);
    if (Number.isNaN(numericKey)) continue;
    normalized[numericKey] = [...slots].sort(
      (a, b) => a.startMinute - b.startMinute,
    );
  }

  return normalized;
};

export default function ScheduleManagementPage() {
  const queryClient = useQueryClient();
  // STATES
  const [selectedCourtId, setSelectedCourtId] = useState("");
  const [mobileDay, setMobileDay] = useState<number>(1);
  const [draftDay, setDraftDay] = useState<number>(1);
  const [startTime, setStartTime] = useState("08:00");
  const [endTime, setEndTime] = useState("09:00");
  const [priceOverride, setPriceOverride] = useState("");

  // QUERY FOR GETTING COURTS
  const courtsQuery = useQuery<CourtListItem[]>({
    queryKey: ["organizer-schedule-courts"],
    queryFn: async () => {
      const response = await courtService.getOrganizerCourts({ limit: 100 });
      return response.data ?? [];
    },
    staleTime: 60_000,
  });

  // MEMOIZED VALUES
  const courts = useMemo(() => courtsQuery.data ?? [], [courtsQuery.data]);
  const effectiveCourtId = selectedCourtId || courts[0]?.id || "";
  const selectedCourt =
    courts.find((court) => court.id === effectiveCourtId) ?? null;

  // QUERY FOR GETTING SLOTS
  const slotsQuery = useQuery<SlotTemplatesByDay>({
    queryKey: ["organizer-slot-templates", effectiveCourtId],
    enabled: Boolean(effectiveCourtId),
    queryFn: async () => {
      const response = await scheduleService.getSlotTemplates(effectiveCourtId);
      return response.data ?? {};
    },
    staleTime: 30_000,
  });

  // MEMOIZED VALUES
  const slotsByDay = useMemo(
    () => normalizeSlotsByDay(slotsQuery.data),
    [slotsQuery.data],
  );

  const totalWeeklySlots = useMemo(() => {
    return Object.values(slotsByDay).reduce(
      (sum, daySlots) => sum + daySlots.length,
      0,
    );
  }, [slotsByDay]);

  // MUTATIONS
  const createSlotMutation = useMutation({
    mutationFn: () => {
      const startMinute = timeToMinutes(startTime);
      const endMinute = timeToMinutes(endTime);

      if (startMinute >= endMinute) {
        throw new Error("Start time must be before end time");
      }

      return scheduleService.createSlotTemplate(effectiveCourtId, {
        dayOfWeek: draftDay,
        startMinute,
        endMinute,
        priceOverride:
          priceOverride.trim() === "" ? undefined : Number(priceOverride),
      });
    },
    onSuccess: async () => {
      toast.success("Slot added successfully");
      setPriceOverride("");
      await queryClient.invalidateQueries({
        queryKey: ["organizer-slot-templates", effectiveCourtId],
      });
    },
    onError: (error) => {
      toast.error(
        error instanceof Error ? error.message : "Failed to add slot",
      );
    },
  });

  const deleteSlotMutation = useMutation({
    mutationFn: (templateId: string) =>
      scheduleService.deleteSlotTemplate(templateId),
    onSuccess: async () => {
      toast.success("Slot removed");
      await queryClient.invalidateQueries({
        queryKey: ["organizer-slot-templates", effectiveCourtId],
      });
    },
    onError: (error) => {
      toast.error(
        error instanceof Error ? error.message : "Failed to delete slot",
      );
    },
  });

  /**
   *
   *
   * TABLE COLUMN RENDERER
   */
  const renderDayColumn = (day: DayConfig) => {
    const daySlots = slotsByDay[day.value] ?? [];

    return (
      <div
        key={day.value}
        className="min-h-56 border border-border bg-background p-3"
      >
        <div className="mb-3 flex items-center justify-between">
          <div>
            <p className="font-heading text-sm font-black text-primary">
              {day.shortLabel}
            </p>
            <p className="text-[10px] uppercase tracking-widest text-muted-foreground">
              {day.fullLabel}
            </p>
          </div>
          <Button
            type="button"
            size="icon-xs"
            variant="outline"
            onClick={() => setDraftDay(day.value)}
            title={`Set add form to ${day.fullLabel}`}
          >
            <IconPlus className="size-3" />
          </Button>
        </div>

        <div className="space-y-2">
          {daySlots.length === 0 && (
            <p className="pt-8 text-center text-xs text-muted-foreground">
              No slots
            </p>
          )}

          {daySlots.map((slot) => (
            <div key={slot.id} className="border border-border bg-card p-2">
              <div className="flex items-center justify-between gap-2">
                <p className="font-heading text-sm font-black text-primary">
                  {minutesToTime(slot.startMinute)} -{" "}
                  {minutesToTime(slot.endMinute)}
                </p>
                <button
                  type="button"
                  onClick={() => deleteSlotMutation.mutate(slot.id)}
                  className="text-destructive hover:opacity-80"
                  title="Delete slot"
                >
                  <IconTrash className="size-4" />
                </button>
              </div>
              <p className="text-[10px] uppercase tracking-widest text-muted-foreground">
                {slot.priceOverride == null
                  ? "Default venue price"
                  : `USD ${Number(slot.priceOverride).toFixed(2)}`}
              </p>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <header className="space-y-2">
        <h1 className="font-heading text-4xl font-black uppercase tracking-tight text-primary md:text-5xl">
          Schedule Templates
        </h1>
        <p className="text-sm text-muted-foreground">
          Manage weekly slot templates per venue. Add or delete slots anytime.
        </p>
      </header>

      <Card className="rounded-sm border border-border bg-card">
        <CardHeader>
          <CardTitle className="font-heading text-lg font-black uppercase tracking-tight text-primary">
            Select Venue
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {courts.length === 0 && !courtsQuery.isLoading && (
            <p className="text-sm text-muted-foreground">
              No venues found. Create a venue first.
            </p>
          )}

          <div className="flex snap-x snap-mandatory gap-3 overflow-x-auto pb-1 md:grid md:grid-cols-2 md:overflow-visible xl:grid-cols-3">
            {courts.map((court) => {
              const isActive = effectiveCourtId === court.id;
              return (
                <button
                  key={court.id}
                  type="button"
                  onClick={() => setSelectedCourtId(court.id)}
                  className={cn(
                    "min-w-[84%] snap-start rounded-sm border p-4 text-left transition-all md:min-w-0",
                    isActive
                      ? "border-secondary bg-secondary/10 ring-1 ring-secondary/50"
                      : "border-border bg-background hover:border-primary/30",
                  )}
                >
                  <div className="flex items-start justify-between gap-2">
                    <p className="font-heading text-base font-black text-primary">
                      {court.name}
                    </p>
                    <Badge
                      className={cn(
                        "rounded-none text-[10px] tracking-[0.14em]",
                        court.status === "ACTIVE"
                          ? "bg-secondary text-primary"
                          : "bg-muted text-muted-foreground",
                      )}
                    >
                      {court.status}
                    </Badge>
                  </div>
                  <p className="mt-2 text-xs text-muted-foreground">
                    {court.locationLabel}
                  </p>
                </button>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {selectedCourt && (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <Card className="rounded-sm border border-border bg-card">
            <CardContent className="space-y-1 p-4">
              <p className="text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
                Selected Venue
              </p>
              <p className="font-heading text-xl font-black tracking-tight text-primary">
                {selectedCourt.name}
              </p>
            </CardContent>
          </Card>

          <Card className="rounded-sm border border-border bg-card">
            <CardContent className="space-y-1 p-4">
              <p className="text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
                Active Weekly Slots
              </p>
              <p className="font-heading text-xl font-black tracking-tight text-primary">
                {totalWeeklySlots}
              </p>
            </CardContent>
          </Card>

          <Card className="rounded-sm border-none bg-secondary text-primary">
            <CardContent className="space-y-1 p-4">
              <p className="text-[10px] uppercase tracking-[0.14em] text-primary/70">
                Slot Mode
              </p>
              <p className="font-heading text-xl font-black tracking-tight">
                Template Based
              </p>
            </CardContent>
          </Card>
        </div>
      )}

      {selectedCourt && (
        <Card className="rounded-sm border border-border bg-card">
          <CardHeader>
            <CardTitle className="font-heading text-lg font-black uppercase tracking-tight text-primary">
              Add Slot
            </CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-5">
            <div className="space-y-1">
              <Label className="text-[10px] font-black uppercase tracking-widest">
                Day
              </Label>
              <select
                value={draftDay}
                onChange={(event) => setDraftDay(Number(event.target.value))}
                className="h-10 w-full border border-input bg-background px-3 text-sm"
              >
                {DAYS.map((day) => (
                  <option key={day.value} value={day.value}>
                    {day.fullLabel}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1">
              <Label className="text-[10px] font-black uppercase tracking-widest">
                Start
              </Label>
              <Input
                type="time"
                value={startTime}
                onChange={(event) => setStartTime(event.target.value)}
              />
            </div>

            <div className="space-y-1">
              <Label className="text-[10px] font-black uppercase tracking-widest">
                End
              </Label>
              <Input
                type="time"
                value={endTime}
                onChange={(event) => setEndTime(event.target.value)}
              />
            </div>

            <div className="space-y-1">
              <Label className="text-[10px] font-black uppercase tracking-widest">
                Price Override
              </Label>
              <Input
                type="number"
                step="0.01"
                placeholder="Optional"
                value={priceOverride}
                onChange={(event) => setPriceOverride(event.target.value)}
              />
            </div>

            <div className="flex items-end sm:col-span-2 lg:col-span-1">
              <Button
                type="button"
                className="h-10 w-full rounded-none bg-secondary text-primary"
                onClick={() => createSlotMutation.mutate()}
                disabled={createSlotMutation.isPending || !effectiveCourtId}
              >
                <IconPlus className="mr-2 size-4" />
                Add Slot
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {selectedCourt && (
        <Card className="rounded-sm border border-border bg-card">
          <CardHeader>
            <CardTitle className="font-heading text-lg font-black uppercase tracking-tight text-primary">
              Weekly Schedule Grid
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="mb-3 flex gap-2 overflow-x-auto pb-1 md:hidden">
              {DAYS.map((day) => (
                <button
                  key={day.value}
                  type="button"
                  className={cn(
                    "rounded-sm border px-3 py-1.5 text-xs font-black uppercase tracking-widest",
                    mobileDay === day.value
                      ? "border-secondary bg-secondary text-primary"
                      : "border-border bg-background text-muted-foreground",
                  )}
                  onClick={() => setMobileDay(day.value)}
                >
                  {day.shortLabel}
                </button>
              ))}
            </div>

            <div className="md:hidden">
              {renderDayColumn(
                DAYS.find((day) => day.value === mobileDay) ?? DAYS[0],
              )}
            </div>

            <div className="hidden gap-3 md:grid md:grid-cols-2 xl:grid-cols-7">
              {DAYS.map((day) => renderDayColumn(day))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
