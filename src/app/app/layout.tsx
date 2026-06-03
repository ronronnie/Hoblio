import { redirect } from "next/navigation";
import { AppShell } from "@/components/layout/app-shell";
import type { AppShellAuthState, AppShellWorkspace } from "@/components/layout/types";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { getTrackerBySlug } from "@/modules/platform/tracker-activation/trackerRegistry";
import { getUserWorkspaces } from "@/modules/platform/workspaces/service";

async function getShellData(): Promise<{
  authState: AppShellAuthState;
  workspaces: AppShellWorkspace[];
}> {
  const supabase = await (async () => {
    try {
      return await createSupabaseServerClient();
    } catch {
      return null;
    }
  })();

  if (!supabase) {
    return {
      authState: "supabase-unconfigured",
      workspaces: []
    };
  }

  const {
    data: { user },
    error
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth");
  }

  if (error) {
    throw error;
  }

  try {
    const workspaces = await getUserWorkspaces(supabase, user.id);

    return {
      authState: "authenticated",
      workspaces: workspaces.flatMap((workspace) => {
        const tracker = getTrackerBySlug(workspace.tracker_slug);

        if (!tracker) {
          return [];
        }

        return [
          {
            id: workspace.id,
            name: workspace.name,
            trackerSlug: tracker.slug,
            trackerName: tracker.name,
            trackerIconName: tracker.iconName,
            dashboardHref: tracker.defaultRoute.replace(":workspaceId", workspace.id)
          }
        ];
      })
    };
  } catch {
    return {
      authState: "authenticated",
      workspaces: []
    };
  }
}

export default async function PlatformLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  const shellData = await getShellData();

  return (
    <AppShell authState={shellData.authState} workspaces={shellData.workspaces}>
      {children}
    </AppShell>
  );
}
