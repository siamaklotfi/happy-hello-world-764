import { Link } from "@tanstack/react-router";
import { Star, BriefcaseBusiness, GraduationCap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { fieldName, toFa, type Researcher } from "@/lib/data";

export function ResearcherCard({ r }: { r: Researcher }) {
  return (
    <article className="group flex h-full flex-col rounded-2xl border border-border bg-card p-5 shadow-[var(--shadow-card)] transition-all hover:-translate-y-1 hover:shadow-[var(--shadow-lift)]">
      <div className="flex items-start gap-3">
        <span className="grid size-14 shrink-0 place-items-center rounded-2xl bg-[image:var(--gradient-hero)] text-lg font-black text-ink-foreground">
          {r.avatarSeed}
        </span>
        <div className="min-w-0">
          <h3 className="truncate text-base font-bold">{r.name}</h3>
          <p className="truncate text-sm text-muted-foreground">{r.major}</p>
          <p className="mt-1 flex items-center gap-1 text-xs text-accent-foreground">
            <Star className="size-3.5 fill-gold text-gold" />
            <span className="font-bold">{r.rating.toLocaleString("fa-IR")}</span>
            <span className="text-muted-foreground">({toFa(r.reviews)} نظر)</span>
          </p>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap gap-1.5">
        {r.specialties.slice(0, 3).map((s) => (
          <span key={s} className="rounded-full bg-secondary px-2.5 py-1 text-xs text-secondary-foreground">
            {s}
          </span>
        ))}
      </div>

      <dl className="mt-4 grid grid-cols-2 gap-2 text-xs text-muted-foreground">
        <div className="flex items-center gap-1.5">
          <GraduationCap className="size-4 shrink-0 text-primary" />
          {r.degree} • {fieldName(r.fieldSlug)}
        </div>
        <div className="flex items-center gap-1.5">
          <BriefcaseBusiness className="size-4 shrink-0 text-primary" />
          {toFa(r.experience)} سال سابقه • {toFa(r.projects)} پروژه
        </div>
      </dl>

      <div className="mt-5 flex items-center justify-between gap-3 border-t border-border pt-4">
        <span className="text-xs text-muted-foreground">
          مشاوره ساعتی از <b className="text-foreground">{toFa(r.hourlyPrice)}</b> تومان
        </span>
        <Button asChild size="sm" variant="secondary">
          <Link to="/researchers/$slug" params={{ slug: r.slug }}>مشاهده پروفایل</Link>
        </Button>
      </div>
    </article>
  );
}
