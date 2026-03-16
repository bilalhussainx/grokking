import { NextResponse } from "next/server";
import { getAllGeneratedCourses } from "@/lib/course-generator";

export async function GET() {
  try {
    const courses = await getAllGeneratedCourses();
    return NextResponse.json({ courses });
  } catch (err) {
    console.error("[API] Failed to fetch generated courses:", err);
    return NextResponse.json({ courses: [] });
  }
}
