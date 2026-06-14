/**
 * Simple Markdown Text Formatter
 * Handles basic markdown formatting: headings (#, ##, ###), bold (**text**), and lists (-)
 */

interface MarkdownTextProps {
  readonly text: string;
  readonly className?: string;
}

type HeadingTag = "h1" | "h2" | "h3" | "h4" | "h5" | "h6";

// Tailwind classes per heading level (index 1-6); index 0 is unused.
const HEADING_CLASSES: readonly string[] = [
  "",
  "mt-8 mb-4 text-xl font-bold text-gray-900 dark:text-gray-100",
  "mt-6 mb-3 text-lg font-bold text-gray-900 dark:text-gray-100",
  "mt-4 mb-2 text-base font-semibold text-gray-900 dark:text-gray-100",
  "mt-3 mb-2 text-sm font-semibold text-gray-900 dark:text-gray-100",
  "mt-2 mb-1 text-sm font-semibold text-gray-900 dark:text-gray-100",
  "mt-2 mb-1 text-xs font-semibold text-gray-900 dark:text-gray-100",
];

// Marker-only regexes (no unbounded content quantifier -> trivially linear, no ReDoS).
const HEADING_MARKER = /^(#{1,6})\s/;
const NUMBERED_MARKER = /^(\d+)\.\s/;
const LIST_MARKER = /^-\s*/;

/**
 * Build a stable, unique React key per line based on content and the line's
 * occurrence count, avoiding array-index keys (which are fragile when content
 * shifts and are flagged by lint/Sonar).
 */
function keyForLines(lines: string[]): { line: string; key: string }[] {
  const occurrences = new Map<string, number>();
  return lines.map((line) => {
    const seen = occurrences.get(line) ?? 0;
    occurrences.set(line, seen + 1);
    return { line, key: `${seen}:${line}` };
  });
}

export default function MarkdownText({ text, className = "" }: MarkdownTextProps) {
  const lines = keyForLines(text.split("\n"));

  return (
    <div className={className}>
      {lines.map(({ line, key }) => {
        const trimmedLine = line.trim();

        // Skip empty lines
        if (!trimmedLine) {
          return <div key={key} className="h-2" />;
        }

        // Handle headings (#..######). The regex only detects the marker; the
        // content is extracted with slice + trim.
        const headingMatch = HEADING_MARKER.exec(trimmedLine);
        if (headingMatch) {
          const level = headingMatch[1].length;
          const content = trimmedLine.slice(level).trim();
          const HeadingTag = `h${level}` as HeadingTag;
          return (
            <HeadingTag key={key} className={HEADING_CLASSES[level]}>
              {formatInlineMarkdown(content)}
            </HeadingTag>
          );
        }

        // Handle list items (-)
        if (trimmedLine.startsWith("-")) {
          const listText = trimmedLine.replace(LIST_MARKER, "");
          return (
            <div key={key} className="flex gap-2 mb-1">
              <span className="text-gray-500 dark:text-gray-400">•</span>
              <span className="text-sm text-gray-700 dark:text-gray-300">
                {formatInlineMarkdown(listText)}
              </span>
            </div>
          );
        }

        // Handle numbered lists (1., 2., etc.) — marker-only regex, content sliced.
        const numberedMatch = NUMBERED_MARKER.exec(trimmedLine);
        if (numberedMatch) {
          const number = numberedMatch[1];
          const listText = trimmedLine.slice(numberedMatch[0].length).trim();
          return (
            <div key={key} className="flex gap-2 mb-1">
              <span className="text-gray-500 dark:text-gray-400">{number}.</span>
              <span className="text-sm text-gray-700 dark:text-gray-300">
                {formatInlineMarkdown(listText)}
              </span>
            </div>
          );
        }

        // Regular paragraph
        return (
          <p key={key} className="text-sm text-gray-700 dark:text-gray-300 mb-2">
            {formatInlineMarkdown(trimmedLine)}
          </p>
        );
      })}
    </div>
  );
}

/** A parsed inline token plus the index to resume scanning from. */
interface InlineToken {
  readonly node: React.ReactNode;
  readonly next: number;
}

/**
 * Try to parse **bold** starting at index `i`.
 * Content must be non-empty and contain no "*" or newline.
 */
function parseBold(text: string, i: number): InlineToken | null {
  if (text[i] !== "*" || text[i + 1] !== "*") return null;
  const close = text.indexOf("**", i + 2);
  if (close <= i + 2) return null;
  const inner = text.substring(i + 2, close);
  if (inner.includes("*") || inner.includes("\n")) return null;
  return {
    node: (
      <strong key={i} className="font-semibold">
        {inner}
      </strong>
    ),
    next: close + 2,
  };
}

/**
 * Try to parse [text](url) starting at index `i`.
 * Text and url are bounded by the first "]"/")", so only newlines are excluded.
 */
function parseLink(text: string, i: number): InlineToken | null {
  if (text[i] !== "[") return null;
  const closeBracket = text.indexOf("]", i + 1);
  if (closeBracket <= i + 1 || text[closeBracket + 1] !== "(") return null;
  const closeParen = text.indexOf(")", closeBracket + 2);
  if (closeParen <= closeBracket + 2) return null;
  const linkText = text.substring(i + 1, closeBracket);
  const url = text.substring(closeBracket + 2, closeParen);
  if (linkText.includes("\n") || url.includes("\n")) return null;
  return {
    node: (
      <a
        key={i}
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="text-blue-600 dark:text-blue-400 hover:underline"
      >
        {linkText}
      </a>
    ),
    next: closeParen + 1,
  };
}

/**
 * Format inline markdown (bold **text** and links [text](url)).
 *
 * A single linear left-to-right scan (indexOf via the parse helpers) — no regex
 * and no backtracking surface, so it is immune to ReDoS.
 */
function formatInlineMarkdown(text: string): React.ReactNode {
  const parts: React.ReactNode[] = [];
  let plainStart = 0;
  let i = 0;

  while (i < text.length) {
    const token = parseBold(text, i) ?? parseLink(text, i);
    if (token) {
      if (i > plainStart) parts.push(text.substring(plainStart, i));
      parts.push(token.node);
      i = token.next;
      plainStart = i;
    } else {
      i++;
    }
  }

  if (text.length > plainStart) parts.push(text.substring(plainStart));
  return parts.length > 0 ? parts : text;
}
