-- Supabase Storage Setup for Listings

-- 1. Create the bucket if it doesn't exist
insert into storage.buckets (id, name, public)
values ('listings', 'listings', true)
on conflict (id) do nothing;

-- 2. Allow public access to read files
create policy "Allow public read access for listings"
on storage.objects for select
using ( bucket_id = 'listings' );

-- 3. Allow authenticated users to upload to the listings bucket
-- Note: Simplified to allow any authenticated user to upload. 
-- For stricter security, we could join with public.listings to check ownership.
create policy "Allow authenticated upload into listings"
on storage.objects for insert
with check (
  bucket_id = 'listings' 
  and auth.role() = 'authenticated'
);

-- 4. Allow users to update their own files in the listings bucket
create policy "Allow users to update own listing files"
on storage.objects for update
with check (
  bucket_id = 'listings' 
  and auth.role() = 'authenticated'
  -- Checks if the user is the owner of the listing referenced in the folder name
  and exists (
    select 1 from public.listings
    where id::text = (storage.foldername(name))[1]
    and user_id = auth.uid()
  )
);

-- 5. Allow users to delete their own files in the listings bucket
create policy "Allow users to delete own listing files"
on storage.objects for delete
using (
  bucket_id = 'listings' 
  and auth.role() = 'authenticated'
  and exists (
    select 1 from public.listings
    where id::text = (storage.foldername(name))[1]
    and user_id = auth.uid()
  )
);
