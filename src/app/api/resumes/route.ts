// GET  /api/resumes — list user's resumes
// POST /api/resumes — multipart upload: file + optional filename, parse + store
// Spec: CollegeVCareers.md SP-16.

import { NextRequest, NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase-auth";
import { detectResumeType, extractResumeText, splitResumeSections } from "@/lib/resume-parse";

export async function GET() {
  const supabase = await createServerSupabase();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { data, error } = await supabase
    .from("resume_docs")
    .select("id, original_filename, file_type, updated_at, created_at")
    .eq("user_id", user.id)
    .order("updated_at", { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ resumes: data || [] });
}

export const runtime = "nodejs";
export const maxDuration = 60;

export async function POST(req: NextRequest) {
  const supabase = await createServerSupabase();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const form = await req.formData();
  const file = form.get("file");
  if (!(file instanceof File)) {
    return NextResponse.json({ error: "file field required" }, { status: 400 });
  }
  if (file.size > 4 * 1024 * 1024) {
    return NextResponse.json({ error: "File too large (max 4MB)" }, { status: 400 });
  }

  const type = detectResumeType(file.name, file.type);
  if (!type) {
    return NextResponse.json({ error: "Unsupported file type. Use PDF, DOCX, or TXT." }, { status: 400 });
  }

  const buf = Buffer.from(await file.arrayBuffer());
  let rawText = "";
  try {
    rawText = await extractResumeText(buf, type);
  } catch (err) {
    console.error("[resumes] parse error:", err);
    return NextResponse.json({ error: "Failed to parse file" }, { status: 400 });
  }

  if (!rawText.trim()) {
    return NextResponse.json({ error: "No readable text in file (scanned PDF? try a text-based PDF or DOCX)" }, { status: 400 });
  }

  const sections = splitResumeSections(rawText);

  const { data, error } = await supabase
    .from("resume_docs")
    .insert({
      user_id: user.id,
      original_filename: file.name.slice(0, 200),
      file_type: type,
      raw_text: rawText.slice(0, 50000),
      parsed_sections: sections,
    })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}
