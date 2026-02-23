/**
 * GitHub OAuth Callback Endpoint
 * 
 * GET /api/auth/github/callback
 * Handles OAuth callback, exchanges code for token, stores user info
 */

import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

const GITHUB_TOKEN_URL = 'https://github.com/login/oauth/access_token';
const GITHUB_API_URL = 'https://api.github.com';

interface GitHubUser {
  id: number;
  login: string;
  name: string | null;
  avatar_url: string;
  html_url: string;
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const code = searchParams.get('code');
  const state = searchParams.get('state');
  const error = searchParams.get('error');
  
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
  const spawnUrl = `${appUrl}/spawn`;
  
  // Handle OAuth errors
  if (error) {
    const errorDescription = searchParams.get('error_description') || 'Unknown error';
    console.error('GitHub OAuth error:', error, errorDescription);
    return NextResponse.redirect(`${spawnUrl}?github_error=${encodeURIComponent(errorDescription)}`);
  }

  // Validate required params
  if (!code || !state) {
    return NextResponse.redirect(`${spawnUrl}?github_error=Missing+code+or+state`);
  }

  // Validate state (CSRF protection)
  const cookieStore = await cookies();
  const storedState = cookieStore.get('github_oauth_state')?.value;
  cookieStore.delete('github_oauth_state');
  
  if (!storedState || storedState !== state) {
    return NextResponse.redirect(`${spawnUrl}?github_error=Invalid+state`);
  }

  // Exchange code for access token
  const clientId = process.env.GITHUB_CLIENT_ID || process.env.NEXT_PUBLIC_GITHUB_CLIENT_ID;
  const clientSecret = process.env.GITHUB_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    return NextResponse.redirect(`${spawnUrl}?github_error=OAuth+not+configured`);
  }

  try {
    const tokenResponse = await fetch(GITHUB_TOKEN_URL, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        client_id: clientId,
        client_secret: clientSecret,
        code: code,
      }),
    });

    if (!tokenResponse.ok) {
      throw new Error('Failed to exchange code for token');
    }

    const tokenData = await tokenResponse.json();
    
    if (tokenData.error) {
      throw new Error(tokenData.error_description || tokenData.error);
    }

    const accessToken = tokenData.access_token;

    // Fetch user info
    const userResponse = await fetch(`${GITHUB_API_URL}/user`, {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Accept': 'application/vnd.github.v3+json',
      },
    });

    if (!userResponse.ok) {
      throw new Error('Failed to fetch user info');
    }

    const user: GitHubUser = await userResponse.json();

    // Check scopes to verify permissions
    const scopes = userResponse.headers.get('X-OAuth-Scopes') || '';
    const scopeList = scopes.split(',').map(s => s.trim());
    const hasRequiredScopes = scopeList.includes('repo') && scopeList.includes('workflow');

    if (!hasRequiredScopes) {
      return NextResponse.redirect(`${spawnUrl}?github_error=Insufficient+permissions`);
    }

    // Store token securely in HTTP-only cookie (short-lived for spawning)
    cookieStore.set('github_token', accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 24, // 24 hours
      path: '/',
    });

    // Create a response that will redirect and set user info for client
    // We'll pass minimal user info via URL params (public info only)
    const userInfo = encodeURIComponent(JSON.stringify({
      id: user.id,
      login: user.login,
      name: user.name,
      avatar_url: user.avatar_url,
    }));

    return NextResponse.redirect(`${spawnUrl}?github_connected=true&github_user=${userInfo}`);
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    console.error('GitHub OAuth callback error:', message);
    return NextResponse.redirect(`${spawnUrl}?github_error=${encodeURIComponent(message)}`);
  }
}
