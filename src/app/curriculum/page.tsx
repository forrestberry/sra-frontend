import Link from 'next/link';

import {
  getBooks,
  getCategories,
  getLevels,
  type Book,
  type Category,
  type Level,
} from '@/lib/api/curriculum';

type CategoryBucket = Category & {
  books: Book[];
};

type LevelBucket = Level & {
  categories: CategoryBucket[];
};

function bucketize(levels: Level[], categories: Category[], books: Book[]): LevelBucket[] {
  const levelMap = new Map<string, LevelBucket>();
  levels.forEach((level) => {
    levelMap.set(level.id, {
      ...level,
      categories: [],
    });
  });

  const categoryMap = new Map<string, CategoryBucket>();
  categories.forEach((category) => {
    categoryMap.set(category.id, {
      ...category,
      books: [],
    });
  });

  books.forEach((book) => {
    const category = categoryMap.get(book.category_id);
    if (category) {
      category.books.push(book);
    }
  });

  levelMap.forEach((levelBucket) => {
    levelBucket.categories = categories
      .filter((category) => categoryMap.get(category.id)?.books.length)
      .map((category) => categoryMap.get(category.id)!)
      .filter((bucket) => bucket.books.some((book) => book.level_id === levelBucket.id))
      .map((bucket) => ({
        ...bucket,
        books: bucket.books.filter((book) => book.level_id === levelBucket.id),
      }));
  });

  return Array.from(levelMap.values());
}

export default async function CurriculumPage() {
  const [levels, categories, books] = await Promise.all([
    getLevels(),
    getCategories(),
    getBooks(),
  ]);

  const buckets = bucketize(levels, categories, books);

  return (
    <div className="mx-auto flex max-w-5xl flex-col gap-10 px-4 py-16 sm:px-6">
      <header className="space-y-3">
        <p className="text-sm text-slate-500">Curriculum browser</p>
        <h1 className="text-3xl font-semibold text-slate-900">Every SRA book in one place</h1>
        <p className="text-sm text-slate-600">
          Filter by level, drill into categories, and jump straight into a book to see its units.
        </p>
      </header>

      <div className="space-y-8">
        {buckets.map((level) => (
          <section key={level.id} className="space-y-4">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Level</p>
              <h2 className="text-2xl font-semibold text-slate-900">{level.name}</h2>
            </div>
            <div className="grid gap-4 rounded-xl border border-slate-200 bg-white p-4 md:grid-cols-2">
              {level.categories.length === 0 ? (
                <p className="text-sm text-slate-500">No categories yet.</p>
              ) : (
                level.categories.map((category) => (
                  <article key={category.id} className="space-y-2">
                    <h3 className="text-base font-semibold text-slate-900">{category.name}</h3>
                    <ul className="space-y-1 text-sm text-slate-600">
                      {category.books.map((book) => (
                        <li key={book.id} className="flex items-center justify-between">
                          <span>{book.title}</span>
                          <Link
                            className="text-xs font-medium text-slate-500 underline"
                            href={`/student/books/${book.id}`}
                          >
                            View units
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </article>
                ))
              )}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
