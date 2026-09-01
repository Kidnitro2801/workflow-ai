import { createFileRoute } from "@tanstack/react-router";
import { convertToModelMessages, streamText, type UIMessage } from "ai";
import { getGateway, AI_MODEL } from "@/lib/ai-gateway.server";

const SYSTEM = `You are the AI Workplace Productivity Assistant — a sharp, pragmatic colleague inside a workplace productivity platform.
You help with workplace questions, drafting content (emails, docs, updates, briefs), productivity and prioritisation advice, planning, and research analysis.
Style: professional, warm, concise. Use Markdown — short paragraphs, headings and bullets where they help, tables for structured comparisons or schedules.
Always tailor the answer to the specifics the user gave; ask a brief clarifying question only when the request is genuinely ambiguous.
Do not give legal, financial or medical advice as if authoritative — flag when professional verification is needed.`;

export const Route = createFileRoute("/api/chat")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        try {
          const { messages } = (await request.json()) as { messages: UIMessage[] };
          const gateway = getGateway();

          const result = streamText({
            model: gateway(AI_MODEL),
            system: SYSTEM,
            messages: await convertToModelMessages(messages),
            temperature: 0.7,
          });

          return result.toUIMessageStreamResponse();
        } catch (error: unknown) {
          const err = error as { statusCode?: number; status?: number; message?: string };
          const status = err.statusCode ?? err.status ?? 500;
          const message =
            status === 429
              ? "The AI service is rate limited right now. Please try again shortly."
              : status === 402
                ? "AI credits are exhausted for this workspace. Please add credits to continue."
                : (err.message ?? "The assistant could not respond. Please try again.");
          return new Response(JSON.stringify({ error: message }), {
            status: status >= 400 && status < 600 ? status : 500,
            headers: { "content-type": "application/json" },
          });
        }
      },
    },
  },
});
