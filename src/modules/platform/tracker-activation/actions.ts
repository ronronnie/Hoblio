"use server";

import { createSupabaseServerClient } from "@/lib/supabase/server";
import { activateTrackerForUser } from "@/modules/platform/tracker-activation/activation";
import {
  getTrackerBySlug,
  isKnownTrackerSlug,
  isTrackerAvailable
} from "@/modules/platform/tracker-activation/trackerRegistry";
import type { TrackerSlug } from "@/modules/platform/tracker-activation/types";
import {
  addWorkspaceMember,
  createWorkspaceForTracker,
  getUserWorkspaces
} from "@/modules/platform/workspaces/service";

export type ActivateTrackerFormState = {
  status: "idle" | "error" | "success";
  message?: string;
  redirectTo?: string;
};

function getStringValue(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
}

function getDashboardRoute(trackerSlug: TrackerSlug, workspaceId: string) {
  const tracker = getTrackerBySlug(trackerSlug);
  return tracker?.defaultRoute.replace(":workspaceId", workspaceId) ?? "/app";
}

export async function activateTrackerAction(
  _previousState: ActivateTrackerFormState,
  formData: FormData
): Promise<ActivateTrackerFormState> {
  const trackerSlugValue = getStringValue(formData, "trackerSlug");
  const workspaceName = getStringValue(formData, "workspaceName");

  if (!isKnownTrackerSlug(trackerSlugValue)) {
    return {
      status: "error",
      message: "That tracker does not exist."
    };
  }

  if (!isTrackerAvailable(trackerSlugValue)) {
    return {
      status: "error",
      message: "That tracker is not available yet."
    };
  }

  if (!workspaceName) {
    return {
      status: "error",
      message: "Enter a workspace name."
    };
  }

  try {
    const supabase = await createSupabaseServerClient();
    const {
      data: { user },
      error: userError
    } = await supabase.auth.getUser();

    if (userError) {
      throw userError;
    }

    if (!user) {
      return {
        status: "error",
        message: "Sign in before activating a tracker."
      };
    }

    const existingWorkspaces = await getUserWorkspaces(supabase, user.id, trackerSlugValue);
    const existingWorkspace = existingWorkspaces[0];

    if (existingWorkspace) {
      return {
        status: "success",
        message: "Tracker is already active. Opening dashboard.",
        redirectTo: getDashboardRoute(trackerSlugValue, existingWorkspace.id)
      };
    } else {
      const workspace = await createWorkspaceForTracker(supabase, {
        trackerSlug: trackerSlugValue,
        ownerId: user.id,
        name: workspaceName
      });

      await addWorkspaceMember(supabase, workspace.id, user.id, "owner");
      await activateTrackerForUser(supabase, {
        userId: user.id,
        trackerSlug: trackerSlugValue,
        workspaceId: workspace.id
      });

      return {
        status: "success",
        message: "Tracker activated. Opening dashboard.",
        redirectTo: getDashboardRoute(trackerSlugValue, workspace.id)
      };
    }
  } catch (error) {
    return {
      status: "error",
      message: error instanceof Error ? error.message : "Unable to activate tracker."
    };
  }
}
