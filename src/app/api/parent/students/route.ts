import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

import { getSupabaseClientConfig } from '@/lib/env';
import { getSupabaseServerClient } from '@/lib/supabase/server';
import { getSupabaseServiceRoleKey } from '@/lib/env';
import type { Database } from '@/types/supabase';

type RequestBody = {
  displayName: string;
  username: string;
  password: string;
  levelId: string;
};

export async function POST(request: Request) {
  const supabase = await getSupabaseServerClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  if (session.user.app_metadata?.role !== 'parent') {
    return NextResponse.json({ error: 'Only parents can add students' }, { status: 403 });
  }

  const body = (await request.json().catch(() => null)) as RequestBody | null;
  if (!body) {
    return NextResponse.json({ error: 'Invalid JSON payload' }, { status: 400 });
  }

  const displayName = body.displayName?.trim();
  const username = body.username?.trim();
  const password = body.password?.trim();
  const levelId = body.levelId?.trim();

  if (!displayName || !username || !password || !levelId) {
    return NextResponse.json({ error: 'All fields are required.' }, { status: 400 });
  }

  const serviceRoleKey = getSupabaseServiceRoleKey();
  if (!serviceRoleKey) {
    return NextResponse.json(
      { error: 'Service role key is not configured on the server.' },
      { status: 500 },
    );
  }

  const { url } = getSupabaseClientConfig();
  const adminClient = createClient<Database>(url, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });

  const email = `${username}@students.local`;

  const {
    data: { user },
    error: userError,
  } = await adminClient.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: {
      role: 'student',
      username,
      parent_id: session.user.id,
    },
  });

  if (userError || !user) {
    return NextResponse.json(
      { error: userError?.message ?? 'Unable to create student user.' },
      { status: 400 },
    );
  }

  const studentId = user.id;

  const studentPayload: Database['public']['Tables']['student']['Insert'] = {
    id: studentId,
    username,
    current_level_id: levelId,
  };

  const updates = await (adminClient as any)
    .from('student')
    .upsert(studentPayload)
    .select()
    .single();

  if (updates.error) {
    return NextResponse.json({ error: updates.error.message }, { status: 500 });
  }

  const linkPayload: Database['public']['Tables']['parent_student_link']['Insert'] = {
    parent_id: session.user.id,
    student_id: studentId,
  };

  const link = await (adminClient as any).from('parent_student_link').upsert(linkPayload);

  if (link.error) {
    return NextResponse.json({ error: link.error.message }, { status: 500 });
  }

  return NextResponse.json({
    studentId,
    username,
  });
}
