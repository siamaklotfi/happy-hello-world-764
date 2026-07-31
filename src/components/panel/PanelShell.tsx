import { Link, useNavigate } from "@tanstack/react-router";
import { LogOut } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";

export function PanelShell({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle: string;
  children: React.ReactNode;
}) {
  const navigate = useNavigate();

  const signOut = async () => {
    await supabase.auth.signOut();
    navigate({ to: "/auth", replace: true });
  };

  return (
    <div className="min-h-[60vh] bg-surface py-10">
      <div className="container-page">
        <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4 rounded-2xl border border-border bg-card p-6 shadow-[var(--shadow-card)]">
          <div className="min-w-0">
            <h1 className="truncate text-2xl font-black">{title}</h1>
            <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>
          </div>
          <div className="flex shrink-0 items-center gap-2">
            <Button variant="outline" size="sm" asChild>
              <Link to="/">بازگشت به سایت</Link>
            </Button>
            <Button variant="ghost" size="sm" onClick={signOut}>
              <LogOut className="size-4" /> خروج
            </Button>
          </div>
        </div>
        <div className="mt-6">{children}</div>
      </div>
    </div>
  );
}

export function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-border bg-card p-4">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="mt-1 text-xl font-black text-foreground">{value}</p>
    </div>
  );
}

export const STATUS_FA: Record<string, string> = {
  open: "باز",
  in_progress: "در حال انجام",
  delivered: "تحویل شده",
  completed: "تکمیل شده",
  cancelled: "لغو شده",
  pending: "در انتظار",
  accepted: "پذیرفته شده",
  rejected: "رد شده",
  paid: "پرداخت شده",
  new: "جدید",
  contacted: "پیگیری شده",
  closed: "بسته شده",
};
