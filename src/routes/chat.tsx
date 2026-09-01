import { createFileRoute } from "@tanstack/react-router";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { useEffect, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import { ArrowUp, Bot, Loader2, TriangleAlert, User } from "lucide-react";
import { AppShell, Disclaimer } from "@/components/app-shell";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

export const Route = createFileRoute("/chat")({
  head: () => ({
    meta: [
      { title: "AI Chatbot | AI Workplace Assistant" },
      {
        name: "description",
        content:
          "Chat with a workplace AI assistant for drafting, planning, research and productivity advice — conversational and always available.",
      },
      { property: "og:title", content: "AI Chatbot | AI Workplace Assistant" },
      {
        property: "og:description",
        content: "An always-on workplace assistant for drafting, planning and research.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ChatPage,
});

const SUGGESTIONS = [
  "Draft a project status update for my leadership team",
  "How do I prioritise when everything is urgent?",
  "Help me prepare an agenda for a difficult client call",
  "Summarise the pros and cons of a 4-day work week for our team",
];

function ChatPage() {
  const { messages, sendMessage, status, error } = useChat({
    transport: new DefaultChatTransport({ api: "/api/chat" }),
  });
  const [input, setInput] = useState("");
  const endRef = useRef<HTMLDivElement>(null);
  const busy = status === "submitted" || status === "streaming";

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, status]);

  const send = (text: string) => {
    const value = text.trim();
    if (!value || busy) return;
    void sendMessage({ text: value });
    setInput("");
  };

  return (
    <AppShell
      title="AI Chatbot"
      description="Your always-on workplace assistant for drafting, planning and research"
    >
      <div className="panel mx-auto flex h-[calc(100vh-16rem)] min-h-[520px] w-full max-w-4xl flex-col overflow-hidden">
        <div className="flex-1 space-y-5 overflow-y-auto p-5">
          {messages.length === 0 && (
            <div className="flex h-full flex-col items-center justify-center gap-6 text-center">
              <div className="flex size-12 items-center justify-center rounded-2xl bg-primary glow">
                <Bot className="size-5 text-primary-foreground" />
              </div>
              <div>
                <h2 className="text-lg font-semibold">How can I help you work smarter today?</h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  Ask anything about your work — drafting, planning, research or productivity.
                </p>
              </div>
              <div className="grid w-full max-w-2xl gap-2 sm:grid-cols-2">
                {SUGGESTIONS.map((s) => (
                  <button
                    key={s}
                    onClick={() => send(s)}
                    className="rounded-lg border border-border bg-surface-2/50 px-4 py-3 text-left text-sm text-muted-foreground transition-colors hover:border-primary/50 hover:text-foreground"
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}

          {messages.map((m) => {
            const text = m.parts
              .map((p) => (p.type === "text" ? p.text : ""))
              .join("");
            const isUser = m.role === "user";
            return (
              <div key={m.id} className={`flex gap-3 ${isUser ? "flex-row-reverse" : ""}`}>
                <div
                  className={`flex size-8 shrink-0 items-center justify-center rounded-lg ${
                    isUser ? "bg-surface-2" : "bg-primary"
                  }`}
                >
                  {isUser ? (
                    <User className="size-4 text-muted-foreground" />
                  ) : (
                    <Bot className="size-4 text-primary-foreground" />
                  )}
                </div>
                <div
                  className={`max-w-[85%] rounded-xl px-4 py-3 text-sm ${
                    isUser
                      ? "bg-primary/15 ring-1 ring-primary/30"
                      : "bg-surface-2/60 ring-1 ring-border"
                  }`}
                >
                  {isUser ? (
                    <p className="whitespace-pre-wrap">{text}</p>
                  ) : (
                    <div className="ai-prose">
                      <ReactMarkdown>{text}</ReactMarkdown>
                    </div>
                  )}
                </div>
              </div>
            );
          })}

          {status === "submitted" && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Loader2 className="size-4 animate-spin text-primary-glow" />
              Thinking…
            </div>
          )}

          {error && (
            <div className="flex items-start gap-2 rounded-lg border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm text-destructive-foreground">
              <TriangleAlert className="mt-0.5 size-4 shrink-0" />
              <span>{error.message || "The assistant could not respond. Please try again."}</span>
            </div>
          )}

          <div ref={endRef} />
        </div>

        <div className="border-t border-border bg-surface/60 p-4">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              send(input);
            }}
            className="flex items-end gap-2"
          >
            <Textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  send(input);
                }
              }}
              rows={1}
              placeholder="Ask your workplace assistant anything…"
              className="max-h-40 min-h-11 resize-none bg-surface-2/50"
            />
            <Button type="submit" size="icon" disabled={busy || !input.trim()}>
              <ArrowUp className="size-4" />
            </Button>
          </form>
          <div className="mt-3">
            <Disclaimer compact />
          </div>
        </div>
      </div>
    </AppShell>
  );
}
