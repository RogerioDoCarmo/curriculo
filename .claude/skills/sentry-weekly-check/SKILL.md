---
name: sentry-weekly-check
description: Check this project's Sentry project for errors/issues from the last week using the Sentry API. Use when the user asks to check Sentry, review recent errors, or do the weekly Sentry check.
---

# Sentry weekly check

Query Sentry directly via its API for issues seen in the last 7 days — never rely on a
cached memory of past results, since issue status/count changes over time.

## Credentials

Read from `.env.local` at the repo root (never assume any globally-exported env var):

- `SENTRY_AUTH_TOKEN`
- `SENTRY_ORG_SLUG`
- `SENTRY_PROJECT`

## Steps

1. Source the credentials:

   ```bash
   source <(grep "^SENTRY_" .env.local)
   ```

2. List issues last seen in the past 7 days, sorted by frequency (the Sentry
   issues endpoint rejects `statsPeriod=7d` — pass `statsPeriod=14d` and filter
   with the `lastSeen:-7d` query instead):

   ```bash
   curl -s -H "Authorization: Bearer $SENTRY_AUTH_TOKEN" \
     "https://sentry.io/api/0/projects/$SENTRY_ORG_SLUG/$SENTRY_PROJECT/issues/?query=lastSeen%3A-7d&sort=freq&limit=100&statsPeriod=14d" \
     -o /tmp/sentry_issues.json -w "HTTP %{http_code}\n"
   ```

3. Summarize each issue: title, level, count, first/last seen, status
   (unresolved/ignored/resolved), and permalink
   (`https://<org-slug>.sentry.io/issues/<id>/`).

4. Flag anything from a verification/test script (e.g. titles containing
   `playwright-verify-sentry-fix`) as expected noise, not a real bug — these
   come from Playwright specs that intentionally trigger a Sentry event to
   confirm the integration still works, and are typically already `ignored`.

5. Report unresolved, non-test issues as the actionable findings. If nothing
   unresolved/actionable turns up, say so plainly rather than padding the
   report — "no real issues this week" is a complete answer.

## Notes

- This is a read-only check (`alerts:read`, `event:read`, `project:read`
  scopes on the token) — no mutating Sentry API calls belong in this skill.
- Adjust the lookback window (`lastSeen:-Nd`) if the user asks for a different
  period than the last week.
