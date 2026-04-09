"use client";

import { useState } from 'react';
import { useArena } from '@/contexts/ArenaContext';
import { ArenaTopBar } from './ArenaTopBar';
import { ArenaFileTree } from './ArenaFileTree';
import { ArenaEditor } from './ArenaEditor';
import { ArenaTerminal } from './ArenaTerminal';
import { ArenaGitLog } from './ArenaGitLog';
import { ArenaInterviewer } from './ArenaInterviewer';
import { ArenaMilestones } from './ArenaMilestones';

export default function ArenaLayout() {
  const { session } = useArena();
  const [openFilePath, setOpenFilePath] = useState<string | undefined>(undefined);

  if (!session) {
    return (
      <div className="h-screen flex items-center justify-center bg-slate-950 text-white/40">
        Loading session...
      </div>
    );
  }

  const { sandboxId, roomId, challengeId } = session;

  return (
    <div className="h-screen flex flex-col bg-slate-950 text-white overflow-hidden">
      {/* Top bar — key forces remount on session change so countdown resets */}
      <ArenaTopBar key={session.roomId} />

      {/* Body: three-column grid */}
      <div className="flex-1 min-h-0 grid grid-cols-[220px_1fr_320px]">
        {/* Left: file tree + git log */}
        <div className="grid grid-rows-[1fr_auto] min-h-0 border-r border-white/[0.06]">
          <div className="min-h-0 overflow-hidden">
            <ArenaFileTree
              sandboxId={sandboxId}
              onFileSelect={setOpenFilePath}
              selectedPath={openFilePath}
            />
          </div>
          <div className="border-t border-white/[0.06] max-h-56 overflow-hidden">
            <ArenaGitLog sandboxId={sandboxId} roomId={roomId} />
          </div>
        </div>

        {/* Center: editor + terminal */}
        <div className="grid grid-rows-[1fr_280px] min-h-0 min-w-0">
          <div className="min-h-0 min-w-0 overflow-hidden">
            <ArenaEditor
              sandboxId={sandboxId}
              roomId={roomId}
              openFilePath={openFilePath}
            />
          </div>
          <div className="min-h-0 min-w-0 border-t border-white/[0.06] overflow-hidden">
            <ArenaTerminal sandboxId={sandboxId} roomId={roomId} />
          </div>
        </div>

        {/* Right: interviewer + milestones */}
        <div className="grid grid-rows-[1fr_auto] min-h-0 border-l border-white/[0.06]">
          <div className="min-h-0 overflow-hidden">
            <ArenaInterviewer roomId={roomId} />
          </div>
          <div className="border-t border-white/[0.06] max-h-80 overflow-hidden">
            <ArenaMilestones
              sandboxId={sandboxId}
              roomId={roomId}
              challengeId={challengeId}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
