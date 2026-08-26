#!/usr/bin/env node
/**
 * editor-server.mjs — tiny local-only web UI for editing the resume
 * markdown and triggering build-pdfs.mjs, so the whole pipeline can be
 * driven from a browser instead of the terminal.
 *
 * Usage:
 *   node docs/personal-notes/career/editor-server.mjs
 *   npm run resume-editor
 *
 * No extra dependencies: uses only Node's built-in http/fs modules and
 * shells out to build-pdfs.mjs, same as running it from the terminal.
 * Binds to 127.0.0.1 only — never exposed beyond this machine.
 */

import { createServer } from "node:http";
import { readFile, writeFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { spawn } from "node:child_process";

const DIR = path.dirname(fileURLToPath(import.meta.url));
const BUILD_SCRIPT = path.join(DIR, "build-pdfs.mjs");
const OUT = path.join(DIR, "output");
const PORT = process.env.PORT ? Number(process.env.PORT) : 5055;

const RESUMES = [
  { id: "en", label: "English", file: "resume-en.md" },
  { id: "es", label: "Español", file: "resume-es.md" },
  { id: "pt-BR", label: "Português", file: "resume-pt-BR.md" },
];

const findResume = (id) => RESUMES.find((r) => r.id === id);

function runBuild({ publish }) {
  return new Promise((resolve) => {
    const args = [BUILD_SCRIPT];
    if (publish) args.push("--publish");
    const child = spawn(process.execPath, args, { cwd: DIR });
    let log = "";
    child.stdout.on("data", (d) => (log += d.toString()));
    child.stderr.on("data", (d) => (log += d.toString()));
    child.on("close", (code) => resolve({ ok: code === 0, log }));
    child.on("error", (err) => resolve({ ok: false, log: log + `\n${err.message}` }));
  });
}

function sendJson(res, status, data) {
  const body = JSON.stringify(data);
  res.writeHead(status, { "Content-Type": "application/json; charset=utf-8" });
  res.end(body);
}

async function readBody(req) {
  const chunks = [];
  for await (const chunk of req) chunks.push(chunk);
  return Buffer.concat(chunks).toString("utf8");
}

const MIME = { ".html": "text/html; charset=utf-8", ".pdf": "application/pdf" };

const server = createServer(async (req, res) => {
  try {
    const url = new URL(req.url, `http://${req.headers.host}`);

    if (url.pathname === "/" && req.method === "GET") {
      const html = await readFile(path.join(DIR, "editor.html"));
      res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
      res.end(html);
      return;
    }

    if (url.pathname === "/api/resumes" && req.method === "GET") {
      sendJson(
        res,
        200,
        RESUMES.map(({ id, label }) => ({ id, label }))
      );
      return;
    }

    const resumeMatch = url.pathname.match(/^\/api\/resumes\/([\w-]+)$/);
    if (resumeMatch) {
      const resume = findResume(resumeMatch[1]);
      if (!resume) {
        sendJson(res, 404, { error: "Unknown resume id" });
        return;
      }
      const filePath = path.join(DIR, resume.file);

      if (req.method === "GET") {
        const content = await readFile(filePath, "utf8");
        sendJson(res, 200, { content });
        return;
      }

      if (req.method === "PUT") {
        const body = await readBody(req);
        let content;
        try {
          ({ content } = JSON.parse(body));
        } catch {
          sendJson(res, 400, { error: "Invalid JSON body" });
          return;
        }
        if (typeof content !== "string") {
          sendJson(res, 400, { error: "content must be a string" });
          return;
        }
        await writeFile(filePath, content, "utf8");
        sendJson(res, 200, { ok: true });
        return;
      }
    }

    if (url.pathname === "/api/build" && req.method === "POST") {
      const body = await readBody(req);
      let publish = false;
      try {
        publish = !!JSON.parse(body || "{}").publish;
      } catch {
        // no body / invalid JSON just means publish=false
      }
      const result = await runBuild({ publish });
      sendJson(res, result.ok ? 200 : 500, result);
      return;
    }

    const previewMatch = url.pathname.match(/^\/preview\/([\w-]+)\.(html|pdf)$/);
    if (previewMatch && req.method === "GET") {
      const [, id, ext] = previewMatch;
      if (!findResume(id)) {
        sendJson(res, 404, { error: "Unknown resume id" });
        return;
      }
      const filePath = path.join(OUT, `resume-${id}.${ext}`);
      if (!existsSync(filePath)) {
        sendJson(res, 404, { error: "Not built yet — click Build first" });
        return;
      }
      const data = await readFile(filePath);
      res.writeHead(200, { "Content-Type": MIME[`.${ext}`] });
      res.end(data);
      return;
    }

    res.writeHead(404, { "Content-Type": "text/plain" });
    res.end("Not found");
  } catch (err) {
    sendJson(res, 500, { error: err.message });
  }
});

server.listen(PORT, "127.0.0.1", () => {
  console.log(`Résumé editor running at http://127.0.0.1:${PORT} (local only)`);
});
