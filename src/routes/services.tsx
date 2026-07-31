import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { SERVICES } from "@/lib/data";
import { useConsult } from "@/components/site/ConsultProvider";

export const Route = createFileRoute("/services")({
  component: ServicesPage,
  head: () => ({
    meta: [
      { title: "خدمات پژوهشی | مشاوره پایان‌نامه، مقاله و تحلیل آماری — رساله" },
      {
        name: "description",
        content:
          "فهرست خدمات تخصصی رساله: مشاوره پایان‌نامه، پروپوزال نویسی، نوشتن مقاله علمی، تحلیل آماری، MATLAB و ویرایش علمی.",
      },
      { property: "og:title", content: "خدمات تخصصی پژوهشی رساله" },
      { property: "og:description", content: "هشت خدمت تخصصی پژوهشی با پژوهشگران هم‌رشته." },
      { property: "og:url", content: "/services" },
    ],
    links: [{ rel: "canonical", href: "/services" }],
  }),
});

function ServicesPage() {
  const consult = useConsult();
  return (
    <>
      <section className="border-b border-border bg-surface py-14">
        <div className="container-page">
          <h1 className="text-3xl font-black">خدمات تخصصی رساله</h1>
          <p className="mt-4 max-w-2xl leading-8 text-muted-foreground">
            هر پروژه به پژوهشگر هم‌رشته سپرده می‌شود و در قالب مراحل مشخص با پرداخت مرحله‌ای
            پیش می‌رود. کیفیت علمی خروجی توسط کارشناس داخلی رساله بازبینی می‌شود.
          </p>
        </div>
      </section>

      <section className="container-page py-14">
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {SERVICES.map((s) => (
            <article key={s.slug} className="flex h-full flex-col rounded-2xl border border-border bg-card p-6 shadow-[var(--shadow-card)]">
              <h2 className="text-lg font-bold">{s.title}</h2>
              <p className="mt-3 flex-1 text-sm leading-7 text-muted-foreground">{s.desc}</p>
              <div className="mt-5 flex gap-2">
                <Button asChild size="sm"><Link to="/request">ثبت درخواست</Link></Button>
                <Button size="sm" variant="secondary" onClick={consult.open}>مشاوره</Button>
              </div>
            </article>
          ))}
        </div>
      </section>
    </>
  );
}
