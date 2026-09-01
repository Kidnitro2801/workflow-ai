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

export const Route = createFileRoute("/planner")({
  head: () => ({
    meta: [
      { title: "AI Task Planner | AI Workplace Assistant" },
      {
        name: "description",
        content:
          "Turn tasks, goals, deadlines and available hours into a prioritized daily and weekly schedule with productivity recommendations.",
      },
      { property: "og:title", content: "AI Task Planner | AI Workplace Assistant" },
      {
        property: "og:description",
        content: "Prioritized daily and weekly schedules built around the hours you actually have.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: PlannerPage,
});

function PlannerPage() {
  const [tasks, setTasks] = useState("");
  const [goals, setGoals] = useState("");
  const [deadlines, setDeadlines] = useState("");
  const [hours, setHours] = useState("");
  const { output, setOutput, loading, error, run, regenerate } = useAiTool("planner");

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    void run({ Tasks: tasks, Goals: goals, Deadlines: deadlines, "Available hours": hours });
  };

  return (
    <AppShell
      title="AI Task Planner"
      description="Priorities, time blocks and a weekly plan matched to your capacity"
    >
      <div className="grid gap-6 xl:grid-cols-[minmax(0,420px)_minmax(0,1fr)]">
        <form onSubmit={submit} className="panel flex h-fit flex-col gap-4 p-5">
          <div className="grid gap-2">
            <Label htmlFor="tasks">Tasks</Label>
            <Textarea
              id="tasks"
              required
              rows={6}
              value={tasks}
              onChange={(e) => setTasks(e.target.value)}
              placeholder="One task per line — e.g. Finish investor deck, Review PRs, Client call prep…"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="goals">Goals</Label>
            <Textarea
              id="goals"
              rows={4}
              value={goals}
              onChange={(e) => setGoals(e.target.value)}
              placeholder="Ship v2 beta, protect 2 hours of deep work daily…"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="deadlines">Deadlines</Label>
            <Textarea
              id="deadlines"
              rows={4}
              value={deadlines}
              onChange={(e) => setDeadlines(e.target.value)}
              placeholder="Investor deck — Thursday 5pm; PR review — daily…"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="hours">Available hours</Label>
            <Input
              id="hours"
              required
              value={hours}
              onChange={(e) => setHours(e.target.value)}
              placeholder="6 focused hours per weekday, 08:30–16:00"
            />
          </div>
          <Button type="submit" disabled={loading}>
            <Sparkles className="size-4" />
            {loading ? "Planning…" : "Generate Plan"}
          </Button>
        </form>

        <AiOutputPanel
          value={output}
          onChange={setOutput}
          onRegenerate={regenerate}
          loading={loading}
          error={error}
          emptyHint="Add your tasks and hours to get a prioritized daily and weekly schedule."
        />
      </div>
    </AppShell>
  );
}
