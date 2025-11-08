'use client';

import Link from 'next/link';
import { useState } from 'react';

export default function SignupPage() {
  const [formState, setFormState] = useState({
    email: '',
    password: '',
    householdName: '',
  });

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormState((prev) => ({ ...prev, [name]: value }));
  };

  const canSubmit = Object.values(formState).every(Boolean);

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

      <form className="grid gap-4 rounded-xl border border-slate-200 bg-white p-5 md:grid-cols-2">
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
            disabled={!canSubmit}
            type="button"
          >
            Create account (coming soon)
          </button>
          <p className="text-xs text-slate-500">
            Once Supabase confirms the account we&apos;ll guide you through adding
            students.
          </p>
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
