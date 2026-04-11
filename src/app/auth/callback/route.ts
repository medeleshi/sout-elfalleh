import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { ROUTES } from '@/lib/constants/routes';

/**
 * Supabase Auth callback handler.
 *
 * Handles two flows:
 *   1. Email confirmation / magic-link  → ?code=...
 *   2. Password-reset redirect          → ?code=...&next=/update-password
 *
 * On any failure, redirects to /login with a descriptive error param.
 */
export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');
  const error = searchParams.get('error');
  const errorDescription = searchParams.get('error_description');

  // Supabase can redirect here with an error (e.g. expired link).
  if (error) {
    const url = new URL(`${origin}${ROUTES.LOGIN}`);
    url.searchParams.set('error', error);
    if (errorDescription) url.searchParams.set('error_description', errorDescription);
    return NextResponse.redirect(url);
  }

  if (!code) {
    return NextResponse.redirect(`${origin}${ROUTES.LOGIN}?error=missing_code`);
  }

  const supabase = await createClient();
  const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);

  if (exchangeError) {
    const url = new URL(`${origin}${ROUTES.LOGIN}`);
    url.searchParams.set('error', 'auth_callback_failed');
    url.searchParams.set('error_description', exchangeError.message);
    return NextResponse.redirect(url);
  }

  // Default redirect target — overridden by ?next= (e.g. /update-password).
  const next = searchParams.get('next') ?? ROUTES.HOME;

  // Use the forwarded host in production (e.g. behind a proxy / Vercel).
  const forwardedHost = request.headers.get('x-forwarded-host');
  const isLocalEnv = process.env.NODE_ENV === 'development';

  if (!isLocalEnv && forwardedHost) {
    return NextResponse.redirect(`https://${forwardedHost}${next}`);
  }

  return NextResponse.redirect(`${origin}${next}`);
}
