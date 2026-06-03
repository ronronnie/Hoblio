import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function AuthPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-muted px-6">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Sign in</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm text-muted-foreground">
          <p>Supabase auth will be wired into this screen during the auth pass.</p>
          <p>The MVP keeps auth in the platform layer, separate from tracker logic.</p>
        </CardContent>
      </Card>
    </main>
  );
}
