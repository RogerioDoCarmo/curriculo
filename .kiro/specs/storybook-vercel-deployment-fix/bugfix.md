# Bugfix Requirements Document

## Introduction

Users cannot access the component documentation and design system on the deployed website. The original approach of deploying Storybook's static HTML files has been abandoned due to security vulnerabilities discovered in Storybook's bundled JavaScript code (CodeQL identified 4 high and 2 medium severity issues including inefficient regex, incomplete string escaping, and prototype pollution).

The new approach is to generate a PDF document containing screenshots and documentation of all Storybook components, and provide a download link on the Tech Stack page. This avoids committing vulnerable third-party code while still making component documentation accessible to users.

## Bug Analysis

### Current Behavior (Defect)

1.1 WHEN a user visits the Tech Stack page THEN the system does NOT provide any way to view component documentation

1.2 WHEN a user wants to see the design system components THEN the system does NOT offer a downloadable PDF with component screenshots and documentation

1.3 WHEN the build process runs THEN the system does NOT generate a Storybook PDF document

### Expected Behavior (Correct)

2.1 WHEN a user visits the Tech Stack page THEN the system SHALL display a button to download the Storybook PDF

2.2 WHEN a user clicks the download button THEN the system SHALL serve a PDF file containing component screenshots and documentation with a 200 status code

2.3 WHEN the build process completes THEN the system SHALL generate a Storybook PDF and include it in the deployment at `/storybook-components.pdf`

### Unchanged Behavior (Regression Prevention)

3.1 WHEN accessing the main website pages (e.g., `/`, `/tech-stack`, `/privacy`) THEN the system SHALL CONTINUE TO serve these pages correctly

3.2 WHEN accessing other static assets in the `public/` directory (e.g., images, icons) THEN the system SHALL CONTINUE TO serve these files correctly on both local and Vercel deployments

3.3 WHEN Next.js builds with `output: "export"` THEN the system SHALL CONTINUE TO generate a static site in the `out/` directory

3.4 WHEN the Tech Stack page renders THEN the system SHALL CONTINUE TO display all existing content correctly

## Bug Condition Analysis

### Bug Condition Function

```pascal
FUNCTION isBugCondition(user)
  INPUT: user visiting Tech Stack page
  OUTPUT: boolean

  // Returns true when user cannot access component documentation
  RETURN user.onTechStackPage = true AND
         NOT EXISTS downloadButton FOR storybookPDF
END FUNCTION
```

### Property Specification

```pascal
// Property: Fix Checking - Storybook PDF Accessible
FOR ALL user WHERE isBugCondition(user) DO
  page ← renderTechStackPage'(user)
  ASSERT EXISTS downloadButton IN page AND
         downloadButton.href = "/storybook-components.pdf" AND
         fileExists("/storybook-components.pdf") = true
END FOR
```

### Preservation Property

```pascal
// Property: Preservation Checking - Other Content Unaffected
FOR ALL content WHERE NOT isStorybookPDFButton(content) DO
  ASSERT renderTechStackPage(content) = renderTechStackPage'(content)
END FOR
```

Where:

- **renderTechStackPage**: Original Tech Stack page rendering (before fix)
- **renderTechStackPage'**: Fixed Tech Stack page rendering (after fix)
- **isBugCondition**: Identifies users who cannot access component documentation
- **isStorybookPDFButton**: Identifies the new download button (the only new element)

## Technical Context

The solution involves:

1. **PDF Generation**: Use Playwright to capture screenshots of all Storybook components and generate a PDF
2. **Build Integration**: Add PDF generation to the build process
3. **UI Addition**: Add a download button to the Tech Stack page
4. **Static Asset**: Place the PDF in `public/` so it's accessible at `/storybook-components.pdf`

**Security Benefits**:

- No vulnerable third-party JavaScript code in the repository
- No CodeQL security alerts from Storybook's bundled code
- Clean, simple PDF file with no executable code

**User Experience**:

- Single-click download of component documentation
- Offline-accessible documentation
- No need for interactive Storybook UI on production site
