import { Link } from "@tanstack/react-router";
import {
  LayoutDashboard,
  Mail,
  NotebookPen,
  CalendarClock,
  Search,
  MessagesSquare,
  Sparkles,
  Menu,
  X,
} from "lucide-react";
import { useState, type ReactNode } from "react";

export const NAV_ITEMS = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard, blurb: "Your productivity command center" },
  { to: "/email", label: "Smart Email Generator", icon: Mail, blurb: "Draft polished emails in seconds" },
  { to: "/meetings", label: "Meeting Notes Summarizer", icon: NotebookPen, blurb: "Turn transcripts into decisions" },
  { to: "/planner", label: "AI Task Planner", icon: CalendarClock, blurb: "Schedules built around your hours" },
  { to: "/research", label: "AI Research Assistant", icon: Search, blurb: "Insights, risks and next steps" },
  { to: "/chat", label: "AI Chatbot", icon: MessagesSquare, blurb: "Your always-on work assistant" },
] as const;

export const DISCLAIMER =
  "AI-generated content is intended to assist workplace productivity. Users should review and verify all generated outputs before relying on them for professional, legal, financial, or business decisions.";

export function Disclaimer({ compact = false }: { compact?: boolean }) {
  return (
    <p
      className={
        compact
          ? "text-[11px] leading-relaxed text-muted-foreground"
          : "rounded-lg border border-border bg-surface-2/60 px-4 py-3 text-xs leading-relaxed text-muted-foreground"
      }
    >
      <span className="font-semibold text-primary-glow">Responsible AI · </span>
      {DISCLAIMER}
    </p>
  );
}

function NavLinks({ onNavigate }: { onNavigate?: () => void }) {
  return (
    <nav className="flex flex-col gap-1">
      {NAV_ITEMS.map((item) => (
        <Link
          key={item.to}
          to={item.to}
          onClick={onNavigate}
          activeOptions={{ exact: item.to === "/" }}
          className="group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-sidebar-foreground/75 transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
          activeProps={{
            className:
              "bg-sidebar-accent text-sidebar-accent-foreground font-medium ring-1 ring-primary/40",
          }}
        >
          <item.icon className="size-4 shrink-0 text-primary-glow" />
          <span className="truncate">{item.label}</span>
        </Link>
      ))}
    </nav>
  );
}

function Brand() {
  return (
    <div className="flex items-center gap-3">
      <div className="flex size-9 items-center justify-center rounded-xl bg-primary glow">
        <Sparkles className="size-4 text-primary-foreground" />
      </div>
      <div className="leading-tight">
        <p className="text-sm font-semibold">AI Workplace</p>
        <p className="text-[11px] text-muted-foreground">Productivity Assistant</p>
      </div>
    </div>
  );
}

export function AppShell({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: ReactNode;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-background">
      <aside className="hidden w-72 shrink-0 flex-col justify-between border-r border-sidebar-border bg-sidebar p-5 lg:flex">
        <div className="flex flex-col gap-8">
          <Brand />
          <NavLinks />
        </div>
        <Disclaimer compact />
      </aside>

      {open && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-background/80 backdrop-blur-sm"
            onClick={() => setOpen(false)}
          />
          <aside className="absolute inset-y-0 left-0 flex w-72 flex-col justify-between border-r border-sidebar-border bg-sidebar p-5">
            <div className="flex flex-col gap-8">
              <div className="flex items-center justify-between">
                <Brand />
                <button
                  aria-label="Close navigation"
                  onClick={() => setOpen(false)}
                  className="rounded-md p-1.5 text-muted-foreground hover:bg-sidebar-accent"
                >
                  <X className="size-4" />
                </button>
              </div>
              <NavLinks onNavigate={() => setOpen(false)} />
            </div>
            <Disclaimer compact />
          </aside>
        </div>
      )}

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-40 border-b border-border bg-background/85 px-5 py-4 backdrop-blur-md md:px-8">
          <div className="flex items-center gap-3">
            <button
              aria-label="Open navigation"
              onClick={() => setOpen(true)}
              className="rounded-md p-2 text-muted-foreground hover:bg-surface-2 lg:hidden"
            >
              <Menu className="size-5" />
            </button>
            <div className="min-w-0">
              <h1 className="truncate text-lg font-semibold md:text-xl">{title}</h1>
              <p className="truncate text-xs text-muted-foreground md:text-sm">{description}</p>
            </div>
          </div>
        </header>

        <main className="flex-1 grid-backdrop px-5 py-6 md:px-8 md:py-8">{children}</main>

        <footer className="border-t border-border px-5 py-4 md:px-8">
          <Disclaimer compact />
        </footer>
      </div>
    </div>
  );
}
