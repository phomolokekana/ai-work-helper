import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import jsPDF from "jspdf";
import { toast } from "sonner";
import { Copy, RefreshCw, Trash2, Download, Loader2, Wand2, FileText } from "lucide-react";
import { generateEmail } from "@/lib/email.functions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { DisclaimerBanner } from "@/components/disclaimer-banner";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export const Route = createFileRoute("/email")({
  head: () => ({
    meta: [
      { title: "Smart Email Generator — Workplace AI" },
      {
        name: "description",
        content:
          "Draft professional workplace emails in seconds. Pick a tone and length, and edit before sending.",
      },
    ],
  }),
  component: EmailPage,
});

type Tone = "Formal" | "Friendly" | "Persuasive";
type Length = "Short" | "Medium" | "Detailed";

function EmailPage() {
  const generate = useServerFn(generateEmail);
  const [recipient, setRecipient] = useState("");
  const [subjectHint, setSubjectHint] = useState("");
  const [purpose, setPurpose] = useState("");
  const [keyPoints, setKeyPoints] = useState("");
  const [tone, setTone] = useState<Tone>("Formal");
  const [length, setLength] = useState<Length>("Medium");

  const [outSubject, setOutSubject] = useState("");
  const [outBody, setOutBody] = useState("");
  const [loading, setLoading] = useState(false);

  const run = async () => {
    if (!purpose.trim()) {
      toast.error("Please describe the purpose of the email.");
      return;
    }
    setLoading(true);
    try {
      const res = await generate({
        data: { recipient, subject: subjectHint, purpose, keyPoints, tone, length },
      });
      setOutSubject(res.subject);
      setOutBody(res.body);
    } catch (e) {
      console.error(e);
      const msg = e instanceof Error ? e.message : "Failed to generate email.";
      if (msg.includes("429")) toast.error("Rate limit reached — please retry shortly.");
      else if (msg.includes("402")) toast.error("AI credits exhausted. Please add credits.");
      else toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  const copy = async () => {
    await navigator.clipboard.writeText(`Subject: ${outSubject}\n\n${outBody}`);
    toast.success("Copied to clipboard");
  };
  const clear = () => {
    setOutSubject("");
    setOutBody("");
  };
  const downloadTxt = () => {
    const blob = new Blob([`Subject: ${outSubject}\n\n${outBody}`], { type: "text/plain" });
    triggerDownload(blob, "email.txt");
  };
  const downloadPdf = () => {
    const doc = new jsPDF({ unit: "pt", format: "a4" });
    const margin = 48;
    const width = doc.internal.pageSize.getWidth() - margin * 2;
    doc.setFont("helvetica", "bold");
    doc.setFontSize(14);
    doc.text(`Subject: ${outSubject}`, margin, margin);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(11);
    const lines = doc.splitTextToSize(outBody, width);
    doc.text(lines, margin, margin + 28);
    doc.save("email.pdf");
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
      <header className="mb-6">
        <h1 className="font-display text-2xl font-bold sm:text-3xl">Smart Email Generator</h1>
        <p className="mt-1 text-muted-foreground">
          Describe the email and we'll draft it. Edit anything before sending.
        </p>
      </header>

      <div className="mb-6">
        <DisclaimerBanner />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Compose</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="recipient">Recipient</Label>
              <Input
                id="recipient"
                placeholder="e.g. Priya, my manager"
                value={recipient}
                onChange={(e) => setRecipient(e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="subject">Suggested subject (optional)</Label>
              <Input
                id="subject"
                placeholder="e.g. Project update — Q3"
                value={subjectHint}
                onChange={(e) => setSubjectHint(e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="purpose">Purpose of email</Label>
              <Textarea
                id="purpose"
                placeholder="Follow up on our meeting and confirm next steps..."
                rows={3}
                value={purpose}
                onChange={(e) => setPurpose(e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="key">Key points (one per line)</Label>
              <Textarea
                id="key"
                placeholder="- Deliverable A is ready&#10;- Need approval by Friday&#10;- Attach report v2"
                rows={4}
                value={keyPoints}
                onChange={(e) => setKeyPoints(e.target.value)}
              />
            </div>

            <div className="grid gap-2">
              <Label>Tone</Label>
              <RadioGroup
                value={tone}
                onValueChange={(v) => setTone(v as Tone)}
                className="grid grid-cols-3 gap-2"
              >
                {(["Formal", "Friendly", "Persuasive"] as Tone[]).map((t) => (
                  <label
                    key={t}
                    className="flex cursor-pointer items-center gap-2 rounded-lg border p-2.5 text-sm hover:bg-accent"
                  >
                    <RadioGroupItem value={t} /> {t}
                  </label>
                ))}
              </RadioGroup>
            </div>

            <div className="grid gap-2">
              <Label>Length</Label>
              <RadioGroup
                value={length}
                onValueChange={(v) => setLength(v as Length)}
                className="grid grid-cols-3 gap-2"
              >
                {(["Short", "Medium", "Detailed"] as Length[]).map((t) => (
                  <label
                    key={t}
                    className="flex cursor-pointer items-center gap-2 rounded-lg border p-2.5 text-sm hover:bg-accent"
                  >
                    <RadioGroupItem value={t} /> {t}
                  </label>
                ))}
              </RadioGroup>
            </div>

            <Button onClick={run} disabled={loading} className="w-full">
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Generating...
                </>
              ) : (
                <>
                  <Wand2 className="mr-2 h-4 w-4" /> Generate email
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex-row items-center justify-between gap-2 space-y-0">
            <CardTitle className="text-base">Generated email</CardTitle>
            <div className="flex flex-wrap gap-1">
              <Button size="sm" variant="ghost" onClick={copy} disabled={!outBody}>
                <Copy className="h-4 w-4" />
              </Button>
              <Button size="sm" variant="ghost" onClick={run} disabled={loading || !outBody}>
                <RefreshCw className="h-4 w-4" />
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button size="sm" variant="ghost" disabled={!outBody}>
                    <Download className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={downloadTxt}>
                    <FileText className="mr-2 h-4 w-4" /> TXT
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={downloadPdf}>
                    <FileText className="mr-2 h-4 w-4" /> PDF
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              <Button size="sm" variant="ghost" onClick={clear} disabled={!outBody}>
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="grid gap-2">
              <Label htmlFor="outSubject" className="text-xs uppercase tracking-wide text-muted-foreground">
                Subject
              </Label>
              <Input
                id="outSubject"
                value={outSubject}
                onChange={(e) => setOutSubject(e.target.value)}
                placeholder="Your subject line will appear here"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="outBody" className="text-xs uppercase tracking-wide text-muted-foreground">
                Body
              </Label>
              <Textarea
                id="outBody"
                value={outBody}
                onChange={(e) => setOutBody(e.target.value)}
                placeholder="Your email will appear here. Fill in the form and click Generate."
                rows={18}
                className="font-sans leading-relaxed"
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function triggerDownload(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}
