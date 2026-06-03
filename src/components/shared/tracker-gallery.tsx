import Link from "next/link";
import { Footprints, Lock, Trophy } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  getAllTrackers,
  getAvailableTrackers
} from "@/modules/platform/tracker-activation/trackerRegistry";
import type { TrackerDefinition } from "@/modules/platform/tracker-activation/types";

const trackerIcons = {
  Trophy,
  Footprints
};

function TrackerIcon({ tracker }: { tracker: TrackerDefinition }) {
  const Icon = trackerIcons[tracker.iconName];

  return (
    <div className="rounded-md bg-muted p-2 text-foreground">
      <Icon className="size-5" aria-hidden="true" />
    </div>
  );
}

export function TrackerGallery() {
  const trackers = getAllTrackers();
  const availableTrackers = getAvailableTrackers();

  return (
    <div className="space-y-4">
      {availableTrackers.length === 0 ? (
        <Card>
          <CardHeader>
            <CardTitle>No active trackers</CardTitle>
            <CardDescription>
              Product-defined trackers will appear here when they become available.
            </CardDescription>
          </CardHeader>
        </Card>
      ) : null}
      <div className="grid gap-4 md:grid-cols-2">
        {trackers.map((tracker) => (
          <Card key={tracker.slug}>
            <CardHeader>
              <div className="flex items-start justify-between gap-4">
                <div className="flex gap-3">
                  <TrackerIcon tracker={tracker} />
                  <div>
                    <CardTitle>{tracker.name}</CardTitle>
                    <CardDescription className="mt-2">{tracker.description}</CardDescription>
                    <p className="mt-3 text-xs font-medium uppercase tracking-[0.14em] text-muted-foreground">
                      {tracker.category}
                    </p>
                  </div>
                </div>
                <Badge variant={tracker.status === "available" ? "default" : "secondary"}>
                  {tracker.status === "available" ? "Available" : "Coming soon"}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              {tracker.status === "available" ? (
                <Button asChild>
                  <Link href={tracker.setupRoute}>Activate tracker</Link>
                </Button>
              ) : (
                <Button variant="secondary" disabled>
                  <Lock className="mr-2 size-4" />
                  Coming soon
                </Button>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
