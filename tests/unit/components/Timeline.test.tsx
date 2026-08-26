/**
 * Unit tests for Timeline component
 */

import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import Timeline from "@/components/Timeline";
import type { TimelineItem } from "@/types/index";

const sampleItems: TimelineItem[] = [
  {
    id: "item-1",
    date: "2022-01",
    title: "Senior Developer",
    subtitle: "Acme Corp",
    description: "Led mobile development team.",
    type: "work",
  },
  {
    id: "item-2",
    date: "2020-03",
    title: "MSc Computer Science",
    subtitle: "State University",
    description: "Research in distributed systems.",
    type: "education",
    highlighted: true,
  },
  {
    id: "item-3",
    date: "2019-06",
    title: "Best App Award",
    description: "Won regional hackathon.",
    type: "achievement",
  },
  {
    id: "item-4",
    date: "2018-01",
    title: "First Job",
    description: "Started professional career.",
    type: "milestone",
  },
];

describe("Timeline Component", () => {
  it.each([
    ["titles", ["Senior Developer", "MSc Computer Science", "Best App Award", "First Job"]],
    ["subtitles", ["Acme Corp", "State University"]],
    ["descriptions", ["Led mobile development team.", "Research in distributed systems."]],
  ] as const)("renders item %s", (_label, texts) => {
    render(<Timeline items={sampleItems} />);
    texts.forEach((text) => {
      expect(screen.getByText(text)).toBeInTheDocument();
    });
  });

  it("expands an entry by clicking its circular marker", () => {
    const itemsWithDetails: TimelineItem[] = [
      {
        id: "d1",
        date: "2022-01",
        title: "Role",
        description: "Intro paragraph.\n### Conquistas\nHidden detail line.",
        type: "work",
      },
    ];
    const { container } = render(
      <Timeline
        items={itemsWithDetails}
        expandLabel="Expand details"
        collapseLabel="Collapse details"
      />
    );
    // Details are collapsed until the marker is clicked.
    expect(screen.queryByText("Hidden detail line.")).not.toBeInTheDocument();

    // The circular marker (rounded-full button) toggles the entry.
    const marker = container.querySelector("button.rounded-full");
    expect(marker).not.toBeNull();
    fireEvent.click(marker as HTMLElement);
    expect(screen.getByText("Hidden detail line.")).toBeInTheDocument();
  });

  it("renders date labels for each item", () => {
    render(<Timeline items={sampleItems} />);
    expect(screen.getByText("2022-01")).toBeInTheDocument();
    expect(screen.getByText("2020-03")).toBeInTheDocument();
  });

  it("renders an ordered list with aria-label", () => {
    render(<Timeline items={sampleItems} />);
    const list = screen.getByRole("list", { name: /timeline/i });
    expect(list).toBeInTheDocument();
  });

  it("renders ARIA labels for marker types", () => {
    render(<Timeline items={sampleItems} />);
    expect(screen.getByLabelText("Work")).toBeInTheDocument();
    expect(screen.getByLabelText("Education")).toBeInTheDocument();
    expect(screen.getByLabelText("Achievement")).toBeInTheDocument();
    expect(screen.getByLabelText("Milestone")).toBeInTheDocument();
  });

  it("renders empty state message when items array is empty", () => {
    render(<Timeline items={[]} />);
    expect(screen.getByText(/no timeline items/i)).toBeInTheDocument();
  });

  it("renders item titles as headings", () => {
    render(<Timeline items={sampleItems} />);
    const headings = screen.getAllByRole("heading", { level: 3 });
    expect(headings.length).toBeGreaterThanOrEqual(4);
  });

  it("renders time elements with dateTime attribute", () => {
    render(<Timeline items={sampleItems} />);
    const timeElements = document.querySelectorAll("time");
    expect(timeElements.length).toBeGreaterThan(0);
    expect(timeElements[0]).toHaveAttribute("dateTime");
  });
});
