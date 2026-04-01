-- Sout El Falah - Seed Data
-- Seeds lookup tables:
-- 1) governorates
-- 2) activity_types

begin;

-- =========================================================
-- Governorates (Tunisia)
-- =========================================================

insert into public.governorates (code, name_en, name_ar, sort_order)
values
  ('TN-11', 'Tunis', 'تونس', 1),
  ('TN-12', 'Ariana', 'أريانة', 2),
  ('TN-13', 'Ben Arous', 'بن عروس', 3),
  ('TN-14', 'Manouba', 'منوبة', 4),
  ('TN-21', 'Nabeul', 'نابل', 5),
  ('TN-22', 'Zaghouan', 'زغوان', 6),
  ('TN-23', 'Bizerte', 'بنزرت', 7),
  ('TN-31', 'Béja', 'باجة', 8),
  ('TN-32', 'Jendouba', 'جندوبة', 9),
  ('TN-33', 'Kef', 'الكاف', 10),
  ('TN-34', 'Siliana', 'سليانة', 11),
  ('TN-41', 'Kairouan', 'القيروان', 12),
  ('TN-42', 'Kasserine', 'القصرين', 13),
  ('TN-43', 'Sidi Bouzid', 'سيدي بوزيد', 14),
  ('TN-51', 'Sousse', 'سوسة', 15),
  ('TN-52', 'Monastir', 'المنستير', 16),
  ('TN-53', 'Mahdia', 'المهدية', 17),
  ('TN-61', 'Sfax', 'صفاقس', 18),
  ('TN-71', 'Gafsa', 'قفصة', 19),
  ('TN-72', 'Tozeur', 'توزر', 20),
  ('TN-73', 'Kebili', 'قبلي', 21),
  ('TN-81', 'Gabès', 'قابس', 22),
  ('TN-82', 'Medenine', 'مدنين', 23),
  ('TN-83', 'Tataouine', 'تطاوين', 24)
on conflict (code) do update
set
  name_en = excluded.name_en,
  name_ar = excluded.name_ar,
  sort_order = excluded.sort_order;

-- =========================================================
-- Activity Types
-- =========================================================

insert into public.activity_types (slug, name_en, name_ar, description, sort_order)
values
  (
    'farmer',
    'Farmer',
    'فلاح',
    'Produces crops, fruits, vegetables, or other agricultural goods.',
    1
  ),
  (
    'livestock_breeder',
    'Livestock Breeder',
    'مربي ماشية',
    'Raises livestock such as cattle, sheep, goats, or camels.',
    2
  ),
  (
    'poultry_farmer',
    'Poultry Farmer',
    'مربي دواجن',
    'Raises chickens, turkeys, or other poultry for eggs or meat.',
    3
  ),
  (
    'beekeeper',
    'Beekeeper',
    'مربي نحل',
    'Produces honey and manages beehives.',
    4
  ),
  (
    'fisherman',
    'Fisherman',
    'صياد',
    'Supplies fish or seafood products.',
    5
  ),
  (
    'merchant',
    'Merchant',
    'تاجر',
    'Buys and sells agricultural goods in the market.',
    6
  ),
  (
    'wholesaler',
    'Wholesaler',
    'تاجر جملة',
    'Trades larger quantities of agricultural products.',
    7
  ),
  (
    'retailer',
    'Retailer',
    'بائع تفصيل',
    'Sells products directly to end customers in smaller quantities.',
    8
  ),
  (
    'supplier',
    'Supplier',
    'مزوّد',
    'Supplies agricultural inputs, materials, or support products.',
    9
  ),
  (
    'cooperative',
    'Cooperative',
    'تعاونية',
    'Represents a cooperative group of producers or agricultural actors.',
    10
  ),
  (
    'collector',
    'Collector',
    'مجمع',
    'Collects produce from multiple producers for resale or distribution.',
    11
  ),
  (
    'processor',
    'Processor',
    'محوّل',
    'Processes raw agricultural materials into finished or semi-finished goods.',
    12
  ),
  (
    'exporter',
    'Exporter',
    'مصدّر',
    'Exports agricultural products to external markets.',
    13
  ),
  (
    'buyer',
    'Buyer',
    'مشتري',
    'Searches for products or inputs to purchase.',
    14
  ),
  (
    'agricultural_service_provider',
    'Agricultural Service Provider',
    'مقدّم خدمات فلاحية',
    'Provides services such as transport, harvesting, irrigation, or equipment support.',
    15
  )
on conflict (slug) do update
set
  name_en = excluded.name_en,
  name_ar = excluded.name_ar,
  description = excluded.description,
  sort_order = excluded.sort_order;

commit;
