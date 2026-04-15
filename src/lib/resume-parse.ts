// Resume parsing — PDF (pdf-parse) + DOCX (mammoth) + TXT passthrough.
// Spec: CollegeVCareers.md SP-16.

export type ResumeFileType = "pdf" | "docx" | "txt";

export function detectResumeType(filename: string, contentType?: string): ResumeFileType | null {
  const lower = filename.toLowerCase();
  if (lower.endsWith(".pdf") || contentType === "application/pdf") return "pdf";
  if (lower.endsWith(".docx") || contentType === "application/vnd.openxmlformats-officedocument.wordprocessingml.document") return "docx";
  if (lower.endsWith(".txt") || contentType === "text/plain") return "txt";
  return null;
}

export async function extractResumeText(buffer: Buffer, type: ResumeFileType): Promise<string> {
  if (type === "txt") return buffer.toString("utf-8");

  if (type === "pdf") {
    const { PDFParse } = await import("pdf-parse");
    const parser = new PDFParse({ data: new Uint8Array(buffer) });
    const result = await parser.getText();
    return result.text || "";
  }

  if (type === "docx") {
    const mammoth = await import("mammoth");
    const result = await mammoth.extractRawText({ buffer });
    return result.value || "";
  }

  throw new Error(`Unsupported type: ${type}`);
}

/**
 * Heuristic section-splitter. Not perfect — the goal is to give the LLM
 * some structure to work with, not to be an authoritative parser.
 * The LLM critique/rewrite routes get raw text anyway; this JSON is for UI display.
 */
export function splitResumeSections(rawText: string): Record<string, string> {
  const text = rawText.replace(/\r\n/g, "\n").trim();
  const sections: Record<string, string> = {};

  const headings = [
    { key: "summary", patterns: [/^\s*(summary|profile|objective|about)\s*:?\s*$/im] },
    { key: "experience", patterns: [/^\s*(experience|work experience|professional experience|employment)\s*:?\s*$/im] },
    { key: "education", patterns: [/^\s*(education|academic background)\s*:?\s*$/im] },
    { key: "skills", patterns: [/^\s*(skills|technical skills|core competencies)\s*:?\s*$/im] },
    { key: "projects", patterns: [/^\s*(projects|personal projects|selected projects)\s*:?\s*$/im] },
    { key: "awards", patterns: [/^\s*(awards|honors|achievements)\s*:?\s*$/im] },
  ];

  const lines = text.split("\n");
  const markers: { key: string; line: number }[] = [];

  lines.forEach((line, i) => {
    for (const h of headings) {
      if (h.patterns.some((p) => p.test(line))) {
        markers.push({ key: h.key, line: i });
        break;
      }
    }
  });

  if (markers.length === 0) {
    sections.body = text;
    return sections;
  }

  markers.forEach((m, idx) => {
    const start = m.line + 1;
    const end = idx + 1 < markers.length ? markers[idx + 1].line : lines.length;
    sections[m.key] = lines.slice(start, end).join("\n").trim();
  });

  // Anything before the first marker = contact/header
  const head = lines.slice(0, markers[0].line).join("\n").trim();
  if (head) sections.contact = head;

  return sections;
}
