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

export const Route = createFileRoute("/research")({
  head: () => ({
    meta: [
      { title: "AI Research Assistant | AI Workplace Assistant" },
      {
        name: "description",
        content:
          "Analyze a topic, question or article and get a summary, key insights, opportunities, risks and actionable recommendations.",
      },
      { property: "og:title", content: "AI Research Assistant | AI Workplace Assistant" },
      {
        property: "og:description",
        content: "Decision-ready analysis: insights, opportunities, risks and recommendations.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ResearchPage,
});

function ResearchPage() {
  const [topic, setTopic] = useState("");
  const [question, setQuestion] = useState("");
  const [source, setSource] = useState("");
  const { output, setOutput, loading, error, run, regenerate } = useAiTool("research");

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    void run({ Topic: topic, Question: question, "Article or text": source });
  };

  return (
    <AppShell
      title="AI Research Assistant"
      description="Insights, opportunities, risks and recommendations you can act on"
    >
      <div className="grid gap-6 xl:grid-cols-[minmax(0,420px)_minmax(0,1fr)]">
        <form onSubmit={submit} className="panel flex h-fit flex-col gap-4 p-5">
          <div className="grid gap-2">
            <Label htmlFor="topic">Topic</Label>
            <Input
              id="topic"
              required
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="AI adoption in mid-market logistics"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="question">Question</Label>
            <Textarea
              id="question"
              rows={4}
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="What should our team prioritise in the next two quarters?"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="source">Article or text (optional)</Label>
            <Textarea
              id="source"
              rows={12}
              value={source}
              onChange={(e) => setSource(e.target.value)}
              placeholder="Paste an article, report extract or internal document to analyse…"
            />
          </div>
          <Button type="submit" disabled={loading}>
            <Sparkles className="size-4" />
            {loading ? "Analysing…" : "Run Analysis"}
          </Button>
        </form>

        <AiOutputPanel
          value={output}
          onChange={setOutput}
          onRegenerate={regenerate}
          loading={loading}
          error={error}
          emptyHint="Enter a topic or paste source material to get a structured analysis."
        />
      </div>
    </AppShell>
  );
}
