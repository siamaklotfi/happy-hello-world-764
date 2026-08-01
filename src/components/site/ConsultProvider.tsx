import { createContext, useContext, useState, type ReactNode } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FIELDS, LEVELS, SERVICES } from "@/lib/data";
import { supabase } from "@/integrations/supabase/client";
import { CheckCircle2, MessageCircleQuestion } from "lucide-react";

type Ctx = { open: () => void };
const ConsultCtx = createContext<Ctx>({ open: () => {} });
export const useConsult = () => useContext(ConsultCtx);

export function ConsultProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    name: "",
    mobile: "",
    level: "",
    field: "",
    service: "",
    description: "",
  });

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (form.name.trim().length < 3) return setError("نام و نام خانوادگی را کامل وارد کنید.");
    if (!/^09\d{9}$/.test(form.mobile.trim())) return setError("شماره موبایل معتبر نیست (مثال: 09121234567).");
    if (!form.level || !form.field || !form.service) return setError("مقطع، رشته و نوع خدمت را انتخاب کنید.");
    setError("");
    const newId = crypto.randomUUID();
    const { error: err } = await supabase.from("consultations").insert({
      id: newId,
      full_name: form.name.trim(),
      mobile: form.mobile.trim(),
      academic_level: form.level,
      field_slug: form.field,
      service_slug: form.service,
      description: form.description.trim(),
    });
    if (err) return setError("ثبت درخواست انجام نشد؛ دوباره تلاش کنید.");
    void notifyNewLead({ data: { kind: "consultation", id: newId } }).catch(() => {});


    setForm({ name: "", mobile: "", level: "", field: "", service: "", description: "" });
    setSent(true);
  };

  const close = (v: boolean) => {
    setIsOpen(v);
    if (!v) setTimeout(() => setSent(false), 200);
  };

  return (
    <ConsultCtx.Provider value={{ open: () => setIsOpen(true) }}>
      {children}

      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-5 left-5 z-50 inline-flex items-center gap-2 rounded-full bg-accent px-5 py-3 text-sm font-bold text-accent-foreground shadow-[var(--shadow-lift)] transition-transform hover:scale-105"
      >
        <MessageCircleQuestion className="size-5" />
        مشاوره رایگان
      </button>

      <Dialog open={isOpen} onOpenChange={close}>
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg" dir="rtl">
          {sent ? (
            <div className="py-8 text-center">
              <CheckCircle2 className="mx-auto size-14 text-primary" />
              <h3 className="mt-4 text-xl font-bold">درخواست شما ثبت شد</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                کارشناسان رساله طی کمتر از ۲ ساعت کاری با شما تماس می‌گیرند.
              </p>
              <Button className="mt-6" onClick={() => close(false)}>
                بستن
              </Button>
            </div>
          ) : (
            <>
              <DialogHeader className="text-right">
                <DialogTitle>دریافت مشاوره رایگان</DialogTitle>
                <DialogDescription>
                  اطلاعات زیر را تکمیل کنید تا مناسب‌ترین پژوهشگر به شما معرفی شود.
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={submit} className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="c-name">نام و نام خانوادگی</Label>
                    <Input id="c-name" maxLength={80} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="c-mobile">شماره موبایل</Label>
                    <Input id="c-mobile" inputMode="numeric" maxLength={11} value={form.mobile} onChange={(e) => setForm({ ...form, mobile: e.target.value })} />
                  </div>
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label>مقطع تحصیلی</Label>
                    <Select value={form.level} onValueChange={(v) => setForm({ ...form, level: v })}>
                      <SelectTrigger><SelectValue placeholder="انتخاب کنید" /></SelectTrigger>
                      <SelectContent>
                        {LEVELS.map((l) => <SelectItem key={l} value={l}>{l}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>رشته تحصیلی</Label>
                    <Select value={form.field} onValueChange={(v) => setForm({ ...form, field: v })}>
                      <SelectTrigger><SelectValue placeholder="انتخاب کنید" /></SelectTrigger>
                      <SelectContent>
                        {FIELDS.map((f) => <SelectItem key={f.slug} value={f.slug}>{f.name}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>خدمت مورد نیاز</Label>
                  <Select value={form.service} onValueChange={(v) => setForm({ ...form, service: v })}>
                    <SelectTrigger><SelectValue placeholder="انتخاب کنید" /></SelectTrigger>
                    <SelectContent>
                      {SERVICES.map((s) => <SelectItem key={s.slug} value={s.slug}>{s.title}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="c-desc">توضیحات</Label>
                  <Textarea id="c-desc" rows={3} maxLength={1000} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
                </div>
                {error && <p className="text-sm text-destructive">{error}</p>}
                <Button type="submit" className="w-full">دریافت مشاوره</Button>
              </form>
            </>
          )}
        </DialogContent>
      </Dialog>
    </ConsultCtx.Provider>
  );
}
