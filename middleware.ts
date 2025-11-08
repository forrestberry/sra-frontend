import { createServerClient } from '@supabase/ssr';
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

import { getSupabaseClientConfig } from '@/lib/env';
import { getRolePath } from '@/lib/utils/app-info';
import type { Database } from '@/types/supabase';

const PUBLIC_ROUTES = new Set(['/', '/login', '/signup', '/favicon.ico']);
const PROTECTED_PREFIXES = ['/parent', '/student'];

export async function middleware(request: NextRequest) {
  const response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  const { url, anonKey } = getSupabaseClientConfig();
  const supabase = createServerClient<Database>(url, anonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach((cookie) => {
          response.cookies.set(cookie.name, cookie.value, cookie.options);
        });
      },
    },
  });

  const {
    data: { session },
  } = await supabase.auth.getSession();

  const pathname = request.nextUrl.pathname;

  if (!session?.user) {
    if (isProtectedRoute(pathname)) {
      return NextResponse.redirect(new URL('/login', request.url));
    }

    return response;
  }

  const role = session.user.app_metadata?.role as string | undefined;
  const target = getRolePath(role);

  if (PUBLIC_ROUTES.has(pathname)) {
    return NextResponse.redirect(new URL(target, request.url));
  }

  if (role === 'parent' && pathname.startsWith('/student')) {
    return NextResponse.redirect(new URL(target, request.url));
  }

  if (role === 'student' && pathname.startsWith('/parent')) {
    return NextResponse.redirect(new URL(target, request.url));
  }

  return response;
}

function isProtectedRoute(pathname: string) {
  return PROTECTED_PREFIXES.some((route) => pathname.startsWith(route));
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|robots.txt).*)'],
};
