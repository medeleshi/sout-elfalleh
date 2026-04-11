import { createClient } from '@/lib/supabase/server';
import { getCurrentUser } from '@/lib/auth/get-current-user';
import { type Tables } from '@/types/database';
import { type User } from '@supabase/supabase-js';

type Profile = Tables<'profiles'>;

// Extended profile type — includes joined lookup names for convenience.
export type ProfileWithMeta = Profile & {
  governorate_name_ar: string | null;
  activity_type_name_ar: string | null;
};

/**
 * Fetches the current authenticated user and their full profile.
 * Joins governorates and activity_types for display names.
 * Returns null if unauthenticated.
 */
export async function getCurrentProfile(): Promise<{
  user: User;
  profile: ProfileWithMeta | null;
} | null> {
  const user = await getCurrentUser();
  if (!user) return null;

  const supabase = await createClient();

  const { data, error } = await supabase
    .from('profiles')
    .select('*, governorates(name_ar), activity_types(name_ar)')
    .eq('id', user.id)
    .maybeSingle();

  if (error) {
    console.error('[GET_PROFILE_ERROR]', error.message);
  }

  if (!data) {
    return { user, profile: null };
  }

  // Flatten the joined data into a flat object — avoids `as any` casts downstream.
  const profile: ProfileWithMeta = {
    ...(data as Profile),
    governorate_name_ar:    (data as any).governorates?.name_ar    ?? null,
    activity_type_name_ar:  (data as any).activity_types?.name_ar  ?? null,
  };

  return { user, profile };
}
