export type TrackerStatus = "available" | "coming_soon";

export type TrackerSlug = "cricket" | "sneakers";

export type TrackerId = "cricket-tracker" | "sneaker-vault";

export type TrackerCategory = "Sports" | "Collection";

export type TrackerIconName = "Trophy" | "Footprints";

export type TrackerModuleKey = "cricket" | "sneakers";

export type TrackerDefinition = {
  id: TrackerId;
  slug: TrackerSlug;
  name: string;
  description: string;
  category: TrackerCategory;
  iconName: TrackerIconName;
  status: TrackerStatus;
  isPaid: boolean;
  freeLimitEligible: boolean;
  defaultRoute: string;
  setupRoute: string;
  moduleKey: TrackerModuleKey;
};

export type ActivatedTracker = {
  trackerSlug: TrackerSlug;
  workspaceId: string;
  activatedAt: string;
};
