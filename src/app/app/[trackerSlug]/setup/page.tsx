import { redirect } from "next/navigation";
import Link from "next/link";
import { AlertCircle, CheckCircle2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { TrackerSetupForm } from "@/modules/platform/tracker-activation/components/tracker-setup-form";
import {
  getTrackerBySlug,
  isTrackerAvailable
} from "@/modules/platform/tracker-activation/trackerRegistry";
import type { TrackerSlug } from "@/modules/platform/tracker-activation/types";
import { getUserWorkspaces } from "@/modules/platform/workspaces/service";

type TrackerSetupPageProps = {
  params: Promise<{
    trackerSlug: string;
  }>;
};

function getDashboardRoute(trackerSlug: TrackerSlug, workspaceId: string) {
  const tracker = getTrackerBySlug(trackerSlug);
  return tracker?.defaultRoute.replace(":workspaceId", workspaceId) ?? "/app";
}

export default async function TrackerSetupPage({ params }: TrackerSetupPageProps) {
  const { trackerSlug } = await params;
  const tracker = getTrackerBySlug(trackerSlug);

  if (!tracker) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Tracker not found</CardTitle>
          <CardDescription>
            This platform only supports predefined tracker apps from the product registry.
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  if (!isTrackerAvailable(trackerSlug)) {
    return (
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <AlertCircle className="size-5 text-muted-foreground" aria-hidden="true" />
            <div>
              <CardTitle>{tracker.name}</CardTitle>
              <CardDescription>This tracker is coming soon and cannot be activated yet.</CardDescription>
            </div>
          </div>
        </CardHeader>
      </Card>
    );
  }

  let existingWorkspaceId: string | null = null;
  let requiresSignIn = false;

  try {
    const supabase = await createSupabaseServerClient();
    const {
      data: { user }
    } = await supabase.auth.getUser();

    if (!user) {
      requiresSignIn = true;
    } else {
      const existingWorkspaces = await getUserWorkspaces(supabase, user.id, tracker.slug);
      const existingWorkspace = existingWorkspaces[0];

      if (existingWorkspace) {
        existingWorkspaceId = existingWorkspace.id;
      }
    }
  } catch {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Supabase is not configured</CardTitle>
          <CardDescription>
            Add Supabase environment variables before activating trackers.
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  if (existingWorkspaceId) {
    redirect(getDashboardRoute(tracker.slug, existingWorkspaceId));
  }

  if (requiresSignIn) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Sign in required</CardTitle>
          <CardDescription>
            Sign in before creating a workspace and activating {tracker.name}.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button asChild>
            <Link href="/auth">Go to sign in</Link>
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <div className="mb-3 flex items-center gap-2">
          <Badge>{tracker.category}</Badge>
          <Badge variant="outline">Available</Badge>
        </div>
        <h1 className="text-3xl font-semibold tracking-normal">Activate {tracker.name}</h1>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">{tracker.description}</p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <CheckCircle2 className="size-5 text-primary" aria-hidden="true" />
            <div>
              <CardTitle>Create your workspace</CardTitle>
              <CardDescription>
                This creates a Cricket workspace, activation record, and owner membership.
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <TrackerSetupForm tracker={tracker} />
        </CardContent>
      </Card>
    </div>
  );
}
