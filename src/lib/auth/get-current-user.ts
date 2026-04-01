// src/lib/auth/get-current-user.ts
import { createClient } from '@/lib/supabase/server';
import { type User } from '@supabase/supabase-js';

/**
 * Retrieves the current authenticated user from Supabase.
 * Returns null if no user is authenticated.
 */
export async function getCurrentUser(): Promise<User | null> {
  const supabase = await createClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    return null;
  }

  return user;
}
