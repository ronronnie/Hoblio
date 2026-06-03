import type { ActivatedTracker, TrackerSlug } from "./types";
import { isTrackerAvailable } from "./trackerRegistry";

export function canActivateTracker(trackerSlug: TrackerSlug) {
  return isTrackerAvailable(trackerSlug);
}

export function createActivationRecord(
  trackerSlug: TrackerSlug,
  workspaceId: string
): ActivatedTracker {
  if (!canActivateTracker(trackerSlug)) {
    throw new Error(`Tracker is not available for activation: ${trackerSlug}`);
  }

  return {
    trackerSlug,
    workspaceId,
    activatedAt: new Date().toISOString()
  };
}
