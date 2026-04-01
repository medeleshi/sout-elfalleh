import { createClient } from '@/lib/supabase/server';
import { getCurrentUser } from '@/lib/auth/get-current-user';
import { type Tables } from '@/types/database';
import { type User } from '@supabase/supabase-js';

type Profile = Tables<'profiles'>;

/**
 * Fetches the current authenticated user and their profile from the database.
 * Includes matched governorate data if available.
 * Returns null if no user is authenticated.
 */
export async function getCurrentProfile(): Promise<{
  user: User;
  profile: (Profile & { governorate_name_ar?: string | null }) | null;
} | null> {
  const user = await getCurrentUser();

  if (!user) {
    return null;
  }

  const supabase = await createClient();
  const { data: profile, error } = await supabase
    .from('profiles')
    .select('*, governorates(name_ar)')
    .eq('id', user.id)
    .maybeSingle();

  if (error) {
    console.error('Error fetching profile:', error);
  }

  return {
    user,
    profile: profile ? {
      ...(profile as any),
      governorate_name_ar: (profile as any).governorates?.name_ar || null
    } : null,
  };
}