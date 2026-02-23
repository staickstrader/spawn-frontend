/**
 * GitHub OAuth Initiation Endpoint
 * 
 * GET /api/auth/github
 * Redirects to GitHub OAuth authorization page
 */

import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

const GITHUB_OAUTH_URL = 'https://github.com/login/oauth/authorize';
const GITHUB_SCOPES = ['repo', 'workflow'].join(' ');

export async function GET() {
  const clientId = process.env.NEXT_PUBLIC_GITHUB_CLIENT_ID;
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
  
  if (!clientId) {
    return NextResponse.json(
      { error: 'GitHub OAuth not configured' },
      { status: 500 }
    );
  }

  // Generate state for CSRF protection
  const array = new Uint8Array(32);
  crypto.getRandomValues(array);
  const state = Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');

  // Store state in cookie for validation
  const cookieStore = await cookies();
  cookieStore.set('github_oauth_state', state, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 10, // 10 minutes
    path: '/',
  });

  // Build OAuth URL
  const redirectUri = `${appUrl}/api/auth/github/callback`;
  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: redirectUri,
    scope: GITHUB_SCOPES,
    state: state,
    allow_signup: 'true',
  });

  const authUrl = `${GITHUB_OAUTH_URL}?${params.toString()}`;
  
  return NextResponse.redirect(authUrl);
}
