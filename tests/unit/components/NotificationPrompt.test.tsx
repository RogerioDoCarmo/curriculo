/**
 * Unit tests for NotificationPrompt component
 */

import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import NotificationPrompt from "@/components/NotificationPrompt";
import * as notifications from "@/lib/notifications";

// Mock the notifications module
jest.mock("@/lib/notifications", () => ({
  requestNotificationPermission: jest.fn(),
  subscribeToTopic: jest.fn(),
}));

describe("NotificationPrompt Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
    sessionStorage.clear();

    // Mock Notification API
    Object.defineProperty(window, "Notification", {
      writable: true,
      value: {
        permission: "default",
        requestPermission: jest.fn(),
      },
    });
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });

  it("does not render initially", () => {
    render(<NotificationPrompt />);

    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("renders after 10 seconds", async () => {
    render(<NotificationPrompt />);

    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();

    // Fast-forward 10 seconds
    jest.advanceTimersByTime(10000);

    await waitFor(() => {
      expect(screen.getByRole("dialog")).toBeInTheDocument();
    });
  });

  it("does not render if Notification API is not supported", () => {
    // Remove Notification API
    const originalNotification = window.Notification;
    // @ts-expect-error - Testing unsupported environment
    delete window.Notification;

    render(<NotificationPrompt />);

    jest.advanceTimersByTime(10000);

    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();

    // Restore
    window.Notification = originalNotification;
  });

  it("does not render if permission is already granted", () => {
    Object.defineProperty(window.Notification, "permission", {
      writable: true,
      value: "granted",
    });

    render(<NotificationPrompt />);

    jest.advanceTimersByTime(10000);

    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("does not render if permission is denied", () => {
    Object.defineProperty(window.Notification, "permission", {
      writable: true,
      value: "denied",
    });

    render(<NotificationPrompt />);

    jest.advanceTimersByTime(10000);

    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("does not render if previously dismissed in session", () => {
    sessionStorage.setItem("notification-prompt-dismissed", "true");

    render(<NotificationPrompt />);

    jest.advanceTimersByTime(10000);

    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("renders prompt message", async () => {
    render(<NotificationPrompt />);

    jest.advanceTimersByTime(10000);

    await waitFor(() => {
      expect(screen.getByText(/get notified about new projects and updates/i)).toBeInTheDocument();
    });
  });

  it("renders Allow and No thanks buttons", async () => {
    render(<NotificationPrompt />);

    jest.advanceTimersByTime(10000);

    await waitFor(() => {
      expect(screen.getByRole("button", { name: /allow/i })).toBeInTheDocument();
      expect(
        screen.getByRole("button", { name: /dismiss notification prompt/i })
      ).toBeInTheDocument();
    });
  });

  it("calls requestNotificationPermission when Allow is clicked", async () => {
    const user = userEvent.setup({ delay: null });
    (notifications.requestNotificationPermission as jest.Mock).mockResolvedValue({
      status: "granted",
    });

    render(<NotificationPrompt />);

    jest.advanceTimersByTime(10000);

    await waitFor(() => {
      expect(screen.getByRole("dialog")).toBeInTheDocument();
    });

    const allowButton = screen.getByRole("button", { name: /allow/i });
    await user.click(allowButton);

    expect(notifications.requestNotificationPermission).toHaveBeenCalled();
  });

  it("subscribes to deployments topic when permission is granted", async () => {
    const user = userEvent.setup({ delay: null });
    (notifications.requestNotificationPermission as jest.Mock).mockResolvedValue({
      status: "granted",
    });
    (notifications.subscribeToTopic as jest.Mock).mockResolvedValue(true);

    render(<NotificationPrompt />);

    jest.advanceTimersByTime(10000);

    await waitFor(() => {
      expect(screen.getByRole("dialog")).toBeInTheDocument();
    });

    const allowButton = screen.getByRole("button", { name: /allow/i });
    await user.click(allowButton);

    await waitFor(() => {
      expect(notifications.subscribeToTopic).toHaveBeenCalledWith("deployments");
    });
  });

  it("hides prompt after Allow is clicked", async () => {
    const user = userEvent.setup({ delay: null });
    (notifications.requestNotificationPermission as jest.Mock).mockResolvedValue({
      status: "granted",
    });

    render(<NotificationPrompt />);

    jest.advanceTimersByTime(10000);

    await waitFor(() => {
      expect(screen.getByRole("dialog")).toBeInTheDocument();
    });

    const allowButton = screen.getByRole("button", { name: /allow/i });
    await user.click(allowButton);

    await waitFor(() => {
      expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    });
  });

  it("hides prompt and sets session storage when No thanks is clicked", async () => {
    const user = userEvent.setup({ delay: null });

    render(<NotificationPrompt />);

    jest.advanceTimersByTime(10000);

    await waitFor(() => {
      expect(screen.getByRole("dialog")).toBeInTheDocument();
    });

    const dismissButton = screen.getByRole("button", { name: /dismiss notification prompt/i });
    await user.click(dismissButton);

    await waitFor(() => {
      expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    });

    expect(sessionStorage.getItem("notification-prompt-dismissed")).toBe("true");
  });

  it("has correct ARIA attributes", async () => {
    render(<NotificationPrompt />);

    jest.advanceTimersByTime(10000);

    await waitFor(() => {
      const dialog = screen.getByRole("dialog");
      expect(dialog).toHaveAttribute("aria-label", "Notification permission request");
      expect(dialog).toHaveAttribute("aria-modal", "false");
    });
  });

  it("dismiss button has correct ARIA label", async () => {
    render(<NotificationPrompt />);

    jest.advanceTimersByTime(10000);

    await waitFor(() => {
      const dismissButton = screen.getByRole("button", { name: /dismiss notification prompt/i });
      expect(dismissButton).toBeInTheDocument();
    });
  });

  it("has correct styling classes", async () => {
    render(<NotificationPrompt />);

    jest.advanceTimersByTime(10000);

    await waitFor(() => {
      const dialog = screen.getByRole("dialog");
      expect(dialog).toHaveClass("fixed");
      expect(dialog).toHaveClass("bottom-4");
      expect(dialog).toHaveClass("left-4");
      expect(dialog).toHaveClass("z-50");
    });
  });

  it("does not subscribe to topic if permission is denied", async () => {
    const user = userEvent.setup({ delay: null });
    (notifications.requestNotificationPermission as jest.Mock).mockResolvedValue({
      status: "denied",
    });

    render(<NotificationPrompt />);

    jest.advanceTimersByTime(10000);

    await waitFor(() => {
      expect(screen.getByRole("dialog")).toBeInTheDocument();
    });

    const allowButton = screen.getByRole("button", { name: /allow/i });
    await user.click(allowButton);

    await waitFor(() => {
      expect(notifications.subscribeToTopic).not.toHaveBeenCalled();
    });
  });
});
