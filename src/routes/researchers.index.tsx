import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { ResearcherCard } from "@/components/site/ResearcherCard";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FIELDS, LEVELS, RESEARCHERS, toFa, type Researcher } from "@/lib/data";
import { listApprovedResearchers } from "@/lib/researchers.functions";

export const Route = createFileRoute("/researchers/")({
  loader: () => listApprovedResearchers(),
  component: ResearchersPage,
  head: () => ({
    meta: [
      { title: "جست‌وجوی پژوهشگر متخصص | بازارگاه رساله" },
      {
        name: "description",
        content:
          "بازارگاه پژوهشگران رساله؛ فیلتر بر اساس رشته، مقطع، سابقه، امتیاز و قیمت و مشاهده پروفایل کامل پژوهشگر پایان‌نامه.",
      },
      { property: "og:title", content: "جست‌وجوی پژوهشگر متخصص در رساله" },
      { property: "og:description", content: "پژوهشگر هم‌رشته خود را بر اساس تخصص و امتیاز پیدا کنید." },
      { property: "og:url", content: "/researchers" },
    ],
    links: [{ rel: "canonical", href: "/researchers" }],
  }),
});

function ResearchersPage() {
  const fromDb = Route.useLoaderData();
  const [q, setQ] = useState("");
  const [field, setField] = useState("all");
  const [degree, setDegree] = useState("all");
  const [minExp, setMinExp] = useState([0]);
  const [minRating, setMinRating] = useState([0]);
  const [maxPrice, setMaxPrice] = useState([1_500_000]);

  const all = useMemo(() => {
    const slugs = new Set(RESEARCHERS.map((r) => r.slug));
    return [...RESEARCHERS, ...(fromDb as Researcher[]).filter((r) => !slugs.has(r.slug))];
  }, [fromDb]);

  const results = useMemo(
    () =>
      all.filter((r) => {
        const text = `${r.name} ${r.major} ${r.specialties.join(" ")}`;
        return (
          (q.trim() === "" || text.includes(q.trim())) &&
          (field === "all" || r.fieldSlug === field) &&
          (degree === "all" || r.degree === degree) &&
          r.experience >= (minExp[0] ?? 0) &&
          r.rating >= (minRating[0] ?? 0) &&
          r.hourlyPrice <= (maxPrice[0] ?? Infinity)
        );
      }),
    [all, q, field, degree, minExp, minRating, maxPrice],
  );

  const reset = () => {
    setQ(""); setField("all"); setDegree("all");
    setMinExp([0]); setMinRating([0]); setMaxPrice([1_500_000]);
  };

  return (
    <>
      <section className="border-b border-border bg-surface py-12">
        <div className="container-page">
          <h1 className="text-3xl font-black">پژوهشگران متخصص</h1>
          <p className="mt-3 max-w-2xl text-muted-foreground">
            {toFa(RESEARCHERS.length)} پژوهشگر تأییدشده در رشته‌های مختلف؛ با فیلترها متخصص مناسب پروژه خود را پیدا کنید.
          </p>
        </div>
      </section>

      <div className="container-page grid gap-8 py-12 lg:grid-cols-[280px_minmax(0,1fr)]">
        <aside className="h-max rounded-2xl border border-border bg-card p-5 shadow-[var(--shadow-card)]">
          <h2 className="font-bold">فیلترها</h2>
          <div className="mt-5 space-y-5">
            <div className="space-y-2">
              <Label htmlFor="q">جست‌وجو</Label>
              <Input id="q" value={q} onChange={(e) => setQ(e.target.value)} placeholder="نام، تخصص یا رشته" maxLength={60} />
            </div>
            <div className="space-y-2">
              <Label>حوزه پژوهشی</Label>
              <Select value={field} onValueChange={setField}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">همه حوزه‌ها</SelectItem>
                  {FIELDS.map((f) => <SelectItem key={f.slug} value={f.slug}>{f.name}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>مدرک تحصیلی</Label>
              <Select value={degree} onValueChange={setDegree}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">همه مقاطع</SelectItem>
                  {LEVELS.map((l) => <SelectItem key={l} value={l}>{l}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-3">
              <Label>حداقل سابقه: {toFa(minExp[0] ?? 0)} سال</Label>
              <Slider value={minExp} onValueChange={setMinExp} max={15} step={1} dir="rtl" />
            </div>
            <div className="space-y-3">
              <Label>حداقل امتیاز: {(minRating[0] ?? 0).toLocaleString("fa-IR")}</Label>
              <Slider value={minRating} onValueChange={setMinRating} max={5} step={0.5} dir="rtl" />
            </div>
            <div className="space-y-3">
              <Label>سقف نرخ ساعتی: {toFa(maxPrice[0] ?? 0)} تومان</Label>
              <Slider value={maxPrice} onValueChange={setMaxPrice} min={500_000} max={1_500_000} step={50_000} dir="rtl" />
            </div>
            <Button variant="secondary" className="w-full" onClick={reset}>حذف فیلترها</Button>
          </div>
        </aside>

        <section>
          <p className="mb-5 text-sm text-muted-foreground">{toFa(results.length)} پژوهشگر یافت شد</p>
          {results.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-border p-12 text-center text-muted-foreground">
              پژوهشگری با این فیلترها یافت نشد.
            </div>
          ) : (
            <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
              {results.map((r) => <ResearcherCard key={r.slug} r={r} />)}
            </div>
          )}
        </section>
      </div>
    </>
  );
}
