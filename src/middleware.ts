import { NextRequest, NextResponse } from 'next/server';

// Only protect page routes (not API routes or static assets)
// API routes handle their own auth via getAuthFromCookie()
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Let all API routes, static assets pass through
  if (
    pathname.startsWith('/api/') ||
    pathname.startsWith('/_next/') ||
    pathname === '/favicon.ico'
  ) {
    return NextResponse.next();
  }

  // Public pages that don't require auth
  if (
    pathname === '/login' ||
    pathname === '/register' ||
    pathname === '/blog' ||
    pathname.startsWith('/blog/')
  ) {
    return NextResponse.next();
  }

  // For protected pages (/, etc.), let them through.
  // The frontend will handle auth check and redirect to /login if needed.
  // This avoids issues with cookies being blocked in iframe contexts.
  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};
