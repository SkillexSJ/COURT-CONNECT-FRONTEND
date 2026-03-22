"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useFieldArray, useForm } from "react-hook-form";
import { toast } from "sonner";

import { courtService, type CourtAmenity } from "@/service/court.service";
import { scheduleService } from "@/service/schedule.service";

import {
  timeToMinutes,
  venueFormSchema,
  type VenueFormValues,
} from "./venue-form.schema";
import { AmenitiesSection } from "./sections/AmenitiesSection";
import { CourtDetailsSection } from "./sections/CourtDetailsSection";
import { CourtMediaSection } from "./sections/CourtMediaSection";
import { SlotTemplatesSection } from "./sections/SlotTemplatesSection";
import { VenueFormActions } from "./sections/VenueFormActions";
import { VenuePageHeader } from "./sections/VenuePageHeader";

export function VenueAddingPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [amenities, setAmenities] = React.useState<CourtAmenity[]>([]);
  const [isAmenitiesLoading, setIsAmenitiesLoading] = React.useState(true);

  const [primaryImage, setPrimaryImage] = React.useState<File | null>(null);
  const [primaryPreview, setPrimaryPreview] = React.useState<string | null>(
    null,
  );
  const [galleryImages, setGalleryImages] = React.useState<File[]>([]);

  const form = useForm<VenueFormValues>({
    resolver: zodResolver(venueFormSchema),
    defaultValues: {
      name: "",
      type: "Indoor Tennis",
      locationLabel: "",
      description: "",
      basePrice: 0,
      latitude: "",
      longitude: "",
      amenityIds: [],
      slots: [
        {
          dayOfWeek: 1,
          startTime: "08:00",
          endTime: "09:00",
          priceOverride: "",
        },
      ],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "slots",
  });

  React.useEffect(() => {
    const loadAmenities = async () => {
      try {
        setIsAmenitiesLoading(true);
        const response = await courtService.getAmenities();
        setAmenities(response.data || []);
      } catch (error) {
        toast.error(
          error instanceof Error ? error.message : "Failed to load amenities",
        );
      } finally {
        setIsAmenitiesLoading(false);
      }
    };

    void loadAmenities();
  }, []);

  React.useEffect(() => {
    return () => {
      if (primaryPreview) URL.revokeObjectURL(primaryPreview);
    };
  }, [primaryPreview]);

  const handlePrimaryImageChange = (file: File | null) => {
    if (primaryPreview) {
      URL.revokeObjectURL(primaryPreview);
    }

    setPrimaryImage(file);
    setPrimaryPreview(file ? URL.createObjectURL(file) : null);
  };

  const handleGalleryChange = (files: FileList | null) => {
    if (!files || files.length === 0) return;
    const incoming = Array.from(files);
    setGalleryImages((prev) => [...prev, ...incoming].slice(0, 6));
  };

  const toggleAmenity = (amenityId: string) => {
    const selected = form.getValues("amenityIds") ?? [];
    const next = selected.includes(amenityId)
      ? selected.filter((id) => id !== amenityId)
      : [...selected, amenityId];

    form.setValue("amenityIds", next, {
      shouldValidate: true,
      shouldDirty: true,
    });
  };

  const onSubmit = async (values: VenueFormValues) => {
    let createdCourtId: string | undefined;
    let shouldRollbackCourt = false;

    try {
      setIsSubmitting(true);

      const createCourtResponse = await courtService.createCourt({
        name: values.name,
        type: values.type,
        locationLabel: values.locationLabel,
        description: values.description || undefined,
        basePrice: values.basePrice,
        latitude: values.latitude ? Number(values.latitude) : undefined,
        longitude: values.longitude ? Number(values.longitude) : undefined,
        amenityIds: values.amenityIds,
      });

      createdCourtId = createCourtResponse.data?.id;
      if (!createdCourtId) {
        throw new Error("Court created but ID is missing");
      }

      shouldRollbackCourt = true;

      for (const slot of values.slots) {
        await scheduleService.createSlotTemplate(createdCourtId, {
          dayOfWeek: slot.dayOfWeek,
          startMinute: timeToMinutes(slot.startTime),
          endMinute: timeToMinutes(slot.endTime),
          priceOverride:
            slot.priceOverride && slot.priceOverride.trim() !== ""
              ? Number(slot.priceOverride)
              : undefined,
        });
      }

      if (primaryImage || galleryImages.length > 0) {
        await courtService.uploadCourtMedia(createdCourtId, {
          primaryImage,
          galleryImages,
        });
      }

      shouldRollbackCourt = false;

      toast.success("Venue draft submitted for admin approval");

      router.push("/organizer");
      router.refresh();
    } catch (error) {
      if (shouldRollbackCourt && createdCourtId) {
        try {
          await Promise.race([
            courtService.deleteCourt(createdCourtId),
            new Promise((resolve) => setTimeout(resolve, 6000)),
          ]);
        } catch {
          // Best-effort rollback; original error is more important for user feedback.
        }
      }

      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to create venue. Media upload may have failed.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const selectedAmenityIds = form.watch("amenityIds") ?? [];

  return (
    <div className="mx-auto w-full max-w-7xl space-y-10 py-8">
      <VenuePageHeader />

      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-10">
        <CourtDetailsSection form={form} />

        <CourtMediaSection
          primaryPreview={primaryPreview}
          galleryImages={galleryImages}
          onPrimaryChange={handlePrimaryImageChange}
          onGalleryChange={handleGalleryChange}
          onRemoveGalleryImage={(index) =>
            setGalleryImages((prev) => prev.filter((_, i) => i !== index))
          }
        />

        <AmenitiesSection
          amenities={amenities}
          isLoading={isAmenitiesLoading}
          selectedAmenityIds={selectedAmenityIds}
          onToggleAmenity={toggleAmenity}
        />

        <SlotTemplatesSection
          form={form}
          fields={fields}
          append={append}
          onRemove={remove}
        />

        <VenueFormActions
          isSubmitting={isSubmitting}
          onBack={() => router.back()}
        />
      </form>
    </div>
  );
}

export default VenueAddingPage;
