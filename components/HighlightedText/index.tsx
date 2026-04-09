import React from "react";

interface HighlightedTextProps {
  text: string;
  highlight: string;
  className?: string;
}

export default function HighlightedText({ text, highlight, className }: HighlightedTextProps) {
  if (!highlight || !text) {
    return <span className={className}>{text}</span>;
  }

  const escapedHighlight = highlight.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const regex = new RegExp(`(${escapedHighlight})`, "gi");
  const parts = text.split(regex);

  return (
    <span className={className}>
      {parts.map((part, index) =>
        part.toLowerCase() === highlight.toLowerCase() ? <strong key={index}>{part}</strong> : part
      )}
    </span>
  );
}
