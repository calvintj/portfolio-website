import { createRateLimiter, sanitizeMessages } from "@/lib/chat";
import { readContent } from "@/lib/content-server";

const DEEPINFRA_URL = "https://api.deepinfra.com/v1/openai/chat/completions";
const MODEL = "openai/gpt-oss-20b";

// 15 messages per visitor per 10 minutes; 200 per hour across everyone,
// which caps the bill even if a visitor rotates IPs.
const allow = createRateLimiter({
  perKey: 15,
  keyWindowMs: 10 * 60_000,
  global: 200,
  globalWindowMs: 60 * 60_000,
});

const BUSY =
  "The assistant is busy right now. Please try again in a few minutes.";

function buildSystemPrompt(
  content: Awaited<ReturnType<typeof readContent>>,
): string {
  const experiencesText = content.experiences
    .map(
      (e) =>
        `- ${e.role} at ${e.company} (${e.year}): ${e.description.trim()} Technologies: ${e.technologies.join(", ")}`,
    )
    .join("\n");
  const projectsText = content.projects
    .map(
      (p) =>
        `- ${p.title.text}: ${p.description} Technologies: ${p.technologies.join(", ")}`,
    )
    .join("\n");
  const certsText = content.certifications
    .map((c) => `- ${c.role} at ${c.company} (${c.year}): ${c.description}`)
    .join("\n");
  const orgsText = content.organizations
    .map((o) => `- ${o.role} at ${o.company} (${o.year}): ${o.description}`)
    .join("\n");

  return `You are a helpful assistant for ${content.name}'s portfolio website. You answer questions about ${content.nickname} (${content.position}) based only on the following information. Be concise and friendly. If asked something not covered below, say you don't have that information and suggest they ask about experience, projects, contact, or skills.

## About ${content.name}
${content.heroContent}

## Work experience
${experiencesText}

## Projects
${projectsText}

## Certifications
${certsText}

## Organizations
${orgsText}

## Contact
Email: ${content.contact.email}, Location: ${content.contact.domicile}`;
}

export async function POST(req: Request) {
  try {
    const apiKey = process.env.DEEPINFRA_API_KEY;
    if (!apiKey) {
      return Response.json(
        { error: "The assistant is not available right now." },
        { status: 503 },
      );
    }

    // Cloudflare sets cf-connecting-ip to the visitor's address.
    const ip =
      req.headers.get("cf-connecting-ip") ??
      req.headers.get("x-forwarded-for")?.split(",")[0].trim() ??
      "unknown";
    if (!allow(ip)) {
      return Response.json({ error: BUSY }, { status: 429 });
    }

    const body = await req.json().catch(() => null);
    const checked = sanitizeMessages(body?.messages);
    if (!checked.ok) {
      return Response.json({ error: checked.error }, { status: 400 });
    }

    const content = await readContent();
    const systemPrompt = buildSystemPrompt(content);
    const apiMessages = [
      { role: "system" as const, content: systemPrompt },
      ...checked.messages,
    ];

    const res = await fetch(DEEPINFRA_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: MODEL,
        messages: apiMessages,
        max_tokens: 1024,
        stream: true,
      }),
    });

    if (!res.ok) {
      const err = await res.text();
      console.error("DeepInfra API error:", res.status, err);
      // Provider details stay in the server log, not the browser.
      return Response.json({ error: BUSY }, { status: 502 });
    }

    const stream = res.body;
    if (!stream) {
      return Response.json({ error: BUSY }, { status: 502 });
    }

    return new Response(stream, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      },
    });
  } catch (e) {
    console.error("Chat API error:", e);
    return Response.json({ error: BUSY }, { status: 500 });
  }
}
