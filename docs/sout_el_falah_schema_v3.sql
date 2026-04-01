-- Sout El Falah - Database Schema v3
-- Corrected MVP schema for Next.js + Supabase
-- Improvements:
-- 1) onboarding-friendly nullable profile fields
-- 2) private phone moved out of public profiles
-- 3) numeric check constraints
-- 4) single primary image constraint
-- 5) public-safe profile structure

begin;

create extension if not exists pgcrypto;

-- =========================================================
-- Enums
-- =========================================================

do $$
begin
  if not exists (select 1 from pg_type where typname = 'user_role') then
    create type public.user_role as enum ('farmer', 'buyer', 'merchant');
  end if;

  if not exists (select 1 from pg_type where typname = 'item_status') then
    create type public.item_status as enum ('draft', 'active', 'inactive', 'archived');
  end if;

  if not exists (select 1 from pg_type where typname = 'conversation_source_type') then
    create type public.conversation_source_type as enum ('listing', 'purchase_request', 'direct');
  end if;
end
$$;

-- =========================================================
-- Utility function for updated_at
-- =========================================================

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- =========================================================
-- Lookup Tables
-- =========================================================

create table if not exists public.governorates (
  id uuid primary key default gen_random_uuid(),
  code text not null unique,
  name_en text not null unique,
  name_ar text,
  is_active boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

create index if not exists idx_governorates_is_active on public.governorates(is_active);
create index if not exists idx_governorates_sort_order on public.governorates(sort_order);

create table if not exists public.activity_types (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name_en text not null unique,
  name_ar text,
  description text,
  is_active boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

create index if not exists idx_activity_types_is_active on public.activity_types(is_active);
create index if not exists idx_activity_types_sort_order on public.activity_types(sort_order);

-- =========================================================
-- Profiles
-- Public-safe profile data only
-- Key onboarding fields are nullable until onboarding is completed
-- =========================================================

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  role public.user_role,
  governorate_id uuid references public.governorates(id),
  region text,
  avatar_url text,
  activity_type_id uuid references public.activity_types(id),
  bio text,
  is_onboarding_completed boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint profiles_full_name_not_blank check (
    full_name is null or char_length(trim(full_name)) > 0
  ),
  constraint profiles_onboarding_requirements_check check (
    is_onboarding_completed = false
    or (
      full_name is not null
      and role is not null
      and governorate_id is not null
    )
  )
);

create index if not exists idx_profiles_role on public.profiles(role);
create index if not exists idx_profiles_governorate_id on public.profiles(governorate_id);
create index if not exists idx_profiles_activity_type_id on public.profiles(activity_type_id);

drop trigger if exists trg_profiles_updated_at on public.profiles;
create trigger trg_profiles_updated_at
before update on public.profiles
for each row
execute function public.set_updated_at();

-- =========================================================
-- Profile Private Details
-- Sensitive user data kept separate from public profiles
-- =========================================================

create table if not exists public.profile_private_details (
  user_id uuid primary key references public.profiles(id) on delete cascade,
  phone text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint profile_private_details_phone_not_blank check (
    phone is null or char_length(trim(phone)) > 0
  )
);

drop trigger if exists trg_profile_private_details_updated_at on public.profile_private_details;
create trigger trg_profile_private_details_updated_at
before update on public.profile_private_details
for each row
execute function public.set_updated_at();

-- =========================================================
-- Listings
-- =========================================================

create table if not exists public.listings (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  title text not null,
  description text,
  category text not null,
  price numeric(12,2),
  is_price_negotiable boolean not null default false,
  quantity numeric(12,2),
  unit text,
  governorate_id uuid not null references public.governorates(id),
  region text,
  status public.item_status not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint listings_title_not_blank check (char_length(trim(title)) > 0),
  constraint listings_category_not_blank check (char_length(trim(category)) > 0),
  constraint listings_price_non_negative check (price is null or price >= 0),
  constraint listings_quantity_positive check (quantity is null or quantity > 0),
  constraint listings_unit_not_blank check (unit is null or char_length(trim(unit)) > 0)
);

create index if not exists idx_listings_user_id on public.listings(user_id);
create index if not exists idx_listings_category on public.listings(category);
create index if not exists idx_listings_governorate_id on public.listings(governorate_id);
create index if not exists idx_listings_status on public.listings(status);
create index if not exists idx_listings_created_at on public.listings(created_at desc);

drop trigger if exists trg_listings_updated_at on public.listings;
create trigger trg_listings_updated_at
before update on public.listings
for each row
execute function public.set_updated_at();

-- =========================================================
-- Listing Images
-- =========================================================

create table if not exists public.listing_images (
  id uuid primary key default gen_random_uuid(),
  listing_id uuid not null references public.listings(id) on delete cascade,
  storage_path text not null,
  is_primary boolean not null default false,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  constraint listing_images_storage_path_not_blank check (
    char_length(trim(storage_path)) > 0
  )
);

create index if not exists idx_listing_images_listing_id on public.listing_images(listing_id);

create unique index if not exists uq_listing_images_single_primary
on public.listing_images(listing_id)
where is_primary = true;

-- =========================================================
-- Purchase Requests
-- =========================================================

create table if not exists public.purchase_requests (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  title text not null,
  description text,
  category text not null,
  requested_quantity numeric(12,2),
  unit text,
  budget numeric(12,2),
  desired_governorate_id uuid not null references public.governorates(id),
  desired_region text,
  status public.item_status not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint purchase_requests_title_not_blank check (char_length(trim(title)) > 0),
  constraint purchase_requests_category_not_blank check (char_length(trim(category)) > 0),
  constraint purchase_requests_quantity_positive check (
    requested_quantity is null or requested_quantity > 0
  ),
  constraint purchase_requests_budget_non_negative check (
    budget is null or budget >= 0
  ),
  constraint purchase_requests_unit_not_blank check (
    unit is null or char_length(trim(unit)) > 0
  )
);

create index if not exists idx_purchase_requests_user_id on public.purchase_requests(user_id);
create index if not exists idx_purchase_requests_category on public.purchase_requests(category);
create index if not exists idx_purchase_requests_desired_governorate_id on public.purchase_requests(desired_governorate_id);
create index if not exists idx_purchase_requests_status on public.purchase_requests(status);
create index if not exists idx_purchase_requests_created_at on public.purchase_requests(created_at desc);

drop trigger if exists trg_purchase_requests_updated_at on public.purchase_requests;
create trigger trg_purchase_requests_updated_at
before update on public.purchase_requests
for each row
execute function public.set_updated_at();

-- =========================================================
-- Conversations
-- =========================================================

create table if not exists public.conversations (
  id uuid primary key default gen_random_uuid(),
  source_type public.conversation_source_type not null default 'direct',
  listing_id uuid references public.listings(id) on delete cascade,
  purchase_request_id uuid references public.purchase_requests(id) on delete cascade,
  created_by uuid not null references public.profiles(id) on delete cascade,
  last_message_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint conversations_single_source_check check (
    (
      source_type = 'listing'
      and listing_id is not null
      and purchase_request_id is null
    ) or (
      source_type = 'purchase_request'
      and purchase_request_id is not null
      and listing_id is null
    ) or (
      source_type = 'direct'
      and listing_id is null
      and purchase_request_id is null
    )
  )
);

create index if not exists idx_conversations_created_by on public.conversations(created_by);
create index if not exists idx_conversations_listing_id on public.conversations(listing_id);
create index if not exists idx_conversations_purchase_request_id on public.conversations(purchase_request_id);
create index if not exists idx_conversations_last_message_at on public.conversations(last_message_at desc);

drop trigger if exists trg_conversations_updated_at on public.conversations;
create trigger trg_conversations_updated_at
before update on public.conversations
for each row
execute function public.set_updated_at();

-- =========================================================
-- Conversation Participants
-- =========================================================

create table if not exists public.conversation_participants (
  id uuid primary key default gen_random_uuid(),
  conversation_id uuid not null references public.conversations(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  joined_at timestamptz not null default now(),
  last_read_at timestamptz,
  is_archived boolean not null default false,
  unique (conversation_id, user_id)
);

create index if not exists idx_conversation_participants_conversation_id
  on public.conversation_participants(conversation_id);

create index if not exists idx_conversation_participants_user_id
  on public.conversation_participants(user_id);

-- =========================================================
-- Messages
-- =========================================================

create table if not exists public.messages (
  id uuid primary key default gen_random_uuid(),
  conversation_id uuid not null references public.conversations(id) on delete cascade,
  sender_id uuid not null references public.profiles(id) on delete cascade,
  body text not null,
  created_at timestamptz not null default now(),
  constraint messages_body_not_blank check (char_length(trim(body)) > 0)
);

create index if not exists idx_messages_conversation_id on public.messages(conversation_id);
create index if not exists idx_messages_sender_id on public.messages(sender_id);
create index if not exists idx_messages_created_at on public.messages(created_at desc);

-- =========================================================
-- Helper function to update conversation last_message_at
-- =========================================================

create or replace function public.touch_conversation_last_message_at()
returns trigger
language plpgsql
as $$
begin
  update public.conversations
  set last_message_at = new.created_at,
      updated_at = now()
  where id = new.conversation_id;
  return new;
end;
$$;

drop trigger if exists trg_messages_touch_conversation on public.messages;
create trigger trg_messages_touch_conversation
after insert on public.messages
for each row
execute function public.touch_conversation_last_message_at();

commit;
