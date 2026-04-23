"use client";
import { useState, useRef, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FlaskConical, Play, Loader2, Copy, RotateCcw, Globe,
  Code2, Sparkles, ChevronDown, History, Wand2,
  Home, BarChart3, FileText, Gamepad2, Package, type LucideIcon,
} from "lucide-react";
import type { SessionBroadcastEvent } from "@/types/sessions";

interface Props {
  userRole: "student" | "teacher" | "observer";
  userId: string;
  sendBroadcast: (event: SessionBroadcastEvent) => void;
}

interface PromptRun {
  id: string;
  prompt: string;
  systemInstruction: string;
  result: string;
  timestamp: number;
  userId: string;
}

const PROMPT_TEMPLATES: { label: string; icon: LucideIcon; system: string; prompt: string }[] = [
  {
    label: "Landing Page",
    icon: Home,
    system: "You are a frontend developer. Generate complete, self-contained HTML with inline CSS and JavaScript. Use modern design with gradients, shadows, and animations. The page must be fully functional with no external dependencies.",
    prompt: "Create a modern SaaS landing page for a productivity app called 'FlowState'. Include a hero section with gradient background, feature cards with icons (use emoji), pricing table with 3 tiers, and a footer. Use a dark theme with purple accents.",
  },
  {
    label: "Dashboard UI",
    icon: BarChart3,
    system: "You are a UI developer. Generate complete HTML with inline CSS and JS. Create a realistic dashboard with charts (use CSS/SVG), stats cards, and interactive elements. Dark theme, modern design.",
    prompt: "Build a real-time analytics dashboard with: 4 stat cards (revenue, users, conversion rate, avg session), a bar chart showing weekly data (use CSS bars), a recent activity feed, and a sidebar navigation. Dark theme with blue accents.",
  },
  {
    label: "Interactive Form",
    icon: FileText,
    system: "You are a frontend developer. Generate complete HTML with inline CSS and JavaScript. Create a polished, accessible form with real-time validation and smooth animations.",
    prompt: "Create a multi-step signup wizard with 3 steps: Personal Info, Preferences, and Confirmation. Include field validation, progress indicator, smooth transitions between steps, and a review summary on the final step. Modern glassmorphism style.",
  },
  {
    label: "Game UI",
    icon: Gamepad2,
    system: "You are a creative developer. Generate complete HTML with inline CSS and JavaScript. Build a simple but polished browser game with smooth animations.",
    prompt: "Create a memory card matching game. 4x4 grid of cards that flip on click. Track score and moves. Include a timer, win detection with confetti animation, and a restart button. Neon/retro theme.",
  },
  {
    label: "Component Library",
    icon: Package,
    system: "You are a design systems engineer. Generate a showcase page with multiple UI components, each in its own section. Include interactive states (hover, active, disabled). All inline CSS.",
    prompt: "Create a component showcase page with: buttons (primary, secondary, ghost, danger), input fields with labels, toggle switches, dropdown menus, notification toasts, modal dialog, and a data table with sortable columns. Dark theme.",
  },
  {
    label: "Custom Prompt",
    icon: Sparkles,
    system: "You are a frontend developer. Generate complete, self-contained HTML with inline CSS and JavaScript. The output should be a fully functional web page or application.",
    prompt: "",
  },
];

export default function PromptLab({ userRole, userId, sendBroadcast }: Props) {
  const [prompt, setPrompt] = useState("");
  const [systemInstruction, setSystemInstruction] = useState(PROMPT_TEMPLATES[0].system);
  const [result, setResult] = useState("");
  const [running, setRunning] = useState(false);
  const [showPreview, setShowPreview] = useState(true); // Default to preview for UI generation
  const [copied, setCopied] = useState(false);
  const [history, setHistory] = useState<PromptRun[]>([]);
  const [showHistory, setShowHistory] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState(0);
  const [showSystemPrompt, setShowSystemPrompt] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  // Auto-render preview when result changes
  useEffect(() => {
    if (result && showPreview && iframeRef.current) {
      const doc = iframeRef.current.contentDocument;
      if (doc) {
        // Extract HTML from result — handle markdown code blocks
        let html = result;
        const htmlMatch = result.match(/```html\s*([\s\S]*?)```/);
        if (htmlMatch) {
          html = htmlMatch[1];
        } else if (result.includes("<!DOCTYPE") || result.includes("<html") || result.includes("<div")) {
          // Raw HTML, use as-is
          html = result;
        }
        doc.open();
        doc.write(html);
        doc.close();
      }
    }
  }, [result, showPreview]);

  const selectTemplate = (index: number) => {
    setSelectedTemplate(index);
    const t = PROMPT_TEMPLATES[index];
    setSystemInstruction(t.system);
    if (t.prompt) setPrompt(t.prompt);
  };

  const runPrompt = useCallback(async () => {
    if (!prompt.trim() || running) return;
    setRunning(true);
    setResult("");
    setShowPreview(true);

    try {
      const res = await fetch("/api/ai/prompt-lab", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt, systemInstruction: systemInstruction || undefined }),
      });

      if (!res.body) throw new Error("No stream");

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let accumulated = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        accumulated += decoder.decode(value, { stream: true });
        setResult(accumulated);
      }

      // Save to history
      const run: PromptRun = {
        id: Date.now().toString(),
        prompt,
        systemInstruction,
        result: accumulated,
        timestamp: Date.now(),
        userId,
      };
      setHistory((prev) => [run, ...prev].slice(0, 20));

      // Broadcast result to all participants
      sendBroadcast({
        type: "prompt_sync",
        promptContent: prompt,
        promptResult: accumulated,
        userId,
      });
    } catch {
      setResult("Error: Failed to run prompt. Please try again.");
    } finally {
      setRunning(false);
    }
  }, [prompt, systemInstruction, running, userId, sendBroadcast]);

  const copyResult = () => {
    navigator.clipboard.writeText(result);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const loadFromHistory = (run: PromptRun) => {
    setPrompt(run.prompt);
    setSystemInstruction(run.systemInstruction);
    setResult(run.result);
    setShowHistory(false);
    setShowPreview(true);
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center gap-2 px-4 py-3 border-b border-white/[0.06]">
        <FlaskConical className="w-4 h-4 text-fuchsia-400" />
        <span className="text-sm font-semibold">Prompt Engineering Lab</span>
        <span className="text-[10px] text-[var(--muted-foreground)] ml-auto">
          Write prompts → See live UI output
        </span>
        {history.length > 0 && (
          <button
            onClick={() => setShowHistory(!showHistory)}
            className={`rounded-lg px-2 py-1 text-xs flex items-center gap-1 transition-colors ${
              showHistory ? "bg-white/10 text-fuchsia-400" : "text-[var(--muted-foreground)] hover:text-white"
            }`}
          >
            <History className="w-3 h-3" /> {history.length}
          </button>
        )}
      </div>

      {/* Template selector */}
      <div className="flex items-center gap-1.5 px-4 py-2 border-b border-white/[0.06] overflow-x-auto">
        {PROMPT_TEMPLATES.map((t, i) => (
          <button
            key={i}
            onClick={() => selectTemplate(i)}
            className={`shrink-0 rounded-lg px-2.5 py-1.5 text-xs transition-colors flex items-center gap-1.5 ${
              selectedTemplate === i
                ? "bg-fuchsia-500/20 text-fuchsia-400 font-semibold"
                : "text-[var(--muted-foreground)] hover:text-white hover:bg-white/5"
            }`}
          >
            {(() => { const Icon = t.icon; return <Icon className="w-3.5 h-3.5" />; })()}
            {t.label}
          </button>
        ))}
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Left: Prompt editor */}
        <div className="w-[45%] flex flex-col border-r border-white/[0.06]">
          {/* System instruction (collapsible) */}
          <button
            onClick={() => setShowSystemPrompt(!showSystemPrompt)}
            className="flex items-center gap-1.5 px-4 py-2 text-[10px] font-semibold text-[var(--muted-foreground)] uppercase tracking-wider hover:text-white transition-colors border-b border-white/[0.04]"
          >
            <ChevronDown className={`w-3 h-3 transition-transform ${showSystemPrompt ? "" : "-rotate-90"}`} />
            System Instruction
            <Wand2 className="w-3 h-3 ml-auto text-fuchsia-400/50" />
          </button>
          <AnimatePresence>
            {showSystemPrompt && (
              <motion.div
                initial={{ height: 0 }}
                animate={{ height: "auto" }}
                exit={{ height: 0 }}
                className="overflow-hidden border-b border-white/[0.04]"
              >
                <textarea
                  value={systemInstruction}
                  onChange={(e) => setSystemInstruction(e.target.value)}
                  placeholder="e.g., You are a frontend developer that generates complete HTML pages..."
                  rows={3}
                  className="glass-input w-full px-4 py-2 text-xs resize-none border-0 rounded-none"
                />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Prompt */}
          <div className="flex-1 flex flex-col p-4">
            <label className="text-[10px] font-semibold text-[var(--muted-foreground)] uppercase tracking-wider mb-1.5 block">
              Your Prompt
            </label>
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Describe the UI you want to generate..."
              className="glass-input flex-1 w-full rounded-xl px-3.5 py-3 text-sm resize-none"
              onKeyDown={(e) => {
                if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
                  e.preventDefault();
                  runPrompt();
                }
              }}
            />
            <div className="flex items-center gap-2 mt-3">
              <button
                onClick={runPrompt}
                disabled={!prompt.trim() || running}
                className="rounded-xl px-5 py-2.5 text-xs font-semibold text-white flex items-center gap-2 disabled:opacity-30 transition-all shadow-lg shadow-fuchsia-500/20"
                style={{ background: "linear-gradient(135deg, #d946ef 0%, #8b5cf6 100%)" }}
              >
                {running ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <Play className="w-3.5 h-3.5" />
                )}
                {running ? "Generating..." : "Generate UI"}
              </button>
              <span className="text-[10px] text-[var(--muted-foreground)]">⌘+Enter</span>
              {result && (
                <button
                  onClick={() => {
                    setResult("");
                    setShowPreview(true);
                  }}
                  className="rounded-lg px-2.5 py-1.5 text-xs text-[var(--muted-foreground)] hover:text-white transition-colors flex items-center gap-1"
                >
                  <RotateCcw className="w-3 h-3" /> Clear
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Right: Result / Preview */}
        <div className="flex-1 flex flex-col">
          {/* Tab toggle */}
          <div className="flex items-center gap-1 px-4 py-2 border-b border-white/[0.06]">
            <button
              onClick={() => setShowPreview(true)}
              className={`rounded-lg px-3 py-1 text-xs transition-colors flex items-center gap-1.5 ${
                showPreview
                  ? "bg-fuchsia-500/20 text-fuchsia-400 font-semibold"
                  : "text-[var(--muted-foreground)]"
              }`}
            >
              <Globe className="w-3 h-3" /> Live Preview
            </button>
            <button
              onClick={() => setShowPreview(false)}
              className={`rounded-lg px-3 py-1 text-xs transition-colors flex items-center gap-1.5 ${
                !showPreview
                  ? "bg-white/10 text-fuchsia-400 font-semibold"
                  : "text-[var(--muted-foreground)]"
              }`}
            >
              <Code2 className="w-3 h-3" /> Source Code
            </button>
            {result && (
              <button
                onClick={copyResult}
                className="ml-auto rounded-lg px-2.5 py-1 text-xs text-[var(--muted-foreground)] hover:text-white transition-colors flex items-center gap-1"
              >
                <Copy className="w-3 h-3" /> {copied ? "Copied" : "Copy"}
              </button>
            )}
          </div>

          {/* Content */}
          <div className="flex-1 overflow-hidden relative">
            {showPreview ? (
              result ? (
                <iframe
                  ref={iframeRef}
                  className="w-full h-full bg-white"
                  sandbox="allow-scripts"
                  title="Prompt Preview"
                />
              ) : (
                <div className="flex items-center justify-center h-full text-[var(--muted-foreground)]">
                  <div className="text-center max-w-xs">
                    <div className="relative mx-auto w-16 h-16 mb-4">
                      <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-fuchsia-500/20 to-violet-500/20 animate-pulse" />
                      <FlaskConical className="absolute inset-0 m-auto w-8 h-8 text-fuchsia-400/40" />
                    </div>
                    <p className="text-sm font-medium mb-1">Prompt Engineering Lab</p>
                    <p className="text-xs text-[var(--muted-foreground)]">
                      Write a prompt describing a UI, then hit Generate to see it rendered live. Learn how prompt structure affects output quality.
                    </p>
                  </div>
                </div>
              )
            ) : (
              <div className="h-full overflow-y-auto p-4">
                {result ? (
                  <pre className="text-xs whitespace-pre-wrap font-mono text-[var(--foreground)]">
                    {result}
                  </pre>
                ) : (
                  <div className="flex items-center justify-center h-full text-[var(--muted-foreground)]">
                    <p className="text-sm">Generate a UI to see the source code</p>
                  </div>
                )}
              </div>
            )}

            {/* Streaming indicator */}
            {running && (
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 rounded-full bg-fuchsia-500/20 border border-fuchsia-500/30 px-4 py-2 flex items-center gap-2 backdrop-blur-sm">
                <Loader2 className="w-3.5 h-3.5 animate-spin text-fuchsia-400" />
                <span className="text-xs text-fuchsia-400 font-medium">Generating UI...</span>
              </div>
            )}
          </div>
        </div>

        {/* History sidebar */}
        <AnimatePresence>
          {showHistory && (
            <motion.div
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: 240, opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              className="border-l border-white/[0.06] overflow-hidden"
            >
              <div className="w-60 h-full flex flex-col">
                <div className="px-3 py-2 border-b border-white/[0.06]">
                  <span className="text-xs font-semibold">Run History</span>
                </div>
                <div className="flex-1 overflow-y-auto p-2 space-y-1">
                  {history.map((run) => (
                    <button
                      key={run.id}
                      onClick={() => loadFromHistory(run)}
                      className="w-full text-left rounded-lg px-3 py-2 hover:bg-white/[0.06] transition-colors"
                    >
                      <p className="text-xs truncate">{run.prompt}</p>
                      <p className="text-[10px] text-[var(--muted-foreground)] mt-0.5">
                        {new Date(run.timestamp).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
