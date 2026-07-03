# Resume Files

This directory contains PDF resume files for all supported locales.

## Current Setup

Each locale has its own PDF. `resume-pt-BR.pdf` is the default/standard file —
it's used as the fallback whenever a locale has no dedicated PDF, or when the
`use_locale_specific_pdfs` feature flag is disabled.

## Files

- `resume-pt-BR.pdf` - Portuguese (Brazil) resume — **default/fallback file**
- `resume-en.pdf` - English resume
- `resume-es.pdf` - Spanish resume

## Requirements

- PDFs should be optimized for web (compressed)
- PDFs should be searchable (text-based, not scanned images)
- File size should be kept under 2MB for fast downloads
- PDFs should follow professional resume formatting

## Adding Your Resume

1. Place your PDF file in this directory as `resume-pt-BR.pdf` (the default)
2. Optionally, create locale-specific versions (`resume-en.pdf`, `resume-es.pdf`)
3. The application automatically selects the locale-specific version, falling back
   to `resume-pt-BR.pdf` if one isn't available

## Updating Resumes

To update a resume:

1. Export your resume as PDF from your preferred tool
2. Optimize the PDF using a tool like Adobe Acrobat or online compressor
3. Replace the corresponding file in this directory
4. Commit and push the changes

## Usage

These files are served statically from `/resumes/resume-{locale}.pdf` (falling back
to `/resumes/resume-pt-BR.pdf`) and are used by:

- ExitIntentModal component (download button)
- Footer component (download link)
- Header component (download link)
- Any other components that need to link to the resume

The correct locale-specific resume is automatically selected based on the user's
current language preference, with fallback to `resume-pt-BR.pdf`.
