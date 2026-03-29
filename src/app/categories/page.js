import React from "react";
import Link from "next/link";

const categories = [
  { label: "Music", path: "/music" },
  { label: "Video", path: "/video" },
  { label: "Photos", path: "/" },
  { label: "Dashboard", path: "/dashboard" },
];

const Categories = () => {
  return (
    <div className="space-y-6">
      <header className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6">
        <h1 className="text-3xl font-semibold text-white">Categories</h1>
        <p className="mt-2 text-sm text-[var(--muted)]">
          Jump into the place that matches what you want to create or explore.
        </p>
      </header>

      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {categories.map((cat) => (
          <Link
            key={cat.path}
            href={cat.path}
            className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 transition hover:border-[var(--primary)] hover:bg-black/30"
          >
            <h2 className="text-xl font-semibold text-white">{cat.label}</h2>
            <p className="mt-1 text-sm text-[var(--muted)]">Go to {cat.label} section.</p>
          </Link>
        ))}
      </section>
    </div>
  );
};

export default Categories;
