-- Sout El Falah - Row Level Security (RLS) v2
-- Updated to match schema v3

begin;

alter table public.profiles enable row level security;
alter table public.profile_private_details enable row level security;
alter table public.listings enable row level security;
alter table public.listing_images enable row level security;
alter table public.purchase_requests enable row level security;
alter table public.conversations enable row level security;
alter table public.conversation_participants enable row level security;
alter table public.messages enable row level security;
alter table public.governorates enable row level security;
alter table public.activity_types enable row level security;

drop policy if exists "governorates_select_all" on public.governorates;
drop policy if exists "activity_types_select_all" on public.activity_types;

drop policy if exists "profiles_select_all_authenticated" on public.profiles;
drop policy if exists "profiles_insert_own" on public.profiles;
drop policy if exists "profiles_update_own" on public.profiles;

drop policy if exists "profile_private_details_select_own" on public.profile_private_details;
drop policy if exists "profile_private_details_insert_own" on public.profile_private_details;
drop policy if exists "profile_private_details_update_own" on public.profile_private_details;

drop policy if exists "listings_select_active_or_owner" on public.listings;
drop policy if exists "listings_insert_own" on public.listings;
drop policy if exists "listings_update_own" on public.listings;
drop policy if exists "listings_delete_own" on public.listings;

drop policy if exists "listing_images_select_active_or_owner" on public.listing_images;
drop policy if exists "listing_images_insert_owner" on public.listing_images;
drop policy if exists "listing_images_update_owner" on public.listing_images;
drop policy if exists "listing_images_delete_owner" on public.listing_images;

drop policy if exists "purchase_requests_select_active_or_owner" on public.purchase_requests;
drop policy if exists "purchase_requests_insert_own" on public.purchase_requests;
drop policy if exists "purchase_requests_update_own" on public.purchase_requests;
drop policy if exists "purchase_requests_delete_own" on public.purchase_requests;

drop policy if exists "conversations_select_participant_only" on public.conversations;
drop policy if exists "conversations_insert_authenticated" on public.conversations;
drop policy if exists "conversations_update_participant_only" on public.conversations;

drop policy if exists "conversation_participants_select_participant_rows" on public.conversation_participants;
drop policy if exists "conversation_participants_insert_participant_or_creator" on public.conversation_participants;
drop policy if exists "conversation_participants_update_own_row" on public.conversation_participants;
drop policy if exists "conversation_participants_delete_participant_or_creator" on public.conversation_participants;

drop policy if exists "messages_select_participant_only" on public.messages;
drop policy if exists "messages_insert_participant_only" on public.messages;

create policy "governorates_select_all"
on public.governorates
for select
to authenticated
using (true);

create policy "activity_types_select_all"
on public.activity_types
for select
to authenticated
using (true);

-- profiles now contain public-safe fields only
create policy "profiles_select_all_authenticated"
on public.profiles
for select
to authenticated
using (true);

create policy "profiles_insert_own"
on public.profiles
for insert
to authenticated
with check (auth.uid() = id);

create policy "profiles_update_own"
on public.profiles
for update
to authenticated
using (auth.uid() = id)
with check (auth.uid() = id);

create policy "profile_private_details_select_own"
on public.profile_private_details
for select
to authenticated
using (auth.uid() = user_id);

create policy "profile_private_details_insert_own"
on public.profile_private_details
for insert
to authenticated
with check (auth.uid() = user_id);

create policy "profile_private_details_update_own"
on public.profile_private_details
for update
to authenticated
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

create policy "listings_select_active_or_owner"
on public.listings
for select
to authenticated
using (
  status = 'active'
  or auth.uid() = user_id
);

create policy "listings_insert_own"
on public.listings
for insert
to authenticated
with check (auth.uid() = user_id);

create policy "listings_update_own"
on public.listings
for update
to authenticated
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

create policy "listings_delete_own"
on public.listings
for delete
to authenticated
using (auth.uid() = user_id);

create policy "listing_images_select_active_or_owner"
on public.listing_images
for select
to authenticated
using (
  exists (
    select 1
    from public.listings l
    where l.id = listing_images.listing_id
      and (
        l.status = 'active'
        or l.user_id = auth.uid()
      )
  )
);

create policy "listing_images_insert_owner"
on public.listing_images
for insert
to authenticated
with check (
  exists (
    select 1
    from public.listings l
    where l.id = listing_images.listing_id
      and l.user_id = auth.uid()
  )
);

create policy "listing_images_update_owner"
on public.listing_images
for update
to authenticated
using (
  exists (
    select 1
    from public.listings l
    where l.id = listing_images.listing_id
      and l.user_id = auth.uid()
  )
)
with check (
  exists (
    select 1
    from public.listings l
    where l.id = listing_images.listing_id
      and l.user_id = auth.uid()
  )
);

create policy "listing_images_delete_owner"
on public.listing_images
for delete
to authenticated
using (
  exists (
    select 1
    from public.listings l
    where l.id = listing_images.listing_id
      and l.user_id = auth.uid()
  )
);

create policy "purchase_requests_select_active_or_owner"
on public.purchase_requests
for select
to authenticated
using (
  status = 'active'
  or auth.uid() = user_id
);

create policy "purchase_requests_insert_own"
on public.purchase_requests
for insert
to authenticated
with check (auth.uid() = user_id);

create policy "purchase_requests_update_own"
on public.purchase_requests
for update
to authenticated
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

create policy "purchase_requests_delete_own"
on public.purchase_requests
for delete
to authenticated
using (auth.uid() = user_id);

create policy "conversations_select_participant_only"
on public.conversations
for select
to authenticated
using (
  exists (
    select 1
    from public.conversation_participants cp
    where cp.conversation_id = conversations.id
      and cp.user_id = auth.uid()
  )
);

create policy "conversations_insert_authenticated"
on public.conversations
for insert
to authenticated
with check (auth.uid() = created_by);

create policy "conversations_update_participant_only"
on public.conversations
for update
to authenticated
using (
  exists (
    select 1
    from public.conversation_participants cp
    where cp.conversation_id = conversations.id
      and cp.user_id = auth.uid()
  )
)
with check (
  exists (
    select 1
    from public.conversation_participants cp
    where cp.conversation_id = conversations.id
      and cp.user_id = auth.uid()
  )
);

create policy "conversation_participants_select_participant_rows"
on public.conversation_participants
for select
to authenticated
using (
  exists (
    select 1
    from public.conversation_participants cp
    where cp.conversation_id = conversation_participants.conversation_id
      and cp.user_id = auth.uid()
  )
);

create policy "conversation_participants_insert_participant_or_creator"
on public.conversation_participants
for insert
to authenticated
with check (
  auth.uid() = user_id
  or exists (
    select 1
    from public.conversations c
    where c.id = conversation_participants.conversation_id
      and c.created_by = auth.uid()
  )
);

create policy "conversation_participants_update_own_row"
on public.conversation_participants
for update
to authenticated
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

create policy "conversation_participants_delete_participant_or_creator"
on public.conversation_participants
for delete
to authenticated
using (
  auth.uid() = user_id
  or exists (
    select 1
    from public.conversations c
    where c.id = conversation_participants.conversation_id
      and c.created_by = auth.uid()
  )
);

create policy "messages_select_participant_only"
on public.messages
for select
to authenticated
using (
  exists (
    select 1
    from public.conversation_participants cp
    where cp.conversation_id = messages.conversation_id
      and cp.user_id = auth.uid()
  )
);

create policy "messages_insert_participant_only"
on public.messages
for insert
to authenticated
with check (
  auth.uid() = sender_id
  and exists (
    select 1
    from public.conversation_participants cp
    where cp.conversation_id = messages.conversation_id
      and cp.user_id = auth.uid()
  )
);

commit;
