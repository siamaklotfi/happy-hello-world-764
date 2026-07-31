import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FIELDS, LEVELS, SERVICES, toFa } from "@/lib/data";
import { COMPLEXITY, URGENCY, estimatePrice } from "@/lib/pricing";

export const Route = createFileRoute("/estimate")({
  component: EstimatePage,
  head: () => ({
    meta: [
      { title: "تخمین هزینه پایان‌نامه و مقاله | ماشین‌حساب رساله" },
      {
        name: "description",
        content:
          "هزینه پایان‌نامه، پروپوزال، مقاله علمی و تحلیل آماری را بر اساس مقطع، رشته، فوریت و پیچیدگی پروژه به‌صورت آنی تخمین بزنید.",
      },
      { property: "og:title", content: "ماشین‌حساب هزینه پایان‌نامه رساله" },
      { property: "og:description", content: "بازه هزینه پروژه پژوهشی خود را در چند ثانیه ببینید." },
      { property: "og:url", content: "/estimate" },
    ],
    links: [{ rel: "canonical", href: "/estimate" }],
  }),
});

function EstimatePage() {
  const [level, setLevel] = useState<string>(LEVELS[1]);
  const [field, setField] = useState<string>(FIELDS[0]!.slug);
  const [service, setService] = useState<string>(SERVICES[0]!.slug);
  const [urgency, setUrgency] = useState<string>(URGENCY[0]);
  const [complexity, setComplexity] = useState<string>(COMPLEXITY[1]);

  const result = useMemo(
    () => estimatePrice({ level, fieldSlug: field, serviceSlug: service, urgency, complexity }),
    [level, field, service, urgency, complexity],
  );

  return (
    <>
      <section className="border-b border-border bg-surface py-12">
        <div className="container-page">
          <h1 className="text-3xl font-black">تخمین هزینه پروژه پژوهشی</h1>
          <p className="mt-3 max-w-2xl text-muted-foreground">
            پارامترهای پروژه را انتخاب کنید تا بازه هزینه به‌صورت زنده محاسبه شود.
          </p>
        </div>
      </section>

      <div className="container-page grid gap-8 py-12 lg:grid-cols-2">
        <div className="space-y-5 rounded-2xl border border-border bg-card p-6 shadow-[var(--shadow-card)]">
          <div className="space-y-2">
            <Label>مقطع تحصیلی</Label>
            <Select value={level} onValueChange={setLevel}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>{LEVELS.map((l) => <SelectItem key={l} value={l}>{l}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>حوزه تحصیلی</Label>
            <Select value={field} onValueChange={setField}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>{FIELDS.map((f) => <SelectItem key={f.slug} value={f.slug}>{f.name}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>نوع خدمت</Label>
            <Select value={service} onValueChange={setService}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>{SERVICES.map((s) => <SelectItem key={s.slug} value={s.slug}>{s.title}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>سطح فوریت</Label>
            <Select value={urgency} onValueChange={setUrgency}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>{URGENCY.map((u) => <SelectItem key={u} value={u}>{u}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>پیچیدگی پروژه</Label>
            <Select value={complexity} onValueChange={setComplexity}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>{COMPLEXITY.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
            </Select>
          </div>
        </div>

        <aside className="h-max rounded-3xl bg-[image:var(--gradient-hero)] p-8 text-ink-foreground shadow-[var(--shadow-lift)]">
          <h2 className="text-sm font-semibold text-ink-foreground/80">هزینه تخمینی پروژه</h2>
          <p className="mt-3 text-2xl font-black leading-[1.6] sm:text-3xl">
            {toFa(result.min)} – {toFa(result.max)}
            <span className="text-base font-medium"> تومان</span>
          </p>
          <ul className="mt-6 space-y-2 text-sm text-ink-foreground/80">
            <li>• پرداخت در ۳ مرحله متناسب با پیشرفت پروژه</li>
            <li>• امکان دریافت پیشنهاد رقابتی از چند پژوهشگر</li>
            <li>• بازبینی علمی خروجی پیش از تحویل نهایی</li>
          </ul>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button asChild size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90">
              <Link to="/request">ثبت درخواست دقیق</Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="border-white/30 bg-transparent text-ink-foreground hover:bg-white/10 hover:text-ink-foreground">
              <Link to="/researchers">مشاهده پژوهشگران</Link>
            </Button>
          </div>
          <p className="mt-6 text-xs leading-6 text-ink-foreground/60">
            اعداد نمایش‌داده‌شده تخمینی هستند و قیمت نهایی پس از بررسی تخصصی پروژه اعلام می‌شود.
          </p>
        </aside>
      </div>
    </>
  );
}
