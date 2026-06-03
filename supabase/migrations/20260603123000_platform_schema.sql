-- Hoblio platform schema.
-- This migration owns shared platform concerns only: profiles, predefined trackers,
-- workspaces, membership, tracker activation, billing status, and platform AI usage.
--
-- Tracker-specific tables must live in separate tracker module migrations.
-- Do not add generic template-builder tables, generic custom fields, or a generic
-- records table for all trackers.

create extension if not exists pgcrypto;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  avatar_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.trackers (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null check (slug in ('cricket', 'sneakers')),
  name text not null,
  description text,
  category text,
  status text not null check (status in ('available', 'coming_soon')),
  is_paid boolean not null default false,
  created_at timestamptz not null default now()
);

create table if not exists public.workspaces (
  id uuid primary key default gen_random_uuid(),
  tracker_slug text not null references public.trackers(slug),
  owner_id uuid not null references public.profiles(id) on delete cascade,
  name text not null,
  description text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.workspace_members (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.workspaces(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  role text not null check (role in ('owner', 'admin', 'member', 'viewer')),
  created_at timestamptz not null default now(),
  unique (workspace_id, user_id)
);

create table if not exists public.user_tracker_activations (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  tracker_slug text not null references public.trackers(slug),
  workspace_id uuid not null references public.workspaces(id) on delete cascade,
  status text not null default 'active' check (status in ('active', 'inactive')),
  created_at timestamptz not null default now(),
  unique (user_id, tracker_slug, workspace_id)
);

create table if not exists public.subscriptions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  plan text not null default 'free',
  status text,
  current_period_end timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id)
);

create table if not exists public.ai_usage_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  workspace_id uuid references public.workspaces(id) on delete set null,
  tracker_slug text references public.trackers(slug),
  usage_type text,
  input_tokens integer not null default 0 check (input_tokens >= 0),
  output_tokens integer not null default 0 check (output_tokens >= 0),
  audio_seconds integer not null default 0 check (audio_seconds >= 0),
  created_at timestamptz not null default now()
);

comment on table public.trackers is
  'Predefined product-owned tracker apps only. Users cannot create custom trackers or templates.';
comment on table public.workspaces is
  'Platform workspace instances for predefined trackers. Tracker-specific data lives in module-specific tables.';
comment on table public.ai_usage_logs is
  'Platform-level AI usage accounting. Tracker AI business logic belongs to each tracker module.';

create index if not exists trackers_slug_idx on public.trackers(slug);
create index if not exists workspaces_owner_id_idx on public.workspaces(owner_id);
create index if not exists workspaces_tracker_slug_idx on public.workspaces(tracker_slug);
create index if not exists workspace_members_workspace_id_idx on public.workspace_members(workspace_id);
create index if not exists workspace_members_user_id_idx on public.workspace_members(user_id);
create index if not exists user_tracker_activations_user_id_idx on public.user_tracker_activations(user_id);
create index if not exists user_tracker_activations_workspace_id_idx on public.user_tracker_activations(workspace_id);
create index if not exists subscriptions_user_id_idx on public.subscriptions(user_id);
create index if not exists ai_usage_logs_user_id_idx on public.ai_usage_logs(user_id);
create index if not exists ai_usage_logs_workspace_id_idx on public.ai_usage_logs(workspace_id);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists set_profiles_updated_at on public.profiles;
create trigger set_profiles_updated_at
before update on public.profiles
for each row execute function public.set_updated_at();

drop trigger if exists set_workspaces_updated_at on public.workspaces;
create trigger set_workspaces_updated_at
before update on public.workspaces
for each row execute function public.set_updated_at();

drop trigger if exists set_subscriptions_updated_at on public.subscriptions;
create trigger set_subscriptions_updated_at
before update on public.subscriptions
for each row execute function public.set_updated_at();

create or replace function public.create_profile_for_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, full_name, avatar_url)
  values (
    new.id,
    new.raw_user_meta_data ->> 'full_name',
    new.raw_user_meta_data ->> 'avatar_url'
  )
  on conflict (id) do nothing;

  return new;
end;
$$;

drop trigger if exists create_profile_for_new_user on auth.users;
create trigger create_profile_for_new_user
after insert on auth.users
for each row execute function public.create_profile_for_new_user();

create or replace function public.is_tracker_available(target_tracker_slug text)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.trackers
    where slug = target_tracker_slug
      and status = 'available'
  );
$$;

create or replace function public.is_workspace_owner(target_workspace_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.workspaces
    where id = target_workspace_id
      and owner_id = auth.uid()
  );
$$;

create or replace function public.is_workspace_member(target_workspace_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.workspace_members
    where workspace_id = target_workspace_id
      and user_id = auth.uid()
  );
$$;

create or replace function public.can_manage_workspace(target_workspace_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select public.is_workspace_owner(target_workspace_id)
    or exists (
      select 1
      from public.workspace_members
      where workspace_id = target_workspace_id
        and user_id = auth.uid()
        and role in ('owner', 'admin')
    );
$$;

create or replace function public.shares_workspace_with_user(target_user_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.workspace_members current_member
    join public.workspace_members target_member
      on target_member.workspace_id = current_member.workspace_id
    where current_member.user_id = auth.uid()
      and target_member.user_id = target_user_id
  );
$$;

grant execute on function public.is_tracker_available(text) to authenticated;
grant execute on function public.is_workspace_owner(uuid) to authenticated;
grant execute on function public.is_workspace_member(uuid) to authenticated;
grant execute on function public.can_manage_workspace(uuid) to authenticated;
grant execute on function public.shares_workspace_with_user(uuid) to authenticated;

alter table public.profiles enable row level security;
alter table public.trackers enable row level security;
alter table public.workspaces enable row level security;
alter table public.workspace_members enable row level security;
alter table public.user_tracker_activations enable row level security;
alter table public.subscriptions enable row level security;
alter table public.ai_usage_logs enable row level security;

drop policy if exists profiles_select_visible on public.profiles;
create policy profiles_select_visible
on public.profiles
for select
to authenticated
using (id = auth.uid() or public.shares_workspace_with_user(id));

drop policy if exists profiles_insert_self on public.profiles;
create policy profiles_insert_self
on public.profiles
for insert
to authenticated
with check (id = auth.uid());

drop policy if exists profiles_update_self on public.profiles;
create policy profiles_update_self
on public.profiles
for update
to authenticated
using (id = auth.uid())
with check (id = auth.uid());

drop policy if exists trackers_select_authenticated on public.trackers;
create policy trackers_select_authenticated
on public.trackers
for select
to authenticated
using (true);

drop policy if exists workspaces_select_member on public.workspaces;
create policy workspaces_select_member
on public.workspaces
for select
to authenticated
using (owner_id = auth.uid() or public.is_workspace_member(id));

drop policy if exists workspaces_insert_owner_available_tracker on public.workspaces;
create policy workspaces_insert_owner_available_tracker
on public.workspaces
for insert
to authenticated
with check (owner_id = auth.uid() and public.is_tracker_available(tracker_slug));

drop policy if exists workspaces_update_manager on public.workspaces;
create policy workspaces_update_manager
on public.workspaces
for update
to authenticated
using (public.can_manage_workspace(id))
with check (public.can_manage_workspace(id) and public.is_tracker_available(tracker_slug));

drop policy if exists workspaces_delete_owner on public.workspaces;
create policy workspaces_delete_owner
on public.workspaces
for delete
to authenticated
using (owner_id = auth.uid());

drop policy if exists workspace_members_select_member on public.workspace_members;
create policy workspace_members_select_member
on public.workspace_members
for select
to authenticated
using (public.is_workspace_member(workspace_id) or public.is_workspace_owner(workspace_id));

drop policy if exists workspace_members_insert_manager on public.workspace_members;
create policy workspace_members_insert_manager
on public.workspace_members
for insert
to authenticated
with check (public.can_manage_workspace(workspace_id));

drop policy if exists workspace_members_update_manager on public.workspace_members;
create policy workspace_members_update_manager
on public.workspace_members
for update
to authenticated
using (public.can_manage_workspace(workspace_id))
with check (public.can_manage_workspace(workspace_id));

drop policy if exists workspace_members_delete_manager_or_self on public.workspace_members;
create policy workspace_members_delete_manager_or_self
on public.workspace_members
for delete
to authenticated
using (public.can_manage_workspace(workspace_id) or user_id = auth.uid());

drop policy if exists user_tracker_activations_select_visible on public.user_tracker_activations;
create policy user_tracker_activations_select_visible
on public.user_tracker_activations
for select
to authenticated
using (user_id = auth.uid() or public.is_workspace_member(workspace_id));

drop policy if exists user_tracker_activations_insert_self_available_tracker on public.user_tracker_activations;
create policy user_tracker_activations_insert_self_available_tracker
on public.user_tracker_activations
for insert
to authenticated
with check (
  user_id = auth.uid()
  and public.is_workspace_member(workspace_id)
  and public.is_tracker_available(tracker_slug)
);

drop policy if exists user_tracker_activations_update_self_or_manager on public.user_tracker_activations;
create policy user_tracker_activations_update_self_or_manager
on public.user_tracker_activations
for update
to authenticated
using (user_id = auth.uid() or public.can_manage_workspace(workspace_id))
with check (user_id = auth.uid() or public.can_manage_workspace(workspace_id));

drop policy if exists subscriptions_select_self on public.subscriptions;
create policy subscriptions_select_self
on public.subscriptions
for select
to authenticated
using (user_id = auth.uid());

drop policy if exists ai_usage_logs_select_visible on public.ai_usage_logs;
create policy ai_usage_logs_select_visible
on public.ai_usage_logs
for select
to authenticated
using (
  user_id = auth.uid()
  or (workspace_id is not null and public.is_workspace_member(workspace_id))
);

drop policy if exists ai_usage_logs_insert_self_workspace on public.ai_usage_logs;
create policy ai_usage_logs_insert_self_workspace
on public.ai_usage_logs
for insert
to authenticated
with check (
  user_id = auth.uid()
  and (workspace_id is null or public.is_workspace_member(workspace_id))
  and (tracker_slug is null or public.is_tracker_available(tracker_slug))
);

insert into public.trackers (
  id,
  slug,
  name,
  description,
  category,
  status,
  is_paid
)
values
  (
    '11111111-1111-4111-8111-111111111111',
    'cricket',
    'Cricket Tracker',
    'Manage matches, scorecards, calculations, dashboards, and player profiles.',
    'Sports',
    'available',
    false
  ),
  (
    '22222222-2222-4222-8222-222222222222',
    'sneakers',
    'Sneaker Vault',
    'A planned inventory and collection tracker. Not implemented in the MVP.',
    'Collection',
    'coming_soon',
    false
  )
on conflict (slug) do update
set
  name = excluded.name,
  description = excluded.description,
  category = excluded.category,
  status = excluded.status,
  is_paid = excluded.is_paid;
