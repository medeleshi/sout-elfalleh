import { redirect } from 'next/navigation';
import { getCurrentProfile } from '@/lib/auth/get-current-profile';
import { ROUTES } from '@/lib/constants/routes';

/**
 * Ensures the user is authenticated and has completed the onboarding flow.
 * Redirects to /login if not authenticated.
 * Redirects to /onboarding if onboarding is incomplete.
 */
export async function requireOnboarding() {
  const result = await getCurrentProfile();

  if (!result) {
    redirect(ROUTES.LOGIN);
  }

  const { user, profile } = result;

  if (!profile?.is_onboarding_completed) {
    redirect(ROUTES.ONBOARDING);
  }

  // At this point we know profile is not null because of the onboarding check logic,
  // but TypeScript might need a hint or we can cast since is_onboarding_completed=true
  // implies a profile exists in our logic.
  return { user, profile };
}
