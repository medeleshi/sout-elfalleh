import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';
import { type Database } from '@/types/database';
import { ROUTES } from '@/lib/constants/routes';

/**
 * Updates the Supabase session in the middleware.
 * This is required to keep the session alive and sync cookies between the request and response.
 */
export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  });

  const supabase = createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => request.cookies.set(name, value));
          supabaseResponse = NextResponse.next({
            request,
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // refreshing the auth token
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const path = request.nextUrl.pathname;

  // Define public vs auth routes
  const isPublicRoute =
    path === ROUTES.LANDING ||
    path.startsWith(ROUTES.LOGIN) ||
    path.startsWith(ROUTES.SIGNUP) ||
    path.startsWith(ROUTES.FORGOT_PASSWORD) ||
    path.startsWith(ROUTES.AUTH_CALLBACK) ||
    path.startsWith('/privacy') ||
    path.startsWith('/terms') ||
    path.startsWith('/rules');

  const isAuthRoute = path.startsWith(ROUTES.LOGIN) || path.startsWith(ROUTES.SIGNUP);

  if (!user && !isPublicRoute) {
    // Guest trying to access protected route -> Redirect to Login
    const url = request.nextUrl.clone();
    url.pathname = ROUTES.LOGIN;
    return NextResponse.redirect(url);
  }

  if (user) {
    // fetch profile to check onboarding status
    const { data: profile } = (await supabase
      .from('profiles')
      .select('is_onboarding_completed')
      .eq('id', user.id)
      .maybeSingle()) as any;

    const isOnboardingCompleted = profile?.is_onboarding_completed;

    // if user is logged in and on an auth route (login/signup), redirect away
    if (isAuthRoute) {
      const url = request.nextUrl.clone();
      url.pathname = isOnboardingCompleted ? ROUTES.HOME : ROUTES.ONBOARDING;
      return NextResponse.redirect(url);
    }

    // handle onboarding redirect: If onboarding not completed, force them to onboarding
    // but avoid infinite loops if they are on a public route or already on onboarding
    if (!isOnboardingCompleted && path !== ROUTES.ONBOARDING && !isPublicRoute) {
      const url = request.nextUrl.clone();
      url.pathname = ROUTES.ONBOARDING;
      return NextResponse.redirect(url);
    }

    // if onboarding IS completed, don't let them go back to onboarding
    if (isOnboardingCompleted && path === ROUTES.ONBOARDING) {
      const url = request.nextUrl.clone();
      url.pathname = ROUTES.HOME;
      return NextResponse.redirect(url);
    }
  }

  return supabaseResponse;
}
