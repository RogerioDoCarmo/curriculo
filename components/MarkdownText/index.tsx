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
 * Format inline markdown (bold **text** and links [text](url))
 * Using non-greedy quantifiers and character classes to prevent ReDoS
 */
function formatInlineMarkdown(text: string): React.ReactNode {
  const parts: React.ReactNode[] = [];
  let currentIndex = 0;

  // Non-backtracking regex: each content class excludes its own closing
  // delimiter (* for bold, ] for link text, ) for URL), so greedy quantifiers
  // match each position exactly once — linear runtime, no ReDoS backtracking.
  const markdownRegex = /(\*\*([^*\n]+)\*\*|\[([^\]\n]+)\]\(([^)\n]+)\))/g;
  let match;

  while ((match = markdownRegex.exec(text)) !== null) {
    // Add text before the markdown part
    if (match.index > currentIndex) {
      parts.push(text.substring(currentIndex, match.index));
    }

    // Check if it's a bold pattern (**text**)
    if (match[2]) {
      parts.push(
        <strong key={match.index} className="font-semibold">
          {match[2]}
        </strong>
      );
    }
    // Check if it's a link pattern [text](url)
    else if (match[3] && match[4]) {
      parts.push(
        <a
          key={match.index}
          href={match[4]}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 dark:text-blue-400 hover:underline"
        >
          {match[3]}
        </a>
      );
    }

    currentIndex = match.index + match[0].length;
  }

  // Add remaining text
  if (currentIndex < text.length) {
    parts.push(text.substring(currentIndex));
  }

  return parts.length > 0 ? parts : text;
}
