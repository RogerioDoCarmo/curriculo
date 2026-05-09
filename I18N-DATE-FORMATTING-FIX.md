# I18n Date Formatting Fix

## Problem

The experience section had hardcoded English date formatting and duration text:

- Date format: "Feb 2023 – Feb 2026 · 3 yrs" (always in English)
- Duration labels: "yr", "yrs", "mo" (English abbreviations)
- Separator: "·" (hardcoded)
- "Present" text was translated, but dates were not

## Solution

Moved all date-related text to the i18n translation structure to support proper localization.

## Changes Made

### 1. Added Translation Keys

Added `duration` object to `experience` namespace in all three language files:

**Portuguese (pt-BR)**:

```json
"duration": {
  "lessThanMonth": "< 1 mês",
  "year": "ano",
  "years": "anos",
  "month": "mês",
  "months": "meses",
  "separator": "·"
}
```

**English (en)**:

```json
"duration": {
  "lessThanMonth": "< 1 month",
  "year": "yr",
  "years": "yrs",
  "month": "mo",
  "months": "mos",
  "separator": "·"
}
```

**Spanish (es)**:

```json
"duration": {
  "lessThanMonth": "< 1 mes",
  "year": "año",
  "years": "años",
  "month": "mes",
  "months": "meses",
  "separator": "·"
}
```

### 2. Updated ExperienceSection Component

**File**: `components/ExperienceSection/index.tsx`

#### Changes:

1. **`formatDate` function**:
   - Added `locale` parameter
   - Changed from hardcoded `"en-US"` to dynamic locale
   - Now properly formats dates according to user's language

2. **`calcDuration` function**:
   - Added `t` (translation function) parameter
   - Replaced hardcoded English strings with translation keys
   - Properly handles singular/plural forms in all languages
   - Uses translated separator

3. **`experienceToTimelineItem` function**:
   - Added `locale` and `t` parameters
   - Uses translated "present" text
   - Uses translated separator
   - Constructs date label with proper localization

4. **Component body**:
   - Removed `locale: _locale` (was being ignored)
   - Now passes `locale` to formatting functions
   - Passes translation function `t` to duration calculation

## Examples

### Before (Always English):

```
Feb 2023 – Feb 2026 · 3 yrs
Mar 2022 – Apr 2023 · 1 yr 1 mo
Jan 2019 – Present · 5 yrs 4 mos
```

### After (Localized):

**Portuguese (pt-BR)**:

```
fev. de 2023 – fev. de 2026 · 3 anos
mar. de 2022 – abr. de 2023 · 1 ano 1 mês
jan. de 2019 – Presente · 5 anos 4 meses
```

**English (en)**:

```
Feb 2023 – Feb 2026 · 3 yrs
Mar 2022 – Apr 2023 · 1 yr 1 mo
Jan 2019 – Present · 5 yrs 4 mos
```

**Spanish (es)**:

```
feb. 2023 – feb. 2026 · 3 años
mar. 2022 – abr. 2023 · 1 año 1 mes
ene. 2019 – Presente · 5 años 4 meses
```

## Benefits

1. **Proper Localization**: Dates now display in the user's selected language
2. **Cultural Appropriateness**: Date formats follow locale conventions
3. **Maintainability**: All text is centralized in translation files
4. **Consistency**: Matches the rest of the site's i18n approach
5. **Flexibility**: Easy to adjust date formats or duration labels per language

## Files Modified

- `components/ExperienceSection/index.tsx` - Updated date formatting logic
- `messages/pt-BR.json` - Added `experience.duration` translations
- `messages/en.json` - Added `experience.duration` translations
- `messages/es.json` - Added `experience.duration` translations

## Testing

To test the changes:

```bash
# 1. Start development server
npm run dev

# 2. Navigate to experience section
# 3. Switch between languages (pt-BR, en, es)
# 4. Verify dates are formatted correctly for each language:
#    - Portuguese: "fev. de 2023 – fev. de 2026 · 3 anos"
#    - English: "Feb 2023 – Feb 2026 · 3 yrs"
#    - Spanish: "feb. 2023 – feb. 2026 · 3 años"

# 5. Test different scenarios:
#    - Current positions (no end date, shows "Presente"/"Present"/"Presente")
#    - Short durations (< 1 month)
#    - Single year/month (singular forms)
#    - Multiple years/months (plural forms)
```

## Edge Cases Handled

1. **Less than 1 month**: Shows "< 1 mês" / "< 1 month" / "< 1 mes"
2. **Singular forms**: "1 ano" / "1 yr" / "1 año" (not "anos"/"yrs"/"años")
3. **Plural forms**: "3 anos" / "3 yrs" / "3 años"
4. **Current positions**: Shows "Presente" / "Present" / "Presente"
5. **Mixed durations**: "1 ano 3 meses" / "1 yr 3 mos" / "1 año 3 meses"

## Commit Recommendation

```bash
git add components/ExperienceSection/index.tsx messages/*.json
git commit -m "fix: internationalize date formatting in experience section

- Move hardcoded English date text to i18n structure
- Add duration translations for pt-BR, en, and es
- Update formatDate to use dynamic locale instead of hardcoded 'en-US'
- Update calcDuration to use translated labels (year/years, month/months)
- Handle singular/plural forms correctly in all languages
- Use translated separator and 'present' text

Examples:
- pt-BR: 'fev. de 2023 – fev. de 2026 · 3 anos'
- en: 'Feb 2023 – Feb 2026 · 3 yrs'
- es: 'feb. 2023 – feb. 2026 · 3 años'

Fixes hardcoded 'Feb 2023 – Feb 2026 · 3 yrs' text"
```

## Impact

- **User Experience**: ✅ Improved - Users see dates in their language
- **Accessibility**: ✅ Maintained - No changes to accessibility features
- **Performance**: ✅ No impact - Same number of function calls
- **Maintainability**: ✅ Improved - Centralized translations
- **Breaking Changes**: ❌ None - Backward compatible

---

**Implementation Date**: May 9, 2026
**Status**: Complete ✅
**Languages Supported**: Portuguese (pt-BR), English (en), Spanish (es)
