export type CourtStatus =
  | "PENDING_APPROVAL"
  | "ACTIVE"
  | "MAINTENANCE"
  | "HIDDEN";

export type CreateCourtPayload = {
  name: string;
  type: string;
  locationLabel: string;
  description?: string;
  basePrice: number;
  latitude?: number;
  longitude?: number;
  amenityIds?: string[];
};

export type UpdateCourtPayload = Partial<
  Omit<CreateCourtPayload, "description"> & {
    description: string;
    status: CourtStatus;
  }
>;

export type CourtQueryParams = {
  searchTerm?: string;
  page?: number;
  limit?: number;
  sortBy?: string;
  organizerId?: string;
  // Deprecated alias kept for backward compatibility.
  sort?: string;
  status?: CourtStatus;
  type?: string | string[];
  basePrice?: number;
  basePrice_lte?: number;
  basePrice_gte?: number;
  amenityIds?: string[];
};

export type CourtMemberQueryParams = {
  searchTerm?: string;
  page?: number;
  limit?: number;
  sort?: string;
  status?: string;
};

export type CourtOrganizerSummary = {
  id: string;
  businessName: string | null;
  user?: {
    id?: string;
    name: string;
    avatarUrl?: string | null;
  };
};

export type CourtMediaItem = {
  url: string;
  isPrimary?: boolean;
  publicId?: string;
};

export type CourtListItem = {
  id: string;
  slug: string;
  name: string;
  type: string;
  locationLabel: string;
  basePrice: string | number;
  latitude: number | null;
  longitude: number | null;
  status: CourtStatus;
  createdAt: string;
  organizer?: CourtOrganizerSummary;
  media?: CourtMediaItem[];
  _count?: {
    bookings: number;
  };
};

export type CourtAmenity = {
  id: string;
  name: string;
  icon: string | null;
  _count?: {
    courts: number;
  };
};

export type AmenityPayload = {
  name: string;
  icon?: string | null;
};

export type CourtSlotTemplate = {
  id: string;
  dayOfWeek: number;
  startMinute: number;
  endMinute: number;
  priceOverride: string | number | null;
  isActive: boolean;
};

export type CourtDetails = {
  id: string;
  organizerId: string;
  name: string;
  slug: string;
  type: string;
  locationLabel: string;
  description: string | null;
  basePrice: string | number;
  latitude: number | null;
  longitude: number | null;
  status: CourtStatus;
  createdAt: string;
  updatedAt: string;
  organizer: CourtOrganizerSummary & {
    bio?: string | null;
    user?: {
      id: string;
      name: string;
      avatarUrl: string | null;
    };
  };
  media: CourtMediaItem[];
  amenities: CourtAmenity[];
  slotTemplates: CourtSlotTemplate[];
  _count: {
    bookings: number;
  };
};

export type CourtMember = {
  id: string;
  bookingCode: string;
  bookingDate: string;
  status: string;
  user: {
    id: string;
    name: string;
    email: string;
    avatarUrl: string | null;
  };
};

export type UploadCourtMediaPayload = {
  primaryImage?: File | null;
  galleryImages?: File[];
};
