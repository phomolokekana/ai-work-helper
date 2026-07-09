import { createFileRoute } from "@tanstack/react-router";
import { ShieldCheck, EyeOff, UserCheck, AlertTriangle, Lock, Sparkles } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export const Route = createFileRoute("/responsible-ai")({
  head: () => ({
    meta: [
      { title: "Responsible AI — Workplace AI" },
      {
        name: "description",
        content:
          "How we approach responsible AI: limitations, human review, privacy, ethics, and data security.",
      },
    ],
  }),
  component: ResponsibleAI,
});

const sections = [
  {
    icon: AlertTriangle,
    title: "AI limitations",
    body: "AI models can produce inaccurate, incomplete, or outdated information. They can misinterpret context, invent details, or reflect biases from their training data.",
  },
  {
    icon: UserCheck,
    title: "Human review",
    body: "Every AI output — emails, plans, chat replies — should be reviewed and edited before sending, sharing, or acting on it. You remain accountable for the final content.",
  },
  {
    icon: EyeOff,
    title: "Privacy",
    body: "We do not collect accounts, profiles, or personal data. Everything you type is used only to answer your request during this browser session and is cleared when you close the tab.",
  },
  {
    icon: Sparkles,
    title: "Ethical use",
    body: "Do not use this assistant to deceive, harass, or infringe on others' rights. Avoid entering confidential company data unless your organisation permits AI processing of that information.",
  },
  {
    icon: Lock,
    title: "Data security",
    body: "Requests are sent over HTTPS to an AI provider for processing. No conversation, plan, or email is written to a database, log file, or long-term store.",
  },
  {
    icon: ShieldCheck,
    title: "Best practices",
    body: "Be specific in your prompts, break big questions into smaller ones, verify facts against a trusted source, and never rely on AI alone for legal, medical, or high-risk decisions.",
  },
];

function ResponsibleAI() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 sm:py-12">
      <header className="mb-8">
        <div className="inline-flex items-center gap-2 rounded-full border bg-background px-3 py-1 text-xs font-medium text-muted-foreground">
          <ShieldCheck className="h-3.5 w-3.5" /> Responsible AI
        </div>
        <h1 className="mt-3 font-display text-3xl font-bold tracking-tight sm:text-4xl">
          Our approach to responsible AI
        </h1>
        <p className="mt-3 text-muted-foreground">
          AI is a productivity tool, not a replacement for human judgement. Here's how we design
          this app to keep you in control.
        </p>
      </header>

      <div className="mb-8 rounded-2xl border border-amber-200/60 bg-amber-50/70 p-4 text-sm text-amber-900 dark:border-amber-500/20 dark:bg-amber-500/10 dark:text-amber-200">
        <strong className="font-semibold">Disclaimer:</strong> AI-generated content is designed to
        assist and may occasionally be inaccurate or incomplete. Always review and edit outputs
        before sending emails, sharing information, or making business decisions. You remain
        responsible for the accuracy and appropriateness of all final outputs.
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {sections.map((s) => (
          <Card key={s.title}>
            <CardContent className="p-5">
              <div className="grid h-10 w-10 place-items-center rounded-xl bg-primary/10 text-primary">
                <s.icon className="h-5 w-5" />
              </div>
              <h2 className="mt-3 font-display text-lg font-semibold">{s.title}</h2>
              <p className="mt-1.5 text-sm text-muted-foreground">{s.body}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <section className="mt-8 rounded-2xl border bg-card p-5">
        <h2 className="font-display text-lg font-semibold">Privacy notice</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          <strong className="font-semibold text-foreground">Privacy First:</strong> This application
          does not require registration or login and does not collect, store, or retain any personal
          information, conversations, generated emails, or task plans. All interactions occur only
          within your current browser session and are automatically cleared when the page is
          refreshed or closed.
        </p>
      </section>
    </div>
  );
}
