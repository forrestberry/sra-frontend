'use client';

import type { SupabaseClient } from '@supabase/supabase-js';
import { createContext, useContext, useEffect, useMemo } from 'react';

import { getSupabaseBrowserClient } from '@/lib/supabase/client';
import type { Database } from '@/types/supabase';

type SupabaseContextValue = {
  supabase: SupabaseClient<Database>;
};

const SupabaseContext = createContext<SupabaseContextValue | undefined>(undefined);

async function syncSessionWithServer(event: string, session: unknown) {
  await fetch('/api/auth/update-session', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({ event, session }),
  });
}

export function SupabaseProvider({ children }: { children: React.ReactNode }) {
  const supabase = useMemo(() => getSupabaseBrowserClient(), []);

  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      syncSessionWithServer(event, session);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [supabase]);

  return (
    <SupabaseContext.Provider value={{ supabase }}>{children}</SupabaseContext.Provider>
  );
}

export function useSupabaseClient() {
  const context = useContext(SupabaseContext);
  if (!context) {
    throw new Error('useSupabaseClient must be used within SupabaseProvider');
  }
  return context.supabase;
}
