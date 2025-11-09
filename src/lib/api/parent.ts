import { cache } from 'react';

import { getSupabaseServerClient } from '@/lib/supabase/server';
import type { Database } from '@/types/supabase';

export type ParentStudent = {
  id: string;
  username: string;
  current_level_id: string | null;
};

type ParentStudentQuery =
  | {
      student: Pick<
        Database['public']['Tables']['student']['Row'],
        'id' | 'username' | 'current_level_id'
      > | null;
    }[]
  | null;

export const getParentStudents = cache(async (parentId: string): Promise<ParentStudent[]> => {
  const supabase = await getSupabaseServerClient();
  const { data, error } = await supabase
    .from('parent_student_link')
    .select('student:student_id(id,username,current_level_id)')
    .eq('parent_id', parentId);

  if (error) {
    throw error;
  }

  const rows = data as unknown as ParentStudentQuery;
  return (
    rows?.map((row) => ({
      id: row.student?.id ?? '',
      username: row.student?.username ?? 'Unknown',
      current_level_id: row.student?.current_level_id ?? null,
    })) ?? []
  ).filter((student) => Boolean(student.id));
});
