import {
  Bot,
  Crown,
  type LucideIcon,
  Settings,
  Trophy,
  Users,
  Volleyball
} from "lucide-react";
import { getTrackerBySlug } from "@/modules/platform/tracker-activation/trackerRegistry";
import type { TrackerSlug } from "@/modules/platform/tracker-activation/types";

export type TrackerNavigationItem = {
  label: string;
  href: string;
  segment: string;
  icon: LucideIcon;
};

const cricketNavigation = [
  {
    label: "Dashboard",
    segment: "dashboard",
    icon: Trophy
  },
  {
    label: "Matches",
    segment: "matches",
    icon: Volleyball
  },
  {
    label: "Players",
    segment: "players",
    icon: Users
  },
  {
    label: "Leaderboard",
    segment: "leaderboard",
    icon: Crown
  },
  {
    label: "AI Entry",
    segment: "ai-entry",
    icon: Bot
  },
  {
    label: "Settings",
    segment: "settings",
    icon: Settings
  }
] as const;

export function getNavigationForTracker(
  trackerSlug: string,
  workspaceId = ":workspaceId"
): TrackerNavigationItem[] {
  const tracker = getTrackerBySlug(trackerSlug);

  if (!tracker || tracker.slug !== "cricket") {
    return [];
  }

  return cricketNavigation.map((item) => ({
    ...item,
    href: `/app/${tracker.slug}/${workspaceId}/${item.segment}`
  }));
}

export function isTrackerNavigationSegment(trackerSlug: TrackerSlug, segment: string) {
  return getNavigationForTracker(trackerSlug, "workspace").some((item) => item.segment === segment);
}
