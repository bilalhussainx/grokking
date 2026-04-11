"use client";

import { useState, useCallback } from "react";
import { Play, Copy, Check, RotateCcw, Terminal } from "lucide-react";

interface CodePlaygroundProps {
  code: string;
  language?: string;
  title?: string;
  runnable?: boolean;
}

export default function CodePlayground({
  code,
  language = "javascript",
  title,
  runnable = true,
}: CodePlaygroundProps) {
  const [output, setOutput] = useState<string | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [copied, setCopied] = useState(false);
  const [editableCode, setEditableCode] = useState(code.trim());

  const handleRun = useCallback(() => {
    if (!runnable || language !== "javascript") return;
    setIsRunning(true);
    setOutput(null);

    // Capture console.log output
    const logs: string[] = [];
    const originalLog = console.log;
    const originalError = console.error;

    try {
      console.log = (...args) => {
        logs.push(args.map((a) => (typeof a === "object" ? JSON.stringify(a, null, 2) : String(a))).join(" "));
      };
      console.error = (...args) => {
        logs.push("Error: " + args.map((a) => String(a)).join(" "));
      };

      // eslint-disable-next-line no-new-func
      const fn = new Function(editableCode);
      const result = fn();
      if (result !== undefined && logs.length === 0) {
        logs.push(String(result));
      }
      setOutput(logs.join("\n") || "(no output)");
    } catch (err: any) {
      setOutput(`Error: ${err.message}`);
    } finally {
      console.log = originalLog;
      console.error = originalError;
      setIsRunning(false);
    }
  }, [editableCode, runnable, language]);

  const handleCopy = useCallback(async () => {
    await navigator.clipboard.writeText(editableCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [editableCode]);

  const handleReset = useCallback(() => {
    setEditableCode(code.trim());
    setOutput(null);
  }, [code]);

  return (
    <div className="my-6 rounded-xl border border-white/10 bg-black/40 overflow-hidden not-prose group">
      {/* Header bar */}
      <div className="flex items-center justify-between px-4 py-2 bg-white/[0.03] border-b border-white/10">
        <div className="flex items-center gap-2">
          {/* Dots */}
          <div className="flex gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-red-500/60" />
            <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/60" />
            <div className="w-2.5 h-2.5 rounded-full bg-green-500/60" />
          </div>
          <span className="text-xs text-white/30 ml-2 font-mono">
            {title || language}
          </span>
        </div>
        <div className="flex items-center gap-1">
          {editableCode !== code.trim() && (
            <button
              onClick={handleReset}
              className="p-1.5 rounded-md text-white/30 hover:text-white/60 hover:bg-white/5 transition-colors"
              title="Reset code"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          )}
          <button
            onClick={handleCopy}
            className="p-1.5 rounded-md text-white/30 hover:text-white/60 hover:bg-white/5 transition-colors"
            title="Copy code"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
          </button>
          {runnable && language === "javascript" && (
            <button
              onClick={handleRun}
              disabled={isRunning}
              className="flex items-center gap-1 px-2.5 py-1 rounded-md bg-emerald-500/20 text-emerald-300 text-xs font-medium hover:bg-emerald-500/30 transition-colors disabled:opacity-50"
            >
              <Play className="w-3 h-3" />
              Run
            </button>
          )}
        </div>
      </div>

      {/* Code area */}
      <div className="relative">
        <textarea
          value={editableCode}
          onChange={(e) => setEditableCode(e.target.value)}
          spellCheck={false}
          className="w-full bg-transparent text-sm text-gray-100 font-mono p-4 resize-none focus:outline-none min-h-[120px] leading-relaxed"
          style={{ tabSize: 2 }}
          rows={Math.min(editableCode.split("\n").length + 1, 20)}
        />
      </div>

      {/* Output */}
      {output !== null && (
        <div className="border-t border-white/10 bg-black/30">
          <div className="flex items-center gap-1.5 px-4 py-1.5 border-b border-white/5">
            <Terminal className="w-3 h-3 text-white/30" />
            <span className="text-[10px] uppercase tracking-wider text-white/30 font-medium">Output</span>
          </div>
          <pre className="px-4 py-3 text-sm font-mono text-emerald-300/80 whitespace-pre-wrap max-h-40 overflow-auto">
            {output}
          </pre>
        </div>
      )}
    </div>
  );
}
