-- Sout El Falah - Categories Foundation
-- Farmer-produced categories based on broad agricultural product groupings

begin;

create table if not exists public.categories (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name_en text not null,
  name_ar text not null,
  icon text,
  description text,
  is_active boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_categories_is_active
  on public.categories(is_active);

create index if not exists idx_categories_sort_order
  on public.categories(sort_order);

drop trigger if exists trg_categories_updated_at on public.categories;
create trigger trg_categories_updated_at
  before update on public.categories
  for each row
  execute function public.set_updated_at();

insert into public.categories (
  slug,
  name_en,
  name_ar,
  icon,
  description,
  sort_order
)
values
  ('vegetables', 'Vegetables', 'خضروات', 'leaf', 'Fresh vegetables produced by farmers', 10),
  ('fruits', 'Fruits', 'فواكه', 'apple', 'Fresh fruits produced by farmers', 20),
  ('cereals_grains', 'Cereals & Grains', 'حبوب وقمحيات', 'wheat', 'Cereals and grain crops such as wheat, barley, and maize', 30),
  ('legumes_pulses', 'Legumes & Pulses', 'بقوليات', 'bean', 'Beans, peas, lentils, chickpeas, and similar pulse crops', 40),
  ('roots_tubers', 'Roots & Tubers', 'جذور ودرنيات', 'carrot', 'Root and tuber crops such as potatoes and similar produce', 50),
  ('herbs_aromatics', 'Herbs & Aromatic Plants', 'أعشاب ونباتات عطرية', 'flower', 'Medicinal, culinary, and aromatic plants', 60),
  ('seeds_seedlings', 'Seeds & Seedlings', 'بذور وشتلات', 'sprout', 'Seeds, seedlings, and nursery products', 70),
  ('oil_crops', 'Oil Crops', 'محاصيل زيتية', 'sun', 'Oil-bearing crops such as olives and other oil crops', 80),
  ('oils', 'Oils', 'زيوت', 'droplets', 'Natural oils produced from farm crops', 90),
  ('livestock', 'Livestock', 'مواشي', 'beef', 'Farm animals such as sheep, goats, cattle, and similar livestock', 100),
  ('poultry', 'Poultry', 'دواجن', 'bird', 'Farm poultry such as chickens, turkeys, ducks, and similar birds', 110),
  ('eggs', 'Eggs', 'بيض', 'egg', 'Egg products from poultry farming', 120),
  ('dairy', 'Dairy Products', 'ألبان ومشتقات', 'milk', 'Milk, cheese, butter, and other dairy products', 130),
  ('honey_beekeeping', 'Honey & Beekeeping', 'عسل ومنتجات النحل', 'hexagon', 'Honey, wax, and beekeeping products', 140),
  ('fodder_feed', 'Fodder & Feed', 'أعلاف وتبن', 'warehouse', 'Fodder, hay, silage, and farm-produced feed materials', 150),
  ('fibers', 'Fibers', 'ألياف ومحاصيل ليفية', 'scissors', 'Fiber crops such as cotton and similar agricultural fibers', 160),
  ('hides_skins_wool', 'Hides, Skins & Wool', 'جلود وصوف ومشتقات حيوانية', 'shield', 'Animal-derived raw products such as wool and hides', 170),
  ('processed_farm_products', 'Processed Farm Products', 'منتجات فلاحية محولة', 'package', 'Farmer-made processed products such as jams, clarified butter, dried produce, and similar items', 180)
on conflict (slug) do update set
  name_en = excluded.name_en,
  name_ar = excluded.name_ar,
  icon = excluded.icon,
  description = excluded.description,
  sort_order = excluded.sort_order,
  is_active = true;

alter table public.categories enable row level security;

drop policy if exists "Categories are viewable by everyone" on public.categories;
create policy "Categories are viewable by everyone"
  on public.categories
  for select
  using (is_active = true);

commit;