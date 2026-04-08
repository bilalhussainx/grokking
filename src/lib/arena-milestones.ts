export type MilestoneDetector = 'file_exists' | 'test_passes' | 'http_200' | 'commit_contains';

export interface Milestone {
  id: string;
  title: string;
  detector: MilestoneDetector;
  target: string;        // path, test name, URL, or commit keyword
  xp: number;
}

export interface MilestoneStatus {
  id: string;
  title: string;
  complete: boolean;
  xp: number;
}

// Check a single milestone against the sandbox context
export async function checkMilestone(
  milestone: Milestone,
  context: {
    files: string[];           // list of file paths in sandbox
    lastTestOutput: string;    // stdout from last test run
    commitMessages: string[];  // git log --oneline
    previewUrl?: string;       // live deploy URL if available
  }
): Promise<boolean> {
  switch (milestone.detector) {
    case 'file_exists':
      return context.files.some(f => f.includes(milestone.target));

    case 'test_passes':
      return context.lastTestOutput.includes(milestone.target) &&
        !context.lastTestOutput.includes('failing');

    case 'commit_contains':
      return context.commitMessages.some(m =>
        m.toLowerCase().includes(milestone.target.toLowerCase())
      );

    case 'http_200': {
      if (!context.previewUrl) return false;
      try {
        const res = await fetch(context.previewUrl, { signal: AbortSignal.timeout(3000) });
        return res.ok;
      } catch {
        return false;
      }
    }

    default:
      return false;
  }
}

export async function checkAllMilestones(
  milestones: Milestone[],
  context: Parameters<typeof checkMilestone>[1]
): Promise<MilestoneStatus[]> {
  return Promise.all(
    milestones.map(async m => ({
      id: m.id,
      title: m.title,
      complete: await checkMilestone(m, context),
      xp: m.xp,
    }))
  );
}
