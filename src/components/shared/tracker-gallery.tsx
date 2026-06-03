import Link from "next/link";
import { ArrowRight, Lock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { trackerRegistry } from "@/modules/platform/tracker-activation/trackerRegistry";

export function TrackerGallery() {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      {trackerRegistry.map((tracker) => (
        <Card key={tracker.slug}>
          <CardHeader>
            <div className="flex items-start justify-between gap-4">
              <div>
                <CardTitle>{tracker.name}</CardTitle>
                <CardDescription className="mt-2">{tracker.description}</CardDescription>
              </div>
              <Badge variant={tracker.status === "active" ? "default" : "secondary"}>
                {tracker.status === "active" ? "Active" : "Coming soon"}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            {tracker.status === "active" ? (
              <Button asChild>
                <Link href={`/app/${tracker.slug}/default/dashboard`}>
                  Open
                  <ArrowRight className="ml-2 size-4" />
                </Link>
              </Button>
            ) : (
              <Button variant="secondary" disabled>
                <Lock className="mr-2 size-4" />
                Planned
              </Button>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
