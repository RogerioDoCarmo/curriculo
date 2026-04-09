/**
 * Unit tests for Modal component
 * TDD Red phase - tests written before implementation
 */

import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Modal from "@/components/Modal";

describe("Modal Component", () => {
  const defaultProps = {
    isOpen: true,
    onClose: jest.fn(),
    children: <div>Modal content</div>,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  // --- Visibility ---
  describe("visibility", () => {
    it("should render when isOpen is true", () => {
      render(<Modal {...defaultProps} isOpen={true} />);
      expect(screen.getByRole("dialog")).toBeInTheDocument();
    });

    it("should NOT render when isOpen is false", () => {
      render(<Modal {...defaultProps} isOpen={false} />);
      expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    });
  });

  // --- Title ---
  describe("title", () => {
    it("should display title when provided", () => {
      render(<Modal {...defaultProps} title="My Modal Title" />);
      expect(screen.getByText("My Modal Title")).toBeInTheDocument();
    });

    it("should not render title element when title is not provided", () => {
      render(<Modal {...defaultProps} />);
      // No heading should be present when title is omitted
      expect(screen.queryByRole("heading")).not.toBeInTheDocument();
    });
  });

  // --- Children ---
  it("should render children inside the modal", () => {
    render(
      <Modal {...defaultProps}>
        <p>Custom child content</p>
      </Modal>
    );
    expect(screen.getByText("Custom child content")).toBeInTheDocument();
  });

  // --- ESC key ---
  describe("ESC key", () => {
    it("should call onClose when ESC key is pressed", async () => {
      const user = userEvent.setup();
      const onClose = jest.fn();
      render(<Modal {...defaultProps} onClose={onClose} />);

      await user.keyboard("{Escape}");

      await waitFor(() => {
        expect(onClose).toHaveBeenCalledTimes(1);
      });
    });
  });

  // --- Backdrop click ---
  describe("backdrop click", () => {
    it("should call onClose when backdrop is clicked", async () => {
      const user = userEvent.setup();
      const onClose = jest.fn();
      render(<Modal {...defaultProps} onClose={onClose} />);

      const backdrop = screen.getByTestId("modal-backdrop");
      await user.click(backdrop);

      await waitFor(() => {
        expect(onClose).toHaveBeenCalledTimes(1);
      });
    });

    it("should NOT call onClose when modal content is clicked", async () => {
      const user = userEvent.setup();
      const onClose = jest.fn();
      render(
        <Modal {...defaultProps} onClose={onClose}>
          <div data-testid="modal-inner">Inner content</div>
        </Modal>
      );

      const inner = screen.getByTestId("modal-inner");
      await user.click(inner);

      await waitFor(() => {
        expect(onClose).not.toHaveBeenCalled();
      });
    });
  });

  // --- Close button ---
  describe("close button", () => {
    it("should call onClose when close button is clicked", async () => {
      const user = userEvent.setup();
      const onClose = jest.fn();
      render(<Modal {...defaultProps} onClose={onClose} />);

      const closeButton = screen.getByRole("button", { name: /close/i });
      await user.click(closeButton);

      await waitFor(() => {
        expect(onClose).toHaveBeenCalledTimes(1);
      });
    });
  });

  // --- ARIA attributes ---
  describe("accessibility", () => {
    it("should have role='dialog' attribute", () => {
      render(<Modal {...defaultProps} />);
      expect(screen.getByRole("dialog")).toBeInTheDocument();
    });

    it("should have aria-modal='true' attribute", () => {
      render(<Modal {...defaultProps} />);
      expect(screen.getByRole("dialog")).toHaveAttribute("aria-modal", "true");
    });

    it("should have aria-labelledby pointing to title when title is provided", () => {
      render(<Modal {...defaultProps} title="Accessible Title" />);
      const dialog = screen.getByRole("dialog");
      const labelledById = dialog.getAttribute("aria-labelledby");
      expect(labelledById).toBeTruthy();

      const titleElement = document.getElementById(labelledById!);
      expect(titleElement).toBeInTheDocument();
      expect(titleElement).toHaveTextContent("Accessible Title");
    });

    it("should not have aria-labelledby when title is not provided", () => {
      render(<Modal {...defaultProps} />);
      const dialog = screen.getByRole("dialog");
      expect(dialog).not.toHaveAttribute("aria-labelledby");
    });
  });

  // --- Focus trap ---
  describe("focus trap", () => {
    it("should move focus inside the modal when it opens", async () => {
      render(
        <Modal {...defaultProps} isOpen={true}>
          <button>First focusable</button>
          <button>Second focusable</button>
        </Modal>
      );

      await waitFor(() => {
        const focusedElement = document.activeElement;
        const dialog = screen.getByRole("dialog");
        expect(dialog.contains(focusedElement)).toBe(true);
      });
    });
  });
});
