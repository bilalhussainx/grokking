import { NextRequest } from "next/server";
import { getGeminiModel } from "@/lib/gemini";

const SESSION_AI_PROMPT = `You are Grok, an intelligent AI assistant embedded in a live collaborative coding/writing session on the Grokking platform.

You are helping BOTH the teacher and student(s) brainstorm, solve problems, and learn together.

YOUR CAPABILITIES:
- Brainstorm problem ideas (algorithms, data structures, system design)
- Help break down complex problems into steps
- Suggest approaches without giving full solutions (unless the teacher asks)
- Generate coding challenges at different difficulty levels
- Help craft interview-style questions
- Explain concepts when asked
- Help debug code that's shared in the session
- Suggest prompts for further exploration

RULES:
- If a student asks, guide them — don't give direct answers unless the teacher has allowed it
- If the teacher asks, you can be more direct
- Keep responses concise (2-4 paragraphs max)
- Use code examples in Python by default unless another language is specified
- When brainstorming, use bullet points
- Be encouraging but honest
- If asked to generate problems, include difficulty level, time complexity target, and 1-2 examples

CONTEXT: You are in a live session. Both teacher and student can see your responses.`;

export async function POST(req: NextRequest) {
  try {
    const { message, role, sessionContext, history } = await req.json();

    const contextAddendum = sessionContext
      ? `\n\nSESSION CONTEXT:\n- Session type: ${sessionContext.type}\n- Current code:\n\`\`\`\n${sessionContext.code || "No code yet"}\n\`\`\`\n- Topic: ${sessionContext.topic || "General"}`
      : "";

    const roleNote = `\n\nThe person asking is a ${role}. Adjust your response accordingly.`;

    const model = getGeminiModel(SESSION_AI_PROMPT + contextAddendum + roleNote);

    const chatHistory = (history || []).map((msg: { role: string; content: string }) => ({
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
            if (text) controller.enqueue(encoder.encode(text));
          }
          controller.close();
        } catch (err) {
          controller.error(err);
        }
      },
    });

    return new Response(stream, {
      headers: { "Content-Type": "text/plain; charset=utf-8", "Transfer-Encoding": "chunked" },
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return Response.json({ error: message }, { status: 500 });
  }
}
