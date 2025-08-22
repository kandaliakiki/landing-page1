import fs from "fs/promises";
import path from "path";
import archiver from "archiver";
import { createWriteStream } from "fs";

const ROOT = process.cwd();
const DIST_DIR = path.join(ROOT, "dist-offline");
const SITE_DIR = path.join(DIST_DIR, "site");
const ZIP_PATH = path.join(ROOT, "site.zip");

async function exists(p) {
  try {
    await fs.access(p);
    return true;
  } catch {
    return false;
  }
}

async function main() {
  if (!(await exists(SITE_DIR))) {
    console.error("dist-offline/site not found. Run: npm run publish:offline");
    process.exit(1);
  }
  const out = createWriteStream(ZIP_PATH);
  const archive = archiver("zip", { zlib: { level: 9 } });
  archive.directory(SITE_DIR, false);
  archive.pipe(out);
  await archive.finalize();
  console.log(`Created ${ZIP_PATH}`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
