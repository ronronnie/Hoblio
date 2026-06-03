-- Cricket Tracker-owned tables.
-- Cricket data should stay explicit and module-specific.

create table if not exists public.cricket_players (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.workspaces(id) on delete cascade,
  display_name text not null,
  created_at timestamptz not null default now()
);

create table if not exists public.cricket_matches (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.workspaces(id) on delete cascade,
  title text not null,
  played_at timestamptz not null,
  status text not null check (status in ('draft', 'in-progress', 'completed')),
  created_at timestamptz not null default now()
);

create table if not exists public.cricket_score_entries (
  id uuid primary key default gen_random_uuid(),
  match_id uuid not null references public.cricket_matches(id) on delete cascade,
  player_id uuid not null references public.cricket_players(id) on delete cascade,
  runs integer not null default 0 check (runs >= 0),
  balls_faced integer not null default 0 check (balls_faced >= 0),
  wickets integer not null default 0 check (wickets >= 0),
  overs_bowled numeric not null default 0 check (overs_bowled >= 0),
  created_at timestamptz not null default now()
);
