import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { generateAiOutput } from "@/lib/ai.functions";

type Tool = "email" | "meeting" | "planner" | "research";

export function useAiTool(tool: Tool) {
  const generate = useServerFn(generateAiOutput);
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastFields, setLastFields] = useState<Record<string, string> | null>(null);
  const [variation, setVariation] = useState(0);

  const run = async (fields: Record<string, string>, isRegenerate = false) => {
    setLoading(true);
    setError(null);
    const nextVariation = isRegenerate ? variation + 1 : 0;
    setVariation(nextVariation);
    setLastFields(fields);
    try {
      const result = await generate({ data: { tool, fields, variation: nextVariation } });
      setOutput(result.text);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Something went wrong generating this output.");
    } finally {
      setLoading(false);
    }
  };

  const regenerate = () => {
    if (lastFields) void run(lastFields, true);
    else setError("Fill in the form and generate once before regenerating.");
  };

  return { output, setOutput, loading, error, run, regenerate, hasInput: !!lastFields };
}
