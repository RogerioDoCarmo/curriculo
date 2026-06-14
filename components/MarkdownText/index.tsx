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

export default function MarkdownText({ text, className = "" }: MarkdownTextProps) {
  // Split text into lines
  const lines = text.split("\n");

  return (
    <div className={className}>
      {lines.map((line, index) => {
        const trimmedLine = line.trim();

        // Skip empty lines
        if (!trimmedLine) {
          return <div key={index} className="h-2" />;
        }

        // Handle headings (#..######). The regex only detects the marker
        // (1-6 hashes followed by whitespace); the content is extracted with
        // slice + trim. Keeping the regex free of unbounded content quantifiers
        // makes it trivially linear — no ReDoS backtracking surface at all.
        const headingMatch = trimmedLine.match(/^(#{1,6})\s/);
        if (headingMatch) {
          const level = headingMatch[1].length;
          const content = trimmedLine.slice(level).trim();
          const HeadingTag = `h${level}` as HeadingTag;
          return (
            <HeadingTag key={index} className={HEADING_CLASSES[level]}>
              {formatInlineMarkdown(content)}
            </HeadingTag>
          );
        }

        // Handle list items (-)
        if (trimmedLine.startsWith("-")) {
          const listText = trimmedLine.replace(/^-\s*/, "");
          return (
            <div key={index} className="flex gap-2 mb-1">
              <span className="text-gray-500 dark:text-gray-400">•</span>
              <span className="text-sm text-gray-700 dark:text-gray-300">
                {formatInlineMarkdown(listText)}
              </span>
            </div>
          );
        }

        // Handle numbered lists (1., 2., etc.). As with headings, the regex only
        // detects the marker and the content is sliced + trimmed, avoiding any
        // unbounded content quantifier (no ReDoS backtracking surface).
        const numberedMatch = trimmedLine.match(/^(\d+)\.\s/);
        if (numberedMatch) {
          const number = numberedMatch[1];
          const listText = trimmedLine.slice(numberedMatch[0].length).trim();
          return (
            <div key={index} className="flex gap-2 mb-1">
              <span className="text-gray-500 dark:text-gray-400">{number}.</span>
              <span className="text-sm text-gray-700 dark:text-gray-300">
                {formatInlineMarkdown(listText)}
              </span>
            </div>
          );
        }

        // Regular paragraph
        return (
          <p key={index} className="text-sm text-gray-700 dark:text-gray-300 mb-2">
            {formatInlineMarkdown(trimmedLine)}
          </p>
        );
      })}
    </div>
  );
}

/**
 * Format inline markdown (bold **text** and links [text](url)).
 *
 * Implemented as a single linear left-to-right scan using indexOf rather than a
 * regex, so there is no backtracking surface at all (no ReDoS). Matching rules
 * mirror the previous regex: bold content excludes "*"/newlines, link text
 * excludes "]"/newlines, and URLs exclude ")"/newlines; all must be non-empty.
 */
function formatInlineMarkdown(text: string): React.ReactNode {
  const parts: React.ReactNode[] = [];
  let plainStart = 0;
  let i = 0;

  const flushPlain = (end: number): void => {
    if (end > plainStart) parts.push(text.substring(plainStart, end));
  };

  while (i < text.length) {
    const char = text[i];

    // Bold: **text** — content must be non-empty and contain no "*" or newline.
    if (char === "*" && text[i + 1] === "*") {
      const close = text.indexOf("**", i + 2);
      if (close > i + 2) {
        const inner = text.substring(i + 2, close);
        if (!inner.includes("*") && !inner.includes("\n")) {
          flushPlain(i);
          parts.push(
            <strong key={i} className="font-semibold">
              {inner}
            </strong>
          );
          i = close + 2;
          plainStart = i;
          continue;
        }
      }
    }

    // Link: [text](url) — text and url non-empty, no closing delimiter or newline.
    if (char === "[") {
      const closeBracket = text.indexOf("]", i + 1);
      if (closeBracket > i + 1 && text[closeBracket + 1] === "(") {
        const closeParen = text.indexOf(")", closeBracket + 2);
        if (closeParen > closeBracket + 2) {
          // linkText/url already stop at the first "]"/")", so only newlines
          // need to be excluded to mirror the original character classes.
          const linkText = text.substring(i + 1, closeBracket);
          const url = text.substring(closeBracket + 2, closeParen);
          if (!linkText.includes("\n") && !url.includes("\n")) {
            flushPlain(i);
            parts.push(
              <a
                key={i}
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 dark:text-blue-400 hover:underline"
              >
                {linkText}
              </a>
            );
            i = closeParen + 1;
            plainStart = i;
            continue;
          }
        }
      }
    }

    i++;
  }

  flushPlain(text.length);
  return parts.length > 0 ? parts : text;
}
