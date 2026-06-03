export type WorkspaceRole = "owner" | "admin" | "member";

export type PermissionContext = {
  userId: string;
  workspaceId: string;
  role: WorkspaceRole;
};
