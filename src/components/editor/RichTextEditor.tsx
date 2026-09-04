import React, { useState, useEffect } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import { StarterKit } from "@tiptap/starter-kit";
import { Table } from "@tiptap/extension-table";
import { TableRow } from "@tiptap/extension-table-row";
import { TableCell } from "@tiptap/extension-table-cell";
import { TableHeader } from "@tiptap/extension-table-header";
import { TextAlign } from "@tiptap/extension-text-align";
import { TextStyle } from "@tiptap/extension-text-style";
import { Color } from "@tiptap/extension-color";
import { Highlight } from "@tiptap/extension-highlight";
import { Underline } from "@tiptap/extension-underline";
import { Subscript } from "@tiptap/extension-subscript";
import { Superscript } from "@tiptap/extension-superscript";
import { Link } from "@tiptap/extension-link";
import { Youtube } from "@tiptap/extension-youtube";
import { Placeholder } from "@tiptap/extension-placeholder";
import { CharacterCount } from "@tiptap/extension-character-count";
import { CodeBlockLowlight } from "@tiptap/extension-code-block-lowlight";
import { createLowlight, common } from "lowlight";

import { CustomImage } from "./extensions/CustomImage";
import { EditorToolbar } from "./EditorToolbar";
import { LinkModal } from "./LinkModal";
import { TableModal } from "./TableModal";
import { ImageModal } from "./ImageModal";
import { YoutubeModal } from "./YoutubeModal";
import { cleanPastedHTML, parseTSVToTableHTML } from "./editorPasteHandler";
import { adminApi } from "../../api/admin";

import "./editor.css";

const lowlight = createLowlight(common);

export interface RichTextEditorProps {
  content: string;
  onChange: (html: string) => void;
  placeholder?: string;
  minHeight?: string;
  folder?: string;
  className?: string;
}

export const RichTextEditor: React.FC<RichTextEditorProps> = ({
  content,
  onChange,
  placeholder = "Start writing rich content...",
  minHeight = "350px",
  folder = "editor",
  className = "",
}) => {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [linkModalOpen, setLinkModalOpen] = useState(false);
  const [tableModalOpen, setTableModalOpen] = useState(false);
  const [imageModalOpen, setImageModalOpen] = useState(false);
  const [youtubeModalOpen, setYoutubeModalOpen] = useState(false);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3, 4],
        },
        codeBlock: false, // Replaced by CodeBlockLowlight
      }),
      CodeBlockLowlight.configure({
        lowlight,
      }),
      Table.configure({
        resizable: true,
        lastColumnResizable: false,
        HTMLAttributes: {
          class: "tiptap-table",
        },
      }),
      TableRow,
      TableHeader,
      TableCell,
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
      TextStyle,
      Color,
      Highlight.configure({
        multicolor: true,
      }),
      Underline,
      Subscript,
      Superscript,
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: "text-red-600 underline font-medium",
        },
      }),
      CustomImage.configure({
        allowBase64: true,
      }),
      Youtube.configure({
        inline: false,
        width: 640,
        height: 360,
      }),
      Placeholder.configure({
        placeholder,
      }),
      CharacterCount,
    ],
    content: content || "",
    editorProps: {
      attributes: {
        class: "tiptap focus:outline-none",
      },
      transformPastedHTML(html) {
        return cleanPastedHTML(html);
      },
      handlePaste(view, event) {
        const clipboardData = event.clipboardData;
        if (!clipboardData) return false;

        // 1. Direct Image File Paste
        if (clipboardData.files && clipboardData.files.length > 0) {
          const file = clipboardData.files[0];
          if (file.type.startsWith("image/")) {
            event.preventDefault();
            adminApi
              .uploadMedia(file, folder)
              .then((res) => {
                editor?.chain().focus().setImage({ src: res.url, alt: file.name }).run();
              })
              .catch((err) => {
                console.error("Image paste upload failed:", err);
              });
            return true;
          }
        }

        // 2. Tab-Separated Value (TSV) paste fallback for Excel / Sheets
        const text = clipboardData.getData("text/plain");
        const html = clipboardData.getData("text/html");

        if (!html && text && text.includes("\t")) {
          const tableHtml = parseTSVToTableHTML(text);
          if (tableHtml) {
            event.preventDefault();
            editor?.commands.insertContent(tableHtml);
            return true;
          }
        }

        return false;
      },
      handleDrop(view, event, _slice, moved) {
        if (!moved && event.dataTransfer?.files && event.dataTransfer.files.length > 0) {
          const file = event.dataTransfer.files[0];
          if (file.type.startsWith("image/")) {
            event.preventDefault();
            adminApi
              .uploadMedia(file, folder)
              .then((res) => {
                const coordinates = view.posAtCoords({ left: event.clientX, top: event.clientY });
                if (coordinates) {
                  editor?.chain().focus().setTextSelection(coordinates.pos).setImage({ src: res.url, alt: file.name }).run();
                } else {
                  editor?.chain().focus().setImage({ src: res.url, alt: file.name }).run();
                }
              })
              .catch((err) => {
                console.error("Image drop upload failed:", err);
              });
            return true;
          }
        }
        return false;
      },
    },
    onUpdate({ editor }) {
      const html = editor.getHTML();
      onChange(html);
    },
  });

  // Keep editor in sync when external content prop updates (e.g. loading article in modal)
  useEffect(() => {
    if (!editor) return;
    const currentHtml = editor.getHTML();
    if (content !== currentHtml && (content || "") !== (currentHtml === "<p></p>" ? "" : currentHtml)) {
      editor.commands.setContent(content || "", false);
    }
  }, [content, editor]);

  // Insert link handler
  const handleSaveLink = (url: string, text: string, openInNewTab: boolean) => {
    if (!editor) return;

    if (text) {
      editor
        .chain()
        .focus()
        .insertContent({
          type: "text",
          text,
          marks: [
            {
              type: "link",
              attrs: {
                href: url,
                target: openInNewTab ? "_blank" : null,
              },
            },
          ],
        })
        .run();
    } else {
      editor
        .chain()
        .focus()
        .extendMarkRange("link")
        .setLink({ href: url, target: openInNewTab ? "_blank" : null })
        .run();
    }
  };

  const handleRemoveLink = () => {
    editor?.chain().focus().extendMarkRange("link").unsetLink().run();
  };

  // Insert Table handler
  const handleInsertTable = (rows: number, cols: number, withHeaderRow: boolean) => {
    editor?.chain().focus().insertTable({ rows, cols, withHeaderRow }).run();
  };

  // Insert Image handler
  const handleInsertImage = (data: { src: string; alt: string; width: string; alignment: string }) => {
    editor
      ?.chain()
      .focus()
      .setImage({
        src: data.src,
        alt: data.alt,
        width: data.width,
        alignment: data.alignment,
      } as any)
      .run();
  };

  // Insert YouTube video handler
  const handleInsertYoutube = (url: string) => {
    editor?.chain().focus().setYoutubeVideo({ src: url }).run();
  };

  const wordsCount = editor?.storage.characterCount.words() || 0;
  const charsCount = editor?.storage.characterCount.characters() || 0;

  return (
    <div
      className={`tiptap-editor-container ${isFullscreen ? "is-fullscreen" : ""} ${className}`}
      style={{ "--editor-min-height": minHeight } as React.CSSProperties}
    >
      {/* Editor Toolbar */}
      <EditorToolbar
        editor={editor}
        isFullscreen={isFullscreen}
        onToggleFullscreen={() => setIsFullscreen(!isFullscreen)}
        onOpenLinkModal={() => setLinkModalOpen(true)}
        onOpenTableModal={() => setTableModalOpen(true)}
        onOpenImageModal={() => setImageModalOpen(true)}
        onOpenYoutubeModal={() => setYoutubeModalOpen(true)}
      />

      {/* Editor Canvas */}
      <div className="tiptap-content-area" onClick={() => editor?.commands.focus()}>
        <EditorContent editor={editor} />
      </div>

      {/* Bottom Status Bar */}
      <div className="flex items-center justify-between px-4 py-2 border-t border-neutral-100 bg-neutral-50/70 text-[11px] text-neutral-400">
        <div className="flex items-center gap-3">
          <span>{wordsCount} words</span>
          <span className="h-2.5 w-px bg-neutral-200" />
          <span>{charsCount} characters</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="inline-block w-1.5 h-1.5 rounded-full bg-green-500" />
          <span className="text-neutral-500 font-medium">TipTap Rich HTML</span>
        </div>
      </div>

      {/* Modals */}
      <LinkModal
        isOpen={linkModalOpen}
        onClose={() => setLinkModalOpen(false)}
        onSave={handleSaveLink}
        onRemove={handleRemoveLink}
        initialUrl={editor?.getAttributes("link").href || ""}
      />

      <TableModal
        isOpen={tableModalOpen}
        onClose={() => setTableModalOpen(false)}
        onInsert={handleInsertTable}
      />

      <ImageModal
        isOpen={imageModalOpen}
        onClose={() => setImageModalOpen(false)}
        onInsert={handleInsertImage}
        folder={folder}
      />

      <YoutubeModal
        isOpen={youtubeModalOpen}
        onClose={() => setYoutubeModalOpen(false)}
        onInsert={handleInsertYoutube}
      />
    </div>
  );
};
