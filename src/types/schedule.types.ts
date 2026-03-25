export type CreateSlotTemplatePayload = {
  dayOfWeek: number;
  startMinute: number;
  endMinute: number;
  priceOverride?: number;
};

export type UpdateSlotTemplatePayload = Partial<{
  startMinute: number;
  endMinute: number;
  priceOverride: number | null;
  isActive: boolean;
}>;

export type SlotTemplate = {
  id: string;
  courtId: string;
  dayOfWeek: number;
  startMinute: number;
  endMinute: number;
  priceOverride: string | number | null;
  isActive: boolean;
};

export type SlotTemplatesByDay = Record<string, SlotTemplate[]>;

export type AvailableSlot = {
  slotTemplateId: string;
  dayOfWeek: number;
  startMinute: number;
  endMinute: number;
  price: string | number | null;
};
