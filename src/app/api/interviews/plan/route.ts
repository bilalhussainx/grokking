import { NextRequest, NextResponse } from "next/server";
import { InterviewPreset, InterviewType } from "@/types/interview";
import { createServerSupabase } from "@/lib/supabase-auth";
import { deductCredits, hasUsedFreeInterview, CREDIT_COSTS } from "@/lib/credits";

const MOONSHOT_API_KEY = process.env.MOONSHOT_API_KEY || "";
const MOONSHOT_URL = "https://api.moonshot.ai/v1/chat/completions";
const MOONSHOT_MODEL = "kimi-k2-turbo-preview";

// Handle CORS preflight
export async function OPTIONS() {
  return new NextResponse(null, { status: 204 });
}

const PRESET_DESCRIPTIONS: Record<InterviewPreset, string> = {
  frontend:
    "Frontend engineering: HTML, CSS, JavaScript, React, browser APIs, performance, accessibility",
  backend:
    "Backend engineering: server architecture, databases, REST/GraphQL APIs, authentication, scalability",
  fullstack:
    "Full-stack engineering: both frontend and backend topics, system integration, deployment",
  "system-design":
    "System design: distributed systems, scalability, databases, caching, load balancing, microservices",
  dsa: "Data structures and algorithms: arrays, trees, graphs, dynamic programming, sorting, complexity analysis",
  "second-brain":
    `AI Second Brain Integration Developer. The interviewer should ask PRACTICAL, SPECIFIC questions that a real hiring manager would ask — not abstract architecture questions. Focus on hands-on implementation details the candidate would encounter on day one.

QUESTION CATEGORIES (mix from all of these):

1. SLACK INTEGRATION (practical):
- "Show me how you'd set up a Slack Bolt app that listens for messages in specific channels. What scopes do you need? How do you handle the 3-second acknowledgment timeout?"
- "A Slack webhook fires the same event 3 times during an outage. How do you deduplicate? Show me the Redis key schema."
- "How do you verify Slack webhook signatures? Walk me through the HMAC-SHA256 process."

2. MISSIVE API (practical):
- "How does the Missive REST API work for sending messages? What's the authentication flow?"
- "Design the bidirectional bridge: Missive conversation → Claude draft → human approval → send back via Missive. Where do you store the draft state?"
- "Missive has rate limits. How do you handle 429 responses in a queue-based system?"

3. OBSIDIAN VAULT AS AI MEMORY (practical):
- "How do you structure an Obsidian vault so Claude can retrieve relevant context? What YAML frontmatter fields do you use?"
- "A vault has 5,000 notes. How do you find the 5 most relevant ones for a customer query in under 300ms?"
- "How do you prevent the vault from growing forever? Describe your archival/summarization strategy."

4. MCP PROTOCOL (practical):
- "Walk me through setting up an MCP server that exposes Obsidian notes as resources. What transport do you choose and why?"
- "What's the difference between stdio and SSE transport? When would you use each?"
- "Show me the JSON-RPC 2.0 message format for a tools/call request and response."

5. CLAUDE CODE CONFIGURATION (practical):
- "How do you configure CLAUDE.md so Claude Code knows which MCP servers to use, what tools are available, and what permissions to request?"
- "What is the SKILL.md pattern? Give an example of a skill that routes a Slack message through Claude."
- "How does the Claude Code hooks system work? Give an example of a pre-commit hook."

6. PRODUCTION & DEVOPS (practical):
- "Show me your PM2 ecosystem.config.js for running 3 workers + 1 webhook server. How do you handle graceful shutdown?"
- "Your BullMQ queue backs up to 2,000 jobs. Redis is at 90% memory. What do you do?"
- "Design the health check endpoint. What does it check and what HTTP status codes does it return?"

7. OAUTH & AUTH PATTERNS (practical):
- "Walk me through Microsoft Graph OAuth 2.0 for reading Teams messages. What's the token refresh strategy for long-running processes?"
- "How do you securely store API tokens for 5 different services in a PM2-managed Node.js app?"

Questions should feel like a real senior developer interview — specific, practical, expecting code snippets and concrete configurations in answers. Not theoretical architecture diagrams.`,
  "recruiter-screen":
    `Recruiter phone screen (15 minutes). This is a first-round screening call, NOT a technical deep-dive. Focus on motivation, culture fit, logistics, and communication skills.

QUESTION CATEGORIES:
1. INTRODUCTION: "Tell me about yourself" — expecting a concise 2-minute pitch
2. MOTIVATION: "Why are you interested in this company/role?" — looking for research and genuine interest
3. CAREER GOALS: "What are you looking for in your next role?" — alignment with position
4. EXPERIENCE FIT: "Walk me through your most relevant experience" — brief, not technical
5. SALARY & LOGISTICS: "What are your salary expectations?", "When can you start?", "Are you open to [remote/hybrid/onsite]?"
6. AVAILABILITY: "Are you interviewing elsewhere?", "What's your timeline for making a decision?"
7. CULTURE: "What kind of team environment do you thrive in?", "How do you handle feedback?"

Keep questions conversational, warm, and screening-oriented. This is about fit, not technical depth.`,
  "product-manager":
    `Product Manager interview. Focus on product sense, analytical thinking, metrics-driven decision-making, and stakeholder communication.

QUESTION CATEGORIES:
1. PRODUCT SENSE: "How would you improve [popular product]?", "Design a product for [user segment]"
2. METRICS & ANALYTICS: "What metrics would you track for [feature]?", "DAU dropped 20% — walk me through your investigation"
3. PRIORITIZATION: "You have 5 feature requests and resources for 2 — how do you decide?", "Explain your prioritization framework (RICE, ICE, MoSCoW)"
4. STRATEGY: "How would you enter [new market]?", "Competitor just launched X — what do you do?"
5. STAKEHOLDER MANAGEMENT: "Engineering says the feature will take 3 months, business wants it in 1 — how do you handle this?"
6. USER RESEARCH: "How do you validate a product idea before building?", "Walk me through a user interview you conducted"
7. EXECUTION: "Describe a product you shipped from idea to launch", "How do you write a PRD?"

Questions should test structured thinking, user empathy, and data-driven reasoning.`,
  finance:
    `Finance and investment banking interview. Focus on valuation, financial modeling, market knowledge, and quantitative reasoning.

QUESTION CATEGORIES:
1. VALUATION: "Walk me through a DCF analysis", "When would you use comparable company analysis vs precedent transactions?", "How do you calculate WACC?"
2. ACCOUNTING: "Walk me through the three financial statements and how they connect", "A company buys a $100 asset — walk me through the impact on all three statements"
3. MARKET SIZING: "How big is the U.S. coffee market?", "Estimate the revenue of [company]"
4. M&A: "Walk me through an M&A deal process", "What makes an acquisition accretive vs dilutive?"
5. CURRENT MARKETS: "What's happening in the markets right now?", "Tell me about a recent deal that caught your attention"
6. BEHAVIORAL/FIT: "Why finance?", "Why investment banking specifically?", "Tell me about a time you worked under extreme time pressure"
7. BRAINTEASERS: "If you had $1M to invest today, where would you put it and why?"

Expect precise, structured answers with specific numbers and frameworks.`,
  leadership:
    `Tech Lead / Engineering Manager interview. Focus on leadership, people management, technical decision-making at scale, and organizational effectiveness.

QUESTION CATEGORIES:
1. TEAM MANAGEMENT: "How do you handle an underperforming engineer?", "Describe how you run 1:1s", "How do you give difficult feedback?"
2. CONFLICT RESOLUTION: "Two senior engineers disagree on architecture — how do you resolve it?", "A product manager keeps changing requirements — what do you do?"
3. TECHNICAL DECISION-MAKING: "How do you decide between building vs buying?", "Walk me through a technical decision you made that had significant trade-offs"
4. HIRING & GROWTH: "How do you interview and evaluate engineering candidates?", "How do you create growth paths for your team?"
5. PROJECT MANAGEMENT: "How do you handle a project that's falling behind schedule?", "Describe how you manage technical debt"
6. CROSS-FUNCTIONAL: "How do you work with product and design?", "How do you communicate technical constraints to non-technical stakeholders?"
7. CULTURE: "How do you build psychological safety on your team?", "How do you foster innovation while maintaining reliability?"

Questions should probe real leadership experience, not hypotheticals. Look for specific examples and self-awareness.`,
};

const SYSTEM_PROMPT = `You are an expert technical interviewer. When given a job description, interview preset, and interview type, generate a structured interview question plan.

Return ONLY valid JSON (no markdown fences, no extra text) with this exact shape:
{
  "questions": [
    {
      "id": 1,
      "text": "The question text",
      "type": "technical" | "behavioral",
      "followUps": ["Follow-up question 1", "Follow-up question 2"],
      "evaluationCriteria": "What a good answer looks like"
    }
  ],
  "interviewerPersona": "A short description of the interviewer's style and focus",
  "timeAllocation": {
    "intro": 5,
    "questions": 40,
    "wrapUp": 5
  }
}

Guidelines:
- Generate 5-7 questions total
- For "technical" interview type: all questions should be type "technical"
- For "behavioral" interview type: all questions should be type "behavioral"
- For "mixed" interview type: mix roughly 60% technical and 40% behavioral
- For "recruiter" interview type: all questions should be type "behavioral" — focus on motivation, culture fit, salary, availability, and logistics (no coding or technical deep-dives)
- Each question should have 2-3 follow-up questions
- The interviewerPersona should be a brief description (1-2 sentences)
- timeAllocation values are in minutes and should sum to approximately 50`;

export async function POST(req: NextRequest) {
  const supabase = await createServerSupabase();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const usedFree = await hasUsedFreeInterview(user.id);
  if (usedFree) {
    const ok = await deductCredits(user.id, CREDIT_COSTS.interview, "interview");
    if (!ok) return NextResponse.json({ error: "Insufficient credits" }, { status: 402 });
  }

  try {
    const body = await req.json();
    const {
      jobDescription,
      preset,
      interviewType,
      language = "en",
      companyPersonaId,
    }: {
      jobDescription: string;
      preset: InterviewPreset;
      interviewType: InterviewType;
      language?: string;
      companyPersonaId?: string;
    } = body;

    if (!preset || !interviewType) {
      return NextResponse.json(
        { error: "preset and interviewType are required" },
        { status: 400 }
      );
    }

    // Fetch the user's last 50 questions for this (preset, interview_type) bucket
    // so the planner can avoid repeats. Skip silently for guests or on errors —
    // history is best-effort, the plan must always be returned.
    let exclusionList: string[] = [];
    if (user) {
      try {
        const { data: history } = await supabase
          .from("interview_question_history")
          .select("question_text")
          .eq("user_id", user.id)
          .eq("preset", preset)
          .eq("interview_type", interviewType)
          .order("asked_at", { ascending: false })
          .limit(50);
        if (history && history.length > 0) {
          exclusionList = history.map((r: { question_text: string }) => r.question_text);
        }
      } catch (e) {
        console.warn("[Interview Plan] Failed to fetch history (continuing):", e);
      }
    }

    const presetDescription = PRESET_DESCRIPTIONS[preset] || preset;

    // Resolve company persona context (lazy import keeps the bundle slim)
    let companyContext = "";
    if (companyPersonaId && companyPersonaId !== "generic") {
      try {
        const { getCompanyPersona } = await import("@/data/interview-personas");
        const persona = getCompanyPersona(companyPersonaId);
        companyContext = `\n\nThe interview must reflect the style of ${persona.company} ${persona.level}. Signature topics they care about: ${persona.signatureTopics.join("; ")}. Generate questions that match this company's known style and difficulty (hardness ${persona.hardness}/10).`;
      } catch {
        // ignore if persona module fails
      }
    }

    const exclusionBlock = exclusionList.length > 0
      ? `\n\nThe candidate has already been asked the following questions in previous sessions. Do NOT repeat any of these. Generate fresh questions covering different angles or topics:\n${exclusionList.map((q, i) => `${i + 1}. ${q}`).join("\n")}\n\nIMPORTANT: Vary topics and question phrasing — the candidate should not feel they have seen this before.`
      : "";

    const userPrompt = `Generate an interview question plan for the following:

Interview Preset: ${preset}
Preset Focus: ${presetDescription}
Interview Type: ${interviewType}
Interview Language: ${language}
${jobDescription ? `Job Description:\n${jobDescription}` : "No specific job description provided — use a generic senior software engineer role."}${companyContext}${exclusionBlock}

Return the JSON question plan now. The question text in the plan must be in English (it is a structural document — the interviewer will render it in ${language} at speak time).`;

    if (!MOONSHOT_API_KEY) {
      return NextResponse.json(
        { error: "MOONSHOT_API_KEY not configured" },
        { status: 500 }
      );
    }

    const kimiRes = await fetch(MOONSHOT_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${MOONSHOT_API_KEY}`,
      },
      body: JSON.stringify({
        model: MOONSHOT_MODEL,
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          { role: "user", content: userPrompt },
        ],
        stream: false,
        // Higher temperature for question variation; the exclusion list keeps it grounded
        temperature: 0.85,
        max_tokens: 4000,
        // Pass a unique seed each call so even identical inputs produce varied output
        seed: Date.now() + Math.floor(Math.random() * 1_000_000),
      }),
    });

    if (!kimiRes.ok) {
      const errText = await kimiRes.text();
      console.error("[Interview Plan] Kimi error:", kimiRes.status, errText);
      return NextResponse.json(
        { error: `Kimi API error: ${kimiRes.status}` },
        { status: 502 }
      );
    }

    const kimiData = await kimiRes.json();
    const finishReason = kimiData.choices?.[0]?.finish_reason;
    console.log("[Interview Plan] Kimi finish_reason:", finishReason, "usage:", JSON.stringify(kimiData.usage));
    let rawContent: string =
      kimiData.choices?.[0]?.message?.content || "";

    if (!rawContent) {
      console.error("[Interview Plan] Empty response from Kimi. Full response:", JSON.stringify(kimiData).slice(0, 500));
      return NextResponse.json(
        { error: "Empty response from AI. Try again." },
        { status: 500 }
      );
    }

    // Strip markdown fences if present (handles multiple fences, whitespace, etc.)
    rawContent = rawContent.trim();
    // Remove leading ```json or ``` (with optional whitespace/newlines)
    rawContent = rawContent.replace(/^```(?:json)?\s*\n?/i, "");
    // Remove trailing ```
    rawContent = rawContent.replace(/\n?\s*```\s*$/, "");
    rawContent = rawContent.trim();
    // If still not starting with {, try to extract JSON object
    if (!rawContent.startsWith("{")) {
      const jsonMatch = rawContent.match(/\{[\s\S]*\}/);
      if (jsonMatch) rawContent = jsonMatch[0];
    }

    let plan;
    try {
      plan = JSON.parse(rawContent);
    } catch {
      // Kimi sometimes drops a quote on keys (e.g. `id":` instead of `"id":`)
      // Fix unquoted keys: match a newline/comma/brace followed by an unquoted key
      const repaired = rawContent.replace(/([{,]\s*)([a-zA-Z_]\w*)\s*:/g, '$1"$2":');
      try {
        plan = JSON.parse(repaired);
        console.log("[Interview Plan] Parsed after repairing unquoted keys");
      } catch (parseErr2) {
        console.error("[Interview Plan] Failed to parse even after repair. Length:", rawContent.length, "Parse error:", parseErr2);
        // Last resort: retry once
        return NextResponse.json(
          { error: "AI returned malformed JSON. Please try again." },
          { status: 502 }
        );
      }
    }

    return NextResponse.json(plan);
  } catch (error: unknown) {
    console.error("[Interview Plan] Error:", error);
    const message =
      error instanceof Error ? error.message : "Failed to generate interview plan";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
