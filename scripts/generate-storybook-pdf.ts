/**
 * Storybook PDF Generation Script
 *
 * This script generates a PDF document containing screenshots and documentation
 * of all Storybook components. The PDF is saved to public/storybook-components.pdf
 * and can be downloaded from the deployed website.
 *
 * Usage:
 *   npm run generate-storybook-pdf
 *
 * Requirements:
 *   - Storybook must be built (storybook-static/ directory must exist)
 *   - Playwright must be installed
 *
 * Output:
 *   - public/storybook-components.pdf
 */

import { chromium, type Browser, type Page } from "@playwright/test";
import * as fs from "fs";
import * as path from "path";
import { exec } from "child_process";
import { promisify } from "util";

const execAsync = promisify(exec);

// Configuration
const STORYBOOK_PORT = 6007;
const STORYBOOK_URL = `http://localhost:${STORYBOOK_PORT}`;
const OUTPUT_PDF = path.join(process.cwd(), "public", "storybook-components.pdf");
const STORYBOOK_STATIC_DIR = path.join(process.cwd(), "storybook-static");

// PDF Configuration
const PDF_CONFIG = {
  format: "A4" as const,
  printBackground: true,
  margin: {
    top: "0.5in",
    right: "0.5in",
    bottom: "0.5in",
    left: "0.5in",
  },
};

/**
 * Check if Storybook static build exists
 */
function checkStorybookBuild(): void {
  if (!fs.existsSync(STORYBOOK_STATIC_DIR)) {
    console.error("❌ Error: Storybook static build not found!");
    console.error(`   Expected directory: ${STORYBOOK_STATIC_DIR}`);
    console.error("   Run 'npm run build-storybook' first.");
    process.exit(1);
  }
  console.log("✓ Storybook static build found");
}

/**
 * Start a local server for Storybook static files
 */
async function startStorybookServer(): Promise<() => Promise<void>> {
  console.log(`\n📦 Starting Storybook server on port ${STORYBOOK_PORT}...`);

  const serverProcess = exec(
    `npx serve@latest ${STORYBOOK_STATIC_DIR} -l ${STORYBOOK_PORT} --no-clipboard`,
    (error) => {
      if (error && !error.killed) {
        console.error("Server error:", error);
      }
    }
  );

  // Wait for server to be ready
  await new Promise((resolve) => setTimeout(resolve, 3000));

  // Test if server is responding
  try {
    const response = await fetch(STORYBOOK_URL);
    if (response.ok) {
      console.log("✓ Storybook server is ready");
    } else {
      throw new Error(`Server returned status ${response.status}`);
    }
  } catch (error) {
    console.error("❌ Failed to connect to Storybook server");
    serverProcess.kill();
    throw error;
  }

  // Return cleanup function
  return async () => {
    console.log("\n🛑 Stopping Storybook server...");
    serverProcess.kill();
    await new Promise((resolve) => setTimeout(resolve, 1000));
  };
}

/**
 * Get list of all stories from Storybook
 */
async function getStories(page: Page): Promise<Array<{ id: string; title: string; name: string }>> {
  console.log("\n📚 Fetching story list...");

  // Navigate to Storybook
  await page.goto(STORYBOOK_URL, { waitUntil: "networkidle" });
  await page.waitForTimeout(2000);

  // Extract stories from Storybook's internal API
  const stories = await page.evaluate(() => {
    // Access Storybook's global API
    const storyStore = (window as any).__STORYBOOK_STORY_STORE__;
    if (!storyStore) {
      return [];
    }

    const allStories: Array<{ id: string; title: string; name: string }> = [];

    // Get all story entries
    const entries = storyStore.raw();
    for (const story of entries) {
      allStories.push({
        id: story.id,
        title: story.title,
        name: story.name,
      });
    }

    return allStories;
  });

  console.log(`✓ Found ${stories.length} stories`);
  return stories;
}

/**
 * Generate HTML content for the PDF
 */
function generatePDFHTML(
  stories: Array<{ id: string; title: string; name: string }>,
  screenshots: Map<string, string>
): string {
  const date = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  let componentsHTML = "";
  let currentComponent = "";

  for (const story of stories) {
    // Group stories by component
    if (story.title !== currentComponent) {
      if (currentComponent) {
        componentsHTML += "</div>"; // Close previous component section
      }
      currentComponent = story.title;
      componentsHTML += `
        <div class="component-section" style="page-break-before: always; margin-bottom: 40px;">
          <h2 style="color: #1a1a1a; font-size: 24px; margin-bottom: 20px; border-bottom: 2px solid #e0e0e0; padding-bottom: 10px;">
            ${story.title}
          </h2>
      `;
    }

    const screenshot = screenshots.get(story.id);
    componentsHTML += `
      <div class="story-section" style="margin-bottom: 30px;">
        <h3 style="color: #333; font-size: 18px; margin-bottom: 10px;">
          ${story.name}
        </h3>
        ${
          screenshot
            ? `<div style="border: 1px solid #e0e0e0; padding: 20px; background: #f9f9f9; border-radius: 4px;">
                 <img src="${screenshot}" style="max-width: 100%; height: auto;" alt="${story.title} - ${story.name}" />
               </div>`
            : `<p style="color: #999; font-style: italic;">Screenshot not available</p>`
        }
      </div>
    `;
  }

  if (currentComponent) {
    componentsHTML += "</div>"; // Close last component section
  }

  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Component Library Documentation</title>
      <style>
        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
          line-height: 1.6;
          color: #333;
          max-width: 800px;
          margin: 0 auto;
          padding: 20px;
        }
        h1 {
          color: #1a1a1a;
          font-size: 32px;
          margin-bottom: 10px;
        }
        .subtitle {
          color: #666;
          font-size: 16px;
          margin-bottom: 40px;
        }
        .toc {
          background: #f5f5f5;
          padding: 20px;
          border-radius: 4px;
          margin-bottom: 40px;
        }
        .toc h2 {
          margin-top: 0;
          font-size: 20px;
        }
        .toc ul {
          list-style: none;
          padding-left: 0;
        }
        .toc li {
          margin-bottom: 8px;
        }
      </style>
    </head>
    <body>
      <h1>Component Library Documentation</h1>
      <p class="subtitle">Generated on ${date}</p>

      <div class="toc">
        <h2>Table of Contents</h2>
        <ul>
          ${Array.from(new Set(stories.map((s) => s.title)))
            .map((title) => `<li>${title}</li>`)
            .join("")}
        </ul>
      </div>

      ${componentsHTML}
    </body>
    </html>
  `;
}

/**
 * Capture screenshots of all stories
 */
async function captureScreenshots(
  page: Page,
  stories: Array<{ id: string; title: string; name: string }>
): Promise<Map<string, string>> {
  console.log("\n📸 Capturing component screenshots...");

  const screenshots = new Map<string, string>();

  for (let i = 0; i < stories.length; i++) {
    const story = stories[i];
    const progress = `[${i + 1}/${stories.length}]`;

    try {
      console.log(`${progress} Capturing ${story.title} - ${story.name}...`);

      // Navigate to story
      const storyUrl = `${STORYBOOK_URL}/iframe.html?id=${story.id}&viewMode=story`;
      await page.goto(storyUrl, { waitUntil: "networkidle" });
      await page.waitForTimeout(1000);

      // Find the story root element
      const storyRoot = page.locator("#storybook-root").first();
      await storyRoot.waitFor({ state: "visible", timeout: 5000 });

      // Capture screenshot as base64
      const screenshot = await storyRoot.screenshot({ type: "png" });
      const base64 = screenshot.toString("base64");
      screenshots.set(story.id, `data:image/png;base64,${base64}`);

      console.log(`  ✓ Captured`);
    } catch (error) {
      console.error(`  ✗ Failed to capture ${story.title} - ${story.name}:`, error);
    }
  }

  console.log(`\n✓ Captured ${screenshots.size}/${stories.length} screenshots`);
  return screenshots;
}

/**
 * Generate PDF from HTML content
 */
async function generatePDF(
  page: Page,
  stories: Array<{ id: string; title: string; name: string }>,
  screenshots: Map<string, string>
): Promise<void> {
  console.log("\n📄 Generating PDF...");

  // Generate HTML content
  const html = generatePDFHTML(stories, screenshots);

  // Create a temporary HTML file
  const tempHtmlPath = path.join(process.cwd(), "temp-storybook-pdf.html");
  fs.writeFileSync(tempHtmlPath, html);

  try {
    // Navigate to the HTML file
    await page.goto(`file://${tempHtmlPath}`, { waitUntil: "networkidle" });
    await page.waitForTimeout(2000);

    // Ensure output directory exists
    const outputDir = path.dirname(OUTPUT_PDF);
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    // Generate PDF
    await page.pdf({
      path: OUTPUT_PDF,
      ...PDF_CONFIG,
    });

    console.log(`✓ PDF generated: ${OUTPUT_PDF}`);

    // Get file size
    const stats = fs.statSync(OUTPUT_PDF);
    const fileSizeMB = (stats.size / (1024 * 1024)).toFixed(2);
    console.log(`  File size: ${fileSizeMB} MB`);
  } finally {
    // Clean up temporary file
    if (fs.existsSync(tempHtmlPath)) {
      fs.unlinkSync(tempHtmlPath);
    }
  }
}

/**
 * Main execution function
 */
async function main(): Promise<void> {
  console.log("🚀 Storybook PDF Generation");
  console.log("============================\n");

  let browser: Browser | null = null;
  let stopServer: (() => Promise<void>) | null = null;

  try {
    // Step 1: Check Storybook build
    checkStorybookBuild();

    // Step 2: Start Storybook server
    stopServer = await startStorybookServer();

    // Step 3: Launch browser
    console.log("\n🌐 Launching browser...");
    browser = await chromium.launch({ headless: true });
    const page = await browser.newPage();
    console.log("✓ Browser launched");

    // Step 4: Get stories
    const stories = await getStories(page);

    if (stories.length === 0) {
      throw new Error("No stories found in Storybook");
    }

    // Step 5: Capture screenshots
    const screenshots = await captureScreenshots(page, stories);

    // Step 6: Generate PDF
    await generatePDF(page, stories, screenshots);

    console.log("\n✅ PDF generation completed successfully!");
    console.log(`📁 Output: ${OUTPUT_PDF}`);
  } catch (error) {
    console.error("\n❌ PDF generation failed:");
    console.error(error);
    process.exit(1);
  } finally {
    // Cleanup
    if (browser) {
      await browser.close();
    }
    if (stopServer) {
      await stopServer();
    }
  }
}

// Run the script
main();
