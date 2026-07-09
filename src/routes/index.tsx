import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Mail, CalendarClock, MessageSquare, Sun, ShieldCheck, ArrowRight, Lock } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const TIPS = [
  "Write concise emails — one clear ask per message.",
  "Prioritise important, high-impact work first thing in the day.",
  "Break large projects into smaller, checkable tasks.",
  "Schedule regular breaks — a 5-minute pause each hour improves focus.",
  "Review AI-generated content before sending or publishing.",
  "Batch similar tasks together to protect deep-work time.",
  "End each day by drafting tomorrow's top three priorities.",
];

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Dashboard — Workplace AI" },
      {
        name: "description",
        content:
          "Your AI productivity workspace: generate emails, plan your day, and chat with an intelligent workplace assistant.",
      },
    ],
  }),
  component: Dashboard,
});

const quickActions = [
  {
    to: "/email" as const,
    icon: Mail,
    title: "Generate a professional email",
    body: "Draft polished workplace emails in seconds — pick a tone, length, and key points.",
  },
  {
    to: "/planner" as const,
    icon: Sun,
    title: "Plan my day",
    body: "Turn a list of tasks into a prioritised, break-friendly daily schedule.",
    params: { mode: "Daily" },
  },
  {
    to: "/planner" as const,
    icon: CalendarClock,
    title: "Plan my week",
    body: "Balance deadlines, meetings, and focus time across your working week.",
    params: { mode: "Weekly" },
  },
  {
    to: "/chat" as const,
    icon: MessageSquare,
    title: "Chat with AI",
    body: "Ask for summaries, brainstorm ideas, or get communication and productivity advice.",
  },
];

function Dashboard() {
  const [tipIndex, setTipIndex] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setTipIndex((i) => (i + 1) % TIPS.length), 5000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-12">
      <section className="rounded-3xl border bg-gradient-to-br from-primary/8 via-background to-background p-6 sm:p-10">
        <div className="inline-flex items-center gap-2 rounded-full border bg-background/80 px-3 py-1 text-xs font-medium text-muted-foreground">
          <Lock className="h-3 w-3" /> Privacy-first · no sign-up · no data stored
        </div>
        <h1 className="mt-4 font-display text-3xl font-bold tracking-tight sm:text-4xl">
          Welcome to your AI workplace assistant
        </h1>
        <p className="mt-3 max-w-2xl text-muted-foreground sm:text-lg">
          Improve workplace productivity using AI-powered tools to generate professional emails,
          organise your work schedule, and receive intelligent workplace assistance — all without
          creating an account.
        </p>
      </section>

      <section className="mt-10">
        <h2 className="mb-4 font-display text-xl font-semibold">Quick actions</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          {quickActions.map((a) => (
            <Link
              key={a.title}
              to={a.to}
              search={a.params as never}
              className="group rounded-2xl border bg-card p-5 shadow-sm transition-all hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-md"
            >
              <div className="flex items-start gap-4">
                <div className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-primary/10 text-primary">
                  <a.icon className="h-5 w-5" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <h3 className="font-display font-semibold">{a.title}</h3>
                    <ArrowRight className="h-4 w-4 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
                  </div>
                  <p className="mt-1 text-sm text-muted-foreground">{a.body}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="mt-10 grid gap-4 md:grid-cols-3">
        <Card className="md:col-span-2">
          <CardContent className="p-5">
            <div className="text-xs font-medium uppercase tracking-wider text-primary">
              Productivity tip
            </div>
            <p key={tipIndex} className="mt-2 animate-in fade-in text-base font-medium">
              {TIPS[tipIndex]}
            </p>
            <div className="mt-4 flex gap-1">
              {TIPS.map((_, i) => (
                <span
                  key={i}
                  className={`h-1 flex-1 rounded-full transition-colors ${
                    i === tipIndex ? "bg-primary" : "bg-muted"
                  }`}
                />
              ))}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5">
            <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-wider text-primary">
              <ShieldCheck className="h-3.5 w-3.5" /> Privacy first
            </div>
            <p className="mt-2 text-sm text-muted-foreground">
              This app never collects or stores your emails, plans, or chats. Everything clears when
              you close the tab.
            </p>
            <Link
              to="/responsible-ai"
              className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline"
            >
              Read our approach <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
