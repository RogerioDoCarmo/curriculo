import { test, expect } from "@playwright/test";
import { execSync } from "node:child_process";
import { mkdtempSync, existsSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";

test.describe("3DS legacy page", () => {
  const outputDir = mkdtempSync(path.join(tmpdir(), "3ds-page-"));

  test.beforeAll(() => {
    execSync("npx tsx scripts/generate-3ds-page.ts", {
      cwd: process.cwd(),
      env: { ...process.env, OUTPUT_DIR: outputDir },
      stdio: "pipe",
    });
  });

  test("builds index.html, hero.jpg, and CNAME", () => {
    expect(existsSync(path.join(outputDir, "index.html"))).toBe(true);
    expect(existsSync(path.join(outputDir, "hero.jpg"))).toBe(true);
    expect(existsSync(path.join(outputDir, "CNAME"))).toBe(true);
  });

  test("the generated page has no CSS, no JS, a visible heading, and the hero image", async ({
    page,
  }) => {
    await page.goto(`file://${path.join(outputDir, "index.html")}`);
    await expect(page.locator("h1")).toHaveText("Rogério do Carmo");
    await expect(page.locator("img")).toHaveAttribute("src", "hero.jpg");
    const html = await page.content();
    expect(html).not.toMatch(/<script/i);
    expect(html).not.toMatch(/<style/i);
  });

  test("links to the live site", async ({ page }) => {
    await page.goto(`file://${path.join(outputDir, "index.html")}`);
    await expect(page.locator('a[href="https://rogeriodocarmo.com"]')).toBeVisible();
  });
});
