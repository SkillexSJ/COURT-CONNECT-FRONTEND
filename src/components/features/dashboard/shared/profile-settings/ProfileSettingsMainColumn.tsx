import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import type {
  ChangeOrganizerField,
  ChangeProfileField,
  OrganizerFormState,
  ProfileFormState,
  ProfileMode,
} from "./types";

const sectionTitleClassName =
  "mb-4 flex items-center gap-3 border-b border-border/80 pb-3";

/**
 *
 * HELPERS
 *
 */
function SectionTitle({ children }: { children: string }) {
  return (
    <div className={sectionTitleClassName}>
      <p className="text-[10px] font-black tracking-[0.2em] text-muted-foreground">
        {children}
      </p>
    </div>
  );
}

function FieldBlock({
  label,
  className,
  children,
}: {
  label: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={cn("space-y-1.5", className)}>
      <p className="text-[10px] font-black uppercase tracking-[0.16em] text-muted-foreground">
        {label}
      </p>
      {children}
    </div>
  );
}

interface ProfileSettingsMainColumnProps {
  mode: ProfileMode;
  profileForm: ProfileFormState;
  organizerForm: OrganizerFormState;
  email: string;
  onProfileFieldChange: ChangeProfileField;
  onOrganizerFieldChange: ChangeOrganizerField;
}

export function ProfileSettingsMainColumn({
  mode,
  profileForm,
  organizerForm,
  email,
  onProfileFieldChange,
  onOrganizerFieldChange,
}: ProfileSettingsMainColumnProps) {
  return (
    <div className="space-y-6 xl:col-span-8">
      {mode === "ORGANIZER" && (
        <Card className="rounded-none border border-border bg-card">
          <CardContent className="p-5 sm:p-6">
            <SectionTitle>01 / GENERAL IDENTITY</SectionTitle>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <FieldBlock label="Business Name">
                <Input
                  value={organizerForm.businessName}
                  onChange={(event) =>
                    onOrganizerFieldChange("businessName", event.target.value)
                  }
                />
              </FieldBlock>

              <FieldBlock label="Organization Phone">
                <Input
                  value={organizerForm.phoneNumber}
                  onChange={(event) =>
                    onOrganizerFieldChange("phoneNumber", event.target.value)
                  }
                />
              </FieldBlock>

              <FieldBlock label="Website URL" className="md:col-span-2">
                <Input
                  value={organizerForm.website}
                  onChange={(event) =>
                    onOrganizerFieldChange("website", event.target.value)
                  }
                />
              </FieldBlock>
            </div>
          </CardContent>
        </Card>
      )}

      <Card className="rounded-none border border-border bg-card">
        <CardContent className="p-5 sm:p-6">
          <SectionTitle>
            {mode === "ORGANIZER"
              ? "02 / PHYSICAL LOCATION"
              : "01 / ACCOUNT DETAILS"}
          </SectionTitle>

          {mode === "ORGANIZER" ? (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <FieldBlock label="Street Address" className="md:col-span-2">
                <Input
                  value={organizerForm.address}
                  onChange={(event) =>
                    onOrganizerFieldChange("address", event.target.value)
                  }
                />
              </FieldBlock>

              <FieldBlock label="Organization Bio" className="md:col-span-2">
                <textarea
                  value={organizerForm.bio}
                  onChange={(event) =>
                    onOrganizerFieldChange("bio", event.target.value)
                  }
                  rows={4}
                  className="w-full rounded-none border border-input bg-background px-3 py-2 text-sm outline-none focus-visible:border-ring"
                />
              </FieldBlock>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <FieldBlock label="Full Name">
                <Input
                  value={profileForm.name}
                  onChange={(event) =>
                    onProfileFieldChange("name", event.target.value)
                  }
                />
              </FieldBlock>

              <FieldBlock label="Phone Number">
                <Input
                  value={profileForm.phone}
                  onChange={(event) =>
                    onProfileFieldChange("phone", event.target.value)
                  }
                />
              </FieldBlock>

              <FieldBlock label="Email" className="md:col-span-2">
                <Input value={email} readOnly />
              </FieldBlock>
            </div>
          )}
        </CardContent>
      </Card>

      {mode === "ORGANIZER" && (
        <Card className="rounded-none border border-border bg-card">
          <CardContent className="p-5 sm:p-6">
            <SectionTitle>03 / ACCOUNT OWNER</SectionTitle>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <FieldBlock label="Owner Name">
                <Input
                  value={profileForm.name}
                  onChange={(event) =>
                    onProfileFieldChange("name", event.target.value)
                  }
                />
              </FieldBlock>

              <FieldBlock label="Owner Phone">
                <Input
                  value={profileForm.phone}
                  onChange={(event) =>
                    onProfileFieldChange("phone", event.target.value)
                  }
                />
              </FieldBlock>

              <FieldBlock label="Email" className="md:col-span-2">
                <Input value={email} readOnly />
              </FieldBlock>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
