import { readContent } from "@/lib/content-server";

const DEEPINFRA_URL = "https://api.deepinfra.com/v1/openai/chat/completions";
const MODEL = "openai/gpt-oss-20b";

function buildSystemPrompt(content: Awaited<ReturnType<typeof readContent>>): string {
  const experiencesText = content.experiences
    .map(
      (e) =>
        `- ${e.role} at ${e.company} (${e.year}): ${e.description.trim()} Technologies: ${e.technologies.join(", ")}`
    )
    .join("\n");
  const projectsText = content.projects
    .map((p) => `- ${p.title.text}: ${p.description} Technologies: ${p.technologies.join(", ")}`)
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
Email: ${content.contact.email}, Phone: ${content.contact.phoneNo}, Location: ${content.contact.domicile}`;
}

export async function POST(req: Request) {
  try {
    const apiKey = process.env.DEEPINFRA_API_KEY;
    if (!apiKey) {
      return Response.json(
        { error: "DEEPINFRA_API_KEY is not configured" },
        { status: 500 }
      );
    }

    const { messages } = (await req.json()) as { messages: { role: string; content: string }[] };
    if (!Array.isArray(messages) || messages.length === 0) {
      return Response.json({ error: "messages array required" }, { status: 400 });
    }

    const content = await readContent();
    const systemPrompt = buildSystemPrompt(content);
    const apiMessages = [
      { role: "system" as const, content: systemPrompt },
      ...messages.map((m) => ({
        role: (m.role === "bot" ? "assistant" : m.role) as "user" | "assistant",
        content: m.content,
      })),
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
      return Response.json(
        { error: "LLM request failed", details: err },
        { status: res.status }
      );
    }

    const stream = res.body;
    if (!stream) {
      return Response.json({ error: "No response body" }, { status: 500 });
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
    return Response.json(
      { error: e instanceof Error ? e.message : "Unknown error" },
      { status: 500 }
    );
  }
}
