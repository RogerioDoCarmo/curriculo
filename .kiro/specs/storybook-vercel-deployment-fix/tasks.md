# Implementation Plan

## Overview

This implementation plan pivots from deploying Storybook HTML files (which have security vulnerabilities) to generating a PDF document containing component screenshots and documentation. The PDF is generated during the build process and made available for download on the Tech Stack page.

**Reason for Pivot**: CodeQL identified 6 security vulnerabilities (4 high, 2 medium) in Storybook's bundled JavaScript code, making it unsuitable for deployment.

---

## Tasks

- [ ] 1. Revert previous implementation changes
  - [ ] 1.1 Revert package.json changes
    - Remove `copy-storybook-to-out` script
    - Revert `build:with-storybook` to original: `npm run build-storybook && npm run copy-storybook && npm run build`
    - This removes the attempted fix that would deploy vulnerable code
    - _Requirements: Clean slate for new approach_

  - [ ] 1.2 Remove test files for old approach
    - Delete `tests/properties/storybook-vercel-bug-condition.test.ts`
    - Delete `tests/properties/storybook-vercel-preservation.test.ts`
    - These tests were for the HTML deployment approach
    - _Requirements: Clean up obsolete tests_

  - [ ] 1.3 Clean build artifacts
    - Run `rm -rf out/storybook` if it exists
    - Run `rm -rf public/storybook` if it exists
    - Ensure clean state for new approach
    - _Requirements: Remove old build artifacts_

- [ ] 2. Install dependencies for PDF generation
  - [ ] 2.1 Add Playwright and PDF dependencies
    - Run `npm install --save-dev @playwright/test pdfkit @types/pdfkit`
    - Install Playwright browsers: `npx playwright install chromium`
    - These are needed for PDF generation
    - _Requirements: 2.3_

  - [ ] 2.2 Update .gitignore
    - Add `public/storybook-components.pdf` to `.gitignore`
    - PDF is generated during build, should not be committed
    - _Requirements: Clean repository practices_

- [ ] 3. Create PDF generation script
  - [ ] 3.1 Create scripts directory and generation script
    - Create `scripts/generate-storybook-pdf.ts`
    - Implement PDF generation logic:
      - Start Storybook server on localhost
      - Use Playwright to navigate to each component
      - Capture screenshots of all components
      - Generate PDF with screenshots and documentation
      - Save to `public/storybook-components.pdf`
    - Include error handling and logging
    - _Requirements: 2.3_

  - [ ] 3.2 Add PDF generation script to package.json
    - Add script: `"generate-storybook-pdf": "tsx scripts/generate-storybook-pdf.ts"`
    - Install `tsx` if needed: `npm install --save-dev tsx`
    - _Requirements: 2.3_

  - [ ] 3.3 Update build:with-storybook script
    - Modify to: `"build:with-storybook": "npm run build-storybook && npm run generate-storybook-pdf && npm run build"`
    - Sequence: build-storybook → generate-pdf → build-next
    - _Requirements: 2.3_

  - [ ] 3.4 Test PDF generation locally
    - Run `npm run generate-storybook-pdf`
    - Verify `public/storybook-components.pdf` is created
    - Open PDF and verify it contains component screenshots
    - Check PDF file size (should be 2-5MB)
    - _Requirements: 2.3_

- [ ] 4. Add download button to Tech Stack page
  - [ ] 4.1 Add translations for download button
    - Update `messages/en.json`: Add `"techStack.downloadStorybook": "Download Component Library (PDF)"`
    - Update `messages/es.json`: Add `"techStack.downloadStorybook": "Descargar Biblioteca de Componentes (PDF)"`
    - Update `messages/pt-BR.json`: Add `"techStack.downloadStorybook": "Baixar Biblioteca de Componentes (PDF)"`
    - _Requirements: 2.1_

  - [ ] 4.2 Update TechStackSection component
    - Open `components/TechStackSection/index.tsx`
    - Add download button after the tech stack grid
    - Use existing Button component with download icon
    - Link to `/storybook-components.pdf`
    - Add `download="storybook-components.pdf"` attribute
    - Style consistently with existing buttons
    - _Requirements: 2.1_

  - [ ] 4.3 Test download button locally
    - Run `npm run build:with-storybook && npm run serve`
    - Visit `http://localhost:3000/tech-stack`
    - Verify download button appears
    - Click button and verify PDF downloads
    - Test on all locales (en, es, pt-BR)
    - _Requirements: 2.1, 2.2_

- [ ] 5. Write tests for PDF approach
  - [ ] 5.1 Write unit tests for download button
    - Create `components/TechStackSection/__tests__/TechStackSection.test.tsx`
    - Test button renders with correct text
    - Test button has correct href and download attributes
    - Test button appears for all locales
    - _Requirements: 2.1_

  - [ ] 5.2 Write integration test for PDF generation
    - Create `tests/integration/storybook-pdf-generation.test.ts`
    - Test PDF file is created during build
    - Test PDF file exists in `public/` directory
    - Test PDF file size is reasonable (< 10MB)
    - _Requirements: 2.3_

  - [ ] 5.3 Write E2E test for PDF download
    - Create `tests/e2e/storybook-pdf-download.spec.ts`
    - Test download button appears on Tech Stack page
    - Test clicking button initiates download
    - Test PDF file is accessible at `/storybook-components.pdf`
    - _Requirements: 2.1, 2.2_

- [ ] 6. Deploy and validate on Vercel
  - [ ] 6.1 Deploy to Vercel preview environment
    - Commit all changes
    - Push to feature branch
    - Wait for Vercel preview deployment
    - Note the preview URL
    - _Requirements: 2.1, 2.2, 2.3_

  - [ ] 6.2 Manual testing on Vercel preview
    - Visit Tech Stack page on preview URL
    - Verify download button appears
    - Click button and verify PDF downloads
    - Open PDF and verify content
    - Test on multiple browsers (Chrome, Firefox, Safari)
    - Test on mobile devices
    - _Requirements: 2.1, 2.2_

  - [ ] 6.3 Verify no security vulnerabilities
    - Check GitHub CodeQL scan results
    - Verify no new security alerts
    - Confirm previous Storybook vulnerabilities are gone
    - _Requirements: Security requirement_

  - [ ] 6.4 Verify main site functionality preserved
    - Visit main pages: `/`, `/en/`, `/es/`, `/tech-stack/`, `/privacy/`, `/cookies/`, `/terms/`
    - Verify all pages load correctly
    - Verify static assets load correctly
    - Verify no console errors
    - _Requirements: 3.1, 3.2, 3.3, 3.4_

  - [ ] 6.5 Check Vercel deployment logs
    - Review build logs
    - Verify `generate-storybook-pdf` script executed successfully
    - Verify PDF was generated and included in deployment
    - Check build time (should add ~30-60 seconds)
    - _Requirements: 2.3_

- [ ] 7. Checkpoint - Ensure all requirements met
  - Run all automated tests
  - Verify PDF downloads correctly on deployed site
  - Verify no security vulnerabilities
  - Verify all existing functionality preserved
  - If any issues arise, document and ask user for guidance
  - Once all tests pass, ready for production deployment

---

## Notes

- **Approach Change**: Pivoted from HTML deployment to PDF generation due to security vulnerabilities
- **Security**: PDF approach avoids CodeQL alerts from Storybook's bundled JavaScript
- **Simplicity**: Single static PDF file, no complex deployment configuration
- **User Experience**: Downloadable PDF for offline access
- **Build Time**: PDF generation adds ~30-60 seconds to build process
- **File Size**: PDF estimated at 2-5MB

## Success Criteria

- [ ] PDF generation script successfully creates PDF with all components
- [ ] PDF file is included in Vercel deployment
- [ ] Download button appears on Tech Stack page in all locales
- [ ] Clicking button downloads PDF correctly
- [ ] PDF opens and displays all component screenshots
- [ ] No security vulnerabilities in CodeQL scan
- [ ] Build process completes successfully
- [ ] All existing functionality preserved
- [ ] All automated tests pass
