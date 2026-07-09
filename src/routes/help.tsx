import { createFileRoute } from "@tanstack/react-router";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Card, CardContent } from "@/components/ui/card";
import { Mail, CalendarClock, MessageSquare } from "lucide-react";

export const Route = createFileRoute("/help")({
  head: () => ({
    meta: [
      { title: "Help & FAQ — Workplace AI" },
      {
        name: "description",
        content:
          "Learn how to use Workplace AI: email generation, planning, chat, prompt tips, and privacy details.",
      },
    ],
  }),
  component: Help,
});

const features = [
  {
    icon: Mail,
    title: "Smart Email Generator",
    body: "Draft workplace emails with a chosen tone and length. Edit the output, copy it, or export as TXT or PDF.",
  },
  {
    icon: CalendarClock,
    title: "AI Task Planner",
    body: "Turn a task list, meetings, and deadlines into a prioritised daily or weekly schedule.",
  },
  {
    icon: MessageSquare,
    title: "AI Workplace Chatbot",
    body: "Ask for summaries, drafts, brainstorming, and productivity advice. Session-only chat — no history stored.",
  },
];

const faqs = [
  {
    q: "Do I need an account?",
    a: "No. Workplace AI has no sign-up, login, or profile. Open the app and start using every feature immediately.",
  },
  {
    q: "Where is my data stored?",
    a: "It isn't. Your inputs, emails, plans, and chats live only in your current browser tab. Refresh or close the tab and everything is gone.",
  },
  {
    q: "How accurate are the AI outputs?",
    a: "Modern AI is good but not infallible. Always review and edit before sending or making decisions. Treat outputs as first drafts.",
  },
  {
    q: "Can I export what I generate?",
    a: "Yes — emails can be copied or downloaded as TXT/PDF. Plans and chats can be copied to your clipboard.",
  },
  {
    q: "What if generation fails?",
    a: "You'll see a message describing the issue. Common causes are rate limits or credit exhaustion; try again in a moment.",
  },
];

const tips = [
  "Be specific — say who the audience is, what you want, and any constraints.",
  "Provide examples of the style you want when tone matters.",
  "Break big tasks into smaller prompts and iterate.",
  "Ask the assistant to list assumptions before it answers.",
  "For plans, share realistic working hours and any fixed meetings.",
];

function Help() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 sm:py-12">
      <header className="mb-8">
        <h1 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">Help</h1>
        <p className="mt-2 text-muted-foreground">
          A quick guide to Workplace AI — what it does, how to get the best results, and how we
          handle your data.
        </p>
      </header>

      <section className="mb-10">
        <h2 className="mb-3 font-display text-xl font-semibold">Overview</h2>
        <p className="text-sm text-muted-foreground">
          Workplace AI is a privacy-first productivity assistant. It bundles three AI-powered tools
          — email writing, task planning, and a workplace chatbot — behind a clean dashboard, with
          no account and no persistent storage.
        </p>
      </section>

      <section className="mb-10">
        <h2 className="mb-3 font-display text-xl font-semibold">Features</h2>
        <div className="grid gap-4 sm:grid-cols-3">
          {features.map((f) => (
            <Card key={f.title}>
              <CardContent className="p-5">
                <div className="grid h-10 w-10 place-items-center rounded-xl bg-primary/10 text-primary">
                  <f.icon className="h-5 w-5" />
                </div>
                <h3 className="mt-3 font-display font-semibold">{f.title}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{f.body}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section className="mb-10">
        <h2 className="mb-3 font-display text-xl font-semibold">Frequently asked questions</h2>
        <Accordion type="single" collapsible className="rounded-xl border bg-card">
          {faqs.map((f, i) => (
            <AccordionItem key={i} value={`q${i}`} className="border-b last:border-b-0">
              <AccordionTrigger className="px-4 text-left">{f.q}</AccordionTrigger>
              <AccordionContent className="px-4 text-sm text-muted-foreground">
                {f.a}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </section>

      <section className="mb-10">
        <h2 className="mb-3 font-display text-xl font-semibold">Tips for effective AI prompts</h2>
        <ul className="space-y-2 rounded-xl border bg-card p-5 text-sm">
          {tips.map((t) => (
            <li key={t} className="flex gap-2">
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" /> {t}
            </li>
          ))}
        </ul>
      </section>

      <section className="rounded-2xl border bg-card p-5">
        <h2 className="font-display text-lg font-semibold">Privacy & responsible use</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          No account, no database, no analytics tied to you. Read our{" "}
          <a href="/responsible-ai" className="text-primary hover:underline">
            Responsible AI page
          </a>{" "}
          for a full explanation of limitations, human review, and best practices.
        </p>
      </section>
    </div>
  );
}
