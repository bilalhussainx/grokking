// src/lib/cc/agent/journey-tools.ts
import type { SupabaseClient } from "@supabase/supabase-js";
import { checkREAConflict } from "@/lib/applications/ed-strategy";
import { selectVariant } from "@/app/cc/dashboard/variants";
import type { AuthScope, Json, ToolReply } from "./contracts";
// ed-strategy accepts catalog spellings ("Harvard University") since commit 819be76.

export type JourneyToolName = "get_journey_state" | "list_my_schools" | "check_plan_conflicts" | "get_essay_status";
export type NextAction = {
  id: string;
  reasonCode: "resolve_plan_conflict" | "revise_after_review" | "complete_task" | "stage_default";
  title: string;
  entityId: string | null;
  dueDate: string | null;
  dueDateSource: "student_task" | "counselor_task" | null;
};

const empty = { type: "object", properties: {}, additionalProperties: false } as const;
export const JOURNEY_TOOL_DEFINITIONS = [
  { type: "function", function: { name: "get_journey_state", description: "The student's stage and up to three next actions, in a fixed order. Dates only from the student's own tasks.", parameters: empty } },
  { type: "function", function: { name: "list_my_schools", description: "The student's school list with plans and statuses. Catalog deadlines are unverified last-cycle values.", parameters: empty } },
  { type: "function", function: { name: "check_plan_conflicts", description: "Checks REA/ED/EA combinations on the student's list.", parameters: empty } },
  { type: "function", function: { name: "get_essay_status", description: "Essay phases, word counts, review state and days since last edit. No draft text.", parameters: empty } },
] as const;

const STAGE_DEFAULT: Record<string, string> = {
  g9: "Pick one interest to explore this month",
  g10: "Keep going with one activity you chose",
  junior: "Build your school list to at least 5 schools",
  senior_writing: "Work on your most important essay",
  senior_post_submit: "Check each application portal for missing items",
  senior_decisions: "Compare your offers side by side",
  transfer: "Confirm your target schools' transfer requirements",
  unknown: "Tell Kairos your grade so it can plan with you",
};

type Row = Record<string, unknown>;
const failed = (): ToolReply => ({ status: "retryable_error", data: null, evidence: [] });
const unknown = (reason: string): ToolReply => ({ status: "unknown", data: { reason }, evidence: [] });

export function makeJourneyTools(db: SupabaseClient, scope: AuthScope, now: Date) {
  const ids = [...scope.profileIds];

  async function rows(table: string, cols: string, col = "student_id"): Promise<Row[] | null> {
    const { data, error } = await db.from(table).select(cols).in(col, ids);
    return error ? null : ((data ?? []) as unknown as Row[]);
  }

  async function schools() {
    const list = await rows("cc_student_schools", "id,student_id,school_id,application_plan,application_status,tier");
    if (!list) return null;
    const schoolIds = [...new Set(list.map((r) => String(r.school_id)))];
    const { data, error } = schoolIds.length
      ? await db.from("cc_schools").select("id,name,country,regular_deadline").in("id", schoolIds)
      : { data: [], error: null };
    if (error) return null;
    const byId = new Map(((data ?? []) as Row[]).map((s) => [String(s.id), s]));
    return list
      .map((r) => ({ row: r, school: byId.get(String(r.school_id)) }))
      .filter((x) => x.school)
      .sort((a, b) => String(a.school!.name).localeCompare(String(b.school!.name), "en"));
  }

  return async (name: JourneyToolName, _args: Record<string, never>, signal?: AbortSignal): Promise<ToolReply> => {
    signal?.throwIfAborted();
    if (ids.length === 0) return unknown("no_student_profile");

    if (name === "list_my_schools" || name === "check_plan_conflicts") {
      const list = await schools();
      if (!list) return failed();
      if (name === "check_plan_conflicts") {
        const result = checkREAConflict(list.map((x) => ({ schoolName: String(x.school!.name), plan: (x.row.application_plan as string) ?? null })));
        return { status: "ok", data: result as unknown as Json, evidence: [{ kind: "plan_conflict_rule", value: "REA restricts private EA/ED", sourceId: "ed-strategy" }] };
      }
      const out = list.map((x) => ({
        listEntryId: String(x.row.id),
        name: String(x.school!.name),
        country: (x.school!.country as string) ?? null,
        plan: (x.row.application_plan as string) ?? null,
        status: (x.row.application_status as string) ?? null,
        tier: (x.row.tier as string) ?? null,
        deadline: { value: (x.school!.regular_deadline as string) ?? null, status: "unverified_last_cycle" },
      }));
      return { status: "ok", data: { schools: out } as unknown as Json, evidence: out.map((s) => ({ kind: "school_on_list", value: s.name, sourceId: s.listEntryId })) };
    }

    if (name === "get_essay_status") {
      const essays = await rows("cc_essays", "id,essay_type,phase,word_count,word_limit,counselor_review_state,updated_at");
      if (!essays) return failed();
      const out = essays.map((e) => ({
        id: String(e.id),
        type: (e.essay_type as string) ?? null,
        phase: (e.phase as string) ?? null,
        words: (e.word_count as number) ?? null,
        wordLimit: (e.word_limit as number) ?? null,
        reviewState: (e.counselor_review_state as string) ?? null,
        daysSinceUpdate: e.updated_at ? Math.floor((now.getTime() - new Date(String(e.updated_at)).getTime()) / 86400000) : null,
      })).sort((a, b) => a.id.localeCompare(b.id, "en"));
      return { status: "ok", data: { essays: out } as unknown as Json, evidence: [] };
    }

    // get_journey_state
    const profiles = await rows("cc_student_profiles", "id,grade_level,is_transfer_student", "id");
    const list = await schools();
    const essays = await rows("cc_essays", "id,essay_type,counselor_review_state,updated_at");
    const tasks = await rows("cc_tasks", "id,title,due_date,status,task_type");
    if (!profiles || !list || !essays || !tasks) return failed();
    const grades = new Set(profiles.map((p) => p.grade_level ?? null));
    const transfer = profiles.some((p) => p.is_transfer_student === true);
    const grade = grades.size === 1 ? ([...grades][0] as number | null) : null; // conflicting duplicates -> unknown
    const variant = selectVariant({ is_transfer_student: transfer, grade_level: grade }, list.map((x) => ({ application_status: (x.row.application_status as string) ?? null })));

    const actions: NextAction[] = [];
    const conflict = checkREAConflict(list.map((x) => ({ schoolName: String(x.school!.name), plan: (x.row.application_plan as string) ?? null })));
    if (conflict.conflict) actions.push({ id: `conflict:${conflict.reaSchool}`, reasonCode: "resolve_plan_conflict", title: `Fix your early plan: ${conflict.conflictingSchools.join(", ")} conflicts with ${conflict.reaSchool} REA`, entityId: null, dueDate: null, dueDateSource: null });
    for (const e of essays.filter((x) => x.counselor_review_state === "changes_requested").sort((a, b) => String(a.id).localeCompare(String(b.id), "en"))) {
      actions.push({ id: `revise:${e.id}`, reasonCode: "revise_after_review", title: "Revise the essay your counselor reviewed", entityId: String(e.id), dueDate: null, dueDateSource: null });
    }
    const open = tasks.filter((t) => t.status !== "done" && t.status !== "completed")
      .sort((a, b) => (a.due_date ? String(a.due_date) : "9999").localeCompare(b.due_date ? String(b.due_date) : "9999") || String(a.id).localeCompare(String(b.id)));
    for (const t of open) {
      actions.push({ id: `task:${t.id}`, reasonCode: "complete_task", title: String(t.title), entityId: String(t.id), dueDate: (t.due_date as string) ?? null, dueDateSource: t.task_type === "counselor" ? "counselor_task" : "student_task" });
    }
    if (actions.length < 3) actions.push({ id: `stage:${variant}`, reasonCode: "stage_default", title: STAGE_DEFAULT[variant] ?? STAGE_DEFAULT.unknown, entityId: null, dueDate: null, dueDateSource: null });

    const nextActions = actions.slice(0, 3);
    const evidence: Json[] = nextActions.filter((a) => a.dueDate).map((a) => ({ kind: "task_due_date", value: a.dueDate!, sourceId: a.entityId! }));
    return { status: "ok", data: { variant, nextActions } as unknown as Json, evidence };
  };
}
