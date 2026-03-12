"use client";

import { useState, useCallback } from "react";
import dynamic from "next/dynamic";
import {
  FileText, Code, Eye, EyeOff, Save, Sparkles, Loader2, Play, Terminal,
  Settings, BookOpen, Wand2,
} from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import { Lesson } from "@/data/types";

const MonacoEditor = dynamic(() => import("@monaco-editor/react"), { ssr: false });

interface LessonEditorProps {
  lesson: Lesson | null;
  moduleTitle: string;
  courseTitle: string;
}

type ActiveTab = "content" | "starter" | "solution";

export default function LessonEditor({ lesson, moduleTitle, courseTitle }: LessonEditorProps) {
  const [title, setTitle] = useState(lesson?.title || "");
  const [content, setContent] = useState(lesson?.content || "");
  const [starterCode, setStarterCode] = useState(lesson?.starterCode || "# Write your solution here\n");
  const [solutionCode, setSolutionCode] = useState(lesson?.solutionCode || "# Solution\n");
  const [activeTab, setActiveTab] = useState<ActiveTab>("content");
  const [showPreview, setShowPreview] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatePrompt, setGeneratePrompt] = useState("");

  const handleSave = async () => {
    setIsSaving(true);
    // For now, log to console — Supabase persistence will be added later
    console.log("Saving lesson:", { title, content, starterCode, solutionCode });
    await new Promise((r) => setTimeout(r, 1000));
    setIsSaving(false);
  };

  const handleAIGenerate = async () => {
    if (!generatePrompt.trim()) return;
    setIsGenerating(true);

    try {
      const res = await fetch("/api/ai/generate-lesson", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          topic: generatePrompt,
          courseTitle,
          moduleTitle,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.title) setTitle(data.title);
        if (data.content) setContent(data.content);
        if (data.starterCode) setStarterCode(data.starterCode);
        if (data.solutionCode) setSolutionCode(data.solutionCode);
      }
    } catch (err) {
      console.error("AI generation failed:", err);
    } finally {
      setIsGenerating(false);
      setGeneratePrompt("");
    }
  };

  const TABS: { key: ActiveTab; label: string; icon: React.ReactNode }[] = [
    { key: "content", label: "Content", icon: <FileText className="w-3.5 h-3.5" /> },
    { key: "starter", label: "Starter Code", icon: <Code className="w-3.5 h-3.5" /> },
    { key: "solution", label: "Solution", icon: <Code className="w-3.5 h-3.5 text-emerald-400" /> },
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[300px_1fr_340px] gap-4 min-h-[calc(100vh-160px)]">
      {/* ── LEFT PANEL: Inspector ── */}
      <div className="rounded-xl border border-white/[0.08] bg-white/[0.03] overflow-hidden flex flex-col">
        <div className="px-4 py-3 border-b border-white/[0.06] bg-white/[0.02]">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[var(--muted-foreground)]">
            <Settings className="w-3.5 h-3.5" />
            Inspector
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-5">
          {/* Title */}
          <div>
            <label className="block text-[11px] font-semibold uppercase tracking-wider text-[var(--muted-foreground)] mb-1.5">
              Lesson Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 text-sm rounded-lg bg-white/[0.05] border border-white/[0.08] text-[var(--foreground)] placeholder:text-[var(--muted-foreground)]/50 focus:outline-none focus:border-blue-500/40 focus:ring-1 focus:ring-blue-500/20 transition-all"
              placeholder="e.g., Two Sum Problem"
            />
          </div>

          {/* Module & Course Info */}
          <div>
            <label className="block text-[11px] font-semibold uppercase tracking-wider text-[var(--muted-foreground)] mb-1.5">
              Location
            </label>
            <div className="p-2.5 rounded-lg bg-white/[0.03] border border-white/[0.06] text-xs text-[var(--muted-foreground)]">
              <div className="flex items-center gap-1.5 mb-1">
                <BookOpen className="w-3 h-3" />
                {courseTitle}
              </div>
              <div className="text-[var(--foreground)] font-medium">
                {moduleTitle}
              </div>
            </div>
          </div>

          {/* AI Generate */}
          <div>
            <label className="block text-[11px] font-semibold uppercase tracking-wider text-[var(--muted-foreground)] mb-1.5">
              <div className="flex items-center gap-1.5">
                <Wand2 className="w-3 h-3 text-violet-400" />
                AI Generate
              </div>
            </label>
            <textarea
              value={generatePrompt}
              onChange={(e) => setGeneratePrompt(e.target.value)}
              placeholder="Describe the lesson topic... e.g., 'Teach sliding window pattern with a maximum sum subarray problem'"
              rows={3}
              className="w-full px-3 py-2 text-xs rounded-lg bg-white/[0.05] border border-white/[0.08] text-[var(--foreground)] placeholder:text-[var(--muted-foreground)]/50 focus:outline-none focus:border-violet-500/40 focus:ring-1 focus:ring-violet-500/20 resize-none transition-all"
            />
            <button
              onClick={handleAIGenerate}
              disabled={isGenerating || !generatePrompt.trim()}
              className="mt-2 w-full flex items-center justify-center gap-2 px-3 py-2 text-xs font-semibold rounded-lg bg-gradient-to-r from-violet-600 to-blue-600 text-white hover:from-violet-500 hover:to-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md shadow-violet-600/20"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Sparkles className="w-3.5 h-3.5" />
                  Generate with AI
                </>
              )}
            </button>
          </div>

          {/* Stats */}
          <div>
            <label className="block text-[11px] font-semibold uppercase tracking-wider text-[var(--muted-foreground)] mb-1.5">
              Stats
            </label>
            <div className="grid grid-cols-2 gap-2">
              <div className="p-2 rounded-lg bg-white/[0.03] border border-white/[0.06] text-center">
                <p className="text-lg font-bold text-[var(--foreground)]">{content.split(/\s+/).length}</p>
                <p className="text-[10px] text-[var(--muted-foreground)]">Words</p>
              </div>
              <div className="p-2 rounded-lg bg-white/[0.03] border border-white/[0.06] text-center">
                <p className="text-lg font-bold text-[var(--foreground)]">{starterCode.split("\n").length}</p>
                <p className="text-[10px] text-[var(--muted-foreground)]">Code Lines</p>
              </div>
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="p-4 border-t border-white/[0.06]">
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-semibold rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white disabled:opacity-50 transition-colors shadow-md shadow-emerald-600/20"
          >
            {isSaving ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Save className="w-4 h-4" />
            )}
            {isSaving ? "Saving..." : "Save Lesson"}
          </button>
        </div>
      </div>

      {/* ── CENTER PANEL: Workspace ── */}
      <div className="rounded-xl border border-white/[0.08] bg-white/[0.03] overflow-hidden flex flex-col min-h-0">
        {/* Tab Bar */}
        <div className="flex items-center gap-1 px-3 py-2 bg-[#0d0f17] border-b border-white/[0.06]">
          {TABS.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
                activeTab === tab.key
                  ? "bg-white/[0.08] text-[var(--foreground)]"
                  : "text-[var(--muted-foreground)] hover:bg-white/[0.04] hover:text-[var(--foreground)]"
              }`}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
          <div className="flex-1" />
          {activeTab === "content" && (
            <button
              onClick={() => setShowPreview(!showPreview)}
              className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium rounded-lg text-[var(--muted-foreground)] hover:bg-white/[0.06] transition-colors"
            >
              {showPreview ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
              {showPreview ? "Edit" : "Preview"}
            </button>
          )}
        </div>

        {/* Editor Area */}
        <div className="flex-1 min-h-0">
          {activeTab === "content" ? (
            showPreview ? (
              <div className="h-full overflow-y-auto p-6">
                <div className="prose prose-sm prose-invert max-w-none">
                  <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeHighlight]}>
                    {content}
                  </ReactMarkdown>
                </div>
              </div>
            ) : (
              <MonacoEditor
                height="100%"
                language="markdown"
                theme="vs-dark"
                value={content}
                onChange={(v) => setContent(v || "")}
                options={{
                  minimap: { enabled: false },
                  wordWrap: "on",
                  lineNumbers: "on",
                  fontSize: 13,
                  padding: { top: 12 },
                  scrollBeyondLastLine: false,
                }}
              />
            )
          ) : activeTab === "starter" ? (
            <MonacoEditor
              height="100%"
              language="python"
              theme="vs-dark"
              value={starterCode}
              onChange={(v) => setStarterCode(v || "")}
              options={{
                minimap: { enabled: false },
                wordWrap: "on",
                lineNumbers: "on",
                fontSize: 13,
                tabSize: 4,
                padding: { top: 12 },
                scrollBeyondLastLine: false,
              }}
            />
          ) : (
            <MonacoEditor
              height="100%"
              language="python"
              theme="vs-dark"
              value={solutionCode}
              onChange={(v) => setSolutionCode(v || "")}
              options={{
                minimap: { enabled: false },
                wordWrap: "on",
                lineNumbers: "on",
                fontSize: 13,
                tabSize: 4,
                padding: { top: 12 },
                scrollBeyondLastLine: false,
              }}
            />
          )}
        </div>
      </div>

      {/* ── RIGHT PANEL: Preview ── */}
      <div className="rounded-xl border border-white/[0.08] bg-white/[0.03] overflow-hidden flex flex-col">
        <div className="px-4 py-3 border-b border-white/[0.06] bg-white/[0.02]">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[var(--muted-foreground)]">
            <Eye className="w-3.5 h-3.5" />
            Live Preview
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          {/* Lesson Preview */}
          <div className="mb-6">
            <h2 className="text-lg font-bold mb-3">{title || "Untitled Lesson"}</h2>
            <div className="prose prose-sm prose-invert max-w-none text-[13px] [&_h1]:text-base [&_h2]:text-sm [&_h3]:text-sm [&_p]:text-xs [&_li]:text-xs [&_code]:text-[11px]">
              <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeHighlight]}>
                {content.substring(0, 2000) || "*No content yet...*"}
              </ReactMarkdown>
            </div>
          </div>

          {/* Code Preview */}
          {starterCode.trim() !== "# Write your solution here" && (
            <div className="mt-4">
              <h3 className="text-[11px] font-semibold uppercase tracking-wider text-[var(--muted-foreground)] mb-2">
                Starter Code Preview
              </h3>
              <div className="rounded-lg border border-white/[0.06] overflow-hidden bg-[#0d0f17]">
                <div className="flex items-center gap-1.5 px-3 py-1.5 border-b border-white/[0.06] text-[10px] font-medium text-[var(--muted-foreground)]">
                  <Terminal className="w-3 h-3 text-emerald-400" />
                  main.py
                </div>
                <pre className="p-3 text-[11px] text-[var(--foreground)] overflow-x-auto">
                  <code>{starterCode}</code>
                </pre>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
