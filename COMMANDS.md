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

### Branch Strategy (Git Flow)

This project uses a **Git Flow** branching strategy with two main branches:

- **`main`** - Production-ready code (protected, requires PR)
- **`develop`** - Integration branch for ongoing development (base for feature branches)

**Workflow:**

```
main (production) ← PR ← develop (integration) ← PR ← feature/task-name (development)
```

**Rules:**

1. **Feature branches** are created from `develop`
2. **Feature PRs** merge into `develop`
3. **Release PRs** merge from `develop` into `main`
4. **`main` branch** is protected - no direct commits allowed
5. **Tags** are created on `main` for releases

### Standard Workflow (with validation)

**CRITICAL**: Always validate changes before committing. This is the standard behavior for this project.

**AI Agent Behavior**: When Kiro completes implementation tasks, it will PAUSE before the commit phase and wait for user validation. The user will run tests and checks manually to ensure everything works as expected.

```bash
# 1. Check what changed
git status

# 2. Run tests to validate changes
npm run test:coverage

# 3. Check for linting issues
npm run lint

# 4. Check formatting
npm run format:check

# 5. If all validations pass, stage changes
git add .

# 6. Commit with conventional format
git commit -m "type: message"

# 7. Push to remote
git push origin branch-name
```

**Why this approach?**

- Ensures user has full control over what gets committed
- Allows user to run additional manual tests if needed
- Prevents automated commits of potentially broken code
- Gives user opportunity to review changes before they're permanent

### Checkpoint Workflow (for major milestones)

**IMPORTANT**: After completing checkpoint tasks, pause for user validation before committing:

```bash
# 1. Complete checkpoint tasks (Kiro implements features)

# 2. PAUSE - User validates changes manually
#    - Run tests: npm test
#    - Check dev server: npm run dev
#    - Review code changes
#    - Test features in browser

# 3. After user approval, proceed with commit workflow
git status
npm run test:coverage
npm run lint
npm run format:check
git add .
git commit -m "feat: checkpoint X - description"
git push origin branch-name

# 4. Create PR, merge, and tag release
```

**Rationale**: Checkpoints represent significant milestones. User validation ensures quality and catches issues before they're committed to the repository.

### Git Commands Reference

#### Feature Development Workflow

```bash
# 1. Start new feature from develop
git checkout develop
git pull origin develop
git checkout -b feature/task-name

# 2. Make changes and commit
git add .
git commit -m "feat: description"

# 3. Push feature branch
git push origin feature/task-name

# 4. Create PR to develop (via GitHub)
# 5. After PR merge, update local develop
git checkout develop
git pull origin develop
git branch -d feature/task-name

# 6. When ready for production release
git checkout develop
git pull origin develop
# Create PR from develop to main (via GitHub)
# After merge, create release tag on main
```

#### Common Git Commands

```bash
git status                           # Check current status
git add .                            # Stage all changes
git commit -m "type: message"        # Commit with message
git push origin branch-name          # Push to remote
git checkout -b feature/name         # Create new branch
git pull origin develop              # Pull latest changes from develop
git branch -d branch-name            # Delete merged branch (safe - prevents data loss)
git fetch --prune                    # Remove deleted remote branches from local
```

**Important**: Always use `-d` (lowercase) when deleting branches. This is the safe option that prevents deleting unmerged work. Never use `-D` (uppercase) as it force-deletes branches even if they contain unmerged changes.

### Commit Message Format

Follow conventional commit format:

- `feat:` - New feature
- `fix:` - Bug fix
- `test:` - Adding or updating tests
- `docs:` - Documentation changes
- `style:` - Code style changes (formatting, etc.)
- `refactor:` - Code refactoring
- `perf:` - Performance improvements
- `chore:` - Maintenance tasks

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
