/**
 * Unit tests for ErrorBoundary component
 */

import React from "react";
import { render, screen } from "@testing-library/react";
import ErrorBoundary from "@/components/ErrorBoundary";
import * as errorLogging from "@/lib/error-logging";

// Mock the error logging module
jest.mock("@/lib/error-logging", () => ({
  logError: jest.fn(),
}));

// Component that throws an error
const ThrowError = ({ shouldThrow }: { shouldThrow: boolean }) => {
  if (shouldThrow) {
    throw new Error("Test error");
  }
  return <div>No error</div>;
};

describe("ErrorBoundary Component", () => {
  // Suppress console.error for these tests since we're intentionally throwing errors
  const originalError = console.error;
  beforeAll(() => {
    console.error = jest.fn();
  });

  afterAll(() => {
    console.error = originalError;
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders children when there is no error", () => {
    render(
      <ErrorBoundary>
        <div>Test content</div>
      </ErrorBoundary>
    );

    expect(screen.getByText("Test content")).toBeInTheDocument();
  });

  it("renders fallback UI when an error occurs", () => {
    render(
      <ErrorBoundary>
        <ThrowError shouldThrow={true} />
      </ErrorBoundary>
    );

    expect(screen.getByRole("alert")).toBeInTheDocument();
    expect(screen.getByText(/something went wrong/i)).toBeInTheDocument();
  });

  it("renders custom fallback when provided", () => {
    const customFallback = <div role="alert">Custom error message</div>;

    render(
      <ErrorBoundary fallback={customFallback}>
        <ThrowError shouldThrow={true} />
      </ErrorBoundary>
    );

    expect(screen.getByText("Custom error message")).toBeInTheDocument();
  });

  it("logs error when an error occurs", () => {
    render(
      <ErrorBoundary component="TestComponent">
        <ThrowError shouldThrow={true} />
      </ErrorBoundary>
    );

    expect(errorLogging.logError).toHaveBeenCalledWith(
      expect.any(Error),
      expect.objectContaining({
        component: "TestComponent",
        extra: expect.objectContaining({
          componentStack: expect.any(String),
        }),
      })
    );
  });

  it("uses default component name when not provided", () => {
    render(
      <ErrorBoundary>
        <ThrowError shouldThrow={true} />
      </ErrorBoundary>
    );

    expect(errorLogging.logError).toHaveBeenCalledWith(
      expect.any(Error),
      expect.objectContaining({
        component: "ErrorBoundary",
      })
    );
  });

  it("default fallback has correct styling", () => {
    render(
      <ErrorBoundary>
        <ThrowError shouldThrow={true} />
      </ErrorBoundary>
    );

    const alert = screen.getByRole("alert");
    expect(alert).toHaveClass("rounded-md");
    expect(alert).toHaveClass("border");
    expect(alert).toHaveClass("border-red-200");
    expect(alert).toHaveClass("bg-red-50");
  });

  it("default fallback has dark mode classes", () => {
    render(
      <ErrorBoundary>
        <ThrowError shouldThrow={true} />
      </ErrorBoundary>
    );

    const alert = screen.getByRole("alert");
    expect(alert).toHaveClass("dark:border-red-800");
    expect(alert).toHaveClass("dark:bg-red-950");
    expect(alert).toHaveClass("dark:text-red-300");
  });

  it("renders multiple children when no error", () => {
    render(
      <ErrorBoundary>
        <div>First child</div>
        <div>Second child</div>
      </ErrorBoundary>
    );

    expect(screen.getByText("First child")).toBeInTheDocument();
    expect(screen.getByText("Second child")).toBeInTheDocument();
  });

  it("catches errors from nested components", () => {
    const NestedComponent = () => {
      return (
        <div>
          <ThrowError shouldThrow={true} />
        </div>
      );
    };

    render(
      <ErrorBoundary>
        <NestedComponent />
      </ErrorBoundary>
    );

    expect(screen.getByRole("alert")).toBeInTheDocument();
    expect(errorLogging.logError).toHaveBeenCalled();
  });

  it("includes component stack in error log", () => {
    render(
      <ErrorBoundary component="TestBoundary">
        <ThrowError shouldThrow={true} />
      </ErrorBoundary>
    );

    const logErrorCall = (errorLogging.logError as jest.Mock).mock.calls[0];
    expect(logErrorCall[1].extra.componentStack).toBeDefined();
    expect(typeof logErrorCall[1].extra.componentStack).toBe("string");
  });
});
