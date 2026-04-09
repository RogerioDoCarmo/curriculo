/**
 * Custom Jest environment that makes window.location configurable.
 *
 * jsdom 26+ marks window.location as [LegacyUnforgeable] (non-configurable).
 * Tests need to redefine it via Object.defineProperty to mock hash changes.
 *
 * Strategy: Patch the jsdom Window.js module source before it's loaded
 * by intercepting require() calls.
 */

// Patch jsdom's Window.js to make location configurable before it's loaded
const Module = require("module");
const path = require("path");
const fs = require("fs");

const windowJsPath = path.resolve(__dirname, "node_modules/jsdom/lib/jsdom/browser/Window.js");

// Override the compile step for Window.js to patch the source
const originalCompile = Module.prototype._compile;
Module.prototype._compile = function (content, filename) {
  if (filename === windowJsPath) {
    // Make location configurable so tests can redefine it
    content = content.replace(
      "location: { configurable: false },",
      "location: { configurable: true },"
    );
  }
  return originalCompile.call(this, content, filename);
};

const JSDOMEnvironment =
  require("jest-environment-jsdom").default || require("jest-environment-jsdom");

// Restore the original compile
Module.prototype._compile = originalCompile;

module.exports = JSDOMEnvironment;
