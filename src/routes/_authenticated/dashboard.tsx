import { createFileRoute, Link } from "@tanstack/react-router";
import { useCallback, useEffect, useState } from "react";
import { Loader2, Send } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PanelShell, StatCard, STATUS_FA } from "@/components/panel/PanelShell";
import { fieldName, SERVICES, toFa } from "@/lib/data";

export const Route = createFileRoute("/_authenticated/dashboard")({
  component: StudentDashboard,
  head: () => ({
    meta: [
      { title: "پنل دانشجو | رساله" },
      { name: "description", content: "مدیریت درخواست‌های پژوهشی، پیشنهادهای دریافتی و پرداخت‌های پروژه در پنل دانشجویی رساله." },
      { property: "og:title", content: "پنل دانشجو رساله" },
      { property: "og:description", content: "درخواست‌ها، پیشنهادها و پرداخت‌های خود را مدیریت کنید." },
      { property: "og:url", content: "/dashboard" },
      { name: "robots", content: "noindex" },
    ],
  }),
});

type Req = {
  id: string;
  topic: string;
  field_slug: string;
  service_slug: string;
  academic_level: string;
  status: string;
  estimate_min: number | null;
  estimate_max: number | null;
  created_at: string;
};
type Proposal = { id: string; request_id: string; price: number; delivery_days: number; message: string | null; status: string; researcher_id: string };
type Payment = { id: string; request_id: string; amount: number; milestone: string; status: string; created_at: string };
type Profile = { full_name: string; mobile: string | null; university: string | null; academic_level: string | null; major: string | null };

const serviceName = (slug: string) => SERVICES.find((s) => s.slug === slug)?.title ?? slug;

function StudentDashboard() {
  const [loading, setLoading] = useState(true);
  const [requests, setRequests] = useState<Req[]>([]);
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [profile, setProfile] = useState<Profile>({ full_name: "", mobile: "", university: "", academic_level: "", major: "" });
  const [saving, setSaving] = useState(false);
  const [note, setNote] = useState("");

  const load = useCallback(async () => {
    const { data: userData } = await supabase.auth.getUser();
    const uid = userData.user?.id;
    if (!uid) return;
    const [{ data: reqs }, { data: pays }, { data: prof }] = await Promise.all([
      supabase.from("thesis_requests").select("*").eq("student_id", uid).order("created_at", { ascending: false }),
      supabase.from("payments").select("*").eq("student_id", uid).order("created_at", { ascending: false }),
      supabase.from("profiles").select("full_name, mobile, university, academic_level, major").eq("id", uid).maybeSingle(),
    ]);
    setRequests((reqs ?? []) as Req[]);
    setPayments((pays ?? []) as Payment[]);
    if (prof) setProfile(prof as Profile);
    const ids = (reqs ?? []).map((r) => r.id);
    if (ids.length) {
      const { data: props } = await supabase.from("proposals").select("*").in("request_id", ids);
      setProposals((props ?? []) as Proposal[]);
    } else {
      setProposals([]);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const acceptProposal = async (p: Proposal) => {
    await supabase.from("proposals").update({ status: "accepted" }).eq("id", p.id);
    await supabase.from("thesis_requests").update({ status: "in_progress" }).eq("id", p.request_id);
    await supabase.from("payments").insert({
      request_id: p.request_id,
      student_id: (await supabase.auth.getUser()).data.user!.id,
      amount: Math.round(p.price * 0.4),
      milestone: "پیش‌پرداخت مرحله اول (۴۰٪)",
    });
    setNote("پیشنهاد پذیرفته شد و صورت‌حساب مرحله اول ایجاد شد.");
    void load();
  };

  const saveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const uid = (await supabase.auth.getUser()).data.user!.id;
    await supabase.from("profiles").update(profile).eq("id", uid);
    setSaving(false);
    setNote("پروفایل به‌روزرسانی شد.");
  };

  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <Loader2 className="size-6 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <PanelShell title="پنل دانشجو" subtitle="درخواست‌ها، پیشنهادهای دریافتی و پرداخت‌های پروژه شما">
      <div className="mb-6 grid gap-4 sm:grid-cols-3">
        <StatCard label="درخواست‌های ثبت‌شده" value={toFa(requests.length)} />
        <StatCard label="پیشنهادهای دریافتی" value={toFa(proposals.length)} />
        <StatCard label="پروژه‌های در جریان" value={toFa(requests.filter((r) => r.status === "in_progress").length)} />
      </div>

      {note && <p className="mb-4 rounded-lg bg-secondary p-3 text-sm">{note}</p>}

      <Tabs defaultValue="requests">
        <TabsList>
          <TabsTrigger value="requests">درخواست‌ها</TabsTrigger>
          <TabsTrigger value="payments">پرداخت‌ها</TabsTrigger>
          <TabsTrigger value="profile">پروفایل</TabsTrigger>
        </TabsList>

        <TabsContent value="requests" className="mt-6 space-y-5">
          {requests.length === 0 && (
            <div className="rounded-2xl border border-dashed border-border bg-card p-10 text-center">
              <p className="text-muted-foreground">هنوز درخواستی ثبت نکرده‌اید.</p>
              <Button className="mt-4" asChild>
                <Link to="/request">ثبت اولین درخواست</Link>
              </Button>
            </div>
          )}
          {requests.map((r) => {
            const rp = proposals.filter((p) => p.request_id === r.id);
            return (
              <article key={r.id} className="rounded-2xl border border-border bg-card p-5 shadow-[var(--shadow-card)]">
                <div className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-3">
                  <div className="min-w-0">
                    <h3 className="truncate text-lg font-bold">{r.topic}</h3>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {fieldName(r.field_slug)} • {serviceName(r.service_slug)} • {r.academic_level}
                    </p>
                  </div>
                  <span className="shrink-0 rounded-full bg-secondary px-3 py-1 text-xs font-bold">
                    {STATUS_FA[r.status] ?? r.status}
                  </span>
                </div>
                {r.estimate_min && (
                  <p className="mt-3 text-sm">
                    بازه تخمینی: <b>{toFa(r.estimate_min)}</b> تا <b>{toFa(r.estimate_max ?? 0)}</b> تومان
                  </p>
                )}

                <div className="mt-4 space-y-3 border-t border-border pt-4">
                  <p className="text-sm font-bold">پیشنهادهای پژوهشگران ({toFa(rp.length)})</p>
                  {rp.length === 0 && <p className="text-xs text-muted-foreground">هنوز پیشنهادی ثبت نشده است.</p>}
                  {rp.map((p) => (
                    <div key={p.id} className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 rounded-xl border border-border p-3">
                      <div className="min-w-0">
                        <p className="text-sm font-semibold">
                          {toFa(p.price)} تومان • تحویل در {toFa(p.delivery_days)} روز
                        </p>
                        {p.message && <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">{p.message}</p>}
                      </div>
                      {p.status === "pending" ? (
                        <Button size="sm" className="shrink-0" onClick={() => acceptProposal(p)}>
                          پذیرش
                        </Button>
                      ) : (
                        <span className="shrink-0 text-xs font-bold text-primary">{STATUS_FA[p.status]}</span>
                      )}
                    </div>
                  ))}
                </div>

                <Messages requestId={r.id} />
              </article>
            );
          })}
        </TabsContent>

        <TabsContent value="payments" className="mt-6">
          <div className="overflow-x-auto rounded-2xl border border-border bg-card">
            <table className="w-full text-right text-sm">
              <thead className="bg-surface text-xs text-muted-foreground">
                <tr>
                  <th className="p-3">مرحله</th>
                  <th className="p-3">مبلغ (تومان)</th>
                  <th className="p-3">وضعیت</th>
                </tr>
              </thead>
              <tbody>
                {payments.length === 0 && (
                  <tr><td colSpan={3} className="p-6 text-center text-muted-foreground">پرداختی ثبت نشده است.</td></tr>
                )}
                {payments.map((p) => (
                  <tr key={p.id} className="border-t border-border">
                    <td className="p-3">{p.milestone}</td>
                    <td className="p-3 font-bold">{toFa(p.amount)}</td>
                    <td className="p-3">{STATUS_FA[p.status] ?? p.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </TabsContent>

        <TabsContent value="profile" className="mt-6">
          <form onSubmit={saveProfile} className="grid max-w-2xl gap-4 rounded-2xl border border-border bg-card p-6 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="p-name">نام و نام خانوادگی</Label>
              <Input id="p-name" value={profile.full_name} onChange={(e) => setProfile({ ...profile, full_name: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="p-mobile">موبایل</Label>
              <Input id="p-mobile" dir="ltr" value={profile.mobile ?? ""} onChange={(e) => setProfile({ ...profile, mobile: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="p-uni">دانشگاه</Label>
              <Input id="p-uni" value={profile.university ?? ""} onChange={(e) => setProfile({ ...profile, university: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="p-major">رشته تحصیلی</Label>
              <Input id="p-major" value={profile.major ?? ""} onChange={(e) => setProfile({ ...profile, major: e.target.value })} />
            </div>
            <div className="sm:col-span-2">
              <Button type="submit" disabled={saving}>
                {saving && <Loader2 className="size-4 animate-spin" />} ذخیره تغییرات
              </Button>
            </div>
          </form>
        </TabsContent>
      </Tabs>
    </PanelShell>
  );
}

function Messages({ requestId }: { requestId: string }) {
  const [items, setItems] = useState<{ id: string; body: string; sender_id: string; created_at: string }[]>([]);
  const [text, setText] = useState("");

  const load = useCallback(async () => {
    const { data } = await supabase.from("messages").select("*").eq("request_id", requestId).order("created_at");
    setItems((data ?? []) as typeof items);
  }, [requestId]);

  useEffect(() => {
    void load();
  }, [load]);

  const send = async () => {
    if (text.trim().length < 2) return;
    const uid = (await supabase.auth.getUser()).data.user!.id;
    await supabase.from("messages").insert({ request_id: requestId, sender_id: uid, body: text.trim() });
    setText("");
    void load();
  };

  return (
    <div className="mt-4 border-t border-border pt-4">
      <p className="text-sm font-bold">گفت‌وگوی پروژه</p>
      <div className="mt-2 space-y-2">
        {items.map((m) => (
          <p key={m.id} className="rounded-lg bg-surface p-2 text-xs">{m.body}</p>
        ))}
      </div>
      <div className="mt-3 flex gap-2">
        <Textarea rows={1} value={text} maxLength={500} onChange={(e) => setText(e.target.value)} placeholder="پیام خود را بنویسید..." />
        <Button size="icon" onClick={send} aria-label="ارسال پیام">
          <Send className="size-4" />
        </Button>
      </div>
    </div>
  );
}
