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

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export const notifyNewLead = createServerFn({ method: "POST" })
  .inputValidator((data: Input): Input => {
    if (data?.kind !== "consultation" && data?.kind !== "request") {
      throw new Error("bad kind");
    }

    if (!UUID.test(data?.id ?? "")) {
      throw new Error("bad id");
    }

    if (
      !data.lead ||
      Object.values(data.lead).some(
        (value) => typeof value !== "string" || value.length > 2000,
      )
    ) {
      throw new Error("bad lead data");
    }

    if (data.kind === "consultation") {
      if (
        data.lead.fullName.trim().length < 2 ||
        !/^09\d{9}$/.test(data.lead.mobile.trim())
      ) {
        throw new Error("bad consultation data");
      }
    } else {
      if (data.lead.topic.trim().length < 5) {
        throw new Error("bad request data");
      }
    }

    return data;
  })
  .handler(async ({ data }) => {
    const botToken = process.env.TELEGRAM_BOT_TOKEN;
    const chatId = process.env.TELEGRAM_CHAT_ID;

    if (!botToken || !chatId) {
      console.error(
        `Telegram env missing: TELEGRAM_BOT_TOKEN=${!!botToken} TELEGRAM_CHAT_ID=${!!chatId}`,
      );
      return { sent: false };
    }

    const escapeHtml = (value: string) =>
      value
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;");

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

    const text = lines
      .map((line, index) => (index === 0 ? line : escapeHtml(line)))
      .join("\n");

    const res = await fetch(
      `https://api.telegram.org/bot${botToken}/sendMessage`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          chat_id: chatId,
          text,
          parse_mode: "HTML",
        }),
      },
    );

    const result = await res.json();

    if (!res.ok || !result.ok) {
      console.error("Telegram API Error:", result);
      return { sent: false };
    }

    return { sent: true };
  });
