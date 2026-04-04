-- Sout El Falah - Phase 0 Verification Fix
-- 1. Security Baseline: Enable RLS on all core tables and add owner policies
-- 2. Data Baseline: Seed governorates and activity_types

begin;

-- =========================================================
-- 1. Security Baseline (RLS)
-- =========================================================

-- Profiles RLS
alter table public.profiles enable row level security;
drop policy if exists "Profiles are viewable by everyone" on public.profiles;
create policy "Profiles are viewable by everyone" on public.profiles for select using (true);
drop policy if exists "Users can update own profile" on public.profiles;
create policy "Users can update own profile" on public.profiles for update using (auth.uid() = id);

-- Profile Private Details RLS
alter table public.profile_private_details enable row level security;
drop policy if exists "Users can view own private details" on public.profile_private_details;
create policy "Users can view own private details" on public.profile_private_details for select using (auth.uid() = user_id);
drop policy if exists "Users can update own private details" on public.profile_private_details;
create policy "Users can update own private details" on public.profile_private_details for update using (auth.uid() = user_id);
drop policy if exists "Users can insert own private details" on public.profile_private_details;
create policy "Users can insert own private details" on public.profile_private_details for insert with check (auth.uid() = user_id);

-- Lookup Tables RLS (Public Read Only)
alter table public.governorates enable row level security;
drop policy if exists "Governorates are viewable by everyone" on public.governorates;
create policy "Governorates are viewable by everyone" on public.governorates for select using (is_active = true);

alter table public.activity_types enable row level security;
drop policy if exists "Activity types are viewable by everyone" on public.activity_types;
create policy "Activity types are viewable by everyone" on public.activity_types for select using (is_active = true);

-- Purchase Requests RLS
alter table public.purchase_requests enable row level security;
drop policy if exists "Active purchase requests are viewable by everyone" on public.purchase_requests;
create policy "Active purchase requests are viewable by everyone" on public.purchase_requests for select using (status = 'active' or auth.uid() = user_id);
drop policy if exists "Users can manage own purchase requests" on public.purchase_requests;
create policy "Users can manage own purchase requests" on public.purchase_requests for all using (auth.uid() = user_id);

-- Posts RLS
alter table public.posts enable row level security;
drop policy if exists "Active posts are viewable by everyone" on public.posts;
create policy "Active posts are viewable by everyone" on public.posts for select using (status = 'active' or auth.uid() = author_id);
drop policy if exists "Users can manage own posts" on public.posts;
create policy "Users can manage own posts" on public.posts for all using (auth.uid() = author_id);

-- Post Comments RLS
alter table public.post_comments enable row level security;
drop policy if exists "Comments are viewable by everyone" on public.post_comments;
create policy "Comments are viewable by everyone" on public.post_comments for select using (true);
drop policy if exists "Users can manage own comments" on public.post_comments;
create policy "Users can manage own comments" on public.post_comments for all using (auth.uid() = author_id);

-- Notifications RLS
alter table public.notifications enable row level security;
drop policy if exists "Users can view own notifications" on public.notifications;
create policy "Users can view own notifications" on public.notifications for select using (auth.uid() = user_id);
drop policy if exists "Users can update own notifications" on public.notifications;
create policy "Users can update own notifications" on public.notifications for update using (auth.uid() = user_id);

-- Saved Items RLS
alter table public.saved_items enable row level security;
drop policy if exists "Users can manage own saved items" on public.saved_items;
create policy "Users can manage own saved items" on public.saved_items for all using (auth.uid() = user_id);

-- Messaging RLS (Simplified for Phase 0)
alter table public.conversations enable row level security;
drop policy if exists "Participants can view own conversations" on public.conversations;
create policy "Participants can view own conversations" on public.conversations for select using (
  exists (select 1 from public.conversation_participants where conversation_id = id and user_id = auth.uid())
);

alter table public.conversation_participants enable row level security;
drop policy if exists "Users can view own participations" on public.conversation_participants;
create policy "Users can view own participations" on public.conversation_participants for select using (user_id = auth.uid());

alter table public.messages enable row level security;
drop policy if exists "Participants can view messages" on public.messages;
create policy "Participants can view messages" on public.messages for select using (
  exists (select 1 from public.conversation_participants where conversation_id = messages.conversation_id and user_id = auth.uid())
);
drop policy if exists "Users can send messages to own conversations" on public.messages;
create policy "Users can send messages to own conversations" on public.messages for insert with check (
  auth.uid() = sender_id and
  exists (select 1 from public.conversation_participants where conversation_id = messages.conversation_id and user_id = auth.uid())
);

-- =========================================================
-- 2. Data Baseline (Seed)
-- =========================================================

-- Seed Governorates
insert into public.governorates (code, name_en, name_ar, sort_order)
values
  ('TN-11', 'Tunis', 'تونس', 1),
  ('TN-12', 'Ariana', 'أريانة', 2),
  ('TN-13', 'Ben Arous', 'بن عروس', 3),
  ('TN-14', 'Manouba', 'منوبة', 4),
  ('TN-21', 'Nabeul', 'نابل', 5),
  ('TN-22', 'Zaghouan', 'زغوان', 6),
  ('TN-23', 'Bizerte', 'بنزرت', 7),
  ('TN-31', 'Beja', 'باجة', 8),
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
  ('TN-81', 'Gabes', 'قابس', 22),
  ('TN-82', 'Medenine', 'مدنين', 23),
  ('TN-83', 'Tataouine', 'تطاوين', 24)
on conflict (code) do update set
  name_en = excluded.name_en,
  name_ar = excluded.name_ar,
  sort_order = excluded.sort_order;

-- Seed Activity Types
insert into public.activity_types (slug, name_en, name_ar, sort_order)
values
  ('crop_production', 'Crop Production', 'إنتاج نباتي', 10),
  ('fruit_farming', 'Fruit Farming', 'أشجار مثمرة وقوارص', 20),
  ('livestock_breeding', 'Livestock Breeding', 'تربية ماشية', 30),
  ('poultry_farming', 'Poultry Farming', 'دواجن ومنتجاتها', 40),
  ('beekeeping', 'Beekeeping', 'تربية نحل وإنتاج عسل', 50),
  ('organic_farming', 'Organic Farming', 'فلاحة بيولوجية', 60),
  ('horticulture', 'Horticulture & Nursery', 'نباتات زينة ومشاتل', 70),
  ('general_farming', 'General Farming', 'فلاحة عامة ومتنوعة', 80),
  ('agricultural_services', 'Agricultural Services', 'خدمات فلاحية', 90)
on conflict (slug) do update set
  name_en = excluded.name_en,
  name_ar = excluded.name_ar,
  sort_order = excluded.sort_order;

commit;
