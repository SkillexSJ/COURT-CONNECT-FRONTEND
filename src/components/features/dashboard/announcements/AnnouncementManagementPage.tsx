"use client";

import { useMemo, useState } from "react";
import { format } from "date-fns";
import { useMutation, useQuery, useQueryClient, keepPreviousData } from "@tanstack/react-query";
import { Megaphone, BellRing, Building2 } from "lucide-react";
import { toast } from "sonner";

import { DashboardStatCard } from "@/components/features/dashboard/shared/DashboardStatCard";
import { DashboardSkeleton } from "@/components/features/dashboard/shared/dashboard-skeleton";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { queryKeys } from "@/lib/query/query-keys";
import { announcementService } from "@/service/announcement.service";
import { courtService } from "@/service/court.service";
import type { CourtListItem } from "@/types/court.types";
import type {
  Announcement,
  AnnouncementType,
  CreateAnnouncementPayload,
  UpdateAnnouncementPayload,
} from "@/types/announcement.types";

/**
 * ANNOUNCEMENT MANAGEMENT PAGE WITH MODAL AND ROLE BASED VIEW
 */

type Role = "ADMIN" | "ORGANIZER";

type AnnouncementManagementPageProps = {
  role: Role;
};

type AnnouncementFormState = {
  title: string;
  content: string;
  type: AnnouncementType;
  imageUrl: string;
  isPublished: boolean;
  courtId: string;
};

const defaultFormState: AnnouncementFormState = {
  title: "",
  content: "",
  type: "INFO",
  imageUrl: "",
  isPublished: true,
  courtId: "",
};

const typeClassMap: Record<AnnouncementType, string> = {
  INFO: "bg-secondary/20 text-primary",
  MAINTENANCE: "bg-amber-100 text-amber-700",
  PROMOTION: "bg-emerald-100 text-emerald-700",
};

const formatDateLabel = (value: string | null) => {
  if (!value) return "Draft";

  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return "Invalid date";

  return format(parsed, "MMM dd, yyyy");
};

const toFormState = (announcement: Announcement): AnnouncementFormState => ({
  title: announcement.title,
  content: announcement.content,
  type: announcement.type,
  imageUrl: announcement.imageUrl ?? "",
  isPublished: announcement.isPublished,
  courtId: announcement.courtId ?? "",
});

export default function AnnouncementManagementPage({
  role,
}: AnnouncementManagementPageProps) {
  const queryClient = useQueryClient();

  // STATES
  const [search, setSearch] = useState("");
  const [openFormDialog, setOpenFormDialog] = useState(false);
  const [editingAnnouncement, setEditingAnnouncement] =
    useState<Announcement | null>(null);
  const [form, setForm] = useState<AnnouncementFormState>(defaultFormState);
  const [selectedCourtId, setSelectedCourtId] = useState("");

  // QUERY FOR GETTING ORGANIZER COURTS
  const organizerCourtsQuery = useQuery<CourtListItem[]>({
    queryKey: ["organizer-announcement-courts"],
    queryFn: async () => {
      const response = await courtService.getOrganizerCourts({ limit: 100 });
      return response.data ?? [];
    },
    enabled: role === "ORGANIZER",
    staleTime: 60_000,
  });

  const organizerCourts = organizerCourtsQuery.data ?? [];

  const activeCourtId =
    selectedCourtId ||
    (role === "ORGANIZER" ? (organizerCourts[0]?.id ?? "") : "");

  const announcementQueryParams = useMemo(() => {
    const base = {
      page: 1,
      limit: 200,
      sortBy: "-createdAt",
      searchTerm: search.trim() || undefined,
      audience: role === "ADMIN" ? ("HOME" as const) : ("VENUE" as const),
    };

    if (role === "ORGANIZER" && activeCourtId) {
      return { ...base, courtId: activeCourtId };
    }

    return base;
  }, [activeCourtId, role, search]);

  // QUERIE FOR GETTING ANNOUNCEMENTS
  const announcementsQuery = useQuery({
    queryKey: queryKeys.announcements.list(announcementQueryParams),
    queryFn: () =>
      announcementService.getAllAnnouncements(announcementQueryParams),
    enabled: role === "ADMIN" || Boolean(activeCourtId),
    staleTime: 30_000,
    placeholderData: keepPreviousData,
  });

  const isInitialLoading =
    (announcementsQuery.isPending && (role === "ADMIN" || Boolean(activeCourtId))) ||
    (role === "ORGANIZER" && organizerCourtsQuery.isPending);

  if (isInitialLoading) {
    return <DashboardSkeleton />;
  }

  // MEMOIZED VALUES
  const announcements = useMemo(
    () => announcementsQuery.data?.data ?? [],
    [announcementsQuery.data?.data],
  );

  const publishedCount = announcements.filter(
    (item) => item.isPublished,
  ).length;
  const draftCount = announcements.length - publishedCount;

  // MUTATIONS
  const createAnnouncementMutation = useMutation({
    mutationFn: (payload: CreateAnnouncementPayload) =>
      announcementService.createAnnouncement(payload),
    onSuccess: async () => {
      toast.success("Announcement created");
      setOpenFormDialog(false);
      setEditingAnnouncement(null);
      setForm(defaultFormState);
      await queryClient.invalidateQueries({
        queryKey: queryKeys.announcements.all,
      });
    },
    onError: (error) => {
      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to create announcement",
      );
    },
  });

  const updateAnnouncementMutation = useMutation({
    mutationFn: ({
      announcementId,
      payload,
    }: {
      announcementId: string;
      payload: UpdateAnnouncementPayload;
    }) => announcementService.updateAnnouncement(announcementId, payload),
    onSuccess: async () => {
      toast.success("Announcement updated");
      setOpenFormDialog(false);
      setEditingAnnouncement(null);
      setForm(defaultFormState);
      await queryClient.invalidateQueries({
        queryKey: queryKeys.announcements.all,
      });
    },
    onError: (error) => {
      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to update announcement",
      );
    },
  });

  const deleteAnnouncementMutation = useMutation({
    mutationFn: (announcementId: string) =>
      announcementService.deleteAnnouncement(announcementId),
    onSuccess: async () => {
      toast.success("Announcement deleted");
      await queryClient.invalidateQueries({
        queryKey: queryKeys.announcements.all,
      });
    },
    onError: (error) => {
      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to delete announcement",
      );
    },
  });

  // HANDLER FOR SUBMITTING ANNOUNCEMENT
  const handleSubmitAnnouncement = () => {
    const title = form.title.trim();
    const content = form.content.trim();
    const imageUrl = form.imageUrl.trim();

    if (title.length < 3) {
      toast.error("Title must be at least 3 characters");
      return;
    }

    if (content.length < 10) {
      toast.error("Content must be at least 10 characters");
      return;
    }

    if (role === "ORGANIZER" && !editingAnnouncement && !activeCourtId) {
      toast.error("Select a venue before creating an announcement");
      return;
    }

    // PAYLOADS FOR CREATE AND UPDATE
    const createPayload: CreateAnnouncementPayload = {
      title,
      content,
      type: form.type,
      isPublished: form.isPublished,
      imageUrl: imageUrl || undefined,
      audience: role === "ADMIN" ? "HOME" : "VENUE",
      courtId: role === "ORGANIZER" ? activeCourtId || undefined : undefined,
    };

    const updatePayload: UpdateAnnouncementPayload = {
      title,
      content,
      type: form.type,
      isPublished: form.isPublished,
      imageUrl: imageUrl || null,
    };

    if (editingAnnouncement) {
      updateAnnouncementMutation.mutate({
        announcementId: editingAnnouncement.id,
        payload: updatePayload,
      });
      return;
    }

    createAnnouncementMutation.mutate(createPayload);
  };

  // MEMOIZED VALUES
  const selectedCourtName = useMemo(() => {
    if (!activeCourtId) return "";
    return (
      organizerCourts.find((court) => court.id === activeCourtId)?.name ?? ""
    );
  }, [activeCourtId, organizerCourts]);

  return (
    <div className="space-y-6">
      <header className="space-y-2">
        <h1 className="font-heading text-4xl font-black uppercase tracking-tight text-primary md:text-5xl">
          Announcement Control
        </h1>
        <p className="text-sm text-muted-foreground">
          {role === "ADMIN"
            ? "Create and publish announcements for the public home landing page."
            : "Create and publish venue-specific announcements for your audience."}
        </p>
      </header>

      {/* STATS CARD */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <DashboardStatCard
          label="Total"
          value={String(announcements.length)}
          icon={Megaphone}
          subtitle="Announcements in current scope"
        />
        <DashboardStatCard
          label="Published"
          value={String(publishedCount)}
          icon={BellRing}
          subtitle="Visible to users"
        />
        <DashboardStatCard
          label="Drafts"
          value={String(draftCount)}
          icon={Building2}
          subtitle={
            role === "ADMIN"
              ? "Pending home publication"
              : "Pending venue publication"
          }
          accent
        />
      </div>

      <Card className="rounded-none border border-border bg-card">
        <CardHeader className="space-y-3">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <CardTitle className="font-heading text-lg font-black uppercase tracking-tight text-primary">
              Announcements Table
            </CardTitle>

            <Dialog
              open={openFormDialog}
              onOpenChange={(nextOpen) => {
                setOpenFormDialog(nextOpen);
                if (!nextOpen) {
                  setEditingAnnouncement(null);
                  setForm(defaultFormState);
                }
              }}
            >
              <DialogTrigger asChild>
                <Button
                  type="button"
                  variant="secondary"
                  className="rounded-none"
                  onClick={() => {
                    setEditingAnnouncement(null);
                    setForm(defaultFormState);
                  }}
                >
                  Add Announcement
                </Button>
              </DialogTrigger>

              <DialogContent className="max-w-2xl rounded-none">
                <DialogHeader>
                  <DialogTitle className="font-heading text-xl font-black uppercase tracking-tight text-primary">
                    {editingAnnouncement
                      ? "Edit Announcement"
                      : "Create New Announcement"}
                  </DialogTitle>
                  <DialogDescription>
                    {editingAnnouncement
                      ? "Update content, status, and message type for this announcement."
                      : "Create a new announcement and choose whether to publish immediately."}
                  </DialogDescription>
                </DialogHeader>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="announcement-title">Title</Label>
                    <Input
                      id="announcement-title"
                      value={form.title}
                      onChange={(event) =>
                        setForm((prev) => ({
                          ...prev,
                          title: event.target.value,
                        }))
                      }
                      placeholder="Venue maintenance update"
                      className="rounded-none"
                    />
                  </div>

                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="announcement-content">Content</Label>
                    <textarea
                      id="announcement-content"
                      value={form.content}
                      onChange={(event) =>
                        setForm((prev) => ({
                          ...prev,
                          content: event.target.value,
                        }))
                      }
                      placeholder="Write the announcement details here..."
                      rows={5}
                      className="w-full rounded-none border border-input bg-transparent px-3 py-2 text-sm outline-none ring-offset-background focus-visible:ring-2 focus-visible:ring-ring"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="announcement-type">Type</Label>
                    <select
                      id="announcement-type"
                      value={form.type}
                      onChange={(event) =>
                        setForm((prev) => ({
                          ...prev,
                          type: event.target.value as AnnouncementType,
                        }))
                      }
                      className="h-9 w-full rounded-none border border-input bg-transparent px-3 text-sm"
                    >
                      <option value="INFO">Info</option>
                      <option value="MAINTENANCE">Maintenance</option>
                      <option value="PROMOTION">Promotion</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="announcement-image-url">Image URL</Label>
                    <Input
                      id="announcement-image-url"
                      value={form.imageUrl}
                      onChange={(event) =>
                        setForm((prev) => ({
                          ...prev,
                          imageUrl: event.target.value,
                        }))
                      }
                      placeholder="https://example.com/banner.jpg"
                      className="rounded-none"
                    />
                  </div>

                  {role === "ORGANIZER" ? (
                    <div className="space-y-2">
                      <Label htmlFor="announcement-court">Venue</Label>
                      <select
                        id="announcement-court"
                        value={activeCourtId}
                        onChange={(event) =>
                          setSelectedCourtId(event.target.value)
                        }
                        disabled={
                          organizerCourts.length === 0 ||
                          Boolean(editingAnnouncement)
                        }
                        className="h-9 w-full rounded-none border border-input bg-transparent px-3 text-sm"
                      >
                        {organizerCourts.map((court) => (
                          <option key={court.id} value={court.id}>
                            {court.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <Label>Audience</Label>
                      <div className="flex h-9 items-center border border-input px-3 text-sm">
                        Home Landing Page
                      </div>
                    </div>
                  )}

                  <div className="flex items-center gap-2">
                    <input
                      id="announcement-is-published"
                      type="checkbox"
                      checked={form.isPublished}
                      onChange={(event) =>
                        setForm((prev) => ({
                          ...prev,
                          isPublished: event.target.checked,
                        }))
                      }
                      className="size-4 rounded border-input"
                    />
                    <Label
                      htmlFor="announcement-is-published"
                      className="text-sm"
                    >
                      Publish immediately
                    </Label>
                  </div>
                </div>

                <DialogFooter>
                  <Button
                    type="button"
                    onClick={handleSubmitAnnouncement}
                    className="rounded-none"
                    disabled={
                      createAnnouncementMutation.isPending ||
                      updateAnnouncementMutation.isPending
                    }
                  >
                    {editingAnnouncement
                      ? "Save Changes"
                      : "Create Announcement"}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>

          <div className="grid grid-cols-1 gap-3 md:grid-cols-[1fr_auto]">
            <Input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search announcements by title or content..."
              className="rounded-none"
            />

            {role === "ORGANIZER" ? (
              <select
                value={activeCourtId}
                onChange={(event) => setSelectedCourtId(event.target.value)}
                className="h-9 rounded-none border border-input bg-transparent px-3 text-sm"
              >
                {organizerCourts.map((court) => (
                  <option key={court.id} value={court.id}>
                    {court.name}
                  </option>
                ))}
              </select>
            ) : null}
          </div>

          {role === "ORGANIZER" && selectedCourtName ? (
            <p className="text-xs uppercase tracking-[0.12em] text-muted-foreground">
              Active Venue: {selectedCourtName}
            </p>
          ) : null}
        </CardHeader>

        <CardContent>
          {role === "ORGANIZER" && organizerCourts.length === 0 ? (
            <div className="rounded-none border border-border bg-card p-6 text-sm text-muted-foreground">
              Add a venue first. Organizer announcements can only be attached to
              your own venues.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Audience</TableHead>
                    <TableHead>Last Updated</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {announcementsQuery.isLoading ? (
                    Array.from({ length: 5 }).map((_, index) => (
                      <TableRow key={index}>
                        <TableCell colSpan={6}>
                          <div className="h-6 w-full animate-pulse rounded bg-muted" />
                        </TableCell>
                      </TableRow>
                    ))
                  ) : announcements.length === 0 ? (
                    <TableRow>
                      <TableCell
                        colSpan={6}
                        className="py-8 text-center text-muted-foreground"
                      >
                        No announcements found for this scope.
                      </TableCell>
                    </TableRow>
                  ) : (
                    announcements.map((announcement) => (
                      <TableRow key={announcement.id}>
                        <TableCell className="max-w-75 align-top">
                          <p className="line-clamp-1 font-medium text-foreground">
                            {announcement.title}
                          </p>
                          <p className="line-clamp-2 text-xs text-muted-foreground">
                            {announcement.content}
                          </p>
                        </TableCell>

                        <TableCell>
                          <Badge
                            className={`rounded-none px-2 py-1 text-[10px] uppercase tracking-[0.14em] ${
                              typeClassMap[announcement.type]
                            }`}
                          >
                            {announcement.type}
                          </Badge>
                        </TableCell>

                        <TableCell>
                          <Badge
                            className={`rounded-none px-2 py-1 text-[10px] uppercase tracking-[0.14em] ${
                              announcement.isPublished
                                ? "bg-secondary text-primary"
                                : "bg-muted text-muted-foreground"
                            }`}
                          >
                            {announcement.isPublished ? "Published" : "Draft"}
                          </Badge>
                        </TableCell>

                        <TableCell>
                          <p className="text-xs uppercase tracking-[0.12em] text-muted-foreground">
                            {announcement.audience}
                          </p>
                        </TableCell>

                        <TableCell>
                          {formatDateLabel(
                            announcement.updatedAt ?? announcement.publishedAt,
                          )}
                        </TableCell>

                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button
                              type="button"
                              variant="outline"
                              className="rounded-none"
                              onClick={() => {
                                setEditingAnnouncement(announcement);
                                setForm(toFormState(announcement));
                                setOpenFormDialog(true);
                                if (announcement.courtId) {
                                  setSelectedCourtId(announcement.courtId);
                                }
                              }}
                            >
                              Edit
                            </Button>

                            <Button
                              type="button"
                              variant="outline"
                              className="rounded-none text-destructive"
                              onClick={() =>
                                deleteAnnouncementMutation.mutate(
                                  announcement.id,
                                )
                              }
                              disabled={deleteAnnouncementMutation.isPending}
                            >
                              Delete
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
