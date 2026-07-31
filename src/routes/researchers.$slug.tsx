import { createFileRoute, notFound, Link } from "@tanstack/react-router";
import { Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useConsult } from "@/components/site/ConsultProvider";
import { RESEARCHERS, SERVICES, fieldName, toFa, type Researcher } from "@/lib/data";

export const Route = createFileRoute("/researchers/$slug")({
  loader: ({ params }): { researcher: Researcher } => {
    const researcher = RESEARCHERS.find((r) => r.slug === params.slug);
    if (!researcher) throw notFound();
    return { researcher };
  },
  head: ({ loaderData, params }) => {
    const r = loaderData?.researcher;
    const title = r ? `${r.name} | ${r.major} — پژوهشگر رساله` : "پروفایل پژوهشگر | رساله";
    const description = r
      ? `${r.name}، ${r.degree} ${r.major} از ${r.university} با ${r.experience} سال سابقه و ${r.projects} پروژه پژوهشی. رزرو مشاوره و ارسال درخواست پروژه.`
      : "پروفایل پژوهشگر در بازارگاه رساله";
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        { property: "og:type", content: "profile" },
        { property: "og:url", content: `/researchers/${params.slug}` },
      ],
      links: [{ rel: "canonical", href: `/researchers/${params.slug}` }],
      scripts: r
        ? [
            {
              type: "application/ld+json",
              children: JSON.stringify({
                "@context": "https://schema.org",
                "@type": "Person",
                name: r.name,
                jobTitle: `پژوهشگر ${r.major}`,
                affiliation: r.university,
                knowsAbout: r.specialties,
              }),
            },
          ]
        : [],
    };
  },
  component: ProfilePage,
});

function ProfilePage() {
  const { researcher: r } = Route.useLoaderData();
  const consult = useConsult();

  return (
    <>
      <section className="bg-[image:var(--gradient-hero)] py-12 text-ink-foreground">
        <div className="container-page grid gap-6 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center">
          <div className="flex min-w-0 flex-wrap items-center gap-5">
            <span className="grid size-24 shrink-0 place-items-center rounded-3xl bg-white/10 text-3xl font-black">
              {r.avatarSeed}
            </span>
            <div className="min-w-0">
              <h1 className="text-2xl font-black sm:text-3xl">{r.name}</h1>
              <p className="mt-2 text-ink-foreground/80">
                {r.degree} {r.major} • {r.university}
              </p>
              <p className="mt-2 flex items-center gap-2 text-sm">
                <Star className="size-4 fill-gold text-gold" />
                <b>{r.rating.toLocaleString("fa-IR")}</b>
                <span className="text-ink-foreground/70">
                  از {toFa(r.reviews)} نظر • {toFa(r.projects)} پروژه تکمیل‌شده
                </span>
              </p>
            </div>
          </div>
          <div className="flex flex-wrap gap-3">
            <Button size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90" onClick={consult.open}>
              درخواست مشاوره
            </Button>
            <Button asChild size="lg" variant="outline" className="border-white/30 bg-transparent text-ink-foreground hover:bg-white/10 hover:text-ink-foreground">
              <Link to="/request">ارسال درخواست پروژه</Link>
            </Button>
          </div>
        </div>
      </section>

      <div className="container-page grid gap-8 py-12 lg:grid-cols-[minmax(0,1fr)_320px]">
        <div className="space-y-8">
          <section className="rounded-2xl border border-border bg-card p-6">
            <h2 className="text-lg font-bold">درباره پژوهشگر</h2>
            <p className="mt-3 leading-8 text-muted-foreground">{r.bio}</p>
          </section>

          <section className="rounded-2xl border border-border bg-card p-6">
            <h2 className="text-lg font-bold">تخصص‌ها و حوزه‌های پژوهشی</h2>
            <div className="mt-4 flex flex-wrap gap-2">
              {[fieldName(r.fieldSlug), ...r.specialties].map((s) => (
                <span key={s} className="rounded-full bg-secondary px-3 py-1.5 text-sm text-secondary-foreground">{s}</span>
              ))}
            </div>
          </section>

          <section className="rounded-2xl border border-border bg-card p-6">
            <h2 className="text-lg font-bold">انتشارات علمی</h2>
            <ul className="mt-4 space-y-3 text-sm leading-7 text-muted-foreground">
              {r.publications.map((p: string) => <li key={p} className="border-r-2 border-primary pr-3">{p}</li>)}
            </ul>
          </section>

          <section className="rounded-2xl border border-border bg-card p-6">
            <h2 className="text-lg font-bold">نمونه‌کارها و پروژه‌های پیشین</h2>
            <ul className="mt-4 grid gap-3 sm:grid-cols-2">
              {r.portfolio.map((p: { title: string; year: number }) => (
                <li key={p.title} className="rounded-xl bg-secondary p-4 text-sm">
                  <span className="block font-semibold">{p.title}</span>
                  <span className="mt-1 block text-xs text-muted-foreground">سال {toFa(p.year)}</span>
                </li>
              ))}
            </ul>
          </section>
        </div>

        <aside className="h-max space-y-6">
          <div className="rounded-2xl border border-border bg-card p-6 shadow-[var(--shadow-card)]">
            <h2 className="font-bold">تعرفه همکاری</h2>
            <p className="mt-4 text-sm text-muted-foreground">مشاوره ساعتی</p>
            <p className="text-xl font-black">{toFa(r.hourlyPrice)} <span className="text-sm font-medium">تومان</span></p>
            <p className="mt-4 text-sm text-muted-foreground">برآورد پروژه کامل</p>
            <p className="text-xl font-black">
              {toFa(r.hourlyPrice * 22)} تا {toFa(r.hourlyPrice * 45)}
              <span className="text-sm font-medium"> تومان</span>
            </p>
            <Button className="mt-6 w-full" onClick={consult.open}>درخواست مشاوره</Button>
          </div>

          <div className="rounded-2xl border border-border bg-card p-6">
            <h2 className="font-bold">خدمات قابل ارائه</h2>
            <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
              {SERVICES.slice(0, 5).map((s) => <li key={s.slug}>• {s.title}</li>)}
            </ul>
          </div>
        </aside>
      </div>
    </>
  );
}
