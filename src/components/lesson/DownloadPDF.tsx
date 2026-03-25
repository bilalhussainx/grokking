"use client";

import { FileDown } from "lucide-react";

interface DownloadPDFProps {
  lessonContent: string;
  lessonTitle: string;
  courseTitle: string;
  moduleTitle: string;
}

export default function DownloadPDF({ lessonContent, lessonTitle, courseTitle, moduleTitle }: DownloadPDFProps) {

  const handleDownload = () => {
    // Convert markdown to simple HTML for print
    let html = lessonContent
      // Strip voice comments
      .replace(/<!--\s*voice:[\s\S]*?-->/g, "")
      // Headers
      .replace(/^### (.*$)/gm, '<h3>$1</h3>')
      .replace(/^## (.*$)/gm, '<h2>$1</h2>')
      .replace(/^# (.*$)/gm, '<h1>$1</h1>')
      // Bold and italic
      .replace(/\*\*\*(.*?)\*\*\*/g, '<strong><em>$1</em></strong>')
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      // Code blocks
      .replace(/```(\w*)\n([\s\S]*?)```/g, '<pre><code>$2</code></pre>')
      // Inline code
      .replace(/`([^`]+)`/g, '<code class="inline">$1</code>')
      // Lists
      .replace(/^- (.*$)/gm, '<li>$1</li>')
      .replace(/^(\d+)\. (.*$)/gm, '<li>$2</li>')
      // Paragraphs (double newlines)
      .replace(/\n\n/g, '</p><p>')
      // Single newlines in context
      .replace(/\n/g, '<br/>');

    html = `<p>${html}</p>`;

    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    printWindow.document.write(`<!DOCTYPE html>
<html>
<head>
  <title>${lessonTitle} — ${courseTitle}</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      line-height: 1.7;
      color: #1a1a1a;
      max-width: 800px;
      margin: 0 auto;
      padding: 40px 30px;
      font-size: 14px;
    }
    .header {
      border-bottom: 2px solid #e5e7eb;
      padding-bottom: 16px;
      margin-bottom: 24px;
    }
    .header .course { color: #6b7280; font-size: 12px; text-transform: uppercase; letter-spacing: 0.05em; }
    .header .module { color: #9ca3af; font-size: 11px; margin-top: 4px; }
    h1 { font-size: 24px; margin: 0 0 8px; color: #111; }
    h2 { font-size: 18px; margin: 24px 0 12px; color: #111; border-bottom: 1px solid #e5e7eb; padding-bottom: 6px; }
    h3 { font-size: 15px; margin: 20px 0 8px; color: #333; }
    p { margin: 8px 0; }
    strong { font-weight: 600; }
    pre {
      background: #f3f4f6;
      border: 1px solid #e5e7eb;
      border-radius: 8px;
      padding: 16px;
      overflow-x: auto;
      margin: 16px 0;
      page-break-inside: avoid;
    }
    pre code {
      font-family: 'JetBrains Mono', 'Fira Code', monospace;
      font-size: 12px;
      line-height: 1.5;
      color: #1f2937;
    }
    code.inline {
      background: #f3f4f6;
      padding: 2px 6px;
      border-radius: 4px;
      font-family: 'JetBrains Mono', monospace;
      font-size: 13px;
      color: #2563eb;
    }
    li { margin: 4px 0 4px 24px; }
    .footer {
      margin-top: 40px;
      padding-top: 16px;
      border-top: 1px solid #e5e7eb;
      color: #9ca3af;
      font-size: 11px;
      text-align: center;
    }
    @media print {
      body { padding: 20px; }
      pre { break-inside: avoid; }
    }
  </style>
</head>
<body>
  <div class="header">
    <div class="course">${courseTitle}</div>
    <div class="module">${moduleTitle}</div>
    <h1>${lessonTitle}</h1>
  </div>
  <div class="content">${html}</div>
  <div class="footer">Generated from Kairos.ai — AI-powered learning platform</div>
  <script>setTimeout(() => window.print(), 500);</script>
</body>
</html>`);
    printWindow.document.close();
  };

  return (
    <button
      onClick={handleDownload}
      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[var(--border)] text-[var(--muted-foreground)] text-xs hover:bg-[var(--card-hover)] hover:text-[var(--foreground)] transition-all"
      title="Download lesson as PDF"
    >
      <FileDown className="w-3.5 h-3.5" />
      <span className="hidden sm:inline">PDF</span>
    </button>
  );
}
