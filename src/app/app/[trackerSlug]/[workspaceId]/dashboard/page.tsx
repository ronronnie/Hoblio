import { notFound } from "next/navigation";
import { CricketDashboardPlaceholder } from "@/modules/cricket/components/cricket-dashboard-placeholder";
import {
  getTrackerBySlug,
  isTrackerAvailable
} from "@/modules/platform/tracker-activation/trackerRegistry";

type DashboardPageProps = {
  params: Promise<{
    trackerSlug: string;
    workspaceId: string;
  }>;
};

export default async function TrackerDashboardPage({ params }: DashboardPageProps) {
  const { trackerSlug, workspaceId } = await params;
  const tracker = getTrackerBySlug(trackerSlug);

  if (!tracker || !isTrackerAvailable(trackerSlug)) {
    notFound();
  }

  if (tracker.slug === "cricket") {
    return <CricketDashboardPlaceholder workspaceId={workspaceId} />;
  }

  notFound();
}
