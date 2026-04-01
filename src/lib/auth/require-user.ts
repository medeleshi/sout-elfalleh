import { redirect } from 'next/navigation';
import { getCurrentProfile } from '@/lib/auth/get-current-profile';
import { ROUTES } from '@/lib/constants/routes';

/**
 * Ensures the user is authenticated.
 * Redirects to the login page if no session is found.
 */
export async function requireUser() {
  const result = await getCurrentProfile();

  if (!result) {
    redirect(ROUTES.LOGIN);
  }

  return result.user;
}
