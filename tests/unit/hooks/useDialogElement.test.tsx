/**
 * Unit tests for the useDialogElement hook.
 */

import React from "react";
import { render, screen } from "@testing-library/react";
import { useDialogElement } from "@/hooks/useDialogElement";

function Harness({ isOpen, onClose }: { readonly isOpen: boolean; readonly onClose: () => void }) {
  const ref = useDialogElement(isOpen, onClose);
  return (
    <dialog ref={ref} data-testid="dialog">
      <button type="button">Focusable</button>
    </dialog>
  );
}

describe("useDialogElement", () => {
  it("opens the dialog when isOpen becomes true", () => {
    const { rerender } = render(<Harness isOpen={false} onClose={jest.fn()} />);
    expect(screen.getByTestId("dialog")).not.toHaveAttribute("open");

    rerender(<Harness isOpen={true} onClose={jest.fn()} />);
    expect(screen.getByTestId("dialog")).toHaveAttribute("open");
  });

  it("reports a native close back to the consumer", () => {
    const onClose = jest.fn();
    const { rerender } = render(<Harness isOpen={true} onClose={onClose} />);

    rerender(<Harness isOpen={false} onClose={onClose} />);
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("ignores a stale close event for a dialog that is open again", () => {
    const onClose = jest.fn();
    render(<Harness isOpen={true} onClose={onClose} />);
    const dialog = screen.getByTestId("dialog");
    expect(dialog).toHaveAttribute("open");

    // The native "close" event is dispatched asynchronously, so one queued by a
    // close can land after the dialog has already been reopened — e.g. browser
    // back immediately followed by forward.
    dialog.dispatchEvent(new Event("close"));

    expect(onClose).not.toHaveBeenCalled();
  });
});
