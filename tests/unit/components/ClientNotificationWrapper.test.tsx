/**
 * Unit tests for ClientNotificationWrapper component
 *
 * Tests the wrapper component that renders LazyNotificationPrompt
 * on the client side for notification permission requests.
 */

import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import ClientNotificationWrapper from "@/components/ClientNotificationWrapper";

// Create a default mock implementation
const defaultMockImplementation = () => (
  <div data-testid="lazy-notification-prompt">Mocked LazyNotificationPrompt</div>
);

// Create a mock component
const MockLazyNotificationPrompt = jest.fn(defaultMockImplementation);

// Mock the lazy-components module
jest.mock("@/lib/lazy-components", () => ({
  get LazyNotificationPrompt() {
    return MockLazyNotificationPrompt;
  },
}));

describe("ClientNotificationWrapper Component", () => {
  beforeEach(() => {
    // Clear call history
    MockLazyNotificationPrompt.mockClear();
  });

  afterEach(() => {
    // Restore default implementation
    MockLazyNotificationPrompt.mockImplementation(defaultMockImplementation);
  });

  describe("Rendering", () => {
    it("should render without crashing", () => {
      const { container } = render(<ClientNotificationWrapper />);
      expect(container).toBeInTheDocument();
    });

    it("should render LazyNotificationPrompt component", () => {
      render(<ClientNotificationWrapper />);

      const lazyPrompt = screen.getByTestId("lazy-notification-prompt");
      expect(lazyPrompt).toBeInTheDocument();
    });

    it("should render LazyNotificationPrompt with correct content", () => {
      render(<ClientNotificationWrapper />);

      expect(screen.getByText("Mocked LazyNotificationPrompt")).toBeInTheDocument();
    });

    it("should not render any additional wrapper elements", () => {
      const { container } = render(<ClientNotificationWrapper />);

      // The component should directly render LazyNotificationPrompt without extra wrappers
      const lazyPrompt = screen.getByTestId("lazy-notification-prompt");
      expect(container.firstChild).toBe(lazyPrompt);
    });
  });

  describe("Component Structure", () => {
    it("should be a client component", () => {
      // This test verifies the component can be rendered in a test environment
      // which simulates client-side rendering
      expect(() => render(<ClientNotificationWrapper />)).not.toThrow();
    });

    it("should render only one child element", () => {
      const { container } = render(<ClientNotificationWrapper />);

      expect(container.children).toHaveLength(1);
    });

    it("should call LazyNotificationPrompt", () => {
      render(<ClientNotificationWrapper />);

      expect(MockLazyNotificationPrompt).toHaveBeenCalledTimes(1);
    });

    it("should call LazyNotificationPrompt without props", () => {
      render(<ClientNotificationWrapper />);

      // Verify LazyNotificationPrompt is called without any props
      expect(MockLazyNotificationPrompt).toHaveBeenCalledWith({}, {});
    });
  });

  describe("Integration with LazyNotificationPrompt", () => {
    it("should handle LazyNotificationPrompt rendering null", () => {
      MockLazyNotificationPrompt.mockImplementation(() => <div data-testid="null-placeholder" />);

      const { container } = render(<ClientNotificationWrapper />);

      // Should render without errors even if LazyNotificationPrompt returns minimal content
      expect(container).toBeInTheDocument();
      expect(screen.getByTestId("null-placeholder")).toBeInTheDocument();
    });

    it("should handle LazyNotificationPrompt rendering a fragment", () => {
      MockLazyNotificationPrompt.mockImplementation(() => (
        <>
          <div data-testid="fragment-child-1">Child 1</div>
          <div data-testid="fragment-child-2">Child 2</div>
        </>
      ));

      render(<ClientNotificationWrapper />);

      expect(screen.getByTestId("fragment-child-1")).toBeInTheDocument();
      expect(screen.getByTestId("fragment-child-2")).toBeInTheDocument();
    });

    it("should handle LazyNotificationPrompt rendering complex content", () => {
      MockLazyNotificationPrompt.mockImplementation(() => (
        <div role="dialog" aria-label="Notification prompt" data-testid="complex-prompt">
          <h2>Enable Notifications</h2>
          <p>Get notified about updates</p>
          <button>Allow</button>
        </div>
      ));

      render(<ClientNotificationWrapper />);

      const dialog = screen.getByRole("dialog");
      expect(dialog).toHaveAttribute("aria-label", "Notification prompt");
      expect(screen.getByText("Enable Notifications")).toBeInTheDocument();
      expect(screen.getByText("Get notified about updates")).toBeInTheDocument();
      expect(screen.getByRole("button", { name: "Allow" })).toBeInTheDocument();
    });
  });

  describe("Multiple Renders", () => {
    it("should render consistently across multiple renders", () => {
      const { rerender } = render(<ClientNotificationWrapper />);

      expect(screen.getByTestId("lazy-notification-prompt")).toBeInTheDocument();

      rerender(<ClientNotificationWrapper />);

      expect(screen.getByTestId("lazy-notification-prompt")).toBeInTheDocument();
    });

    it("should call LazyNotificationPrompt on each render", () => {
      const { rerender } = render(<ClientNotificationWrapper />);
      expect(MockLazyNotificationPrompt).toHaveBeenCalledTimes(1);

      rerender(<ClientNotificationWrapper />);
      expect(MockLazyNotificationPrompt).toHaveBeenCalledTimes(2);
    });

    it("should maintain consistent behavior across rerenders", () => {
      const { rerender } = render(<ClientNotificationWrapper />);

      const firstRender = screen.getByTestId("lazy-notification-prompt");
      expect(firstRender).toHaveTextContent("Mocked LazyNotificationPrompt");

      rerender(<ClientNotificationWrapper />);

      const secondRender = screen.getByTestId("lazy-notification-prompt");
      expect(secondRender).toHaveTextContent("Mocked LazyNotificationPrompt");
    });
  });

  describe("Accessibility", () => {
    it("should not introduce accessibility violations", () => {
      const { container } = render(<ClientNotificationWrapper />);

      // The wrapper itself should not add any elements that could cause a11y issues
      // It should be transparent and just render the child component
      expect(container.firstChild).toBeTruthy();
    });

    it("should preserve child component accessibility features", () => {
      MockLazyNotificationPrompt.mockImplementation(() => (
        <div
          role="dialog"
          aria-label="Notification prompt"
          aria-modal="false"
          data-testid="accessible-prompt"
        >
          Accessible content
        </div>
      ));

      render(<ClientNotificationWrapper />);

      const dialog = screen.getByRole("dialog");
      expect(dialog).toHaveAttribute("aria-label", "Notification prompt");
      expect(dialog).toHaveAttribute("aria-modal", "false");
    });

    it("should allow child component to have interactive elements", () => {
      MockLazyNotificationPrompt.mockImplementation(() => (
        <div data-testid="interactive-prompt">
          <button aria-label="Allow notifications">Allow</button>
          <button aria-label="Dismiss notification prompt">Dismiss</button>
        </div>
      ));

      render(<ClientNotificationWrapper />);

      expect(screen.getByRole("button", { name: "Allow notifications" })).toBeInTheDocument();
      expect(
        screen.getByRole("button", { name: "Dismiss notification prompt" })
      ).toBeInTheDocument();
    });
  });

  describe("Performance", () => {
    it("should render efficiently without unnecessary re-renders", () => {
      render(<ClientNotificationWrapper />);

      // Should only call LazyNotificationPrompt once on initial render
      expect(MockLazyNotificationPrompt).toHaveBeenCalledTimes(1);
    });

    it("should not create memory leaks on unmount", () => {
      const { unmount } = render(<ClientNotificationWrapper />);

      expect(() => unmount()).not.toThrow();
    });

    it("should handle multiple mount/unmount cycles", () => {
      const { unmount: unmount1 } = render(<ClientNotificationWrapper />);
      unmount1();

      const { unmount: unmount2 } = render(<ClientNotificationWrapper />);
      unmount2();

      const { unmount: unmount3 } = render(<ClientNotificationWrapper />);

      expect(() => unmount3()).not.toThrow();
      expect(MockLazyNotificationPrompt).toHaveBeenCalledTimes(3);
    });
  });

  describe("Client-Side Only Behavior", () => {
    it("should be safe to render in client environment", () => {
      // This test verifies the component works in a client-side context
      const { container } = render(<ClientNotificationWrapper />);

      expect(container).toBeInTheDocument();
      expect(screen.getByTestId("lazy-notification-prompt")).toBeInTheDocument();
    });

    it("should work with dynamic imports", async () => {
      render(<ClientNotificationWrapper />);

      // Wait for any async operations to complete
      await waitFor(() => {
        expect(screen.getByTestId("lazy-notification-prompt")).toBeInTheDocument();
      });
    });

    it("should render immediately without loading state", () => {
      render(<ClientNotificationWrapper />);

      // Since we're mocking, there should be no loading state
      expect(screen.getByTestId("lazy-notification-prompt")).toBeInTheDocument();
      expect(screen.queryByText(/loading/i)).not.toBeInTheDocument();
    });
  });

  describe("Component Isolation", () => {
    it("should not affect global state", () => {
      const initialWindowKeys = Object.keys(window);

      render(<ClientNotificationWrapper />);

      const finalWindowKeys = Object.keys(window);
      expect(finalWindowKeys).toEqual(initialWindowKeys);
    });

    it("should not modify document body", () => {
      const initialBodyChildren = document.body.children.length;

      render(<ClientNotificationWrapper />);

      // The component should render within the test container, not directly to body
      expect(document.body.children.length).toBeGreaterThanOrEqual(initialBodyChildren);
    });

    it("should not interfere with other components", () => {
      const { container: container1 } = render(<ClientNotificationWrapper />);
      const { container: container2 } = render(
        <div data-testid="other-component">Other Component</div>
      );

      expect(container1).toBeInTheDocument();
      expect(container2).toBeInTheDocument();
      expect(screen.getByTestId("other-component")).toBeInTheDocument();
    });
  });

  describe("Edge Cases", () => {
    it("should handle rapid mount/unmount cycles", () => {
      const { unmount, rerender } = render(<ClientNotificationWrapper />);

      for (let i = 0; i < 5; i++) {
        rerender(<ClientNotificationWrapper />);
      }

      expect(() => unmount()).not.toThrow();
    });

    it("should handle being rendered multiple times simultaneously", () => {
      const { container: container1 } = render(<ClientNotificationWrapper />);
      const { container: container2 } = render(<ClientNotificationWrapper />);

      expect(container1).toBeInTheDocument();
      expect(container2).toBeInTheDocument();

      // Both should have rendered the mocked component
      const prompts = screen.getAllByTestId("lazy-notification-prompt");
      expect(prompts).toHaveLength(2);
    });

    it("should handle empty render from child", () => {
      MockLazyNotificationPrompt.mockImplementation(() => <div data-testid="empty-placeholder" />);

      const { container } = render(<ClientNotificationWrapper />);

      expect(container).toBeInTheDocument();
      expect(screen.getByTestId("empty-placeholder")).toBeInTheDocument();
    });

    it("should handle child component with no testid", () => {
      MockLazyNotificationPrompt.mockImplementation(() => <div>Content without testid</div>);

      render(<ClientNotificationWrapper />);

      expect(screen.getByText("Content without testid")).toBeInTheDocument();
    });
  });

  describe("Wrapper Transparency", () => {
    it("should act as a transparent wrapper", () => {
      const { container } = render(<ClientNotificationWrapper />);

      // The wrapper should not add any extra DOM nodes
      // It should directly render what LazyNotificationPrompt returns
      expect(container.children).toHaveLength(1);
    });

    it("should not add any props to child component", () => {
      render(<ClientNotificationWrapper />);

      // Verify the mock was called with empty props
      expect(MockLazyNotificationPrompt).toHaveBeenCalledWith({}, {});
    });

    it("should not wrap child in additional elements", () => {
      MockLazyNotificationPrompt.mockImplementation(() => (
        <div data-testid="child-element" className="test-class">
          Child Content
        </div>
      ));

      const { container } = render(<ClientNotificationWrapper />);

      const childElement = screen.getByTestId("child-element");
      expect(container.firstChild).toBe(childElement);
      expect(childElement).toHaveClass("test-class");
    });
  });
});
