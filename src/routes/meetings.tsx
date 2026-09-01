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

export const Route = createFileRoute("/meetings")({
  head: () => ({
    meta: [
      { title: "Meeting Notes Summarizer | AI Workplace Assistant" },
      {
        name: "description",
        content:
          "Paste meeting notes or transcripts and get an executive summary, key decisions, action items, owners, deadlines and risks.",
      },
      { property: "og:title", content: "Meeting Notes Summarizer | AI Workplace Assistant" },
      {
        property: "og:description",
        content: "Turn raw transcripts into decisions, owners and deadlines in seconds.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: MeetingsPage,
});

function MeetingsPage() {
  const [meeting, setMeeting] = useState("");
  const [attendees, setAttendees] = useState("");
  const [notes, setNotes] = useState("");
  const { output, setOutput, loading, error, run, regenerate } = useAiTool("meeting");

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    void run({ "Meeting title": meeting, Attendees: attendees, "Notes / transcript": notes });
  };

  return (
    <AppShell
      title="Meeting Notes Summarizer"
      description="Decisions, owners, deadlines and risks extracted from your notes"
    >
      <div className="grid gap-6 xl:grid-cols-[minmax(0,420px)_minmax(0,1fr)]">
        <form onSubmit={submit} className="panel flex h-fit flex-col gap-4 p-5">
          <div className="grid gap-2">
            <Label htmlFor="meeting">Meeting title</Label>
            <Input
              id="meeting"
              value={meeting}
              onChange={(e) => setMeeting(e.target.value)}
              placeholder="Q3 roadmap review"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="attendees">Attendees (optional)</Label>
            <Input
              id="attendees"
              value={attendees}
              onChange={(e) => setAttendees(e.target.value)}
              placeholder="Sam (PM), Lerato (Eng), Chris (Design)"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="notes">Notes or transcript</Label>
            <Textarea
              id="notes"
              required
              rows={16}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Paste the raw meeting notes or full transcript here…"
            />
          </div>
          <Button type="submit" disabled={loading}>
            <Sparkles className="size-4" />
            {loading ? "Summarizing…" : "Summarize Meeting"}
          </Button>
        </form>

        <AiOutputPanel
          value={output}
          onChange={setOutput}
          onRegenerate={regenerate}
          loading={loading}
          error={error}
          emptyHint="Paste your notes and a structured, editable summary will appear here."
        />
      </div>
    </AppShell>
  );
}
