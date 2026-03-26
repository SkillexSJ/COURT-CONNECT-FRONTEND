"use client";

import { useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { Card, CardContent } from "@/components/ui/card";
import { organizerService } from "@/service/organizer.service";
import { userService } from "@/service/user.service";
import Loading from "@/app/loading";
import { ProfileSettingsHeader } from "./profile-settings/ProfileSettingsHeader";
import { ProfileSettingsMainColumn } from "./profile-settings/ProfileSettingsMainColumn";
import { ProfileSettingsSidebar } from "./profile-settings/ProfileSettingsSidebar";
import type {
  ChangeOrganizerField,
  ChangeProfileField,
  OrganizerFormState,
  ProfileFormState,
  ProfileMode,
} from "./profile-settings/types";

// HELPERS
const normalizeNullableString = (value: string) => {
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : null;
};

const normalizeOptionalString = (value: string) => {
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : undefined;
};

interface ProfileSettingsPageProps {
  mode: ProfileMode;
  headerTitle?: string;
  headerDescription?: string;
}

export function ProfileSettingsPage({
  mode,
  headerTitle,
  headerDescription,
}: ProfileSettingsPageProps) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // STATES
  const [profileDraft, setProfileDraft] = useState<ProfileFormState | null>(
    null,
  );
  const [organizerDraft, setOrganizerDraft] =
    useState<OrganizerFormState | null>(null);

  // QUERIES FOR PROFILE SETTINGS
  const userQuery = useQuery({
    queryKey: ["profile-user", mode],
    queryFn: () => userService.getProfile(),
    staleTime: 30_000,
  });

  const userData = userQuery.data?.data;
  const shouldLoadOrganizerProfile =
    mode === "ORGANIZER" || userData?.role === "ORGANIZER";

  // QUERY FOR ORGANIZER PROFILE
  const organizerQuery = useQuery({
    queryKey: ["profile-organizer", mode],
    queryFn: () => organizerService.getProfile(),
    staleTime: 30_000,
    enabled: shouldLoadOrganizerProfile,
  });

  const organizerData = organizerQuery.data?.data;
  const effectiveMode: ProfileMode =
    mode === "ORGANIZER" ? "ORGANIZER" : (userData?.role ?? mode);

  // MEMOIZED INITIAL PROFILE FORM
  const initialProfileForm = useMemo<ProfileFormState>(
    () => ({
      name: userData?.name ?? "",
      phone: userData?.phone ?? "",
    }),
    [userData?.name, userData?.phone],
  );

  const initialOrganizerForm = useMemo<OrganizerFormState>(
    () => ({
      businessName: organizerData?.businessName ?? "",
      website: organizerData?.website ?? "",
      phoneNumber: organizerData?.phoneNumber ?? "",
      address: organizerData?.address ?? "",
      bio: organizerData?.bio ?? "",
    }),
    [
      organizerData?.address,
      organizerData?.bio,
      organizerData?.businessName,
      organizerData?.phoneNumber,
      organizerData?.website,
    ],
  );

  const profileForm = profileDraft ?? initialProfileForm;
  const organizerForm = organizerDraft ?? initialOrganizerForm;

  const updateUserMutation = useMutation({
    mutationFn: (payload: Parameters<typeof userService.updateProfile>[0]) =>
      userService.updateProfile(payload),
  });

  const updateOrganizerMutation = useMutation({
    mutationFn: (
      payload: Parameters<typeof organizerService.updateProfile>[0],
    ) => organizerService.updateProfile(payload),
  });

  const createOrganizerMutation = useMutation({
    mutationFn: (
      payload: Parameters<typeof organizerService.createProfile>[0],
    ) => organizerService.createProfile(payload),
  });

  const uploadAvatarMutation = useMutation({
    mutationFn: (file: File) => userService.uploadAvatar(file),
    onSuccess: async () => {
      toast.success("Profile image updated");
      await queryClient.invalidateQueries({ queryKey: ["profile-user"] });
      router.refresh();
    },
    onError: (error) => {
      toast.error(
        error instanceof Error ? error.message : "Failed to upload avatar",
      );
    },
  });

  const isSaving =
    updateUserMutation.isPending ||
    createOrganizerMutation.isPending ||
    updateOrganizerMutation.isPending ||
    uploadAvatarMutation.isPending;

  const roleLabel = useMemo(() => {
    if (effectiveMode === "ORGANIZER") return "Organizer";
    if (effectiveMode === "ADMIN") return "Admin";
    return "User";
  }, [effectiveMode]);

  const bookingCount = userData?._count?.bookings ?? 0;
  const venueCount = organizerData?._count?.courts ?? 0;

  const handleDiscard = () => {
    setProfileDraft(null);
    setOrganizerDraft(null);

    toast.success("Changes discarded");
  };

  /**
   * HANDLERS 
   * 
   */
  const handleSave = async () => {
    if (!profileForm.name.trim()) {
      toast.error("Name is required");
      return;
    }

    if (effectiveMode === "ORGANIZER" && !organizerForm.businessName.trim()) {
      toast.error("Business name is required");
      return;
    }

    try {
      await updateUserMutation.mutateAsync({
        name: profileForm.name.trim(),
        phone: normalizeNullableString(profileForm.phone),
      });

      if (effectiveMode === "ORGANIZER") {
        if (organizerData?.id) {
          await updateOrganizerMutation.mutateAsync({
            businessName: organizerForm.businessName.trim(),
            website: normalizeNullableString(organizerForm.website),
            phoneNumber: normalizeNullableString(organizerForm.phoneNumber),
            address: normalizeNullableString(organizerForm.address),
            bio: normalizeNullableString(organizerForm.bio),
          });
        } else {
          await createOrganizerMutation.mutateAsync({
            businessName: organizerForm.businessName.trim(),
            website: normalizeOptionalString(organizerForm.website),
            phoneNumber: normalizeOptionalString(organizerForm.phoneNumber),
            address: normalizeOptionalString(organizerForm.address),
            bio: normalizeOptionalString(organizerForm.bio),
          });
        }
      }

      await queryClient.invalidateQueries({ queryKey: ["profile-user"] });
      if (effectiveMode === "ORGANIZER") {
        await queryClient.invalidateQueries({
          queryKey: ["profile-organizer"],
        });
      }

      if (effectiveMode === "ORGANIZER" && !organizerData?.id) {
        toast.success("Organizer profile created successfully");
        router.push("/organizer/settings");
        router.refresh();
        return;
      }

      toast.success("Profile settings saved");
      router.refresh();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to save settings",
      );
    }
  };

  const handleUploadAvatar = async (file?: File) => {
    if (!file) return;
    await uploadAvatarMutation.mutateAsync(file);
  };

  const handleProfileFieldChange: ChangeProfileField = (key, value) => {
    setProfileDraft({
      ...profileForm,
      [key]: value,
    });
  };

  const handleOrganizerFieldChange: ChangeOrganizerField = (key, value) => {
    setOrganizerDraft({
      ...organizerForm,
      [key]: value,
    });
  };

  if (
    userQuery.isLoading ||
    (effectiveMode === "ORGANIZER" && organizerQuery.isLoading)
  ) {
    return <Loading />;
  }

  if (!userData) {
    return (
      <Card className="rounded-none border border-border bg-card">
        <CardContent className="p-6 text-sm text-destructive">
          Failed to load profile. Please refresh and try again.
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <ProfileSettingsHeader
        mode={effectiveMode}
        isSaving={isSaving}
        onDiscard={handleDiscard}
        onSave={handleSave}
        title={headerTitle}
        description={headerDescription}
      />

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-12">
        <ProfileSettingsMainColumn
          mode={effectiveMode}
          profileForm={profileForm}
          organizerForm={organizerForm}
          email={userData.email}
          onProfileFieldChange={handleProfileFieldChange}
          onOrganizerFieldChange={handleOrganizerFieldChange}
        />

        <ProfileSettingsSidebar
          mode={effectiveMode}
          roleLabel={roleLabel}
          profileForm={profileForm}
          organizerForm={organizerForm}
          data={{ userData, organizerData: organizerData ?? undefined }}
          bookingCount={bookingCount}
          venueCount={venueCount}
          fileInputRef={fileInputRef}
          isUploadingAvatar={uploadAvatarMutation.isPending}
          onUploadAvatar={handleUploadAvatar}
        />
      </div>
    </div>
  );
}
