import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

import { getSupabaseClientConfig } from '@/lib/env';
import type { Database } from '@/types/supabase';
import type { Session } from '@supabase/supabase-js';

export async function POST(request: Request) {
  const cookieStore = await cookies();
  const { url, anonKey } = getSupabaseClientConfig();
  const supabase = createServerClient<Database>(url, anonKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach((cookie) => {
          cookieStore.set(cookie);
        });
      },
    },
  });

  let payload: { event?: string; session?: Session | null } = {};
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ success: true });
  }

  const { event, session } = payload;

  if (!event) {
    return NextResponse.json({ success: true });
  }

  if ((event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') && session) {
    await supabase.auth.setSession({
      access_token: session.access_token,
      refresh_token: session.refresh_token,
    });
  }

  if (event === 'SIGNED_OUT') {
    await supabase.auth.signOut();
  }

  return NextResponse.json({ success: true });
}
