'use client';

import { useRouter } from 'next/navigation';
import { useState, useTransition } from 'react';

import type { Level } from '@/lib/api/curriculum';

type Props = {
  levels: Level[];
};

function generatePassword() {
  return Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-4);
}

export function CreateStudentForm({ levels }: Props) {
  const router = useRouter();
  const [formState, setFormState] = useState({
    displayName: '',
    username: '',
    password: generatePassword(),
    levelId: levels[0]?.id ?? '',
  });
  const [status, setStatus] = useState<'idle' | 'submitting' | 'error' | 'success'>('idle');
  const [message, setMessage] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const canSubmit =
    formState.displayName.trim().length > 1 &&
    formState.username.trim().length > 2 &&
    formState.password.trim().length > 3 &&
    Boolean(formState.levelId);

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = event.target;
    setFormState((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!canSubmit || status === 'submitting') {
      return;
    }

    setStatus('submitting');
    setMessage(null);

    const response = await fetch('/api/parent/students', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formState),
    });

    if (!response.ok) {
      const payload = await response.json().catch(() => ({}));
      setStatus('error');
      setMessage(payload?.error ?? 'Unable to create student right now.');
      return;
    }

    setStatus('success');
    setMessage('Student created. Share the username/password so they can sign in.');
    startTransition(() => router.refresh());
  };

  return (
    <form className="space-y-3 rounded-xl border border-slate-200 bg-white p-5" onSubmit={handleSubmit}>
      <div className="space-y-1">
        <h2 className="text-base font-semibold text-slate-900">Add a student</h2>
        <p className="text-sm text-slate-600">You can change credentials later if needed.</p>
      </div>

      <label className="block text-sm font-medium text-slate-700">
        Display name
        <input
          className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-base"
          name="displayName"
          value={formState.displayName}
          onChange={handleChange}
          placeholder="Jordan"
        />
      </label>

      <label className="block text-sm font-medium text-slate-700">
        Username
        <input
          className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-base"
          name="username"
          value={formState.username}
          onChange={handleChange}
          placeholder="jordan_reader"
        />
      </label>

      <label className="block text-sm font-medium text-slate-700">
        Password
        <input
          className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-base"
          name="password"
          type="text"
          value={formState.password}
          onChange={handleChange}
        />
      </label>

      <label className="block text-sm font-medium text-slate-700">
        Current level
        <select
          className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-base"
          name="levelId"
          value={formState.levelId}
          onChange={handleChange}
        >
          {levels.map((level) => (
            <option key={level.id} value={level.id}>
              {level.name}
            </option>
          ))}
        </select>
      </label>

      <button
        className="w-full rounded-md border border-slate-400 px-4 py-2 text-sm font-medium text-slate-900 disabled:border-slate-200 disabled:text-slate-400"
        disabled={!canSubmit || status === 'submitting' || isPending}
        type="submit"
      >
        {status === 'submitting' ? 'Creating…' : 'Add student'}
      </button>

      {message ? (
        <p className={`text-sm ${status === 'error' ? 'text-rose-600' : 'text-slate-600'}`}>
          {message}
        </p>
      ) : null}
    </form>
  );
}
