import { createServerFn } from "@tanstack/react-start";
import { generateText, Output, NoObjectGeneratedError } from "ai";
import { z } from "zod";
import { createLovableAiGatewayProvider, CHAT_MODEL } from "./ai-gateway.server";

const Input = z.object({
  recipient: z.string(),
  subject: z.string().optional().default(""),
  purpose: z.string(),
  keyPoints: z.string().optional().default(""),
  tone: z.enum(["Formal", "Friendly", "Persuasive"]),
  length: z.enum(["Short", "Medium", "Detailed"]),
});

const OutSchema = z.object({
  subject: z.string(),
  body: z.string(),
});

export const generateEmail = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => Input.parse(d))
  .handler(async ({ data }) => {
    const key = process.env.LOVABLE_API_KEY;
    if (!key) throw new Error("Missing LOVABLE_API_KEY");
    const gateway = createLovableAiGatewayProvider(key);
    const model = gateway(CHAT_MODEL);

    const system =
      "You are an experienced corporate communications assistant. Generate a professional workplace email based on the user's purpose, selected tone, audience, and key points. Ensure the email is grammatically correct, concise, respectful, and ready to send. Include a subject line and a professional closing.";

    const lengthGuide = {
      Short: "Keep the body under ~80 words. Be concise.",
      Medium: "Aim for ~120-180 words.",
      Detailed: "Aim for ~220-320 words with clear paragraphs.",
    }[data.length];

    const prompt = `Recipient: ${data.recipient}
Suggested subject: ${data.subject || "(let you decide)"}
Purpose: ${data.purpose}
Key points: ${data.keyPoints || "(none provided)"}
Tone: ${data.tone}
Length: ${data.length}. ${lengthGuide}

Return a JSON object with:
- subject: a concise professional subject line
- body: the full email body including a greeting and a professional closing (do NOT include the subject line in the body)`;

    try {
      const result = await generateText({
        model,
        system,
        prompt,
        output: Output.object({ schema: OutSchema }),
      });
      return result.output;
    } catch (error) {
      if (NoObjectGeneratedError.isInstance(error)) {
        return { subject: data.subject || "Message", body: error.text ?? "" };
      }
      throw error;
    }
  });
