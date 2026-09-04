import React, { useState, useRef, useEffect } from "react";
import { Editor } from "@tiptap/react";
import {
  Bold,
  Italic,
  Underline,
  Strikethrough,
  Subscript,
  Superscript,
  Heading1,
  Heading2,
  Heading3,
  Heading4,
  Pilcrow,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  List,
  ListOrdered,
  Quote,
  Minus,
  Code,
  Table as TableIcon,
  Image as ImageIcon,
  Link2,
  Video,
  Undo2,
  Redo2,
  RemoveFormatting,
  Maximize2,
  Minimize2,
  Palette,
  Highlighter,
  ChevronDown,
  Plus,
  Trash2,
  Merge,
  Split,
  TableProperties,
} from "lucide-react";

interface EditorToolbarProps {
  editor: Editor | null;
  isFullscreen: boolean;
  onToggleFullscreen: () => void;
  onOpenLinkModal: () => void;
  onOpenTableModal: () => void;
  onOpenImageModal: () => void;
  onOpenYoutubeModal: () => void;
}

const TEXT_COLORS = [
  { label: "Default (Ink)", color: "#0A0A0A" },
  { label: "Nothing Red", color: "#E53528" },
  { label: "Muted Gray", color: "#6B7280" },
  { label: "Dark Blue", color: "#1D4ED8" },
  { label: "Forest Green", color: "#15803D" },
  { label: "Amber Orange", color: "#B45309" },
  { label: "Purple", color: "#7E22CE" },
];

const HIGHLIGHT_COLORS = [
  { label: "None", color: "" },
  { label: "Yellow Tint", color: "#FEF08A" },
  { label: "Red Tint", color: "#FEE2E2" },
  { label: "Green Tint", color: "#DCFCE7" },
  { label: "Blue Tint", color: "#DBEAFE" },
  { label: "Purple Tint", color: "#F3E8FF" },
];

export const EditorToolbar: React.FC<EditorToolbarProps> = ({
  editor,
  isFullscreen,
  onToggleFullscreen,
  onOpenLinkModal,
  onOpenTableModal,
  onOpenImageModal,
  onOpenYoutubeModal,
}) => {
  const [headingDropdownOpen, setHeadingDropdownOpen] = useState(false);
  const [colorDropdownOpen, setColorDropdownOpen] = useState(false);
  const [highlightDropdownOpen, setHighlightDropdownOpen] = useState(false);
  const [tableDropdownOpen, setTableDropdownOpen] = useState(false);

  const headingRef = useRef<HTMLDivElement>(null);
  const colorRef = useRef<HTMLDivElement>(null);
  const highlightRef = useRef<HTMLDivElement>(null);
  const tableRef = useRef<HTMLDivElement>(null);

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (headingRef.current && !headingRef.current.contains(e.target as Node)) {
        setHeadingDropdownOpen(false);
      }
      if (colorRef.current && !colorRef.current.contains(e.target as Node)) {
        setColorDropdownOpen(false);
      }
      if (highlightRef.current && !highlightRef.current.contains(e.target as Node)) {
        setHighlightDropdownOpen(false);
      }
      if (tableRef.current && !tableRef.current.contains(e.target as Node)) {
        setTableDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (!editor) return null;

  const isTableActive = editor.isActive("table");

  // Determine current heading label
  let currentHeading = "Paragraph";
  if (editor.isActive("heading", { level: 1 })) currentHeading = "Heading 1";
  else if (editor.isActive("heading", { level: 2 })) currentHeading = "Heading 2";
  else if (editor.isActive("heading", { level: 3 })) currentHeading = "Heading 3";
  else if (editor.isActive("heading", { level: 4 })) currentHeading = "Heading 4";

  const btnClass = (isActive: boolean) =>
    `p-1.5 rounded-lg text-xs transition flex items-center justify-center cursor-pointer ${
      isActive
        ? "bg-neutral-900 text-white shadow-2xs"
        : "text-neutral-700 hover:bg-neutral-200/70 active:bg-neutral-300"
    }`;

  const divider = <span className="h-4 w-px bg-neutral-200 mx-0.5" />;

  return (
    <div className="flex flex-wrap items-center gap-1 p-2 bg-neutral-50/90 border-b border-neutral-200 select-none text-neutral-800">
      {/* 1. History Group */}
      <button
        type="button"
        onClick={() => editor.chain().focus().undo().run()}
        disabled={!editor.can().undo()}
        className={`${btnClass(false)} disabled:opacity-30 disabled:cursor-not-allowed`}
        title="Undo (Ctrl+Z)"
      >
        <Undo2 className="w-4 h-4" />
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().redo().run()}
        disabled={!editor.can().redo()}
        className={`${btnClass(false)} disabled:opacity-30 disabled:cursor-not-allowed`}
        title="Redo (Ctrl+Y)"
      >
        <Redo2 className="w-4 h-4" />
      </button>

      {divider}

      {/* 2. Headings Dropdown */}
      <div className="relative" ref={headingRef}>
        <button
          type="button"
          onClick={() => setHeadingDropdownOpen(!headingDropdownOpen)}
          className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-lg bg-white border border-neutral-200 hover:bg-neutral-100 transition shadow-2xs"
        >
          <span>{currentHeading}</span>
          <ChevronDown className="w-3.5 h-3.5 text-neutral-500" />
        </button>

        {headingDropdownOpen && (
          <div className="absolute left-0 top-full mt-1 w-44 bg-white rounded-xl shadow-lg border border-neutral-200 p-1 z-30 space-y-0.5 animate-fadeIn">
            <button
              type="button"
              onClick={() => {
                editor.chain().focus().setParagraph().run();
                setHeadingDropdownOpen(false);
              }}
              className={`w-full text-left px-2.5 py-1.5 text-xs rounded-lg flex items-center gap-2 ${
                editor.isActive("paragraph") ? "bg-neutral-100 font-bold" : "hover:bg-neutral-50 text-neutral-700"
              }`}
            >
              <Pilcrow className="w-3.5 h-3.5" /> Paragraph
            </button>
            <button
              type="button"
              onClick={() => {
                editor.chain().focus().toggleHeading({ level: 1 }).run();
                setHeadingDropdownOpen(false);
              }}
              className={`w-full text-left px-2.5 py-1.5 text-xs rounded-lg flex items-center gap-2 ${
                editor.isActive("heading", { level: 1 }) ? "bg-neutral-100 font-bold" : "hover:bg-neutral-50 text-neutral-700"
              }`}
            >
              <Heading1 className="w-3.5 h-3.5" /> Heading 1
            </button>
            <button
              type="button"
              onClick={() => {
                editor.chain().focus().toggleHeading({ level: 2 }).run();
                setHeadingDropdownOpen(false);
              }}
              className={`w-full text-left px-2.5 py-1.5 text-xs rounded-lg flex items-center gap-2 ${
                editor.isActive("heading", { level: 2 }) ? "bg-neutral-100 font-bold" : "hover:bg-neutral-50 text-neutral-700"
              }`}
            >
              <Heading2 className="w-3.5 h-3.5" /> Heading 2
            </button>
            <button
              type="button"
              onClick={() => {
                editor.chain().focus().toggleHeading({ level: 3 }).run();
                setHeadingDropdownOpen(false);
              }}
              className={`w-full text-left px-2.5 py-1.5 text-xs rounded-lg flex items-center gap-2 ${
                editor.isActive("heading", { level: 3 }) ? "bg-neutral-100 font-bold" : "hover:bg-neutral-50 text-neutral-700"
              }`}
            >
              <Heading3 className="w-3.5 h-3.5" /> Heading 3
            </button>
            <button
              type="button"
              onClick={() => {
                editor.chain().focus().toggleHeading({ level: 4 }).run();
                setHeadingDropdownOpen(false);
              }}
              className={`w-full text-left px-2.5 py-1.5 text-xs rounded-lg flex items-center gap-2 ${
                editor.isActive("heading", { level: 4 }) ? "bg-neutral-100 font-bold" : "hover:bg-neutral-50 text-neutral-700"
              }`}
            >
              <Heading4 className="w-3.5 h-3.5" /> Heading 4
            </button>
          </div>
        )}
      </div>

      {divider}

      {/* 3. Text Formatting Group */}
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleBold().run()}
        className={btnClass(editor.isActive("bold"))}
        title="Bold (Ctrl+B)"
      >
        <Bold className="w-4 h-4" />
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleItalic().run()}
        className={btnClass(editor.isActive("italic"))}
        title="Italic (Ctrl+I)"
      >
        <Italic className="w-4 h-4" />
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleUnderline().run()}
        className={btnClass(editor.isActive("underline"))}
        title="Underline (Ctrl+U)"
      >
        <Underline className="w-4 h-4" />
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleStrike().run()}
        className={btnClass(editor.isActive("strike"))}
        title="Strikethrough"
      >
        <Strikethrough className="w-4 h-4" />
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleSubscript().run()}
        className={btnClass(editor.isActive("subscript"))}
        title="Subscript"
      >
        <Subscript className="w-4 h-4" />
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleSuperscript().run()}
        className={btnClass(editor.isActive("superscript"))}
        title="Superscript"
      >
        <Superscript className="w-4 h-4" />
      </button>

      {/* Text Color Picker */}
      <div className="relative" ref={colorRef}>
        <button
          type="button"
          onClick={() => setColorDropdownOpen(!colorDropdownOpen)}
          className={btnClass(colorDropdownOpen)}
          title="Text Color"
        >
          <Palette className="w-4 h-4 text-red-600" />
        </button>
        {colorDropdownOpen && (
          <div className="absolute left-0 top-full mt-1 w-40 bg-white rounded-xl shadow-lg border border-neutral-200 p-2 z-30 space-y-1 animate-fadeIn">
            <span className="text-[10px] uppercase font-bold text-neutral-400 px-1">Text Color</span>
            {TEXT_COLORS.map((tc) => (
              <button
                key={tc.color}
                type="button"
                onClick={() => {
                  editor.chain().focus().setColor(tc.color).run();
                  setColorDropdownOpen(false);
                }}
                className="w-full text-left px-2 py-1 text-xs rounded-lg flex items-center gap-2 hover:bg-neutral-50"
              >
                <span className="w-3.5 h-3.5 rounded-full border border-neutral-300" style={{ backgroundColor: tc.color }} />
                <span className="text-neutral-700">{tc.label}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Highlight Background Picker */}
      <div className="relative" ref={highlightRef}>
        <button
          type="button"
          onClick={() => setHighlightDropdownOpen(!highlightDropdownOpen)}
          className={btnClass(editor.isActive("highlight"))}
          title="Highlight Text"
        >
          <Highlighter className="w-4 h-4 text-amber-500" />
        </button>
        {highlightDropdownOpen && (
          <div className="absolute left-0 top-full mt-1 w-40 bg-white rounded-xl shadow-lg border border-neutral-200 p-2 z-30 space-y-1 animate-fadeIn">
            <span className="text-[10px] uppercase font-bold text-neutral-400 px-1">Highlight</span>
            {HIGHLIGHT_COLORS.map((hc) => (
              <button
                key={hc.label}
                type="button"
                onClick={() => {
                  if (hc.color) {
                    editor.chain().focus().setHighlight({ color: hc.color }).run();
                  } else {
                    editor.chain().focus().unsetHighlight().run();
                  }
                  setHighlightDropdownOpen(false);
                }}
                className="w-full text-left px-2 py-1 text-xs rounded-lg flex items-center gap-2 hover:bg-neutral-50"
              >
                <span
                  className="w-3.5 h-3.5 rounded-full border border-neutral-300"
                  style={{ backgroundColor: hc.color || "#ffffff" }}
                />
                <span className="text-neutral-700">{hc.label}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      {divider}

      {/* 4. Alignment Group */}
      <button
        type="button"
        onClick={() => editor.chain().focus().setTextAlign("left").run()}
        className={btnClass(editor.isActive({ textAlign: "left" }))}
        title="Align Left"
      >
        <AlignLeft className="w-4 h-4" />
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().setTextAlign("center").run()}
        className={btnClass(editor.isActive({ textAlign: "center" }))}
        title="Align Center"
      >
        <AlignCenter className="w-4 h-4" />
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().setTextAlign("right").run()}
        className={btnClass(editor.isActive({ textAlign: "right" }))}
        title="Align Right"
      >
        <AlignRight className="w-4 h-4" />
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().setTextAlign("justify").run()}
        className={btnClass(editor.isActive({ textAlign: "justify" }))}
        title="Justify"
      >
        <AlignJustify className="w-4 h-4" />
      </button>

      {divider}

      {/* 5. Lists & Structural Elements */}
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        className={btnClass(editor.isActive("bulletList"))}
        title="Bullet List"
      >
        <List className="w-4 h-4" />
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        className={btnClass(editor.isActive("orderedList"))}
        title="Numbered List"
      >
        <ListOrdered className="w-4 h-4" />
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
        className={btnClass(editor.isActive("blockquote"))}
        title="Quote Block"
      >
        <Quote className="w-4 h-4" />
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().setHorizontalRule().run()}
        className={btnClass(false)}
        title="Horizontal Divider"
      >
        <Minus className="w-4 h-4" />
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleCodeBlock().run()}
        className={btnClass(editor.isActive("codeBlock"))}
        title="Code Block (Syntax Highlighted)"
      >
        <Code className="w-4 h-4" />
      </button>

      {divider}

      {/* 6. Tables Group (With Context Dropdown) */}
      <div className="relative" ref={tableRef}>
        <button
          type="button"
          onClick={() => {
            if (isTableActive) {
              setTableDropdownOpen(!tableDropdownOpen);
            } else {
              onOpenTableModal();
            }
          }}
          className={`px-2.5 py-1 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition ${
            isTableActive
              ? "bg-red-50 text-red-700 border border-red-200"
              : "bg-white hover:bg-neutral-100 text-neutral-700 border border-neutral-200 shadow-2xs"
          }`}
          title={isTableActive ? "Table Controls" : "Insert Table"}
        >
          <TableIcon className="w-3.5 h-3.5 text-red-600" />
          <span>Table</span>
          {isTableActive && <ChevronDown className="w-3 h-3 text-red-500" />}
        </button>

        {isTableActive && tableDropdownOpen && (
          <div className="absolute left-0 top-full mt-1 w-52 bg-white rounded-xl shadow-xl border border-neutral-200 p-1.5 z-40 space-y-0.5 animate-fadeIn">
            <span className="text-[10px] uppercase font-bold text-neutral-400 px-2 py-1 block">
              Table Operations
            </span>
            <button
              type="button"
              onClick={() => {
                editor.chain().focus().addRowBefore().run();
                setTableDropdownOpen(false);
              }}
              className="w-full text-left px-2 py-1 text-xs rounded-md hover:bg-neutral-100 flex items-center gap-2 text-neutral-700"
            >
              <Plus className="w-3 h-3 text-green-600" /> Add Row Above
            </button>
            <button
              type="button"
              onClick={() => {
                editor.chain().focus().addRowAfter().run();
                setTableDropdownOpen(false);
              }}
              className="w-full text-left px-2 py-1 text-xs rounded-md hover:bg-neutral-100 flex items-center gap-2 text-neutral-700"
            >
              <Plus className="w-3 h-3 text-green-600" /> Add Row Below
            </button>
            <button
              type="button"
              onClick={() => {
                editor.chain().focus().deleteRow().run();
                setTableDropdownOpen(false);
              }}
              className="w-full text-left px-2 py-1 text-xs rounded-md hover:bg-red-50 flex items-center gap-2 text-red-600"
            >
              <Trash2 className="w-3 h-3" /> Delete Row
            </button>
            <div className="h-px bg-neutral-100 my-1" />
            <button
              type="button"
              onClick={() => {
                editor.chain().focus().addColumnBefore().run();
                setTableDropdownOpen(false);
              }}
              className="w-full text-left px-2 py-1 text-xs rounded-md hover:bg-neutral-100 flex items-center gap-2 text-neutral-700"
            >
              <Plus className="w-3 h-3 text-green-600" /> Add Column Left
            </button>
            <button
              type="button"
              onClick={() => {
                editor.chain().focus().addColumnAfter().run();
                setTableDropdownOpen(false);
              }}
              className="w-full text-left px-2 py-1 text-xs rounded-md hover:bg-neutral-100 flex items-center gap-2 text-neutral-700"
            >
              <Plus className="w-3 h-3 text-green-600" /> Add Column Right
            </button>
            <button
              type="button"
              onClick={() => {
                editor.chain().focus().deleteColumn().run();
                setTableDropdownOpen(false);
              }}
              className="w-full text-left px-2 py-1 text-xs rounded-md hover:bg-red-50 flex items-center gap-2 text-red-600"
            >
              <Trash2 className="w-3 h-3" /> Delete Column
            </button>
            <div className="h-px bg-neutral-100 my-1" />
            <button
              type="button"
              onClick={() => {
                editor.chain().focus().mergeCells().run();
                setTableDropdownOpen(false);
              }}
              className="w-full text-left px-2 py-1 text-xs rounded-md hover:bg-neutral-100 flex items-center gap-2 text-neutral-700"
            >
              <Merge className="w-3 h-3 text-blue-600" /> Merge Selected Cells
            </button>
            <button
              type="button"
              onClick={() => {
                editor.chain().focus().splitCell().run();
                setTableDropdownOpen(false);
              }}
              className="w-full text-left px-2 py-1 text-xs rounded-md hover:bg-neutral-100 flex items-center gap-2 text-neutral-700"
            >
              <Split className="w-3 h-3 text-blue-600" /> Split Cell
            </button>
            <button
              type="button"
              onClick={() => {
                editor.chain().focus().toggleHeaderRow().run();
                setTableDropdownOpen(false);
              }}
              className="w-full text-left px-2 py-1 text-xs rounded-md hover:bg-neutral-100 flex items-center gap-2 text-neutral-700"
            >
              <TableProperties className="w-3 h-3 text-neutral-600" /> Toggle Header Row
            </button>
            <div className="h-px bg-neutral-100 my-1" />
            <button
              type="button"
              onClick={() => {
                editor.chain().focus().deleteTable().run();
                setTableDropdownOpen(false);
              }}
              className="w-full text-left px-2 py-1 text-xs rounded-md bg-red-50 hover:bg-red-100 font-bold flex items-center gap-2 text-red-700"
            >
              <Trash2 className="w-3.5 h-3.5" /> Remove Entire Table
            </button>
          </div>
        )}
      </div>

      {divider}

      {/* 7. Media Group */}
      <button
        type="button"
        onClick={onOpenImageModal}
        className="px-2 py-1 rounded-lg text-xs font-semibold bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 flex items-center gap-1 shadow-2xs"
        title="Insert Photo (Upload PC or URL)"
      >
        <ImageIcon className="w-3.5 h-3.5" />
        <span>Photo</span>
      </button>
      <button
        type="button"
        onClick={onOpenLinkModal}
        className={btnClass(editor.isActive("link"))}
        title="Insert / Edit Link"
      >
        <Link2 className="w-4 h-4" />
      </button>
      <button
        type="button"
        onClick={onOpenYoutubeModal}
        className={btnClass(editor.isActive("youtube"))}
        title="Embed YouTube Video"
      >
        <Video className="w-4 h-4 text-red-600" />
      </button>

      {divider}

      {/* 8. Utility & Actions */}
      <button
        type="button"
        onClick={() => editor.chain().focus().unsetAllMarks().clearNodes().run()}
        className={btnClass(false)}
        title="Clear Formatting"
      >
        <RemoveFormatting className="w-4 h-4 text-neutral-500" />
      </button>

      <div className="ml-auto flex items-center gap-1">
        <button
          type="button"
          onClick={onToggleFullscreen}
          className="p-1.5 rounded-lg text-xs text-neutral-600 hover:bg-neutral-200/70 transition"
          title={isFullscreen ? "Exit Fullscreen" : "Fullscreen Focus Mode"}
        >
          {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
        </button>
      </div>
    </div>
  );
};
