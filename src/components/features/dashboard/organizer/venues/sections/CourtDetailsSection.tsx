import type { UseFormReturn } from "react-hook-form";
import { useState } from "react";
import { aiService } from "@/service/ai.service";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { IconMapPin } from "@tabler/icons-react";
import { SPORT_TYPES } from "@/lib/constants/sports";

import type { VenueFormValues } from "../venue-form.schema";

type Props = {
  form: UseFormReturn<VenueFormValues>;
};

export function CourtDetailsSection({ form }: Props) {
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerateAI = async () => {
    const name = form.watch("name");
    const type = form.watch("type");
    const locationLabel = form.watch("locationLabel");

    setIsGenerating(true);
    try {
      const response = await aiService.generateDescription({
        name,
        type,
        locationLabel,
      });
      if (response.success && response.data?.description) {
        form.setValue("description", response.data.description, {
          shouldValidate: true,
          shouldDirty: true,
        });
      }
    } catch (error) {
      console.error("AI Generation failed:", error);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <Card className="rounded-sm border-border bg-card">
      <CardHeader>
        <CardTitle className="font-heading text-xl font-black uppercase tracking-tight text-primary">
          I. Court Details
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid gap-6 md:grid-cols-2">
          <div className="space-y-2">
            <Label className="text-[10px] font-black tracking-widest text-primary/70 uppercase">
              Court Name
            </Label>
            <Input
              {...form.register("name")}
              placeholder="e.g., Center Court Elite"
            />
            {form.formState.errors.name && (
              <p className="text-xs text-destructive">
                {form.formState.errors.name.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label className="text-[10px] font-black tracking-widest text-primary/70 uppercase">
              Facility Type
            </Label>
            <select
              {...form.register("type")}
              className="h-10 w-full border border-input bg-background px-3 text-sm"
            >
              {SPORT_TYPES.map((sportType) => (
                <option key={sportType} value={sportType}>
                  {sportType}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="space-y-2">
          <Label className="text-[10px] font-black tracking-widest text-primary/70 uppercase">
            Location Identity
          </Label>
          <div className="relative">
            <IconMapPin className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              {...form.register("locationLabel")}
              className="pl-9"
              placeholder="e.g., Greenwich, London"
            />
          </div>
          {form.formState.errors.locationLabel && (
            <p className="text-xs text-destructive">
              {form.formState.errors.locationLabel.message}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label className="text-[10px] font-black tracking-widest text-primary/70 uppercase">
              Court Narrative (Description)
            </Label>
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="h-7 px-3 text-[10px] font-black uppercase tracking-wider bg-linear-to-r from-violet-500 to-fuchsia-500 text-white hover:opacity-90 border-0"
              onClick={handleGenerateAI}
              disabled={isGenerating}
            >
              {isGenerating ? "Generating..." : "✨ Auto-Write"}
            </Button>
          </div>
          <textarea
            {...form.register("description")}
            rows={4}
            className="w-full border border-input bg-background p-3 text-sm"
            placeholder="Describe surface, lighting, and exclusive amenities..."
          />
          <div className="flex items-center justify-between text-[10px] text-muted-foreground">
            <span>Recommended: 150-300 characters</span>
            <span>{form.watch("description")?.length || 0} / 1000</span>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          <div className="space-y-2">
            <Label className="text-[10px] font-black tracking-widest text-primary/70 uppercase">
              Base Price (Per Slot)
            </Label>
            <Input
              type="number"
              step="0.01"
              {...form.register("basePrice", { valueAsNumber: true })}
              placeholder="0.00"
            />
            {form.formState.errors.basePrice && (
              <p className="text-xs text-destructive">
                {form.formState.errors.basePrice.message}
              </p>
            )}
          </div>
          <div className="space-y-2">
            <Label className="text-[10px] font-black tracking-widest text-primary/70 uppercase">
              Latitude
            </Label>
            <Input {...form.register("latitude")} placeholder="Optional" />
          </div>
          <div className="space-y-2">
            <Label className="text-[10px] font-black tracking-widest text-primary/70 uppercase">
              Longitude
            </Label>
            <Input {...form.register("longitude")} placeholder="Optional" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
