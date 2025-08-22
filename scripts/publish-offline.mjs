import fs from "fs/promises";
import path from "path";

const ROOT = process.cwd();
const OUT_DIR = path.join(ROOT, "out");
const DIST_DIR = path.join(ROOT, "dist-offline");
const SITE_DIR = path.join(DIST_DIR, "site");
const PUBLIC_SITE_DIR = path.join(ROOT, "public", "site");

async function exists(p) {
  try {
    await fs.access(p);
    return true;
  } catch {
    return false;
  }
}

async function read(file) {
  return fs.readFile(file, "utf8");
}
async function write(file, content) {
  await fs.mkdir(path.dirname(file), { recursive: true });
  await fs.writeFile(file, content, "utf8");
}

function stripLeadingSlash(u) {
  return u.startsWith("/") ? u.slice(1) : u;
}

function rewriteAbsoluteUrlsToRelative(html) {
  // Replace href/src that start with "/" to be relative
  return html.replace(/(href|src)="\/(?!\/)/g, '$1="');
}

// NOTE: We avoid inlining. Keeping Next's files in _next/ and just rewiring
// absolute paths to relative makes the export file:// friendly while preserving
// script execution order.

async function copyDir(src, dest) {
  await fs.mkdir(dest, { recursive: true });
  const entries = await fs.readdir(src, { withFileTypes: true });
  for (const e of entries) {
    const s = path.join(src, e.name);
    const d = path.join(dest, e.name);
    if (e.isDirectory()) {
      await copyDir(s, d);
    } else if (e.isFile()) {
      await fs.copyFile(s, d);
    }
  }
}

async function processFile(srcHtmlPath, outHtmlPath) {
  let html = await read(srcHtmlPath);
  html = rewriteAbsoluteUrlsToRelative(html);
  await write(outHtmlPath, html);
}

async function main() {
  if (!(await exists(OUT_DIR))) {
    console.error("out/ not found. Run: npm run build");
    process.exit(1);
  }

  // Fresh dist folder
  if (await exists(DIST_DIR)) {
    await fs.rm(DIST_DIR, { recursive: true, force: true });
  }
  await fs.mkdir(DIST_DIR, { recursive: true });
  await copyDir(OUT_DIR, SITE_DIR);
  // Mirror to public/site for hosted editor access
  try {
    await fs.rm(PUBLIC_SITE_DIR, { recursive: true, force: true });
  } catch {}
  await copyDir(OUT_DIR, PUBLIC_SITE_DIR);

  const srcLanding = path.join(OUT_DIR, "index.html");
  const srcEditor = path.join(OUT_DIR, "editor", "index.html");

  if (!(await exists(srcLanding))) {
    console.error("Missing out/index.html");
    process.exit(1);
  }
  if (!(await exists(srcEditor))) {
    console.error("Missing out/editor/index.html");
    process.exit(1);
  }

  await processFile(srcLanding, path.join(SITE_DIR, "index.html"));
  await processFile(srcEditor, path.join(SITE_DIR, "editor.html"));

  // Build a manifest of all files within site/ for client-side zipping
  async function collect(dir, base) {
    const out = [];
    const entries = await fs.readdir(dir, { withFileTypes: true });
    for (const e of entries) {
      const p = path.join(dir, e.name);
      const rel = path.relative(base, p).replace(/\\/g, "/");
      if (e.isDirectory()) {
        out.push(...(await collect(p, base)));
      } else if (e.isFile()) {
        out.push(rel);
      }
    }
    return out;
  }
  const files = await collect(SITE_DIR, SITE_DIR);
  await write(
    path.join(SITE_DIR, "manifest.json"),
    JSON.stringify({ files }, null, 2)
  );
  await write(
    path.join(PUBLIC_SITE_DIR, "manifest.json"),
    JSON.stringify({ files }, null, 2)
  );

  // Helper scripts for customers
  const readme = `To use the landing page builder:\n\n- Install Node.js: https://nodejs.org/en/download\n- Run start-windows.bat (Windows) or start-mac-linux.sh (macOS/Linux) in this folder\n- Open http://localhost:3000/ (or the URL shown in the terminal after you run the script)\n- Edit your landing page in the editor, then click \'Publish ZIP\' when finished\n- Deploy the downloaded ZIP (e.g., on Netlify)\n- Your landing page is ready!\n\nDemo video:\n- https://www.youtube.com/watch?v=LQp74SBSu2Y
`;
  await write(path.join(DIST_DIR, "README-OFFLINE.txt"), readme);
  const win = `@echo off\ncd /d "%~dp0"\nnpx --yes serve site\n`;
  await write(path.join(DIST_DIR, "start-windows.bat"), win);
  const sh = `#!/usr/bin/env bash\ncd "$(dirname "$0")"\nnpx --yes serve site\n`;
  await write(path.join(DIST_DIR, "start-mac-linux.sh"), sh);

  console.log("Offline files created in dist-offline/:");
  console.log("- site/index.html (landing)");
  console.log("- site/editor.html (editor)");
  console.log(
    "- start-windows.bat, start-mac-linux.sh, README-OFFLINE.txt at root"
  );
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
