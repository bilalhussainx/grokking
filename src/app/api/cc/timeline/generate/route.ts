import { NextResponse } from "next/server";
import { requireAuth, unauthorized } from "../../helpers";
import { resolveCatalogDeadline } from "@/lib/cc/catalog-deadline";

function subtractDays(dateStr: string, days: number): string {
  const d = new Date(dateStr);
  d.setDate(d.getDate() - days);
  return d.toISOString().split("T")[0];
}

export async function POST() {
  const auth = await requireAuth();
  if (!auth) return unauthorized();
  const { supabase, user } = auth;

  const { data: profile } = await supabase
    .from("cc_student_profiles")
    .select("id")
    .eq("user_id", user.id)
    .single();

  if (!profile) {
    return NextResponse.json({ error: "Profile not found" }, { status: 404 });
  }

  const { data: schoolEntries } = await supabase
    .from("cc_student_schools")
    .select("school_id, cc_schools(id, name, regular_deadline, early_deadline)")
    .eq("student_id", profile.id);

  if (!schoolEntries || schoolEntries.length === 0) {
    return NextResponse.json({ created: 0, message: "Add schools to your list first" });
  }

  const { data: existingTasks } = await supabase
    .from("cc_tasks")
    .select("school_id, task_type")
    .eq("student_id", profile.id);

  const existingSet = new Set(
    (existingTasks || []).map((t) => `${t.school_id}:${t.task_type}`)
  );

  const tasksToInsert: Array<Record<string, unknown>> = [];
  const todayIso = new Date().toISOString().slice(0, 10);

  for (const entry of schoolEntries) {
    const school = entry.cc_schools as unknown as { id: string; name: string; regular_deadline: string; early_deadline: string | null } | null;
    if (!school) continue;

    const regularDate = resolveCatalogDeadline(school.regular_deadline, todayIso);
    const earlyDate = resolveCatalogDeadline(school.early_deadline, todayIso);

    if (regularDate && !existingSet.has(`${school.id}:application`)) {
      tasksToInsert.push({
        student_id: profile.id,
        school_id: school.id,
        task_type: "application",
        title: `Submit ${school.name} application`,
        due_date: regularDate,
        priority: 1,
      });
    }

    if (earlyDate && !existingSet.has(`${school.id}:early_deadline`)) {
      tasksToInsert.push({
        student_id: profile.id,
        school_id: school.id,
        task_type: "early_deadline",
        title: `${school.name} early deadline`,
        due_date: earlyDate,
        priority: 1,
      });
    }

    if (regularDate && !existingSet.has(`${school.id}:transcript`)) {
      tasksToInsert.push({
        student_id: profile.id,
        school_id: school.id,
        task_type: "transcript",
        title: `Request ${school.name} transcript`,
        due_date: subtractDays(regularDate, 14),
        priority: 2,
      });
    }
  }

  if (tasksToInsert.length === 0) {
    return NextResponse.json({ created: 0, message: "All deadline tasks already exist" });
  }

  const { error } = await supabase.from("cc_tasks").insert(tasksToInsert);
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ created: tasksToInsert.length });
}
