import { createFileRoute, notFound, Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { POSTS, toFa, type Post } from "@/lib/data";

export const Route = createFileRoute("/blog/$slug")({
  loader: ({ params }): { post: Post } => {
    const post = POSTS.find((p) => p.slug === params.slug);
    if (!post) throw notFound();
    return { post };
  },
  head: ({ loaderData, params }) => {
    const post = loaderData?.post;
    const title = post ? `${post.title} | مجله علمی رساله` : "مقاله | رساله";
    const description = post?.excerpt ?? "مقاله آموزشی مجله علمی رساله";
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        { property: "og:type", content: "article" },
        { property: "og:url", content: `/blog/${params.slug}` },
      ],
      links: [{ rel: "canonical", href: `/blog/${params.slug}` }],
      scripts: post
        ? [
            {
              type: "application/ld+json",
              children: JSON.stringify({
                "@context": "https://schema.org",
                "@type": "Article",
                headline: post.title,
                description: post.excerpt,
                articleSection: post.category,
                inLanguage: "fa-IR",
                publisher: { "@type": "Organization", name: "رساله" },
              }),
            },
          ]
        : [],
    };
  },
  component: PostPage,
});

function PostPage() {
  const { post } = Route.useLoaderData();
  const related = POSTS.filter((p) => p.slug !== post.slug && p.category === post.category).slice(0, 2);

  return (
    <article className="container-page max-w-3xl py-12">
      <span className="text-xs font-bold text-primary">{post.category}</span>
      <h1 className="mt-3 text-3xl font-black leading-[1.5]">{post.title}</h1>
      <p className="mt-3 text-sm text-muted-foreground">
        {post.date} • {toFa(post.readingTime)} دقیقه مطالعه
      </p>

      <div className="mt-8 space-y-5 text-base leading-9 text-foreground/90">
        {post.body.map((para: string, i: number) => <p key={i}>{para}</p>)}
      </div>

      <div className="mt-10 rounded-2xl border border-border bg-surface p-6">
        <h2 className="font-bold">نیاز به راهنمایی تخصصی دارید؟</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          درخواست خود را ثبت کنید تا پژوهشگران هم‌رشته پیشنهاد خود را ارسال کنند.
        </p>
        <Button asChild className="mt-4"><Link to="/request">ثبت درخواست</Link></Button>
      </div>

      {related.length > 0 && (
        <section className="mt-12">
          <h2 className="font-bold">مطالب مرتبط</h2>
          <ul className="mt-4 space-y-3">
            {related.map((p) => (
              <li key={p.slug}>
                <Link to="/blog/$slug" params={{ slug: p.slug }} className="text-primary hover:underline">
                  {p.title}
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}
    </article>
  );
}
