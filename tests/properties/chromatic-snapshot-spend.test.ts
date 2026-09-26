/**
 * Chromatic Snapshot Spend — CI Trigger Guards
 *
 * Chromatic bills per SNAPSHOT: one per story per build, multiplied by the
 * viewports and modes configured. So a job that runs once more than it needs to
 * does not cost "one more build", it costs a whole grid of snapshots.
 *
 * Both Chromatic jobs in `ci.yml` must therefore run on pull requests ONLY. A
 * push to `main` or `develop` re-snapshots the very commits that branch's own
 * pull request already snapshotted — the Storybook job's own comment puts the
 * cost at "four Chromatic builds per change instead of two while telling us
 * nothing new".
 *
 * ⚠️ The Storybook job carried that restriction from the start. The Playwright
 * job did not, so it paid the full price on every merge and every promotion
 * until this was written. These tests exist because the two jobs are far apart
 * in the file and nothing connected them.
 */

import * as fs from "fs";
import * as path from "path";

const WORKFLOW = fs.readFileSync(path.join(__dirname, "../../.github/workflows/ci.yml"), "utf8");

/** A job's block, from its key to the start of the next top-level job. */
const job = (name: string): string => {
  const start = WORKFLOW.indexOf(`\n  ${name}:\n`);
  if (start === -1) throw new Error(`no job named ${name} in ci.yml`);
  const rest = WORKFLOW.slice(start + 1);
  const next = rest.search(/\n {2}[a-z][a-z0-9-]*:\n/);
  return next === -1 ? rest : rest.slice(0, next);
};

describe("Chromatic jobs only run where they buy something", () => {
  const CHROMATIC_JOBS = ["chromatic", "chromatic-playwright"];

  it.each(CHROMATIC_JOBS)("%s runs on pull requests only", (name) => {
    const block = job(name);

    expect(block).toContain("if: github.event_name == 'pull_request'");
  });

  /**
   * ⚠️ The assertion that would have caught the original miss. Asserting the
   * condition is PRESENT passes on `pull_request || main || develop` too, which
   * is exactly what the Playwright job had: the branch refs are the expensive
   * half, so their absence is the property worth holding.
   */
  it.each(CHROMATIC_JOBS)("%s does not also run on branch pushes", (name) => {
    const block = job(name);

    expect(block).not.toContain("refs/heads/main");
    expect(block).not.toContain("refs/heads/develop");
  });

  /**
   * TurboSnap is what keeps the Storybook job's bill proportional to the
   * change. It is not a default — it needs `fetch-depth: 0` to trace the Vite
   * dependency graph, and losing either one silently turns every run into a
   * full snapshot of every story.
   */
  it("keeps TurboSnap on for the Storybook job", () => {
    const block = job("chromatic");

    expect(block).toContain("onlyChanged: true");
    expect(block).toContain("fetch-depth: 0");
  });
});
