"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import Editor from "@monaco-editor/react";
import { Play, Loader2, Trash2 } from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";

interface InterviewEditorProps {
  onCodeChange: (code: string) => void;
  onOutputChange: (output: string) => void;
}

const DEFAULT_CODE = `# Write your solution here\n\ndef solution():\n    pass\n`;

export default function InterviewEditor({ onCodeChange, onOutputChange }: InterviewEditorProps) {
  const { isDark } = useTheme();
  const [code, setCode] = useState(DEFAULT_CODE);
  const [output, setOutput] = useState("");
  const [running, setRunning] = useState(false);
  const [pyodideReady, setPyodideReady] = useState(false);
  const [pyodideLoading, setPyodideLoading] = useState(true);
  const pyodideRef = useRef<any>(null);

  useEffect(() => {
    let cancelled = false;

    async function loadPyodide() {
      try {
        // @ts-expect-error — pyodide loaded from CDN
        const pyodide = await window.loadPyodide({
          indexURL: "https://cdn.jsdelivr.net/pyodide/v0.24.1/full/",
        });
        if (!cancelled) {
          pyodideRef.current = pyodide;
          setPyodideReady(true);
          setPyodideLoading(false);
        }
      } catch (err) {
        console.error("[Pyodide] Failed to load:", err);
        if (!cancelled) setPyodideLoading(false);
      }
    }

    if (!document.querySelector('script[src*="pyodide"]')) {
      const script = document.createElement("script");
      script.src = "https://cdn.jsdelivr.net/pyodide/v0.24.1/full/pyodide.js";
      script.onload = () => loadPyodide();
      script.onerror = () => setPyodideLoading(false);
      document.head.appendChild(script);
    } else {
      loadPyodide();
    }

    return () => { cancelled = true; };
  }, []);

  const handleCodeChange = useCallback(
    (value: string | undefined) => {
      const newCode = value || "";
      setCode(newCode);
      onCodeChange(newCode);
    },
    [onCodeChange]
  );

  const runCode = useCallback(async () => {
    if (!pyodideRef.current || running) return;
    setRunning(true);
    setOutput("");
    try {
      pyodideRef.current.runPython(`
import sys, io
sys.stdout = io.StringIO()
sys.stderr = io.StringIO()
`);
      pyodideRef.current.runPython(code);
      const stdout = pyodideRef.current.runPython("sys.stdout.getvalue()");
      const stderr = pyodideRef.current.runPython("sys.stderr.getvalue()");
      const result = (stdout || "") + (stderr ? `\nSTDERR:\n${stderr}` : "");
      setOutput(result || "(no output)");
      onOutputChange(result || "(no output)");
    } catch (err: any) {
      const errMsg = err?.message || String(err);
      setOutput(`Error:\n${errMsg}`);
      onOutputChange(`Error:\n${errMsg}`);
    } finally {
      setRunning(false);
    }
  }, [code, running, onOutputChange]);

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 min-h-0 border border-white/[0.06] rounded-t-xl overflow-hidden">
        <Editor
          height="100%"
          language="python"
          theme={isDark ? "vs-dark" : "light"}
          value={code}
          onChange={handleCodeChange}
          options={{
            fontSize: 13,
            minimap: { enabled: false },
            scrollBeyondLastLine: false,
            padding: { top: 12 },
            lineNumbers: "on",
            renderLineHighlight: "gutter",
            tabSize: 4,
          }}
        />
      </div>

      <div className="h-[30%] min-h-[120px] border border-t-0 border-white/[0.06] rounded-b-xl bg-black/40 flex flex-col">
        <div className="flex items-center justify-between px-3 py-1.5 border-b border-white/[0.06]">
          <span className="text-[11px] text-white/30 font-medium uppercase tracking-wider">Output</span>
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => { setOutput(""); onOutputChange(""); }}
              className="p-1 rounded text-white/20 hover:text-white/50 transition-colors"
              title="Clear output"
            >
              <Trash2 className="w-3 h-3" />
            </button>
            <button
              onClick={runCode}
              disabled={!pyodideReady || running}
              className="flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-semibold transition-all disabled:opacity-30 bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30 border border-emerald-500/20"
            >
              {running ? <Loader2 className="w-3 h-3 animate-spin" /> : <Play className="w-3 h-3" />}
              {pyodideLoading ? "Loading..." : running ? "Running..." : "Run"}
            </button>
          </div>
        </div>
        <pre className="flex-1 p-3 text-xs text-white/60 font-mono overflow-auto whitespace-pre-wrap">
          {output || (pyodideLoading ? "Loading Python runtime..." : "Click Run to execute your code")}
        </pre>
      </div>
    </div>
  );
}
