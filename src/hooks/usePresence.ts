"use client";

import { useMemo } from "react";
import type { PresenceState } from "@/types/sessions";

export function usePresence(presenceState: Record<string, PresenceState[]>) {
  const onlineUsers = useMemo(() => {
    const users: PresenceState[] = [];
    for (const key in presenceState) {
      const presences = presenceState[key];
      if (presences?.length > 0) {
        users.push(presences[0]);
      }
    }
    return users;
  }, [presenceState]);

  const teachers = useMemo(
    () => onlineUsers.filter((u) => u.role === "teacher"),
    [onlineUsers]
  );

  const students = useMemo(
    () => onlineUsers.filter((u) => u.role === "student"),
    [onlineUsers]
  );

  return {
    onlineUsers,
    teachers,
    students,
    count: onlineUsers.length,
  };
}
