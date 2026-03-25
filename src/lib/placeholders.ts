export const VENUE_FALLBACK_IMAGE = "/images/placeholders/venue-fallback.svg";
export const AVATAR_FALLBACK_IMAGE = "/images/placeholders/avatar-fallback.svg";

/**
 * HELPER FUNCTION TO GET INITIALS FROM A NAME, USED FOR AVATAR FALLBACKS
 */

export const getInitials = (name?: string | null) => {
  if (!name) return "U";

  const parts = name.trim().split(/\s+/).filter(Boolean).slice(0, 2);

  if (parts.length === 0) return "U";
  return parts.map((part) => part[0]?.toUpperCase() ?? "").join("");
};
