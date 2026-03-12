"use client";

import { useEffect, useRef, useCallback, useState } from "react";
import { supabase } from "@/lib/supabase";
import type { RealtimeChannel } from "@supabase/supabase-js";
import type { PresenceState, SessionBroadcastEvent } from "@/types/sessions";

interface UseSessionChannelOptions {
  sessionId: string;
  userId: string;
  userName: string;
  userRole: "student" | "teacher" | "observer";
  onMessage?: (payload: Record<string, unknown>) => void;
  onPresenceChange?: (state: Record<string, PresenceState[]>) => void;
  onBroadcast?: (event: SessionBroadcastEvent) => void;
}

export function useSessionChannel({
  sessionId,
  userId,
  userName,
  userRole,
  onMessage,
  onPresenceChange,
  onBroadcast,
}: UseSessionChannelOptions) {
  const channelRef = useRef<RealtimeChannel | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [presenceState, setPresenceState] = useState<Record<string, PresenceState[]>>({});

  useEffect(() => {
    if (!sessionId || !userId) return;

    const channel = supabase.channel(`session:${sessionId}`, {
      config: { presence: { key: userId } },
    });

    channel.on("broadcast", { event: "session_event" }, (payload) => {
      onBroadcast?.(payload.payload as SessionBroadcastEvent);
    });

    channel.on(
      "postgres_changes",
      {
        event: "INSERT",
        schema: "public",
        table: "session_messages",
        filter: `session_id=eq.${sessionId}`,
      },
      (payload) => {
        onMessage?.(payload.new as Record<string, unknown>);
      }
    );

    channel.on("presence", { event: "sync" }, () => {
      const state = channel.presenceState<PresenceState>();
      setPresenceState(state);
      onPresenceChange?.(state);
    });

    channel.subscribe(async (status) => {
      if (status === "SUBSCRIBED") {
        setIsConnected(true);
        await channel.track({
          userId,
          name: userName,
          role: userRole,
          online_at: new Date().toISOString(),
        } as PresenceState);
      }
    });

    channelRef.current = channel;

    return () => {
      channel.unsubscribe();
      channelRef.current = null;
      setIsConnected(false);
    };
  }, [sessionId, userId, userName, userRole]);

  const sendBroadcast = useCallback(
    (event: SessionBroadcastEvent) => {
      channelRef.current?.send({
        type: "broadcast",
        event: "session_event",
        payload: event,
      });
    },
    []
  );

  const updatePresence = useCallback(
    (data: Partial<PresenceState>) => {
      channelRef.current?.track({
        userId,
        name: userName,
        role: userRole,
        online_at: new Date().toISOString(),
        ...data,
      } as PresenceState);
    },
    [userId, userName, userRole]
  );

  return {
    channel: channelRef.current,
    isConnected,
    presenceState,
    sendBroadcast,
    updatePresence,
  };
}
