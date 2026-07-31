import { createFileRoute } from "@tanstack/react-router";
import { useCallback, useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PanelShell, StatCard, STATUS_FA } from "@/components/panel/PanelShell";
import { fieldName, toFa } from "@/lib/data";

export const Route = createFileRoute("/_authenticated/admin")({
  component: AdminPanel,
  head: () => ({
    meta: [
      { title: "پنل مدیریت | رساله" },
      { name: "description", content: "مدیریت درخواست‌های مشاوره، تأیید پژوهشگران، پیگیری پروژه‌ها و پرداخت‌ها در پنل مدیریت رساله." },
      { property: "og:title", content: "پنل مدیریت رساله" },
      { property: "og:description", content: "مدیریت کاربران، پروژه‌ها و پرداخت‌های پلتفرم." },
      { property: "og:url", content: "/admin" },
      { name: "robots", content: "noindex" },
    ],
  }),
});

function AdminPanel() {
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [leads, setLeads] = useState<any[]>([]);
  const [researchers, setResearchers] = useState<any[]>([]);
  const [requests, setRequests] = useState<any[]>([]);
  const [payments, setPayments] = useState<any[]>([]);

  const load = useCallback(async () => {
    const uid = (await supabase.auth.getUser()).data.user?.id;
    if (!uid) return;
    const { data: roles } = await supabase.from("user_roles").select("role").eq("user_id", uid);
    const admin = (roles ?? []).some((r) => r.role === "admin");
    setIsAdmin(admin);
    if (admin) {
      const [{ data: l }, { data: rs }, { data: rq }, { data: pm }] = await Promise.all([
        supabase.from("consultations").select("*").order("created_at", { ascending: false }),
        supabase.from("researcher_profiles").select("*").order("created_at", { ascending: false }),
        supabase.from("thesis_requests").select("*").order("created_at", { ascending: false }),
        supabase.from("payments").select("*").order("created_at", { ascending: false }),
      ]);
      setLeads(l ?? []);
      setResearchers(rs ?? []);
      setRequests(rq ?? []);
      setPayments(pm ?? []);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const setApproved = async (id: string, approved: boolean) => {
    await supabase.from("researcher_profiles").update({ approved }).eq("id", id);
    void load();
  };
  const setLeadStatus = async (id: string, status: string) => {
    await supabase.from("consultations").update({ status }).eq("id", id);
    void load();
  };
  const setPaymentStatus = async (id: string, status: string) => {
    await supabase.from("payments").update({ status }).eq("id", id);
    void load();
  };

  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <Loader2 className="size-6 animate-spin text-primary" />
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <PanelShell title="پنل مدیریت" subtitle="دسترسی محدود">
        <p className="rounded-2xl border border-border bg-card p-10 text-center text-muted-foreground">
          حساب شما دسترسی مدیریت ندارد.
        </p>
      </PanelShell>
    );
  }

  return (
    <PanelShell title="پنل مدیریت رساله" subtitle="مدیریت درخواست‌های مشاوره، پژوهشگران، پروژه‌ها و پرداخت‌ها">
      <div className="mb-6 grid gap-4 sm:grid-cols-4">
        <StatCard label="درخواست مشاوره" value={toFa(leads.length)} />
        <StatCard label="پژوهشگران" value={toFa(researchers.length)} />
        <StatCard label="پروژه‌ها" value={toFa(requests.length)} />
        <StatCard label="پرداخت‌ها" value={toFa(payments.length)} />
      </div>

      <Tabs defaultValue="leads">
        <TabsList>
          <TabsTrigger value="leads">مشاوره‌ها</TabsTrigger>
          <TabsTrigger value="researchers">پژوهشگران</TabsTrigger>
          <TabsTrigger value="projects">پروژه‌ها</TabsTrigger>
          <TabsTrigger value="payments">پرداخت‌ها</TabsTrigger>
        </TabsList>

        <TabsContent value="leads" className="mt-6 overflow-x-auto rounded-2xl border border-border bg-card">
          <table className="w-full text-right text-sm">
            <thead className="bg-surface text-xs text-muted-foreground">
              <tr><th className="p-3">نام</th><th className="p-3">موبایل</th><th className="p-3">رشته</th><th className="p-3">وضعیت</th><th className="p-3" /></tr>
            </thead>
            <tbody>
              {leads.length === 0 && <tr><td colSpan={5} className="p-6 text-center text-muted-foreground">موردی ثبت نشده است.</td></tr>}
              {leads.map((l) => (
                <tr key={l.id} className="border-t border-border">
                  <td className="p-3">{l.full_name}</td>
                  <td className="p-3" dir="ltr">{l.mobile}</td>
                  <td className="p-3">{l.field_slug ? fieldName(l.field_slug) : "—"}</td>
                  <td className="p-3">{STATUS_FA[l.status] ?? l.status}</td>
                  <td className="p-3">
                    <Button size="sm" variant="outline" onClick={() => setLeadStatus(l.id, l.status === "new" ? "contacted" : "closed")}>
                      {l.status === "new" ? "پیگیری شد" : "بستن"}
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </TabsContent>

        <TabsContent value="researchers" className="mt-6 overflow-x-auto rounded-2xl border border-border bg-card">
          <table className="w-full text-right text-sm">
            <thead className="bg-surface text-xs text-muted-foreground">
              <tr><th className="p-3">نام</th><th className="p-3">مدرک</th><th className="p-3">حوزه</th><th className="p-3">وضعیت</th><th className="p-3" /></tr>
            </thead>
            <tbody>
              {researchers.map((r) => (
                <tr key={r.id} className="border-t border-border">
                  <td className="p-3">{r.display_name}</td>
                  <td className="p-3">{r.degree}</td>
                  <td className="p-3">{fieldName(r.field_slug)}</td>
                  <td className="p-3">{r.approved ? "تأیید شده" : "در انتظار"}</td>
                  <td className="p-3">
                    <Button size="sm" variant={r.approved ? "ghost" : "default"} onClick={() => setApproved(r.id, !r.approved)}>
                      {r.approved ? "لغو تأیید" : "تأیید"}
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </TabsContent>

        <TabsContent value="projects" className="mt-6 overflow-x-auto rounded-2xl border border-border bg-card">
          <table className="w-full text-right text-sm">
            <thead className="bg-surface text-xs text-muted-foreground">
              <tr><th className="p-3">موضوع</th><th className="p-3">مقطع</th><th className="p-3">حوزه</th><th className="p-3">وضعیت</th></tr>
            </thead>
            <tbody>
              {requests.length === 0 && <tr><td colSpan={4} className="p-6 text-center text-muted-foreground">پروژه‌ای ثبت نشده است.</td></tr>}
              {requests.map((r) => (
                <tr key={r.id} className="border-t border-border">
                  <td className="p-3">{r.topic}</td>
                  <td className="p-3">{r.academic_level}</td>
                  <td className="p-3">{fieldName(r.field_slug)}</td>
                  <td className="p-3">{STATUS_FA[r.status] ?? r.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </TabsContent>

        <TabsContent value="payments" className="mt-6 overflow-x-auto rounded-2xl border border-border bg-card">
          <table className="w-full text-right text-sm">
            <thead className="bg-surface text-xs text-muted-foreground">
              <tr><th className="p-3">مرحله</th><th className="p-3">مبلغ (تومان)</th><th className="p-3">وضعیت</th><th className="p-3" /></tr>
            </thead>
            <tbody>
              {payments.length === 0 && <tr><td colSpan={4} className="p-6 text-center text-muted-foreground">پرداختی ثبت نشده است.</td></tr>}
              {payments.map((p) => (
                <tr key={p.id} className="border-t border-border">
                  <td className="p-3">{p.milestone}</td>
                  <td className="p-3 font-bold">{toFa(p.amount)}</td>
                  <td className="p-3">{STATUS_FA[p.status] ?? p.status}</td>
                  <td className="p-3">
                    {p.status !== "paid" && (
                      <Button size="sm" variant="outline" onClick={() => setPaymentStatus(p.id, "paid")}>ثبت پرداخت</Button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </TabsContent>
      </Tabs>
    </PanelShell>
  );
}
