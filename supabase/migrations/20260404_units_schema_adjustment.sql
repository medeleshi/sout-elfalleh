-- Sout El Falah - Units Schema Adjustment
-- Adds: unit_id to listings and purchase_requests
-- Strategy: Staged migration (keep old 'unit' text field for now)

begin;

-- =========================================================
-- 1. Adjust Listings
-- =========================================================

alter table public.listings 
  add column if not exists unit_id uuid references public.units(id) on delete set null;

create index if not exists idx_listings_unit_id on public.listings(unit_id);

comment on column public.listings.unit is 'Legacy text-based unit. Migrating to unit_id.';
comment on column public.listings.unit_id is 'Normalized unit reference.';

-- =========================================================
-- 2. Adjust Purchase Requests
-- =========================================================

alter table public.purchase_requests
  add column if not exists unit_id uuid references public.units(id) on delete set null;

create index if not exists idx_purchase_requests_unit_id on public.purchase_requests(unit_id);

comment on column public.purchase_requests.unit is 'Legacy text-based unit. Migrating to unit_id.';
comment on column public.purchase_requests.unit_id is 'Normalized unit reference.';

-- =========================================================
-- 3. (Optional) Backfill helper concept
-- =========================================================
-- This block could attempt to backfill unit_id based on the 'unit' text
-- skipping for now to keep it purely foundational and safe.

commit;
