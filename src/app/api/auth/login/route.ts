import { NextRequest, NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase-auth";

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();

    if (!email?.trim() || !password) {
      return NextResponse.json({ error: "Email and password are required." }, { status: 400 });
    }

    const supabase = await createServerSupabase();
    const { data, error } = await supabase.auth.signInWithPassword({
      email: email.toLowerCase().trim(),
      password,
    });

    if (error || !data.user) {
      return NextResponse.json({ error: "Invalid email or password." }, { status: 401 });
    }

    const user = data.user;
    return NextResponse.json({
      user: {
        id: user.id,
        email: user.email || "",
        name: user.user_metadata?.full_name || "",
        role: user.user_metadata?.role || "student",
      },
    });
  } catch {
    return NextResponse.json({ error: "Login failed." }, { status: 500 });
  }
}
