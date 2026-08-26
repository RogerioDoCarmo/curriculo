import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Select from "@/components/Select";

interface Framework {
  readonly id: string;
  readonly name: string;
}

const FRAMEWORKS: readonly Framework[] = [
  { id: "react", name: "React" },
  { id: "react-native", name: "React Native" },
  { id: "next", name: "Next.js" },
];

function renderSelect(value: Framework, onChange: (option: Framework) => void) {
  return render(
    <Select<Framework>
      value={value}
      options={FRAMEWORKS}
      onChange={onChange}
      getLabel={(f) => f.name}
      getKey={(f) => f.id}
      label="Framework"
    />
  );
}

describe("Select (generic)", () => {
  it("renders one option per item, showing each item's label", () => {
    renderSelect(FRAMEWORKS[0], jest.fn());
    for (const framework of FRAMEWORKS) {
      expect(screen.getByRole("option", { name: framework.name })).toBeInTheDocument();
    }
  });

  it("shows the current value as selected", () => {
    renderSelect(FRAMEWORKS[1], jest.fn());
    expect(screen.getByRole("combobox")).toHaveValue("react-native");
  });

  it("calls onChange with the full matching option object, not just its key", async () => {
    const user = userEvent.setup();
    const handleChange = jest.fn();
    renderSelect(FRAMEWORKS[0], handleChange);

    await user.selectOptions(screen.getByRole("combobox"), "next");

    expect(handleChange).toHaveBeenCalledTimes(1);
    expect(handleChange).toHaveBeenCalledWith({ id: "next", name: "Next.js" });
  });

  it("exposes an accessible name matching the label prop", () => {
    renderSelect(FRAMEWORKS[0], jest.fn());
    expect(screen.getByRole("combobox", { name: "Framework" })).toBeInTheDocument();
  });

  it("associates the visually-hidden <label> with the select via htmlFor/id", () => {
    renderSelect(FRAMEWORKS[0], jest.fn());
    const select = screen.getByRole("combobox");
    const label = screen.getByText("Framework", { selector: "label" });
    expect(label).toHaveAttribute("for", select.id);
  });
});
