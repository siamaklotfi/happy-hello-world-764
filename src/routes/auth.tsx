import { createFileRoute, useNavigate, useSearch } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { GraduationCap, Loader2, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable/index";
import { LEVELS } from "@/lib/data";

type Search = { next?: string };

export const Route = createFileRoute("/auth")({
  ssr: false,
  validateSearch: (search: Record<string, unknown>): Search =>
    typeof search["next"] === "string" && search["next"].startsWith("/") ? { next: search["next"] } : {},
  component: AuthPage,
  head: () => ({
    meta: [
      { title: "ورود و ثبت‌نام | رساله" },
      { name: "description", content: "ورود دانشجویان و پژوهشگران به پنل کاربری رساله برای مدیریت درخواست‌ها و پروژه‌های پژوهشی." },
      { property: "og:title", content: "ورود و ثبت‌نام در رساله" },
      { property: "og:description", content: "به حساب کاربری رساله وارد شوید یا حساب دانشجو / پژوهشگر بسازید." },
      { property: "og:url", content: "/auth" },
      { name: "robots", content: "noindex" },
    ],
    links: [{ rel: "canonical", href: "/auth" }],
  }),
});

function AuthPage() {
  const navigate = useNavigate();
  const search = useSearch({ from: "/auth" });
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  const [signIn, setSignIn] = useState({ email: "", password: "" });
  const [signUp, setSignUp] = useState({
    email: "",
    password: "",
    fullName: "",
    mobile: "",
    role: "student",
    university: "",
    level: "",
    major: "",
  });

  const go = () => navigate({ to: search.next ?? "/dashboard", replace: true });

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (data.user) go();
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError("");
    const { error: err } = await supabase.auth.signInWithPassword({
      email: signIn.email.trim(),
      password: signIn.password,
    });
    setBusy(false);
    if (err) return setError("ایمیل یا رمز عبور نادرست است.");
    go();
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (signUp.fullName.trim().length < 3) return setError("نام و نام خانوادگی را کامل وارد کنید.");
    if (signUp.password.length < 6) return setError("رمز عبور باید حداقل ۶ کاراکتر باشد.");
    setBusy(true);
    setError("");
    const { data, error: err } = await supabase.auth.signUp({
      email: signUp.email.trim(),
      password: signUp.password,
      options: {
        emailRedirectTo: window.location.origin + "/auth",
        data: {
          full_name: signUp.fullName.trim(),
          mobile: signUp.mobile.trim(),
          role: signUp.role,
          university: signUp.university.trim(),
          academic_level: signUp.level,
          major: signUp.major.trim(),
        },
      },
    });
    setBusy(false);
    if (err) return setError(err.message.includes("already") ? "این ایمیل قبلاً ثبت شده است." : "ثبت‌نام انجام نشد، دوباره تلاش کنید.");
    if (!data.session) {
      setNotice("ثبت‌نام انجام شد. برای فعال‌سازی حساب، لینک ارسال‌شده به ایمیل خود را باز کنید.");
      return;
    }
    navigate({ to: signUp.role === "researcher" ? "/researcher-panel" : "/dashboard", replace: true });
  };

  const google = async () => {
    setError("");
    const result = await lovable.auth.signInWithOAuth("google", { redirect_uri: window.location.origin + "/auth" });
    if (result.error) return setError("ورود با گوگل انجام نشد.");
    if (result.redirected) return;
    go();
  };

  return (
    <div className="container-page grid gap-10 py-14 lg:grid-cols-[minmax(0,1fr)_460px]">
      <div className="hidden lg:block">
        <h1 className="text-3xl font-black">به رساله خوش آمدید</h1>
        <p className="mt-4 max-w-md leading-8 text-muted-foreground">
          با ساخت حساب کاربری می‌توانید درخواست‌های پژوهشی خود را ثبت کنید، پیشنهاد پژوهشگران را مقایسه کنید و
          مراحل پروژه را تا تحویل نهایی دنبال کنید.
        </p>
        <ul className="mt-8 space-y-4 text-sm">
          <li className="flex items-start gap-3 rounded-xl border border-border bg-card p-4">
            <GraduationCap className="mt-0.5 size-5 shrink-0 text-primary" />
            <span>
              <b className="block">حساب دانشجو</b>
              ثبت درخواست، دریافت پیشنهاد قیمت و مدیریت مراحل پروژه.
            </span>
          </li>
          <li className="flex items-start gap-3 rounded-xl border border-border bg-card p-4">
            <ShieldCheck className="mt-0.5 size-5 shrink-0 text-primary" />
            <span>
              <b className="block">حساب پژوهشگر</b>
              تکمیل پروفایل تخصصی، مشاهده درخواست‌های باز و ارسال پیشنهاد همکاری.
            </span>
          </li>
        </ul>
      </div>

      <div className="rounded-2xl border border-border bg-card p-6 shadow-[var(--shadow-card)]">
        <Tabs defaultValue="signin">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="signin">ورود</TabsTrigger>
            <TabsTrigger value="signup">ثبت‌نام</TabsTrigger>
          </TabsList>

          <TabsContent value="signin" className="mt-6">
            <form onSubmit={handleSignIn} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="si-email">ایمیل</Label>
                <Input id="si-email" type="email" dir="ltr" required value={signIn.email} onChange={(e) => setSignIn({ ...signIn, email: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="si-pass">رمز عبور</Label>
                <Input id="si-pass" type="password" dir="ltr" required value={signIn.password} onChange={(e) => setSignIn({ ...signIn, password: e.target.value })} />
              </div>
              <Button type="submit" className="w-full" disabled={busy}>
                {busy && <Loader2 className="size-4 animate-spin" />} ورود به حساب
              </Button>
            </form>
          </TabsContent>

          <TabsContent value="signup" className="mt-6">
            <form onSubmit={handleSignUp} className="space-y-4">
              <div className="space-y-2">
                <Label>نوع حساب</Label>
                <Select value={signUp.role} onValueChange={(v) => setSignUp({ ...signUp, role: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="student">دانشجو</SelectItem>
                    <SelectItem value="researcher">پژوهشگر</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="su-name">نام و نام خانوادگی</Label>
                  <Input id="su-name" maxLength={80} required value={signUp.fullName} onChange={(e) => setSignUp({ ...signUp, fullName: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="su-mobile">موبایل</Label>
                  <Input id="su-mobile" dir="ltr" maxLength={11} value={signUp.mobile} onChange={(e) => setSignUp({ ...signUp, mobile: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="su-email">ایمیل</Label>
                  <Input id="su-email" type="email" dir="ltr" required value={signUp.email} onChange={(e) => setSignUp({ ...signUp, email: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="su-pass">رمز عبور</Label>
                  <Input id="su-pass" type="password" dir="ltr" required value={signUp.password} onChange={(e) => setSignUp({ ...signUp, password: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="su-uni">دانشگاه</Label>
                  <Input id="su-uni" maxLength={80} value={signUp.university} onChange={(e) => setSignUp({ ...signUp, university: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <Label>مقطع تحصیلی</Label>
                  <Select value={signUp.level} onValueChange={(v) => setSignUp({ ...signUp, level: v })}>
                    <SelectTrigger><SelectValue placeholder="انتخاب کنید" /></SelectTrigger>
                    <SelectContent>{LEVELS.map((l) => <SelectItem key={l} value={l}>{l}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="su-major">رشته تحصیلی</Label>
                <Input id="su-major" maxLength={80} value={signUp.major} onChange={(e) => setSignUp({ ...signUp, major: e.target.value })} />
              </div>
              <Button type="submit" className="w-full" disabled={busy}>
                {busy && <Loader2 className="size-4 animate-spin" />} ساخت حساب کاربری
              </Button>
            </form>
          </TabsContent>
        </Tabs>

        <div className="my-5 flex items-center gap-3 text-xs text-muted-foreground">
          <span className="h-px flex-1 bg-border" /> یا <span className="h-px flex-1 bg-border" />
        </div>
        <Button variant="outline" className="w-full" onClick={google}>
          ورود با حساب گوگل
        </Button>

        {error && <p className="mt-4 rounded-lg bg-destructive/10 p-3 text-sm text-destructive">{error}</p>}
        {notice && <p className="mt-4 rounded-lg bg-secondary p-3 text-sm text-foreground">{notice}</p>}
      </div>
    </div>
  );
}
