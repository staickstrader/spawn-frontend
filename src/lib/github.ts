/**
 * GitHub OAuth Integration
 * 
 * Environment variables required:
 * - GITHUB_CLIENT_ID: OAuth App Client ID
 * - GITHUB_CLIENT_SECRET: OAuth App Client Secret (server-side only)
 * - NEXT_PUBLIC_APP_URL: Base URL of the app (e.g., https://spawn.app)
 */

// OAuth configuration
const GITHUB_OAUTH_URL = 'https://github.com/login/oauth/authorize';
const GITHUB_TOKEN_URL = 'https://github.com/login/oauth/access_token';
const GITHUB_API_URL = 'https://api.github.com';

// Required scopes for agent deployment
// - repo: create and manage repositories
// - workflow: trigger GitHub Actions
const GITHUB_SCOPES = ['repo', 'workflow'].join(' ');

export interface GitHubUser {
  id: number;
  login: string;
  name: string | null;
  avatar_url: string;
  html_url: string;
  public_repos: number;
}

export interface GitHubAuthState {
  isConnected: boolean;
  user: GitHubUser | null;
  accessToken: string | null;
}

/**
 * Generate a random state string for CSRF protection
 */
export function generateOAuthState(): string {
  const array = new Uint8Array(32);
  crypto.getRandomValues(array);
  return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
}

/**
 * Get the GitHub OAuth authorization URL
 */
export function getGitHubAuthUrl(state: string): string {
  const clientId = process.env.NEXT_PUBLIC_GITHUB_CLIENT_ID;
  const redirectUri = `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/github/callback`;
  
  if (!clientId) {
    throw new Error('GITHUB_CLIENT_ID is not configured');
  }

  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: redirectUri,
    scope: GITHUB_SCOPES,
    state: state,
    allow_signup: 'true',
  });

  return `${GITHUB_OAUTH_URL}?${params.toString()}`;
}

/**
 * Exchange authorization code for access token (server-side only)
 */
export async function exchangeCodeForToken(code: string): Promise<string> {
  const clientId = process.env.GITHUB_CLIENT_ID || process.env.NEXT_PUBLIC_GITHUB_CLIENT_ID;
  const clientSecret = process.env.GITHUB_CLIENT_SECRET;
  
  if (!clientId || !clientSecret) {
    throw new Error('GitHub OAuth credentials not configured');
  }

  const response = await fetch(GITHUB_TOKEN_URL, {
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

  if (!response.ok) {
    throw new Error('Failed to exchange code for token');
  }

  const data = await response.json();
  
  if (data.error) {
    throw new Error(data.error_description || data.error);
  }

  return data.access_token;
}

/**
 * Fetch authenticated GitHub user info
 */
export async function getGitHubUser(accessToken: string): Promise<GitHubUser> {
  const response = await fetch(`${GITHUB_API_URL}/user`, {
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Accept': 'application/vnd.github.v3+json',
    },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch GitHub user');
  }

  return response.json();
}

/**
 * Verify user has permissions to create repos
 */
export async function verifyRepoPermissions(accessToken: string): Promise<boolean> {
  try {
    // Check the token scopes from a simple API call
    const response = await fetch(`${GITHUB_API_URL}/user`, {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Accept': 'application/vnd.github.v3+json',
      },
    });

    // GitHub returns scopes in the X-OAuth-Scopes header
    const scopes = response.headers.get('X-OAuth-Scopes') || '';
    const scopeList = scopes.split(',').map(s => s.trim());
    
    // Check for required scopes
    const hasRepo = scopeList.includes('repo');
    const hasWorkflow = scopeList.includes('workflow');

    return hasRepo && hasWorkflow;
  } catch {
    return false;
  }
}

/**
 * Create a repository for the agent
 */
export async function createAgentRepository(
  accessToken: string,
  agentName: string,
  description: string
): Promise<{ owner: string; repo: string; url: string }> {
  const repoName = `spawn-agent-${agentName.toLowerCase().replace(/[^a-z0-9]/g, '-')}`;
  
  const response = await fetch(`${GITHUB_API_URL}/user/repos`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Accept': 'application/vnd.github.v3+json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      name: repoName,
      description: `SPAWN Agent: ${description}`,
      private: true,
      auto_init: false,
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to create repository');
  }

  const repo = await response.json();
  
  return {
    owner: repo.owner.login,
    repo: repo.name,
    url: repo.html_url,
  };
}

/**
 * Storage keys for client-side state
 */
export const GITHUB_STORAGE_KEYS = {
  STATE: 'github_oauth_state',
  USER: 'github_user',
  CONNECTED: 'github_connected',
} as const;

/**
 * Store OAuth state for CSRF validation
 */
export function storeOAuthState(state: string): void {
  if (typeof window !== 'undefined') {
    sessionStorage.setItem(GITHUB_STORAGE_KEYS.STATE, state);
  }
}

/**
 * Validate and consume OAuth state
 */
export function validateOAuthState(receivedState: string): boolean {
  if (typeof window === 'undefined') return false;
  
  const storedState = sessionStorage.getItem(GITHUB_STORAGE_KEYS.STATE);
  sessionStorage.removeItem(GITHUB_STORAGE_KEYS.STATE);
  
  return storedState === receivedState;
}

/**
 * Store GitHub user in localStorage
 */
export function storeGitHubUser(user: GitHubUser): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem(GITHUB_STORAGE_KEYS.USER, JSON.stringify(user));
    localStorage.setItem(GITHUB_STORAGE_KEYS.CONNECTED, 'true');
  }
}

/**
 * Get stored GitHub user
 */
export function getStoredGitHubUser(): GitHubUser | null {
  if (typeof window === 'undefined') return null;
  
  const stored = localStorage.getItem(GITHUB_STORAGE_KEYS.USER);
  if (!stored) return null;
  
  try {
    return JSON.parse(stored);
  } catch {
    return null;
  }
}

/**
 * Check if GitHub is connected
 */
export function isGitHubConnected(): boolean {
  if (typeof window === 'undefined') return false;
  return localStorage.getItem(GITHUB_STORAGE_KEYS.CONNECTED) === 'true';
}

/**
 * Clear GitHub auth state
 */
export function clearGitHubAuth(): void {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(GITHUB_STORAGE_KEYS.USER);
    localStorage.removeItem(GITHUB_STORAGE_KEYS.CONNECTED);
    sessionStorage.removeItem(GITHUB_STORAGE_KEYS.STATE);
  }
}
