#!/usr/bin/env node
/**
 * build-pdfs.mjs — converts resume-*.md into styled PDFs matching the
 * original Word-template design.
 *
 * Usage:
 *   node docs/personal-notes/career/build-pdfs.mjs             # build all into output/
 *   node docs/personal-notes/career/build-pdfs.mjs resume-en   # build one
 *   node docs/personal-notes/career/build-pdfs.mjs --publish   # build all + copy into public/resumes/
 *
 * Dependencies (resolved from the repo's node_modules): js-yaml, playwright.
 * Supported markdown subset — see README.md in this folder.
 */

import { readFileSync, writeFileSync, readdirSync, mkdirSync, copyFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const yaml = require("js-yaml");
const { chromium } = require("playwright");

const DIR = path.dirname(fileURLToPath(import.meta.url));
const OUT = path.join(DIR, "output");
const PUBLIC_RESUMES = path.resolve(DIR, "../../../public/resumes");

const ICONS = {
  objective:
    '<svg viewBox="0 0 24 24"><path d="M3 5h18v2.4H3zm0 5.8h18v2.4H3zm0 5.8h18V19H3z"/></svg>',
  education:
    '<svg viewBox="0 0 24 24"><path d="M12 3 1 9l11 6 9-4.91V17h2V9L12 3zM5 13.18v4L12 21l7-3.82v-4L12 17l-7-3.82z"/></svg>',
  experience:
    '<svg viewBox="0 0 24 24"><path d="M10 2h4a2 2 0 0 1 2 2v2h4a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4V4a2 2 0 0 1 2-2zm0 4h4V4h-4v2z"/></svg>',
  skills:
    '<svg viewBox="0 0 24 24"><path d="M22.7 19l-9.1-9.1c.9-2.3.4-5-1.5-6.9-2-2-5-2.4-7.4-1.3L9 6 6 9 1.6 4.7C.4 7.1.9 10.1 2.9 12.1c1.9 1.9 4.6 2.4 6.9 1.5l9.1 9.1c.4.4 1 .4 1.4 0l2.3-2.3c.5-.4.5-1.1.1-1.4z"/></svg>',
  activities:
    '<svg viewBox="0 0 24 24"><circle cx="5" cy="12" r="2.4"/><circle cx="12" cy="12" r="2.4"/><circle cx="19" cy="12" r="2.4"/></svg>',
};

// ---------- markdown mini-parser (constrained subset, see README) ----------

const esc = (s) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

function inline(text) {
  let s = esc(text);
  s = s.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>');
  s = s.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");
  s = s.replace(/(^|[\s(>])\*([^*\n]+)\*(?=[\s.,;:)<]|$)/g, "$1<em>$2</em>");
  return s;
}

function splitFrontmatter(src) {
  const m = src.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?/);
  if (!m) throw new Error("Missing YAML frontmatter");
  return { meta: yaml.load(m[1]), body: src.slice(m[0].length) };
}

function parseSectionHeading(line) {
  const m = line.match(/^##\s+(.+?)\s*(?:<!--\s*(.*?)\s*-->)?\s*$/);
  if (!m) return null;
  const attrs = {};
  if (m[2]) {
    for (const kv of m[2].split(",")) {
      const [k, v] = kv.split(":").map((x) => x.trim());
      if (k) attrs[k] = v;
    }
  }
  return { title: m[1], attrs };
}

function renderBody(md) {
  const lines = md.split(/\r?\n/);
  const html = [];
  let sectionOpen = false;
  let listOpen = false;
  let para = [];

  const closeList = () => {
    if (listOpen) {
      html.push("</ul>");
      listOpen = false;
    }
  };
  const flushPara = () => {
    if (para.length) {
      let text = para.join(" ").trim();
      para = [];
      if (!text) return;
      text = text.replace(/^\\-/, "-"); // escaped leading hyphen: paragraph, not bullet
      html.push(`<p>${inline(text)}</p>`);
    }
  };
  const closeSection = () => {
    flushPara();
    closeList();
    if (sectionOpen) {
      html.push("</div></section>");
      sectionOpen = false;
    }
  };

  for (const raw of lines) {
    const line = raw.trimEnd();

    if (/^<!--\s*pagebreak\s*-->$/.test(line.trim())) {
      closeSection();
      html.push('<div class="pagebreak"></div>');
      continue;
    }

    if (line.startsWith("## ") && !line.startsWith("###")) {
      const { title, attrs } = parseSectionHeading(line);
      closeSection();
      const cols = attrs.columns === "2" ? " cols-2" : "";
      const icon = ICONS[attrs.icon] ?? "";
      html.push(
        `<section class="sec${cols}"><div class="badge">${icon}</div><div class="sec-body">`,
        `<h2>${inline(title)}</h2>`
      );
      sectionOpen = true;
      continue;
    }

    if (line.startsWith("#### ")) {
      flushPara();
      closeList();
      html.push(`<h4>${inline(line.slice(5))}</h4>`);
      continue;
    }

    if (line.startsWith("### ")) {
      flushPara();
      closeList();
      const text = line.slice(4);
      const pipe = text.indexOf("|");
      if (pipe !== -1) {
        const left = text.slice(0, pipe + 1).trim();
        const right = text.slice(pipe + 1).trim();
        html.push(
          `<h3><span class="accent">${inline(left)}</span> ${inline(right)}</h3>`
        );
      } else {
        html.push(`<h3>${inline(text)}</h3>`);
      }
      continue;
    }

    if (/^- /.test(line)) {
      flushPara();
      if (!listOpen) {
        html.push("<ul>");
        listOpen = true;
      }
      html.push(`<li>${inline(line.slice(2))}</li>`);
      continue;
    }

    if (line.trim() === "") {
      flushPara();
      closeList();
      continue;
    }

    para.push(line);
  }

  closeSection();
  return html.join("\n");
}

function renderHeader(meta) {
  const nameLines = meta.name
    .map((l) => `<div>${inline(l)}</div>`)
    .join("");
  const linkEl = (item) => `<a href="${esc(item.url)}">${esc(item.label)}</a>`;
  return `<header class="masthead">
  <div class="name">${nameLines}</div>
  <div class="contacts">
    <div class="cgroup">${linkEl(meta.location)}</div>
    <div class="cgroup">${meta.links.map(linkEl).join("")}</div>
  </div>
</header>`;
}

function renderDocument(meta, bodyMd, css) {
  return `<!DOCTYPE html>
<html lang="${esc(meta.lang)}">
<head>
<meta charset="utf-8">
<style>${css}</style>
</head>
<body>
${renderHeader(meta)}
<main class="content">
${renderBody(bodyMd)}
</main>
</body>
</html>`;
}

// ---------- build ----------

async function main() {
  const args = process.argv.slice(2);
  const publish = args.includes("--publish");
  const only = args.filter((a) => !a.startsWith("--"));

  let files = readdirSync(DIR).filter(
    (f) => f.startsWith("resume-") && f.endsWith(".md")
  );
  if (only.length) {
    files = files.filter((f) => only.includes(f.replace(/\.md$/, "")));
    if (!files.length) {
      console.error(`No matching resume-*.md for: ${only.join(", ")}`);
      process.exit(1);
    }
  }

  mkdirSync(OUT, { recursive: true });
  const css = readFileSync(path.join(DIR, "styles.css"), "utf8");

  const browser = await chromium.launch();
  const page = await browser.newPage();

  for (const file of files) {
    const base = file.replace(/\.md$/, "");
    const { meta, body } = splitFrontmatter(
      readFileSync(path.join(DIR, file), "utf8")
    );
    const htmlPath = path.join(OUT, `${base}.html`);
    writeFileSync(htmlPath, renderDocument(meta, body, css));

    await page.goto(pathToFileURL(htmlPath).href);
    const pdfPath = path.join(OUT, `${base}.pdf`);
    await page.pdf({
      path: pdfPath,
      format: "A4",
      printBackground: true,
      margin: { top: "7mm", bottom: "9mm", left: "0", right: "0" },
    });
    console.log(`built ${path.relative(process.cwd(), pdfPath)}`);

    if (publish) {
      const dest = path.join(PUBLIC_RESUMES, `${base}.pdf`);
      copyFileSync(pdfPath, dest);
      console.log(`  → published to ${path.relative(process.cwd(), dest)}`);
    }
  }

  await browser.close();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
