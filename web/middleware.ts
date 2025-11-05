/**
 * Next.js Middleware for Route Protection
 * Implements RBAC-based route access control
 */

import { NextRequest, NextResponse } from 'next/server';
import { Role, canAccessRoute } from './app/auth/roles';

// Routes that require authentication
const PROTECTED_ROUTES = ['/admin', '/animator', '/sponsor'];

// Public routes that don't require authentication
const PUBLIC_ROUTES = ['/', '/deck', '/api/health'];

/**
 * Main middleware function for route protection
 */
export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Skip middleware for static files and API routes (except protected ones)
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/favicon') ||
    pathname.includes('.') ||
    (pathname.startsWith('/api') && !pathname.startsWith('/api/admin'))
  ) {
    return NextResponse.next();
  }
  
  // Check if route requires protection
  const requiresAuth = PROTECTED_ROUTES.some(route => pathname.startsWith(route));
  
  if (!requiresAuth) {
    return NextResponse.next();
  }
  
  // Get user roles from session/cookie
  const userRoles = await getUserRoles(request);
  
  // If no roles found, redirect to connect wallet
  if (!userRoles || userRoles.length === 0) {
    return redirectToAuth(request);
  }
  
  // Check route permissions
  if (!canAccessRoute(userRoles, pathname)) {
    return redirectToUnauthorized(request);
  }
  
  // Add user roles to request headers for use in components
  const response = NextResponse.next();
  response.headers.set('x-user-roles', JSON.stringify(userRoles));
  
  return response;
}

/**
 * Get user roles from request (session, cookie, or JWT)
 */
async function getUserRoles(request: NextRequest): Promise<Role[] | null> {
  try {
    // Check for session cookie
    const sessionToken = request.cookies.get('rbac-session')?.value;
    
    if (sessionToken) {
      return await getRolesFromSession(sessionToken);
    }
    
    return null;
  } catch (error) {
    console.error('Error getting user roles:', error);
    return null;
  }
}

/**
 * Get roles from session token
 */
async function getRolesFromSession(sessionToken: string): Promise<Role[] | null> {
  try {
    const sessionData = JSON.parse(atob(sessionToken));
    
    if (sessionData.expires && new Date(sessionData.expires) < new Date()) {
      return null; // Session expired
    }
    
    return sessionData.roles || null;
  } catch (error) {
    console.error('Error decoding session:', error);
    return null;
  }
}



/**
 * Redirect to authentication page
 */
function redirectToAuth(request: NextRequest): NextResponse {
  const loginUrl = new URL('/auth/connect', request.url);
  loginUrl.searchParams.set('redirect', request.nextUrl.pathname);
  return NextResponse.redirect(loginUrl);
}

/**
 * Redirect to unauthorized page
 */
function redirectToUnauthorized(request: NextRequest): NextResponse {
  const unauthorizedUrl = new URL('/auth/unauthorized', request.url);
  return NextResponse.redirect(unauthorizedUrl);
}

// Configure which routes this middleware runs on
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};