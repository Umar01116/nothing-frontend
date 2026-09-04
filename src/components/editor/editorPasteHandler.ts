/**
 * Paste Normalizer & Handler for TipTap Editor
 * Ensures robust table & formatting preservation when copying from
 * Microsoft Excel, Microsoft Word, Google Docs, and Google Sheets.
 */

export function cleanPastedHTML(html: string): string {
  if (!html) return "";

  let cleaned = html;

  // 1. Remove MS Office conditionals and XML wrappers
  cleaned = cleaned.replace(/<!--\[if[\s\S]*?<!\[endif\]-->/gi, "");
  cleaned = cleaned.replace(/<!\[if[\s\S]*?<!\[endif\]>/gi, "");
  cleaned = cleaned.replace(/<o:p>[\s\S]*?<\/o:p>/gi, "");
  cleaned = cleaned.replace(/<\/?(xml|meta|link|style)[^>]*>/gi, "");

  // 2. Remove Google Docs / Sheets wrapper tags
  cleaned = cleaned.replace(/<\/?google-sheets-html-origin[^>]*>/gi, "");
  cleaned = cleaned.replace(/<b\s+style="font-weight:normal;"[^>]*>([\s\S]*?)<\/b>/gi, "$1");

  // 3. Remove Word & Excel inline clutter (mso-* styles, font-family, font-size)
  // while preserving structural alignment and colors if needed
  cleaned = cleaned.replace(/style="([^"]*)"/gi, (_match, styleContent: string) => {
    const rules = styleContent
      .split(";")
      .map((r) => r.trim())
      .filter((r) => {
        if (!r) return false;
        const lower = r.toLowerCase();
        // Remove mso-* attributes
        if (lower.startsWith("mso-")) return false;
        // Remove forced fonts & sizes that clash with site theme
        if (lower.startsWith("font-family") || lower.startsWith("font-size") || lower.startsWith("line-height")) {
          return false;
        }
        // Remove fixed page margins from Word
        if (lower.startsWith("margin") && (lower.includes("pt") || lower.includes("in"))) {
          return false;
        }
        return true;
      });

    return rules.length > 0 ? `style="${rules.join("; ")}"` : "";
  });

  // 4. Remove empty span tags left behind by cleaned styles
  cleaned = cleaned.replace(/<span\s*>([\s\S]*?)<\/span>/gi, "$1");

  return cleaned;
}

/**
 * Detects if plain text is Tab-Separated Values (TSV) from Excel / Google Sheets
 * and converts it into a clean HTML table structure.
 */
export function parseTSVToTableHTML(text: string): string | null {
  if (!text || !text.includes("\t")) return null;

  const lines = text.trim().split(/\r?\n/);
  if (lines.length === 0) return null;

  // Check if at least one line has tabs and we have at least 2 cells
  const matrix = lines.map((line) => line.split("\t"));
  const hasTabs = matrix.some((row) => row.length > 1);
  if (!hasTabs) return null;

  // Determine max columns
  const maxCols = Math.max(...matrix.map((row) => row.length));
  if (maxCols < 2 && lines.length < 2) return null;

  // Build clean HTML table
  let tableHtml = "<table><tbody>";
  matrix.forEach((row, rowIndex) => {
    tableHtml += "<tr>";
    for (let c = 0; c < maxCols; c++) {
      const cellContent = (row[c] || "").trim();
      // First row as header if more than 1 row exists
      if (rowIndex === 0 && matrix.length > 1) {
        tableHtml += `<th><p>${escapeHTML(cellContent)}</p></th>`;
      } else {
        tableHtml += `<td><p>${escapeHTML(cellContent)}</p></td>`;
      }
    }
    tableHtml += "</tr>";
  });
  tableHtml += "</tbody></table>";

  return tableHtml;
}

function escapeHTML(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
