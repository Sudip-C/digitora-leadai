alter table public.organization_memberships
  alter constraint organization_memberships_organization_id_fkey
  deferrable initially deferred;

drop trigger if exists on_organization_created
  on public.organizations;

create trigger on_organization_created
  before insert on public.organizations
  for each row
  execute function private.handle_new_organization();

comment on constraint organization_memberships_organization_id_fkey
  on public.organization_memberships
  is 'Deferred so the organization owner membership can be created before INSERT RETURNING is evaluated.';
