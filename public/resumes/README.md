# Resume Files

This directory contains PDF resume files for all supported locales.

## Files

- `resume-pt-BR.pdf` - Portuguese (Brazil) resume
- `resume-en.pdf` - English resume
- `resume-es.pdf` - Spanish resume

## Requirements

- PDFs should be optimized for web (compressed)
- PDFs should be searchable (text-based, not scanned images)
- File size should be kept under 2MB for fast downloads
- PDFs should follow professional resume formatting

## Updating Resumes

To update a resume:

1. Export your resume as PDF from your preferred tool
2. Optimize the PDF using a tool like Adobe Acrobat or online compressor
3. Replace the corresponding file in this directory
4. Commit and push the changes

## Usage

These files are served statically from `/resumes/resume-{locale}.pdf` and are used by:

- ExitIntentModal component (download button)
- Footer component (download link)
- Any other components that need to link to the resume

The correct locale-specific resume is automatically selected based on the user's current language preference.
