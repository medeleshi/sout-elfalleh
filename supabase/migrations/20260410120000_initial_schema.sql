-- Sout El Falah - Unified Schema Foundation (Zero-Base Rebuild)
-- Date: 2026-04-04
-- Purpose: Complete platform schema from scratch

begin;

-- =========================================================
    -- 0. CLEAN SLATE (Optional / Destructive)
-- =========================================================
drop table if exists public.reports cascade;
drop table if exists public.saved_items cascade;
drop table if exists public.notifications cascade;
drop table if exists public.messages cascade;
drop table if exists public.conversation_participants cascade;
drop table if exists public.conversations cascade;
drop table if exists public.post_comments cascade;
drop table if exists public.post_images cascade;
drop table if exists public.posts cascade;
drop table if exists public.listing_images cascade;
drop table if exists public.listings cascade;
drop table if exists public.purchase_requests cascade;
drop table if exists public.profile_private_details cascade;
drop table if exists public.profiles cascade;
drop table if exists public.activity_types cascade;
drop table if exists public.category_units cascade;
drop table if exists public.units cascade;
drop table if exists public.categories cascade;
drop table if exists public.governorates cascade;

drop type if exists public.user_role cascade;
drop type if exists public.item_status cascade;
drop type if exists public.conversation_source_type cascade;
drop type if exists public.report_status cascade;
drop type if exists public.notification_type cascade;
drop type if exists public.unit_type cascade;

drop function if exists public.set_updated_at() cascade;
drop function if exists public.handle_new_user() cascade;

-- =========================================================
-- 1. Enums & Utils
-- =========================================================

-- User roles
create type public.user_role as enum ('farmer', 'buyer', 'merchant', 'admin');

-- Unified status for items
create type public.item_status as enum ('draft', 'active', 'inactive', 'sold', 'archived', 'hidden');

-- Conversation source
create type public.conversation_source_type as enum ('listing', 'purchase_request', 'direct');

-- Report status
create type public.report_status as enum ('pending', 'investigating', 'resolved', 'dismissed');

-- Notification types
create type public.notification_type as enum (
  'new_message', 
  'price_alert', 
  'item_sold', 
  'new_request', 
  'post_comment',
  'system_announcement'
);

-- Unit types
create type public.unit_type as enum ('weight', 'volume', 'count', 'packaging');

-- Utility: updated_at function
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- =========================================================
-- 2. Lookups (Foundation)
-- =========================================================

-- Governorates (Tunisia)
create table public.governorates (
  id uuid primary key default gen_random_uuid(),
  code text not null unique,
  name_en text not null,
  name_ar text not null,
  is_active boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

-- Categories (18 Refined Agricultural Groups)
create table public.categories (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name_en text not null,
  name_ar text not null,
  description_en text,
  description_ar text,
  icon_name text,
  is_active boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Units
create table public.units (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name_en text not null,
  name_ar text not null,
  symbol text,
  unit_type public.unit_type not null default 'count',
  is_active boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

-- Category-Units Mapping
create table public.category_units (
  id uuid primary key default gen_random_uuid(),
  category_id uuid not null references public.categories(id) on delete cascade,
  unit_id uuid not null references public.units(id) on delete cascade,
  is_default boolean not null default false,
  unique (category_id, unit_id)
);

-- Activity Types (Onboarding)
create table public.activity_types (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name_en text not null,
  name_ar text not null,
  is_active boolean not null default true,
  sort_order integer not null default 0
);

-- =========================================================
-- 3. Profiles & Identity
-- =========================================================

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  role public.user_role not null default 'farmer',
  avatar_url text,
  bio text,
  governorate_id uuid references public.governorates(id),
  region text,
  activity_type_id uuid references public.activity_types(id),
  is_onboarding_completed boolean not null default false,
  is_verified boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.profile_private_details (
  user_id uuid primary key references public.profiles(id) on delete cascade,
  phone text,
  email text,
  notification_email boolean not null default true,
  notification_push boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Triggers for profiles
create trigger trg_profiles_updated_at before update on public.profiles for each row execute function public.set_updated_at();
create trigger trg_private_details_updated_at before update on public.profile_private_details for each row execute function public.set_updated_at();

-- Auth Trigger
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, full_name, avatar_url)
  values (new.id, new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'avatar_url');

  insert into public.profile_private_details (user_id, email)
  values (new.id, new.email);

  return new;
end;
$$;

create trigger on_auth_user_created after insert on auth.users for each row execute function public.handle_new_user();

-- =========================================================
-- 4. Marketplace Engine
-- =========================================================

create table public.listings (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  title text not null,
  description text,
  category_id uuid not null references public.categories(id),
  quantity numeric not null check (quantity >= 0),
  unit_id uuid not null references public.units(id),
  price numeric check (price >= 0),
  governorate_id uuid not null references public.governorates(id),
  status public.item_status not null default 'active',
  is_verified boolean not null default false,
  view_count integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.listing_images (
  id uuid primary key default gen_random_uuid(),
  listing_id uuid not null references public.listings(id) on delete cascade,
  storage_path text not null,
  is_primary boolean not null default false,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

create table public.purchase_requests (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  title text not null,
  description text,
  category_id uuid not null references public.categories(id),
  quantity numeric not null check (quantity >= 0),
  unit_id uuid not null references public.units(id),
  budget numeric check (budget >= 0),
  governorate_id uuid not null references public.governorates(id),
  status public.item_status not null default 'active',
  urgency text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger trg_listings_updated_at before update on public.listings for each row execute function public.set_updated_at();
create trigger trg_requests_updated_at before update on public.purchase_requests for each row execute function public.set_updated_at();

-- =========================================================
-- 5. Community & Social
-- =========================================================

create table public.posts (
  id uuid primary key default gen_random_uuid(),
  author_id uuid not null references public.profiles(id) on delete cascade,
  title text not null,
  content text not null,
  category_id uuid references public.categories(id),
  status public.item_status not null default 'active',
  view_count integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.post_images (
  id uuid primary key default gen_random_uuid(),
  post_id uuid not null references public.posts(id) on delete cascade,
  storage_path text not null,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

create table public.post_comments (
  id uuid primary key default gen_random_uuid(),
  post_id uuid not null references public.posts(id) on delete cascade,
  author_id uuid not null references public.profiles(id) on delete cascade,
  parent_id uuid references public.post_comments(id) on delete cascade,
  content text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger trg_posts_updated_at before update on public.posts for each row execute function public.set_updated_at();
create trigger trg_comments_updated_at before update on public.post_comments for each row execute function public.set_updated_at();

-- =========================================================
-- 6. Messaging & Notifications
-- =========================================================

create table public.conversations (
  id uuid primary key default gen_random_uuid(),
  source_type public.conversation_source_type not null default 'direct',
  source_id uuid,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.conversation_participants (
  id uuid primary key default gen_random_uuid(),
  conversation_id uuid not null references public.conversations(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  last_read_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  unique (conversation_id, user_id)
);

create table public.messages (
  id uuid primary key default gen_random_uuid(),
  conversation_id uuid not null references public.conversations(id) on delete cascade,
  sender_id uuid not null references public.profiles(id) on delete cascade,
  content text not null,
  is_read boolean not null default false,
  created_at timestamptz not null default now()
);

create table public.notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  type public.notification_type not null,
  title text not null,
  body text,
  link_to text,
  metadata jsonb,
  is_read boolean not null default false,
  created_at timestamptz not null default now()
);

create trigger trg_conversations_updated_at before update on public.conversations for each row execute function public.set_updated_at();

-- =========================================================
-- 7. Saved Items & Reports
-- =========================================================

create table public.saved_items (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  item_type text not null,
  item_id uuid not null,
  created_at timestamptz not null default now(),
  unique (user_id, item_type, item_id)
);

create table public.reports (
  id uuid primary key default gen_random_uuid(),
  reporter_id uuid not null references public.profiles(id) on delete cascade,
  target_id uuid not null,
  target_type text not null,
  reason text not null,
  status public.report_status not null default 'pending',
  admin_notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger trg_reports_updated_at before update on public.reports for each row execute function public.set_updated_at();

-- =========================================================
-- 8. SEEDS
-- =========================================================

-- Governorates
insert into public.governorates (code, name_en, name_ar, sort_order)
values
  ('TN-11', 'Tunis', 'تونس', 1), ('TN-12', 'Ariana', 'أريانة', 2), ('TN-13', 'Ben Arous', 'بن عروس', 3),
  ('TN-14', 'Manouba', 'منوبة', 4), ('TN-21', 'Nabeul', 'نابل', 5), ('TN-22', 'Zaghouan', 'زغوان', 6),
  ('TN-23', 'Bizerte', 'بنزرت', 7), ('TN-31', 'Beja', 'باجة', 8), ('TN-32', 'Jendouba', 'جندوبة', 9),
  ('TN-33', 'Kef', 'الكاف', 10), ('TN-34', 'Siliana', 'سليانة', 11), ('TN-41', 'Kairouan', 'القيروان', 12),
  ('TN-42', 'Kasserine', 'القصرين', 13), ('TN-43', 'Sidi Bouzid', 'سيدي بوزيد', 14), ('TN-51', 'Sousse', 'سوسة', 15),
  ('TN-52', 'Monastir', 'المنستير', 16), ('TN-53', 'Mahdia', 'المهدية', 17), ('TN-61', 'Sfax', 'صفاقس', 18),
  ('TN-71', 'Gafsa', 'قفصة', 19), ('TN-72', 'Tozeur', 'توزر', 20), ('TN-73', 'Kebili', 'قبلي', 21),
  ('TN-81', 'Gabes', 'قابس', 22), ('TN-82', 'Medenine', 'مدنين', 23), ('TN-83', 'Tataouine', 'تطاوين', 24)
on conflict do nothing;

-- Categories
insert into public.categories (slug, name_en, name_ar, icon_name, sort_order)
values
  ('vegetables', 'Vegetables', 'خضروات', 'Leaf', 10), ('fruits', 'Fruits', 'فواكه', 'Grape', 20),
  ('cereals_grains', 'Cereals & Grains', 'حبوب وقمحيات', 'Wheat', 30), ('legumes', 'Legumes', 'بقوليات', 'Bean', 40),
  ('roots_tubers', 'Roots & Tubers', 'درنيات', 'Carrot', 50), ('herbs_spices', 'Herbs & Spices', 'توابل وأعشاب', 'Sprout', 60),
  ('seeds_seedlings', 'Seeds & Seedlings', 'بذور ومشاتل', 'Seeds', 70), ('industrial_oil_crops', 'Oil Crops', 'زراعات زيتية', 'Droplets', 80),
  ('oils_fats', 'Oils & Fats', 'زيوت نباتية', 'Oil', 90), ('fodder_feed', 'Fodder & Feed', 'أعلاف فلاحية', 'Trees', 100),
  ('fibers_hides', 'Fibers & Hides', 'ألياف وجلود', 'Layers', 110), ('flowers_horticulture', 'Flowers & Horticulture', 'نباتات زينة', 'Flower', 120),
  ('honey_beekeeping', 'Honey & Beekeeping', 'عسل ومنتجات نحل', 'Honey', 130), ('livestock', 'Livestock', 'مواشي وأبقار', 'Beef', 140),
  ('poultry', 'Poultry', 'دواجن', 'Bird', 150), ('dairy_eggs', 'Dairy & Eggs', 'ألبان وبيض', 'Milk', 160),
  ('processed_farm_products', 'Processed Products', 'منتجات تحويلية', 'Utensils', 170), ('other', 'Other Products', 'منتجات أخرى', 'MoreHorizontal', 180)
on conflict do nothing;

-- Units
insert into public.units (slug, name_en, name_ar, symbol, unit_type, sort_order)
values
  ('kg', 'Kilogram', 'كيلوغرام', 'كغ', 'weight', 10), ('ton', 'Ton', 'طن', 'طن', 'weight', 20),
  ('liter', 'Liter', 'لتر', 'ل', 'volume', 30), ('piece', 'Piece', 'قطعة', 'ق', 'count', 40),
  ('box', 'Box', 'صندوق', 'ص', 'packaging', 50), ('tray', 'Tray', 'طبق', 'ط', 'packaging', 60),
  ('bottle', 'Bottle', 'قارورة', 'ق', 'packaging', 70), ('sack', 'Sack', 'خيشة/شيكارة', 'خ', 'packaging', 80),
  ('head', 'Head', 'رأس', 'ر', 'count', 90), ('bunch', 'Bunch', 'ربطة', 'ر', 'packaging', 100),
  ('crate', 'Crate', 'قفص', 'ق', 'packaging', 110), ('bag', 'Bag', 'كيس', 'ك', 'packaging', 120)
on conflict do nothing;

-- Activity Types
insert into public.activity_types (slug, name_en, name_ar, sort_order)
values
  ('crop_production', 'Crop Production', 'إنتاج نباتي', 10), ('fruit_farming', 'Fruit Farming', 'أشجار مثمرة وقوارص', 20),
  ('livestock_breeding', 'Livestock Breeding', 'تربية ماشية', 30), ('poultry_farming', 'Poultry Farming', 'دواجن ومنتجاتها', 40),
  ('beekeeping', 'Beekeeping', 'تربية نحل وإنتاج عسل', 50)
on conflict do nothing;

-- =========================================================
-- 9. BASELINE RLS
-- =========================================================

alter table public.governorates enable row level security;
alter table public.categories enable row level security;
alter table public.units enable row level security;
alter table public.category_units enable row level security;
alter table public.activity_types enable row level security;
alter table public.profiles enable row level security;
alter table public.profile_private_details enable row level security;
alter table public.listings enable row level security;
alter table public.listing_images enable row level security;
alter table public.purchase_requests enable row level security;
alter table public.posts enable row level security;
alter table public.post_images enable row level security;
alter table public.post_comments enable row level security;
alter table public.conversations enable row level security;
alter table public.conversation_participants enable row level security;
alter table public.messages enable row level security;
alter table public.notifications enable row level security;
alter table public.saved_items enable row level security;
alter table public.reports enable row level security;

-- Global Read (Lookups)
create policy "Public Read Governorates" on public.governorates for select using (is_active = true);
create policy "Public Read Categories" on public.categories for select using (is_active = true);
create policy "Public Read Units" on public.units for select using (is_active = true);
create policy "Public Read Category Units" on public.category_units for select using (true);
create policy "Public Read Activity Types" on public.activity_types for select using (is_active = true);

-- Profiles
create policy "Public Read Profiles" on public.profiles for select using (true);
create policy "Owners Update Profiles" on public.profiles for update using (auth.uid() = id);
create policy "Owners Read Private Details" on public.profile_private_details for select using (auth.uid() = user_id);
create policy "Owners Update Private Details" on public.profile_private_details for update using (auth.uid() = user_id);

-- Marketplace
create policy "Public Listings Read" on public.listings for select using (status = 'active' or auth.uid() = user_id);
create policy "Owners Listings Insert" on public.listings for insert with check (auth.uid() = user_id);
create policy "Owners Listings Update" on public.listings for update using (auth.uid() = user_id);
create policy "Owners Listings Delete" on public.listings for delete using (auth.uid() = user_id);

create policy "Public Requests Read" on public.purchase_requests for select using (status = 'active' or auth.uid() = user_id);
create policy "Owners Requests All" on public.purchase_requests for all using (auth.uid() = user_id);

-- Marketplace Images
create policy "Public Images Read" on public.listing_images for select using (exists (select 1 from public.listings where id = listing_id and (status = 'active' or auth.uid() = user_id)));
create policy "Owners Images Manage" on public.listing_images for all using (exists (select 1 from public.listings where id = listing_id and auth.uid() = user_id));

-- Community
create policy "Public Posts Read" on public.posts for select using (status = 'active' or auth.uid() = author_id);
create policy "Owners Posts All" on public.posts for all using (auth.uid() = author_id);
create policy "Public Comments Read" on public.post_comments for select using (true);
create policy "Owners Comments All" on public.post_comments for all using (auth.uid() = author_id);

-- Interactions
create policy "Participants Read Conversations" on public.conversations for select using (exists (select 1 from public.conversation_participants where conversation_id = id and user_id = auth.uid()));
create policy "Participants Read Own Records" on public.conversation_participants for select using (user_id = auth.uid());
create policy "Participants Read Messages" on public.messages for select using (exists (select 1 from public.conversation_participants where conversation_id = messages.conversation_id and user_id = auth.uid()));
create policy "Messages Insert" on public.messages for insert with check (sender_id = auth.uid() and exists (select 1 from public.conversation_participants where conversation_id = messages.conversation_id and user_id = auth.uid()));

create policy "Owners Notifications" on public.notifications for select using (user_id = auth.uid());
create policy "Owners Saved Items" on public.saved_items for all using (user_id = auth.uid());
create policy "Owners Reports" on public.reports for select using (reporter_id = auth.uid());
create policy "Auth Reports Insert" on public.reports for insert with check (reporter_id = auth.uid());

commit;
