import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { POSTS, POST_CATEGORIES, toFa } from "@/lib/data";

export const Route = createFileRoute("/blog/")({
  component: BlogIndex,
  head: () => ({
    meta: [
      { title: "مجله علمی رساله | آموزش پایان‌نامه، روش تحقیق و مقاله نویسی" },
      {
        name: "description",
        content:
          "مقالات آموزشی درباره انجام پایان‌نامه، مشاوره پایان‌نامه، هزینه پایان‌نامه، نوشتن مقاله علمی و تحلیل آماری در مجله علمی رساله.",
      },
      { property: "og:title", content: "مجله علمی رساله" },
      { property: "og:description", content: "راهنماهای کاربردی پژوهش دانشگاهی." },
      { property: "og:url", content: "/blog" },
    ],
    links: [{ rel: "canonical", href: "/blog" }],
  }),
});

function BlogIndex() {
  const [cat, setCat] = useState("all");
  const posts = cat === "all" ? POSTS : POSTS.filter((p) => p.category === cat);

  return (
    <>
      <section className="border-b border-border bg-surface py-12">
        <div className="container-page">
          <h1 className="text-3xl font-black">مجله علمی رساله</h1>
          <p className="mt-3 max-w-2xl text-muted-foreground">
            راهنماهای کاربردی درباره روش تحقیق، نگارش پایان‌نامه، مقاله علمی و تحلیل آماری.
          </p>
        </div>
      </section>

      <div className="container-page py-12">
        <div className="flex flex-wrap gap-2">
          {["all", ...POST_CATEGORIES].map((c) => (
            <button
              key={c}
              onClick={() => setCat(c)}
              className={`rounded-full border px-4 py-1.5 text-sm transition-colors ${
                cat === c ? "border-primary bg-primary text-primary-foreground" : "border-border bg-card hover:bg-secondary"
              }`}
            >
              {c === "all" ? "همه" : c}
            </button>
          ))}
        </div>

        <div className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {posts.map((p) => (
            <Link
              key={p.slug}
              to="/blog/$slug"
              params={{ slug: p.slug }}
              className="flex flex-col rounded-2xl border border-border bg-card p-6 transition-all hover:-translate-y-1 hover:shadow-[var(--shadow-lift)]"
            >
              <span className="text-xs font-bold text-primary">{p.category}</span>
              <h2 className="mt-2 font-bold leading-7">{p.title}</h2>
              <p className="mt-2 flex-1 text-sm leading-7 text-muted-foreground">{p.excerpt}</p>
              <span className="mt-4 text-xs text-muted-foreground">{p.date} • {toFa(p.readingTime)} دقیقه مطالعه</span>
            </Link>
          ))}
        </div>
      </div>
    </>
  );
}
