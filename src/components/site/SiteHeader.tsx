import { Link } from "@tanstack/react-router";
import { useState } from "react";
import { LayoutDashboard, Menu, Phone, X } from "lucide-react";
import { useSession } from "@/hooks/useSession";
import { Button } from "@/components/ui/button";
import { useConsult } from "./ConsultProvider";
import { Logo } from "./Logo";

const NAV = [
  { to: "/", label: "خانه" },
  { to: "/services", label: "خدمات" },
  { to: "/researchers", label: "پژوهشگران" },
  { to: "/request", label: "ثبت درخواست" },
  { to: "/estimate", label: "تخمین هزینه" },
  { to: "/blog", label: "مقالات" },
  { to: "/contact", label: "تماس با ما" },
] as const;

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const consult = useConsult();
  const { user, homePath } = useSession();

  return (
    <header className="sticky top-0 z-40 border-b border-border/70 bg-background/90 backdrop-blur">
      <div className="hidden border-b border-border/60 bg-surface md:block">
        <div className="container-page flex h-9 items-center justify-between text-xs text-muted-foreground">
          <a href="tel:09365991053" className="inline-flex items-center gap-2 font-semibold text-foreground">
            <Phone className="size-3.5 text-primary" />
            ۰۹۳۶۵۹۹۱۰۵۳
          </a>
          <span>پاسخگویی ۹ صبح تا ۹ شب • www.resaale.ir</span>
        </div>
      </div>

      <div className="container-page grid h-16 grid-cols-[minmax(0,1fr)_auto] items-center gap-4 lg:flex lg:justify-between">
        <Link to="/" className="flex min-w-0 items-center gap-2">
          <Logo className="size-9 shrink-0" />
          <span className="truncate text-xl font-black tracking-tight text-foreground">رساله</span>
        </Link>

        <nav className="hidden items-center gap-1 lg:flex">
          {NAV.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              activeOptions={{ exact: item.to === "/" }}
              activeProps={{ className: "text-primary bg-secondary" }}
              className="rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          {user ? (
            <Button size="sm" variant="outline" className="hidden sm:inline-flex" asChild>
              <Link to={homePath}>
                <LayoutDashboard className="size-4" />
                پنل کاربری
              </Link>
            </Button>
          ) : (
            <Button size="sm" variant="outline" className="hidden sm:inline-flex" asChild>
              <Link to="/auth">ورود / ثبت‌نام</Link>
            </Button>
          )}
          <Button size="sm" className="hidden sm:inline-flex" onClick={consult.open}>
            مشاوره رایگان
          </Button>
          <button
            aria-label="منو"
            className="rounded-lg border border-border p-2 lg:hidden"
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
      </div>

      {open && (
        <nav className="border-t border-border bg-background lg:hidden">
          <div className="container-page flex flex-col py-2">
            {NAV.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                onClick={() => setOpen(false)}
                className="rounded-lg px-3 py-2.5 text-sm font-medium text-foreground hover:bg-secondary"
              >
                {item.label}
              </Link>
            ))}
            <Link
              to={user ? homePath : "/auth"}
              onClick={() => setOpen(false)}
              className="rounded-lg px-3 py-2.5 text-sm font-bold text-primary hover:bg-secondary"
            >
              {user ? "پنل کاربری" : "ورود / ثبت‌نام"}
            </Link>
          </div>
        </nav>
      )}
    </header>
  );
}
