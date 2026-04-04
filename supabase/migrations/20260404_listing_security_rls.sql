-- Row Level Security (RLS) for Listings and Listing Images
-- Priority: High (Security)

-- =========================================================
-- 1. Enable RLS on both tables
-- =========================================================
alter table public.listings enable row level security;
alter table public.listing_images enable row level security;

-- =========================================================
-- 2. Policies for public.listings
-- =========================================================

-- SELECT: Public can see active listings, owners can see everything
create policy "Allow public to select active listings"
on public.listings for select
using (
  status = 'active'
  or auth.uid() = user_id
);

-- INSERT: Authenticated users can insert their own listings
create policy "Allow authenticated users to insert own listings"
on public.listings for insert
with check (
  auth.role() = 'authenticated'
  and auth.uid() = user_id
);

-- UPDATE: Owners can update their own listings
create policy "Allow owners to update own listings"
on public.listings for update
using (
  auth.uid() = user_id
)
with check (
  auth.uid() = user_id
);

-- DELETE: Owners can delete their own listings
create policy "Allow owners to delete own listings"
on public.listings for delete
using (
  auth.uid() = user_id
);

-- =========================================================
-- 3. Policies for public.listing_images
-- =========================================================

-- SELECT: Images are visible if their parent listing is visible
create policy "Allow selection if parent listing is visible"
on public.listing_images for select
using (
  exists (
    select 1 from public.listings
    where id = listing_id
  )
);

-- INSERT/UPDATE/DELETE: Only owners of the parent listing can manage images
create policy "Allow management of images by listing owner"
on public.listing_images for all
using (
  exists (
    select 1 from public.listings
    where id = listing_id
    and user_id = auth.uid()
  )
)
with check (
  exists (
    select 1 from public.listings
    where id = listing_id
    and user_id = auth.uid()
  )
);
