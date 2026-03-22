import type {
  FieldArrayWithId,
  UseFieldArrayAppend,
  UseFormReturn,
} from "react-hook-form";
import { IconPlus, IconTrash } from "@tabler/icons-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { DAY_OPTIONS, type VenueFormValues } from "../venue-form.schema";

type Props = {
  form: UseFormReturn<VenueFormValues>;
  fields: FieldArrayWithId<VenueFormValues, "slots", "id">[];
  append: UseFieldArrayAppend<VenueFormValues, "slots">;
  onRemove: (index: number) => void;
};

export function SlotTemplatesSection({
  form,
  fields,
  append,
  onRemove,
}: Props) {
  return (
    <Card className="rounded-sm border-border bg-card">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="font-heading text-xl font-black uppercase tracking-tight text-primary">
          IV. Slot Templates
        </CardTitle>
        <Button
          type="button"
          variant="outline"
          onClick={() =>
            append({
              dayOfWeek: 1,
              startTime: "08:00",
              endTime: "09:00",
              priceOverride: "",
            })
          }
        >
          <IconPlus className="mr-2 size-4" /> Add Slot
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        {fields.map((field, index) => (
          <div
            key={field.id}
            className="space-y-3 border border-border bg-background p-4"
          >
            <div className="grid gap-3 md:grid-cols-4">
              <div className="space-y-1">
                <Label className="text-[10px] font-black tracking-widest uppercase">
                  Day
                </Label>
                <select
                  {...form.register(`slots.${index}.dayOfWeek` as const, {
                    valueAsNumber: true,
                  })}
                  className="h-10 w-full border border-input bg-background px-3 text-sm"
                >
                  {DAY_OPTIONS.map((day) => (
                    <option key={day.value} value={day.value}>
                      {day.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <Label className="text-[10px] font-black tracking-widest uppercase">
                  Start
                </Label>
                <Input
                  type="time"
                  {...form.register(`slots.${index}.startTime` as const)}
                />
              </div>

              <div className="space-y-1">
                <Label className="text-[10px] font-black tracking-widest uppercase">
                  End
                </Label>
                <Input
                  type="time"
                  {...form.register(`slots.${index}.endTime` as const)}
                />
              </div>

              <div className="space-y-1">
                <Label className="text-[10px] font-black tracking-widest uppercase">
                  Price Override
                </Label>
                <Input
                  type="number"
                  step="0.01"
                  placeholder="Optional"
                  {...form.register(`slots.${index}.priceOverride` as const)}
                />
              </div>
            </div>

            {form.formState.errors.slots?.[index]?.endTime?.message && (
              <p className="text-xs text-destructive">
                {form.formState.errors.slots[index]?.endTime?.message}
              </p>
            )}

            <div className="flex justify-end">
              <Button
                type="button"
                variant="ghost"
                className="text-destructive"
                onClick={() => onRemove(index)}
                disabled={fields.length === 1}
              >
                <IconTrash className="mr-2 size-4" /> Remove
              </Button>
            </div>
          </div>
        ))}

        {typeof form.formState.errors.slots?.message === "string" && (
          <p className="text-xs text-destructive">
            {form.formState.errors.slots.message}
          </p>
        )}
      </CardContent>
    </Card>
  );
}
