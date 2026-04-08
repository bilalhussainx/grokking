"use client";

import { useEffect, useRef, useState, useCallback } from 'react';
import {
  ChevronRight,
  ChevronDown,
  FileCode,
  Folder,
  FolderOpen,
  RefreshCw,
} from 'lucide-react';

interface FileEntry {
  path: string;
  type: 'file' | 'directory';
}

interface TreeNode {
  name: string;
  path: string;
  type: 'file' | 'directory';
  children: Map<string, TreeNode>;
  expanded: boolean;
}

interface ArenaFileTreeProps {
  sandboxId: string;
  onFileSelect: (path: string) => void;
  selectedPath?: string;
}

function buildTree(files: FileEntry[]): Map<string, TreeNode> {
  const root = new Map<string, TreeNode>();

  for (const file of files) {
    const parts = file.path.split('/').filter(Boolean);
    let current = root;
    let cumulativePath = '';

    for (let i = 0; i < parts.length; i++) {
      const part = parts[i];
      cumulativePath = cumulativePath ? `${cumulativePath}/${part}` : part;
      const isLast = i === parts.length - 1;

      if (!current.has(part)) {
        current.set(part, {
          name: part,
          path: cumulativePath,
          type: isLast ? file.type : 'directory',
          children: new Map(),
          // Expand first level by default
          expanded: i === 0,
        });
      }

      const node = current.get(part)!;
      current = node.children;
    }
  }

  return root;
}

function toggleExpand(tree: Map<string, TreeNode>, targetPath: string): Map<string, TreeNode> {
  // Deep-clone via JSON round-trip (TreeNode values are plain-ish, Map needs special handling)
  const cloneMap = (m: Map<string, TreeNode>): Map<string, TreeNode> => {
    const out = new Map<string, TreeNode>();
    for (const [k, v] of m) {
      out.set(k, {
        name: v.name,
        path: v.path,
        type: v.type,
        expanded: v.expanded,
        children: cloneMap(v.children),
      });
    }
    return out;
  };

  const cloned = cloneMap(tree);

  const findAndFlip = (m: Map<string, TreeNode>): boolean => {
    for (const node of m.values()) {
      if (node.path === targetPath) {
        node.expanded = !node.expanded;
        return true;
      }
      if (findAndFlip(node.children)) return true;
    }
    return false;
  };

  findAndFlip(cloned);
  return cloned;
}

function TreeNodeView({
  node,
  onFileSelect,
  selectedPath,
  onToggle,
  depth,
}: {
  node: TreeNode;
  onFileSelect: (path: string) => void;
  selectedPath?: string;
  onToggle: (path: string) => void;
  depth: number;
}) {
  const isSelected = node.path === selectedPath;
  const isDir = node.type === 'directory' || node.children.size > 0;

  const handleClick = () => {
    if (isDir) {
      onToggle(node.path);
    } else {
      onFileSelect(node.path);
    }
  };

  return (
    <div>
      <button
        onClick={handleClick}
        className={[
          'flex w-full items-center gap-1 rounded px-2 py-[3px] text-left text-xs transition-colors',
          isSelected
            ? 'bg-violet-500/20 text-violet-300'
            : 'text-white/50 hover:bg-white/5 hover:text-white/80',
        ].join(' ')}
        style={{ paddingLeft: `${8 + depth * 12}px` }}
      >
        {isDir ? (
          node.expanded ? (
            <ChevronDown className="h-3 w-3 shrink-0 text-white/30" />
          ) : (
            <ChevronRight className="h-3 w-3 shrink-0 text-white/30" />
          )
        ) : (
          <span className="w-3" />
        )}
        {isDir ? (
          node.expanded ? (
            <FolderOpen className="h-3.5 w-3.5 shrink-0 text-violet-400/70" />
          ) : (
            <Folder className="h-3.5 w-3.5 shrink-0 text-violet-400/70" />
          )
        ) : (
          <FileCode className="h-3.5 w-3.5 shrink-0 text-sky-400/70" />
        )}
        <span className="truncate">{node.name}</span>
      </button>

      {isDir && node.expanded && (
        <div>
          {[...node.children.values()].map(child => (
            <TreeNodeView
              key={child.path}
              node={child}
              onFileSelect={onFileSelect}
              selectedPath={selectedPath}
              onToggle={onToggle}
              depth={depth + 1}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export function ArenaFileTree({ sandboxId, onFileSelect, selectedPath }: ArenaFileTreeProps) {
  const [tree, setTree] = useState<Map<string, TreeNode>>(new Map());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const inFlightRef = useRef(false);
  const abortRef = useRef<AbortController | null>(null);

  const refresh = useCallback(async () => {
    // Skip if a fetch is already in progress — prevents request stacking
    if (inFlightRef.current) return;
    inFlightRef.current = true;

    const controller = new AbortController();
    abortRef.current = controller;
    setLoading(true);

    try {
      const res = await fetch(
        `/api/arena/files?sandboxId=${encodeURIComponent(sandboxId)}`,
        { signal: controller.signal }
      );
      if (controller.signal.aborted) return;

      if (!res.ok) {
        const json = await res.json().catch(() => ({}));
        if (controller.signal.aborted) return;
        setError(json.error ?? 'Failed to load files');
        return;
      }

      const json: { files: FileEntry[] } = await res.json();
      if (controller.signal.aborted) return;
      setTree(buildTree(json.files ?? []));
      setError(null);
    } catch (err) {
      if ((err as Error).name !== 'AbortError') {
        setError('Network error');
      }
    } finally {
      inFlightRef.current = false;
      setLoading(false);
    }
  }, [sandboxId]);

  // Initial load + 3-second polling; abort on unmount or sandboxId change
  useEffect(() => {
    refresh();
    const interval = setInterval(refresh, 3000);
    return () => {
      clearInterval(interval);
      abortRef.current?.abort();
    };
  }, [refresh]);

  const handleToggle = useCallback((path: string) => {
    setTree(prev => toggleExpand(prev, path));
  }, []);

  return (
    <div className="flex h-full flex-col border-r border-white/[0.06] bg-slate-950/50">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-white/[0.06] px-3 py-2">
        <span className="text-[10px] font-semibold uppercase tracking-wider text-white/30">
          Files
        </span>
        <button
          onClick={() => { setLoading(true); refresh(); }}
          className="rounded p-0.5 text-white/30 transition-colors hover:bg-white/5 hover:text-white/60"
          title="Refresh"
        >
          <RefreshCw className={`h-3 w-3 ${loading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {/* Tree */}
      <div className="flex-1 overflow-y-auto py-1">
        {error ? (
          <p className="px-3 py-2 text-xs text-red-400/70">{error}</p>
        ) : loading && tree.size === 0 ? (
          <p className="px-3 py-2 text-xs text-white/30">Loading…</p>
        ) : tree.size === 0 ? (
          <p className="px-3 py-2 text-xs text-white/30">No files yet</p>
        ) : (
          [...tree.values()].map(node => (
            <TreeNodeView
              key={node.path}
              node={node}
              onFileSelect={onFileSelect}
              selectedPath={selectedPath}
              onToggle={handleToggle}
              depth={0}
            />
          ))
        )}
      </div>
    </div>
  );
}
