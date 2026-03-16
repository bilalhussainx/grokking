// src/lib/skills-radar.ts
import { createAdminSupabase } from "@/lib/supabase-auth";

export interface UserSkill {
  skillId: string;
  skillName: string;
  skillType: string;
  category: string;
  proficiency: number;
  sourceCourse: string;
  earnedAt: string;
}

export interface CareerRole {
  roleId: string;
  title: string;
  description: string;
  category: string;
  avgSalary: number;
  growthOutlook: string;
  requiredSkills: string[];
}

export interface GapAnalysis {
  role: CareerRole;
  matchPercentage: number;
  matchedSkills: string[];
  missingSkills: string[];
  recommendedCourses: { slug: string; title: string }[];
}

/**
 * Returns all skills the user has earned from completed courses.
 */
export async function getUserSkills(userId: string): Promise<UserSkill[]> {
  const db = createAdminSupabase();

  const { data, error } = await db
    .from("user_skills")
    .select(`
      skill_id,
      proficiency,
      source_course,
      earned_at,
      skills_taxonomy!inner (
        skill_name,
        skill_type,
        category
      )
    `)
    .eq("user_id", userId);

  if (error) {
    console.error("[skills-radar] getUserSkills error:", error);
    return [];
  }

  return (data || []).map((row: Record<string, unknown>) => {
    const taxonomy = row.skills_taxonomy as Record<string, unknown>;
    return {
      skillId: row.skill_id as string,
      skillName: taxonomy.skill_name as string,
      skillType: taxonomy.skill_type as string,
      category: taxonomy.category as string,
      proficiency: row.proficiency as number,
      sourceCourse: row.source_course as string,
      earnedAt: row.earned_at as string,
    };
  });
}

/**
 * Compares user skills to required skills for a career role.
 * Returns matched/missing skills with match percentage.
 */
export async function getCareerGap(
  userId: string,
  roleId: string
): Promise<GapAnalysis | null> {
  const db = createAdminSupabase();

  // Fetch the career role
  const { data: roleData, error: roleError } = await db
    .from("career_roles")
    .select("*")
    .eq("role_id", roleId)
    .single();

  if (roleError || !roleData) {
    console.error("[skills-radar] getCareerGap role error:", roleError);
    return null;
  }

  const role: CareerRole = {
    roleId: roleData.role_id,
    title: roleData.title,
    description: roleData.description || "",
    category: roleData.category || "",
    avgSalary: roleData.avg_salary_usd || 0,
    growthOutlook: roleData.growth_outlook || "",
    requiredSkills: (roleData.required_skills as string[]) || [],
  };

  // Fetch user's skill IDs
  const userSkills = await getUserSkills(userId);
  const userSkillIds = new Set(userSkills.map((s) => s.skillId));

  const matchedSkills: string[] = [];
  const missingSkills: string[] = [];

  for (const skillId of role.requiredSkills) {
    if (userSkillIds.has(skillId)) {
      matchedSkills.push(skillId);
    } else {
      missingSkills.push(skillId);
    }
  }

  const matchPercentage =
    role.requiredSkills.length > 0
      ? Math.round((matchedSkills.length / role.requiredSkills.length) * 100)
      : 0;

  // Resolve skill names for display
  const { data: skillNames } = await db
    .from("skills_taxonomy")
    .select("skill_id, skill_name")
    .in("skill_id", role.requiredSkills);

  const nameMap = new Map<string, string>();
  for (const s of skillNames || []) {
    nameMap.set(s.skill_id, s.skill_name);
  }

  const matchedNames = matchedSkills.map((id) => nameMap.get(id) || id);
  const missingNames = missingSkills.map((id) => nameMap.get(id) || id);

  // Find courses that teach missing skills
  const recommendedCourses: { slug: string; title: string }[] = [];
  if (missingSkills.length > 0) {
    const { data: courseMaps } = await db
      .from("course_skill_map")
      .select("course_id, skill_id")
      .in("skill_id", missingSkills);

    // Deduplicate course IDs
    const courseIds = [...new Set((courseMaps || []).map((c: Record<string, unknown>) => c.course_id as string))];

    // We can't query the courses table (they're in-memory TS data), so return slugs
    for (const slug of courseIds) {
      recommendedCourses.push({ slug, title: slug.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()) });
    }
  }

  return {
    role: { ...role, requiredSkills: role.requiredSkills.map((id) => nameMap.get(id) || id) },
    matchPercentage,
    matchedSkills: matchedNames,
    missingSkills: missingNames,
    recommendedCourses,
  };
}

/**
 * Finds best-matching career roles based on user's current skills.
 */
export async function getRecommendedRoles(userId: string): Promise<(CareerRole & { matchPercentage: number })[]> {
  const db = createAdminSupabase();

  // Fetch all career roles
  const { data: roles, error } = await db
    .from("career_roles")
    .select("*");

  if (error || !roles) {
    console.error("[skills-radar] getRecommendedRoles error:", error);
    return [];
  }

  // Fetch user's skill IDs
  const userSkills = await getUserSkills(userId);
  const userSkillIds = new Set(userSkills.map((s) => s.skillId));

  const results = roles.map((r: Record<string, unknown>) => {
    const requiredSkills = (r.required_skills as string[]) || [];
    const matched = requiredSkills.filter((s: string) => userSkillIds.has(s));
    const matchPercentage =
      requiredSkills.length > 0
        ? Math.round((matched.length / requiredSkills.length) * 100)
        : 0;

    return {
      roleId: r.role_id as string,
      title: r.title as string,
      description: (r.description as string) || "",
      category: (r.category as string) || "",
      avgSalary: (r.avg_salary_usd as number) || 0,
      growthOutlook: (r.growth_outlook as string) || "",
      requiredSkills,
      matchPercentage,
    };
  });

  // Sort by match percentage descending
  results.sort((a: { matchPercentage: number }, b: { matchPercentage: number }) => b.matchPercentage - a.matchPercentage);

  return results;
}
