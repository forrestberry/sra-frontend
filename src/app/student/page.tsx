export default function StudentWorkspacePlaceholder() {
  return (
    <div className="mx-auto flex max-w-3xl flex-col gap-8 px-4 py-16 sm:px-6">
      <header className="space-y-3 text-center">
        <p className="text-sm text-slate-500">Student workspace (preview)</p>
        <h1 className="text-3xl font-semibold text-slate-900">Open, answer, move on</h1>
        <p className="text-sm text-slate-600">
          The finished page will show a single book at a time, one unit at a time. No
          pop-ups, just the prompt and a response box.
        </p>
      </header>

      <section className="rounded-xl border border-slate-200 bg-white p-6 text-left text-sm text-slate-700">
        <h2 className="text-base font-semibold text-slate-900">Loop</h2>
        <ol className="mt-3 list-decimal space-y-2 pl-5">
          <li>Pick the book assigned by your parent.</li>
          <li>Answer the next unit. We surface only what is needed now.</li>
          <li>After five units, quietly review anything missed.</li>
        </ol>
        <p className="mt-4 text-xs uppercase tracking-[0.2em] text-slate-400">
          Designed to feel like pencil + paper.
        </p>
      </section>
    </div>
  );
}
