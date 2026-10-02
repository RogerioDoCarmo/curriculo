#!/usr/bin/env node
/**
 * Records the captioned site walkthrough videos for `showcase-media/`.
 *
 *   node scripts/record-walkthrough.mjs --base=http://localhost:3000 --locale=pt-BR --out=showcase-media
 *
 * Needs: Playwright with a system Chrome (`channel: "chrome"`), and ffmpeg on
 * the PATH. Serve a production build first (`npm run build && npx serve out`).
 *
 * How it works
 * - A mobile (430x932) and a desktop (1440x880) page run the SAME scene script
 *   in lockstep: every scene starts together and the next one waits for the
 *   slower page. That keeps one caption timeline valid for both panels of the
 *   combined video.
 * - Frames come from Chrome's screencast (CDP), not Playwright's video
 *   recorder, which needs a separately downloaded ffmpeg. The résumé PDF scene
 *   needs a headed browser, so this always runs headed.
 * - ffmpeg burns the captions in (the videos are silent on purpose, so they
 *   work muted in a feed) and builds the combined video: mobile and desktop
 *   side by side, both scaled to 900px high.
 *
 * Output (PT-BR keeps the original file names; other locales get a suffix):
 *   walkthrough-mobile[-en].mp4, walkthrough-desktop[-en].mp4,
 *   walkthrough-combined[-en].mp4, walkthrough-video-image-thumbnail[-en].png
 */

import { chromium } from "playwright";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { spawnSync } from "node:child_process";

// ─── Arguments ───────────────────────────────────────────────────────────────

const args = Object.fromEntries(
  process.argv.slice(2).map((a) => {
    const [k, v = "true"] = a.replace(/^--/, "").split("=");
    return [k, v];
  })
);

const BASE = (args.base ?? "http://localhost:3000").replace(/\/+$/, "");
const LOCALE = args.locale ?? "pt-BR";
const OUT = path.resolve(args.out ?? "showcase-media");
const KEEP_WORK = args.keep === "true";
const FPS = 25;
const SUFFIX = LOCALE === "pt-BR" ? "" : `-${LOCALE.split("-")[0]}`;
const FONT_SRC = args.font ?? "C:/Windows/Fonts/arialbd.ttf";

const SIZES = {
  mobile: { width: 430, height: 932 },
  desktop: { width: 1440, height: 880 },
};
const COMBINED_HEIGHT = 900;
const DIVIDER = 6;

const messages = JSON.parse(
  fs.readFileSync(new URL(`../messages/${LOCALE}.json`, import.meta.url), "utf8")
);
const msg = (key) => key.split(".").reduce((o, k) => o?.[k], messages);

// ─── Captions ────────────────────────────────────────────────────────────────

/** [title, subtitle] per scene. Titles stay short: they are read in a second or two. */
const CAPTIONS = {
  "pt-BR": {
    intro: [
      "rogeriodocarmo.com",
      "Next.js · TypeScript · +1.000 testes · Lighthouse ~95 · SEO · Open Source",
    ],
    theme: ["Modo escuro", "Tema claro e escuro, com a preferência salva"],
    languages: ["Três idiomas", "Português · English · Español, com todo o conteúdo traduzido"],
    career: [
      "Trajetória profissional e acadêmica",
      "Abas, cartões expansíveis e detalhes de cada experiência",
    ],
    projects: ["Projetos", "Detalhes de cada projeto e navegação entre eles"],
    posts: ["Publicações", "As 3 mais recentes, com link para o post original"],
    postsPage: ["Todas as publicações", "Agrupadas por plataforma, com link direto para cada uma"],
    skills: ["Habilidades", "Busca por nome e categorias"],
    backToTop: ["Voltar ao topo", "Botão flutuante em qualquer ponto da página"],
    techStack: ["Usado neste site", "A stack, os testes e as ferramentas por trás do projeto"],
    resume: ["Currículo em PDF", "Download direto, no idioma escolhido"],
    outro: ["rogeriodocarmo.com", "Código aberto · github.com/RogerioDoCarmo/curriculo"],
  },
  en: {
    intro: [
      "rogeriodocarmo.com",
      "Next.js · TypeScript · 1,000+ tests · Lighthouse ~95 · SEO · Open Source",
    ],
    theme: ["Dark mode", "Light and dark themes, with the preference saved"],
    languages: ["Three languages", "Português · English · Español, with all content translated"],
    career: ["Professional and academic path", "Tabs, expandable cards and details for each role"],
    projects: ["Projects", "Details for each project, and stepping between them"],
    posts: ["Posts", "The 3 latest, each linking to the original post"],
    postsPage: ["All posts", "Grouped by platform, with a direct link to each one"],
    skills: ["Skills", "Search by name, grouped by category"],
    backToTop: ["Back to top", "A floating button, from anywhere on the page"],
    techStack: ["Used in this site", "The stack, the tests and the tools behind the project"],
    resume: ["Résumé as PDF", "Direct download, in the language you picked"],
    outro: ["rogeriodocarmo.com", "Open source · github.com/RogerioDoCarmo/curriculo"],
  },
  es: {
    intro: [
      "rogeriodocarmo.com",
      "Next.js · TypeScript · +1.000 pruebas · Lighthouse ~95 · SEO · Código abierto",
    ],
    theme: ["Modo oscuro", "Tema claro y oscuro, con la preferencia guardada"],
    languages: ["Tres idiomas", "Português · English · Español, con todo el contenido traducido"],
    career: [
      "Trayectoria profesional y académica",
      "Pestañas, tarjetas expandibles y detalles de cada experiencia",
    ],
    projects: ["Proyectos", "Detalles de cada proyecto y navegación entre ellos"],
    posts: ["Publicaciones", "Las 3 más recientes, con enlace a la publicación original"],
    postsPage: [
      "Todas las publicaciones",
      "Agrupadas por plataforma, con enlace directo a cada una",
    ],
    skills: ["Habilidades", "Búsqueda por nombre y categorías"],
    backToTop: ["Volver arriba", "Botón flotante desde cualquier punto de la página"],
    techStack: ["Usado en este sitio", "El stack, las pruebas y las herramientas del proyecto"],
    resume: ["Currículum en PDF", "Descarga directa, en el idioma elegido"],
    outro: ["rogeriodocarmo.com", "Código abierto · github.com/RogerioDoCarmo/curriculo"],
  },
};
const captions = CAPTIONS[LOCALE];
if (!captions) throw new Error(`No captions for locale "${LOCALE}"`);

// ─── Helpers ─────────────────────────────────────────────────────────────────

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const now = () => Date.now() / 1000;
const log = (...a) => console.log(`[${LOCALE}]`, ...a);

/** Smoothly scrolls to an absolute `y` (ease in/out), independent of the page's CSS scroll-behavior. */
async function smoothScroll(page, y, ms) {
  await page.evaluate(
    ([target, duration]) =>
      new Promise((resolve) => {
        const root = document.documentElement;
        const previous = root.style.scrollBehavior;
        root.style.scrollBehavior = "auto";
        const from = window.scrollY;
        const start = performance.now();
        const ease = (t) => (t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2);
        const step = (nowMs) => {
          const p = Math.min(1, (nowMs - start) / duration);
          window.scrollTo(0, from + (target - from) * ease(p));
          if (p < 1) requestAnimationFrame(step);
          else {
            root.style.scrollBehavior = previous;
            resolve();
          }
        };
        requestAnimationFrame(step);
      }),
    [y, ms]
  );
}

async function scrollDistance(page, y) {
  const from = await page.evaluate(() => window.scrollY);
  return Math.abs(y - from);
}

async function scrollToY(page, y) {
  const distance = await scrollDistance(page, y);
  await smoothScroll(page, y, Math.min(3200, Math.max(900, distance * 0.9)));
}

async function scrollToSelector(page, selector, offset = 76) {
  const y = await page.evaluate(
    ([sel, off]) => {
      const el = document.querySelector(sel);
      return el ? Math.max(0, el.getBoundingClientRect().top + window.scrollY - off) : null;
    },
    [selector, offset]
  );
  if (y === null) throw new Error(`No element for ${selector}`);
  await scrollToY(page, y);
}

async function scrollBy(page, delta) {
  const from = await page.evaluate(() => window.scrollY);
  await scrollToY(page, from + delta);
}

/** Clicks with a visible pause, so a viewer can follow what was pressed. */
async function press(locator, pauseMs = 700) {
  await locator.first().scrollIntoViewIfNeeded();
  await locator.first().click({ timeout: 8000 });
  await sleep(pauseMs);
}

// ─── Recording (CDP screencast) ──────────────────────────────────────────────

async function startScreencast(page, dir) {
  fs.mkdirSync(dir, { recursive: true });
  const cdp = await page.context().newCDPSession(page);
  const frames = [];
  cdp.on("Page.screencastFrame", ({ data, metadata, sessionId }) => {
    const file = `f${String(frames.length).padStart(6, "0")}.jpg`;
    fs.writeFileSync(path.join(dir, file), Buffer.from(data, "base64"));
    frames.push({ t: metadata.timestamp, file });
    cdp.send("Page.screencastFrameAck", { sessionId }).catch(() => {});
  });
  await cdp.send("Page.startScreencast", { format: "jpeg", quality: 88, everyNthFrame: 1 });
  return {
    frames,
    stop: () => cdp.send("Page.stopScreencast").catch(() => {}),
  };
}

/**
 * Encodes the captured frames into a constant-frame-rate mp4 that starts at
 * `t0` and ends at `t1` (epoch seconds). The frame showing at `t0` is held from
 * the start; the last frame is held to `t1`. Both panels get identical
 * start/end instants, so they stay aligned in the combined video.
 */
function encodeFrames({ frames }, dir, t0, t1, outFile, size) {
  const before = frames.filter((f) => f.t <= t0).at(-1);
  const within = frames.filter((f) => f.t > t0 && f.t < t1);
  const timeline = [{ ...(before ?? within[0]), t: t0 }, ...within];
  const lines = [];
  timeline.forEach((f, i) => {
    const next = i + 1 < timeline.length ? timeline[i + 1].t : t1;
    lines.push(`file '${f.file}'`, `duration ${Math.max(0.001, next - f.t).toFixed(4)}`);
  });
  // The concat demuxer ignores the last duration unless the file repeats.
  lines.push(`file '${timeline.at(-1).file}'`);
  fs.writeFileSync(path.join(dir, "list.txt"), lines.join("\n"));

  run(
    "ffmpeg",
    [
      "-v",
      "error",
      "-y",
      "-f",
      "concat",
      "-safe",
      "0",
      "-i",
      "list.txt",
      "-vf",
      `fps=${FPS},scale=${size.width}:${size.height}:flags=lanczos,format=yuv420p`,
      "-c:v",
      "libx264",
      "-preset",
      "medium",
      "-crf",
      "20",
      "-movflags",
      "+faststart",
      outFile,
    ],
    dir
  );
}

function run(cmd, cmdArgs, cwd) {
  const r = spawnSync(cmd, cmdArgs, { cwd, encoding: "utf8" });
  if (r.status !== 0) {
    throw new Error(`${cmd} failed (${r.status}):\n${r.stderr || r.stdout}`);
  }
  return r.stdout;
}

// ─── Scenes ──────────────────────────────────────────────────────────────────

const homeUrl = `${BASE}/${LOCALE}/`;
const cardPrefix = (key) => new RegExp(`^${msg(key).replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\s`);

/** Clicks a header nav link; on mobile it lives inside the hamburger menu. */
async function pressHeaderLink(page, kind, name, pauseMs = 1500) {
  let scope = page.locator("header");
  if (kind === "mobile") {
    await press(page.getByRole("button", { name: /^(open menu|abrir menu|abrir menú)/i }), 800);
    scope = page.getByRole("dialog");
  }
  await press(scope.getByRole("link", { name, exact: true }), pauseMs);
}

const SCENES = [
  {
    key: "intro",
    async run({ page }) {
      await page.goto(homeUrl, { waitUntil: "load" });
      await sleep(2200);
      await scrollBy(page, 640);
      await sleep(2200);
      await scrollToY(page, 0);
      await sleep(900);
    },
  },
  {
    key: "theme",
    async run({ page }) {
      const toggle = page.locator(`header button[aria-label^="${msg("theme.switchLabel")}"]`);
      await press(toggle, 2600);
    },
  },
  {
    key: "languages",
    async run({ page }) {
      const select = page.locator("header select").first();
      for (const next of ["en", "es", LOCALE]) {
        if (next === (await select.inputValue())) continue;
        await select.selectOption(next);
        await page.waitForURL(new RegExp(`/${next}/?`), { timeout: 10000 });
        await sleep(1900);
      }
    },
  },
  {
    key: "career",
    async run({ page }) {
      await scrollToSelector(page, "#experience");
      await sleep(1500);
      await press(page.getByRole("tab", { name: msg("careerPath.academic") }), 2300);
      await press(page.getByRole("tab", { name: msg("careerPath.professional") }), 1500);
      const expand = page.getByRole("button", { name: msg("experience.expandDetails") });
      await press(expand, 2800);
      await press(page.getByRole("button", { name: msg("experience.collapseDetails") }), 900);
    },
  },
  {
    key: "projects",
    async run({ page }) {
      await scrollToSelector(page, "#projects");
      await sleep(1700);
      await press(
        page.locator("#projects").getByRole("button", { name: cardPrefix("projects.viewDetails") }),
        2400
      );
      const dialog = page.getByRole("dialog");
      for (let i = 0; i < 2; i++) {
        await press(dialog.getByRole("button", { name: msg("projects.nextProject") }), 2000);
      }
      await page.keyboard.press("Escape");
      await sleep(900);
    },
  },
  {
    key: "posts",
    async run({ page }) {
      await scrollToSelector(page, "#posts");
      await sleep(1900);
      await press(
        page.locator("#posts").getByRole("button", { name: cardPrefix("posts.viewDetails") }),
        2600
      );
      await page.keyboard.press("Escape");
      await sleep(900);
    },
  },
  {
    key: "postsPage",
    async run({ page, kind }) {
      await press(page.locator("#posts").getByRole("link", { name: msg("posts.viewAll") }), 2300);
      await page.waitForURL(/\/posts\/?/, { timeout: 10000 });
      const group = page.getByRole("group", { name: msg("posts.filterByPlatform") });
      await press(group.getByRole("button", { name: msg("posts.platform.youtube") }), 2200);
      await press(group.getByRole("button", { name: msg("posts.platform.linkedin") }), 1800);
      await press(page.getByRole("button", { name: cardPrefix("posts.viewDetails") }), 2400);
      await page.keyboard.press("Escape");
      await sleep(700);
      // Back to the home page through the header: history Back would land on the
      // posts page again with the dialog re-opened (the dialog writes to history).
      await pressHeaderLink(page, kind, msg("nav.home"), 1200);
      await page.waitForSelector("#skills", { timeout: 10000 });
    },
  },
  {
    key: "skills",
    async run({ page }) {
      await scrollToSelector(page, "#skills");
      await sleep(1500);
      const filter = page.getByRole("searchbox", { name: msg("skills.filterAriaLabel") });
      await filter.click();
      await filter.pressSequentially("React", { delay: 220 });
      await sleep(2200);
      await filter.fill("");
      await sleep(900);
    },
  },
  {
    key: "backToTop",
    async run({ page }) {
      // The button label is hard-coded English in the site, whatever the locale.
      await scrollToSelector(page, "#contact", 40);
      await sleep(1700);
      await press(page.getByRole("button", { name: "Back to top" }), 1200);
      await page.waitForFunction(() => window.scrollY < 40, null, { timeout: 8000 });
      await sleep(900);
    },
  },
  {
    key: "techStack",
    async run({ page, kind }) {
      await pressHeaderLink(page, kind, msg("nav.techStack"), 1500);
      await page.waitForURL(/\/tech-stack\/?/, { timeout: 10000 });
      await sleep(1400);
      await scrollBy(page, 760);
      await sleep(1600);
      await scrollToY(page, 0);
      await sleep(700);
    },
  },
  {
    key: "resume",
    async run({ page, kind }) {
      // Mobile Chrome downloads a PDF instead of showing it, which would record
      // a blank panel; mobile holds on the page while desktop shows the viewer.
      if (kind === "mobile") {
        await sleep(4200);
        return;
      }
      const href = await page
        .locator(`header a[aria-label="${msg("footer.downloadResumeLabel")}"]`)
        .first()
        .getAttribute("href");
      if (!href) throw new Error("No résumé link found");
      await page.goto(new URL(href, BASE).toString(), { waitUntil: "load" });
      await sleep(4200);
    },
  },
  {
    key: "outro",
    async run({ page }) {
      await page.goto(homeUrl, { waitUntil: "load" });
      await sleep(2600);
    },
  },
];

// ─── Run both viewports in lockstep ──────────────────────────────────────────

async function launchPage(kind, workDir) {
  const size = SIZES[kind];
  const browser = await chromium.launch({
    channel: "chrome",
    headless: false,
    args: [
      "--disable-backgrounding-occluded-windows",
      "--disable-renderer-backgrounding",
      "--disable-background-timer-throttling",
      "--disable-features=CalculateNativeWinOcclusion",
      `--window-size=${size.width + 40},${size.height + 140}`,
      `--window-position=${kind === "mobile" ? 20 : 520},20`,
    ],
  });
  const context = await browser.newContext({
    viewport: size,
    deviceScaleFactor: 1,
    isMobile: kind === "mobile",
    hasTouch: kind === "mobile",
    colorScheme: "light",
    locale: LOCALE,
  });
  // No cookie banner or exit-intent popup in the footage (the popup fires when the
  // mouse nears the top edge to reach the header, and blocks every click behind
  // it); analytics stay off.
  await context.addInitScript(() => {
    try {
      sessionStorage.setItem("exitIntentDismissed", "true");
      localStorage.setItem("cookie-consent", "customized");
      localStorage.setItem(
        "cookie-preferences",
        JSON.stringify({ analytics: false, functional: true })
      );
    } catch {
      /* storage can be unavailable; the banner then simply shows */
    }
  });
  const page = await context.newPage();
  await page.goto(homeUrl, { waitUntil: "load" });
  await sleep(800);
  const screencast = await startScreencast(page, path.join(workDir, kind));
  return { kind, browser, page, screencast, dir: path.join(workDir, kind) };
}

async function record(workDir) {
  const viewers = [await launchPage("mobile", workDir), await launchPage("desktop", workDir)];
  const marks = [];
  const t0 = now() + 0.5;
  await sleep(600);

  for (const scene of SCENES) {
    const start = now();
    const results = await Promise.allSettled(
      viewers.map(({ page, kind }) => scene.run({ page, kind }))
    );
    const failed = results
      .map((r, i) =>
        r.status === "rejected" ? `${viewers[i].kind}: ${r.reason?.message?.split("\n")[0]}` : null
      )
      .filter(Boolean);
    if (failed.length) log(`scene "${scene.key}" had problems — ${failed.join(" | ")}`);
    marks.push({ key: scene.key, start, end: now(), ok: failed.length === 0 });
    log(
      `scene ${scene.key.padEnd(10)} ${(now() - start).toFixed(1)}s${failed.length ? "  (skipped parts)" : ""}`
    );
  }
  const t1 = now() + 0.4;
  await sleep(500);
  await Promise.all(viewers.map((v) => v.screencast.stop()));
  await Promise.all(viewers.map((v) => v.browser.close()));
  return { viewers, marks, t0, t1 };
}

// ─── Captions + composition (ffmpeg) ─────────────────────────────────────────

/** Greedy word wrap. */
function wrap(text, maxChars) {
  const out = [];
  let line = "";
  for (const word of text.split(" ")) {
    if (line && (line + " " + word).length > maxChars) {
      out.push(line);
      line = word;
    } else line = line ? `${line} ${word}` : word;
  }
  if (line) out.push(line);
  return out;
}

/**
 * drawbox/drawtext filters for the scene captions on a video of width `w`.
 * Returns the filter strings; text files are written into `dir`.
 */
function captionFilters({
  dir,
  prefix,
  w,
  h,
  marks,
  t0,
  sizes,
  wrapAt,
  xOffset = 0,
  bandWidth = w,
}) {
  const filters = [];
  const pad = Math.round(sizes.title * 0.45);
  marks.forEach((mark, i) => {
    const [title, subtitle] = captions[mark.key];
    const blocks = [
      ...wrap(title, wrapAt.title).map((text) => ({ text, size: sizes.title })),
      ...wrap(subtitle, wrapAt.subtitle).map((text) => ({ text, size: sizes.subtitle })),
    ];
    const lineH = (b) => Math.round(b.size * 1.3);
    const bandH = pad * 2 + blocks.reduce((s, b) => s + lineH(b), 0);
    const from = (mark.start - t0).toFixed(2);
    const to = (mark.end - t0).toFixed(2);
    const enable = `enable='between(t,${from},${to})'`;
    filters.push(
      `drawbox=x=${xOffset}:y=${h - bandH}:w=${bandWidth}:h=${bandH}:color=black@0.62:t=fill:${enable}`
    );
    let y = h - bandH + pad;
    blocks.forEach((b, j) => {
      const file = `${prefix}_${i}_${j}.txt`;
      fs.writeFileSync(path.join(dir, file), b.text, "utf8");
      filters.push(
        `drawtext=fontfile=font.ttf:textfile=${file}:fontsize=${b.size}:fontcolor=white:` +
          `x=${xOffset}+(${bandWidth}-text_w)/2:y=${y}:${enable}`
      );
      y += lineH(b);
    });
  });
  return filters;
}

function labelFilter(dir, name, label, x, size) {
  fs.writeFileSync(path.join(dir, `label_${name}.txt`), label, "utf8");
  return `drawtext=fontfile=font.ttf:textfile=label_${name}.txt:fontsize=${size}:fontcolor=white:x=${x}:y=14:box=1:boxcolor=0x444444@0.85:boxborderw=10`;
}

function compose({ workDir, marks, t0 }) {
  fs.copyFileSync(FONT_SRC, path.join(workDir, "font.ttf"));
  const out = (name, ext = "mp4") => path.join(OUT, `walkthrough-${name}${SUFFIX}.${ext}`);
  fs.mkdirSync(OUT, { recursive: true });

  // Individual videos: captions only (the Mobile/Desktop label is for the combined view).
  for (const kind of ["mobile", "desktop"]) {
    const { width: w, height: h } = SIZES[kind];
    const filters = captionFilters({
      dir: workDir,
      prefix: kind,
      w,
      h,
      marks,
      t0,
      sizes: kind === "mobile" ? { title: 26, subtitle: 18 } : { title: 36, subtitle: 26 },
      wrapAt: kind === "mobile" ? { title: 26, subtitle: 38 } : { title: 60, subtitle: 90 },
    });
    run(
      "ffmpeg",
      [
        "-v",
        "error",
        "-y",
        "-i",
        path.join(workDir, `raw-${kind}.mp4`),
        "-vf",
        filters.join(","),
        "-c:v",
        "libx264",
        "-preset",
        "slow",
        "-crf",
        "27",
        "-pix_fmt",
        "yuv420p",
        "-movflags",
        "+faststart",
        out(kind),
      ],
      workDir
    );
    log(`wrote ${path.basename(out(kind))}`);
  }

  // Combined: mobile and desktop side by side, both 900px high.
  const mobileW = Math.round((SIZES.mobile.width * COMBINED_HEIGHT) / SIZES.mobile.height / 2) * 2;
  const desktopW =
    Math.round((SIZES.desktop.width * COMBINED_HEIGHT) / SIZES.desktop.height / 2) * 2;
  const W = mobileW + DIVIDER + desktopW;
  const H = COMBINED_HEIGHT;
  const overlay = [
    labelFilter(workDir, "mobile", "Mobile", 12, 30),
    labelFilter(workDir, "desktop", "Desktop", mobileW + DIVIDER + 12, 30),
    ...captionFilters({
      dir: workDir,
      prefix: "combined",
      w: W,
      h: H,
      marks,
      t0,
      sizes: { title: 40, subtitle: 30 },
      wrapAt: { title: 80, subtitle: 110 },
    }),
  ];
  const graph =
    `[0:v]scale=${mobileW}:${H}[m];[1:v]scale=${desktopW}:${H}[d];` +
    `color=c=black:s=${DIVIDER}x${H}:r=${FPS}[g];[m][g][d]hstack=inputs=3:shortest=1,${overlay.join(",")}[v]`;
  run(
    "ffmpeg",
    [
      "-v",
      "error",
      "-y",
      "-i",
      path.join(workDir, "raw-mobile.mp4"),
      "-i",
      path.join(workDir, "raw-desktop.mp4"),
      "-filter_complex",
      graph,
      "-map",
      "[v]",
      "-shortest",
      "-c:v",
      "libx264",
      "-preset",
      "slow",
      "-crf",
      "27",
      "-pix_fmt",
      "yuv420p",
      "-movflags",
      "+faststart",
      out("combined"),
    ],
    workDir
  );
  log(`wrote ${path.basename(out("combined"))}`);

  // Thumbnail: the intro scene as it first reads with its caption up.
  run(
    "ffmpeg",
    [
      "-v",
      "error",
      "-y",
      "-ss",
      "1.6",
      "-i",
      out("combined"),
      "-frames:v",
      "1",
      out("video-image-thumbnail", "png"),
    ],
    workDir
  );
  log(`wrote ${path.basename(out("video-image-thumbnail", "png"))}`);
}

// ─── Main ────────────────────────────────────────────────────────────────────

const workDir = fs.mkdtempSync(path.join(os.tmpdir(), `walkthrough-${LOCALE}-`));
try {
  log(`recording ${homeUrl} → ${OUT}`);
  const { viewers, marks, t0, t1 } = await record(workDir);
  for (const v of viewers) {
    log(`${v.kind}: ${v.screencast.frames.length} frames`);
    encodeFrames(
      v.screencast,
      v.dir,
      t0,
      t1,
      path.join(workDir, `raw-${v.kind}.mp4`),
      SIZES[v.kind]
    );
  }
  fs.writeFileSync(path.join(workDir, "marks.json"), JSON.stringify({ t0, t1, marks }, null, 2));
  compose({ workDir, marks: marks.filter((m) => captions[m.key]), t0 });
  log(`done — ${(t1 - t0).toFixed(1)}s`);
} finally {
  if (KEEP_WORK) log(`kept work dir: ${workDir}`);
  else fs.rmSync(workDir, { recursive: true, force: true });
}
