"use client";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import Highlight from "@tiptap/extension-highlight";
import { useEffect } from "react";
import { Bold, Italic, Strikethrough, Code, Heading1, Heading2, List, ListOrdered, Quote, Highlighter, Undo, Redo } from "lucide-react";

interface Props { content?: Record<string, unknown>; onUpdate?: (content: Record<string, unknown>, plainText: string) => void; placeholder?: string; editable?: boolean }

export default function TipTapEditor({ content, onUpdate, placeholder = "Start writing...", editable = true }: Props) {
  const editor = useEditor({
    extensions: [StarterKit.configure({ heading: { levels: [1, 2, 3] } }), Placeholder.configure({ placeholder }), Highlight.configure({ multicolor: true })],
    content: content || { type: "doc", content: [{ type: "paragraph" }] },
    editable,
    editorProps: { attributes: { class: "prose prose-invert prose-sm max-w-none focus:outline-none min-h-[400px] px-6 py-4" } },
    onUpdate: ({ editor }) => { onUpdate?.(editor.getJSON(), editor.getText()); },
  });

  useEffect(() => { if (editor && content && JSON.stringify(editor.getJSON()) !== JSON.stringify(content)) editor.commands.setContent(content); }, [content, editor]);

  if (!editor) return null;

  const Btn = ({ onClick, active, children, title }: { onClick: () => void; active?: boolean; children: React.ReactNode; title: string }) => (
    <button onClick={onClick} title={title} className={`rounded-md p-1.5 transition-colors ${active ? "bg-blue-500/20 text-blue-400" : "text-[var(--muted-foreground)] hover:text-white hover:bg-white/10"}`}>{children}</button>
  );

  return (
    <div className="flex flex-col h-full">
      {editable && (
        <div className="flex items-center gap-0.5 px-4 py-2 border-b border-white/[0.06] flex-wrap">
          <Btn onClick={() => editor.chain().focus().toggleBold().run()} active={editor.isActive("bold")} title="Bold"><Bold className="w-3.5 h-3.5" /></Btn>
          <Btn onClick={() => editor.chain().focus().toggleItalic().run()} active={editor.isActive("italic")} title="Italic"><Italic className="w-3.5 h-3.5" /></Btn>
          <Btn onClick={() => editor.chain().focus().toggleStrike().run()} active={editor.isActive("strike")} title="Strike"><Strikethrough className="w-3.5 h-3.5" /></Btn>
          <Btn onClick={() => editor.chain().focus().toggleCode().run()} active={editor.isActive("code")} title="Code"><Code className="w-3.5 h-3.5" /></Btn>
          <div className="w-px h-4 bg-white/10 mx-1" />
          <Btn onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()} active={editor.isActive("heading", { level: 1 })} title="H1"><Heading1 className="w-3.5 h-3.5" /></Btn>
          <Btn onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} active={editor.isActive("heading", { level: 2 })} title="H2"><Heading2 className="w-3.5 h-3.5" /></Btn>
          <div className="w-px h-4 bg-white/10 mx-1" />
          <Btn onClick={() => editor.chain().focus().toggleBulletList().run()} active={editor.isActive("bulletList")} title="Bullets"><List className="w-3.5 h-3.5" /></Btn>
          <Btn onClick={() => editor.chain().focus().toggleOrderedList().run()} active={editor.isActive("orderedList")} title="Numbers"><ListOrdered className="w-3.5 h-3.5" /></Btn>
          <Btn onClick={() => editor.chain().focus().toggleBlockquote().run()} active={editor.isActive("blockquote")} title="Quote"><Quote className="w-3.5 h-3.5" /></Btn>
          <Btn onClick={() => editor.chain().focus().toggleHighlight().run()} active={editor.isActive("highlight")} title="Highlight"><Highlighter className="w-3.5 h-3.5" /></Btn>
          <div className="ml-auto flex items-center gap-0.5">
            <Btn onClick={() => editor.chain().focus().undo().run()} title="Undo"><Undo className="w-3.5 h-3.5" /></Btn>
            <Btn onClick={() => editor.chain().focus().redo().run()} title="Redo"><Redo className="w-3.5 h-3.5" /></Btn>
          </div>
        </div>
      )}
      <div className="flex-1 overflow-y-auto"><EditorContent editor={editor} /></div>
    </div>
  );
}
