import { createFileRoute } from "@tanstack/react-router";
import { streamText, convertToModelMessages, type UIMessage } from "ai";
import { createLovableAiGatewayProvider, CHAT_MODEL } from "@/lib/ai-gateway.server";

const SYSTEM =
  "You are an AI Workplace Productivity Assistant designed to help professionals improve workplace efficiency. Provide practical, accurate, and professional assistance with workplace communications, task management, meeting summaries, brainstorming, report writing, project planning, and productivity. Ask clarifying questions when necessary, maintain a professional tone, and encourage users to review AI-generated content before use. Use concise markdown formatting.";

export const Route = createFileRoute("/api/chat")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const body = (await request.json()) as { messages?: UIMessage[] };
        if (!Array.isArray(body.messages)) {
          return new Response("messages required", { status: 400 });
        }
        const key = process.env.LOVABLE_API_KEY;
        if (!key) return new Response("Missing LOVABLE_API_KEY", { status: 500 });

        const gateway = createLovableAiGatewayProvider(key);
        const result = streamText({
          model: gateway(CHAT_MODEL),
          system: SYSTEM,
          messages: await convertToModelMessages(body.messages),
        });
        return result.toUIMessageStreamResponse({ originalMessages: body.messages });
      },
    },
  },
});
