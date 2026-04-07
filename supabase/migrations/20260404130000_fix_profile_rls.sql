-- Fix Onboarding RLS Policies
-- Adding missing INSERT policies for profiles and profile_private_details
-- to allow owners (authenticated users) to create their own records.

-- Profiles
create policy "Owners Insert Profiles" on public.profiles 
  for insert with check (auth.uid() = id);

-- Private Details
create policy "Owners Insert Private Details" on public.profile_private_details 
  for insert with check (auth.uid() = user_id);
