import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-background">
      <section className="mx-auto flex min-h-screen w-full max-w-5xl flex-col justify-center gap-8 px-6 py-16">
        <div className="max-w-3xl space-y-5">
          <p className="text-sm font-medium uppercase tracking-[0.18em] text-muted-foreground">
            Modular tracker platform
          </p>
          <h1 className="text-4xl font-semibold tracking-normal text-foreground sm:text-6xl">
            Hoblio
          </h1>
          <p className="max-w-2xl text-lg leading-8 text-muted-foreground">
            A single platform for predefined tracker apps. Cricket Tracker is
            the MVP module; Sneaker Vault is reserved for a later product build.
          </p>
        </div>
        <div>
          <Button asChild>
            <Link href="/app">
              Open platform
              <ArrowRight className="ml-2 size-4" />
            </Link>
          </Button>
        </div>
      </section>
    </main>
  );
}
