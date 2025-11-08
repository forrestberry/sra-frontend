import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

import { getSupabaseClientConfig } from '@/lib/env';
import type { Database } from '@/types/supabase';

export async function getSupabaseServerClient() {
  const cookieStore = await cookies();
  const { url, anonKey } = getSupabaseClientConfig();

  return createServerClient<Database>(url, anonKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        if (cookiesToSet.length > 0) {
          // Server components cannot persist cookies; middleware handles updates.
        }
      },
    },
  });
}
