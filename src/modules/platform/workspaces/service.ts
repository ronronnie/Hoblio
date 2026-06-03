import type { Database, TypedSupabaseClient } from "@/lib/supabase/database.types";
import {
  getTrackerBySlug,
  isTrackerAvailable
} from "@/modules/platform/tracker-activation/trackerRegistry";
import type { TrackerSlug } from "@/modules/platform/tracker-activation/types";

type PlatformClient = TypedSupabaseClient;

export type WorkspaceRow = Database["public"]["Tables"]["workspaces"]["Row"];
export type WorkspaceMemberRole =
  Database["public"]["Tables"]["workspace_members"]["Row"]["role"];

export type CreateWorkspaceForTrackerInput = {
  trackerSlug: TrackerSlug;
  ownerId: string;
  name: string;
  description?: string | null;
};

export async function getUserWorkspaces(
  supabase: PlatformClient,
  userId: string,
  trackerSlug?: TrackerSlug
): Promise<WorkspaceRow[]> {
  const { data: memberRows, error: memberError } = await supabase
    .from("workspace_members")
    .select("workspace_id")
    .eq("user_id", userId);

  if (memberError) {
    throw memberError;
  }

  const memberWorkspaceIds = memberRows.map((row) => row.workspace_id);

  const workspaceById = new Map<string, WorkspaceRow>();

  const ownerQuery = supabase.from("workspaces").select("*").eq("owner_id", userId);
  const { data: ownedWorkspaces, error: ownedError } = trackerSlug
    ? await ownerQuery.eq("tracker_slug", trackerSlug)
    : await ownerQuery;

  if (ownedError) {
    throw ownedError;
  }

  ownedWorkspaces.forEach((workspace) => workspaceById.set(workspace.id, workspace));

  if (memberWorkspaceIds.length > 0) {
    const memberQuery = supabase.from("workspaces").select("*").in("id", memberWorkspaceIds);
    const { data: memberWorkspaces, error: workspaceError } = trackerSlug
      ? await memberQuery.eq("tracker_slug", trackerSlug)
      : await memberQuery;

    if (workspaceError) {
      throw workspaceError;
    }

    memberWorkspaces.forEach((workspace) => workspaceById.set(workspace.id, workspace));
  }

  return Array.from(workspaceById.values());
}

export async function getWorkspaceById(
  supabase: PlatformClient,
  workspaceId: string
): Promise<WorkspaceRow | null> {
  const { data, error } = await supabase
    .from("workspaces")
    .select("*")
    .eq("id", workspaceId)
    .maybeSingle();

  if (error) {
    throw error;
  }

  return data;
}

export async function createWorkspaceForTracker(
  supabase: PlatformClient,
  input: CreateWorkspaceForTrackerInput
): Promise<WorkspaceRow> {
  const tracker = getTrackerBySlug(input.trackerSlug);

  if (!tracker) {
    throw new Error(`Unknown tracker: ${input.trackerSlug}`);
  }

  if (!isTrackerAvailable(input.trackerSlug)) {
    throw new Error(`${tracker.name} is not available for activation.`);
  }

  const workspaceName = input.name.trim();

  if (!workspaceName) {
    throw new Error("Workspace name is required.");
  }

  const { data, error } = await supabase
    .from("workspaces")
    .insert({
      tracker_slug: input.trackerSlug,
      owner_id: input.ownerId,
      name: workspaceName,
      description: input.description ?? null
    })
    .select("*")
    .single();

  if (error) {
    throw error;
  }

  return data;
}

export async function addWorkspaceMember(
  supabase: PlatformClient,
  workspaceId: string,
  userId: string,
  role: WorkspaceMemberRole
) {
  const { error } = await supabase.from("workspace_members").insert({
    workspace_id: workspaceId,
    user_id: userId,
    role
  });

  if (error) {
    throw error;
  }
}
