/**
 * Unit tests for NotificationPrompt component and notification permission flow.
 *
 * Task 11.7: Write unit tests for notification permission flow
 * - Test permission request handling
 * - Test foreground notification display
 * - Test notification dismissal
 */

import React from "react";
import { render, screen, waitFor, act } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

// Mock notifications lib
const mockRequestNotificationPermission = jest.fn();
jest.mock("@/lib/notifications", () => ({
  requestNotificationPermission: mockRequestNotificationPermission,
  setupForegroundNotifications: jest.fn(() => () => {}),
}));

import NotificationPrompt from "@/components/NotificationPrompt";

// ─── Helpers ──────────────────────────────────────────────────────────────────

function setupNotificationMock(permission: NotificationPermission = "default") {
  Object.defineProperty(window, "Notification", {
    writable: true,
    value: {
      permission,
      requestPermission: jest.fn().mockResolvedValue(permission),
    },
  });
}

// ─── Tests ────────────────────────────────────────────────────────────────────

describe("NotificationPrompt Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
    sessionStorage.clear();
    setupNotificationMock("default");
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  describe("Visibility", () => {
    it("does not render immediately on mount", () => {
      render(<NotificationPrompt />);
      expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    });

    it("renders after 10 seconds when permission is default", async () => {
      render(<NotificationPrompt />);
      act(() => jest.advanceTimersByTime(10_000));
      await waitFor(() => {
        expect(screen.getByRole("dialog")).toBeInTheDocument();
      });
    });

    it("does not render when permission is already granted", () => {
      setupNotificationMock("granted");
      render(<NotificationPrompt />);
      act(() => jest.advanceTimersByTime(10_000));
      expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    });

    it("does not render when permission is already denied", () => {
      setupNotificationMock("denied");
      render(<NotificationPrompt />);
      act(() => jest.advanceTimersByTime(10_000));
      expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    });

    it("does not render when previously dismissed in session", () => {
      sessionStorage.setItem("notification-prompt-dismissed", "true");
      render(<NotificationPrompt />);
      act(() => jest.advanceTimersByTime(10_000));
      expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    });
  });

  describe("Permission request handling", () => {
    it("calls requestNotificationPermission when Allow is clicked", async () => {
      const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
      mockRequestNotificationPermission.mockResolvedValueOnce({
        status: "granted",
        token: "mock-token",
      });

      render(<NotificationPrompt />);
      act(() => jest.advanceTimersByTime(10_000));

      await waitFor(() => {
        expect(screen.getByRole("dialog")).toBeInTheDocument();
      });

      await user.click(screen.getByRole("button", { name: /allow/i }));

      expect(mockRequestNotificationPermission).toHaveBeenCalledTimes(1);
    });

    it("hides the prompt after clicking Allow", async () => {
      const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
      mockRequestNotificationPermission.mockResolvedValueOnce({ status: "granted" });

      render(<NotificationPrompt />);
      act(() => jest.advanceTimersByTime(10_000));

      await waitFor(() => {
        expect(screen.getByRole("dialog")).toBeInTheDocument();
      });

      await user.click(screen.getByRole("button", { name: /allow/i }));

      await waitFor(() => {
        expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
      });
    });
  });

  describe("Notification dismissal", () => {
    it("hides the prompt when No thanks is clicked", async () => {
      const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });

      render(<NotificationPrompt />);
      act(() => jest.advanceTimersByTime(10_000));

      await waitFor(() => {
        expect(screen.getByRole("dialog")).toBeInTheDocument();
      });

      await user.click(screen.getByRole("button", { name: /dismiss notification prompt/i }));

      await waitFor(() => {
        expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
      });
    });

    it("saves dismissal to sessionStorage when No thanks is clicked", async () => {
      const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });

      render(<NotificationPrompt />);
      act(() => jest.advanceTimersByTime(10_000));

      await waitFor(() => {
        expect(screen.getByRole("dialog")).toBeInTheDocument();
      });

      await user.click(screen.getByRole("button", { name: /dismiss notification prompt/i }));

      expect(sessionStorage.getItem("notification-prompt-dismissed")).toBe("true");
    });

    it("does not call requestNotificationPermission when dismissed", async () => {
      const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });

      render(<NotificationPrompt />);
      act(() => jest.advanceTimersByTime(10_000));

      await waitFor(() => {
        expect(screen.getByRole("dialog")).toBeInTheDocument();
      });

      await user.click(screen.getByRole("button", { name: /dismiss notification prompt/i }));

      expect(mockRequestNotificationPermission).not.toHaveBeenCalled();
    });
  });

  describe("Accessibility", () => {
    it("renders with role=dialog and aria-label", async () => {
      render(<NotificationPrompt />);
      act(() => jest.advanceTimersByTime(10_000));

      await waitFor(() => {
        const dialog = screen.getByRole("dialog");
        expect(dialog).toHaveAttribute("aria-label");
      });
    });

    it("dismiss button has accessible label", async () => {
      render(<NotificationPrompt />);
      act(() => jest.advanceTimersByTime(10_000));

      await waitFor(() => {
        expect(
          screen.getByRole("button", { name: /dismiss notification prompt/i })
        ).toBeInTheDocument();
      });
    });
  });
});
