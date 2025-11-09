import Link from 'next/link';

import { getBooks, getCategories, getLevels } from '@/lib/api/curriculum';

export default async function StudentBooksPage() {
  const [books, levels, categories] = await Promise.all([
    getBooks(),
    getLevels(),
    getCategories(),
  ]);

  const levelLookup = new Map(levels.map((level) => [level.id, level.name]));
  const categoryLookup = new Map(categories.map((category) => [category.id, category.name]));

  return (
    <div className="mx-auto flex max-w-4xl flex-col gap-8 px-4 py-12 sm:px-6">
      <header className="space-y-1 text-center">
        <p className="text-sm text-slate-500">Student workspace</p>
        <h1 className="text-3xl font-semibold text-slate-900">Pick a book to get started</h1>
        <p className="text-sm text-slate-600">
          Choose the SRA book you&apos;re working on in class, then complete units in order. We&apos;ll
          prompt you to review missed questions after every five units.
        </p>
      </header>

      <section className="rounded-xl border border-slate-200 bg-white p-5 text-sm text-slate-700">
        <h2 className="text-base font-semibold text-slate-900">All books</h2>
        <ul className="mt-4 divide-y divide-slate-100">
          {books.map((book) => (
            <li key={book.id} className="flex flex-col gap-1 py-3 sm:flex-row sm:items-center">
              <div className="flex-1">
                <p className="font-medium text-slate-900">{book.title}</p>
                <p className="text-xs uppercase tracking-[0.2em] text-slate-400">
                  {levelLookup.get(book.level_id)} • {categoryLookup.get(book.category_id)}
                </p>
              </div>
              <Link
                className="text-xs font-semibold text-slate-900 underline underline-offset-2"
                href={`/student/books/${book.id}`}
              >
                View units
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
