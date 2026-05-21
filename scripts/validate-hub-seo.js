const fs = require('fs/promises');
const path = require('path');
const { buildToolsList } = require('./tools-en-catalog');
const { cardImageFileName } = require('./hub-seo');

const ROOT = path.resolve(__dirname, '..');
const ASSETS = path.join(ROOT, 'assets', 'hub', 'tools');

async function main() {
  const tools = buildToolsList();
  const issues = [];
  for (const tool of tools) {
    const file = path.join(ASSETS, cardImageFileName(tool));
    try {
      await fs.access(file);
    } catch {
      issues.push(`missing card image: ${cardImageFileName(tool)}`);
    }
  }
  const ogDir = path.join(ROOT, 'assets', 'hub', 'og');
  const ogName = `aihh-tool-directory-${tools.length}-tools.svg`;
  try {
    await fs.access(path.join(ogDir, ogName));
  } catch {
    issues.push(`missing OG image: og/${ogName}`);
  }

  if (issues.length) {
    console.error(`Hub SEO validation failed (${issues.length} issues):`);
    issues.slice(0, 20).forEach((i) => console.error(`  - ${i}`));
    if (issues.length > 20) console.error(`  ... and ${issues.length - 20} more`);
    process.exit(1);
  }
  console.log(`Hub SEO OK: ${tools.length} card images + OG SVG.`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
