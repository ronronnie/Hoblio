import type { TrackerDefinition, TrackerSlug } from "./types";

export const trackerRegistry: TrackerDefinition[] = [
  {
    slug: "cricket",
    name: "Cricket Tracker",
    description: "Manage matches, scorecards, calculations, dashboards, and player profiles.",
    status: "active",
    modulePath: "@/modules/cricket"
  },
  {
    slug: "sneakers",
    name: "Sneaker Vault",
    description: "A planned inventory and collection tracker. Not implemented in the MVP.",
    status: "coming-soon",
    modulePath: "@/modules/sneakers"
  }
];

export function getTrackerBySlug(slug: string): TrackerDefinition | undefined {
  return trackerRegistry.find((tracker) => tracker.slug === slug);
}

export function isKnownTrackerSlug(slug: string): slug is TrackerSlug {
  return trackerRegistry.some((tracker) => tracker.slug === slug);
}

export function getActiveTrackers() {
  return trackerRegistry.filter((tracker) => tracker.status === "active");
}
