import type { CricketMatch } from "@/modules/cricket/types";

export function getCricketTrackerRoute(workspaceId: string) {
  return `/app/cricket/${workspaceId}/dashboard`;
}

export function createDraftMatch(workspaceId: string, title: string): CricketMatch {
  return {
    id: crypto.randomUUID(),
    workspaceId,
    title,
    playedAt: new Date().toISOString(),
    status: "draft"
  };
}
