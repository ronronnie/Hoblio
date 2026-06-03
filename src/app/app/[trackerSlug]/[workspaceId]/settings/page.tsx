import { notFound } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  getTrackerBySlug,
  isTrackerAvailable
} from "@/modules/platform/tracker-activation/trackerRegistry";

type SettingsPageProps = {
  params: Promise<{
    trackerSlug: string;
    workspaceId: string;
  }>;
};

export default async function TrackerSettingsPage({ params }: SettingsPageProps) {
  const { trackerSlug, workspaceId } = await params;
  const tracker = getTrackerBySlug(trackerSlug);

  if (!tracker || !isTrackerAvailable(trackerSlug)) {
    notFound();
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{tracker.name} settings</CardTitle>
      </CardHeader>
      <CardContent className="text-sm text-muted-foreground">
        Workspace-scoped tracker settings will live here. Current workspace:
        <span className="ml-1 font-medium text-foreground">{workspaceId}</span>
      </CardContent>
    </Card>
  );
}
