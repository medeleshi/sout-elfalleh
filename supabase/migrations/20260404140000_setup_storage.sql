-- Setup Supabase Storage Buckets and Policies

-- Create 'listings' bucket (public)
insert into storage.buckets (id, name, public)
  values ('listings', 'listings', true)
  on conflict (id) do update set public = true;

-- Create 'avatars' bucket (public)
insert into storage.buckets (id, name, public)
  values ('avatars', 'avatars', true)
  on conflict (id) do update set public = true;

-- ─── LISTINGS bucket policies ────────────────────────────────────────────────

-- Anyone can read listing images
create policy "Public Read Listings Storage" on storage.objects
  for select using (bucket_id = 'listings');

-- Authenticated users can upload listing images (scoped to a folder by listing_id)
create policy "Auth Users Upload Listings Storage" on storage.objects
  for insert with check (
    bucket_id = 'listings' 
    and auth.role() = 'authenticated'
  );

-- Authenticated users can update their own uploads
create policy "Auth Users Update Listings Storage" on storage.objects
  for update using (
    bucket_id = 'listings'
    and auth.uid() = owner
  );

-- Authenticated users can delete their own uploads
create policy "Auth Users Delete Listings Storage" on storage.objects
  for delete using (
    bucket_id = 'listings'
    and auth.uid() = owner
  );

-- ─── AVATARS bucket policies ──────────────────────────────────────────────────

-- Anyone can read avatar images
create policy "Public Read Avatars Storage" on storage.objects
  for select using (bucket_id = 'avatars');

-- Users can upload their own avatar (scoped to their user_id folder)
create policy "Auth Users Upload Avatars Storage" on storage.objects
  for insert with check (
    bucket_id = 'avatars'
    and auth.role() = 'authenticated'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

-- Users can update their own avatar
create policy "Auth Users Update Avatars Storage" on storage.objects
  for update using (
    bucket_id = 'avatars'
    and auth.uid() = owner
  );

-- Users can delete their own avatar
create policy "Auth Users Delete Avatars Storage" on storage.objects
  for delete using (
    bucket_id = 'avatars'
    and auth.uid() = owner
  );
