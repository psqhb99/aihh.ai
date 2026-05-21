const fs = require('fs/promises');
const path = require('path');
const { runSync, samples } = require('./tool-runtime');

const ROOT = path.resolve(__dirname, '..');
const TOOLS_DIR = path.join(ROOT, 'tools');

async function main() {
  const dirs = (await fs.readdir(TOOLS_DIR, { withFileTypes: true }))
    .filter((e) => e.isDirectory() && /^tool\d{5}\.aihh\.ai$/.test(e.name))
    .map((e) => e.name)
    .sort();

  const failed = [];
  for (const dir of dirs) {
    const html = await fs.readFile(path.join(TOOLS_DIR, dir, 'index.html'), 'utf8');
    const kindMatch = html.match(/"kind":"([^"]+)"/);
    if (!kindMatch) {
      failed.push({ dir, error: 'missing kind in TOOL_CONFIG' });
      continue;
    }
    const kind = kindMatch[1];
    const sample = samples[kind];
    if (!sample) {
      failed.push({ dir, error: `missing sample for kind ${kind}` });
      continue;
    }
    try {
      const out = runSync(kind, sample);
      if (!out || String(out).trim().length < 2) failed.push({ dir, error: 'empty output' });
    } catch (error) {
      failed.push({ dir, error: error.message });
    }
  }

  console.log(`Smoke-tested ${dirs.length} tools.`);
  if (failed.length) {
    failed.forEach((item) => console.log(`${item.dir}: ${item.error}`));
    process.exitCode = 1;
  } else {
    console.log('All tool kinds produced output from sample data.');
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
