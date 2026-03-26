"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { courtService } from "@/service/court.service";
import type { CourtStatus, UpdateCourtPayload } from "@/types/court.types";
import Loading from "@/app/loading";

/**
 * THIS COMPONENT IS ENCOURAGED FROM MY SKILLBRIDGE PROJECT
 */

type VenueDetailsEditorPageProps = {
  role: "ORGANIZER" | "ADMIN";
  slug: string;
};

const STATUS_OPTIONS: CourtStatus[] = [
  "PENDING_APPROVAL",
  "ACTIVE",
  "MAINTENANCE",
  "HIDDEN",
];

type VenueDraft = {
  name: string;
  type: string;
  locationLabel: string;
  description: string;
  basePrice: string;
  status: CourtStatus;
};

export default function VenueDetailsEditorPage({
  role,
  slug,
}: VenueDetailsEditorPageProps) {
  const router = useRouter();
  const [draft, setDraft] = useState<Partial<VenueDraft>>({});

  // QUERY FOR VENUE DETAILS
  const venueQuery = useQuery({
    queryKey: ["venue-details", slug],
    queryFn: async () => {
      const response = await courtService.getCourtBySlug(slug);
      return response.data;
    },
    staleTime: 30_000,
  });

  const venue = venueQuery.data;
  const formValues: VenueDraft = {
    name: draft.name ?? venue?.name ?? "",
    type: draft.type ?? venue?.type ?? "",
    locationLabel: draft.locationLabel ?? venue?.locationLabel ?? "",
    description: draft.description ?? venue?.description ?? "",
    basePrice: draft.basePrice ?? String(venue?.basePrice ?? ""),
    status: draft.status ?? venue?.status ?? "PENDING_APPROVAL",
  };

  // MUTATION FOR UPDATING VENUE DETAILS
  const updateMutation = useMutation({
    mutationFn: async () => {
      if (!venue) {
        toast.error("Venue not found");
        return;
      }

      const payload: UpdateCourtPayload = {
        name: formValues.name,
        type: formValues.type,
        locationLabel: formValues.locationLabel,
        description: formValues.description,
        basePrice: Number(formValues.basePrice),
        status: formValues.status,
      };

      await courtService.updateCourt(venue.id, payload);
    },
    onSuccess: () => {
      toast.success("Venue details updated");
      router.refresh();
    },
    onError: (error) => {
      toast.error(error instanceof Error ? error.message : "Update failed");
    },
  });

  // MUTATION FOR APPROVING VENUE
  const approveMutation = useMutation({
    mutationFn: async () => {
      if (!venue) throw new Error("Venue not loaded");
      await courtService.approveCourtByAdmin(venue.id);
    },
    onSuccess: () => {
      toast.success("Venue approved");
      router.push("/admin/venues");
      router.refresh();
    },
    onError: (error) => {
      toast.error(error instanceof Error ? error.message : "Approval failed");
    },
  });

  // MUTATION FOR REJECTING VENUE
  const rejectMutation = useMutation({
    mutationFn: async () => {
      if (!venue) throw new Error("Venue not loaded");
      await courtService.deleteCourt(venue.id);
    },
    onSuccess: () => {
      toast.success("Venue rejected");
      router.push("/admin/venues");
      router.refresh();
    },
    onError: (error) => {
      toast.error(error instanceof Error ? error.message : "Reject failed");
    },
  });

  const isReadOnly = role === "ADMIN";

  // USEMEMO FOR PAGE TITLE
  const pageTitle = useMemo(() => {
    return role === "ADMIN" ? "Venue Review" : "Edit Venue Details";
  }, [role]);

  if (venueQuery.isLoading) {
    return <Loading />;
  }

  if (!venue) {
    return (
      <Card className="rounded-none border border-red-300 bg-red-50">
        <CardContent className="p-6 text-sm text-red-700">
          Venue not found.
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <header className="space-y-2">
        <h1 className="font-heading text-4xl font-black uppercase tracking-tight text-primary md:text-5xl">
          {pageTitle}
        </h1>
        <p className="text-sm text-muted-foreground">
          {role === "ADMIN"
            ? "Review venue details and approve or reject listing."
            : "Update core venue details and publication status."}
        </p>
      </header>

      <Card className="rounded-none border border-border bg-card">
        <CardHeader>
          <CardTitle className="font-heading text-lg font-black uppercase tracking-tight text-primary">
            Core Details
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="space-y-1">
              <Label>Name</Label>
              <Input
                value={formValues.name}
                onChange={(e) =>
                  setDraft((prev) => ({ ...prev, name: e.target.value }))
                }
                readOnly={isReadOnly}
              />
            </div>

            <div className="space-y-1">
              <Label>Type</Label>
              <Input
                value={formValues.type}
                onChange={(e) =>
                  setDraft((prev) => ({ ...prev, type: e.target.value }))
                }
                readOnly={isReadOnly}
              />
            </div>

            <div className="space-y-1">
              <Label>Location Label</Label>
              <Input
                value={formValues.locationLabel}
                onChange={(e) =>
                  setDraft((prev) => ({
                    ...prev,
                    locationLabel: e.target.value,
                  }))
                }
                readOnly={isReadOnly}
              />
            </div>

            <div className="space-y-1">
              <Label>Base Price</Label>
              <Input
                type="number"
                step="0.01"
                value={formValues.basePrice}
                onChange={(e) =>
                  setDraft((prev) => ({ ...prev, basePrice: e.target.value }))
                }
                readOnly={isReadOnly}
              />
            </div>
          </div>

          <div className="space-y-1">
            <Label>Description</Label>
            <textarea
              value={formValues.description}
              onChange={(e) =>
                setDraft((prev) => ({ ...prev, description: e.target.value }))
              }
              readOnly={isReadOnly}
              rows={5}
              className="w-full rounded-sm border border-input bg-background px-3 py-2 text-sm"
            />
          </div>

          <div className="space-y-1 md:max-w-xs">
            <Label>Status</Label>
            {isReadOnly ? (
              <Input value={formValues.status} readOnly />
            ) : (
              <select
                value={formValues.status}
                onChange={(event) =>
                  setDraft((prev) => ({
                    ...prev,
                    status: event.target.value as CourtStatus,
                  }))
                }
                className="h-10 w-full rounded-sm border border-input bg-background px-3 text-sm"
              >
                {STATUS_OPTIONS.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            )}
          </div>
        </CardContent>
      </Card>

      <div className="flex flex-wrap gap-3">
        <Button
          type="button"
          variant="outline"
          className="rounded-none"
          onClick={() => router.back()}
        >
          Back
        </Button>

        {role === "ORGANIZER" && (
          <Button
            type="button"
            className="rounded-none bg-secondary text-primary"
            onClick={() => updateMutation.mutate()}
            disabled={updateMutation.isPending}
          >
            Save Changes
          </Button>
        )}

        {role === "ADMIN" && (
          <>
            <Button
              type="button"
              className="rounded-none bg-secondary text-primary"
              onClick={() => approveMutation.mutate()}
              disabled={approveMutation.isPending}
            >
              Approve Venue
            </Button>
            <Button
              type="button"
              variant="destructive"
              className="rounded-none"
              onClick={() => rejectMutation.mutate()}
              disabled={rejectMutation.isPending}
            >
              Reject Venue
            </Button>
          </>
        )}
      </div>
    </div>
  );
}
