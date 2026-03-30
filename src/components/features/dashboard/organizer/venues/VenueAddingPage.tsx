"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery } from "@tanstack/react-query";
import { useFieldArray, useForm } from "react-hook-form";
import { toast } from "sonner";

import { scheduleService } from "@/service/schedule.service";

import {
  timeToMinutes,
  venueFormSchema,
  type VenueFormValues,
} from "./venue-form.schema";

// IMPORTING SECTIONS
import { AmenitiesSection } from "./sections/AmenitiesSection";
import { CourtDetailsSection } from "./sections/CourtDetailsSection";
import { CourtMediaSection } from "./sections/CourtMediaSection";
import { SlotTemplatesSection } from "./sections/SlotTemplatesSection";
import { VenueFormActions } from "./sections/VenueFormActions";
import { VenuePageHeader } from "./sections/VenuePageHeader";
import { CourtAmenity } from "@/types/court.types";
import { courtService } from "@/service/court.service";
import { organizerService } from "@/service/organizer.service";
import { DashboardSkeleton } from "@/components/features/dashboard/shared/dashboard-skeleton";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { SPORT_TYPES } from "@/lib/constants/sports";

export function VenueAddingPage() {
  const router = useRouter();

  /**
   * STATES
   */
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [amenities, setAmenities] = React.useState<CourtAmenity[]>([]);
  const [isAmenitiesLoading, setIsAmenitiesLoading] = React.useState(true);

  const [primaryImage, setPrimaryImage] = React.useState<File | null>(null);
  const [primaryPreview, setPrimaryPreview] = React.useState<string | null>(
    null,
  );
  const [galleryImages, setGalleryImages] = React.useState<File[]>([]);

  // QUERY FOR ORGANIZER PROFILE
  const organizerProfileQuery = useQuery({
    queryKey: ["organizer-profile-for-venue-create"],
    queryFn: () => organizerService.getProfile(),
    staleTime: 30_000,
  });

  // REACT HOOK FORM
  const form = useForm<VenueFormValues>({
    resolver: zodResolver(venueFormSchema),
    defaultValues: {
      name: "",
      type: SPORT_TYPES[0],
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

  // USE EFFECT FOR LOADING AMENITIES
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

  // USE EFFECT FOR CLEANING UP OBJECT URLS
  React.useEffect(() => {
    return () => {
      if (primaryPreview) URL.revokeObjectURL(primaryPreview);
    };
  }, [primaryPreview]);

  /**
   *
   * HANDLERS FOR IMAGE UPLOADS AND OTHER
   */
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

  const isOrganizerVerified = Boolean(
    organizerProfileQuery.data?.data?.isVerified,
  );
  const profileLoadFailed = organizerProfileQuery.isError;

  if (organizerProfileQuery.isPending) {
    return <DashboardSkeleton />;
  }

  if (profileLoadFailed || !isOrganizerVerified) {
    const message = profileLoadFailed
      ? "You need an organizer profile before creating a venue."
      : "Your organizer profile is pending verification. You cannot create venues yet.";

    return (
      <div className="mx-auto w-full max-w-7xl space-y-10 py-8">
        <VenuePageHeader />
        <Card className="rounded-none border border-border bg-card">
          <CardContent className="space-y-4 p-6">
            <p className="text-sm text-muted-foreground">{message}</p>
            <Button
              type="button"
              className="rounded-none"
              onClick={() => router.push("/organizer")}
            >
              Back to Organizer Dashboard
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

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
