import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowLeft,
  ShieldCheck,
  Wallet,
  Users,
  Star,
  FileSearch,
  Handshake,
  ClipboardList,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ResearcherCard } from "@/components/site/ResearcherCard";
import { useConsult } from "@/components/site/ConsultProvider";
import { RESEARCHERS, SERVICES, POSTS, toFa } from "@/lib/data";
import heroImg from "@/assets/hero-academic.jpg";

export const Route = createFileRoute("/")({
  component: Home,
  head: () => ({
    meta: [
      { title: "رساله | مشاوره پایان‌نامه و بازارگاه پژوهشگران متخصص" },
      {
        name: "description",
        content:
          "ثبت درخواست پایان‌نامه، تخمین هزینه و انتخاب پژوهشگر متخصص هم‌رشته در رساله؛ مشاوره پایان‌نامه، پروپوزال، مقاله علمی و تحلیل آماری.",
      },
      { property: "og:title", content: "رساله | بازارگاه خدمات پژوهشی دانشگاهی" },
      {
        property: "og:description",
        content: "ارتباط مستقیم دانشجویان با پژوهشگران متخصص؛ قیمت شفاف، پرداخت مرحله‌ای.",
      },
      { property: "og:url", content: "/" },
    ],
    links: [{ rel: "canonical", href: "/" }],
  }),
});

const STEPS = [
  { icon: ClipboardList, title: "ثبت درخواست توسط دانشجو", desc: "موضوع، رشته، مقطع و نوع خدمت خود را در فرم درخواست ثبت کنید." },
  { icon: FileSearch, title: "بررسی تخصصی پروژه", desc: "کارشناسان رساله دامنه کار و بازه هزینه را کارشناسی می‌کنند." },
  { icon: Users, title: "دریافت پیشنهاد از پژوهشگران", desc: "پژوهشگران هم‌رشته قیمت و زمان تحویل پیشنهادی خود را ارسال می‌کنند." },
  { icon: Handshake, title: "انتخاب متخصص مناسب", desc: "بر اساس رزومه، امتیاز و قیمت انتخاب کنید و پروژه را مرحله‌ای پیش ببرید." },
];

function Home() {
  const consult = useConsult();
  const top = [...RESEARCHERS].sort((a, b) => b.rating - a.rating).slice(0, 4);

  return (
    <>
      {/* HERO */}
      <section className="relative overflow-hidden bg-[image:var(--gradient-hero)] text-ink-foreground">
        <div className="container-page grid items-center gap-10 py-16 lg:grid-cols-2 lg:py-24">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1.5 text-xs font-semibold">
              <ShieldCheck className="size-4 text-gold" />
              بیش از {toFa(1200)} پروژه پژوهشی تحویل‌شده
            </span>
            <h1 className="mt-5 text-3xl font-black leading-[1.35] sm:text-4xl lg:text-5xl lg:leading-[1.3]">
              ارتباط مستقیم دانشجویان با پژوهشگران متخصص
            </h1>
            <p className="mt-5 max-w-xl text-base leading-8 text-ink-foreground/80">
              پایان‌نامه، مقاله و خدمات پژوهشی خود را با متخصصان هر رشته انجام دهید. قیمت شفاف،
              پرداخت مرحله‌ای و ارتباط مستقیم با پژوهشگر.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90">
                <Link to="/request">ثبت درخواست پایان‌نامه</Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="border-white/30 bg-transparent text-ink-foreground hover:bg-white/10 hover:text-ink-foreground">
                <Link to="/researchers">ثبت نام پژوهشگر</Link>
              </Button>
            </div>
            <dl className="mt-10 grid max-w-lg grid-cols-3 gap-4 border-t border-white/15 pt-6 text-center">
              {[
                { k: "پژوهشگر فعال", v: "۴۸۰+" },
                { k: "رشته تخصصی", v: "۹۰+" },
                { k: "رضایت دانشجویان", v: "۹۶٪" },
              ].map((s) => (
                <div key={s.k}>
                  <dt className="text-xl font-black text-gold">{s.v}</dt>
                  <dd className="mt-1 text-xs text-ink-foreground/70">{s.k}</dd>
                </div>
              ))}
            </dl>
          </div>
          <img
            src={heroImg}
            alt="همکاری پژوهشگر و دانشجو روی پایان‌نامه در پلتفرم رساله"
            width={1200}
            height={912}
            className="w-full rounded-3xl shadow-[var(--shadow-lift)]"
          />
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="container-page py-16 lg:py-24">
        <header className="max-w-2xl">
          <h2 className="text-2xl font-black sm:text-3xl">چگونه کار می‌کند؟</h2>
          <p className="mt-3 text-muted-foreground">مسیر چهار مرحله‌ای از ثبت درخواست تا شروع همکاری.</p>
        </header>
        <ol className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
          {STEPS.map((s, i) => (
            <li key={s.title} className="relative rounded-2xl border border-border bg-card p-6 shadow-[var(--shadow-card)]">
              <span className="absolute -top-3 left-6 rounded-full bg-accent px-3 py-0.5 text-xs font-black text-accent-foreground">
                {toFa(i + 1)}
              </span>
              <s.icon className="size-8 text-primary" />
              <h3 className="mt-4 font-bold">{s.title}</h3>
              <p className="mt-2 text-sm leading-7 text-muted-foreground">{s.desc}</p>
            </li>
          ))}
        </ol>
      </section>

      {/* TOP RESEARCHERS */}
      <section className="bg-surface py-16 lg:py-24">
        <div className="container-page">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <h2 className="text-2xl font-black sm:text-3xl">پژوهشگران برتر</h2>
              <p className="mt-3 text-muted-foreground">بالاترین امتیاز کاربران در سه ماه گذشته.</p>
            </div>
            <Button asChild variant="ghost">
              <Link to="/researchers">همه پژوهشگران <ArrowLeft className="size-4" /></Link>
            </Button>
          </div>
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {top.map((r) => <ResearcherCard key={r.slug} r={r} />)}
          </div>
        </div>
      </section>

      {/* SERVICES */}
      <section className="container-page py-16 lg:py-24">
        <header className="max-w-2xl">
          <h2 className="text-2xl font-black sm:text-3xl">خدمات تخصصی</h2>
          <p className="mt-3 text-muted-foreground">هر خدمت توسط پژوهشگر هم‌رشته و با تأیید کارشناس علمی انجام می‌شود.</p>
        </header>
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {SERVICES.slice(0, 6).map((s) => (
            <Link
              key={s.slug}
              to="/services"
              className="rounded-2xl border border-border bg-card p-6 transition-all hover:-translate-y-1 hover:border-primary/40 hover:shadow-[var(--shadow-lift)]"
            >
              <h3 className="font-bold text-foreground">{s.title}</h3>
              <p className="mt-2 text-sm leading-7 text-muted-foreground">{s.desc}</p>
              <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-primary">
                جزئیات خدمت <ArrowLeft className="size-4" />
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* CTA ESTIMATE */}
      <section className="container-page">
        <div className="grid items-center gap-8 rounded-3xl border border-border bg-card p-8 shadow-[var(--shadow-card)] lg:grid-cols-[1.4fr_1fr] lg:p-12">
          <div>
            <h2 className="text-2xl font-black">هزینه پایان‌نامه شما چقدر است؟</h2>
            <p className="mt-3 leading-8 text-muted-foreground">
              سامانه تخمین هزینه رساله بر اساس مقطع، رشته، نوع خدمت، فوریت و پیچیدگی پروژه، بازه
              قیمت تقریبی را در چند ثانیه به شما نشان می‌دهد.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Button asChild size="lg"><Link to="/estimate">محاسبه هزینه</Link></Button>
              <Button size="lg" variant="secondary" onClick={consult.open}>مشاوره رایگان</Button>
            </div>
          </div>
          <ul className="space-y-3 text-sm">
            {[
              { icon: Wallet, t: "پرداخت مرحله‌ای و امن" },
              { icon: ShieldCheck, t: "احراز هویت علمی پژوهشگران" },
              { icon: Star, t: "امتیازدهی شفاف کاربران" },
            ].map((f) => (
              <li key={f.t} className="flex items-center gap-3 rounded-xl bg-secondary p-4">
                <f.icon className="size-5 shrink-0 text-primary" />
                <span className="font-medium">{f.t}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* BLOG */}
      <section className="container-page py-16 lg:py-24">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <h2 className="text-2xl font-black sm:text-3xl">تازه‌های مجله علمی</h2>
          <Button asChild variant="ghost"><Link to="/blog">همه مقالات <ArrowLeft className="size-4" /></Link></Button>
        </div>
        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {POSTS.slice(0, 3).map((p) => (
            <Link
              key={p.slug}
              to="/blog/$slug"
              params={{ slug: p.slug }}
              className="rounded-2xl border border-border bg-card p-6 transition-all hover:-translate-y-1 hover:shadow-[var(--shadow-lift)]"
            >
              <span className="text-xs font-bold text-primary">{p.category}</span>
              <h3 className="mt-2 font-bold leading-7">{p.title}</h3>
              <p className="mt-2 text-sm leading-7 text-muted-foreground">{p.excerpt}</p>
              <span className="mt-4 block text-xs text-muted-foreground">{p.date} • {toFa(p.readingTime)} دقیقه مطالعه</span>
            </Link>
          ))}
        </div>
      </section>
    </>
  );
}
