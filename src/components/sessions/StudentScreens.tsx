"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { Monitor, Maximize2, Minimize2, ShieldCheck, ShieldOff, Code2 } from "lucide-react";
import type { PresenceState, StudentPermission } from "@/types/sessions";
import dynamic from "next/dynamic";

const MonacoEditor = dynamic(() => import("@monaco-editor/react").then((m) => m.default), { ssr: false });

interface Props {
  studentScreens: Record<string, { content: string; language: string; lastUpdate: number }>;
  onlineUsers: PresenceState[];
  permissions: Record<string, StudentPermission[]>;
  onGrantPermission: (userId: string, permission: StudentPermission, granted: boolean) => void;
}

export default function StudentScreens({ studentScreens, onlineUsers, permissions, onGrantPermission }: Props) {
  const [expanded, setExpanded] = useState<string | null>(null);

  const students = onlineUsers.filter((u) => u.role === "student");

  if (students.length === 0) {
    return (
      <div className="flex items-center justify-center h-full text-[var(--muted-foreground)]">
        <div className="text-center">
          <Monitor className="w-10 h-10 mx-auto mb-3 opacity-20" />
          <p className="text-sm">No students connected</p>
          <p className="text-xs mt-1">Student screens will appear here when they join</p>
        </div>
      </div>
    );
  }

  // Expanded single student view
  if (expanded) {
    const screen = studentScreens[expanded];
    const student = students.find((s) => s.userId === expanded);
    const perms = permissions[expanded] || [];

    return (
      <div className="flex flex-col h-full">
        <div className="flex items-center gap-2 px-4 py-2 border-b border-white/[0.06]">
          <button onClick={() => setExpanded(null)} className="rounded-lg p-1 hover:bg-white/10 transition-colors">
            <Minimize2 className="w-4 h-4" />
          </button>
          <div className="flex h-6 w-6 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-violet-600 text-[10px] font-bold text-white">
            {(student?.name || "?")[0].toUpperCase()}
          </div>
          <span className="text-sm font-semibold">{student?.name || "Student"}</span>
          <span className="text-[10px] text-[var(--muted-foreground)]">
            {screen ? `Last update ${Math.round((Date.now() - screen.lastUpdate) / 1000)}s ago` : "No code yet"}
          </span>
          <div className="ml-auto flex items-center gap-1">
            <button
              onClick={() => onGrantPermission(expanded, "edit", !perms.includes("edit"))}
              className={`rounded-lg px-2.5 py-1 text-xs flex items-center gap-1 transition-colors ${
                perms.includes("edit")
                  ? "bg-emerald-500/20 text-emerald-400"
                  : "bg-white/5 text-[var(--muted-foreground)] hover:text-white"
              }`}
            >
              {perms.includes("edit") ? <ShieldCheck className="w-3 h-3" /> : <ShieldOff className="w-3 h-3" />}
              {perms.includes("edit") ? "Edit Granted" : "Grant Edit"}
            </button>
          </div>
        </div>
        <div className="flex-1">
          <MonacoEditor
            height="100%"
            language={screen?.language || "python"}
            value={screen?.content || "// Waiting for student code..."}
            theme="vs-dark"
            options={{ readOnly: true, minimap: { enabled: false }, fontSize: 13, scrollBeyondLastLine: false }}
          />
        </div>
      </div>
    );
  }

  // Grid view
  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center gap-2 px-4 py-3 border-b border-white/[0.06]">
        <Monitor className="w-4 h-4 text-cyan-400" />
        <span className="text-sm font-semibold">Student Screens</span>
        <span className="text-[10px] text-[var(--muted-foreground)] ml-auto">
          {students.length} student{students.length !== 1 ? "s" : ""} online
        </span>
      </div>
      <div className="flex-1 overflow-y-auto p-4 grid gap-3 grid-cols-1 lg:grid-cols-2 auto-rows-min">
        {students.map((student, i) => {
          const screen = studentScreens[student.userId];
          const perms = permissions[student.userId] || [];
          const stale = screen ? (Date.now() - screen.lastUpdate) > 15000 : true;

          return (
            <motion.div
              key={student.userId}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="glass-strong rounded-xl overflow-hidden flex flex-col"
            >
              {/* Student header */}
              <div className="flex items-center gap-2 px-3 py-2 border-b border-white/[0.06]">
                <div className="flex h-5 w-5 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-violet-600 text-[8px] font-bold text-white">
                  {student.name[0].toUpperCase()}
                </div>
                <span className="text-xs font-semibold truncate">{student.name}</span>
                <span className={`ml-auto h-1.5 w-1.5 rounded-full ${stale ? "bg-yellow-400" : "bg-emerald-400"}`} />
                <button
                  onClick={() => setExpanded(student.userId)}
                  className="rounded p-0.5 hover:bg-white/10 transition-colors"
                >
                  <Maximize2 className="w-3 h-3 text-[var(--muted-foreground)]" />
                </button>
              </div>

              {/* Code preview */}
              <div className="h-32 overflow-hidden bg-black/30 relative">
                {screen ? (
                  <pre className="p-2 text-[10px] font-mono text-[var(--foreground)] leading-tight overflow-hidden">
                    {screen.content.split("\n").slice(0, 10).join("\n")}
                  </pre>
                ) : (
                  <div className="flex items-center justify-center h-full text-[10px] text-[var(--muted-foreground)]">
                    No code yet
                  </div>
                )}
                {screen && (
                  <div className="absolute bottom-1 right-1 flex items-center gap-1 rounded bg-black/60 px-1.5 py-0.5 text-[8px] text-[var(--muted-foreground)]">
                    <Code2 className="w-2.5 h-2.5" /> {screen.language}
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="flex items-center gap-1 px-2 py-1.5 border-t border-white/[0.06]">
                <button
                  onClick={() => onGrantPermission(student.userId, "edit", !perms.includes("edit"))}
                  className={`rounded px-2 py-0.5 text-[10px] flex items-center gap-1 transition-colors ${
                    perms.includes("edit") ? "text-emerald-400" : "text-[var(--muted-foreground)] hover:text-white"
                  }`}
                >
                  {perms.includes("edit") ? <ShieldCheck className="w-2.5 h-2.5" /> : <ShieldOff className="w-2.5 h-2.5" />}
                  {perms.includes("edit") ? "Editing" : "Grant Edit"}
                </button>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
