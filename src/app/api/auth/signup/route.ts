import { NextRequest, NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase-auth";

export async function POST(req: NextRequest) {
  try {
    const { name, email, password, role, teacherKey } = await req.json();

    if (!name?.trim() || !email?.trim() || !password) {
      return NextResponse.json({ error: "Name, email, and password are required." }, { status: 400 });
    }
    if (password.length < 6) {
      return NextResponse.json({ error: "Password must be at least 6 characters." }, { status: 400 });
    }

    // Validate teacher key
    if (role === "teacher") {
      const validKey = process.env.TEACHER_SECRET_KEY;
      if (!teacherKey || teacherKey.trim() !== validKey) {
        return NextResponse.json({ error: "Invalid teacher key." }, { status: 403 });
      }
    }

    const supabase = await createServerSupabase();
    const { data, error } = await supabase.auth.signUp({
      email: email.toLowerCase().trim(),
      password,
      options: {
        data: {
          full_name: name.trim(),
          role: role === "teacher" ? "teacher" : "student",
        },
      },
    });

    if (error) {
      if (error.message.includes("already registered")) {
        return NextResponse.json({ error: "An account with this email already exists." }, { status: 409 });
      }
      return NextResponse.json({ error: "Failed to create account." }, { status: 500 });
    }

    if (!data.user) {
      return NextResponse.json({ error: "Failed to create account." }, { status: 500 });
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
    return NextResponse.json({ error: "Signup failed." }, { status: 500 });
  }
}
