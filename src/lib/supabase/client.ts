import { createBrowserClient } from '@supabase/ssr';

import { getSupabaseClientConfig } from '@/lib/env';
import type { Database } from '@/types/supabase';

let browserClient: ReturnType<typeof createBrowserClient<Database>> | undefined;

export function getSupabaseBrowserClient() {
  if (browserClient) {
    return browserClient;
  }

  const { url, anonKey } = getSupabaseClientConfig();
  browserClient = createBrowserClient<Database>(url, anonKey);

  return browserClient;
}
