import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { AppShell } from "@/components/app-shell";
import { AiOutputPanel } from "@/components/ai-output";
import { useAiTool } from "@/lib/use-ai-tool";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Sparkles } from "lucide-react";

export const Route = createFileRoute("/email")({
  head: () => ({
    meta: [
      { title: "Smart Email Generator | AI Workplace Assistant" },
      {
        name: "description",
        content:
          "Generate professional workplace emails with AI — set purpose, recipient, context and tone, then edit, copy or regenerate.",
      },
      { property: "og:title", content: "Smart Email Generator | AI Workplace Assistant" },
      {
        property: "og:description",
        content: "AI-written professional emails with subject lines, tone control and instant regeneration.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: EmailPage,
});

const TONES = ["Formal", "Friendly", "Persuasive"] as const;

function EmailPage() {
  const [purpose, setPurpose] = useState("");
  const [recipient, setRecipient] = useState("");
  const [context, setContext] = useState("");
  const [tone, setTone] = useState<string>("Formal");
  const { output, setOutput, loading, error, run, regenerate } = useAiTool("email");

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    void run({ Purpose: purpose, Recipient: recipient, Context: context, Tone: tone });
  };

  return (
    <AppShell
      title="Smart Email Generator"
      description="Professional emails written for your purpose, recipient and tone"
    >
      <div className="grid gap-6 xl:grid-cols-[minmax(0,420px)_minmax(0,1fr)]">
        <form onSubmit={submit} className="panel flex h-fit flex-col gap-4 p-5">
          <div className="grid gap-2">
            <Label htmlFor="purpose">Purpose</Label>
            <Input
              id="purpose"
              required
              value={purpose}
              onChange={(e) => setPurpose(e.target.value)}
              placeholder="Request a deadline extension on the Q3 report"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="recipient">Recipient</Label>
            <Input
              id="recipient"
              required
              value={recipient}
              onChange={(e) => setRecipient(e.target.value)}
              placeholder="Priya Naidoo, Head of Finance"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="context">Context</Label>
            <Textarea
              id="context"
              required
              rows={7}
              value={context}
              onChange={(e) => setContext(e.target.value)}
              placeholder="Background, key facts, dates, what you need from them…"
            />
          </div>
          <div className="grid gap-2">
            <Label>Tone</Label>
            <div className="grid grid-cols-3 gap-2">
              {TONES.map((t) => (
                <Button
                  key={t}
                  type="button"
                  variant={tone === t ? "default" : "secondary"}
                  size="sm"
                  onClick={() => setTone(t)}
                >
                  {t}
                </Button>
              ))}
            </div>
          </div>
          <Button type="submit" disabled={loading} className="mt-1">
            <Sparkles className="size-4" />
            {loading ? "Generating…" : "Generate Email"}
          </Button>
        </form>

        <AiOutputPanel
          value={output}
          onChange={setOutput}
          onRegenerate={regenerate}
          loading={loading}
          error={error}
          emptyHint="Fill in the brief on the left and your subject line and full email will appear here."
        />
      </div>
    </AppShell>
  );
}
