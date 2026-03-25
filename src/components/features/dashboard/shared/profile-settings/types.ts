import type { OrganizerProfile } from "@/types/organizer.types";
import type { UserProfile } from "@/types/user.types";

export type ProfileMode = "USER" | "ORGANIZER" | "ADMIN";

export type ProfileFormState = {
  name: string;
  phone: string;
};

export type OrganizerFormState = {
  businessName: string;
  website: string;
  phoneNumber: string;
  address: string;
  bio: string;
};

export type ChangeProfileField = <K extends keyof ProfileFormState>(
  key: K,
  value: ProfileFormState[K],
) => void;

export type ChangeOrganizerField = <K extends keyof OrganizerFormState>(
  key: K,
  value: OrganizerFormState[K],
) => void;

export type ProfileDataBundle = {
  userData: UserProfile;
  organizerData?: OrganizerProfile;
};
