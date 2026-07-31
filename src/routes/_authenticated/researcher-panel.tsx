import { createFileRoute } from "@tanstack/react-router";
import { useCallback, useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PanelShell, StatCard, STATUS_FA } from "@/components/panel/PanelShell";
import { FIELDS, SERVICES, fieldName, toFa } from "@/lib/data";

export const Route = createFileRoute("/_authenticated/researcher-panel")({
  component: ResearcherPanel,
  head: () => ({
    meta: [
      { title: "پنل پژوهشگر | رساله" },
      { name: "description", content: "تکمیل پروفایل تخصصی، مشاهده درخواست‌های باز دانشجویان و ارسال پیشنهاد همکاری در پنل پژوهشگران رساله." },
      { property: "og:title", content: "پنل پژوهشگر رساله" },
      { property: "og:description", content: "پروفایل تخصصی خود را کامل کنید و پیشنهاد همکاری ارسال کنید." },
      { property: "og:url", content: "/researcher-panel" },
      { name: "robots", content: "noindex" },
    ],
  }),
});

type RProfile = {
  id?: string;
  display_name: string;
  degree: string;
  university: string;
  field_slug: string;
  major: string;
  specialties: string;
  research_interests: string;
  experience_years: number;
  publications: string;
  skills: string;
  bio: string;
  portfolio: string;
  hourly_price: number;
  approved?: boolean;
};

const EMPTY: RProfile = {
  display_name: "",
  degree: "کارشناسی ارشد",
  university: "",
  field_slug: "engineering",
  major: "",
  specialties: "",
  research_interests: "",
  experience_years: 1,
  publications: "",
  skills: "",
  bio: "",
  portfolio: "",
  hourly_price: 500000,
};

const toArr = (s: string) => s.split("\n").map((v) => v.trim()).filter(Boolean);
const serviceName = (slug: string) => SERVICES.find((s) => s.slug === slug)?.title ?? slug;

function ResearcherPanel() {
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<RProfile>(EMPTY);
  const [approved, setApproved] = useState(false);
  const [hasProfile, setHasProfile] = useState(false);
  const [openRequests, setOpenRequests] = useState<any[]>([]);
  const [myProposals, setMyProposals] = useState<any[]>([]);
  const [note, setNote] = useState("");
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    const uid = (await supabase.auth.getUser()).data.user?.id;
    if (!uid) return;
    const [{ data: rp }, { data: reqs }, { data: props }] = await Promise.all([
      supabase.from("researcher_profiles").select("*").eq("user_id", uid).maybeSingle(),
      supabase.from("thesis_requests").select("*").eq("status", "open").order("created_at", { ascending: false }).limit(30),
      supabase.from("proposals").select("*").eq("researcher_id", uid).order("created_at", { ascending: false }),
    ]);
    if (rp) {
      setHasProfile(true);
      setApproved(rp.approved);
      setProfile({
        id: rp.id,
        display_name: rp.display_name,
        degree: rp.degree,
        university: rp.university ?? "",
        field_slug: rp.field_slug,
        major: rp.major ?? "",
        specialties: (rp.specialties ?? []).join("\n"),
        research_interests: rp.research_interests ?? "",
        experience_years: rp.experience_years,
        publications: (rp.publications ?? []).join("\n"),
        skills: (rp.skills ?? []).join("\n"),
        bio: rp.bio ?? "",
        portfolio: (rp.portfolio ?? []).join("\n"),
        hourly_price: Number(rp.hourly_price),
      });
    }
    setOpenRequests(reqs ?? []);
    setMyProposals(props ?? []);
    setLoading(false);
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    if (profile.display_name.trim().length < 3) return setNote("نام نمایشی را کامل وارد کنید.");
    setSaving(true);
    const uid = (await supabase.auth.getUser()).data.user!.id;
    const payload = {
      user_id: uid,
      slug: profile.id ? undefined : `r-${uid.slice(0, 8)}`,
      display_name: profile.display_name.trim(),
      degree: profile.degree,
      university: profile.university,
      field_slug: profile.field_slug,
      major: profile.major,
      specialties: toArr(profile.specialties),
      research_interests: profile.research_interests,
      experience_years: Number(profile.experience_years) || 0,
      publications: toArr(profile.publications),
      skills: toArr(profile.skills),
      bio: profile.bio,
      portfolio: toArr(profile.portfolio),
      hourly_price: Number(profile.hourly_price) || 0,
    };
    if (hasProfile) {
      const { slug: _slug, ...rest } = payload;
      await supabase.from("researcher_profiles").update(rest).eq("user_id", uid);
    } else {
      await supabase.from("researcher_profiles").insert(payload as never);
    }
    setSaving(false);
    setNote("پروفایل ذخیره شد. پس از تأیید مدیر در بازارگاه نمایش داده می‌شود.");
    void load();
  };

  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <Loader2 className="size-6 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <PanelShell title="پنل پژوهشگر" subtitle="پروفایل تخصصی، درخواست‌های باز و پیشنهادهای شما">
      <div className="mb-6 grid gap-4 sm:grid-cols-3">
        <StatCard label="وضعیت پروفایل" value={hasProfile ? (approved ? "تأیید شده" : "در انتظار تأیید") : "تکمیل نشده"} />
        <StatCard label="درخواست‌های باز" value={toFa(openRequests.length)} />
        <StatCard label="پیشنهادهای ارسالی" value={toFa(myProposals.length)} />
      </div>

      {note && <p className="mb-4 rounded-lg bg-secondary p-3 text-sm">{note}</p>}

      <Tabs defaultValue="profile">
        <TabsList>
          <TabsTrigger value="profile">پروفایل تخصصی</TabsTrigger>
          <TabsTrigger value="market">درخواست‌های باز</TabsTrigger>
          <TabsTrigger value="proposals">پیشنهادهای من</TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="mt-6">
          <form onSubmit={save} className="grid gap-4 rounded-2xl border border-border bg-card p-6 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="rp-name">نام نمایشی</Label>
              <Input id="rp-name" value={profile.display_name} onChange={(e) => setProfile({ ...profile, display_name: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label>مدرک تحصیلی</Label>
              <Select value={profile.degree} onValueChange={(v) => setProfile({ ...profile, degree: v })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {["کارشناسی ارشد", "دانشجوی دکتری", "دکتری", "استادیار", "دانشیار"].map((d) => (
                    <SelectItem key={d} value={d}>{d}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="rp-uni">دانشگاه</Label>
              <Input id="rp-uni" value={profile.university} onChange={(e) => setProfile({ ...profile, university: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label>حوزه تخصصی</Label>
              <Select value={profile.field_slug} onValueChange={(v) => setProfile({ ...profile, field_slug: v })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>{FIELDS.map((f) => <SelectItem key={f.slug} value={f.slug}>{f.name}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="rp-major">رشته / گرایش</Label>
              <Input id="rp-major" value={profile.major} onChange={(e) => setProfile({ ...profile, major: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="rp-exp">سابقه پژوهشی (سال)</Label>
              <Input id="rp-exp" type="number" min={0} max={50} value={profile.experience_years} onChange={(e) => setProfile({ ...profile, experience_years: Number(e.target.value) })} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="rp-price">تعرفه ساعتی (تومان)</Label>
              <Input id="rp-price" type="number" min={0} step={50000} value={profile.hourly_price} onChange={(e) => setProfile({ ...profile, hourly_price: Number(e.target.value) })} />
            </div>
            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="rp-spec">تخصص‌ها (هر مورد در یک خط)</Label>
              <Textarea id="rp-spec" rows={3} value={profile.specialties} onChange={(e) => setProfile({ ...profile, specialties: e.target.value })} />
            </div>
            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="rp-int">زمینه‌های پژوهشی مورد علاقه</Label>
              <Textarea id="rp-int" rows={2} value={profile.research_interests} onChange={(e) => setProfile({ ...profile, research_interests: e.target.value })} />
            </div>
            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="rp-pub">مقالات و انتشارات (هر مورد در یک خط)</Label>
              <Textarea id="rp-pub" rows={3} value={profile.publications} onChange={(e) => setProfile({ ...profile, publications: e.target.value })} />
            </div>
            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="rp-skills">مهارت‌های نرم‌افزاری (هر مورد در یک خط)</Label>
              <Textarea id="rp-skills" rows={3} value={profile.skills} onChange={(e) => setProfile({ ...profile, skills: e.target.value })} />
            </div>
            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="rp-port">نمونه‌کارها (هر مورد در یک خط)</Label>
              <Textarea id="rp-port" rows={3} value={profile.portfolio} onChange={(e) => setProfile({ ...profile, portfolio: e.target.value })} />
            </div>
            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="rp-bio">درباره من</Label>
              <Textarea id="rp-bio" rows={4} value={profile.bio} onChange={(e) => setProfile({ ...profile, bio: e.target.value })} />
            </div>
            <div className="sm:col-span-2">
              <Button type="submit" disabled={saving}>
                {saving && <Loader2 className="size-4 animate-spin" />} ذخیره پروفایل
              </Button>
            </div>
          </form>
        </TabsContent>

        <TabsContent value="market" className="mt-6 space-y-4">
          {openRequests.length === 0 && (
            <p className="rounded-2xl border border-dashed border-border bg-card p-10 text-center text-muted-foreground">
              در حال حاضر درخواست بازی وجود ندارد.
            </p>
          )}
          {openRequests.map((r) => (
            <OpenRequestCard key={r.id} request={r} onSent={load} sent={myProposals.some((p) => p.request_id === r.id)} />
          ))}
        </TabsContent>

        <TabsContent value="proposals" className="mt-6">
          <div className="overflow-x-auto rounded-2xl border border-border bg-card">
            <table className="w-full text-right text-sm">
              <thead className="bg-surface text-xs text-muted-foreground">
                <tr>
                  <th className="p-3">قیمت (تومان)</th>
                  <th className="p-3">زمان تحویل</th>
                  <th className="p-3">وضعیت</th>
                </tr>
              </thead>
              <tbody>
                {myProposals.length === 0 && (
                  <tr><td colSpan={3} className="p-6 text-center text-muted-foreground">پیشنهادی ارسال نکرده‌اید.</td></tr>
                )}
                {myProposals.map((p) => (
                  <tr key={p.id} className="border-t border-border">
                    <td className="p-3 font-bold">{toFa(p.price)}</td>
                    <td className="p-3">{toFa(p.delivery_days)} روز</td>
                    <td className="p-3">{STATUS_FA[p.status] ?? p.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </TabsContent>
      </Tabs>
    </PanelShell>
  );
}

function OpenRequestCard({ request, onSent, sent }: { request: any; onSent: () => void; sent: boolean }) {
  const [price, setPrice] = useState("");
  const [days, setDays] = useState("");
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);

  const submit = async () => {
    if (!price || !days) return;
    setBusy(true);
    const uid = (await supabase.auth.getUser()).data.user!.id;
    await supabase.from("proposals").insert({
      request_id: request.id,
      researcher_id: uid,
      price: Number(price),
      delivery_days: Number(days),
      message: message.trim(),
    });
    setBusy(false);
    onSent();
  };

  return (
    <article className="rounded-2xl border border-border bg-card p-5">
      <h3 className="text-lg font-bold">{request.topic}</h3>
      <p className="mt-1 text-xs text-muted-foreground">
        {fieldName(request.field_slug)} • {serviceName(request.service_slug)} • {request.academic_level} • فوریت: {request.urgency}
      </p>
      {request.description && <p className="mt-3 text-sm leading-7 text-muted-foreground">{request.description}</p>}
      {sent ? (
        <p className="mt-4 text-sm font-bold text-primary">پیشنهاد شما برای این درخواست ثبت شده است.</p>
      ) : (
        <div className="mt-4 grid gap-3 border-t border-border pt-4 sm:grid-cols-[160px_140px_minmax(0,1fr)_auto]">
          <Input placeholder="قیمت (تومان)" type="number" value={price} onChange={(e) => setPrice(e.target.value)} />
          <Input placeholder="روز تحویل" type="number" value={days} onChange={(e) => setDays(e.target.value)} />
          <Input placeholder="توضیح کوتاه" maxLength={300} value={message} onChange={(e) => setMessage(e.target.value)} />
          <Button onClick={submit} disabled={busy}>ارسال پیشنهاد</Button>
        </div>
      )}
    </article>
  );
}
