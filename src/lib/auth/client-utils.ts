import { createClient } from '@/lib/supabase/client';

/**
 * Triggers a Google OAuth sign-in flow.
 * Note: This triggers a browser redirect.
 */
export async function signInWithGoogle() {
  const supabase = createClient();
  const { error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${window.location.origin}/auth/callback`,
    },
  });

  if (error) {
    console.error('Google Auth Error:', error.message);
    throw error;
  }
}
