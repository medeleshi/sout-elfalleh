-- ============================================================
-- Sout El Falah — Unified Schema (Single Migration)
-- Date: 2026-04-10
-- Replaces: 20260404115124, 20260404120000, 20260404130000,
--           20260404140000, 20260410000000
-- ============================================================
-- NOTE: alter type ... add value must run OUTSIDE any transaction.
-- For this reason the enum declarations are at the top as CREATE,
-- not ALTER — a clean slate approach avoids the restriction entirely.
-- ============================================================

-- ============================================================
-- 0. CLEAN SLATE
-- ============================================================

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

-- Storage policies cleanup
drop policy if exists "Public Read Listings Storage" on storage.objects;
drop policy if exists "Auth Users Upload Listings Storage" on storage.objects;
drop policy if exists "Auth Users Update Listings Storage" on storage.objects;
drop policy if exists "Auth Users Delete Listings Storage" on storage.objects;
drop policy if exists "Public Read Avatars Storage" on storage.objects;
drop policy if exists "Auth Users Upload Avatars Storage" on storage.objects;
drop policy if exists "Auth Users Update Avatars Storage" on storage.objects;
drop policy if exists "Auth Users Delete Avatars Storage" on storage.objects;

-- ============================================================
-- 1. ENUMS
-- ============================================================

create type public.user_role as enum ('farmer', 'buyer', 'merchant', 'admin');

-- includes 'fulfilled' for completed purchase_requests
create type public.item_status as enum (
  'draft', 'active', 'inactive', 'sold', 'archived', 'hidden', 'fulfilled'
);

create type public.conversation_source_type as enum ('listing', 'purchase_request', 'direct');
create type public.report_status as enum ('pending', 'investigating', 'resolved', 'dismissed');

create type public.notification_type as enum (
  'new_message',
  'price_alert',
  'item_sold',
  'new_request',
  'post_comment',
  'system_announcement'
);

create type public.unit_type as enum ('weight', 'volume', 'count', 'packaging');

-- ============================================================
-- 2. UTILITY FUNCTION
-- ============================================================

create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- ============================================================
-- 3. LOOKUP TABLES
-- ============================================================

create table public.governorates (
  id         uuid        primary key default gen_random_uuid(),
  code       text        not null unique,
  name_en    text        not null,
  name_ar    text        not null,
  is_active  boolean     not null default true,
  sort_order integer     not null default 0,
  created_at timestamptz not null default now()
);

create table public.categories (
  id             uuid        primary key default gen_random_uuid(),
  slug           text        not null unique,
  name_en        text        not null,
  name_ar        text        not null,
  description_en text,
  description_ar text,
  icon_name      text,
  is_active      boolean     not null default true,
  sort_order     integer     not null default 0,
  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now()
);

create table public.units (
  id         uuid            primary key default gen_random_uuid(),
  slug       text            not null unique,
  name_en    text            not null,
  name_ar    text            not null,
  symbol     text,
  unit_type  public.unit_type not null default 'count',
  is_active  boolean         not null default true,
  sort_order integer         not null default 0,
  created_at timestamptz     not null default now()
);

create table public.category_units (
  id          uuid    primary key default gen_random_uuid(),
  category_id uuid    not null references public.categories(id) on delete cascade,
  unit_id     uuid    not null references public.units(id) on delete cascade,
  is_default  boolean not null default false,
  unique (category_id, unit_id)
);

create table public.activity_types (
  id         uuid        primary key default gen_random_uuid(),
  slug       text        not null unique,
  name_en    text        not null,
  name_ar    text        not null,
  is_active  boolean     not null default true,
  sort_order integer     not null default 0
);

-- ============================================================
-- 4. PROFILES & IDENTITY
-- ============================================================

create table public.profiles (
  id                      uuid             primary key references auth.users(id) on delete cascade,
  full_name               text,
  role                    public.user_role not null default 'farmer',
  avatar_url              text,
  bio                     text,
  governorate_id          uuid             references public.governorates(id),
  region                  text,
  activity_type_id        uuid             references public.activity_types(id),
  is_onboarding_completed boolean          not null default false,
  is_verified             boolean          not null default false,
  created_at              timestamptz      not null default now(),
  updated_at              timestamptz      not null default now()
);

create table public.profile_private_details (
  user_id            uuid        primary key references public.profiles(id) on delete cascade,
  phone              text,
  email              text,
  notification_email boolean     not null default true,
  notification_push  boolean     not null default true,
  created_at         timestamptz not null default now(),
  updated_at         timestamptz not null default now()
);

create trigger trg_profiles_updated_at
  before update on public.profiles
  for each row execute function public.set_updated_at();

create trigger trg_private_details_updated_at
  before update on public.profile_private_details
  for each row execute function public.set_updated_at();

-- Auth trigger: create profile row on signup
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, full_name, avatar_url)
  values (
    new.id,
    new.raw_user_meta_data->>'full_name',
    new.raw_user_meta_data->>'avatar_url'
  );

  insert into public.profile_private_details (user_id, email)
  values (new.id, new.email);

  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ============================================================
-- 5. MARKETPLACE
-- ============================================================

create table public.listings (
  id             uuid               primary key default gen_random_uuid(),
  user_id        uuid               not null references public.profiles(id) on delete cascade,
  title          text               not null,
  description    text,
  category_id    uuid               not null references public.categories(id),
  quantity       numeric            not null check (quantity >= 0),
  unit_id        uuid               not null references public.units(id),
  price          numeric            check (price >= 0),
  governorate_id uuid               not null references public.governorates(id),
  status         public.item_status not null default 'active',
  is_verified    boolean            not null default false,
  view_count     integer            not null default 0,
  created_at     timestamptz        not null default now(),
  updated_at     timestamptz        not null default now()
);

create table public.listing_images (
  id           uuid        primary key default gen_random_uuid(),
  listing_id   uuid        not null references public.listings(id) on delete cascade,
  storage_path text        not null,
  is_primary   boolean     not null default false,
  sort_order   integer     not null default 0,
  created_at   timestamptz not null default now()
);

create table public.purchase_requests (
  id             uuid               primary key default gen_random_uuid(),
  user_id        uuid               not null references public.profiles(id) on delete cascade,
  title          text               not null,
  description    text,
  category_id    uuid               not null references public.categories(id),
  quantity       numeric            not null check (quantity >= 0),
  unit_id        uuid               not null references public.units(id),
  budget         numeric            check (budget >= 0),
  governorate_id uuid               not null references public.governorates(id),
  status         public.item_status not null default 'active',
  urgency        text,
  created_at     timestamptz        not null default now(),
  updated_at     timestamptz        not null default now()
);

create trigger trg_listings_updated_at
  before update on public.listings
  for each row execute function public.set_updated_at();

create trigger trg_requests_updated_at
  before update on public.purchase_requests
  for each row execute function public.set_updated_at();

-- ============================================================
-- 6. COMMUNITY & SOCIAL
-- ============================================================

create table public.posts (
  id         uuid               primary key default gen_random_uuid(),
  author_id  uuid               not null references public.profiles(id) on delete cascade,
  title      text               not null,
  content    text               not null,
  -- 'question' | 'discussion' — used by posts/actions.ts
  type       text               not null default 'discussion'
               constraint posts_type_check check (type in ('question', 'discussion')),
  category_id uuid              references public.categories(id),
  status     public.item_status not null default 'active',
  view_count integer            not null default 0,
  created_at timestamptz        not null default now(),
  updated_at timestamptz        not null default now()
);

create table public.post_images (
  id           uuid        primary key default gen_random_uuid(),
  post_id      uuid        not null references public.posts(id) on delete cascade,
  storage_path text        not null,
  sort_order   integer     not null default 0,
  created_at   timestamptz not null default now()
);

create table public.post_comments (
  id         uuid        primary key default gen_random_uuid(),
  post_id    uuid        not null references public.posts(id) on delete cascade,
  author_id  uuid        not null references public.profiles(id) on delete cascade,
  parent_id  uuid        references public.post_comments(id) on delete cascade,
  content    text        not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger trg_posts_updated_at
  before update on public.posts
  for each row execute function public.set_updated_at();

create trigger trg_comments_updated_at
  before update on public.post_comments
  for each row execute function public.set_updated_at();

-- ============================================================
-- 7. MESSAGING & NOTIFICATIONS
-- ============================================================

create table public.conversations (
  id          uuid                          primary key default gen_random_uuid(),
  source_type public.conversation_source_type not null default 'direct',
  source_id   uuid,
  created_at  timestamptz                   not null default now(),
  updated_at  timestamptz                   not null default now()
);

create table public.conversation_participants (
  id              uuid        primary key default gen_random_uuid(),
  conversation_id uuid        not null references public.conversations(id) on delete cascade,
  user_id         uuid        not null references public.profiles(id) on delete cascade,
  last_read_at    timestamptz not null default now(),
  created_at      timestamptz not null default now(),
  unique (conversation_id, user_id)
);

create table public.messages (
  id              uuid        primary key default gen_random_uuid(),
  conversation_id uuid        not null references public.conversations(id) on delete cascade,
  sender_id       uuid        not null references public.profiles(id) on delete cascade,
  content         text        not null,
  is_read         boolean     not null default false,
  created_at      timestamptz not null default now()
);

create table public.notifications (
  id         uuid                      primary key default gen_random_uuid(),
  user_id    uuid                      not null references public.profiles(id) on delete cascade,
  type       public.notification_type  not null,
  title      text                      not null,
  body       text,
  link_to    text,
  metadata   jsonb,
  is_read    boolean                   not null default false,
  created_at timestamptz               not null default now()
);

create trigger trg_conversations_updated_at
  before update on public.conversations
  for each row execute function public.set_updated_at();

-- ============================================================
-- 8. SAVED ITEMS & REPORTS
-- ============================================================

create table public.saved_items (
  id         uuid        primary key default gen_random_uuid(),
  user_id    uuid        not null references public.profiles(id) on delete cascade,
  item_type  text        not null,
  item_id    uuid        not null,
  created_at timestamptz not null default now(),
  unique (user_id, item_type, item_id)
);

create table public.reports (
  id          uuid                  primary key default gen_random_uuid(),
  reporter_id uuid                  not null references public.profiles(id) on delete cascade,
  target_id   uuid                  not null,
  target_type text                  not null,
  reason      text                  not null,
  status      public.report_status  not null default 'pending',
  admin_notes text,
  created_at  timestamptz           not null default now(),
  updated_at  timestamptz           not null default now()
);

create trigger trg_reports_updated_at
  before update on public.reports
  for each row execute function public.set_updated_at();

-- ============================================================
-- 9. SEED DATA
-- ============================================================

-- Governorates (Tunisia)
insert into public.governorates (code, name_en, name_ar, sort_order) values
  ('TN-11', 'Tunis',      'تونس',      1),  ('TN-12', 'Ariana',     'أريانة',    2),
  ('TN-13', 'Ben Arous',  'بن عروس',   3),  ('TN-14', 'Manouba',    'منوبة',     4),
  ('TN-21', 'Nabeul',     'نابل',      5),  ('TN-22', 'Zaghouan',   'زغوان',     6),
  ('TN-23', 'Bizerte',    'بنزرت',     7),  ('TN-31', 'Beja',       'باجة',      8),
  ('TN-32', 'Jendouba',   'جندوبة',    9),  ('TN-33', 'Kef',        'الكاف',    10),
  ('TN-34', 'Siliana',    'سليانة',   11),  ('TN-41', 'Kairouan',   'القيروان', 12),
  ('TN-42', 'Kasserine',  'القصرين',  13),  ('TN-43', 'Sidi Bouzid','سيدي بوزيد',14),
  ('TN-51', 'Sousse',     'سوسة',     15),  ('TN-52', 'Monastir',   'المنستير', 16),
  ('TN-53', 'Mahdia',     'المهدية',  17),  ('TN-61', 'Sfax',       'صفاقس',    18),
  ('TN-71', 'Gafsa',      'قفصة',     19),  ('TN-72', 'Tozeur',     'توزر',     20),
  ('TN-73', 'Kebili',     'قبلي',     21),  ('TN-81', 'Gabes',      'قابس',     22),
  ('TN-82', 'Medenine',   'مدنين',    23),  ('TN-83', 'Tataouine',  'تطاوين',   24)
on conflict do nothing;

-- Categories
insert into public.categories (slug, name_en, name_ar, icon_name, sort_order) values
  ('vegetables',           'Vegetables',         'خضروات',           'Leaf',          10),
  ('fruits',               'Fruits',             'فواكه',            'Grape',         20),
  ('cereals_grains',       'Cereals & Grains',   'حبوب وقمحيات',     'Wheat',         30),
  ('legumes',              'Legumes',            'بقوليات',          'Bean',          40),
  ('roots_tubers',         'Roots & Tubers',     'درنيات',           'Carrot',        50),
  ('herbs_spices',         'Herbs & Spices',     'توابل وأعشاب',     'Sprout',        60),
  ('seeds_seedlings',      'Seeds & Seedlings',  'بذور ومشاتل',      'Seeds',         70),
  ('industrial_oil_crops', 'Oil Crops',          'زراعات زيتية',     'Droplets',      80),
  ('oils_fats',            'Oils & Fats',        'زيوت نباتية',      'Oil',           90),
  ('fodder_feed',          'Fodder & Feed',      'أعلاف فلاحية',     'Trees',        100),
  ('fibers_hides',         'Fibers & Hides',     'ألياف وجلود',      'Layers',       110),
  ('flowers_horticulture', 'Flowers & Horticulture','نباتات زينة',   'Flower',       120),
  ('honey_beekeeping',     'Honey & Beekeeping', 'عسل ومنتجات نحل',  'Honey',        130),
  ('livestock',            'Livestock',          'مواشي وأبقار',     'Beef',         140),
  ('poultry',              'Poultry',            'دواجن',            'Bird',         150),
  ('dairy_eggs',           'Dairy & Eggs',       'ألبان وبيض',       'Milk',         160),
  ('processed_farm_products','Processed Products','منتجات تحويلية',  'Utensils',     170),
  ('other',                'Other Products',     'منتجات أخرى',      'MoreHorizontal',180)
on conflict do nothing;

-- Units
insert into public.units (slug, name_en, name_ar, symbol, unit_type, sort_order) values
  ('kg',     'Kilogram', 'كيلوغرام',      'كغ', 'weight',    10),
  ('ton',    'Ton',      'طن',            'طن', 'weight',    20),
  ('liter',  'Liter',    'لتر',           'ل',  'volume',    30),
  ('piece',  'Piece',    'قطعة',          'ق',  'count',     40),
  ('box',    'Box',      'صندوق',         'ص',  'packaging', 50),
  ('tray',   'Tray',     'طبق',           'ط',  'packaging', 60),
  ('bottle', 'Bottle',   'قارورة',        'ق',  'packaging', 70),
  ('sack',   'Sack',     'خيشة/شيكارة',  'خ',  'packaging', 80),
  ('head',   'Head',     'رأس',           'ر',  'count',     90),
  ('bunch',  'Bunch',    'ربطة',          'ر',  'packaging',100),
  ('crate',  'Crate',    'قفص',           'ق',  'packaging',110),
  ('bag',    'Bag',      'كيس',           'ك',  'packaging',120)
on conflict do nothing;

-- Activity Types
insert into public.activity_types (slug, name_en, name_ar, sort_order) values
  ('crop_production',    'Crop Production',   'إنتاج نباتي',              10),
  ('fruit_farming',      'Fruit Farming',     'أشجار مثمرة وقوارص',       20),
  ('livestock_breeding', 'Livestock Breeding','تربية ماشية',              30),
  ('poultry_farming',    'Poultry Farming',   'دواجن ومنتجاتها',          40),
  ('beekeeping',         'Beekeeping',        'تربية نحل وإنتاج عسل',     50)
on conflict do nothing;

-- Category ↔ Unit mappings
do $$
declare
  v_veg      uuid := (select id from public.categories where slug = 'vegetables');
  v_fruit    uuid := (select id from public.categories where slug = 'fruits');
  v_grain    uuid := (select id from public.categories where slug = 'cereals_grains');
  v_legume   uuid := (select id from public.categories where slug = 'legumes');
  v_oil      uuid := (select id from public.categories where slug = 'oils_fats');
  v_livestock uuid := (select id from public.categories where slug = 'livestock');
  v_poultry  uuid := (select id from public.categories where slug = 'poultry');
  v_dairy    uuid := (select id from public.categories where slug = 'dairy_eggs');
  v_honey    uuid := (select id from public.categories where slug = 'honey_beekeeping');

  v_kg     uuid := (select id from public.units where slug = 'kg');
  v_ton    uuid := (select id from public.units where slug = 'ton');
  v_liter  uuid := (select id from public.units where slug = 'liter');
  v_piece  uuid := (select id from public.units where slug = 'piece');
  v_box    uuid := (select id from public.units where slug = 'box');
  v_tray   uuid := (select id from public.units where slug = 'tray');
  v_bottle uuid := (select id from public.units where slug = 'bottle');
  v_sack   uuid := (select id from public.units where slug = 'sack');
  v_head   uuid := (select id from public.units where slug = 'head');
  v_crate  uuid := (select id from public.units where slug = 'crate');
  v_bag    uuid := (select id from public.units where slug = 'bag');
begin
  insert into public.category_units (category_id, unit_id, is_default) values
    -- Vegetables
    (v_veg,      v_kg,     true),  (v_veg,  v_box,    false),
    (v_veg,      v_ton,    false), (v_veg,  v_crate,  false), (v_veg, v_bag, false),
    -- Fruits
    (v_fruit,    v_kg,     true),  (v_fruit, v_box,   false),
    (v_fruit,    v_ton,    false), (v_fruit, v_crate, false),
    -- Grains
    (v_grain,    v_ton,    true),  (v_grain, v_kg,    false), (v_grain, v_sack, false),
    -- Legumes
    (v_legume,   v_kg,     true),  (v_legume, v_ton,  false), (v_legume, v_sack, false),
    -- Oils & Fats
    (v_oil,      v_liter,  true),  (v_oil,  v_bottle, false),
    -- Livestock
    (v_livestock,v_head,   true),  (v_livestock, v_piece, false),
    -- Poultry
    (v_poultry,  v_piece,  true),  (v_poultry,   v_head,  false),
    -- Dairy & Eggs
    (v_dairy,    v_liter,  true),  (v_dairy, v_piece, false),
    (v_dairy,    v_tray,   false), (v_dairy, v_box,   false),
    -- Honey
    (v_honey,    v_kg,     true),  (v_honey, v_piece, false), (v_honey, v_box, false);
end $$;

-- ============================================================
-- 10. ROW LEVEL SECURITY
-- ============================================================

alter table public.governorates           enable row level security;
alter table public.categories             enable row level security;
alter table public.units                  enable row level security;
alter table public.category_units         enable row level security;
alter table public.activity_types         enable row level security;
alter table public.profiles               enable row level security;
alter table public.profile_private_details enable row level security;
alter table public.listings               enable row level security;
alter table public.listing_images         enable row level security;
alter table public.purchase_requests      enable row level security;
alter table public.posts                  enable row level security;
alter table public.post_images            enable row level security;
alter table public.post_comments          enable row level security;
alter table public.conversations          enable row level security;
alter table public.conversation_participants enable row level security;
alter table public.messages               enable row level security;
alter table public.notifications          enable row level security;
alter table public.saved_items            enable row level security;
alter table public.reports                enable row level security;

-- ── Lookups (public read) ────────────────────────────────────────────────────

create policy "Public Read Governorates"
  on public.governorates for select using (is_active = true);

create policy "Public Read Categories"
  on public.categories for select using (is_active = true);

create policy "Public Read Units"
  on public.units for select using (is_active = true);

create policy "Public Read Category Units"
  on public.category_units for select using (true);

create policy "Public Read Activity Types"
  on public.activity_types for select using (is_active = true);

-- ── Profiles ─────────────────────────────────────────────────────────────────

create policy "Public Read Profiles"
  on public.profiles for select using (true);

create policy "Owners Insert Profiles"
  on public.profiles for insert with check (auth.uid() = id);

create policy "Owners Update Profiles"
  on public.profiles for update using (auth.uid() = id);

create policy "Owners Read Private Details"
  on public.profile_private_details for select using (auth.uid() = user_id);

create policy "Owners Insert Private Details"
  on public.profile_private_details for insert with check (auth.uid() = user_id);

create policy "Owners Update Private Details"
  on public.profile_private_details for update using (auth.uid() = user_id);

-- ── Marketplace ──────────────────────────────────────────────────────────────

create policy "Public Listings Read"
  on public.listings for select
  using (status = 'active' or auth.uid() = user_id);

create policy "Owners Listings Insert"
  on public.listings for insert with check (auth.uid() = user_id);

create policy "Owners Listings Update"
  on public.listings for update using (auth.uid() = user_id);

create policy "Owners Listings Delete"
  on public.listings for delete using (auth.uid() = user_id);

create policy "Public Images Read"
  on public.listing_images for select
  using (
    exists (
      select 1 from public.listings
      where id = listing_id and (status = 'active' or auth.uid() = user_id)
    )
  );

create policy "Owners Images Manage"
  on public.listing_images for all
  using (
    exists (
      select 1 from public.listings
      where id = listing_id and auth.uid() = user_id
    )
  )
  with check (
    exists (
      select 1 from public.listings
      where id = listing_id and auth.uid() = user_id
    )
  );

create policy "Public Requests Read"
  on public.purchase_requests for select
  using (status = 'active' or auth.uid() = user_id);

create policy "Owners Requests All"
  on public.purchase_requests for all using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- ── Community ────────────────────────────────────────────────────────────────

create policy "Public Posts Read"
  on public.posts for select
  using (status = 'active' or auth.uid() = author_id);

create policy "Owners Posts All"
  on public.posts for all using (auth.uid() = author_id)
  with check (auth.uid() = author_id);

create policy "Public Post Images Read"
  on public.post_images for select
  using (
    exists (
      select 1 from public.posts
      where id = post_id and (status = 'active' or auth.uid() = author_id)
    )
  );

create policy "Owners Post Images Manage"
  on public.post_images for all
  using (
    exists (
      select 1 from public.posts
      where id = post_id and auth.uid() = author_id
    )
  )
  with check (
    exists (
      select 1 from public.posts
      where id = post_id and auth.uid() = author_id
    )
  );

create policy "Public Comments Read"
  on public.post_comments for select using (true);

create policy "Owners Comments All"
  on public.post_comments for all using (auth.uid() = author_id)
  with check (auth.uid() = author_id);

-- ── Messaging ────────────────────────────────────────────────────────────────

create policy "Participants Read Conversations"
  on public.conversations for select
  using (
    exists (
      select 1 from public.conversation_participants
      where conversation_id = id and user_id = auth.uid()
    )
  );

create policy "Auth Users Create Conversations"
  on public.conversations for insert
  with check (auth.role() = 'authenticated');

create policy "Participants Read Own Records"
  on public.conversation_participants for select
  using (user_id = auth.uid());

create policy "Auth Users Join Conversations"
  on public.conversation_participants for insert
  with check (auth.uid() = user_id);

create policy "Participants Update Own Record"
  on public.conversation_participants for update
  using (auth.uid() = user_id);

create policy "Participants Read Messages"
  on public.messages for select
  using (
    exists (
      select 1 from public.conversation_participants
      where conversation_id = messages.conversation_id and user_id = auth.uid()
    )
  );

create policy "Messages Insert"
  on public.messages for insert
  with check (
    sender_id = auth.uid()
    and exists (
      select 1 from public.conversation_participants
      where conversation_id = messages.conversation_id and user_id = auth.uid()
    )
  );

-- ── Notifications ────────────────────────────────────────────────────────────

create policy "Owners Read Notifications"
  on public.notifications for select using (user_id = auth.uid());

-- service_role is used by server-side triggers and edge functions
create policy "Service Role Insert Notifications"
  on public.notifications for insert
  with check (auth.role() = 'service_role');

create policy "Owners Update Notifications"
  on public.notifications for update using (auth.uid() = user_id);

-- ── Saved Items & Reports ────────────────────────────────────────────────────

create policy "Owners Saved Items"
  on public.saved_items for all using (user_id = auth.uid())
  with check (user_id = auth.uid());

create policy "Owners Read Reports"
  on public.reports for select using (reporter_id = auth.uid());

create policy "Auth Reports Insert"
  on public.reports for insert with check (reporter_id = auth.uid());

-- ============================================================
-- 11. STORAGE BUCKETS & POLICIES
-- ============================================================

insert into storage.buckets (id, name, public)
  values ('listings', 'listings', true)
  on conflict (id) do update set public = true;

insert into storage.buckets (id, name, public)
  values ('avatars', 'avatars', true)
  on conflict (id) do update set public = true;

-- ── Listings bucket ──────────────────────────────────────────────────────────

create policy "Public Read Listings Storage"
  on storage.objects for select
  using (bucket_id = 'listings');

-- Upload scoped to folders the user owns: path = {listing_id}/{filename}
create policy "Auth Users Upload Listings Storage"
  on storage.objects for insert
  with check (
    bucket_id = 'listings'
    and auth.role() = 'authenticated'
    and exists (
      select 1 from public.listings
      where id      = (storage.foldername(name))[1]::uuid
        and user_id = auth.uid()
    )
  );

create policy "Auth Users Update Listings Storage"
  on storage.objects for update
  using (bucket_id = 'listings' and auth.uid() = owner);

create policy "Auth Users Delete Listings Storage"
  on storage.objects for delete
  using (bucket_id = 'listings' and auth.uid() = owner);

-- ── Avatars bucket ───────────────────────────────────────────────────────────

create policy "Public Read Avatars Storage"
  on storage.objects for select
  using (bucket_id = 'avatars');

-- Upload scoped to user's own folder: path = {user_id}/{filename}
create policy "Auth Users Upload Avatars Storage"
  on storage.objects for insert
  with check (
    bucket_id = 'avatars'
    and auth.role() = 'authenticated'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

create policy "Auth Users Update Avatars Storage"
  on storage.objects for update
  using (bucket_id = 'avatars' and auth.uid() = owner);

create policy "Auth Users Delete Avatars Storage"
  on storage.objects for delete
  using (bucket_id = 'avatars' and auth.uid() = owner);
