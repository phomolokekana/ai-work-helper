import { AlertTriangle } from "lucide-react";

export function DisclaimerBanner() {
  return (
    <div className="flex gap-3 rounded-xl border border-amber-200/60 bg-amber-50/70 p-3 text-sm text-amber-900 dark:border-amber-500/20 dark:bg-amber-500/10 dark:text-amber-200">
      <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
      <p className="leading-relaxed">
        <strong className="font-semibold">Responsible AI:</strong> AI-generated content may be
        inaccurate or incomplete. Always review and edit outputs before sending, publishing, or
        making business decisions.
      </p>
    </div>
  );
}
