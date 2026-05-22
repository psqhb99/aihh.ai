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

  const indexHtml = await fs.readFile(path.join(ROOT, 'index.html'), 'utf8');
  const checks = [
    ['HUB_HEAD_SEO markers', /<!-- HUB_HEAD_SEO_START -->/],
    ['hreflang zh-CN', /hreflang="zh-CN"/],
    ['Organization schema', /"@type":"Organization"/],
    ['FAQPage schema', /"@type":"FAQPage"/],
    ['hub-faq section', /id="hub-faq"/],
    ['tool-directory-crawl', /id="tool-directory-crawl"/],
    ['footer legal links', /legal\/terms\.html/],
    ['sitemap link in head', /rel="sitemap"/]
  ];
  for (const [label, re] of checks) {
    if (!re.test(indexHtml)) issues.push(`index.html missing: ${label}`);
  }

  const crawlLinks = (indexHtml.match(/href="https:\/\/tool\d{5}\./g) || []).length;
  if (crawlLinks < tools.length) {
    issues.push(`crawl links ${crawlLinks} < ${tools.length} tools`);
  }

  const sitemap = await fs.readFile(path.join(ROOT, 'sitemap.xml'), 'utf8');
  const sitemapUrls = (sitemap.match(/<loc>/g) || []).length;
  if (sitemapUrls !== tools.length + 1) {
    issues.push(`sitemap URLs ${sitemapUrls} expected ${tools.length + 1}`);
  }

  if (issues.length) {
    console.error(`Hub SEO validation failed (${issues.length} issues):`);
    issues.slice(0, 25).forEach((i) => console.error(`  - ${i}`));
    if (issues.length > 25) console.error(`  ... and ${issues.length - 25} more`);
    process.exit(1);
  }
  console.log(
    `Hub SEO OK: ${tools.length} card images, OG, ${crawlLinks} crawl links, ${sitemapUrls} sitemap URLs, structured data blocks.`
  );
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
