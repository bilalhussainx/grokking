// src/lib/cc/agent/read-tools.ts
import type { SupabaseClient } from "@supabase/supabase-js";
import { isUuid } from "../ownership";
import type { AuthScope, Json, ReadTools, ToolReply } from "./contracts";

const DOMAINS = ["profile", "academic", "financial"] as const;
type Domain = (typeof DOMAINS)[number];
export const READ_TOOL_DEFINITIONS = [
  { type: "function", function: { name: "read_context", description: "Read recorded context; missing is unknown.", parameters: {
    type: "object", properties: { domains: { type: "array", items: { type: "string", enum: DOMAINS }, maxItems: 3, uniqueItems: true } }, additionalProperties: false
  } } },
  { type: "function", function: { name: "read_essay", description: "Read an owned essay and optional historical draft.", parameters: {
    type: "object", properties: { essayId: { type: "string", format: "uuid" }, versionNumber: { type: "integer", minimum: 1 } }, required: ["essayId"], additionalProperties: false
  } } },
  { type: "function", function: { name: "read_published_feedback", description: "Read only shipped comments on an owned essay.", parameters: {
    type: "object", properties: { essayId: { type: "string", format: "uuid" } }, required: ["essayId"], additionalProperties: false
  } } }
] as const;

type Args = { domains?: Domain[]; essayId?: string; versionNumber?: number };
export function validateToolArgs(name: string, value: unknown): Args {
  if (!value || typeof value !== "object" || Array.isArray(value)) throw new Error("invalid_tool_arguments");
  const a = value as Record<string, unknown>;
  const allowed = name === "read_context" ? ["domains"] : name === "read_essay" ? ["essayId", "versionNumber"] : name === "read_published_feedback" ? ["essayId"] : null;
  if (!allowed || Object.keys(a).some(k => !allowed.includes(k))) throw new Error("invalid_tool_arguments");
  if (name === "read_context") {
    if (a.domains !== undefined && (!Array.isArray(a.domains) || a.domains.length > 3 || new Set(a.domains).size !== a.domains.length || a.domains.some(d => !(DOMAINS as readonly unknown[]).includes(d)))) throw new Error("invalid_tool_arguments");
  } else if (!isUuid(a.essayId) || (name === "read_essay" && a.versionNumber !== undefined && (!Number.isInteger(a.versionNumber) || Number(a.versionNumber) < 1))) throw new Error("invalid_tool_arguments");
  return a as Args;
}

const CONTEXT = {
  profile: { table: "cc_student_profiles", owner: "id", columns: "id,user_id,grade_level,graduation_year,state_province,country,home_language,is_first_gen,is_international,citizenship_status,updated_at" },
  academic: { table: "cc_academic_profiles", owner: "student_id", columns: "id,student_id,gpa_unweighted,gpa_weighted,gpa_scale,test_strategy,sat_total,act_composite,updated_at" },
  financial: { table: "cc_financial_profiles", owner: "student_id", columns: "id,student_id,household_income_bracket,household_size,dependents_in_college,pell_eligible_estimate,sai_estimate,updated_at" }
} as const;
type Row = Record<string, Json>;
function sorted(rows: unknown): Row[] {
  return [...((rows as Row[] | null) ?? [])].sort((a,b) => String(a.id).localeCompare(String(b.id), "en"));
}
const failed = (): ToolReply => ({ status: "retryable_error", data: null, evidence: [] });
const denied = (): ToolReply => ({ status: "denied", data: null, evidence: [] });
// supabase-js builders accept .abortSignal(); a client without it is still checked before and after each query.
function bind<Q>(query: Q, signal?: AbortSignal): Q {
  signal?.throwIfAborted();
  const q = query as Q & { abortSignal?: (s: AbortSignal) => Q };
  return signal && typeof q.abortSignal === "function" ? q.abortSignal(signal) : query;
}
async function settled<T>(query: PromiseLike<T>, signal?: AbortSignal): Promise<T> {
  const result = await query;
  signal?.throwIfAborted();
  return result;
}

export function makeReadTools(db: SupabaseClient, scope: AuthScope): ReadTools {
  const ids = [...scope.profileIds];
  return async (name, raw, signal): Promise<ToolReply> => {
    signal?.throwIfAborted();
    let args: Args;
    try { args = validateToolArgs(name, raw); } catch { return denied(); }
    try {
      if (name === "read_context") {
        const domains = args.domains ?? [...DOMAINS];
        const data: Record<string, Json> = {};
        const evidence: Json[] = [];
        for (const domain of [...domains].sort()) {
          const spec = CONTEXT[domain];
          const columns: string = spec.columns;
          const { data: rows, error } = await settled(bind(db.from(spec.table).select(columns).in(spec.owner, ids).order("id"), signal), signal);
          if (error) return failed();
          const records = sorted(rows);
          // Never collapse duplicate profiles to one row or infer an authoritative value.
          data[domain] = { records, state: records.length ? "recorded" : "missing", reconciliationRequired: records.length > 1 };
          evidence.push({ kind: "domain_snapshot", domain, records });
        }
        return { status: "ok", data, evidence };
      }
      const { data: essay, error } = await settled(bind(db.from("cc_essays")
        .select("id,student_id,school_id,essay_type,prompt_text,word_limit,phase,brainstorm_transcript,outline_json,current_draft,word_count,updated_at")
        .eq("id", args.essayId!).in("student_id", ids), signal).maybeSingle(), signal);
      if (error) return failed();
      if (!essay) return denied();
      if (name === "read_published_feedback") {
        const result = await settled(bind(db.from("cc_counselor_comments")
          .select("id,author_user_id,body,range_start,range_end,range_text_snapshot,status,created_at,resolved_at")
          .eq("artifact_type", "essay").eq("artifact_id", args.essayId!).eq("student_user_id", scope.userId).eq("status", "shipped").order("id"), signal), signal);
        if (result.error) return failed();
        const comments = sorted(result.data);
        return { status: "ok", data: { comments }, evidence: [{ kind: "published_feedback_snapshot", essayId: args.essayId!, comments }] };
      }
      let draft: Json = null;
      if (args.versionNumber !== undefined) {
        const result = await settled(bind(db.from("cc_essay_drafts").select("id,essay_id,version_number,label,content,word_count,notes,created_at")
          .eq("essay_id", args.essayId!).eq("version_number", args.versionNumber), signal).maybeSingle(), signal);
        if (result.error) return failed();
        if (!result.data) return { status: "unknown", data: { reason: "draft_version_missing" }, evidence: [] };
        draft = result.data as Json;
      }
      // No indiscriminate interaction retrieval: old raw model output and unrelated story material are not needed here.
      const snapshot: Json = { essay: essay as Json, draft };
      return { status: "ok", data: snapshot, evidence: [{ kind: "essay_snapshot", ...(snapshot as Record<string, Json>) }] };
    } catch {
      signal?.throwIfAborted(); // An aborted call rejects; it never reports a result after its bound.
      return failed();
    }
  };
}
