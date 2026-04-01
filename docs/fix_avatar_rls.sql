-- Supabase Storage Setup for Avatars

-- 1. Create the bucket if it doesn't exist
insert into storage.buckets (id, name, public)
values ('avatars', 'avatars', true)
on conflict (id) do nothing;

-- 2. Allow public access to read files
create policy "Allow public read access"
on storage.objects for select
using ( bucket_id = 'avatars' );

-- 3. Allow authenticated users to upload to their own folder
create policy "Allow authenticated upload into own folder"
on storage.objects for insert
with check (
  bucket_id = 'avatars' 
  and auth.role() = 'authenticated'
  and (storage.foldername(name))[1] = auth.uid()::text
);

-- 4. Allow users to update their own files
create policy "Allow users to update own files"
on storage.objects for update
with check (
  bucket_id = 'avatars' 
  and auth.uid()::text = (storage.foldername(name))[1]
);

-- 5. Allow users to delete their own files
create policy "Allow users to delete own files"
on storage.objects for delete
using (
  bucket_id = 'avatars' 
  and auth.uid()::text = (storage.foldername(name))[1]
);
