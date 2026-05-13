# Storybook PDF Documentation Design

## Overview

The original approach of deploying Storybook's static HTML files has been abandoned due to security vulnerabilities in Storybook's bundled JavaScript code. CodeQL identified 6 security issues (4 high, 2 medium severity) including:

- Inefficient regular expressions (exponential backtracking)
- Incomplete string escaping/encoding
- Prototype-polluting functions

The new approach generates a PDF document containing screenshots and documentation of all Storybook components. This PDF is generated during the build process and made available for download on the Tech Stack page.

**Benefits of PDF Approach**:

- **Security**: No vulnerable third-party JavaScript in the repository
- **Simplicity**: Single static file, no complex deployment configuration
- **Accessibility**: Users can download and view offline
- **Clean Repository**: No large build artifacts committed to git

## Glossary

- **Storybook PDF**: A PDF document containing screenshots and documentation of all UI components
- **PDF Generation**: Automated process using Playwright to capture component screenshots
- **Download Button**: UI element on Tech Stack page that links to the PDF
- **Build Integration**: Adding PDF generation to the existing build process
- **Static Asset**: The PDF file placed in `public/` directory for deployment

## Solution Design

### Implementation Approach

Generate a PDF containing Storybook component screenshots and documentation using Playwright's PDF generation capabilities.

**Components**:

1. **PDF Generation Script** (`scripts/generate-storybook-pdf.ts`)
   - Launches Playwright browser
   - Starts local Storybook server
   - Captures screenshots of all components
   - Generates PDF with component documentation
   - Saves to `public/storybook-components.pdf`

2. **Build Integration** (`package.json`)
   - Add `generate-storybook-pdf` script
   - Update `build:with-storybook` to include PDF generation
   - Sequence: build-storybook → generate-pdf → build-next

3. **UI Component** (`components/TechStackSection/index.tsx`)
   - Add download button for Storybook PDF
   - Style consistently with existing buttons
   - Include appropriate icon and label

4. **Translations** (`messages/*.json`)
   - Add translation keys for download button
   - Support all locales (en, es, pt-BR)

### PDF Generation Details

**Technology Stack**:

- **Playwright**: Browser automation for screenshots
- **PDFKit** or **Playwright PDF**: PDF generation
- **Storybook**: Component documentation source

**PDF Structure**:

```
Cover Page
  - Title: "Component Library Documentation"
  - Date generated
  - Project name

Table of Contents
  - List of all components with page numbers

Component Pages (for each component)
  - Component name
  - Description
  - Screenshot of default state
  - Screenshot of variants (if applicable)
  - Props documentation
  - Usage examples
```

**Generation Process**:

1. Start Storybook server on localhost
2. Get list of all stories from Storybook
3. For each story:
   - Navigate to story URL
   - Wait for component to render
   - Capture screenshot
   - Extract component metadata
4. Generate PDF with all screenshots and documentation
5. Save to `public/storybook-components.pdf`
6. Stop Storybook server

### File Structure

```
project/
├── scripts/
│   └── generate-storybook-pdf.ts    # PDF generation script
├── public/
│   └── storybook-components.pdf     # Generated PDF (gitignored)
├── components/
│   └── TechStackSection/
│       └── index.tsx                 # Updated with download button
└── messages/
    ├── en.json                       # English translations
    ├── es.json                       # Spanish translations
    └── pt-BR.json                    # Portuguese translations
```

### Build Process

**Updated Build Sequence**:

```bash
npm run build:with-storybook
  ↓
npm run build-storybook
  → generates storybook-static/
  ↓
npm run generate-storybook-pdf
  → starts storybook server
  → captures screenshots
  → generates public/storybook-components.pdf
  ↓
npm run build
  → Next.js build includes PDF in out/
```

### UI Design

**Download Button on Tech Stack Page**:

```tsx
<Button
  href="/storybook-components.pdf"
  download="storybook-components.pdf"
  variant="secondary"
  icon={<DownloadIcon />}
>
  {t("techStack.downloadStorybook")}
</Button>
```

**Button Placement**:

- Add to Tech Stack section alongside existing content
- Position below the tech stack grid
- Use existing button component for consistency

**Visual Design**:

- Match existing button styles
- Include download icon
- Show file size (optional)
- Responsive design for mobile

## Correctness Properties

**Property 1: PDF Generation**

_For any_ build process execution, the system SHALL generate a PDF file at `public/storybook-components.pdf` containing screenshots and documentation for all Storybook components.

**Validates: Requirements 2.3**

**Property 2: PDF Accessibility**

_For any_ user visiting the Tech Stack page, the system SHALL display a download button that serves the Storybook PDF with a 200 status code and `application/pdf` content type.

**Validates: Requirements 2.1, 2.2**

**Property 3: Preservation**

_For any_ existing content on the Tech Stack page (excluding the new download button), the system SHALL render exactly the same content as before the fix.

**Validates: Requirements 3.1, 3.2, 3.3, 3.4**

## Testing Strategy

### Unit Tests

- Test PDF generation script with mock Storybook data
- Test download button component renders correctly
- Test translations exist for all locales
- Test button click behavior

### Integration Tests

- Test full build process includes PDF generation
- Test PDF file is created in `public/` directory
- Test PDF file is included in Next.js build output
- Test PDF is accessible at `/storybook-components.pdf`

### E2E Tests

- Test download button appears on Tech Stack page
- Test clicking button downloads PDF file
- Test PDF opens correctly in browser
- Test PDF contains expected components

### Manual Testing

- [ ] Run `npm run build:with-storybook`
- [ ] Verify `public/storybook-components.pdf` exists
- [ ] Open PDF and verify content
- [ ] Visit Tech Stack page
- [ ] Click download button
- [ ] Verify PDF downloads correctly
- [ ] Test on multiple browsers
- [ ] Test on mobile devices

## Implementation Notes

### Dependencies

Add to `package.json`:

```json
{
  "devDependencies": {
    "@playwright/test": "^1.40.0",
    "pdfkit": "^0.13.0"
  }
}
```

### .gitignore

Add to `.gitignore`:

```
# Storybook PDF (generated during build)
public/storybook-components.pdf
```

### Security Considerations

- PDF generation runs during build (not at runtime)
- No user input in PDF generation process
- PDF is a static file with no executable code
- No third-party JavaScript vulnerabilities

### Performance Considerations

- PDF generation adds ~30-60 seconds to build time
- PDF file size: estimated 2-5MB
- No impact on runtime performance
- PDF is cached by CDN

## Alternative Approaches Considered

### 1. Deploy Storybook HTML (REJECTED)

- **Reason**: Security vulnerabilities in Storybook's bundled JavaScript
- **Issues**: 4 high + 2 medium severity CodeQL alerts

### 2. Storybook as Separate Subdomain (REJECTED)

- **Reason**: Requires additional infrastructure and configuration
- **Issues**: More complex deployment, separate SSL certificate

### 3. Link to Storybook on Chromatic/Netlify (REJECTED)

- **Reason**: Requires external service and ongoing costs
- **Issues**: Dependency on third-party service

### 4. PDF Generation (SELECTED)

- **Reason**: Simple, secure, no vulnerabilities
- **Benefits**: Offline access, no runtime dependencies, clean repository

## Success Criteria

- [ ] PDF generation script successfully creates PDF with all components
- [ ] PDF file is included in Vercel deployment
- [ ] Download button appears on Tech Stack page
- [ ] Clicking button downloads PDF correctly
- [ ] PDF opens and displays all components
- [ ] No security vulnerabilities in CodeQL scan
- [ ] Build process completes successfully
- [ ] All existing functionality preserved
