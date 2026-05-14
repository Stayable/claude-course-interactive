import { NextRequest } from "next/server";
import { auth } from "@/lib/auth";
import {
  getClient,
  DEFAULT_MODEL,
  ALLOWED_MODELS,
  MAX_INPUT_CHARS,
  MAX_OUTPUT_TOKENS,
} from "@/lib/claude";
import { checkRateLimit } from "@/lib/rateLimit";

export const runtime = "nodejs";

interface RunRequest {
  system?: string;
  prompt: string;
  prefill?: string;
  model?: string;
}

export async function POST(req: NextRequest) {
  const session = await auth();
  const userKey = session?.user?.id ?? req.headers.get("x-forwarded-for") ?? "anon";

  const rl = checkRateLimit(userKey);
  if (!rl.ok) {
    return new Response(
      JSON.stringify({ error: "rate_limited", retryAfterMs: rl.retryAfterMs }),
      { status: 429, headers: { "content-type": "application/json" } },
    );
  }

  let body: RunRequest;
  try {
    body = (await req.json()) as RunRequest;
  } catch {
    return new Response(JSON.stringify({ error: "invalid_json" }), { status: 400 });
  }

  const prompt = (body.prompt ?? "").toString();
  const system = body.system ? body.system.toString().slice(0, MAX_INPUT_CHARS) : undefined;
  const prefill = body.prefill ? body.prefill.toString().slice(0, MAX_INPUT_CHARS) : undefined;
  const model = ALLOWED_MODELS.includes(body.model ?? "") ? body.model! : DEFAULT_MODEL;

  if (!prompt.trim()) {
    return new Response(JSON.stringify({ error: "empty_prompt" }), { status: 400 });
  }
  if (prompt.length > MAX_INPUT_CHARS) {
    return new Response(JSON.stringify({ error: "prompt_too_long" }), { status: 400 });
  }

  const client = getClient();
  const messages: { role: "user" | "assistant"; content: string }[] = [
    { role: "user", content: prompt },
  ];
  if (prefill && prefill.trim()) {
    messages.push({ role: "assistant", content: prefill });
  }
  const stream = await client.messages.stream({
    model,
    max_tokens: MAX_OUTPUT_TOKENS,
    system,
    messages,
  });

  const encoder = new TextEncoder();
  const readable = new ReadableStream({
    async start(controller) {
      try {
        for await (const event of stream) {
          if (
            event.type === "content_block_delta" &&
            event.delta.type === "text_delta"
          ) {
            controller.enqueue(encoder.encode(event.delta.text));
          }
        }
      } catch (err) {
        controller.enqueue(
          encoder.encode(`\n\n[stream error: ${(err as Error).message}]`),
        );
      } finally {
        controller.close();
      }
    },
  });

  return new Response(readable, {
    headers: { "content-type": "text/plain; charset=utf-8" },
  });
}
