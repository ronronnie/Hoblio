"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Grid2X2, Settings } from "lucide-react";
import { WorkspaceSwitcher } from "@/components/layout/workspace-switcher";
import type { AppShellAuthState, AppShellWorkspace } from "@/components/layout/types";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { getTrackerBySlug } from "@/modules/platform/tracker-activation/trackerRegistry";
import { getNavigationForTracker } from "@/modules/platform/navigation";

type AppShellProps = {
  children: React.ReactNode;
  authState: AppShellAuthState;
  workspaces: AppShellWorkspace[];
};

function parseAppPath(pathname: string) {
  const [, appSegment, trackerSlug, workspaceId, section] = pathname.split("/");

  if (appSegment !== "app") {
    return {};
  }

  return {
    trackerSlug,
    workspaceId,
    section
  };
}

export function AppShell({ children, authState, workspaces }: AppShellProps) {
  const pathname = usePathname();
  const { trackerSlug, workspaceId, section } = parseAppPath(pathname);
  const tracker = trackerSlug ? getTrackerBySlug(trackerSlug) : undefined;
  const currentWorkspace = workspaces.find((workspace) => workspace.id === workspaceId);
  const navigation =
    tracker && workspaceId ? getNavigationForTracker(tracker.slug, workspaceId) : [];

  return (
    <div className="min-h-screen bg-background">
      <div className="grid min-h-screen grid-cols-1 md:grid-cols-[280px_1fr]">
        <aside className="border-b bg-card md:border-b-0 md:border-r">
          <div className="flex h-full flex-col gap-6 p-4">
            <Link href="/app" className="flex items-center gap-3 px-2">
              <span className="flex size-9 items-center justify-center rounded-md bg-primary text-sm font-semibold text-primary-foreground">
                H
              </span>
              <span>
                <span className="block text-base font-semibold tracking-normal">Hoblio</span>
                <span className="block text-xs text-muted-foreground">Tracker platform</span>
              </span>
            </Link>

            <WorkspaceSwitcher workspaces={workspaces} currentWorkspaceId={workspaceId} />

            {authState !== "authenticated" ? (
              <div className="rounded-md border bg-muted/40 p-3 text-sm text-muted-foreground">
                {authState === "supabase-unconfigured"
                  ? "Supabase is not configured."
                  : "Sign in to load your workspaces."}
              </div>
            ) : null}

            <nav className="space-y-1">
              <Button asChild variant="ghost" className="w-full justify-start">
                <Link href="/app">
                  <Grid2X2 className="mr-2 size-4" />
                  Tracker Gallery
                </Link>
              </Button>
            </nav>

            {tracker && workspaceId ? (
              <div className="space-y-3">
                <div className="px-2">
                  <p className="text-xs font-medium uppercase tracking-[0.14em] text-muted-foreground">
                    {tracker.name}
                  </p>
                  <p className="mt-1 truncate text-sm text-muted-foreground">
                    {currentWorkspace?.name ?? "Current workspace"}
                  </p>
                </div>
                <nav className="space-y-1">
                  {navigation.map((item) => {
                    const Icon = item.icon;
                    const isActive = section === item.segment;

                    return (
                      <Button
                        key={item.segment}
                        asChild
                        variant="ghost"
                        className={cn(
                          "w-full justify-start",
                          isActive ? "bg-muted text-foreground" : "text-muted-foreground"
                        )}
                      >
                        <Link href={item.href}>
                          <Icon className="mr-2 size-4" />
                          {item.label}
                        </Link>
                      </Button>
                    );
                  })}
                </nav>
              </div>
            ) : null}

            <div className="mt-auto border-t pt-4">
              <Button asChild variant="ghost" className="w-full justify-start text-muted-foreground">
                <Link href={workspaceId && tracker ? `/app/${tracker.slug}/${workspaceId}/settings` : "/app"}>
                  <Settings className="mr-2 size-4" />
                  Settings
                </Link>
              </Button>
            </div>
          </div>
        </aside>

        <main className="min-w-0 px-6 py-8 md:px-8">{children}</main>
      </div>
    </div>
  );
}
