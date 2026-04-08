# Development Commands Reference

Quick reference for common CLI commands used in this project.

## Common Commands

These are the most frequently used commands during development:

```bash
npm run dev                  # Start development server (http://localhost:3000)
npm run test:coverage        # Run tests with coverage report
npm run lint                 # Run ESLint to check code quality
npm run format:check         # Check code formatting without fixing

npx prettier --write .       # Auto-fix all formatting issues
```

## Development Server

```bash
npm run dev          # Start development server (http://localhost:3000)
npm run build        # Build for production (static export)
npm run start        # Start production server (preview build)
```

## Testing

```bash
npm test                    # Run all tests
npm run test:coverage       # Run tests with coverage report
npm test -- --watch         # Run tests in watch mode
npm test -- path/to/test    # Run specific test file
```

## Code Quality

```bash
npm run lint                # Run ESLint
npm run format              # Auto-fix formatting with Prettier
npm run format:check        # Check formatting without fixing
npx prettier --write .      # Format all files in project
```

## Git Workflow

```bash
git status                           # Check current status
git add .                            # Stage all changes
git commit -m "type: message"        # Commit with message
git push origin branch-name          # Push to remote
git checkout -b feature/name         # Create new branch
git pull origin main                 # Pull latest changes from main
```

## Package Management

```bash
npm install                  # Install dependencies
npm install package-name     # Add new package
npm uninstall package-name   # Remove package
npm outdated                 # Check for outdated packages
npm update                   # Update packages
```

## Useful Shortcuts

```bash
# Clear terminal
clear  # or Ctrl+L (macOS/Linux) / Ctrl+K (Windows)

# Stop running process
Ctrl+C

# View recent commits
git log --oneline -10

# View git diff
git diff

# Undo last commit (keep changes)
git reset --soft HEAD~1
```

## Project-Specific Notes

- **Default locale**: Brazilian Portuguese (pt-BR)
- **Supported locales**: pt-BR, en, es
- **Test framework**: Jest + React Testing Library
- **Static export**: Site generates static HTML (no server-side runtime)
- **Middleware disabled**: Incompatible with static export (see middleware.ts.disabled)
