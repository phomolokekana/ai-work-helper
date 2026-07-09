import { createServerFn } from "@tanstack/react-start";
import { generateText, Output, NoObjectGeneratedError } from "ai";
import { z } from "zod";
import { createLovableAiGatewayProvider, CHAT_MODEL } from "./ai-gateway.server";

const Input = z.object({
  mode: z.enum(["Daily", "Weekly"]),
  workingHours: z.string(),
  meetings: z.string().optional().default(""),
  deadlines: z.string().optional().default(""),
  tasks: z.string(),
  breaks: z.string().optional().default(""),
});

const PlanSchema = z.object({
  items: z.array(
    z.object({
      time: z.string(),
      title: z.string(),
      priority: z.enum(["High", "Medium", "Low"]),
      note: z.string(),
    }),
  ),
  breakRecommendations: z.string(),
  productivityTips: z.array(z.string()),
  estimatedCompletion: z.string(),
});

export const generatePlan = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => Input.parse(d))
  .handler(async ({ data }) => {
    const key = process.env.LOVABLE_API_KEY;
    if (!key) throw new Error("Missing LOVABLE_API_KEY");
    const gateway = createLovableAiGatewayProvider(key);
    const model = gateway(CHAT_MODEL);

    const system =
      "You are an expert productivity coach. Analyse the user's tasks, deadlines, working hours, priorities, meetings, and available time. Generate an optimised daily or weekly schedule that prioritises important work, balances workload, recommends breaks, and improves productivity. Clearly indicate high-, medium-, and low-priority tasks.";

    const prompt = `Planning mode: ${data.mode}
Working hours: ${data.workingHours}
Meetings: ${data.meetings || "(none)"}
Deadlines: ${data.deadlines || "(none)"}
Tasks: ${data.tasks}
Break preferences: ${data.breaks || "(default: 5-min breaks each hour, 30-min lunch)"}

Return a JSON object with:
- items: an ordered array of schedule blocks, each with time (e.g. "09:00 - 10:00" for daily, or "Mon 09:00 - 10:00" for weekly), title, priority (High/Medium/Low), note
- breakRecommendations: short paragraph
- productivityTips: 3-5 short tips
- estimatedCompletion: brief estimate string`;

    try {
      const result = await generateText({
        model,
        system,
        prompt,
        output: Output.object({ schema: PlanSchema }),
      });
      return result.output;
    } catch (error) {
      if (NoObjectGeneratedError.isInstance(error)) {
        return {
          items: [],
          breakRecommendations: "AI response could not be parsed. Please try again.",
          productivityTips: [],
          estimatedCompletion: "",
        };
      }
      throw error;
    }
  });
