type SupabaseClientConfig = {
  url: string;
  anonKey: string;
};

function assertEnv(value: string | undefined, message: string) {
  if (!value) {
    throw new Error(message);
  }

  return value;
}

export function getSupabaseClientConfig(): SupabaseClientConfig {
  const url = assertEnv(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    'NEXT_PUBLIC_SUPABASE_URL is not set',
  );
  const anonKey = assertEnv(
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    'NEXT_PUBLIC_SUPABASE_ANON_KEY is not set',
  );

  return { url, anonKey };
}

export function getSupabaseServiceRoleKey() {
  return process.env.SUPABASE_SERVICE_ROLE_KEY ?? '';
}
