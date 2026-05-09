# Fixes Summary

**Date**: May 9, 2026  
**Issues Addressed**: 5 pontual issues

---

## ✅ Issue 1: Added dev:clean command to COMMANDS.md

**File**: `docs/development/COMMANDS.md`

**Change**: Added documentation for the new `dev:clean` script

```bash
npm run dev          # Start development server (fast, uses cached builds)
npm run dev:clean    # Start dev server with clean cache (cold start)
```

**Usage**:

- Use `npm run dev` for normal development (fast)
- Use `npm run dev:clean` when you need a cold start (testing cookies, localStorage, etc.)

---

## ✅ Issue 2: Fixed intermediate and expert tags having same blue color

**File**: `components/SkillsSection/index.tsx`

**Problem**: Both `intermediate` and `expert` skill levels were using blue colors

**Solution**: Changed `expert` level to purple

**Before**:

```typescript
expert: "bg-primary-100 text-primary-700 dark:bg-primary-900 dark:text-primary-300";
```

**After**:

```typescript
expert: "bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300";
```

**Color Scheme Now**:

- **Beginner**: Gray
- **Intermediate**: Blue
- **Advanced**: Green
- **Expert**: Purple ✨ (changed)

---

## ✅ Issue 3: Updated "Última Atualização" dates

**Files**: `messages/en.json`, `messages/pt-BR.json`, `messages/es.json`

**Problem**: Dates showed "Janeiro de 2025" / "January 2025" / "Enero de 2025"

**Solution**: Updated to current date (May 2026)

**Changes**:

- **English**: "January 2025" → "May 2026"
- **Portuguese**: "Janeiro de 2025" → "Maio de 2026"
- **Spanish**: "Enero de 2025" → "Mayo de 2026"

**Affected Pages**:

- Cookie Policy (`/cookies`)
- Privacy Policy (`/privacy`)

---

## ✅ Issue 4: Added GitHub icon next to Linktree in navigation

**File**: `components/Header/index.tsx`

**Change**: Added GitHub repository link with icon before Linktree

**Features**:

- GitHub icon with link to `https://github.com/rogeriodocarmo/curriculo`
- Same styling as Linktree link
- Analytics tracking for clicks
- Accessible with proper ARIA labels
- Responsive (icon + text on desktop, icon only on mobile)

**Navigation Order Now**:

1. GitHub (new) ✨
2. Linktree
3. Language Selector
4. Theme Toggle

---

## ✅ Issue 5: Fixed INVALID*MESSAGE error with `\_ga*<container-id>`

**Files**: `messages/en.json`, `messages/pt-BR.json`, `messages/es.json`

**Problem**:

```
Error: INVALID_MESSAGE: UNCLOSED_TAG (_ga_<container-id>)
```

The `<container-id>` was being interpreted as an HTML tag by next-intl.

**Solution**: Changed angle brackets to curly braces

**Before**:

```json
"name": "_ga_<container-id>"
"analyticsCookies": "Cookies: _ga, _ga_<container-id>, _gid, _gat"
```

**After**:

```json
"name": "_ga_{container-id}"
"analyticsCookies": "Cookies: _ga, _ga_{container-id}, _gid, _gat"
```

**Why**: Curly braces `{}` are not interpreted as HTML tags, avoiding the parsing error.

---

## Testing Checklist

To verify all fixes:

```bash
# 1. Test dev:clean command
npm run dev:clean

# 2. Check skill level colors
# Visit http://localhost:3000/pt-BR/#skills
# Verify: beginner=gray, intermediate=blue, advanced=green, expert=purple

# 3. Check updated dates
# Visit http://localhost:3000/pt-BR/cookies/
# Visit http://localhost:3000/pt-BR/privacy/
# Verify: "Última Atualização: Maio de 2026"

# 4. Check GitHub icon in header
# Visit http://localhost:3000/pt-BR/
# Verify: GitHub icon appears before Linktree
# Click to verify it goes to https://github.com/rogeriodocarmo/curriculo

# 5. Check cookie policy loads without error
# Visit http://localhost:3000/pt-BR/cookies/
# Verify: No INVALID_MESSAGE error in console
# Verify: "_ga_{container-id}" displays correctly
```

---

## Files Modified

1. `docs/development/COMMANDS.md` - Added dev:clean documentation
2. `components/SkillsSection/index.tsx` - Changed expert color to purple
3. `messages/en.json` - Updated dates and fixed container-id syntax
4. `messages/pt-BR.json` - Updated dates and fixed container-id syntax
5. `messages/es.json` - Updated dates and fixed container-id syntax
6. `components/Header/index.tsx` - Added GitHub icon link

---

## Summary

All 5 issues have been addressed:

- ✅ Dev command documented
- ✅ Skill colors differentiated
- ✅ Dates updated to May 2026
- ✅ GitHub icon added to navigation
- ✅ Translation error fixed

The changes are ready for testing!
