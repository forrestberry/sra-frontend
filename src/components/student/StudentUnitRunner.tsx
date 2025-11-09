'use client';

import { useRouter } from 'next/navigation';
import { useState, useTransition } from 'react';

type QuestionView = {
  id: string;
  question_number: number;
};

type ExistingAnswer = {
  response_text: string;
  is_correct: boolean | null;
};

type Props = {
  bookId: string;
  unitId: string;
  unitNumber: number;
  questions: QuestionView[];
  existingAnswers: Record<string, ExistingAnswer | undefined>;
};

export function StudentUnitRunner({
  bookId,
  unitId,
  unitNumber,
  questions,
  existingAnswers,
}: Props) {
  const [responses, setResponses] = useState<Record<string, string>>(() => {
    const initial: Record<string, string> = {};
    Object.entries(existingAnswers).forEach(([questionId, answer]) => {
      if (answer) {
        initial[questionId] = answer.response_text;
      }
    });
    return initial;
  });
  const [status, setStatus] = useState<'idle' | 'saving' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const allAnswered = questions.every((question) => (responses[question.id] ?? '').trim().length);

  const handleChange = (questionId: string, value: string) => {
    setResponses((prev) => ({ ...prev, [questionId]: value }));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!allAnswered || status === 'saving') return;

    setStatus('saving');
    setMessage(null);

    const payload = {
      bookId,
      unitId,
      responses: questions.map((question) => ({
        questionId: question.id,
        responseText: (responses[question.id] ?? '').trim(),
      })),
    };

    const response = await fetch('/api/student/answers', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      setStatus('error');
      setMessage('Unable to save answers. Please try again.');
      return;
    }

    setStatus('success');
    setMessage('Answers saved. Keep working through the next unit.');
    startTransition(() => router.refresh());
  };

  return (
    <form className="space-y-6 rounded-xl border border-slate-200 bg-white p-5" onSubmit={handleSubmit}>
      <div className="space-y-1">
        <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Unit</p>
        <h2 className="text-2xl font-semibold text-slate-900">{unitNumber}</h2>
        <p className="text-sm text-slate-600">
          Enter the answer you wrote in your book. We&apos;ll keep it quiet until it&apos;s time to review.
        </p>
      </div>

      <div className="space-y-4">
        {questions.map((question) => {
          const previous = existingAnswers[question.id];
          const hasSubmitted = Boolean(previous);
          return (
            <label key={question.id} className="block space-y-2 rounded-lg border border-slate-100 p-3">
              <span className="text-sm font-medium text-slate-900">
                Question {question.question_number}
              </span>
              <input
                className="w-full rounded-md border border-slate-300 px-3 py-2 text-base"
                type="text"
                value={responses[question.id] ?? ''}
                onChange={(event) => handleChange(question.id, event.target.value)}
                placeholder="Type your answer"
              />
              {hasSubmitted ? (
                <p className="text-xs text-slate-500">
                  Submitted {previous?.is_correct === false ? '(needs review)' : '(saved)'}
                </p>
              ) : null}
            </label>
          );
        })}
      </div>

      <div className="space-y-2 text-sm text-slate-600">
        <p>No instant feedback—focus on the work. After every five units, we&apos;ll surface anything that needs another pass.</p>
      </div>

      <button
        className="w-full rounded-md border border-slate-400 px-4 py-2 text-sm font-medium text-slate-900 disabled:border-slate-200 disabled:text-slate-400"
        type="submit"
        disabled={!allAnswered || status === 'saving' || isPending}
      >
        {status === 'saving' || isPending ? 'Saving…' : 'Save answers'}
      </button>

      {message ? (
        <p className={`text-sm ${status === 'error' ? 'text-rose-600' : 'text-slate-600'}`}>{message}</p>
      ) : null}
    </form>
  );
}
