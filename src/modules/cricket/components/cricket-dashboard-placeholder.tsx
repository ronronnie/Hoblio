import { Trophy } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

type CricketDashboardPlaceholderProps = {
  workspaceId: string;
};

export function CricketDashboardPlaceholder({ workspaceId }: CricketDashboardPlaceholderProps) {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold tracking-normal">Cricket Dashboard</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Workspace: <span className="font-medium text-foreground">{workspaceId}</span>
        </p>
      </div>
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="rounded-md bg-accent p-2 text-accent-foreground">
              <Trophy className="size-5" aria-hidden="true" />
            </div>
            <div>
              <CardTitle>MVP build starts here</CardTitle>
              <CardDescription>
                Match setup, scoring, calculations, leaderboard, and profiles will be implemented
                inside the Cricket module.
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="grid gap-3 text-sm text-muted-foreground sm:grid-cols-2">
          <div className="rounded-md border p-4">Match creation</div>
          <div className="rounded-md border p-4">Manual score entry</div>
          <div className="rounded-md border p-4">Leaderboard calculations</div>
          <div className="rounded-md border p-4">Player profiles</div>
        </CardContent>
      </Card>
    </div>
  );
}
