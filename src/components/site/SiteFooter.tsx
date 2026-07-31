import { Link } from "@tanstack/react-router";
import { Logo } from "./Logo";
import { SERVICES } from "@/lib/data";

export function SiteFooter() {
  return (
    <footer className="mt-24 border-t border-border bg-ink text-ink-foreground">
      <div className="container-page grid gap-10 py-14 md:grid-cols-4">
        <div>
          <div className="flex items-center gap-2">
            <Logo className="size-9" />
            <span className="text-xl font-black">رساله</span>
          </div>
          <p className="mt-4 text-sm leading-7 text-ink-foreground/70">
            بازارگاه تخصصی خدمات پژوهشی؛ ارتباط مستقیم دانشجویان با پژوهشگران متخصص هر رشته،
            با قیمت شفاف و پرداخت مرحله‌ای.
          </p>
        </div>

        <div>
          <h3 className="text-sm font-bold">خدمات</h3>
          <ul className="mt-4 space-y-2 text-sm text-ink-foreground/70">
            {SERVICES.slice(0, 6).map((s) => (
              <li key={s.slug}>
                <Link to="/services" className="hover:text-ink-foreground">{s.title}</Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="text-sm font-bold">دسترسی سریع</h3>
          <ul className="mt-4 space-y-2 text-sm text-ink-foreground/70">
            <li><Link to="/researchers" className="hover:text-ink-foreground">جست‌وجوی پژوهشگر</Link></li>
            <li><Link to="/estimate" className="hover:text-ink-foreground">تخمین هزینه پایان‌نامه</Link></li>
            <li><Link to="/request" className="hover:text-ink-foreground">ثبت درخواست</Link></li>
            <li><Link to="/blog" className="hover:text-ink-foreground">مجله علمی رساله</Link></li>
            <li><Link to="/contact" className="hover:text-ink-foreground">تماس با ما</Link></li>
          </ul>
        </div>

        <div>
          <h3 className="text-sm font-bold">ارتباط با رساله</h3>
          <ul className="mt-4 space-y-2 text-sm text-ink-foreground/70">
            <li>تلفن: ۰۲۱-۹۱۰۰۱۰۱۰</li>
            <li>ایمیل: info@resaale.ir</li>
            <li>نشانی: تهران، خیابان کارگر شمالی</li>
            <li>wr.resaale.ir</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10">
        <div className="container-page py-5 text-center text-xs text-ink-foreground/60">
          © ۱۴۰۴ رساله — تمامی حقوق محفوظ است. خدمات رساله صرفاً جنبه مشاوره‌ای و آموزشی دارد.
        </div>
      </div>
    </footer>
  );
}
