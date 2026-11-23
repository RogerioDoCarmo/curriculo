/**
 * Builds the Old-3DS-friendly legacy page (see
 * docs/superpowers/specs/2026-11-22-3ds-legacy-page-design.md).
 *
 * Not part of the Next.js app or its static export — output goes to a
 * gitignored folder, published to GitHub Pages by hand (see
 * docs/development/3DS-LEGACY-PAGE-GUIDE.md).
 *
 * Run: npm run build:3ds
 */

import * as fs from "node:fs";
import * as path from "node:path";
import sharp from "sharp";
import { getExperiences, getProjects, getSkills } from "../lib/content";
import { renderThreeDsHtml, type ThreeDsPageInput } from "../lib/threeds-page";

async function main(): Promise<void> {
  const outputDir = path.resolve(process.cwd(), process.env.OUTPUT_DIR ?? "legacy-3ds-dist");
  fs.mkdirSync(outputDir, { recursive: true });

  const experiences = await getExperiences(undefined, "en");
  const projects = await getProjects("en");
  const skills = await getSkills("en");

  if (experiences.length === 0) {
    throw new Error("No English experience content found — check content/experience/en/ exists.");
  }
  if (projects.length === 0) {
    throw new Error("No English project content found — check content/projects/en/ exists.");
  }
  if (skills.length === 0) {
    throw new Error("No English skills content found — check content/skills/en.md exists.");
  }

  await sharp(path.resolve(process.cwd(), "public/images/profile/rogeriodocarmo.png"))
    .resize(120)
    .jpeg({ quality: 70 })
    .toFile(path.join(outputDir, "hero.jpg"));

  const pkg = JSON.parse(fs.readFileSync(path.resolve(process.cwd(), "package.json"), "utf8")) as {
    author: string;
  };
  const messages = JSON.parse(
    fs.readFileSync(path.resolve(process.cwd(), "messages/en.json"), "utf8")
  ) as {
    hero: { title: string; subtitle: string };
  };

  const input: ThreeDsPageInput = {
    name: pkg.author,
    title: messages.hero.title,
    subtitle: messages.hero.subtitle,
    heroImageSrc: "hero.jpg",
    experiences,
    projects,
    skills,
  };

  fs.writeFileSync(path.join(outputDir, "index.html"), renderThreeDsHtml(input));
  fs.writeFileSync(path.join(outputDir, "CNAME"), "3ds.rogeriodocarmo.com\n");

  const fileCount = fs.readdirSync(outputDir).length;
  console.log(`Wrote ${fileCount} files to ${outputDir}`);
}

main().catch((error: unknown) => {
  console.error(error);
  process.exitCode = 1;
});
