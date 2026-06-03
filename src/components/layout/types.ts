import type { TrackerSlug } from "@/modules/platform/tracker-activation/types";

export type AppShellWorkspace = {
  id: string;
  name: string;
  trackerSlug: TrackerSlug;
  trackerName: string;
  trackerIconName: "Trophy" | "Footprints";
  dashboardHref: string;
};

export type AppShellAuthState = "authenticated" | "unauthenticated" | "supabase-unconfigured";
