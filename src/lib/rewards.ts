// Variable reward schedule — creates unpredictable dopamine patterns
// Like TikTok's content delivery: mediocre → mediocre → GREAT → okay → INCREDIBLE

export interface RewardEvent {
  type: 'none' | 'bonus-xp' | 'mystery-gem' | 'xp-multiplier' | 'surprise-achievement' | 'jackpot';
  amount?: number;
  message: string;
  sound: 'xp-gain' | 'level-up' | 'achievement';
}

// Seeded random from user session — consistent within a session, varies across sessions
function seededRandom(seed: string): () => number {
  let h = 0;
  for (let i = 0; i < seed.length; i++) {
    h = Math.imul(31, h) + seed.charCodeAt(i) | 0;
  }
  return () => {
    h = Math.imul(h ^ (h >>> 16), 0x45d9f3b);
    h = Math.imul(h ^ (h >>> 13), 0x45d9f3b);
    return ((h ^ (h >>> 16)) >>> 0) / 4294967296;
  };
}

// Check if this action should trigger a variable reward
export function rollVariableReward(userId: string, actionCount: number): RewardEvent {
  const seed = `${userId}-${new Date().toISOString().split('T')[0]}-${actionCount}`;
  const rand = seededRandom(seed);
  const roll = rand();

  // Reward distribution (per interaction):
  // 70% — nothing extra (baseline)
  // 12% — bonus XP (+25 to +100)
  // 8% — mystery gem drop (3-10 gems)
  // 5% — XP multiplier (next action is 3x)
  // 3% — surprise mini-achievement message
  // 2% — JACKPOT (50 gems + 200 XP)

  if (roll < 0.70) {
    return { type: 'none', message: '', sound: 'xp-gain' };
  } else if (roll < 0.82) {
    const bonus = Math.floor(rand() * 75) + 25;
    return { type: 'bonus-xp', amount: bonus, message: `Bonus! +${bonus} XP`, sound: 'xp-gain' };
  } else if (roll < 0.90) {
    const gems = Math.floor(rand() * 7) + 3;
    return { type: 'mystery-gem', amount: gems, message: `Mystery gem drop! +${gems} gems`, sound: 'achievement' };
  } else if (roll < 0.95) {
    return { type: 'xp-multiplier', amount: 3, message: '3x XP on your next action!', sound: 'level-up' };
  } else if (roll < 0.98) {
    const messages = [
      "You're on fire today!",
      "Coach Alex is impressed!",
      "Learning streak activated!",
      "Brain power unlocked!",
      "Knowledge level: Expert mode!",
    ];
    return { type: 'surprise-achievement', message: messages[Math.floor(rand() * messages.length)], sound: 'achievement' };
  } else {
    return { type: 'jackpot', amount: 50, message: 'JACKPOT! +50 gems +200 XP!', sound: 'level-up' };
  }
}

// Escalating daily login rewards
// Day 1: 5 gems, Day 2: 5, Day 3: 10, Day 4: 10, Day 5: 15, Day 6: 20, Day 7: 50 (weekly jackpot)
// Then resets to Day 1
export function getDailyLoginReward(consecutiveDay: number): { gems: number; xp: number; message: string; isJackpot: boolean } {
  const dayInCycle = ((consecutiveDay - 1) % 7) + 1;
  const rewards: Record<number, { gems: number; xp: number }> = {
    1: { gems: 5, xp: 10 },
    2: { gems: 5, xp: 10 },
    3: { gems: 10, xp: 15 },
    4: { gems: 10, xp: 15 },
    5: { gems: 15, xp: 20 },
    6: { gems: 20, xp: 25 },
    7: { gems: 50, xp: 50 },
  };

  const reward = rewards[dayInCycle];
  const isJackpot = dayInCycle === 7;

  return {
    gems: reward.gems,
    xp: reward.xp,
    message: isJackpot
      ? `Weekly jackpot! Day ${dayInCycle}: +${reward.gems} gems +${reward.xp} XP!`
      : `Day ${dayInCycle}: +${reward.gems} gems +${reward.xp} XP`,
    isJackpot,
  };
}

// Coach enthusiasm levels based on engagement signals
export type EnthusiasmLevel = 'low' | 'normal' | 'high' | 'hyped';

export function getCoachEnthusiasm(signals: {
  lessonsToday: number;
  streakDays: number;
  xpToday: number;
  minutesActive: number;
}): { level: EnthusiasmLevel; modifier: string } {
  const { lessonsToday, streakDays, xpToday, minutesActive } = signals;

  // Score engagement 0-100
  let score = 0;
  score += Math.min(lessonsToday * 15, 30);  // Up to 30 for lessons
  score += Math.min(streakDays * 2, 20);      // Up to 20 for streak
  score += Math.min(xpToday / 10, 30);        // Up to 30 for XP
  score += Math.min(minutesActive * 2, 20);   // Up to 20 for time

  if (score >= 70) {
    return {
      level: 'hyped',
      modifier: `\n\nENGAGEMENT SIGNAL: The student is HIGHLY engaged today (${lessonsToday} lessons, ${streakDays}-day streak, ${xpToday} XP today). Match their energy! Be extra enthusiastic, use exclamation marks, celebrate every small win. They're in the zone!`,
    };
  } else if (score >= 40) {
    return {
      level: 'high',
      modifier: `\n\nENGAGEMENT SIGNAL: The student is actively engaged (${lessonsToday} lessons today, ${streakDays}-day streak). Be warm, encouraging, and keep the momentum going.`,
    };
  } else if (score >= 15) {
    return {
      level: 'normal',
      modifier: '', // Default behavior
    };
  } else {
    return {
      level: 'low',
      modifier: `\n\nENGAGEMENT SIGNAL: The student seems to be just getting started or returning after a break. Be extra welcoming, patient, and gently encouraging. Make them feel good about showing up.`,
    };
  }
}
