// Jest setup file for configuring the test environment
require("@testing-library/jest-dom");

// Suppress noisy but expected console output during tests - MUST BE BEFORE OTHER CODE
const originalError = console.error;
const originalWarn = console.warn;
const originalLog = console.log;

// Override console.error immediately to suppress jsdom navigation errors
console.error = (...args) => {
  if (typeof args[0] === "string") {
    const msg = args[0];
    if (
      (msg.includes("Warning: An update to") && msg.includes("was not wrapped in act")) ||
      msg.includes("[FCM]") ||
      msg.includes("[Firebase]") ||
      msg.includes("[ErrorLogging]") ||
      msg.includes("Not implemented: navigation")
    ) {
      return;
    }
  }
  // Also check if it's an Error-like object (may be from a different vm realm)
  if (args[0] && typeof args[0].message === "string") {
    if (
      args[0].message.includes("Not implemented: navigation") ||
      args[0].type === "not implemented"
    ) {
      return;
    }
  }
  originalError.call(console, ...args);
};

// Suppress expected service warnings
console.warn = (...args) => {
  if (typeof args[0] === "string") {
    const msg = args[0];
    if (
      msg.includes("[FCM]") ||
      msg.includes("[Firebase]") ||
      msg.includes("[Analytics]") ||
      msg.includes("[ErrorLogging]") ||
      msg.includes("⚠️  Only") ||
      msg.includes("⚠️  Domain") ||
      msg.includes("⚠️  Skipping")
    ) {
      return;
    }
  }
  originalWarn.call(console, ...args);
};

// Suppress expected FCM info logs
console.log = (...args) => {
  if (typeof args[0] === "string" && args[0].includes("[FCM]")) {
    return;
  }
  originalLog.call(console, ...args);
};

// Mock IntersectionObserver for tests
global.IntersectionObserver = class IntersectionObserver {
  constructor() {}
  disconnect() {}
  observe() {}
  takeRecords() {
    return [];
  }
  unobserve() {}
};

// Mock ResizeObserver for tests
global.ResizeObserver = class ResizeObserver {
  constructor() {}
  disconnect() {}
  observe() {}
  unobserve() {}
};

// Mock HTMLDialogElement.showModal/close for tests (jsdom doesn't implement
// the native <dialog> element's imperative API). Also simulates the browser's
// native ESC -> "cancel" -> "close" sequence, and the native
// autofocus-first-focusable-descendant / restore-focus-on-close behavior, so
// existing keyboard/focus-driven tests and cancel-suppression behavior (e.g.
// non-dismissible dialogs) keep working without real-browser-only coverage.
if (!HTMLDialogElement.prototype.showModal) {
  HTMLDialogElement.prototype.showModal = function () {
    this.setAttribute("open", "");
    this._previouslyFocused = document.activeElement;
    const focusable = this.querySelector(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    (focusable || this).focus();
    this._escHandler = (e) => {
      if (e.key === "Escape") {
        const notPrevented = this.dispatchEvent(new Event("cancel", { cancelable: true }));
        if (notPrevented) this.close();
      }
    };
    document.addEventListener("keydown", this._escHandler);
  };
  HTMLDialogElement.prototype.close = function () {
    this.removeAttribute("open");
    if (this._escHandler) {
      document.removeEventListener("keydown", this._escHandler);
      this._escHandler = null;
    }
    this._previouslyFocused?.focus?.();
    this._previouslyFocused = null;
    this.dispatchEvent(new Event("close"));
  };
}

// Mock Element.scrollIntoView (jsdom has no layout, so it is unimplemented).
Element.prototype.scrollIntoView = jest.fn();

// Reset the URL between tests. jsdom shares one window — and therefore one
// location — across every test in a file, so a component that writes to the URL
// (e.g. ProjectsSection pushing `?project=<id>` when a dialog opens) would leak
// that state into the next test and change how it renders on mount.
// Guarded because some suites (e.g. useAnchorNavigation) swap window.history
// for a partial stub of their own.
beforeEach(() => {
  if (typeof window.history?.replaceState === "function") {
    window.history.replaceState(null, "", "/");
  }
});

// Mock window.matchMedia for tests
Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: jest.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(), // deprecated
    removeListener: jest.fn(), // deprecated
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

// Restore original console methods after all tests
afterAll(() => {
  console.error = originalError;
  console.warn = originalWarn;
  console.log = originalLog;
});
