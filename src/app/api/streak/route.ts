import { NextRequest, NextResponse } from "next/server";
import { getAuthUser } from "@/lib/supabase-auth";
import { getStreakInfo, freezeStreak, repairStreak } from "@/lib/streaks";

/**
 * GET /api/streak — Returns streak info for the current user
 */
export async function GET() {
  const user = await getAuthUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const info = await getStreakInfo(user.id);
  return NextResponse.json(info);
}

/**
 * POST /api/streak — Freeze or repair streak
 * Body: { action: 'freeze' | 'repair' }
 */
export async function POST(req: NextRequest) {
  const user = await getAuthUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { action } = await req.json();

  if (action === "freeze") {
    const success = await freezeStreak(user.id);
    return NextResponse.json({
      success,
      gemCost: 10,
      message: success ? "Streak frozen for today!" : "Not enough gems (need 10).",
    });
  }

  if (action === "repair") {
    const success = await repairStreak(user.id);
    return NextResponse.json({
      success,
      gemCost: 20,
      message: success ? "Streak repaired!" : "Not enough gems (need 20).",
    });
  }

  return NextResponse.json({ error: "Invalid action. Use 'freeze' or 'repair'." }, { status: 400 });
}
