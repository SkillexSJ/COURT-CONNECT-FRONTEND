export const SPORT_TYPES = [
  "Tennis",
  "Football",
  "Basketball",
  "Padel",
  "Badminton",
  "Futsal",
] as const;

export type SportType = (typeof SPORT_TYPES)[number];
