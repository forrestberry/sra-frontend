import { NextResponse } from 'next/server';

import { getSupabaseServerClient } from '@/lib/supabase/server';
import type { Database } from '@/types/supabase';

type RequestPayload = {
  bookId: string;
  unitId: string;
  responses: Array<{
    questionId: string;
    responseText: string;
  }>;
};

export async function POST(request: Request) {
  const supabase = await getSupabaseServerClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  if (session.user.app_metadata?.role !== 'student') {
    return NextResponse.json(
      { error: 'Only students can submit answers right now.' },
      { status: 403 },
    );
  }

  let payload: RequestPayload;
  try {
    payload = (await request.json()) as RequestPayload;
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  if (!payload.unitId || !payload.bookId || !payload.responses?.length) {
    return NextResponse.json({ error: 'Missing unit or responses' }, { status: 400 });
  }

  const normalizedResponses = payload.responses
    .map((response) => ({
      questionId: response.questionId,
      responseText: response.responseText?.trim() ?? '',
    }))
    .filter((response) => response.responseText.length);

  if (!normalizedResponses.length) {
    return NextResponse.json({ error: 'No responses provided' }, { status: 400 });
  }

  const questionIds = normalizedResponses.map((response) => response.questionId);
  const { data: questionsData, error: questionsError } = await supabase
    .from('question')
    .select('id,answer_key,unit_id')
    .in('id', questionIds);

  if (questionsError) {
    return NextResponse.json({ error: questionsError.message }, { status: 500 });
  }

  const questions =
    (questionsData as Database['public']['Tables']['question']['Row'][] | null) ?? [];
  const questionLookup = new Map(questions.map((question) => [question.id, question]));

  const { data: attemptsData } = await supabase
    .from('answer')
    .select('question_id,attempt_number')
    .eq('student_id', session.user.id)
    .in('question_id', questionIds);

  const attempts =
    (attemptsData as Database['public']['Tables']['answer']['Row'][] | null) ?? [];
  const attemptLookup = new Map<string, number>();
  attempts.forEach((attempt) => {
    attemptLookup.set(
      attempt.question_id,
      Math.max(attemptLookup.get(attempt.question_id) ?? 0, attempt.attempt_number ?? 0),
    );
  });

  const rows: Database['public']['Tables']['answer']['Insert'][] = normalizedResponses.map(
    (response) => {
      const question = questionLookup.get(response.questionId);
      const correctAnswer = question?.answer_key ?? '';
      const normalize = (value: string) => value.trim().toLowerCase();
    const isCorrect =
      correctAnswer && response.responseText
        ? normalize(response.responseText) === normalize(correctAnswer)
        : null;

      return {
        student_id: session.user.id,
        question_id: response.questionId,
        response_text: response.responseText,
        attempt_number: (attemptLookup.get(response.questionId) ?? 0) + 1,
        is_correct: isCorrect,
        submitted_at: new Date().toISOString(),
      };
    },
  );

  const { error: insertError } = await supabase.from('answer').insert(rows);
  if (insertError) {
    return NextResponse.json({ error: insertError.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
