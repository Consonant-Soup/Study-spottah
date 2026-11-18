/**
 * mock-spots.ts
 * Placeholder data so the UI works before Postgres is connected.
 * Replace the import in app/page.tsx with a database query later.
 */
import type { Spot } from "../lib/types";

export const MOCK_SPOTS: Spot[] = [
  {
    id: 1,
    name: "Library 2nd Floor Quiet Zone",
    building: "Main Library",
    description: "Long tables and carrels. Silent hours enforced.",
    setting: "indoor",
    tags: ["solo", "water_station", "pc_restricted", "printer_restricted"],
  },
  {
    id: 2,
    name: "Student Union Courtyard",
    building: "Student Union",
    description: "Covered tables next to the food court.",
    setting: "outdoor_covered",
    tags: ["group", "chill", "food_allowed", "vending", "water_station"],
  },
  {
    id: 3,
    name: "Engineering Lounge",
    building: "Engineering Building",
    description: "Whiteboards, couches, and a shared microwave.",
    setting: "indoor",
    tags: ["group", "food_allowed", "microwave", "pc_public", "printer_public"],
  },
  {
    id: 4,
    name: "Lawn Benches",
    building: "Central Lawn",
    description: "Open-air benches under shade trees.",
    setting: "outdoor",
    tags: ["chill", "solo"],
  },
];
