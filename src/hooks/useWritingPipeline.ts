"use client";

import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/lib/supabase";
import type { WritingPipelineRun, PipelineStage, StageName } from "@/types/writing";

export function useWritingPipeline(documentId: string | null) {
  const [run, setRun] = useState<WritingPipelineRun | null>(null);
  const [stages, setStages] = useState<PipelineStage[]>([]);
  const [loading, setLoading] = useState(false);
  const [executing, setExecuting] = useState(false);

  useEffect(() => {
    if (!documentId) return;

    async function fetchPipeline() {
      const { data: runs } = await supabase
        .from("writing_pipeline_runs")
        .select("*")
        .eq("document_id", documentId)
        .order("created_at", { ascending: false })
        .limit(1);

      if (runs && runs.length > 0) {
        const latestRun = runs[0] as WritingPipelineRun;
        setRun(latestRun);

        const { data: stageData } = await supabase
          .from("pipeline_stages")
          .select("*")
          .eq("run_id", latestRun.id)
          .order("stage_order", { ascending: true });

        if (stageData) {
          setStages(stageData as PipelineStage[]);
        }
      }
    }

    fetchPipeline();

    const channel = supabase
      .channel(`pipeline:${documentId}`)
      .on(
        "postgres_changes",
        { event: "UPDATE", schema: "public", table: "pipeline_stages" },
        (payload) => {
          const updated = payload.new as PipelineStage;
          setStages((prev) =>
            prev.map((s) => (s.id === updated.id ? updated : s))
          );
        }
      )
      .subscribe();

    return () => {
      channel.unsubscribe();
    };
  }, [documentId]);

  const startPipeline = useCallback(
    async (userId: string, pipelineType: string = "essay") => {
      if (!documentId) return;
      setLoading(true);

      const res = await fetch("/api/ai/writing/start", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          document_id: documentId,
          initiated_by: userId,
          pipeline_type: pipelineType,
        }),
      });

      const newRun = await res.json();
      setRun(newRun);

      const { data: stageData } = await supabase
        .from("pipeline_stages")
        .select("*")
        .eq("run_id", newRun.id)
        .order("stage_order", { ascending: true });

      if (stageData) {
        setStages(stageData as PipelineStage[]);
      }

      setLoading(false);
      return newRun;
    },
    [documentId]
  );

  const executeStage = useCallback(
    async (
      stageName: StageName,
      context: {
        topic?: string;
        doc_type?: string;
        requirements?: string;
        teacher_feedback?: string;
      } = {}
    ) => {
      if (!run) return;
      setExecuting(true);

      try {
        const res = await fetch("/api/ai/writing/stage", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            run_id: run.id,
            stage_name: stageName,
            ...context,
          }),
        });

        const result = await res.json();
        setStages((prev) =>
          prev.map((s) => (s.stage_name === stageName ? result : s))
        );
        return result;
      } finally {
        setExecuting(false);
      }
    },
    [run]
  );

  const approveStage = useCallback(
    async (stageName: string, userId: string, feedback?: string) => {
      if (!run) return;

      const res = await fetch("/api/ai/writing/approve", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          run_id: run.id,
          stage_name: stageName,
          action: "approve",
          approved_by: userId,
          feedback,
        }),
      });

      return res.json();
    },
    [run]
  );

  const rejectStage = useCallback(
    async (stageName: string, feedback: string) => {
      if (!run) return;

      const res = await fetch("/api/ai/writing/approve", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          run_id: run.id,
          stage_name: stageName,
          action: "reject",
          feedback,
        }),
      });

      return res.json();
    },
    [run]
  );

  const currentStage = stages.find(
    (s) => s.status === "running" || s.status === "awaiting_approval"
  );

  const isComplete = run?.status === "completed";
  const isRunning = run?.status === "running" || executing;

  return {
    run,
    stages,
    currentStage,
    loading,
    executing,
    isComplete,
    isRunning,
    startPipeline,
    executeStage,
    approveStage,
    rejectStage,
  };
}
