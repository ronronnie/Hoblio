import type { TrackerDefinition, TrackerSlug } from "./types";

const trackerRegistry = [
  {
    id: "cricket-tracker",
    name: "Cricket Tracker",
    slug: "cricket",
    description: "Manage matches, scorecards, calculations, dashboards, and player profiles.",
    category: "Sports",
    iconName: "Trophy",
    status: "available",
    isPaid: false,
    freeLimitEligible: true,
    defaultRoute: "/app/cricket/:workspaceId/dashboard",
    setupRoute: "/app/cricket/setup",
    moduleKey: "cricket"
  },
  {
    id: "sneaker-vault",
    name: "Sneaker Vault",
    slug: "sneakers",
    description: "A planned inventory and collection tracker. Not implemented in the MVP.",
    category: "Collection",
    iconName: "Footprints",
    status: "coming_soon",
    isPaid: false,
    freeLimitEligible: false,
    defaultRoute: "/app/sneakers/:workspaceId/dashboard",
    setupRoute: "/app/sneakers/setup",
    moduleKey: "sneakers"
  }
] as const satisfies readonly TrackerDefinition[];

export function getAllTrackers(): TrackerDefinition[] {
  return [...trackerRegistry];
}

export function getAvailableTrackers(): TrackerDefinition[] {
  return trackerRegistry.filter((tracker) => tracker.status === "available");
}

export function getTrackerBySlug(slug: string): TrackerDefinition | undefined {
  return trackerRegistry.find((tracker) => tracker.slug === slug);
}

export function isTrackerAvailable(slug: string): boolean {
  return getTrackerBySlug(slug)?.status === "available";
}

export function isKnownTrackerSlug(slug: string): slug is TrackerSlug {
  return trackerRegistry.some((tracker) => tracker.slug === slug);
}
