import Link from 'next/link';
import { notFound } from 'next/navigation';

import { getBookById, getCategories, getLevels, getUnitsForBook } from '@/lib/api/curriculum';

type BookPageProps = {
  params: Promise<{ bookId: string }>;
};

export default async function StudentBookDetailPage({ params }: BookPageProps) {
  const { bookId } = await params;
  const [book, units, levels, categories] = await Promise.all([
    getBookById(bookId),
    getUnitsForBook(bookId),
    getLevels(),
    getCategories(),
  ]);

  if (!book) {
    notFound();
  }

  const levelName = levels.find((level) => level.id === book.level_id)?.name ?? 'Unknown level';
  const categoryName =
    categories.find((category) => category.id === book.category_id)?.name ?? 'Unknown category';

  return (
    <div className="mx-auto flex max-w-3xl flex-col gap-8 px-4 py-12 sm:px-6">
      <header className="space-y-3 text-center">
        <p className="text-xs uppercase tracking-[0.25em] text-slate-400">Book</p>
        <h1 className="text-3xl font-semibold text-slate-900">{book.title}</h1>
        <p className="text-sm text-slate-600">
          {levelName} • {categoryName}
        </p>
      </header>

      <section className="rounded-xl border border-slate-200 bg-white p-5 text-sm text-slate-700">
        <h2 className="text-base font-semibold text-slate-900">Units</h2>
        <p className="mt-2">
          Work through each unit in order. After every five units, we&apos;ll prompt you to
          double-check any questions you missed before moving on.
        </p>
        <ul className="mt-4 grid grid-cols-2 gap-3 text-sm sm:grid-cols-3">
          {units.map((unit) => (
            <li key={unit.id}>
              <Link
                className="flex h-20 flex-col rounded-lg border border-slate-200 p-3 text-center text-slate-900 hover:border-slate-400"
                href={`/student/books/${bookId}/unit/${unit.unit_number}`}
              >
                <span className="text-xs uppercase tracking-[0.2em] text-slate-400">Unit</span>
                <span className="text-xl font-semibold">{unit.unit_number}</span>
                <span className="text-[10px] text-slate-500">Tap to answer</span>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <section className="rounded-xl border border-slate-200 bg-white p-5 text-sm text-slate-700">
        <h2 className="text-base font-semibold text-slate-900">Checkpoint reminder</h2>
        <p className="mt-2">
          When you finish five units, return to this book. We&apos;ll highlight the questions you
          still need to redo so you can stay on pace.
        </p>
      </section>
    </div>
  );
}
