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

        // Handle headings (#) - must check before ## and ###
        if (trimmedLine.startsWith("#") && !trimmedLine.startsWith("##")) {
          const headingText = trimmedLine.replace(/^#\s*/, "");
          return (
            <h1
              key={index}
              className="mt-8 mb-4 text-xl font-bold text-gray-900 dark:text-gray-100"
            >
              {formatInlineMarkdown(headingText)}
            </h1>
          );
        }

        // Handle headings (##)
        if (trimmedLine.startsWith("##") && !trimmedLine.startsWith("###")) {
          const headingText = trimmedLine.replace(/^##\s*/, "");
          return (
            <h2
              key={index}
              className="mt-6 mb-3 text-lg font-bold text-gray-900 dark:text-gray-100"
            >
              {formatInlineMarkdown(headingText)}
            </h2>
          );
        }

        // Handle headings (###)
        if (trimmedLine.startsWith("###")) {
          const headingText = trimmedLine.replace(/^###\s*/, "");
          return (
            <h3
              key={index}
              className="mt-4 mb-2 text-base font-semibold text-gray-900 dark:text-gray-100"
            >
              {formatInlineMarkdown(headingText)}
            </h3>
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

        // Handle numbered lists (1., 2., etc.)
        const numberedMatch = trimmedLine.match(/^(\d+)\.\s+(.+)$/);
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
 */
function formatInlineMarkdown(text: string): React.ReactNode {
  const parts: React.ReactNode[] = [];
  let currentIndex = 0;

  // Combined regex to match both bold and links
  const markdownRegex = /(\*\*(.+?)\*\*|\[(.+?)\]\((.+?)\))/g;
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
