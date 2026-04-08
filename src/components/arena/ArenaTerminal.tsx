"use client";

import { useEffect, useRef } from 'react';

interface ArenaTerminalProps {
  sandboxId: string;
  roomId: string;
  onOutput?: (output: string) => void;
}

export function ArenaTerminal({ sandboxId, roomId, onOutput }: ArenaTerminalProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    let disposed = false;

    // Dynamically import xterm to avoid SSR issues
    Promise.all([
      import('xterm'),
      import('xterm-addon-fit'),
      import('xterm/css/xterm.css'),
    ]).then(([{ Terminal }, { FitAddon }]) => {
      if (disposed || !containerRef.current) return;

      const term = new Terminal({
        theme: {
          background: '#0a0a0f',
          foreground: '#e2e8f0',
          cursor: '#7c3aed',
          selectionBackground: '#7c3aed44',
        },
        fontSize: 12,
        fontFamily: 'JetBrains Mono, Fira Code, monospace',
        cursorBlink: true,
        convertEol: true,
      });

      const fit = new FitAddon();
      term.loadAddon(fit);
      term.open(containerRef.current);
      fit.fit();

      const handleResize = () => fit.fit();
      window.addEventListener('resize', handleResize);

      term.write('\x1b[32m● Arena terminal (POST relay — no interactive TTY)\x1b[0m\r\n$ ');

      const inputBuffer = { current: '' };

      const runCommand = async (command: string) => {
        try {
          const res = await fetch('/api/arena/terminal', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ roomId, sandboxId, command }),
          });

          if (!res.ok) {
            let errorMsg = 'request failed';
            try {
              const errJson = await res.json();
              errorMsg = errJson.error ?? errorMsg;
            } catch {
              // ignore parse error
            }
            term.write('\x1b[31m' + errorMsg + '\x1b[0m\r\n');
            onOutput?.('');
            return;
          }

          const { stdout, stderr, exitCode } = await res.json() as {
            stdout: string;
            stderr: string;
            exitCode: number;
          };

          if (stdout) term.write(stdout);
          if (stderr) term.write('\x1b[31m' + stderr + '\x1b[0m');
          if (exitCode !== 0) {
            term.write(`\x1b[33m[exit ${exitCode}]\x1b[0m\r\n`);
          }

          onOutput?.((stdout ?? '') + (stderr ?? ''));
        } catch {
          term.write('\x1b[31m● network error\x1b[0m\r\n');
          onOutput?.('');
        }
      };

      term.onKey(({ key, domEvent }) => {
        const ev = domEvent as KeyboardEvent;

        if (ev.key === 'Enter') {
          const cmd = inputBuffer.current;
          inputBuffer.current = '';
          term.write('\r\n');
          if (cmd.trim()) {
            runCommand(cmd).finally(() => {
              if (!disposed) term.write('$ ');
            });
          } else {
            term.write('$ ');
          }
        } else if (ev.key === 'Backspace') {
          if (inputBuffer.current.length > 0) {
            inputBuffer.current = inputBuffer.current.slice(0, -1);
            term.write('\b \b');
          }
        } else if (!ev.ctrlKey && !ev.altKey && !ev.metaKey) {
          inputBuffer.current += key;
          term.write(key);
        }
      });

      return () => {
        disposed = true;
        window.removeEventListener('resize', handleResize);
        term.dispose();
      };
    }).catch(() => {
      // xterm load failure — silently ignore in environments without it
    });

    return () => {
      disposed = true;
    };
  // Re-create terminal if sandboxId or roomId changes
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sandboxId, roomId]);

  return (
    <div className="h-full bg-[#0a0a0f] p-1">
      <div ref={containerRef} className="h-full" />
    </div>
  );
}
