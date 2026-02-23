/**
 * GitHub OAuth Logout Endpoint
 * 
 * POST /api/auth/github/logout
 * Clears the GitHub token cookie
 */

import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST() {
  const cookieStore = await cookies();
  
  // Delete the GitHub token cookie
  cookieStore.delete('github_token');
  cookieStore.delete('github_oauth_state');
  
  return NextResponse.json({ success: true });
}
