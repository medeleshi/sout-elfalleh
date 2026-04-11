import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';
import { type Database } from '@/types/database';
import { ROUTES } from '@/lib/constants/routes';

/**
 * Updates the Supabase session and enforces route protection.
 *
 * Rules:
 *   - Unauthenticated users → can only access public routes, else → /login
 *   - Authenticated + onboarding incomplete → forced to /onboarding
 *     (except public routes and /onboarding itself)
 *   - Authenticated + onboarding complete → cannot visit /onboarding → /home
 *   - Authenticated + visiting /login or /signup → redirect away
 */
export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          // Write cookies to both the request and the response so the
          // refreshed session propagates correctly in every environment.
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // IMPORTANT: always call getUser() to refresh the session token.
  // Never use getSession() here — it is not secure in middleware.
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const path = request.nextUrl.pathname;

  // ── Route classification ──────────────────────────────────────────────────

  const isPublicRoute =
    path === ROUTES.LANDING ||
    path.startsWith(ROUTES.LOGIN) ||
    path.startsWith(ROUTES.SIGNUP) ||
    path.startsWith(ROUTES.FORGOT_PASSWORD) ||
    path.startsWith(ROUTES.UPDATE_PASSWORD) ||
    path.startsWith(ROUTES.AUTH_CALLBACK) ||
    path.startsWith('/privacy') ||
    path.startsWith('/terms') ||
    path.startsWith('/rules');

  const isAuthRoute =
    path.startsWith(ROUTES.LOGIN) || path.startsWith(ROUTES.SIGNUP);

  // ── Guard: unauthenticated ────────────────────────────────────────────────

  if (!user && !isPublicRoute) {
    const url = request.nextUrl.clone();
    url.pathname = ROUTES.LOGIN;
    return NextResponse.redirect(url);
  }

  // ── Guard: authenticated ──────────────────────────────────────────────────

  if (user) {
    // Fetch only the onboarding flag — cheap single-column select.
    const { data: profile } = await supabase
      .from('profiles')
      .select('is_onboarding_completed')
      .eq('id', user.id)
      .maybeSingle();

    const onboardingDone = profile?.is_onboarding_completed ?? false;

    // Kick logged-in users off auth pages.
    if (isAuthRoute) {
      const url = request.nextUrl.clone();
      url.pathname = onboardingDone ? ROUTES.HOME : ROUTES.ONBOARDING;
      return NextResponse.redirect(url);
    }

    // Force incomplete users to onboarding — but don't loop on /onboarding itself.
    if (!onboardingDone && path !== ROUTES.ONBOARDING && !isPublicRoute) {
      const url = request.nextUrl.clone();
      url.pathname = ROUTES.ONBOARDING;
      return NextResponse.redirect(url);
    }

    // Don't let completed users revisit onboarding.
    if (onboardingDone && path === ROUTES.ONBOARDING) {
      const url = request.nextUrl.clone();
      url.pathname = ROUTES.HOME;
      return NextResponse.redirect(url);
    }
  }

  return supabaseResponse;
}
