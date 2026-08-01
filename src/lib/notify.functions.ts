import { createServerFn } from "@tanstack/react-start";

type Input = { kind: "consultation" | "request"; id: string };

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export const notifyNewLead = createServerFn({ method: "POST" })
  .inputValidator((data: Input): Input => {
    if (data?.kind !== "consultation" && data?.kind !== "request") throw new Error("bad kind");
    if (!UUID.test(data?.id ?? "")) throw new Error("bad id");
    return { kind: data.kind, id: data.id };
  })
  .handler(async ({ data }) => {
    const lovableKey = process.env["LOVABLE_API_KEY"];
    const telegramKey = process.env["TELEGRAM_API_KEY"];
    const chatId = process.env["TELEGRAM_ADMIN_CHAT_ID"];
    if (!lovableKey || !telegramKey || !chatId) {
      console.error(
        `Telegram notify env missing: LOVABLE_API_KEY=${!!lovableKey} TELEGRAM_API_KEY=${!!telegramKey} TELEGRAM_ADMIN_CHAT_ID=${!!chatId}`,
      );
      return { sent: false, reason: "env" };
    }


    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    let text = "";
    if (data.kind === "consultation") {
      const { data: row } = await supabaseAdmin
        .from("consultations")
        .select("full_name, mobile, academic_level, field_slug, service_slug, description")
        .eq("id", data.id)
        .maybeSingle();
      if (!row) return { sent: false };
      text = [
        "🔔 <b>درخواست مشاوره جدید</b>",
        `👤 نام: ${row.full_name}`,
        `📱 موبایل: ${row.mobile}`,
        `🎓 مقطع: ${row.academic_level ?? "—"}`,
        `📚 رشته: ${row.field_slug ?? "—"}`,
        `🧩 خدمت: ${row.service_slug ?? "—"}`,
        `📝 شرح: ${row.description?.trim() || "—"}`,
      ].join("\n");
    } else {
      const { data: row } = await supabaseAdmin
        .from("thesis_requests")
        .select("topic, academic_level, field_slug, major, service_slug, urgency, budget, description")
        .eq("id", data.id)
        .maybeSingle();
      if (!row) return { sent: false };
      text = [
        "🆕 <b>ثبت پروژه جدید</b>",
        `📌 موضوع: ${row.topic}`,
        `🎓 مقطع: ${row.academic_level}`,
        `📚 رشته: ${row.field_slug}${row.major ? ` / ${row.major}` : ""}`,
        `🧩 خدمت: ${row.service_slug}`,
        `⏱ فوریت: ${row.urgency}`,
        `💰 بودجه: ${row.budget ?? "—"}`,
        `📝 شرح: ${row.description?.trim() || "—"}`,
      ].join("\n");
    }

    const res = await fetch("https://connector-gateway.lovable.dev/telegram/sendMessage", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${lovableKey}`,
        "X-Connection-Api-Key": telegramKey,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ chat_id: chatId, text, parse_mode: "HTML" }),
    });

    if (!res.ok) {
      console.error(`Telegram notify failed [${res.status}]: ${await res.text()}`);
      return { sent: false };
    }
    return { sent: true };
  });
