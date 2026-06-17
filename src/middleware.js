import { NextResponse } from 'next/server';

export function middleware(request) {
  const token = request.cookies.get('token')?.value;
  const { pathname } = request.nextUrl;

  // Logged-in users should not be allowed to access the login page "/"
  if (token && pathname === '/') {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  // Unauthenticated users should not be allowed to access protected pages.
  // Protected pages are anything that is NOT the login page "/".
  if (!token && pathname !== '/') {
    return NextResponse.redirect(new URL('/', request.url));
  }

  return NextResponse.next();
}

// Config to specify the matcher rules
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - assets (public assets)
     * - files with an extension (e.g. svg, png, etc.)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|assets|.*\\..*$).*)',
  ],
};
