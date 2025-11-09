import Link from 'next/link';
import { redirect } from 'next/navigation';

import { CreateStudentForm } from '@/components/parent/CreateStudentForm';
import { getLevels } from '@/lib/api/curriculum';
import { getParentStudents } from '@/lib/api/parent';
import { getSupabaseServerClient } from '@/lib/supabase/server';

export default async function ParentDashboard() {
  const supabase = await getSupabaseServerClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session?.user) {
    return redirect('/login');
  }

  if (session.user.app_metadata?.role !== 'parent') {
    return redirect('/');
  }

  const parentId = session.user.id;
  const [students, levels] = await Promise.all([
    getParentStudents(parentId),
    getLevels(),
  ]);

  const levelLookup = new Map(levels.map((level) => [level.id, level.name]));

  return (
    <div className="mx-auto flex max-w-4xl flex-col gap-8 px-4 py-16 sm:px-6">
      <header className="space-y-3">
        <p className="text-sm text-slate-500">Parent dashboard</p>
        <h1 className="text-3xl font-semibold text-slate-900">Manage readers with confidence</h1>
        <p className="text-sm text-slate-600">
          Create student accounts, assign them a level, and keep an eye on their next checkpoint.
        </p>
      </header>

      <section className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <article className="rounded-xl border border-slate-200 bg-white p-5">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-semibold text-slate-900">Students</h2>
            <Link className="text-xs font-semibold text-slate-900 underline" href="/curriculum">
              View curriculum
            </Link>
          </div>

          {students.length === 0 ? (
            <p className="mt-4 text-sm text-slate-600">No students yet. Add one on the right.</p>
          ) : (
            <ul className="mt-4 divide-y divide-slate-100">
              {students.map((student) => (
                <li key={student.id} className="flex flex-col gap-1 py-4 sm:flex-row sm:items-center">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-slate-900">{student.username}</p>
                    <p className="text-xs text-slate-500">
                      Level:{' '}
                      {student.current_level_id
                        ? levelLookup.get(student.current_level_id) ?? 'Unknown'
                        : 'Not set yet'}
                    </p>
                  </div>
                  <Link
                    className="text-xs font-semibold text-slate-900 underline"
                    href="/student/books"
                  >
                    Practice view
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </article>

        <CreateStudentForm levels={levels} />
      </section>

      <section className="rounded-xl border border-slate-200 bg-white p-5 text-sm text-slate-700">
        <h2 className="text-base font-semibold text-slate-900">What&apos;s next?</h2>
        <ul className="mt-3 list-disc space-y-2 pl-5">
          <li>Assign a book per student so the workspace opens to the right spot.</li>
          <li>Track units completed and flag checkpoints every five units.</li>
          <li>Surface incorrect answers that need review before moving on.</li>
        </ul>
      </section>
    </div>
  );
}
