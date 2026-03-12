import { NextRequest, NextResponse } from "next/server";
import { createAdminSupabase } from "@/lib/supabase-server";
import { hashPassword, signToken } from "@/lib/auth";

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

    const db = createAdminSupabase();

    // Check if email already exists
    const { data: existing } = await db
      .from("app_users")
      .select("id")
      .eq("email", email.toLowerCase().trim())
      .single();

    if (existing) {
      return NextResponse.json({ error: "An account with this email already exists." }, { status: 409 });
    }

    const passwordHash = await hashPassword(password);

    const { data: user, error } = await db
      .from("app_users")
      .insert({
        email: email.toLowerCase().trim(),
        password_hash: passwordHash,
        full_name: name.trim(),
        role: role === "teacher" ? "teacher" : "student",
      })
      .select("id, email, full_name, role")
      .single();

    if (error || !user) {
      return NextResponse.json({ error: "Failed to create account." }, { status: 500 });
    }

    const session = {
      userId: user.id,
      name: user.full_name,
      email: user.email,
      role: user.role as "student" | "teacher",
    };

    const token = await signToken(session);

    const res = NextResponse.json({ user: session });
    res.cookies.set("auth-token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: "/",
    });

    return res;
  } catch {
    return NextResponse.json({ error: "Signup failed." }, { status: 500 });
  }
}
