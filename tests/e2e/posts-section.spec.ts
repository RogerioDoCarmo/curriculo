/**
 * E2E Test: Posts Section (home page)
 *
 * The home page shows only the latest three posts, the way the projects
 * section lists projects; the rest live on the posts page (posts-page.spec.ts).
 * These tests verify:
 *
 * 1. The header's Posts link lands on the section
 * 2. Only the latest three posts are listed, with a link to the rest
 * 3. Cards are localized, and posts written in another language say so
 * 4. A card opens a detail dialog whose link goes out to LinkedIn in a new tab
 * 5. Prev/Next step through the three on screen, wrapping within them
 * 6. A deep link opens a post, even one older than the latest three
 * 7. The cover image actually loads (not just renders an <img>)
 */

import { test, expect, type Page } from "@playwright/test";
import { setCookieConsentBeforeLoad } from "./helpers/dismissCookieBanner";

// Newest first. The two 2026-09-13 posts tie on date and are ordered by id.
const NEWEST_EN = "Two AI agents, one Git repository";
const ARTICLE_EN = "Implementing Deep Links in a Next.js Site";
const ARTICLE_PT = "Implementando Deep Link em um site Next.js";
const THIRD_EN = "Deep links in the portfolio";
// Older than the latest three: on the posts page only.
const FOURTH_EN = "An accessible scroll minimap";
const OLDEST_EN = "Useful tools for beginners in web development";

/**
 * Opens a post's detail dialog from its card and returns the dialog.
 *
 * Below the `sm` breakpoint the grid is swapped for a swipe carousel once the
 * media query resolves, which detaches the card rendered during hydration (and
 * renders each card three times). Retrying the whole locate-and-click rides
 * out that swap.
 */
async function openPost(page: Page, title: string) {
  const section = page.locator('section[id="posts"]');

  // No separate scroll step: clicking a card scrolls it into view, and keeping
  // everything inside the retry below means a slow page can't fail it early.
  const dialog = page.getByRole("dialog");
  await expect(async () => {
    // Guarded so a retry never clicks a card again behind an open dialog.
    if (!(await dialog.isVisible())) {
      await section
        .getByRole("button", { name: `View details for ${title}` })
        .first()
        .click({ timeout: 3000 });
    }
    await expect(dialog).toBeVisible({ timeout: 3000 });
  }).toPass({ timeout: 20000 });

  return dialog;
}

test.describe("Posts section", () => {
  test.beforeEach(async ({ context, browserName }) => {
    // CI's WebKit is slow to load and hydrate; give it the room it needs.
    test.slow(browserName === "webkit");
    await setCookieConsentBeforeLoad(context);
  });

  test("the header's Posts link lands on the section", async ({ page, isMobile }) => {
    test.skip(isMobile, "Desktop nav links; the mobile sidebar is covered by basic navigation");
    await page.setViewportSize({ width: 1280, height: 900 });
    await page.goto("/en/");

    await page.getByRole("banner").getByRole("link", { name: "Posts", exact: true }).click();

    await expect(page).toHaveURL(/#posts$/);
    const section = page.locator('section[id="posts"]');
    await expect(section.getByRole("heading", { level: 2, name: "Posts" })).toBeInViewport();
  });

  test("lists only the latest three posts", async ({ page }) => {
    await page.goto("/en/#posts");
    const section = page.locator('section[id="posts"]');

    for (const title of [NEWEST_EN, ARTICLE_EN, THIRD_EN]) {
      await expect(
        section.getByRole("button", { name: `View details for ${title}` }).first()
      ).toBeVisible();
    }
    for (const title of [FOURTH_EN, OLDEST_EN]) {
      await expect(section.getByRole("button", { name: `View details for ${title}` })).toHaveCount(
        0
      );
    }
  });

  test("links to the posts page that holds the rest", async ({ page }) => {
    await page.goto("/en/#posts");
    const link = page.locator('section[id="posts"]').getByRole("link", { name: "View all posts" });

    // The trailing slash comes from `trailingSlash: true`, which Jest doesn't load.
    await expect(link).toHaveAttribute("href", "/en/posts/");

    // Retried as a whole: the page is still scrolling to #posts and hydrating
    // when this runs, and slow WebKit never saw the link as "stable" within a
    // single click's timeout.
    await expect(async () => {
      await link.click({ timeout: 4000 });
      await expect(page).toHaveURL(/\/en\/posts\/$/, { timeout: 4000 });
    }).toPass({ timeout: 20000 });

    await expect(page.getByRole("heading", { level: 1, name: "All posts" })).toBeVisible();
  });

  test("lists localized cards, flagging posts written in another language", async ({ page }) => {
    await page.goto("/en/#posts");
    const section = page.locator('section[id="posts"]');

    const articleCard = section
      .getByRole("button", { name: `View details for ${ARTICLE_EN}` })
      .first();
    await expect(articleCard).toBeVisible();
    await expect(articleCard).toContainText("LinkedIn");
    await expect(articleCard).toContainText("Article");
    await expect(articleCard).toContainText("Sep 2026");
    await expect(articleCard).toContainText("In Portuguese");
  });

  test("shows Portuguese titles and no language flag on the pt-BR page", async ({ page }) => {
    await page.goto("/pt-BR/#posts");
    const section = page.locator('section[id="posts"]');

    const articleCard = section
      .getByRole("button", { name: `Ver detalhes de ${ARTICLE_PT}` })
      .first();
    await expect(articleCard).toBeVisible();
    await expect(articleCard).toContainText("Artigo");
    await expect(articleCard).not.toContainText("Em português");
    await expect(section.getByRole("link", { name: "Ver todas as publicações" })).toHaveAttribute(
      "href",
      "/pt-BR/posts/"
    );
  });

  test("opens a post and links out to LinkedIn in a new tab", async ({ page }) => {
    await page.goto("/en/#posts");

    const dialog = await openPost(page, ARTICLE_EN);

    await expect(dialog.getByRole("heading", { name: ARTICLE_EN })).toBeVisible();
    const link = dialog.getByRole("link", { name: "Read on LinkedIn (opens in a new tab)" });
    await expect(link).toHaveAttribute(
      "href",
      "https://www.linkedin.com/pulse/implementando-deep-link-em-um-site-nextjs-ramos-rodrigues-do-carmo-qa7yf/"
    );
    await expect(link).toHaveAttribute("target", "_blank");
    await expect(link).toHaveAttribute("rel", "noopener noreferrer");
  });

  test("steps through the three posts with Prev/Next, wrapping within them", async ({ page }) => {
    await page.goto("/en/#posts");

    const dialog = await openPost(page, NEWEST_EN);
    // Previous from the first wraps to the last of the three — not to the oldest post.
    await dialog.getByRole("button", { name: "Previous post" }).click();
    await expect(dialog.getByRole("heading", { name: THIRD_EN })).toBeVisible();

    await dialog.getByRole("button", { name: "Next post" }).click();
    await expect(dialog.getByRole("heading", { name: NEWEST_EN })).toBeVisible();

    await page.keyboard.press("Escape");
    await expect(dialog).toBeHidden();
  });

  test("writes the open post into the URL, keeping the section hash", async ({ page }) => {
    await page.goto("/en/#posts");

    await openPost(page, NEWEST_EN);

    await expect(page).toHaveURL(/\?post=ai-agents-git-worktrees#posts$/);
  });

  test("opens a deep-linked post on arrival", async ({ page }) => {
    await page.goto("/en/?post=ai-agents-git-worktrees#posts");

    // The dialog opens after hydration, which WebKit is slow to reach on CI —
    // the same margin the project deep-link spec allows.
    const dialog = page.getByRole("dialog");
    await expect(dialog.getByRole("heading", { name: NEWEST_EN })).toBeVisible({
      timeout: 10000,
    });
  });

  test("opens a deep-linked post older than the latest three, without Prev/Next", async ({
    page,
  }) => {
    await page.goto("/en/?post=web-dev-tools-article#posts");

    const dialog = page.getByRole("dialog");
    await expect(dialog.getByRole("heading", { name: OLDEST_EN })).toBeVisible({
      timeout: 10000,
    });
    await expect(dialog.getByRole("button", { name: "Next post" })).toHaveCount(0);
    await expect(dialog.getByRole("button", { name: "Previous post" })).toHaveCount(0);
  });

  test("ignores a deep link to a post that doesn't exist", async ({ page }) => {
    await page.goto("/en/?post=does-not-exist#posts");

    await expect(
      page
        .locator('section[id="posts"]')
        .getByRole("button", { name: `View details for ${NEWEST_EN}` })
        .first()
    ).toBeVisible();
    await expect(page.getByRole("dialog")).toHaveCount(0);
  });

  test("loads the article's cover image", async ({ page }) => {
    await page.goto("/en/#posts");
    const section = page.locator('section[id="posts"]');

    const cover = section
      .getByRole("button", { name: `View details for ${ARTICLE_EN}` })
      .first()
      .locator("img");
    // Retried as a whole: on phones the carousel replaces the hydration-time
    // grid, detaching the image between the scroll and the read.
    await expect(async () => {
      await cover.scrollIntoViewIfNeeded({ timeout: 3000 });
      const width = await cover.evaluate(
        (img: HTMLImageElement) => img.complete && img.naturalWidth
      );
      expect(width).toBe(1200);
    }).toPass({ timeout: 20000 });
  });

  test("a post without a cover shows the platform placeholder instead", async ({ page }) => {
    await page.goto("/en/#posts");
    const section = page.locator('section[id="posts"]');

    const card = section.getByRole("button", { name: `View details for ${THIRD_EN}` }).first();
    await expect(card).toBeVisible();
    await expect(card.locator("img")).toHaveCount(0);
  });
});
