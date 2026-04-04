-- Sout El Falah - Units Foundation
-- Adds: units table + category_units mapping + agricultural seed data

begin;

-- =========================================================
-- Units Table
-- =========================================================

create type public.unit_type as enum ('weight', 'volume', 'count', 'packaging');

create table if not exists public.units (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name_en text not null,
  name_ar text not null,
  symbol text,
  unit_type public.unit_type not null default 'count',
  is_active boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_units_is_active on public.units(is_active);
create index if not exists idx_units_sort_order on public.units(sort_order);

drop trigger if exists trg_units_updated_at on public.units;
create trigger trg_units_updated_at
  before update on public.units
  for each row
  execute function public.set_updated_at();

-- =========================================================
-- Category Units Mapping
-- =========================================================

create table if not exists public.category_units (
  id uuid primary key default gen_random_uuid(),
  category_id uuid not null references public.categories(id) on delete cascade,
  unit_id uuid not null references public.units(id) on delete cascade,
  is_default boolean not null default false,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  unique (category_id, unit_id)
);

create index if not exists idx_category_units_category_id on public.category_units(category_id);

-- Ensure only one default unit per category
create unique index if not exists uq_category_units_single_default
  on public.category_units(category_id)
  where is_default = true;

-- =========================================================
-- Seed Data: Units
-- =========================================================

insert into public.units (slug, name_en, name_ar, symbol, unit_type, sort_order)
values
  ('kg', 'Kilogram', 'كيلوغرام', 'كغ', 'weight', 10),
  ('ton', 'Ton', 'طن', 'طن', 'weight', 20),
  ('liter', 'Liter', 'لتر', 'ل', 'volume', 30),
  ('piece', 'Piece', 'قطعة', 'ق', 'count', 40),
  ('box', 'Box', 'صندوق', 'ص', 'packaging', 50),
  ('tray', 'Tray', 'طبق', 'ط', 'packaging', 60),
  ('bottle', 'Bottle', 'قارورة', 'ق', 'packaging', 70),
  ('sack', 'Sack', 'خيشة/شيكارة', 'خ', 'packaging', 80),
  ('head', 'Head', 'رأس', 'ر', 'count', 90),
  ('bunch', 'Bunch', 'ربطة', 'ر', 'packaging', 100),
  ('crate', 'Crate', 'قفص', 'ق', 'packaging', 110),
  ('bag', 'Bag', 'كيس', 'ك', 'packaging', 120),
  ('ml', 'Milliliter', 'ميلي لتر', 'مل', 'volume', 130),
  ('m3', 'Cubic Meter', 'متر مكعب', 'م³', 'volume', 140)
on conflict (slug) do update set
  name_en = excluded.name_en,
  name_ar = excluded.name_ar,
  symbol = excluded.symbol,
  unit_type = excluded.unit_type,
  sort_order = excluded.sort_order;

-- =========================================================
-- Mapping: Category to Units
-- =========================================================

do $$
declare
  cat_id uuid;
  u_kg uuid;
  u_ton uuid;
  u_liter uuid;
  u_piece uuid;
  u_box uuid;
  u_crate uuid;
  u_bag uuid;
  u_head uuid;
  u_sack uuid;
  u_bottle uuid;
  u_bunch uuid;
begin
  -- Get unit IDs
  select id into u_kg from public.units where slug = 'kg';
  select id into u_ton from public.units where slug = 'ton';
  select id into u_liter from public.units where slug = 'liter';
  select id into u_piece from public.units where slug = 'piece';
  select id into u_box from public.units where slug = 'box';
  select id into u_crate from public.units where slug = 'crate';
  select id into u_bag from public.units where slug = 'bag';
  select id into u_head from public.units where slug = 'head';
  select id into u_sack from public.units where slug = 'sack';
  select id into u_bottle from public.units where slug = 'bottle';
  select id into u_bunch from public.units where slug = 'bunch';

  -- Vegetables (خضروات)
  select id into cat_id from public.categories where slug = 'vegetables';
  if cat_id is not null then
    insert into public.category_units (category_id, unit_id, is_default, sort_order) 
    values (cat_id, u_kg, true, 1), (cat_id, u_ton, false, 2), (cat_id, u_crate, false, 3), (cat_id, u_piece, false, 4) 
    on conflict do nothing;
  end if;

  -- Fruits (فواكه)
  select id into cat_id from public.categories where slug = 'fruits';
  if cat_id is not null then
    insert into public.category_units (category_id, unit_id, is_default, sort_order) 
    values (cat_id, u_kg, true, 1), (cat_id, u_ton, false, 2), (cat_id, u_box, false, 3), (cat_id, u_crate, false, 4) 
    on conflict do nothing;
  end if;

  -- Cereals & Grains (حبوب وقمحيات)
  select id into cat_id from public.categories where slug = 'cereals_grains';
  if cat_id is not null then
    insert into public.category_units (category_id, unit_id, is_default, sort_order) 
    values (cat_id, u_kg, true, 1), (cat_id, u_ton, false, 2), (cat_id, u_sack, false, 3) 
    on conflict do nothing;
  end if;

  -- Livestock (مواشي)
  select id into cat_id from public.categories where slug = 'livestock';
  if cat_id is not null then
    insert into public.category_units (category_id, unit_id, is_default, sort_order) 
    values (cat_id, u_head, true, 1), (cat_id, u_kg, false, 2) 
    on conflict do nothing;
  end if;

  -- Dairy & Eggs (ألبان ومشتقات)
  select id into cat_id from public.categories where slug = 'dairy_eggs';
  if cat_id is not null then
    insert into public.category_units (category_id, unit_id, is_default, sort_order) 
    values (cat_id, u_liter, true, 1), (cat_id, u_kg, false, 2), (cat_id, u_bottle, false, 3) 
    on conflict do nothing;
  end if;

  -- Oils (زيوت)
  select id into cat_id from public.categories where slug = 'oils_fats';
  if cat_id is not null then
    insert into public.category_units (category_id, unit_id, is_default, sort_order) 
    values (cat_id, u_liter, true, 1), (cat_id, u_bottle, false, 2) 
    on conflict do nothing;
  end if;

  -- Honey (عسل ومنتجات النحل)
  select id into cat_id from public.categories where slug = 'honey_beekeeping';
  if cat_id is not null then
    insert into public.category_units (category_id, unit_id, is_default, sort_order) 
    values (cat_id, u_kg, true, 1), (cat_id, u_bottle, false, 2) 
    on conflict do nothing;
  end if;

end $$;

-- =========================================================
-- Security (RLS)
-- =========================================================

alter table public.units enable row level security;
alter table public.category_units enable row level security;

drop policy if exists "Units are viewable by everyone" on public.units;
create policy "Units are viewable by everyone" 
  on public.units for select using (is_active = true);

drop policy if exists "Category units are viewable by everyone" on public.category_units;
create policy "Category units are viewable by everyone" 
  on public.category_units for select using (true);

commit;
