import { useState } from "react";
import ReactMarkdown from "react-markdown";
import { Check, Copy, Pencil, RefreshCw, Eye, Loader2, TriangleAlert } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Disclaimer } from "@/components/app-shell";

export function AiOutputPanel({
  value,
  onChange,
  onRegenerate,
  loading,
  error,
  emptyHint,
}: {
  value: string;
  onChange: (next: string) => void;
  onRegenerate: () => void;
  loading: boolean;
  error?: string | null;
  emptyHint: string;
}) {
  const [editing, setEditing] = useState(false);
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    await navigator.clipboard.writeText(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 1600);
  };

  return (
    <section className="panel flex min-h-[420px] flex-col p-5">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-sm font-semibold uppercase tracking-[0.14em] text-primary-glow">
          AI Output
        </h2>
        <div className="flex flex-wrap gap-2">
          <Button
            variant="secondary"
            size="sm"
            disabled={!value}
            onClick={() => setEditing((e) => !e)}
          >
            {editing ? <Eye className="size-4" /> : <Pencil className="size-4" />}
            {editing ? "Preview" : "Edit"}
          </Button>
          <Button variant="secondary" size="sm" disabled={!value} onClick={copy}>
            {copied ? <Check className="size-4" /> : <Copy className="size-4" />}
            {copied ? "Copied" : "Copy"}
          </Button>
          <Button size="sm" disabled={loading} onClick={onRegenerate}>
            <RefreshCw className={`size-4 ${loading ? "animate-spin" : ""}`} />
            Regenerate
          </Button>
        </div>
      </div>

      {error && (
        <div className="mb-4 flex items-start gap-2 rounded-lg border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm text-destructive-foreground">
          <TriangleAlert className="mt-0.5 size-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <div className="flex-1">
        {loading && !value ? (
          <div className="flex h-full min-h-[280px] flex-col items-center justify-center gap-3 text-muted-foreground">
            <Loader2 className="size-6 animate-spin text-primary-glow" />
            <p className="text-sm">Generating with AI…</p>
          </div>
        ) : !value ? (
          <div className="flex h-full min-h-[280px] items-center justify-center rounded-lg border border-dashed border-border px-6 text-center text-sm text-muted-foreground">
            {emptyHint}
          </div>
        ) : editing ? (
          <Textarea
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="min-h-[420px] resize-y bg-surface-2/50 font-mono text-xs leading-relaxed"
          />
        ) : (
          <div className="ai-prose text-sm">
            <ReactMarkdown>{value}</ReactMarkdown>
          </div>
        )}
      </div>

      <div className="mt-5">
        <Disclaimer />
      </div>
    </section>
  );
}
