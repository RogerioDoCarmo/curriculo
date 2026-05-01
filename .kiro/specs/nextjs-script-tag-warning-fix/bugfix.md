# Bugfix Requirements Document

## Introduction

This bugfix addresses a browser console warning that appears when running Next.js 16.2.4 in development mode. The warning states: "Encountered a script tag while rendering React component. Scripts inside React components are never executed when rendering on the client." This warning appears on first page load but not on subsequent refreshes.

The affected code is a critical inline script in `app/[locale]/layout.tsx` (lines 196-204) that prevents Flash of Unstyled Content (FOUC) by applying the theme class to the document before React hydration. While the script functions correctly, Next.js 16 discourages direct `<script>` tags in React components, triggering this warning.

The fix must eliminate the warning while preserving the script's functionality: applying dark mode theme before React hydration to prevent FOUC.

## Bug Analysis

### Current Behavior (Defect)

1.1 WHEN the application loads for the first time in development mode with Next.js 16.2.4 THEN the browser console displays the warning: "Encountered a script tag while rendering React component. Scripts inside React components are never executed when rendering on the client."

1.2 WHEN the inline theme script is rendered inside the `<head>` element of a React component THEN Next.js 16 detects it as a pattern violation and emits a console warning

### Expected Behavior (Correct)

2.1 WHEN the application loads for the first time in development mode with Next.js 16.2.4 THEN the browser console SHALL NOT display any warnings about script tags in React components

2.2 WHEN the theme application script is implemented using Next.js 16-compatible patterns THEN Next.js SHALL NOT emit console warnings about script tag usage

### Unchanged Behavior (Regression Prevention)

3.1 WHEN the page loads and a theme preference ('dark' or 'light') exists in localStorage THEN the system SHALL CONTINUE TO apply that theme class to the document before React hydration

3.2 WHEN the page loads and no theme preference exists in localStorage but the system prefers dark mode THEN the system SHALL CONTINUE TO apply the 'dark' class to the document before React hydration

3.3 WHEN the page loads and the theme script executes THEN the system SHALL CONTINUE TO prevent Flash of Unstyled Content (FOUC) by applying the theme before visible rendering

3.4 WHEN the theme script executes THEN the system SHALL CONTINUE TO handle errors gracefully without breaking page rendering

3.5 WHEN the page loads THEN the Schema.org structured data scripts (personSchema and webSiteSchema) SHALL CONTINUE TO render correctly without warnings
