-- Sout El Falah - Auth Setup
-- Auto-create profile and private details after signup

begin;

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  raw_full_name text;
  raw_phone text;
begin
  raw_full_name := nullif(trim(coalesce(new.raw_user_meta_data ->> 'full_name', '')), '');
  raw_phone := nullif(trim(coalesce(new.raw_user_meta_data ->> 'phone', '')), '');

  insert into public.profiles (
    id,
    full_name,
    is_onboarding_completed
  )
  values (
    new.id,
    raw_full_name,
    false
  )
  on conflict (id) do nothing;

  insert into public.profile_private_details (
    user_id,
    phone
  )
  values (
    new.id,
    raw_phone
  )
  on conflict (user_id) do nothing;

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;

create trigger on_auth_user_created
after insert on auth.users
for each row
execute function public.handle_new_user();

commit;
