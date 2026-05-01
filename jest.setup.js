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
  // Also check if it's an Error object with the jsdom navigation message
  if (args[0] instanceof Error) {
    const errorMsg = args[0].message || "";
    const errorType = args[0].type || "";
    if (errorMsg.includes("Not implemented: navigation") || errorType === "not implemented") {
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
