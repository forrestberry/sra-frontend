import { notFound } from 'next/navigation';

import { StudentUnitRunner } from '@/components/student/StudentUnitRunner';
import { getBookById, getQuestionsForUnit, getUnitByBookAndNumber } from '@/lib/api/curriculum';
import { getSupabaseServerClient } from '@/lib/supabase/server';
import type { Database } from '@/types/supabase';

type StudentUnitPageProps = {
  params: Promise<{
    bookId: string;
    unitNumber: string;
  }>;
};

export default async function StudentUnitPage({ params }: StudentUnitPageProps) {
  const { bookId, unitNumber } = await params;
  const [book, unit] = await Promise.all([
    getBookById(bookId).catch(() => null),
    getUnitByBookAndNumber(bookId, Number(unitNumber)).catch(() => null),
  ]);

  if (!book || !unit) {
    notFound();
  }

  const questions = await getQuestionsForUnit(unit.id);
  const supabase = await getSupabaseServerClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();
  let existingAnswers: Record<string, { response_text: string; is_correct: boolean | null }> = {};

  if (session?.user && questions.length) {
    const { data } = await supabase
      .from('answer')
      .select('question_id,response_text,is_correct')
      .eq('student_id', session.user.id)
      .in(
        'question_id',
        questions.map((question) => question.id),
      );

    if (data) {
      existingAnswers = (data as Database['public']['Tables']['answer']['Row'][]).reduce<
        Record<string, { response_text: string; is_correct: boolean | null }>
      >(
        (acc, row) => {
          acc[row.question_id] = {
            response_text: row.response_text ?? '',
            is_correct: row.is_correct,
          };
          return acc;
        },
        {},
      );
    }
  }

  return (
    <div className="mx-auto flex max-w-3xl flex-col gap-6 px-4 py-12 sm:px-6">
      <StudentUnitRunner
        bookId={book.id}
        unitId={unit.id}
        unitNumber={unit.unit_number}
        questions={questions.map((question) => ({
          id: question.id,
          question_number: question.question_number,
        }))}
        existingAnswers={existingAnswers}
      />
    </div>
  );
}
