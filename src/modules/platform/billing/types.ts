export type BillingPlan = "free" | "pro";

export type WorkspaceBillingState = {
  workspaceId: string;
  plan: BillingPlan;
};
