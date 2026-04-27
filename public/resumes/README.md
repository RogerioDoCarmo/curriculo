# Resume Files

This directory contains PDF resume files for all supported locales.

## Current Setup

For now, we're using a single PDF file (`resume.pdf`) for all locales. In the future, you can add locale-specific versions.

## Files

- `resume.pdf` - Main resume file (used for all locales currently)
- `resume-pt-BR.pdf` - Portuguese (Brazil) resume (optional, falls back to resume.pdf)
- `resume-en.pdf` - English resume (optional, falls back to resume.pdf)
- `resume-es.pdf` - Spanish resume (optional, falls back to resume.pdf)

## Requirements

- PDFs should be optimized for web (compressed)
- PDFs should be searchable (text-based, not scanned images)
- File size should be kept under 2MB for fast downloads
- PDFs should follow professional resume formatting

## Adding Your Resume

1. Place your PDF file in this directory as `resume.pdf`
2. Optionally, create locale-specific versions (resume-pt-BR.pdf, resume-en.pdf, resume-es.pdf)
3. The application will automatically use locale-specific versions if available, otherwise falls back to `resume.pdf`

## Updating Resumes

To update a resume:

1. Export your resume as PDF from your preferred tool
2. Optimize the PDF using a tool like Adobe Acrobat or online compressor
3. Replace the corresponding file in this directory
4. Commit and push the changes

## Usage

These files are served statically from `/resumes/resume-{locale}.pdf` (or `/resumes/resume.pdf` as fallback) and are used by:

- ExitIntentModal component (download button)
- Footer component (download link)
- Any other components that need to link to the resume

The correct locale-specific resume is automatically selected based on the user's current language preference, with fallback to the main resume.pdf file.

