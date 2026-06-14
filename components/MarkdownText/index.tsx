/**
 * Simple Markdown Text Formatter
 * Handles basic markdown formatting: headings (#, ##, ###), bold (**text**), and lists (-)
 */

interface MarkdownTextProps {
  readonly text: string;
  readonly className?: string;
}

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

        // Handle headings - use regex to match exact number of # characters
        // Check from most specific (######) to least specific (#)
        // The capture starts with \S so the whitespace run (\s+) and the content
        // class are disjoint — this removes the overlapping-quantifier backtracking
        // that makes \s+[^\n]+ vulnerable to super-linear (ReDoS) runtime.

        // ###### heading (h6)
        const h6Match = trimmedLine.match(/^######\s+(\S[^\n]*)$/);
        if (h6Match) {
          return (
            <h6
              key={index}
              className="mt-2 mb-1 text-xs font-semibold text-gray-900 dark:text-gray-100"
            >
              {formatInlineMarkdown(h6Match[1])}
            </h6>
          );
        }

        // ##### heading (h5)
        const h5Match = trimmedLine.match(/^#####\s+(\S[^\n]*)$/);
        if (h5Match) {
          return (
            <h5
              key={index}
              className="mt-2 mb-1 text-sm font-semibold text-gray-900 dark:text-gray-100"
            >
              {formatInlineMarkdown(h5Match[1])}
            </h5>
          );
        }

        // #### heading (h4)
        const h4Match = trimmedLine.match(/^####\s+(\S[^\n]*)$/);
        if (h4Match) {
          return (
            <h4
              key={index}
              className="mt-3 mb-2 text-sm font-semibold text-gray-900 dark:text-gray-100"
            >
              {formatInlineMarkdown(h4Match[1])}
            </h4>
          );
        }

        // ### heading (h3)
        const h3Match = trimmedLine.match(/^###\s+(\S[^\n]*)$/);
        if (h3Match) {
          return (
            <h3
              key={index}
              className="mt-4 mb-2 text-base font-semibold text-gray-900 dark:text-gray-100"
            >
              {formatInlineMarkdown(h3Match[1])}
            </h3>
          );
        }

        // ## heading (h2)
        const h2Match = trimmedLine.match(/^##\s+(\S[^\n]*)$/);
        if (h2Match) {
          return (
            <h2
              key={index}
              className="mt-6 mb-3 text-lg font-bold text-gray-900 dark:text-gray-100"
            >
              {formatInlineMarkdown(h2Match[1])}
            </h2>
          );
        }

        // # heading (h1)
        const h1Match = trimmedLine.match(/^#\s+(\S[^\n]*)$/);
        if (h1Match) {
          return (
            <h1
              key={index}
              className="mt-8 mb-4 text-xl font-bold text-gray-900 dark:text-gray-100"
            >
              {formatInlineMarkdown(h1Match[1])}
            </h1>
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

        // Handle numbered lists (1., 2., etc.) - \S anchor keeps \s+ and the
        // content class disjoint to avoid super-linear (ReDoS) backtracking.
        const numberedMatch = trimmedLine.match(/^(\d+)\.\s+(\S[^\n]*)$/);
        if (numberedMatch) {
          const [, number, listText] = numberedMatch;
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
