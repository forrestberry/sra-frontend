import Link from 'next/link';

import {
  APP_DESCRIPTION,
  APP_NAME,
  MARKETING_CONTENT,
  MARKETING_HIGHLIGHTS,
  ROLE_PATHS,
} from '@/lib/utils/app-info';

export default function LandingPage() {
  return (
    <div className="mx-auto flex max-w-4xl flex-col gap-12 px-4 py-16 sm:px-6 lg:px-0">
      <header className="space-y-5 text-balance">
        <p className="text-sm font-medium text-slate-500">
          {MARKETING_CONTENT.hero.kicker}
        </p>
        <h1 className="text-4xl font-semibold tracking-tight text-slate-900 sm:text-[44px]">
          {MARKETING_CONTENT.hero.headline}
        </h1>
        <p className="text-base leading-relaxed text-slate-600">{APP_DESCRIPTION}</p>
        <div className="flex flex-col gap-3 sm:flex-row">
          <Link
            className="inline-flex items-center justify-center rounded-full border border-slate-300 px-5 py-2 text-sm font-medium text-slate-900 hover:bg-white"
            href="/signup"
          >
            Create parent account
          </Link>
          <Link
            className="inline-flex items-center justify-center rounded-full border border-slate-300 px-5 py-2 text-sm font-medium text-slate-900 hover:bg-white"
            href={ROLE_PATHS.student}
          >
            Student workspace preview
          </Link>
        </div>
      </header>

      <section className="grid gap-3 sm:grid-cols-3">
        {MARKETING_HIGHLIGHTS.map((highlight) => (
          <article
            key={highlight.title}
            className="rounded-xl border border-slate-200 bg-white p-4 text-sm leading-relaxed text-slate-700"
          >
            <h3 className="text-base font-semibold text-slate-900">{highlight.title}</h3>
            <p className="mt-2 text-sm">{highlight.description}</p>
          </article>
        ))}
      </section>

      <section className="rounded-xl border border-slate-200 bg-white p-6 text-sm text-slate-700">
        <h2 className="text-xl font-semibold text-slate-900">Why it stays simple</h2>
        <p className="mt-3">
          {APP_NAME} borrows from classroom worksheets—clean typography, calm colors, and
          a single focus at a time. Kids land on their next task without confetti or side
          quests, while parents can glance at progress without digging through menus.
        </p>
        <ul className="mt-4 list-disc space-y-1 pl-6">
          <li>Minimal palette keeps attention on the prompt.</li>
          <li>Short labels and predictable layout reduce friction.</li>
          <li>All flows keep copy concise so even younger readers stay oriented.</li>
        </ul>
      </section>
    </div>
  );
}
