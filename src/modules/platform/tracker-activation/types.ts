export type TrackerStatus = "active" | "coming-soon";

export type TrackerSlug = "cricket" | "sneakers";

export type TrackerDefinition = {
  slug: TrackerSlug;
  name: string;
  description: string;
  status: TrackerStatus;
  modulePath: string;
};

export type ActivatedTracker = {
  trackerSlug: TrackerSlug;
  workspaceId: string;
  activatedAt: string;
};
