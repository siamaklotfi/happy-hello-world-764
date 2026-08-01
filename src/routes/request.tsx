import { createFileRoute, Link } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";
import { useState } from "react";
import { CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ResearcherCard } from "@/components/site/ResearcherCard";
import { FIELDS, LEVELS, RESEARCHERS, SERVICES, toFa } from "@/lib/data";
import { COMPLEXITY, URGENCY, estimatePrice, type EstimateResult } from "@/lib/pricing";

export const Route = createFileRoute("/request")({
  component: RequestPage,
  head: () => ({
    meta: [
      { title: "ثبت درخواست پایان‌نامه و پروژه پژوهشی | رساله" },
      {
        name: "description",
        content:
          "فرم ثبت درخواست پایان‌نامه در رساله؛ پس از ثبت، بازه هزینه تخمینی و پژوهشگران پیشنهادی متناسب با رشته شما نمایش داده می‌شود.",
      },
      { property: "og:title", content: "ثبت درخواست پایان‌نامه در رساله" },
      { property: "og:description", content: "درخواست خود را ثبت کنید و پیشنهاد پژوهشگران را دریافت کنید." },
      { property: "og:url", content: "/request" },
    ],
    links: [{ rel: "canonical", href: "/request" }],
  }),
});

const EMPTY = {
  level: "",
  university: "",
  field: "",
  major: "",
  topic: "",
  method: "",
  service: "",
  deadline: "",
  urgency: "",
  complexity: "",
  budget: "",
  description: "",
};

function RequestPage() {
  const [form, setForm] = useState(EMPTY);
  const [error, setError] = useState("");
  const [result, setResult] = useState<EstimateResult | null>(null);
  const [saved, setSaved] = useState<"guest" | "saved" | "error" | "">("");

  const set = (k: keyof typeof EMPTY, v: string) => setForm((f) => ({ ...f, [k]: v }));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.level || !form.field || !form.service || !form.urgency || !form.complexity) {
      setError("لطفاً مقطع، رشته، خدمت، فوریت و سطح پیچیدگی را انتخاب کنید.");
      return;
    }
    if (form.topic.trim().length < 5) {
      setError("موضوع پایان‌نامه را دقیق‌تر وارد کنید.");
      return;
    }
    setError("");
    const estimate = estimatePrice({
      level: form.level,
      fieldSlug: form.field,
      serviceSlug: form.service,
      urgency: form.urgency,
      complexity: form.complexity,
    });
    setResult(estimate);

    const { data: userData } = await supabase.auth.getUser();
    const uid = userData.user?.id;
    if (!uid) {
      setSaved("guest");
      return;
    }
    const { data: inserted, error: err } = await supabase.from("thesis_requests").insert({
      student_id: uid,
      academic_level: form.level,
      university: form.university,
      field_slug: form.field,
      major: form.major,
      topic: form.topic.trim(),
      research_method: form.method,
      service_slug: form.service,
      deadline: form.deadline || null,
      urgency: form.urgency,
      complexity: form.complexity,
      budget: form.budget,
      description: form.description,
      estimate_min: estimate.min,
      estimate_max: estimate.max,
    }).select("id").maybeSingle();
    if (!err && inserted?.id) void notifyNewLead({ data: { kind: "request", id: inserted.id } }).catch(() => {});
    setSaved(err ? "error" : "saved");

  };


  const suggested = RESEARCHERS.filter((r) => !form.field || r.fieldSlug === form.field)
    .sort((a, b) => b.rating * b.projects - a.rating * a.projects)
    .slice(0, 3);

  return (
    <>
      <section className="border-b border-border bg-surface py-12">
        <div className="container-page">
          <h1 className="text-3xl font-black">ثبت درخواست پروژه پژوهشی</h1>
          <p className="mt-3 max-w-2xl text-muted-foreground">
            هرچه اطلاعات دقیق‌تری وارد کنید، تخمین هزینه و پیشنهاد پژوهشگران دقیق‌تر خواهد بود.
          </p>
        </div>
      </section>

      <div className="container-page grid gap-8 py-12 lg:grid-cols-[minmax(0,1fr)_360px]">
        <form onSubmit={submit} className="space-y-6 rounded-2xl border border-border bg-card p-6 shadow-[var(--shadow-card)]">
          <div className="grid gap-5 sm:grid-cols-2">
            <div className="space-y-2">
              <Label>مقطع تحصیلی</Label>
              <Select value={form.level} onValueChange={(v) => set("level", v)}>
                <SelectTrigger><SelectValue placeholder="انتخاب کنید" /></SelectTrigger>
                <SelectContent>{LEVELS.map((l) => <SelectItem key={l} value={l}>{l}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="uni">دانشگاه</Label>
              <Input id="uni" maxLength={80} value={form.university} onChange={(e) => set("university", e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>حوزه تحصیلی</Label>
              <Select value={form.field} onValueChange={(v) => set("field", v)}>
                <SelectTrigger><SelectValue placeholder="انتخاب کنید" /></SelectTrigger>
                <SelectContent>{FIELDS.map((f) => <SelectItem key={f.slug} value={f.slug}>{f.name}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="major">رشته / گرایش</Label>
              <Input id="major" maxLength={80} value={form.major} onChange={(e) => set("major", e.target.value)} />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="topic">موضوع پایان‌نامه</Label>
            <Input id="topic" maxLength={160} value={form.topic} onChange={(e) => set("topic", e.target.value)} />
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="method">روش تحقیق</Label>
              <Input id="method" maxLength={80} placeholder="کمی، کیفی، آمیخته..." value={form.method} onChange={(e) => set("method", e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>خدمت مورد نیاز</Label>
              <Select value={form.service} onValueChange={(v) => set("service", v)}>
                <SelectTrigger><SelectValue placeholder="انتخاب کنید" /></SelectTrigger>
                <SelectContent>{SERVICES.map((s) => <SelectItem key={s.slug} value={s.slug}>{s.title}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="deadline">مهلت تحویل</Label>
              <Input id="deadline" type="date" value={form.deadline} onChange={(e) => set("deadline", e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>سطح فوریت</Label>
              <Select value={form.urgency} onValueChange={(v) => set("urgency", v)}>
                <SelectTrigger><SelectValue placeholder="انتخاب کنید" /></SelectTrigger>
                <SelectContent>{URGENCY.map((u) => <SelectItem key={u} value={u}>{u}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>پیچیدگی پروژه</Label>
              <Select value={form.complexity} onValueChange={(v) => set("complexity", v)}>
                <SelectTrigger><SelectValue placeholder="انتخاب کنید" /></SelectTrigger>
                <SelectContent>{COMPLEXITY.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="budget">بودجه مدنظر (تومان)</Label>
              <Input id="budget" inputMode="numeric" maxLength={15} value={form.budget} onChange={(e) => set("budget", e.target.value)} />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="desc">توضیحات تکمیلی</Label>
            <Textarea id="desc" rows={5} maxLength={1500} value={form.description} onChange={(e) => set("description", e.target.value)} />
          </div>

          {error && <p className="text-sm text-destructive">{error}</p>}
          <Button type="submit" size="lg">ثبت درخواست و مشاهده تخمین هزینه</Button>
        </form>

        <aside className="h-max space-y-6">
          {result ? (
            <div className="rounded-2xl border border-primary/30 bg-card p-6 shadow-[var(--shadow-card)]">
              <div className="flex items-center gap-2 text-primary">
                <CheckCircle2 className="size-5" />
                <h2 className="font-bold">درخواست شما ثبت شد</h2>
              </div>
              <p className="mt-4 text-sm text-muted-foreground">هزینه تخمینی پروژه:</p>
              <p className="mt-1 text-xl font-black leading-9">
                {toFa(result.min)} – {toFa(result.max)}
                <span className="text-sm font-medium"> تومان</span>
              </p>
              <p className="mt-3 text-xs leading-6 text-muted-foreground">
                این بازه تخمینی است؛ قیمت نهایی پس از دریافت پیشنهاد پژوهشگران و توافق بر مراحل کار مشخص می‌شود.
              </p>
              {saved === "saved" && (
                <p className="mt-4 rounded-lg bg-secondary p-3 text-xs leading-6">
                  درخواست در حساب شما ذخیره شد. پیشنهادهای پژوهشگران را در{" "}
                  <Link to="/dashboard" className="font-bold text-primary">پنل دانشجو</Link> دنبال کنید.
                </p>
              )}
              {saved === "guest" && (
                <p className="mt-4 rounded-lg bg-secondary p-3 text-xs leading-6">
                  برای ذخیره درخواست و دریافت پیشنهاد پژوهشگران،{" "}
                  <Link to="/auth" className="font-bold text-primary">وارد حساب کاربری شوید</Link>.
                </p>
              )}
              {saved === "error" && (
                <p className="mt-4 rounded-lg bg-destructive/10 p-3 text-xs text-destructive">ذخیره درخواست انجام نشد؛ دوباره تلاش کنید.</p>
              )}
            </div>
          ) : (
            <div className="rounded-2xl border border-dashed border-border p-6 text-sm leading-7 text-muted-foreground">
              پس از تکمیل فرم، بازه هزینه تخمینی و پژوهشگران پیشنهادی در همین بخش نمایش داده می‌شود.
            </div>
          )}

          <div>
            <h2 className="mb-4 font-bold">پژوهشگران پیشنهادی</h2>
            <div className="grid gap-4">
              {suggested.map((r) => <ResearcherCard key={r.slug} r={r} />)}
            </div>
          </div>
        </aside>
      </div>
    </>
  );
}
