import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { toast } from "sonner";
import { Copy, RefreshCw, Trash2, Loader2, Wand2 } from "lucide-react";
import { generatePlan } from "@/lib/planner.functions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DisclaimerBanner } from "@/components/disclaimer-banner";

const search = z.object({ mode: z.enum(["Daily", "Weekly"]).optional() });

export const Route = createFileRoute("/planner")({
  validateSearch: search,
  head: () => ({
    meta: [
      { title: "AI Task Planner — Workplace AI" },
      {
        name: "description",
        content:
          "Turn tasks, meetings, and deadlines into a prioritised schedule. Edit the plan and export it — nothing is saved.",
      },
    ],
  }),
  component: Planner,
});

type Priority = "High" | "Medium" | "Low";
type Item = { time: string; title: string; priority: Priority; note: string };
type Plan = {
  items: Item[];
  breakRecommendations: string;
  productivityTips: string[];
  estimatedCompletion: string;
};

function Planner() {
  const { mode: initialMode } = Route.useSearch();
  const [mode, setMode] = useState<"Daily" | "Weekly">(initialMode ?? "Daily");
  const [workingHours, setWorkingHours] = useState("09:00 – 17:00, Mon–Fri");
  const [meetings, setMeetings] = useState("");
  const [deadlines, setDeadlines] = useState("");
  const [tasks, setTasks] = useState("");
  const [breaks, setBreaks] = useState("5 min break each hour, 30 min lunch");
  const [plan, setPlan] = useState<Plan | null>(null);
  const [loading, setLoading] = useState(false);
  const gen = useServerFn(generatePlan);

  const run = async () => {
    if (!tasks.trim()) {
      toast.error("Please add at least one task.");
      return;
    }
    setLoading(true);
    try {
      const res = await gen({
        data: { mode, workingHours, meetings, deadlines, tasks, breaks },
      });
      setPlan(res as Plan);
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Failed to generate plan.";
      if (msg.includes("429")) toast.error("Rate limit reached — please retry shortly.");
      else if (msg.includes("402")) toast.error("AI credits exhausted. Please add credits.");
      else toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  const copy = async () => {
    if (!plan) return;
    const text = [
      `${mode} plan`,
      "",
      ...plan.items.map((i) => `${i.time} — [${i.priority}] ${i.title}${i.note ? " · " + i.note : ""}`),
      "",
      "Breaks: " + plan.breakRecommendations,
      "",
      "Tips:",
      ...plan.productivityTips.map((t) => "- " + t),
      "",
      "Estimated: " + plan.estimatedCompletion,
    ].join("\n");
    await navigator.clipboard.writeText(text);
    toast.success("Plan copied");
  };

  const updateItem = (idx: number, patch: Partial<Item>) => {
    if (!plan) return;
    const items = plan.items.map((it, i) => (i === idx ? { ...it, ...patch } : it));
    setPlan({ ...plan, items });
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
      <header className="mb-6">
        <h1 className="font-display text-2xl font-bold sm:text-3xl">AI Task Planner</h1>
        <p className="mt-1 text-muted-foreground">
          Share your tasks, meetings and constraints — get a prioritised, break-friendly schedule.
        </p>
      </header>

      <div className="mb-6">
        <DisclaimerBanner />
      </div>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.4fr)]">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Inputs</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Tabs value={mode} onValueChange={(v) => setMode(v as "Daily" | "Weekly")}>
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="Daily">Daily</TabsTrigger>
                <TabsTrigger value="Weekly">Weekly</TabsTrigger>
              </TabsList>
            </Tabs>

            <div className="grid gap-2">
              <Label htmlFor="wh">Working hours</Label>
              <Input id="wh" value={workingHours} onChange={(e) => setWorkingHours(e.target.value)} />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="mt">Meetings (time · topic, one per line)</Label>
              <Textarea id="mt" rows={3} value={meetings} onChange={(e) => setMeetings(e.target.value)} placeholder="10:00-10:30 · Standup&#10;14:00-15:00 · Design review" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="dl">Deadlines</Label>
              <Textarea id="dl" rows={2} value={deadlines} onChange={(e) => setDeadlines(e.target.value)} placeholder="Report due Thu 5pm" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="ts">Tasks with priority (one per line)</Label>
              <Textarea id="ts" rows={5} value={tasks} onChange={(e) => setTasks(e.target.value)} placeholder="High · Finalise Q3 report&#10;Medium · Reply to customer emails&#10;Low · Tidy shared drive" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="br">Break preferences</Label>
              <Input id="br" value={breaks} onChange={(e) => setBreaks(e.target.value)} />
            </div>

            <Button onClick={run} disabled={loading} className="w-full">
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Planning...
                </>
              ) : (
                <>
                  <Wand2 className="mr-2 h-4 w-4" /> Generate plan
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex-row items-center justify-between gap-2 space-y-0">
            <CardTitle className="text-base">Suggested {mode.toLowerCase()} schedule</CardTitle>
            <div className="flex gap-1">
              <Button size="sm" variant="ghost" onClick={copy} disabled={!plan}>
                <Copy className="h-4 w-4" />
              </Button>
              <Button size="sm" variant="ghost" onClick={run} disabled={loading || !plan}>
                <RefreshCw className="h-4 w-4" />
              </Button>
              <Button size="sm" variant="ghost" onClick={() => setPlan(null)} disabled={!plan}>
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {!plan && (
              <div className="rounded-xl border border-dashed p-8 text-center text-sm text-muted-foreground">
                Fill in the form and click Generate to see your plan here.
              </div>
            )}
            {plan && (
              <>
                <ul className="space-y-2">
                  {plan.items.map((item, idx) => (
                    <li
                      key={idx}
                      className={`rounded-xl border p-3 ${priorityBg(item.priority)}`}
                    >
                      <div className="flex flex-wrap items-center gap-2 text-xs">
                        <span className="font-mono font-medium">{item.time}</span>
                        <PriorityPill priority={item.priority} onChange={(p) => updateItem(idx, { priority: p })} />
                      </div>
                      <Input
                        value={item.title}
                        onChange={(e) => updateItem(idx, { title: e.target.value })}
                        className="mt-2 border-0 bg-transparent px-0 text-sm font-medium shadow-none focus-visible:ring-0"
                      />
                      {item.note && (
                        <p className="mt-1 text-xs text-muted-foreground">{item.note}</p>
                      )}
                    </li>
                  ))}
                </ul>
                {plan.breakRecommendations && (
                  <div className="rounded-xl border bg-muted/50 p-3">
                    <div className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                      Break recommendations
                    </div>
                    <p className="mt-1 text-sm">{plan.breakRecommendations}</p>
                  </div>
                )}
                {plan.productivityTips.length > 0 && (
                  <div className="rounded-xl border bg-muted/50 p-3">
                    <div className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                      Tips
                    </div>
                    <ul className="mt-1 list-disc space-y-1 pl-5 text-sm">
                      {plan.productivityTips.map((t, i) => (
                        <li key={i}>{t}</li>
                      ))}
                    </ul>
                  </div>
                )}
                {plan.estimatedCompletion && (
                  <div className="text-xs text-muted-foreground">
                    Estimated completion: <span className="font-medium text-foreground">{plan.estimatedCompletion}</span>
                  </div>
                )}
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function priorityBg(p: Priority) {
  if (p === "High") return "bg-priority-high/60 border-priority-high";
  if (p === "Medium") return "bg-priority-med/60 border-priority-med";
  return "bg-priority-low/60 border-priority-low";
}

function PriorityPill({ priority, onChange }: { priority: Priority; onChange: (p: Priority) => void }) {
  const next: Record<Priority, Priority> = { High: "Medium", Medium: "Low", Low: "High" };
  const fg =
    priority === "High"
      ? "text-priority-high-foreground"
      : priority === "Medium"
        ? "text-priority-med-foreground"
        : "text-priority-low-foreground";
  return (
    <button
      type="button"
      onClick={() => onChange(next[priority])}
      className={`rounded-full border bg-background/60 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${fg}`}
      title="Click to change priority"
    >
      {priority}
    </button>
  );
}
