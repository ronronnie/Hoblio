import type { TypedSupabaseClient } from "@/lib/supabase/database.types";
import type { ActivatedTracker, TrackerSlug } from "./types";
import { isTrackerAvailable } from "./trackerRegistry";

type PlatformClient = TypedSupabaseClient;

export type ActivateTrackerForUserInput = {
  userId: string;
  trackerSlug: TrackerSlug;
  workspaceId: string;
  status?: "active" | "inactive";
};

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

export async function activateTrackerForUser(
  supabase: PlatformClient,
  input: ActivateTrackerForUserInput
) {
  if (!canActivateTracker(input.trackerSlug)) {
    throw new Error(`Tracker is not available for activation: ${input.trackerSlug}`);
  }

  const { data, error } = await supabase
    .from("user_tracker_activations")
    .insert({
      user_id: input.userId,
      tracker_slug: input.trackerSlug,
      workspace_id: input.workspaceId,
      status: input.status ?? "active"
    })
    .select("*")
    .single();

  if (error) {
    throw error;
  }

  return data;
}
