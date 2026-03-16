"use client";

import dynamic from "next/dynamic";
import { useTheme } from "@/contexts/ThemeContext";

const MonacoEditor = dynamic(() => import("@monaco-editor/react"), {
  ssr: false,
});

interface CodeEditorProps {
  code: string;
  onChange: (value: string) => void;
  language?: string;
  readOnly?: boolean;
  height?: string;
}

export default function CodeEditor({
  code,
  onChange,
  language = "python",
  readOnly = false,
  height = "100%",
}: CodeEditorProps) {
  const { isDark } = useTheme();

  return (
    <MonacoEditor
      height={height}
      language={language}
      theme={isDark ? "vs-dark" : "light"}
      value={code}
      onChange={(value) => onChange(value ?? "")}
      options={{
        minimap: { enabled: false },
        fontSize: 14,
        lineNumbers: "on",
        scrollBeyondLastLine: false,
        automaticLayout: true,
        tabSize: 4,
        wordWrap: "on",
        padding: { top: 12 },
        readOnly,
      }}
    />
  );
}
