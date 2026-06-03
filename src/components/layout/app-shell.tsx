import Link from "next/link";
import { BarChart3, Grid2X2, Settings } from "lucide-react";
import { WorkspaceSwitcher } from "@/components/layout/workspace-switcher";
import { Button } from "@/components/ui/button";

type AppShellProps = {
  children: React.ReactNode;
};

export function AppShell({ children }: AppShellProps) {
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
          <Link href="/app" className="text-lg font-semibold tracking-normal">
            Hoblio
          </Link>
          <WorkspaceSwitcher />
        </div>
      </header>
      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-8 px-6 py-8 md:grid-cols-[220px_1fr]">
        <aside className="space-y-2">
          <Button asChild variant="ghost" className="w-full justify-start">
            <Link href="/app">
              <Grid2X2 className="mr-2 size-4" />
              Trackers
            </Link>
          </Button>
          <Button asChild variant="ghost" className="w-full justify-start">
            <Link href="/app/cricket/default/dashboard">
              <BarChart3 className="mr-2 size-4" />
              Cricket
            </Link>
          </Button>
          <Button asChild variant="ghost" className="w-full justify-start">
            <Link href="/app/cricket/default/settings">
              <Settings className="mr-2 size-4" />
              Settings
            </Link>
          </Button>
        </aside>
        <main>{children}</main>
      </div>
    </div>
  );
}
