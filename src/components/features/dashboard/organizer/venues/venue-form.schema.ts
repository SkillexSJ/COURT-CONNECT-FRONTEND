import { z } from "zod";

export const slotTemplateSchema = z
  .object({
    dayOfWeek: z.number().min(0).max(6),
    startTime: z.string().min(1, "Start time is required"),
    endTime: z.string().min(1, "End time is required"),
    priceOverride: z.string().optional(),
  })
  .refine(
    (value) => {
      const start = timeToMinutes(value.startTime);
      const end = timeToMinutes(value.endTime);
      return start < end;
    },
    {
      message: "End time must be after start time",
      path: ["endTime"],
    },
  );

export const venueFormSchema = z.object({
  name: z.string().min(3, "Court name must be at least 3 characters"),
  type: z.string().min(2, "Facility type is required"),
  locationLabel: z.string().min(3, "Location is required"),
  description: z.string().max(1000).optional(),
  basePrice: z.number().positive("Base price must be positive"),
  latitude: z
    .string()
    .optional()
    .refine(
      (value) => !value || !Number.isNaN(Number(value)),
      "Invalid latitude",
    ),
  longitude: z
    .string()
    .optional()
    .refine(
      (value) => !value || !Number.isNaN(Number(value)),
      "Invalid longitude",
    ),
  amenityIds: z.array(z.string()).optional(),
  slots: z
    .array(slotTemplateSchema)
    .min(1, "At least one slot template is required"),
});

export type VenueFormValues = z.infer<typeof venueFormSchema>;

export const DAY_OPTIONS = [
  { value: 0, label: "Sunday" },
  { value: 1, label: "Monday" },
  { value: 2, label: "Tuesday" },
  { value: 3, label: "Wednesday" },
  { value: 4, label: "Thursday" },
  { value: 5, label: "Friday" },
  { value: 6, label: "Saturday" },
] as const;

export function timeToMinutes(time: string) {
  const [h, m] = time.split(":").map(Number);
  return h * 60 + m;
}
