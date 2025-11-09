'use client';

import Link from 'next/link';
import { useState } from 'react';

import { useSupabaseClient } from '@/lib/supabase/provider';

export default function SignupPage() {
  const [formState, setFormState] = useState({
    email: '',
    password: '',
    householdName: '',
  });
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>(
    'idle',
  );
  const [message, setMessage] = useState<string | null>(null);
  const supabase = useSupabaseClient();

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormState((prev) => ({ ...prev, [name]: value }));
  };

  const canSubmit = Object.values(formState).every(Boolean);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatus('submitting');
    setMessage(null);

    const {
      data: { user },
      error,
    } = await supabase.auth.signUp({
      email: formState.email,
      password: formState.password,
      options: {
        emailRedirectTo:
          typeof window !== 'undefined' ? `${window.location.origin}/login` : undefined,
        data: {
          role: 'parent',
          household_name: formState.householdName,
        },
      },
    });

    if (error) {
      setStatus('error');
      setMessage(error.message);
      return;
    }

    setStatus('success');
    setMessage(
      user?.email
        ? `We sent a confirmation link to ${user.email}. Finish signup there, then come back to log in.`
        : 'Check your email for a confirmation link, then come back to sign in.',
    );
  };

  return (
    <div className="mx-auto flex max-w-2xl flex-col gap-6 px-4 py-16 sm:px-6">
      <div className="space-y-2 text-center">
        <p className="text-sm text-slate-500">Create a parent account</p>
        <h1 className="text-3xl font-semibold text-slate-900">
          Stay light, start quickly
        </h1>
        <p className="text-sm text-slate-600">
          We only ask for what we need to link students. Everything else can wait.
        </p>
      </div>

      <form
        className="grid gap-4 rounded-xl border border-slate-200 bg-white p-5 md:grid-cols-2"
        onSubmit={handleSubmit}
      >
        <label className="text-sm font-medium text-slate-700">
          Household name
          <input
            className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-base"
            name="householdName"
            onChange={handleChange}
            placeholder="Berry family"
            value={formState.householdName}
          />
        </label>

        <label className="text-sm font-medium text-slate-700">
          Email
          <input
            className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-base"
            name="email"
            onChange={handleChange}
            placeholder="you@example.com"
            type="email"
            value={formState.email}
          />
        </label>

        <label className="text-sm font-medium text-slate-700">
          Password
          <input
            className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-base"
            name="password"
            onChange={handleChange}
            placeholder="••••••••"
            type="password"
            value={formState.password}
          />
        </label>

        <div className="flex flex-col justify-end gap-3">
          <button
            className="rounded-md border border-slate-400 px-4 py-2 text-sm font-medium text-slate-900 disabled:border-slate-200 disabled:text-slate-400"
            disabled={!canSubmit || status === 'submitting'}
            type="submit"
          >
            {status === 'submitting' ? 'Creating…' : 'Create account'}
          </button>
          <p className="text-xs text-slate-500">
            Once Supabase confirms the account we&apos;ll guide you through adding
            students.
          </p>
          {message ? (
            <p
              className={`text-sm ${status === 'error' ? 'text-rose-600' : 'text-slate-600'}`}
            >
              {message}
            </p>
          ) : null}
        </div>
      </form>

      <p className="text-center text-sm text-slate-600">
        Already registered?{' '}
        <Link className="font-semibold text-slate-900 underline" href="/login">
          Sign in
        </Link>
      </p>
    </div>
  );
}
