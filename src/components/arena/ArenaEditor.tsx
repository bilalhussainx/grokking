"use client";

import { useEffect, useRef, useState, useCallback } from 'react';
import MonacoEditor, { OnMount } from '@monaco-editor/react';
import { X } from 'lucide-react';

interface Tab {
  path: string;
  content: string;
  dirty: boolean;
}

interface ArenaEditorProps {
  sandboxId: string;
  roomId: string;
  openFilePath?: string;
  onFileOpened?: (path: string, content: string) => void;
  'data-testid'?: string;
}

function getLanguage(path: string): string {
  const ext = path.split('.').pop()?.toLowerCase() ?? '';
  const map: Record<string, string> = {
    ts: 'typescript',
    tsx: 'typescriptreact',
    js: 'javascript',
    jsx: 'javascriptreact',
    py: 'python',
    json: 'json',
    md: 'markdown',
    sql: 'sql',
    css: 'css',
    html: 'html',
    sh: 'shell',
  };
  return map[ext] ?? 'plaintext';
}

function shortName(path: string): string {
  return path.split('/').pop() ?? path;
}

export function ArenaEditor({
  sandboxId,
  roomId,
  openFilePath,
  onFileOpened,
  'data-testid': testId,
}: ArenaEditorProps) {
  const [tabs, setTabs] = useState<Tab[]>([]);
  const [activeIndex, setActiveIndex] = useState<number>(-1);
  const loadedPaths = useRef<Set<string>>(new Set());
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const editorRef = useRef<any>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const monacoRef = useRef<any>(null);

  const openFile = useCallback(async (path: string) => {
    if (loadedPaths.current.has(path)) {
      // Switch to existing tab
      setTabs(prev => {
        const idx = prev.findIndex(t => t.path === path);
        if (idx !== -1) setActiveIndex(idx);
        return prev;
      });
      return;
    }

    try {
      const res = await fetch(
        `/api/arena/files?sandboxId=${encodeURIComponent(sandboxId)}&path=${encodeURIComponent(path)}`
      );
      if (!res.ok) return;
      const { content } = await res.json();
      loadedPaths.current.add(path);

      setTabs(prev => {
        const existing = prev.findIndex(t => t.path === path);
        if (existing !== -1) {
          setActiveIndex(existing);
          return prev;
        }
        const next = [...prev, { path, content: content ?? '', dirty: false }];
        setActiveIndex(next.length - 1);
        return next;
      });

      onFileOpened?.(path, content ?? '');
    } catch {
      // silently ignore fetch errors
    }
  }, [sandboxId, onFileOpened]);

  // Open file when openFilePath prop changes — use effect to avoid side-effects during render.
  // openFile handles both cases: not-yet-loaded (fetch) and already-loaded (switch tab).
  // The setState calls inside openFile are async (post-fetch), so no cascading renders.
  useEffect(() => {
    if (openFilePath) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      openFile(openFilePath);
    }
  }, [openFilePath, openFile]);

  const saveActiveTab = useCallback(async () => {
    if (activeIndex < 0 || activeIndex >= tabs.length) return;
    const tab = tabs[activeIndex];
    if (!tab) return;

    try {
      const res = await fetch('/api/arena/files', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sandboxId,
          path: tab.path,
          content: tab.content,
          roomId,
        }),
      });
      if (res.ok) {
        setTabs(prev =>
          prev.map((t, i) => (i === activeIndex ? { ...t, dirty: false } : t))
        );
      }
    } catch {
      // silently ignore
    }
  }, [activeIndex, tabs, sandboxId, roomId]);

  const handleEditorMount: OnMount = useCallback((editor, monaco) => {
    editorRef.current = editor;
    monacoRef.current = monaco;

    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyS, () => {
      saveActiveTab();
    });
  }, [saveActiveTab]);

  const handleEditorChange = useCallback((value: string | undefined) => {
    if (activeIndex < 0) return;
    setTabs(prev =>
      prev.map((t, i) =>
        i === activeIndex ? { ...t, content: value ?? '', dirty: true } : t
      )
    );
  }, [activeIndex]);

  const closeTab = useCallback((index: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setTabs(prev => {
      const tab = prev[index];
      if (tab) loadedPaths.current.delete(tab.path);
      const next = prev.filter((_, i) => i !== index);
      setActiveIndex(idx => {
        if (next.length === 0) return -1;
        if (idx >= next.length) return next.length - 1;
        if (idx > index) return idx - 1;
        return idx;
      });
      return next;
    });
  }, []);

  const activeTab = tabs[activeIndex] ?? null;

  return (
    <div
      data-testid={testId ?? 'arena-editor-tabs'}
      className="flex h-full flex-col bg-[#1e1e2e]"
    >
      {/* Tab bar */}
      <div className="flex items-center justify-between border-b border-white/[0.06] bg-slate-900/60">
        <div className="flex min-w-0 flex-1 items-center overflow-x-auto">
          {tabs.length === 0 ? (
            <span className="px-4 py-2 text-xs text-white/20">No file open</span>
          ) : (
            tabs.map((tab, i) => (
              <button
                key={tab.path}
                onClick={() => setActiveIndex(i)}
                className={[
                  'group flex shrink-0 items-center gap-1.5 border-r border-white/[0.06] px-3 py-2 text-xs transition-colors',
                  i === activeIndex
                    ? 'bg-[#1e1e2e] text-white/90'
                    : 'text-white/40 hover:bg-white/5 hover:text-white/70',
                ].join(' ')}
              >
                {tab.dirty && (
                  <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-violet-400" />
                )}
                <span className="max-w-[120px] truncate">{shortName(tab.path)}</span>
                <span
                  role="button"
                  onClick={e => closeTab(i, e)}
                  className="ml-0.5 rounded p-0.5 text-white/0 transition-colors group-hover:text-white/40 hover:!text-white/80 hover:bg-white/10"
                >
                  <X className="h-3 w-3" />
                </span>
              </button>
            ))
          )}
        </div>

        {/* Save button */}
        {activeTab && activeTab.dirty && (
          <button
            onClick={saveActiveTab}
            className="shrink-0 px-3 py-1.5 text-xs text-violet-300 transition-colors hover:text-violet-200"
          >
            Save
          </button>
        )}
      </div>

      {/* Editor */}
      <div className="flex-1 overflow-hidden">
        {activeTab ? (
          <MonacoEditor
            height="100%"
            language={getLanguage(activeTab.path)}
            value={activeTab.content}
            theme="vs-dark"
            options={{
              fontSize: 13,
              minimap: { enabled: false },
              wordWrap: 'on',
              padding: { top: 8 },
              renderLineHighlight: 'gutter',
              scrollBeyondLastLine: false,
              automaticLayout: true,
            }}
            onChange={handleEditorChange}
            onMount={handleEditorMount}
          />
        ) : (
          <div className="flex h-full items-center justify-center">
            <p className="text-sm text-white/20">Select a file to open</p>
          </div>
        )}
      </div>
    </div>
  );
}
