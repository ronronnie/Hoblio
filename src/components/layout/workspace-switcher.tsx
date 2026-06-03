"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronDown, Footprints, Trophy } from "lucide-react";
import type { AppShellWorkspace } from "@/components/layout/types";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const workspaceIcons = {
  Trophy,
  Footprints
};

type WorkspaceSwitcherProps = {
  workspaces: AppShellWorkspace[];
  currentWorkspaceId?: string;
};

export function WorkspaceSwitcher({ workspaces, currentWorkspaceId }: WorkspaceSwitcherProps) {
  const [isOpen, setIsOpen] = useState(false);
  const currentWorkspace = workspaces.find((workspace) => workspace.id === currentWorkspaceId);
  const CurrentIcon = currentWorkspace
    ? workspaceIcons[currentWorkspace.trackerIconName]
    : Trophy;

  return (
    <div className="relative">
      <Button
        variant="outline"
        className="h-auto w-full justify-between px-3 py-2 text-left"
        type="button"
        aria-expanded={isOpen}
        onClick={() => setIsOpen((current) => !current)}
      >
        <span className="flex min-w-0 items-center gap-2">
          <span className="rounded-md bg-muted p-1.5">
            <CurrentIcon className="size-4" aria-hidden="true" />
          </span>
          <span className="min-w-0">
            <span className="block truncate text-sm font-medium">
              {currentWorkspace?.name ?? "Select workspace"}
            </span>
            <span className="block truncate text-xs text-muted-foreground">
              {currentWorkspace?.trackerName ?? "No workspace selected"}
            </span>
          </span>
        </span>
        <ChevronDown
          className={cn(
            "ml-2 size-4 shrink-0 text-muted-foreground transition-transform",
            isOpen ? "rotate-180" : ""
          )}
          aria-hidden="true"
        />
      </Button>

      {isOpen ? (
        <div className="absolute left-0 right-0 z-20 mt-2 rounded-lg border bg-card p-1 shadow-lg">
          {workspaces.length > 0 ? (
            workspaces.map((workspace) => {
              const Icon = workspaceIcons[workspace.trackerIconName];
              const isCurrent = workspace.id === currentWorkspaceId;

              return (
                <Link
                  key={workspace.id}
                  href={workspace.dashboardHref}
                  onClick={() => setIsOpen(false)}
                  className={cn(
                    "flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors hover:bg-muted",
                    isCurrent ? "bg-muted" : ""
                  )}
                >
                  <span className="rounded-md border bg-background p-1.5">
                    <Icon className="size-4" aria-hidden="true" />
                  </span>
                  <span className="min-w-0">
                    <span className="block truncate font-medium">{workspace.name}</span>
                    <span className="block truncate text-xs text-muted-foreground">
                      {workspace.trackerName}
                    </span>
                  </span>
                </Link>
              );
            })
          ) : (
            <div className="px-3 py-4 text-sm text-muted-foreground">
              No activated tracker workspaces yet.
            </div>
          )}
        </div>
      ) : null}
    </div>
  );
}
