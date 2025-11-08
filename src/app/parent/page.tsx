export default function ParentDashboardPlaceholder() {
  return (
    <div className="mx-auto flex max-w-3xl flex-col gap-10 px-4 py-16 sm:px-6">
      <header className="space-y-3">
        <p className="text-sm text-slate-500">Parent dashboard (preview)</p>
        <h1 className="text-3xl font-semibold text-slate-900">
          Track progress, nothing more
        </h1>
        <p className="text-sm leading-relaxed text-slate-600">
          This area keeps the surface area tiny—students, their current book, and the next
          checkpoint. We will plug it into Supabase once auth is ready.
        </p>
      </header>

      <section className="rounded-xl border border-slate-200 bg-white p-5 text-sm text-slate-700">
        <h2 className="text-base font-semibold text-slate-900">Planned tiles</h2>
        <ul className="mt-3 list-disc space-y-2 pl-5">
          <li>Household roster with quick reset + level controls.</li>
          <li>Book progress list sorted by checkpoint status.</li>
          <li>Simple feed of recent answers that need review.</li>
        </ul>
      </section>

      <section className="rounded-xl border border-slate-200 bg-white p-5 text-sm text-slate-700">
        <h2 className="text-base font-semibold text-slate-900">Design guardrails</h2>
        <p className="mt-2">
          No gradients, no gamification—just the data parents asked for during research.
          The full experience will keep this same tone so it feels as calm as a printed
          tracker.
        </p>
      </section>
    </div>
  );
}
