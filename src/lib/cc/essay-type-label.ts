const ESSAY_TYPE_LABELS: Record<string, string> = {
  personal_statement: "Personal Statement",
  supplemental: "School Supplemental",
  scholarship: "Scholarship Essay",
};

// Counselor screens showed raw keys like "personal_statement". Client-safe
// (essay-helpers.ts pulls in the server Supabase client).
export function essayTypeLabel(type: string | null | undefined): string {
  if (!type) return "Essay";
  return ESSAY_TYPE_LABELS[type] ?? type.split("_").map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(" ");
}
