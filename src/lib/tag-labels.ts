/**
 * tag-labels.ts
 * Maps tag/setting keys (stored in the database) to the text shown to users.
 * The listing only needs this lookup: it does not depend on any filter UI.
 * To add a tag, add one line here.
 */
export const TAG_LABELS: Record<string, string> = {
  // Setting (single-choice field on a spot)
  indoor: "Indoor",
  outdoor: "Outdoor",
  outdoor_covered: "Outdoor with cover",

  // Food & drink
  food_allowed: "Can eat here",
  microwave: "Microwave nearby",
  water_station: "Water station nearby",
  vending: "Vending machine nearby",

  // Printers & computers (public vs restricted access)
  printer_public: "Free printer (public)",
  printer_restricted: "Free printer (restricted)",
  pc_public: "Computers (public)",
  pc_restricted: "Computers (restricted)",

  // Best for
  group: "Group work",
  solo: "Individual study",
  chill: "Chilling / recreation",
};

/** Returns the display label for a key, falling back to the raw key. */
export function labelFor(key: string): string {
  return TAG_LABELS[key] ?? key;
}
