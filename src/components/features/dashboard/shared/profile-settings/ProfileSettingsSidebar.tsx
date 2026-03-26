import {
  BadgeCheck,
  Camera,
  Mail,
  MapPin,
  Phone,
  UserCircle2,
} from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

import type {
  OrganizerFormState,
  ProfileMode,
  ProfileDataBundle,
  ProfileFormState,
} from "./types";


// HELPERS 
function InfoRow({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center gap-2">
      <Icon className="h-3.5 w-3.5" />
      <span className="font-semibold text-foreground">{label}:</span>
      <span className="truncate">{value}</span>
    </div>
  );
}

interface ProfileSettingsSidebarProps {
  mode: ProfileMode;
  roleLabel: string;
  profileForm: ProfileFormState;
  organizerForm: OrganizerFormState;
  data: ProfileDataBundle;
  bookingCount: number;
  venueCount: number;
  fileInputRef: React.RefObject<HTMLInputElement | null>;
  isUploadingAvatar: boolean;
  onUploadAvatar: (file?: File) => Promise<void>;
}

export function ProfileSettingsSidebar({
  mode,
  roleLabel,
  profileForm,
  organizerForm,
  data,
  bookingCount,
  venueCount,
  fileInputRef,
  isUploadingAvatar,
  onUploadAvatar,
}: ProfileSettingsSidebarProps) {
  return (
    <div className="space-y-4 xl:col-span-4">
      <Card className="rounded-none border border-border bg-card">
        <CardHeader>
          <CardTitle className="font-heading text-base font-black uppercase tracking-tight text-primary">
            Account Snapshot
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-3">
            <Avatar className="h-14 w-14 rounded-none border border-border">
              <AvatarImage
                src={data.userData.avatarUrl || ""}
                alt={data.userData.name}
              />
              <AvatarFallback className="rounded-none bg-primary/10 text-primary">
                {data.userData.name.slice(0, 1).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="space-y-1">
              <p className="font-heading text-lg font-black tracking-tight text-primary">
                {data.userData.name}
              </p>
              <p className="text-xs text-muted-foreground">
                {data.userData.email}
              </p>
              <Badge className="rounded-none bg-secondary text-secondary-foreground">
                {roleLabel}
              </Badge>
            </div>
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(event) => void onUploadAvatar(event.target.files?.[0])}
          />

          <Button
            type="button"
            variant="outline"
            className="w-full rounded-none"
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploadingAvatar}
          >
            <Camera className="mr-2 h-4 w-4" />
            {isUploadingAvatar ? "Uploading..." : "Change Profile Image"}
          </Button>

          <div className="grid grid-cols-1 gap-2 text-xs text-muted-foreground">
            <InfoRow icon={Mail} label="Email" value={data.userData.email} />
            <InfoRow
              icon={Phone}
              label="Phone"
              value={profileForm.phone.trim() || "Not provided"}
            />
            <InfoRow icon={UserCircle2} label="Role" value={roleLabel} />
            {mode === "ORGANIZER" && (
              <InfoRow
                icon={MapPin}
                label="Address"
                value={organizerForm.address.trim() || "Not provided"}
              />
            )}
          </div>
        </CardContent>
      </Card>

      <Card
        className={cn(
          "rounded-none border-none",
          mode === "ORGANIZER"
            ? "bg-secondary text-secondary-foreground"
            : "bg-primary text-primary-foreground",
        )}
      >
        <CardContent className="space-y-3 p-5">
          <p
            className={cn(
              "text-[10px] font-black uppercase tracking-[0.18em]",
              mode === "ORGANIZER"
                ? "text-secondary-foreground/75"
                : "text-primary-foreground/75",
            )}
          >
            {mode === "ORGANIZER" ? "Staff Utilization" : "Profile Health"}
          </p>

          <p className="font-heading text-4xl font-black leading-none">
            {mode === "ORGANIZER"
              ? `${Math.min(100, venueCount * 20)}%`
              : "Ready"}
          </p>

          <div className="space-y-1 text-xs">
            <p>
              {mode === "ORGANIZER"
                ? `${venueCount} active venue profiles configured`
                : `${bookingCount} bookings linked to this account`}
            </p>
            <div className="flex items-center gap-2">
              <BadgeCheck className="h-4 w-4" />
              <span>
                {mode === "ORGANIZER"
                  ? data.organizerData?.isVerified
                    ? "Organizer verified"
                    : "Verification pending"
                  : data.userData.emailVerified
                    ? "Email verified"
                    : "Email verified"}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {mode === "ORGANIZER" && (
        <Card className="rounded-none border border-border bg-card">
          <CardHeader>
            <CardTitle className="font-heading text-base font-black uppercase tracking-tight text-destructive">
              Danger Zone
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-xs text-muted-foreground">
              Organization deactivation is not enabled yet in current backend
              APIs.
            </p>
            <Button
              type="button"
              variant="outline"
              className="rounded-none border-destructive text-destructive hover:bg-destructive/10"
              disabled
            >
              Deactivate Organization
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
