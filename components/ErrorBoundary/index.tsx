/**
 * Error Boundary component.
 * Catches React rendering errors and logs them to monitoring services.
 *
 * Requirements: 10.5
 */

"use client";

import React from "react";
import { logError } from "@/lib/error-logging";

interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  component?: string;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

export default class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo): void {
    logError(error, {
      component: this.props.component ?? "ErrorBoundary",
      extra: {
        componentStack: info.componentStack ?? "",
      },
    });
  }

  render() {
    if (this.state.hasError) {
      return (
        this.props.fallback ?? (
          <div
            role="alert"
            className="rounded-md border border-red-200 bg-red-50 p-4 text-sm text-red-700 dark:border-red-800 dark:bg-red-950 dark:text-red-300"
          >
            Something went wrong. Please refresh the page.
          </div>
        )
      );
    }

    return this.props.children;
  }
}
