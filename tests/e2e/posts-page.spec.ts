/**
 * E2E Test: Posts Page
 *
 * /<locale>/posts/ lists every post, newest first, and lets the visitor group
 * them by platform. These tests verify:
 *
 * 1. The page lists everything, including posts older than the home page's three
 * 2. Filtering by platform, and what an empty platform says
 * 3. The platform filter lives in the URL, so a filtered view can be linked to
 * 4. A deep link opens a post's dialog, and Copy link gives a working one
 * 5. The page is localized
 */

import { test, expect, type Page } from "@playwright/test";
import { setCookieConsentBeforeLoad } from "./helpers/dismissCookieBanner";

const NEWEST_EN = "Two AI agents, one Git repository";
const OLDEST_EN = "Useful tools for beginners in web development";
const TOTAL_POSTS = 6;

/** The card buttons on the page (each card is one button named "View details for …", per locale). */
const cards = (page: Page) =>
  page.getByRole("button", { name: /^(View details for|Ver detalhes de|Ver detalles de) / });

const chip = (page: Page, name: string) =>
  page
    .getByRole("group", { name: /^(Filter by platform|Filtrar por plataforma)$/ })
    .getByRole("button", { name, exact: true });

test.describe("Posts page", () => {
  test.beforeEach(async ({ context }) => {
    await setCookieConsentBeforeLoad(context);
  });

  test("lists every post, including the ones the home page leaves out", async ({ page }) => {
    await page.goto("/en/posts/");

    await expect(page.getByRole("heading", { level: 1, name: "All posts" })).toBeVisible();
    await expect(cards(page)).toHaveCount(TOTAL_POSTS);
    await expect(page.getByRole("button", { name: `View details for ${OLDEST_EN}` })).toBeVisible();
  });

  test("lists newest first", async ({ page }) => {
    await page.goto("/en/posts/");

    const names = await cards(page).evaluateAll((els) =>
      els.map((el) => el.getAttribute("aria-label"))
    );
    expect(names[0]).toBe(`View details for ${NEWEST_EN}`);
    expect(names.at(-1)).toBe(`View details for ${OLDEST_EN}`);
  });

  test("groups by platform with filter chips", async ({ page }) => {
    await page.goto("/en/posts/");

    await expect(chip(page, "All")).toHaveAttribute("aria-pressed", "true");
    await chip(page, "LinkedIn").click();

    await expect(chip(page, "LinkedIn")).toHaveAttribute("aria-pressed", "true");
    await expect(chip(page, "All")).toHaveAttribute("aria-pressed", "false");
    // Every post so far is on LinkedIn.
    await expect(cards(page)).toHaveCount(TOTAL_POSTS);
  });

  test("says so when a platform has no posts yet", async ({ page }) => {
    await page.goto("/en/posts/");

    await chip(page, "YouTube").click();

    await expect(page.getByRole("status")).toHaveText("No YouTube posts yet.");
    await expect(cards(page)).toHaveCount(0);

    // Clicking the active chip again clears the filter.
    await chip(page, "YouTube").click();
    await expect(cards(page)).toHaveCount(TOTAL_POSTS);
  });

  test("keeps the chosen platform in the URL", async ({ page }) => {
    await page.goto("/en/posts/");

    await chip(page, "YouTube").click();
    await expect(page).toHaveURL(/\/en\/posts\/\?platform=youtube$/);

    await chip(page, "All").click();
    await expect(page).toHaveURL(/\/en\/posts\/$/);
  });

  test("preselects the platform named in the URL", async ({ page }) => {
    await page.goto("/en/posts/?platform=youtube");

    await expect(chip(page, "YouTube")).toHaveAttribute("aria-pressed", "true");
    await expect(page.getByRole("status")).toHaveText("No YouTube posts yet.");
  });

  test("shows everything for an unknown platform in the URL", async ({ page }) => {
    await page.goto("/en/posts/?platform=myspace");

    await expect(chip(page, "All")).toHaveAttribute("aria-pressed", "true");
    await expect(cards(page)).toHaveCount(TOTAL_POSTS);
  });

  test("opens a deep-linked post, even the oldest", async ({ page }) => {
    await page.goto("/en/posts/?post=web-dev-tools-article");

    const dialog = page.getByRole("dialog");
    await expect(dialog.getByRole("heading", { name: OLDEST_EN })).toBeVisible();
    await expect(
      dialog.getByRole("link", { name: "Read on LinkedIn (opens in a new tab)" })
    ).toHaveAttribute("target", "_blank");
  });

  test("writes the open post into the URL and clears it on close", async ({ page }) => {
    await page.goto("/en/posts/");

    await page.getByRole("button", { name: `View details for ${NEWEST_EN}` }).click();
    await expect(page).toHaveURL(/\?post=ai-agents-git-worktrees$/);

    await page.keyboard.press("Escape");
    await expect(page.getByRole("dialog")).toBeHidden();
    await expect(page).toHaveURL(/\/en\/posts\/$/);
  });

  test("steps through every post with Prev/Next, wrapping", async ({ page }) => {
    await page.goto("/en/posts/");

    await page.getByRole("button", { name: `View details for ${NEWEST_EN}` }).click();
    const dialog = page.getByRole("dialog");
    await dialog.getByRole("button", { name: "Previous post" }).click();

    // Unlike the home page's three, this wraps all the way to the oldest.
    await expect(dialog.getByRole("heading", { name: OLDEST_EN })).toBeVisible();
  });

  test("Copy link puts a working link to the post on the clipboard", async ({
    page,
    context,
    browserName,
    baseURL,
  }) => {
    test.skip(browserName !== "chromium", "Clipboard permissions can only be granted in Chromium");
    await context.grantPermissions(["clipboard-read", "clipboard-write"]);
    await page.goto("/en/posts/");

    await page.getByRole("button", { name: `View details for ${NEWEST_EN}` }).click();
    await page
      .getByRole("dialog")
      .getByRole("button", { name: /^Copy link/ })
      .click();
    await expect(page.getByRole("dialog").getByRole("status")).toHaveText("Link copied!");

    const copied = await page.evaluate(() => navigator.clipboard.readText());
    expect(copied).toBe(`${baseURL}/en/posts/?post=ai-agents-git-worktrees`);

    // And the link itself works: it reopens the same post.
    await page.goto(copied);
    await expect(page.getByRole("dialog").getByRole("heading", { name: NEWEST_EN })).toBeVisible();
  });

  test("is localized in Portuguese", async ({ page }) => {
    await page.goto("/pt-BR/posts/");

    await expect(
      page.getByRole("heading", { level: 1, name: "Todas as publicações" })
    ).toBeVisible();
    await expect(chip(page, "Todas")).toHaveAttribute("aria-pressed", "true");

    await chip(page, "YouTube").click();
    await expect(page.getByRole("status")).toHaveText("Ainda não há publicações no YouTube.");
  });

  test("is localized in Spanish", async ({ page }) => {
    await page.goto("/es/posts/");

    await expect(
      page.getByRole("heading", { level: 1, name: "Todas las publicaciones" })
    ).toBeVisible();
    await expect(cards(page)).toHaveCount(TOTAL_POSTS);
  });
});
