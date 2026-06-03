-- Platform-owned tables for shared app concerns.
-- Keep tracker-specific data out of this schema area.

create table if not exists public.workspaces (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  owner_user_id uuid not null references auth.users(id) on delete cascade,
  created_at timestamptz not null default now()
);

create table if not exists public.workspace_members (
  workspace_id uuid not null references public.workspaces(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  role text not null check (role in ('owner', 'admin', 'member')),
  created_at timestamptz not null default now(),
  primary key (workspace_id, user_id)
);

create table if not exists public.workspace_tracker_activations (
  workspace_id uuid not null references public.workspaces(id) on delete cascade,
  tracker_slug text not null check (tracker_slug in ('cricket', 'sneakers')),
  activated_at timestamptz not null default now(),
  primary key (workspace_id, tracker_slug)
);
