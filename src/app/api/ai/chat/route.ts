import { NextRequest } from "next/server";
import { getGeminiModel } from "@/lib/gemini";
import { AGENT_SYSTEM_PROMPTS, buildChatContext } from "@/lib/ai-prompts";
import { AIChatRequest } from "@/types/ai";

export async function POST(req: NextRequest) {
  try {
    const body: AIChatRequest = await req.json();
    const { message, mode, lessonTitle, lessonContent, moduleTitle, courseTitle, currentCode, history } = body;

    const systemPrompt = AGENT_SYSTEM_PROMPTS[mode] +
      buildChatContext(lessonTitle, lessonContent, moduleTitle, courseTitle, currentCode);

    const model = getGeminiModel(systemPrompt);

    const chatHistory = history.map((msg) => ({
      role: msg.role === "assistant" ? "model" as const : "user" as const,
      parts: [{ text: msg.content }],
    }));

    const chat = model.startChat({ history: chatHistory });

    const result = await chat.sendMessageStream(message);

    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of result.stream) {
            const text = chunk.text();
            if (text) {
              controller.enqueue(encoder.encode(text));
            }
          }
          controller.close();
        } catch (err) {
          controller.error(err);
        }
      },
    });

    return new Response(stream, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Transfer-Encoding": "chunked",
      },
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return Response.json({ error: message }, { status: 500 });
  }
}
