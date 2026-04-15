// Shared LLM streaming helper for the essay workbench routes.
// Spec: CollegeVCareers.md SP-10.
//
// Tries OpenRouter (Sonnet for critique quality, cheaper models for ideation)
// and falls back to Moonshot Kimi. Returns a plain-text stream — same contract
// as the /api/ai/coach route so the client code reads the same way.

const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY || "";
const OPENROUTER_URL = "https://openrouter.ai/api/v1/chat/completions";
const MOONSHOT_API_KEY = process.env.MOONSHOT_API_KEY || "";
const MOONSHOT_URL = "https://api.moonshot.ai/v1/chat/completions";

export type EssayTask = "ideate" | "outline" | "critique" | "rewrite";

function pickModel(task: EssayTask): string {
  // Critique + rewrite need real quality; ideation + outline can be cheaper.
  if (task === "critique" || task === "rewrite") return "anthropic/claude-sonnet-4";
  return "openai/gpt-4o-mini";
}

export interface ChatMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

export async function streamEssayLLM(
  task: EssayTask,
  messages: ChatMessage[],
  opts: { temperature?: number; maxTokens?: number } = {}
): Promise<Response> {
  const useOpenRouter = !!OPENROUTER_API_KEY;
  const apiUrl = useOpenRouter ? OPENROUTER_URL : MOONSHOT_URL;
  const apiKey = useOpenRouter ? OPENROUTER_API_KEY : MOONSHOT_API_KEY;
  const model = useOpenRouter ? pickModel(task) : "kimi-k2-turbo-preview";

  const llmRes = await fetch(apiUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
      ...(useOpenRouter ? { "HTTP-Referer": "https://kairos.ai", "X-Title": "Kairos.ai Essay" } : {}),
    },
    body: JSON.stringify({
      model,
      messages,
      stream: true,
      temperature: opts.temperature ?? 0.7,
      max_tokens: opts.maxTokens ?? 1200,
    }),
  });

  if (!llmRes.ok || !llmRes.body) {
    const errText = await llmRes.text().catch(() => "");
    throw new Error(`LLM ${llmRes.status}: ${errText.slice(0, 200)}`);
  }

  const reader = llmRes.body.getReader();
  const decoder = new TextDecoder();
  const encoder = new TextEncoder();

  const stream = new ReadableStream({
    async pull(controller) {
      let buffer = "";
      while (true) {
        const { done, value } = await reader.read();
        if (done) {
          controller.close();
          return;
        }
        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() || "";
        for (const line of lines) {
          const t = line.trim();
          if (!t.startsWith("data: ")) continue;
          const data = t.slice(6);
          if (data === "[DONE]") {
            controller.close();
            return;
          }
          try {
            const parsed = JSON.parse(data);
            const content = parsed.choices?.[0]?.delta?.content;
            if (content) controller.enqueue(encoder.encode(content));
          } catch {
            // skip malformed
          }
        }
      }
    },
    cancel() {
      reader.cancel();
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Transfer-Encoding": "chunked",
    },
  });
}

export function buildIdeationMessages(params: {
  prompt: string;
  schoolName?: string;
  wordTarget?: number;
  applicantProfile?: {
    intendedMajor?: string;
    topProjectTitle?: string;
    topProjectDescription?: string;
    recentInfluence?: string;
  };
}): ChatMessage[] {
  const profileBlock = params.applicantProfile
    ? `\nWHAT YOU KNOW ABOUT THIS STUDENT:
- Intended major: ${params.applicantProfile.intendedMajor || "(not shared)"}
- Top project: ${params.applicantProfile.topProjectTitle || "(not shared)"}${params.applicantProfile.topProjectDescription ? ` — ${params.applicantProfile.topProjectDescription}` : ""}
- Recent influence: ${params.applicantProfile.recentInfluence || "(not shared)"}`
    : "";

  const system = `You are a veteran college admissions essay coach. You have read 10,000 essays. You know which angles work and which fall flat.

Your job right now is IDEATION — not writing. The student has a prompt. Give them 3 genuinely different angles they could take, each one rooted in something REAL about their life, not generic stuff.

For each angle:
1. Name the angle in 4-6 words (bold as an H3).
2. One paragraph (3-5 sentences) on what story the student would tell, what tension it would explore, and why it answers the prompt.
3. One line on the RISK of this angle — what could go wrong.

At the end, add a short "What to think about first" section with 2-3 probing questions the student should answer on paper before they start drafting.

Tone: direct, like a smart older sibling. No cheerleading. No "any of these could be great!" — rank them implicitly by how much you believe in them.
${params.schoolName ? `\nTarget school: ${params.schoolName}. Don't pander to the school, but if an angle is obviously a stronger fit for ${params.schoolName}'s values, say so.` : ""}
${params.wordTarget ? `\nTarget length: ${params.wordTarget} words.` : ""}${profileBlock}`;

  const user = `Essay prompt:\n"${params.prompt}"\n\nGive me 3 angles.`;

  return [
    { role: "system", content: system },
    { role: "user", content: user },
  ];
}

export function buildCritiqueMessages(params: {
  prompt: string;
  draft: string;
  schoolName?: string;
  wordTarget?: number;
}): ChatMessage[] {
  const system = `You are a veteran college admissions essay reader. You are reading a student's draft and giving honest, actionable feedback.

Return your critique in this exact structure (markdown):

## Overall verdict
One short paragraph (3-4 sentences). Be honest. Is this draft working? What's the one biggest thing to fix?

## What's working
3 bullets of specific things to keep. Quote short phrases from the draft when possible.

## What to fix
3-5 bullets, each one:
- Quote the specific sentence or phrase that needs work
- Say what's wrong with it in one sentence
- Give a concrete fix ("try: ...")

## One line you should cut
Pick the weakest sentence in the essay and explain why it should go.

## Next move
One concrete action for the next revision pass.

Rules:
- No generic praise. "Great voice!" means nothing — quote the voice.
- Do not rewrite the essay for them. Point, diagnose, direct.
- If the draft is off-prompt, say so first and hard.
${params.schoolName ? `\nTarget school: ${params.schoolName}. Evaluate fit if relevant.` : ""}
${params.wordTarget ? `\nTarget length: ${params.wordTarget} words. The current draft is ${params.draft.trim().split(/\s+/).length} words.` : ""}`;

  const user = `Essay prompt:\n"${params.prompt}"\n\nStudent's draft:\n\n${params.draft}`;

  return [
    { role: "system", content: system },
    { role: "user", content: user },
  ];
}
