# Bugfix Requirements Document

## Introduction

This document specifies the requirements for fixing E2E test failures caused by the cookie consent banner blocking interactions with UI elements. The bug affects 109 out of 480 E2E tests across multiple browsers (Chromium, Firefox, Webkit, Mobile Chrome, Mobile Safari), preventing proper validation of application functionality and blocking the CI/CD pipeline.

The cookie consent banner appears on first visit with a backdrop overlay (z-index: 50) that intercepts pointer events, preventing test interactions with form elements, buttons, and other UI components beneath it. This creates a systematic test failure pattern where tests timeout waiting to interact with elements that are technically present but unreachable due to the modal overlay.

## Bug Analysis

### Current Behavior (Defect)

**1. Cookie Banner Pointer Event Interception**

1.1 WHEN E2E tests run on the cookie consent banner test suite THEN the system encounters strict mode violations where generic selectors (e.g., `getByText(/cookies/i)`) match multiple elements within the banner, causing test failures

1.2 WHEN E2E tests attempt to interact with the customize view THEN the system fails to find expected checkboxes and customize functionality, resulting in "element not found" errors

1.3 WHEN E2E tests run on Webkit browsers navigating from `/` to `/pt-BR/` THEN the system encounters "page navigation interrupted" errors

1.4 WHEN E2E tests verify keyboard navigation and focus management THEN the system fails to detect proper focus on accept buttons and focus trap behavior

**2. Email Form Test Failures**

1.5 WHEN E2E tests attempt to click the submit button on the main page email form THEN the system times out because the cookie consent dialog backdrop intercepts pointer events, preventing the click from reaching the submit button

1.6 WHEN E2E tests attempt to submit the email form with empty fields THEN the system cannot trigger validation errors because the submit button click is blocked by the cookie banner overlay

1.7 WHEN E2E tests attempt to submit valid email data THEN the system cannot complete the submission flow because the cookie banner prevents interaction with the form

**3. Exit Intent Modal Test Failures**

1.8 WHEN E2E tests on Webkit browsers attempt to click the "Contact me" button in the exit intent modal THEN the system times out because the cookie consent banner intercepts the pointer event

### Expected Behavior (Correct)

**1. Cookie Banner Test Suite Fixes**

2.1 WHEN E2E tests run on the cookie consent banner test suite THEN the system SHALL use specific selectors (e.g., `getByRole("heading", { name: /cookies/i })` or `.first()`) to avoid strict mode violations

2.2 WHEN E2E tests attempt to interact with the customize view THEN the system SHALL either find the actual customize UI components or skip tests for non-existent features with clear documentation

2.3 WHEN E2E tests run on Webkit browsers THEN the system SHALL use explicit locale paths (e.g., `/pt-BR`, `/en`) instead of relying on redirects from `/` to avoid navigation interruption errors

2.4 WHEN E2E tests verify keyboard navigation and focus management THEN the system SHALL correctly detect focus states and focus trap behavior according to the actual implementation

**2. Email Form Test Fixes**

2.5 WHEN E2E tests run on the main page email form THEN the system SHALL dismiss the cookie consent banner in the `beforeEach` hook before attempting any form interactions

2.6 WHEN E2E tests attempt to click the submit button THEN the system SHALL successfully trigger the click event without timeout errors because the cookie banner has been dismissed

2.7 WHEN E2E tests attempt to submit the email form with empty or valid data THEN the system SHALL complete the interaction flow and verify the expected validation errors or success messages

**3. Exit Intent Modal Test Fixes**

2.8 WHEN E2E tests attempt to interact with the exit intent modal THEN the system SHALL dismiss the cookie banner before triggering the exit intent, ensuring all modal interactions succeed without pointer event interception

### Unchanged Behavior (Regression Prevention)

**1. Cookie Banner Functionality**

3.1 WHEN users visit the website for the first time THEN the system SHALL CONTINUE TO display the cookie consent banner with proper ARIA attributes and modal behavior

3.2 WHEN users interact with the cookie banner (accept, reject, customize) THEN the system SHALL CONTINUE TO persist their preferences in localStorage and respect those preferences across page reloads

3.3 WHEN users accept or reject cookies THEN the system SHALL CONTINUE TO enable or disable Firebase Analytics tracking according to their consent choice

**2. Email Form Functionality**

3.4 WHEN users interact with the email form on the main page THEN the system SHALL CONTINUE TO validate input, submit data to Formspree, and display success or error messages

3.5 WHEN users trigger the exit intent modal THEN the system SHALL CONTINUE TO display the modal with the email form and handle submissions correctly

**3. Multi-language and Accessibility**

3.6 WHEN users visit the website in different locales (pt-BR, en, es) THEN the system SHALL CONTINUE TO display the cookie banner and all UI elements in the correct language

3.7 WHEN users navigate the cookie banner with keyboard THEN the system SHALL CONTINUE TO provide proper keyboard navigation, focus management, and ARIA labels for screen readers

**4. Test Infrastructure**

3.8 WHEN E2E tests use the `dismissCookieBanner` helper function THEN the system SHALL CONTINUE TO provide the existing helper functionality for accepting or rejecting the banner

3.9 WHEN E2E tests run on non-affected test suites THEN the system SHALL CONTINUE TO pass without any changes to their test setup or assertions

3.10 WHEN E2E tests run across different browsers (Chromium, Firefox, Webkit, Mobile Chrome, Mobile Safari) THEN the system SHALL CONTINUE TO execute consistently with browser-specific considerations handled appropriately
