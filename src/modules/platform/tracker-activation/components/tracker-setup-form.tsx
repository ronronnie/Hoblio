"use client";

import { useActionState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  activateTrackerAction,
  type ActivateTrackerFormState
} from "@/modules/platform/tracker-activation/actions";
import type { TrackerDefinition } from "@/modules/platform/tracker-activation/types";

const initialState: ActivateTrackerFormState = {
  status: "idle"
};

type TrackerSetupFormProps = {
  tracker: TrackerDefinition;
};

export function TrackerSetupForm({ tracker }: TrackerSetupFormProps) {
  const router = useRouter();
  const [state, formAction, isPending] = useActionState(activateTrackerAction, initialState);

  useEffect(() => {
    if (state.status === "success" && state.redirectTo) {
      router.replace(state.redirectTo);
    }
  }, [router, state.redirectTo, state.status]);

  return (
    <form action={formAction} className="space-y-5">
      <input type="hidden" name="trackerSlug" value={tracker.slug} />
      <div className="space-y-2">
        <label htmlFor="workspaceName" className="text-sm font-medium">
          Workspace name
        </label>
        <input
          id="workspaceName"
          name="workspaceName"
          type="text"
          placeholder="Weekend Cricket"
          className="h-10 w-full rounded-md border bg-background px-3 text-sm outline-none transition-colors placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring"
          minLength={2}
          maxLength={80}
          required
          disabled={isPending || state.status === "success"}
        />
      </div>

      {state.status === "error" && state.message ? (
        <div className="rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
          {state.message}
        </div>
      ) : null}

      {state.status === "success" && state.message ? (
        <div className="rounded-md border border-primary/30 bg-primary/10 px-3 py-2 text-sm text-primary">
          {state.message}
        </div>
      ) : null}

      <Button type="submit" disabled={isPending || state.status === "success"}>
        {isPending ? (
          <>
            <Loader2 className="mr-2 size-4 animate-spin" />
            Activating
          </>
        ) : (
          "Create workspace"
        )}
      </Button>
    </form>
  );
}
