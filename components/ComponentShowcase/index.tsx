import React from "react";

interface ComponentShowcaseProps {
  title: string;
  description: string;
  children: React.ReactNode;
}

/**
 * ComponentShowcase displays a single component with its title, description, and live preview
 */
export default function ComponentShowcase({
  title,
  description,
  children,
}: ComponentShowcaseProps) {
  return (
    <section className="rounded-lg border border-border bg-card p-6 shadow-sm">
      {/* Component Header */}
      <div className="mb-6 border-b border-border pb-4">
        <h2 className="mb-2 text-2xl font-semibold text-foreground">{title}</h2>
        <p className="text-muted-foreground">{description}</p>
      </div>

      {/* Component Preview */}
      <div className="rounded-md bg-background p-6">{children}</div>
    </section>
  );
}
