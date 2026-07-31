import { createFileRoute } from "@tanstack/react-router";
import { Mail, MapPin, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useConsult } from "@/components/site/ConsultProvider";

export const Route = createFileRoute("/contact")({
  component: ContactPage,
  head: () => ({
    meta: [
      { title: "تماس با رساله | پشتیبانی خدمات پژوهشی" },
      {
        name: "description",
        content:
          "راه‌های ارتباط با تیم رساله: تلفن ۰۲۱-۹۱۰۰۱۰۱۰، ایمیل info@resaale.ir و درخواست مشاوره رایگان پایان‌نامه.",
      },
      { property: "og:title", content: "تماس با رساله" },
      { property: "og:description", content: "پشتیبانی خدمات پژوهشی، ۹ صبح تا ۹ شب." },
      { property: "og:url", content: "/contact" },
    ],
    links: [{ rel: "canonical", href: "/contact" }],
  }),
});

function ContactPage() {
  const consult = useConsult();
  return (
    <div className="container-page grid gap-8 py-14 lg:grid-cols-2">
      <div>
        <h1 className="text-3xl font-black">تماس با رساله</h1>
        <p className="mt-4 leading-8 text-muted-foreground">
          تیم پشتیبانی رساله هر روز از ساعت ۹ صبح تا ۹ شب پاسخگوی سؤالات دانشجویان و پژوهشگران است.
        </p>
        <ul className="mt-8 space-y-4">
          <li className="flex items-center gap-3 rounded-xl border border-border bg-card p-4">
            <Phone className="size-5 shrink-0 text-primary" />
            <span className="font-semibold">۰۲۱-۹۱۰۰۱۰۱۰</span>
          </li>
          <li className="flex items-center gap-3 rounded-xl border border-border bg-card p-4">
            <Mail className="size-5 shrink-0 text-primary" />
            <span className="font-semibold">info@resaale.ir</span>
          </li>
          <li className="flex items-center gap-3 rounded-xl border border-border bg-card p-4">
            <MapPin className="size-5 shrink-0 text-primary" />
            <span className="font-semibold">تهران، خیابان کارگر شمالی، پژوهشکده علوم</span>
          </li>
        </ul>
      </div>

      <div className="h-max rounded-3xl bg-[image:var(--gradient-hero)] p-8 text-ink-foreground">
        <h2 className="text-xl font-black">مشاوره رایگان بگیرید</h2>
        <p className="mt-3 leading-8 text-ink-foreground/80">
          فرم کوتاه مشاوره را پر کنید؛ کارشناس علمی رساله در کمتر از ۲ ساعت کاری با شما تماس می‌گیرد
          و مناسب‌ترین پژوهشگر را معرفی می‌کند.
        </p>
        <Button className="mt-6 bg-accent text-accent-foreground hover:bg-accent/90" size="lg" onClick={consult.open}>
          دریافت مشاوره رایگان
        </Button>
      </div>
    </div>
  );
}
