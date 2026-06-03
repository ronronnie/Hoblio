import { notFound } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  getTrackerBySlug,
  isTrackerAvailable
} from "@/modules/platform/tracker-activation/trackerRegistry";
import { getNavigationForTracker } from "@/modules/platform/navigation";

type TrackerSectionPageProps = {
  params: Promise<{
    trackerSlug: string;
    workspaceId: string;
    section: string;
  }>;
};

export default async function TrackerSectionPage({ params }: TrackerSectionPageProps) {
  const { trackerSlug, workspaceId, section } = await params;
  const tracker = getTrackerBySlug(trackerSlug);

  if (!tracker || !isTrackerAvailable(trackerSlug)) {
    notFound();
  }

  const navigationItem = getNavigationForTracker(tracker.slug, workspaceId).find(
    (item) => item.segment === section
  );

  if (!navigationItem) {
    notFound();
  }

  const Icon = navigationItem.icon;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold tracking-normal">{navigationItem.label}</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Workspace: <span className="font-medium text-foreground">{workspaceId}</span>
        </p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="rounded-md bg-muted p-2 text-foreground">
              <Icon className="size-5" aria-hidden="true" />
            </div>
            <div>
              <CardTitle>{tracker.name}</CardTitle>
              <CardDescription>
                This tracker-aware section is ready for the Cricket module implementation.
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground">
          {navigationItem.label} functionality will stay inside the Cricket tracker module.
        </CardContent>
      </Card>
    </div>
  );
}
