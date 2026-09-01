import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Sparkles, Zap, ShieldCheck, Clock } from "lucide-react";
import { AppShell, NAV_ITEMS, Disclaimer } from "@/components/app-shell";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Dashboard | AI Workplace Productivity Assistant" },
      {
        name: "description",
        content:
          "A premium AI workplace productivity platform: generate emails, summarize meetings, plan tasks, run research and chat with an AI assistant.",
      },
      { property: "og:title", content: "AI Workplace Productivity Assistant" },
      {
        property: "og:description",
        content:
          "Emails, meeting summaries, task plans, research analysis and a workplace chatbot — all AI-generated and editable.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Dashboard,
});

const TOOLS = NAV_ITEMS.filter((item) => item.to !== "/");

const HIGHLIGHTS = [
  { icon: Zap, label: "AI-generated", value: "Every output", note: "No templates, no canned text" },
  { icon: Clock, label: "Time to draft", value: "< 30 sec", note: "From brief to ready-to-send" },
  { icon: Sparkles, label: "Editable", value: "100%", note: "Edit, copy or regenerate anything" },
  { icon: ShieldCheck, label: "Access", value: "Instant", note: "No sign-up, no setup" },
];

function Dashboard() {
  return (
    <AppShell
      title="Dashboard"
      description="Five AI workspaces for the work that fills your day"
    >
      <div className="flex flex-col gap-8">
        <section className="panel relative overflow-hidden p-6 md:p-10">
          <div className="max-w-2xl">
            <span className="inline-flex items-center gap-2 rounded-full border border-primary/40 bg-primary/10 px-3 py-1 text-xs font-medium text-primary-glow">
              <Sparkles className="size-3.5" />
              Powered by Lovable AI
            </span>
            <h2 className="mt-5 text-3xl font-semibold leading-tight md:text-4xl">
              Your workplace, <span className="gradient-text">amplified by AI</span>
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground md:text-base">
              Draft the email, summarize the meeting, plan the week and research the decision — every
              result generated live from your own input, and fully editable before you send it.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Button asChild>
                <Link to="/email">
                  Generate an email <ArrowRight className="size-4" />
                </Link>
              </Button>
              <Button asChild variant="secondary">
                <Link to="/chat">Open AI Chatbot</Link>
              </Button>
            </div>
          </div>
        </section>

        <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {HIGHLIGHTS.map((h) => (
            <div key={h.label} className="panel p-5">
              <div className="flex items-center gap-2 text-xs uppercase tracking-[0.12em] text-muted-foreground">
                <h.icon className="size-4 text-primary-glow" />
                {h.label}
              </div>
              <p className="mt-3 text-2xl font-semibold">{h.value}</p>
              <p className="mt-1 text-xs text-muted-foreground">{h.note}</p>
            </div>
          ))}
        </section>

        <section>
          <h3 className="mb-4 text-sm font-semibold uppercase tracking-[0.14em] text-primary-glow">
            AI Tools
          </h3>
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {TOOLS.map((tool) => (
              <Link
                key={tool.to}
                to={tool.to}
                className="panel group flex flex-col gap-4 p-5 transition-all hover:-translate-y-0.5 hover:border-primary/50 hover:glow"
              >
                <div className="flex size-10 items-center justify-center rounded-xl bg-primary/15 ring-1 ring-primary/30">
                  <tool.icon className="size-5 text-primary-glow" />
                </div>
                <div>
                  <p className="font-semibold">{tool.label}</p>
                  <p className="mt-1 text-sm text-muted-foreground">{tool.blurb}</p>
                </div>
                <span className="mt-auto inline-flex items-center gap-1.5 text-sm font-medium text-primary-glow">
                  Open tool
                  <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
                </span>
              </Link>
            ))}
          </div>
        </section>

        <Disclaimer />
      </div>
    </AppShell>
  );
}
