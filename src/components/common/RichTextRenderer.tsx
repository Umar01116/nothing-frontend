import React from "react";
import DOMPurify from "dompurify";
import { resolveImageUrl } from "../../utils/store";
import "../editor/editor.css";

interface RichTextRendererProps {
  content: string;
  className?: string;
}

export const RichTextRenderer: React.FC<RichTextRendererProps> = ({ content, className = "" }) => {
  if (!content) return null;

  // Detect whether content is HTML (from TipTap) or legacy Markdown
  const isHTML = /<([a-z][a-z0-9]*)\b[^>]*>/i.test(content);

  if (isHTML) {
    // Sanitize HTML with DOMPurify while permitting rich content tags, styling and YouTube iframes
    const cleanHtml = DOMPurify.sanitize(content, {
      ADD_TAGS: ["iframe"],
      ADD_ATTR: [
        "target",
        "rel",
        "data-alignment",
        "allowfullscreen",
        "frameborder",
        "allow",
        "colspan",
        "rowspan",
        "style",
      ],
    });

    return (
      <div
        className={`rich-text-content ${className}`}
        dangerouslySetInnerHTML={{ __html: cleanHtml }}
      />
    );
  }

  // Fallback: Legacy Markdown parser for backwards-compatibility
  const parseMarkdown = (text: string) => {
    const lines = text.split("\n");
    const elements: React.ReactNode[] = [];
    let inList = false;
    let listItems: React.ReactNode[] = [];
    let listType: "ul" | "ol" = "ul";

    const flushList = () => {
      if (inList && listItems.length > 0) {
        if (listType === "ol") {
          elements.push(
            <ol key={`ol-${elements.length}`} className="list-decimal pl-6 space-y-1.5 my-3 text-neutral-800">
              {listItems}
            </ol>
          );
        } else {
          elements.push(
            <ul key={`ul-${elements.length}`} className="list-disc pl-6 space-y-1.5 my-3 text-neutral-800">
              {listItems}
            </ul>
          );
        }
        listItems = [];
        inList = false;
      }
    };

    const renderInline = (str: string): React.ReactNode => {
      const imageRegex = /!\[(.*?)\]\((.*?)\)/g;
      const parts: React.ReactNode[] = [];
      let lastIndex = 0;
      let match: RegExpExecArray | null;

      while ((match = imageRegex.exec(str)) !== null) {
        if (match.index > lastIndex) {
          parts.push(renderFormattedText(str.substring(lastIndex, match.index)));
        }
        const alt = match[1] || "Image";
        const src = resolveImageUrl(match[2]);
        parts.push(
          <span key={`img-${match.index}`} className="block my-4 rounded-2xl overflow-hidden shadow-xs border border-neutral-200">
            <img src={src} alt={alt} className="w-full max-h-[480px] object-cover" />
            {alt && alt !== "Image" && (
              <span className="block text-center text-xs text-neutral-500 py-1.5 bg-neutral-50 border-t border-neutral-100">
                {alt}
              </span>
            )}
          </span>
        );
        lastIndex = match.index + match[0].length;
      }

      if (lastIndex < str.length) {
        parts.push(renderFormattedText(str.substring(lastIndex)));
      }

      return parts.length > 0 ? parts : renderFormattedText(str);
    };

    const renderFormattedText = (str: string): React.ReactNode => {
      let html = str
        .replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer" class="text-red-600 font-semibold underline hover:text-red-700">$1</a>')
        .replace(/\*\*(.*?)\*\*/g, '<strong class="font-bold text-neutral-900">$1</strong>')
        .replace(/__(.*?)__/g, '<strong class="font-bold text-neutral-900">$1</strong>')
        .replace(/\*(.*?)\*/g, '<em class="italic">$1</em>')
        .replace(/_([^_]+)_/g, '<em class="italic">$1</em>')
        .replace(/`([^`]+)`/g, '<code class="px-1.5 py-0.5 bg-neutral-100 text-red-600 rounded text-xs font-mono">$1</code>');

      return <span dangerouslySetInnerHTML={{ __html: html }} />;
    };

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();

      if (!line) {
        flushList();
        continue;
      }

      if (line.startsWith("#### ")) {
        flushList();
        elements.push(
          <h4 key={i} className="text-base font-bold text-neutral-900 mt-5 mb-2">
            {renderInline(line.substring(5))}
          </h4>
        );
      } else if (line.startsWith("### ")) {
        flushList();
        elements.push(
          <h3 key={i} className="text-lg font-bold text-neutral-900 mt-6 mb-2">
            {renderInline(line.substring(4))}
          </h3>
        );
      } else if (line.startsWith("## ")) {
        flushList();
        elements.push(
          <h2 key={i} className="text-xl sm:text-2xl font-bold text-neutral-900 mt-7 mb-3 border-b border-neutral-100 pb-1.5">
            {renderInline(line.substring(3))}
          </h2>
        );
      } else if (line.startsWith("# ")) {
        flushList();
        elements.push(
          <h1 key={i} className="text-2xl sm:text-3xl font-bold text-neutral-900 mt-8 mb-4">
            {renderInline(line.substring(2))}
          </h1>
        );
      } else if (line === "---" || line === "***" || line === "___") {
        flushList();
        elements.push(<hr key={i} className="my-6 border-neutral-200" />);
      } else if (line.startsWith("> ")) {
        flushList();
        elements.push(
          <blockquote key={i} className="pl-4 py-2 border-l-4 border-red-500 bg-neutral-50 rounded-r-xl my-4 text-neutral-700 italic">
            {renderInline(line.substring(2))}
          </blockquote>
        );
      } else if (line.startsWith("- ") || line.startsWith("* ")) {
        if (!inList || listType !== "ul") {
          flushList();
          inList = true;
          listType = "ul";
        }
        listItems.push(
          <li key={`li-${i}`}>
            {renderInline(line.substring(2))}
          </li>
        );
      } else if (/^\d+\.\s/.test(line)) {
        if (!inList || listType !== "ol") {
          flushList();
          inList = true;
          listType = "ol";
        }
        const textAfterNumber = line.replace(/^\d+\.\s/, "");
        listItems.push(
          <li key={`li-${i}`}>
            {renderInline(textAfterNumber)}
          </li>
        );
      } else {
        flushList();
        elements.push(
          <p key={i} className="text-sm sm:text-base leading-relaxed text-neutral-800 my-2.5">
            {renderInline(line)}
          </p>
        );
      }
    }

    flushList();
    return elements;
  };

  return <div className={`rich-text-content space-y-1 ${className}`}>{parseMarkdown(content)}</div>;
};