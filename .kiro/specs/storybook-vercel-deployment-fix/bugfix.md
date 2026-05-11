# Bugfix Requirements Document

## Introduction

The Storybook static files are not accessible on the deployed Vercel website, returning 404 errors when attempting to access `/storybook/iframe.html` and other Storybook assets. While the build process successfully generates Storybook files locally in `out/storybook/` and the local build serves them correctly, Vercel deployments fail to serve these static files. This prevents users from accessing the component documentation and design system through the deployed website.

The root cause is that `public/storybook` is listed in `.gitignore`, meaning these files are not committed to the repository. While the build command (`build:with-storybook`) generates these files during the build process, Vercel's static export handling may not properly include dynamically generated files in the `public` directory during the Next.js build phase.

## Bug Analysis

### Current Behavior (Defect)

1.1 WHEN accessing `/storybook/iframe.html` on the deployed Vercel site THEN the system returns a 404 error

1.2 WHEN accessing any Storybook static asset (e.g., `/storybook/index.html`, `/storybook/*.js`) on Vercel THEN the system returns a 404 error

1.3 WHEN the Next.js build runs with `output: "export"` and Storybook files are copied to `public/storybook` before the build THEN Vercel does not include these files in the final static export

### Expected Behavior (Correct)

2.1 WHEN accessing `/storybook/iframe.html` on the deployed Vercel site THEN the system SHALL serve the Storybook iframe HTML file successfully with a 200 status code

2.2 WHEN accessing any Storybook static asset on Vercel THEN the system SHALL serve the requested file successfully with appropriate content type and 200 status code

2.3 WHEN the build process completes on Vercel THEN the system SHALL include all Storybook static files in the deployment and make them accessible at the `/storybook/` path

### Unchanged Behavior (Regression Prevention)

3.1 WHEN accessing the main website pages (e.g., `/`, `/tech-stack`, `/privacy`) THEN the system SHALL CONTINUE TO serve these pages correctly

3.2 WHEN the local build runs with `npm run build:with-storybook` THEN the system SHALL CONTINUE TO generate and serve Storybook files correctly at `http://localhost:3000/storybook/`

3.3 WHEN Next.js builds with `output: "export"` THEN the system SHALL CONTINUE TO generate a static site in the `out/` directory

3.4 WHEN accessing other static assets in the `public/` directory (e.g., images, icons) THEN the system SHALL CONTINUE TO serve these files correctly on both local and Vercel deployments

## Bug Condition Analysis

### Bug Condition Function

```pascal
FUNCTION isBugCondition(request)
  INPUT: request of type HTTPRequest
  OUTPUT: boolean

  // Returns true when requesting Storybook files on Vercel deployment
  RETURN request.path.startsWith("/storybook/") AND
         request.environment = "vercel-production"
END FUNCTION
```

### Property Specification

```pascal
// Property: Fix Checking - Storybook Files Accessible on Vercel
FOR ALL request WHERE isBugCondition(request) DO
  response ← handleRequest'(request)
  ASSERT response.statusCode = 200 AND
         response.body IS NOT EMPTY AND
         response.contentType IS APPROPRIATE
END FOR
```

### Preservation Property

```pascal
// Property: Preservation Checking - Other Routes Unaffected
FOR ALL request WHERE NOT isBugCondition(request) DO
  ASSERT handleRequest(request) = handleRequest'(request)
END FOR
```

Where:

- **handleRequest**: Original request handling (before fix)
- **handleRequest'**: Fixed request handling (after fix)
- **isBugCondition**: Identifies requests to Storybook files on Vercel

## Technical Context

The issue stems from the interaction between:

1. **Build Process**: `build:with-storybook` → builds Storybook → copies to `public/storybook` → builds Next.js
2. **Static Export**: Next.js `output: "export"` generates static files in `out/`
3. **Vercel Deployment**: Serves files from the `out/` directory
4. **Git Exclusion**: `public/storybook` is in `.gitignore` (not committed)

The timing issue is that files copied to `public/` before the Next.js build may not be properly included in the static export, or Vercel may not recognize dynamically generated public files during the build process.
