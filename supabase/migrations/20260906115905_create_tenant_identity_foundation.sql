create schema private;

revoke all on schema private from public;
revoke all on schema private from anon;
revoke all on schema private from authenticated;

create type public.organization_role as enum (
  'owner',
  'manager',
  'agent',
  'viewer'
);

create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  full_name text,
  avatar_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  constraint profiles_full_name_length
    check (
      full_name is null
      or char_length(btrim(full_name)) between 1 and 120
    ),
  constraint profiles_avatar_url_length
    check (
      avatar_url is null
      or char_length(avatar_url) <= 2048
    )
);

create table public.organizations (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  timezone text not null default 'Asia/Kolkata',
  created_by uuid not null references auth.users (id) on delete restrict,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  constraint organizations_name_length
    check (char_length(btrim(name)) between 2 and 120),
  constraint organizations_slug_format
    check (
      char_length(slug) between 3 and 63
      and slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'
    ),
  constraint organizations_timezone_not_blank
    check (char_length(btrim(timezone)) between 1 and 100)
);

create table public.organization_memberships (
  organization_id uuid not null
    references public.organizations (id) on delete cascade,
  user_id uuid not null
    references public.profiles (id) on delete cascade,
  role public.organization_role not null default 'viewer',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  primary key (organization_id, user_id)
);

create index organization_memberships_user_id_idx
  on public.organization_memberships (user_id);

create index organization_memberships_organization_role_idx
  on public.organization_memberships (organization_id, role);

create index organizations_created_by_idx
  on public.organizations (created_by);

create function private.set_updated_at()
returns trigger
language plpgsql
security invoker
set search_path = ''
as $function$
begin
  new.updated_at = now();
  return new;
end;
$function$;

create trigger profiles_set_updated_at
before update on public.profiles
for each row
execute function private.set_updated_at();

create trigger organizations_set_updated_at
before update on public.organizations
for each row
execute function private.set_updated_at();

create trigger organization_memberships_set_updated_at
before update on public.organization_memberships
for each row
execute function private.set_updated_at();

create function private.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $function$
begin
  insert into public.profiles (id, full_name, avatar_url)
  values (
    new.id,
    left(
      nullif(
        btrim(coalesce(new.raw_user_meta_data ->> 'full_name', '')),
        ''
      ),
      120
    ),
    left(
      nullif(
        btrim(coalesce(new.raw_user_meta_data ->> 'avatar_url', '')),
        ''
      ),
      2048
    )
  )
  on conflict (id) do nothing;

  return new;
end;
$function$;

create trigger on_auth_user_created
after insert on auth.users
for each row
execute function private.handle_new_user();

create function private.handle_new_organization()
returns trigger
language plpgsql
security definer
set search_path = ''
as $function$
declare
  authenticated_user_id uuid := (select auth.uid());
begin
  if authenticated_user_id is not null
    and authenticated_user_id <> new.created_by then
    raise exception 'Organization creator must match the authenticated user.'
      using errcode = '42501';
  end if;

  insert into public.organization_memberships (
    organization_id,
    user_id,
    role
  )
  values (
    new.id,
    new.created_by,
    'owner'::public.organization_role
  );

  return new;
end;
$function$;

create trigger on_organization_created
after insert on public.organizations
for each row
execute function private.handle_new_organization();

alter table public.profiles enable row level security;
alter table public.organizations enable row level security;
alter table public.organization_memberships enable row level security;

create function private.is_organization_member(
  target_organization_id uuid
)
returns boolean
language sql
stable
security definer
set search_path = ''
as $function$
  select
    (select auth.uid()) is not null
    and exists (
      select 1
      from public.organization_memberships as membership
      where membership.organization_id = target_organization_id
        and membership.user_id = (select auth.uid())
    );
$function$;

create function private.has_organization_role(
  target_organization_id uuid,
  allowed_roles public.organization_role[]
)
returns boolean
language sql
stable
security definer
set search_path = ''
as $function$
  select
    (select auth.uid()) is not null
    and exists (
      select 1
      from public.organization_memberships as membership
      where membership.organization_id = target_organization_id
        and membership.user_id = (select auth.uid())
        and membership.role = any (allowed_roles)
    );
$function$;

create function private.shares_organization(
  target_user_id uuid
)
returns boolean
language sql
stable
security definer
set search_path = ''
as $function$
  select
    (select auth.uid()) is not null
    and (
      target_user_id = (select auth.uid())
      or exists (
        select 1
        from public.organization_memberships as requester
        inner join public.organization_memberships as target
          on target.organization_id = requester.organization_id
        where requester.user_id = (select auth.uid())
          and target.user_id = target_user_id
      )
    );
$function$;

revoke all on function private.set_updated_at() from public;
revoke all on function private.handle_new_user() from public;
revoke all on function private.handle_new_organization() from public;
revoke all on function private.is_organization_member(uuid) from public;
revoke all on function private.has_organization_role(
  uuid,
  public.organization_role[]
) from public;
revoke all on function private.shares_organization(uuid) from public;

grant usage on schema private to authenticated;
grant execute on function private.is_organization_member(uuid)
  to authenticated;
grant execute on function private.has_organization_role(
  uuid,
  public.organization_role[]
) to authenticated;
grant execute on function private.shares_organization(uuid)
  to authenticated;

create policy profiles_select_shared_organization
on public.profiles
for select
to authenticated
using (private.shares_organization(id));

create policy profiles_update_self
on public.profiles
for update
to authenticated
using ((select auth.uid()) = id)
with check ((select auth.uid()) = id);

create policy organizations_select_memberships
on public.organizations
for select
to authenticated
using (private.is_organization_member(id));

create policy organizations_insert_self
on public.organizations
for insert
to authenticated
with check ((select auth.uid()) = created_by);

create policy organizations_update_managers
on public.organizations
for update
to authenticated
using (
  private.has_organization_role(
    id,
    array['owner', 'manager']::public.organization_role[]
  )
)
with check (
  private.has_organization_role(
    id,
    array['owner', 'manager']::public.organization_role[]
  )
);

create policy organization_memberships_select_members
on public.organization_memberships
for select
to authenticated
using (private.is_organization_member(organization_id));

revoke all on table public.profiles from public;
revoke all on table public.profiles from anon;
revoke all on table public.profiles from authenticated;

revoke all on table public.organizations from public;
revoke all on table public.organizations from anon;
revoke all on table public.organizations from authenticated;

revoke all on table public.organization_memberships from public;
revoke all on table public.organization_memberships from anon;
revoke all on table public.organization_memberships from authenticated;

revoke all on type public.organization_role from public;

grant usage on type public.organization_role
  to authenticated, service_role;

grant select on table public.profiles
  to authenticated;
grant update (full_name, avatar_url) on table public.profiles
  to authenticated;

grant select on table public.organizations
  to authenticated;
grant insert (name, slug, timezone, created_by)
  on table public.organizations
  to authenticated;
grant update (name, slug, timezone)
  on table public.organizations
  to authenticated;

grant select on table public.organization_memberships
  to authenticated;

grant all privileges on table public.profiles
  to service_role;
grant all privileges on table public.organizations
  to service_role;
grant all privileges on table public.organization_memberships
  to service_role;

comment on type public.organization_role is
  'Organization membership roles used for authorization.';

comment on table public.profiles is
  'Application profile data linked one-to-one with auth.users.';

comment on table public.organizations is
  'Tenant boundary for all organization-owned application data.';

comment on table public.organization_memberships is
  'Maps users to organizations and stores authorization roles.';
