// src/lib/cc/agent/s1-flag.ts
export function isAgentS1User(userId: string, env: Record<string, string | undefined> = process.env): boolean {
  if (env.AGENT_S1_ENABLED !== "1") return false;
  const ids = (env.AGENT_S1_USER_IDS ?? "").split(",").map((s) => s.trim()).filter(Boolean);
  return ids.includes(userId);
}
