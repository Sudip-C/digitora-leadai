create or replace function private.can_view_organization(
  target_organization_id uuid,
  target_creator_id uuid
)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select
    (select auth.uid()) is not null
    and (
      exists (
        select 1
        from public.organization_memberships as membership
        where membership.organization_id = target_organization_id
          and membership.user_id = (select auth.uid())
      )
      or (
        target_creator_id = (select auth.uid())
        and not exists (
          select 1
          from public.organization_memberships as membership
          where membership.organization_id = target_organization_id
        )
      )
    );
$$;

revoke all on function private.can_view_organization(uuid, uuid)
  from public;
revoke all on function private.can_view_organization(uuid, uuid)
  from anon;
grant execute on function private.can_view_organization(uuid, uuid)
  to authenticated;

drop policy if exists organizations_member_select
  on public.organizations;

create policy organizations_member_select
  on public.organizations
  for select
  to authenticated
  using (
    private.can_view_organization(id, created_by)
  );

comment on function private.can_view_organization(uuid, uuid)
  is 'Allows organization members to read a tenant and lets its creator receive the row during INSERT RETURNING before the owner membership is visible to the statement snapshot.';
