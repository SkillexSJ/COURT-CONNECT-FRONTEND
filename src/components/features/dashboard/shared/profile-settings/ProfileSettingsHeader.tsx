import { Button } from "@/components/ui/button";
import type { ProfileMode } from "./types";

interface ProfileSettingsHeaderProps {
  mode: ProfileMode;
  isSaving: boolean;
  onDiscard: () => void;
  onSave: () => void;
  title?: string;
  description?: string;
}

export function ProfileSettingsHeader({
  mode,
  isSaving,
  onDiscard,
  onSave,
  title,
  description,
}: ProfileSettingsHeaderProps) {
  const defaultTitle =
    mode === "ORGANIZER" ? "Organization Settings" : "Profile Settings";

  const defaultDescription =
    mode === "ORGANIZER"
      ? "Manage your organization identity, contact details, and operational profile."
      : "Manage your account details and personal contact information.";

  return (
    <header className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
      <div className="space-y-2">
        <h1 className="font-heading text-4xl font-black tracking-tight text-primary md:text-5xl">
          {title ?? defaultTitle}
        </h1>
        <p className="max-w-2xl text-sm text-muted-foreground">
          {description ?? defaultDescription}
        </p>
      </div>

      <div className="flex items-center gap-2">
        <Button
          type="button"
          variant="outline"
          className="rounded-none"
          onClick={onDiscard}
          disabled={isSaving}
        >
          Discard
        </Button>
        <Button
          type="button"
          className="rounded-none bg-primary text-primary-foreground"
          onClick={onSave}
          disabled={isSaving}
        >
          {isSaving ? "Saving..." : "Save Changes"}
        </Button>
      </div>
    </header>
  );
}
