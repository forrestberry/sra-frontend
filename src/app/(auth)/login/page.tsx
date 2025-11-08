'use client';

import Link from 'next/link';
import { useState } from 'react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  return (
    <div className="mx-auto flex max-w-md flex-col gap-6 px-4 py-16 sm:px-6">
      <div className="space-y-2 text-center">
        <p className="text-sm text-slate-500">Parent sign in</p>
        <h1 className="text-3xl font-semibold text-slate-900">Welcome back</h1>
        <p className="text-sm text-slate-600">
          Enter the same email + password you used during setup. Nothing extra on this
          screen.
        </p>
      </div>

      <form className="space-y-4 rounded-xl border border-slate-200 bg-white p-5">
        <label className="block text-left text-sm font-medium text-slate-700">
          Email
          <input
            className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-base"
            name="email"
            onChange={(event) => setEmail(event.target.value)}
            placeholder="you@example.com"
            type="email"
            value={email}
          />
        </label>

        <label className="block text-left text-sm font-medium text-slate-700">
          Password
          <input
            className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-base"
            name="password"
            onChange={(event) => setPassword(event.target.value)}
            placeholder="••••••••"
            type="password"
            value={password}
          />
        </label>

        <button
          className="w-full rounded-md border border-slate-400 px-4 py-2 text-sm font-medium text-slate-900 disabled:border-slate-200 disabled:text-slate-400"
          disabled={!email || !password}
          type="button"
        >
          Continue (coming soon)
        </button>
      </form>

      <p className="text-center text-sm text-slate-600">
        Need an account?{' '}
        <Link className="font-semibold text-slate-900 underline" href="/signup">
          Create one
        </Link>
      </p>
    </div>
  );
}
