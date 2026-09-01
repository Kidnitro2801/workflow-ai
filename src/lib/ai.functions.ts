import { createServerFn } from "@tanstack/react-start";
import { streamText } from "ai";
import { z } from "zod";

const GenerateInput = z.object({
  tool: z.enum(["email", "meeting", "planner", "research"]),
  fields: z.record(z.string()),
  variation: z.number().optional(),
});

const SYSTEM_PROMPTS: Record<string, string> = {
  email: `You are a senior workplace communications expert. Write a complete, ready-to-send professional email tailored exactly to the purpose, recipient, context and requested tone.
Return Markdown in exactly this structure:
## Subject Line
<one compelling subject line>

## Email
<full email body including greeting, well-structured paragraphs, clear ask, and sign-off>

## Alternative Subject Lines
- three alternatives

Never use placeholders like [Name] unless the user gave no name — if information is missing, write naturally around it.`,
  meeting: `You are an expert chief of staff summarizing meeting notes or transcripts.
Return Markdown with exactly these sections, concise and professional, derived strictly from the provided notes:
## Executive Summary
## Key Decisions
## Action Items
(use a Markdown table with columns: Action | Owner | Deadline | Priority)
## Responsibilities
## Deadlines
## Risks & Concerns
If something is genuinely not present in the notes, say "Not specified in the notes" rather than inventing facts.`,
  planner: `You are an elite productivity coach and planning strategist.
Given the user's tasks, goals, deadlines and available hours, return Markdown with exactly these sections:
## Priority Matrix
(table: Task | Priority | Est. Hours | Deadline | Rationale)
## Daily Schedule
(time-blocked schedule that fits the stated available hours)
## Weekly Schedule
(table: Day | Focus | Key Tasks)
## Productivity Recommendations
Be specific, realistic about capacity, and reference the user's actual tasks and deadlines.`,
  research: `You are a strategic research analyst supporting business decision-makers.
Analyze the supplied topic, question and/or source text and return Markdown with exactly these sections:
## Summary
## Key Insights
## Opportunities
## Risks
## Recommendations
(numbered, actionable, with suggested next step and owner-type)
Be professional, evidence-oriented and explicit when something is an assumption rather than a fact.`,
};

function buildPrompt(tool: string, fields: Record<string, string>) {
  const body = Object.entries(fields)
    .filter(([, v]) => v && v.trim().length > 0)
    .map(([k, v]) => `${k}:\n${v}`)
    .join("\n\n");
  return `${body}\n\nProduce the output now.`;
}

export const generateAiOutput = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => GenerateInput.parse(input))
  .handler(async ({ data }) => {
    const { getGateway, AI_MODEL } = await import("./ai-gateway.server");
    const gateway = getGateway();

    try {
      const result = streamText({
        model: gateway(AI_MODEL),
        system: SYSTEM_PROMPTS[data.tool] ?? "",
        prompt:
          buildPrompt(data.tool, data.fields) +
          (data.variation && data.variation > 0
            ? `\n\n(Regeneration #${data.variation}: produce a meaningfully different angle, structure of wording and phrasing than a previous attempt, while keeping the required sections.)`
            : ""),
        temperature: 0.7,
      });
      const text = await result.text;
      return { text };
    } catch (error: unknown) {
      const err = error as { statusCode?: number; status?: number; message?: string };
      const status = err.statusCode ?? err.status;
      if (status === 429)
        throw new Error("The AI service is rate limited right now. Please try again in a moment.");
      if (status === 402)
        throw new Error("AI credits are exhausted for this workspace. Please add credits to continue.");
      throw new Error(err.message || "AI generation failed. Please try again.");
    }
  });
