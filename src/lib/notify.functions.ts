import { createServerFn } from "@tanstack/react-start";

type Input =
  | {
      kind: "consultation";
      id: string;
      lead: {
        fullName: string;
        mobile: string;
        academicLevel: string;
        fieldSlug: string;
        serviceSlug: string;
        description: string;
      };
    }
  | {
      kind: "request";
      id: string;
      lead: {
        topic: string;
        academicLevel: string;
        fieldSlug: string;
        major: string;
        serviceSlug: string;
        urgency: string;
        budget: string;
        description: string;
      };
    };

export const notifyNewLead = createServerFn({ method: "POST" })
  .inputValidator((data: Input): Input => {
    const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (data?.kind !== "consultation" && data?.kind !== "request") throw new Error("bad kind");
    if (!UUID.test(data?.id ?? "")) throw new Error("bad id");
    if (!data.lead || Object.values(data.lead).some((value) => typeof value !== "string" || value.length > 2_000)) {
      throw new Error("bad lead data");
    }
    if (data.kind === "consultation") {
      if (data.lead.fullName.trim().length < 2 || !/^09\d{9}$/.test(data.lead.mobile.trim())) {
        throw new Error("bad consultation data");
      }
    } else if (data.lead.topic.trim().length < 5) {
      throw new Error("bad request data");
    }
    return data;
  })
  .handler(async ({ data }) => {
    const lovableKey = process.env["LOVABLE_API_KEY"];
    const telegramKey = process.env["TELEGRAM_API_KEY"];
    const chatId = process.env["TELEGRAM_ADMIN_CHAT_ID"];
    if (!lovableKey || !telegramKey || !chatId) {
      console.error(
        `Telegram notify env missing: LOVABLE_API_KEY=${!!lovableKey} TELEGRAM_API_KEY=${!!telegramKey} TELEGRAM_ADMIN_CHAT_ID=${!!chatId}`,
      );
      return { sent: false };
    }

    const escapeHtml = (value: string) =>
      value.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;");
    let lines: string[];
    if (data.kind === "consultation") {
      lines = [
        "🔔 <b>درخواست مشاوره جدید</b>",
        `👤 نام: ${data.lead.fullName}`,
        `📱 موبایل: ${data.lead.mobile}`,
        `🎓 مقطع: ${data.lead.academicLevel || "—"}`,
        `📚 رشته: ${data.lead.fieldSlug || "—"}`,
        `🧩 خدمت: ${data.lead.serviceSlug || "—"}`,
        `📝 شرح: ${data.lead.description.trim() || "—"}`,
      ];
    } else {
      lines = [
        "🆕 <b>ثبت پروژه جدید</b>",
        `📌 موضوع: ${data.lead.topic}`,
        `🎓 مقطع: ${data.lead.academicLevel}`,
        `📚 رشته: ${data.lead.fieldSlug}${data.lead.major ? ` / ${data.lead.major}` : ""}`,
        `🧩 خدمت: ${data.lead.serviceSlug}`,
        `⏱ فوریت: ${data.lead.urgency}`,
        `💰 بودجه: ${data.lead.budget || "—"}`,
        `📝 شرح: ${data.lead.description.trim() || "—"}`,
      ];
    }
    const text = lines.map((line, index) => (index === 0 ? line : escapeHtml(line))).join("\n");

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
      const body = await res.text();
      console.error(`Telegram notify failed [${res.status}]: ${body}`);
      return { sent: false };
    }
    const result = (await res.json()) as { ok?: boolean; error?: string };
    if (result.ok === false) {
      console.error(`Telegram notify rejected: ${result.error ?? "unknown error"}`);
      return { sent: false };
    }
    return { sent: true };
  });
