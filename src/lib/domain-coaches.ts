// src/lib/domain-coaches.ts
// Per-domain coach configurations: teaching methodology, system prompt extension,
// and fact-extractors that mine LLM responses for knowledge-graph writes.
//
// Each domain coach plugs into /api/ai/coach via getDomainCoach(courseSlug | courseTitle).

import { upsertFact } from "@/lib/knowledge-graph";

export type DomainCoachId =
  | "cs"
  | "islamic_studies"
  | "christianity"
  | "buddhism"
  | "finance"
  | "philosophy"
  | "geopolitics"
  | "personal_growth"
  | "general";

export interface DomainCoachConfig {
  id: DomainCoachId;
  label: string;
  /** Substrings matched against the course slug or title to auto-route. */
  matches: string[];
  teachingMethodology: string;
  /** Appended to the COACH_DIRECTIVE before the LLM call. */
  systemPromptExtension: string;
  /** Patterns mined from user/assistant turns. Each match writes a knowledge fact. */
  factExtractors: FactExtractor[];
  /** Optional knowledge_cache (domain, entity) hints for context injection. */
  knowledgeCacheHints?: { domain: string; entity?: string };
}

export interface FactExtractor {
  predicate: string;
  /** Regex over the user message to capture an `object` for the fact. */
  pattern: RegExp;
  /** Confidence assigned to the extracted fact. */
  confidence: number;
}

// ─── Registry ────────────────────────────────────────────────────────────────

export const DOMAIN_COACHES: DomainCoachConfig[] = [
  {
    id: "cs",
    label: "CS Coach",
    matches: [
      "coding-interview",
      "system-design",
      "data-structures",
      "algorithms",
      "python",
      "javascript",
      "react",
      "node",
      "c++",
      "c#",
      "mern",
      "dsa",
      "web-development",
      "game-development",
    ],
    teachingMethodology:
      "Socratic for coding exercises with progressive hints. Switches to direct instruction after 3 sessions on the same topic without improvement. Always reads the student's actual code.",
    systemPromptExtension: `## DOMAIN: COMPUTER SCIENCE
You are coaching a CS student. Lean Socratic when they're solving exercises:
- Ask one targeted question per turn rather than dumping solutions
- Read their actual code and reference specific lines
- Hints in layers: direction → structure → walk-through
- After 3 hints with no progress, give a direct mini-lesson
- Connect every concept to interview-relevant patterns (the student's interview prep history is in the knowledge graph)
- Use precise complexity language: "O(n log n) because...", never just "fast"`,
    factExtractors: [
      {
        predicate: "weak_at",
        // "I don't get recursion", "confused about graphs", "struggling with DP"
        pattern: /(?:i (?:don'?t|do not) (?:get|understand)|confused (?:about|by)|struggling with|stuck on|hate)\s+([a-z][a-z\s\-]{2,40}?)(?:[.,!?]|$)/i,
        confidence: 0.7,
      },
      {
        predicate: "strong_at",
        // "I understand recursion", "got the hang of binary search", "comfortable with hashmaps"
        pattern: /(?:i (?:understand|got|get)|got the hang of|comfortable with|nailed)\s+([a-z][a-z\s\-]{2,40}?)(?:[.,!?]|$)/i,
        confidence: 0.6,
      },
    ],
    knowledgeCacheHints: { domain: "interview_patterns" },
  },
  {
    id: "islamic_studies",
    label: "Islamic Studies Coach",
    matches: ["islam", "quran", "hadith", "fiqh", "sufi", "ahmadiyya"],
    teachingMethodology:
      "Explanatory with primary-source citations. Cites Quran (Surah:Ayah) and Hadith from knowledge cache. Presents multiple madhahib without bias.",
    systemPromptExtension: `## DOMAIN: ISLAMIC STUDIES
You are coaching a student of Islamic studies. Lean explanatory:
- Cite Quran (Surah:Ayah) and authentic Hadith with collection + book + number when possible
- Present from within the tradition first, then offer academic perspective
- When scholars differ, name the madhhab and the disagreement: "Hanafis hold X, Shafi'is hold Y because..."
- Use Arabic terms with English transliteration: taqwa (God-consciousness)
- Never push one school as "correct" — surface differences neutrally
- If you're unsure of a citation, say so rather than fabricating one`,
    factExtractors: [
      {
        predicate: "interested_in",
        pattern: /(?:i (?:want to|wanna) (?:learn|understand|study)|tell me (?:more )?about)\s+([a-z][a-z\s\-]{2,50}?)(?:[.,!?]|$)/i,
        confidence: 0.5,
      },
      {
        predicate: "follows_madhhab",
        pattern: /\b(?:i (?:am|'m)|i follow|i'm from)\s+(hanafi|shafi'i|maliki|hanbali|ja'fari|sufi|ahmadiyya)/i,
        confidence: 0.8,
      },
    ],
    knowledgeCacheHints: { domain: "domain_knowledge", entity: "islam" },
  },
  {
    id: "christianity",
    label: "Christianity Coach",
    matches: ["christianity", "bible", "theology", "catholic", "protestant", "orthodox"],
    teachingMethodology:
      "Explanatory and ecumenical. Cites scripture (Book Chapter:Verse). Presents Catholic, Protestant, and Orthodox views fairly.",
    systemPromptExtension: `## DOMAIN: CHRISTIAN THEOLOGY
You are coaching a student of Christian theology. Lean explanatory and ecumenical:
- Cite scripture as Book Chapter:Verse (e.g., Romans 8:28)
- When traditions differ, say which: "Catholics hold X, Lutherans hold Y because..."
- Connect ancient texts to modern life
- Never preach — always teach
- Distinguish historical-critical readings from confessional readings`,
    factExtractors: [
      {
        predicate: "denomination",
        pattern: /\b(?:i (?:am|'m)|i'm a)\s+(catholic|protestant|orthodox|lutheran|baptist|methodist|presbyterian|anglican|evangelical|pentecostal)/i,
        confidence: 0.85,
      },
    ],
    knowledgeCacheHints: { domain: "domain_knowledge", entity: "christianity" },
  },
  {
    id: "buddhism",
    label: "Buddhism Coach",
    matches: ["buddhism", "dharma", "zen", "mahayana", "theravada"],
    teachingMethodology:
      "Calm and precise. Uses Pali/Sanskrit terms with translations. References Pali Canon and Mahayana sutras.",
    systemPromptExtension: `## DOMAIN: BUDDHIST STUDIES
- Use Pali/Sanskrit terms with translations: dukkha (suffering), anatta (non-self)
- Cite specific texts: Dhammapada, Heart Sutra, Lotus Sutra
- Present Theravada and Mahayana perspectives where they differ
- Tie philosophical claims to practice: "this is why meditators are taught to..."`,
    factExtractors: [
      {
        predicate: "tradition",
        pattern: /\b(?:i (?:practice|follow))\s+(theravada|mahayana|zen|tibetan|vajrayana|pure land)/i,
        confidence: 0.85,
      },
    ],
    knowledgeCacheHints: { domain: "domain_knowledge", entity: "buddhism" },
  },
  {
    id: "finance",
    label: "Finance Coach",
    matches: ["finance", "personal-finance", "investing", "economics", "trading"],
    teachingMethodology:
      "Case-study driven. Uses real market data and historical examples. Always pairs theory with current events.",
    systemPromptExtension: `## DOMAIN: FINANCE
- Lead with concrete numbers and historical context (S&P 500 returns, real company financials)
- Explain risk before reward — never promise outcomes
- Always tag opinions: "the textbook view is X, but in practice..."
- ALWAYS include the disclaimer when making recommendations: "This is educational, not financial advice."
- When the student names a goal (retirement, house, college), tie examples to that goal`,
    factExtractors: [
      {
        predicate: "financial_goal",
        pattern: /(?:my goal is|i want to|i'm saving for|i plan to)\s+([a-z][a-z0-9\s\-,]{3,80}?)(?:[.,!?]|$)/i,
        confidence: 0.6,
      },
      {
        predicate: "risk_tolerance",
        pattern: /\b(conservative|moderate|aggressive|risk-averse|risk-tolerant)\b/i,
        confidence: 0.55,
      },
    ],
    knowledgeCacheHints: { domain: "job_market", entity: "finance" },
  },
  {
    id: "philosophy",
    label: "Philosophy Coach",
    matches: ["philosophy", "ethics", "logic", "stoic", "vedanta"],
    teachingMethodology:
      "Dialectical. Steelmans the strongest opposition to any position the student leans on. Tracks philosophical inclinations to push back more effectively.",
    systemPromptExtension: `## DOMAIN: PHILOSOPHY
- Always steelman opposing views before critiquing them
- When the student commits to a position, push back with the strongest objection from another tradition
- Trace ideas to their source (Plato Republic 514a, not "Plato said")
- Tie ancient debates to modern dilemmas (trolley problem → autonomous vehicles)
- Never let "I just feel that way" stand — ask for the underlying principle`,
    factExtractors: [
      {
        predicate: "inclined_toward",
        pattern: /(?:i (?:agree with|lean toward|find compelling))\s+([a-z][a-z\s\-]{2,40}?)(?:[.,!?]|$)/i,
        confidence: 0.55,
      },
    ],
    knowledgeCacheHints: { domain: "domain_knowledge", entity: "philosophy" },
  },
  {
    id: "geopolitics",
    label: "Geopolitics Coach",
    matches: ["geopolitics", "international-relations", "political-strategy", "public-policy"],
    teachingMethodology:
      "Briefing style — concise, structured, neutral. Presents realist, liberal, and constructivist frameworks.",
    systemPromptExtension: `## DOMAIN: GEOPOLITICS / INTERNATIONAL RELATIONS
- Brief in structured form: situation → key actors → frameworks → assessment
- Tag confidence: "high confidence", "moderate confidence", "low confidence"
- Present realist, liberal, and constructivist readings of contested events
- Separate descriptive analysis from normative judgment
- Cite real treaties, institutions, and primary documents`,
    factExtractors: [],
    knowledgeCacheHints: { domain: "domain_knowledge", entity: "geopolitics" },
  },
  {
    id: "personal_growth",
    label: "Personal Growth Coach",
    matches: ["personal-growth", "leadership", "mindfulness", "psychology"],
    teachingMethodology:
      "Empowering, evidence-based, reflective. Cites psychology research; uses reflective questions to build self-awareness.",
    systemPromptExtension: `## DOMAIN: PERSONAL GROWTH
- Cite psychology research by name (Dweck on mindset, Seligman on PERMA, Goleman on EQ)
- Use reflective questions sparingly — one per turn maximum
- Translate research into one concrete action the student can take this week
- Validate effort over outcome`,
    factExtractors: [
      {
        predicate: "growth_goal",
        pattern: /(?:i want to (?:get better at|improve|build))\s+([a-z][a-z\s\-]{2,50}?)(?:[.,!?]|$)/i,
        confidence: 0.55,
      },
    ],
  },
  {
    id: "general",
    label: "General Coach",
    matches: [],
    teachingMethodology:
      "Adaptive — blends explanatory and Socratic based on the lesson type. Default fallback when no domain matches.",
    systemPromptExtension: "",
    factExtractors: [],
  },
];

// ─── Lookup ──────────────────────────────────────────────────────────────────

/**
 * Pick a domain coach config by course slug or title. Falls back to "general".
 */
export function getDomainCoach(courseSlugOrTitle?: string): DomainCoachConfig {
  if (!courseSlugOrTitle) return DOMAIN_COACHES[DOMAIN_COACHES.length - 1];
  const haystack = courseSlugOrTitle.toLowerCase();
  for (const coach of DOMAIN_COACHES) {
    if (coach.matches.some((m) => haystack.includes(m))) return coach;
  }
  return DOMAIN_COACHES[DOMAIN_COACHES.length - 1];
}

/**
 * Run all fact extractors for a domain against a single user message.
 * Writes matches to the knowledge graph as facts sourced from this coach.
 */
export async function extractDomainFacts(
  userId: string,
  coach: DomainCoachConfig,
  userMessage: string
): Promise<number> {
  if (!userMessage || coach.factExtractors.length === 0) return 0;

  let written = 0;
  for (const ex of coach.factExtractors) {
    const m = userMessage.match(ex.pattern);
    if (!m) continue;
    const object = (m[1] || "").trim().toLowerCase();
    if (!object || object.length < 2 || object.length > 80) continue;

    try {
      await upsertFact(userId, {
        subject: "user",
        predicate: ex.predicate,
        object,
        confidence: ex.confidence,
        sourceAgent: `coach:${coach.id}`,
        evidence: userMessage.slice(0, 200),
      });
      written++;
    } catch (err) {
      console.warn(`[domain-coaches] upsertFact failed for ${coach.id}/${ex.predicate}:`, err);
    }
  }
  return written;
}
