// Jest setup file for configuring the test environment
require("@testing-library/jest-dom");

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

// Suppress noisy but expected console output during tests
const originalError = console.error;
const originalWarn = console.warn;
const originalLog = console.log;

beforeAll(() => {
  // Suppress React 18 act() warnings and FCM/Firebase errors
  console.error = (...args) => {
    if (typeof args[0] === "string") {
      const msg = args[0];
      if (
        (msg.includes("Warning: An update to") && msg.includes("was not wrapped in act")) ||
        msg.includes("[FCM]") ||
        msg.includes("[Firebase]") ||
        msg.includes("[ErrorLogging]")
      ) {
        return;
      }
    }
    originalError.call(console, ...args);
  };

  // Suppress expected service warnings (FCM, Firebase, Analytics, ErrorLogging, domain checks)
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
});

afterAll(() => {
  console.error = originalError;
  console.warn = originalWarn;
  console.log = originalLog;
});
