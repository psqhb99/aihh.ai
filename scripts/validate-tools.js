const fs = require('fs/promises');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const TOOLS_DIR = path.join(ROOT, 'tools');
const REQUIRED_FILES = ['index.html', 'style.css', 'app.js', 'README.md', 'robots.txt', 'sitemap.xml', 'CNAME'];
const REQUIRED_HTML = [
  ['<title>', /<title>[^<]{8,}<\/title>/i],
  ['meta description', /<meta\s+name=["']description["'][^>]+content=["'][^"']{40,}["']/i],
  ['canonical', /<link\s+rel=["']canonical["'][^>]+href=["']https:\/\/tool\d{5}\.aihh\.ai\//i],
  ['H1', /<h1>[^<]+<\/h1>/i],
  ['FAQ', /id=["']faq["']/i],
  ['JSON-LD', /application\/ld\+json/i],
  ['AIHH link', /https:\/\/aihh\.ai\//i]
];

async function exists(file) {
  return fs.access(file).then(() => true).catch(() => false);
}

async function validateTool(dirName) {
  const dir = path.join(TOOLS_DIR, dirName);
  const issues = [];

  for (const file of REQUIRED_FILES) {
    if (!(await exists(path.join(dir, file)))) issues.push(`missing ${file}`);
  }

  const htmlPath = path.join(dir, 'index.html');
  if (await exists(htmlPath)) {
    const html = await fs.readFile(htmlPath, 'utf8');
    for (const [label, regex] of REQUIRED_HTML) {
      if (!regex.test(html)) issues.push(`missing ${label}`);
    }
  }

  const cnamePath = path.join(dir, 'CNAME');
  if (await exists(cnamePath)) {
    const cname = (await fs.readFile(cnamePath, 'utf8')).trim();
    if (cname !== dirName) issues.push(`CNAME mismatch: ${cname}`);
  }

  const robotsPath = path.join(dir, 'robots.txt');
  if (await exists(robotsPath)) {
    const robots = await fs.readFile(robotsPath, 'utf8');
    if (!robots.includes(`https://${dirName}/sitemap.xml`)) issues.push('robots sitemap mismatch');
  }

  return { dirName, issues };
}

async function main() {
  const dirs = (await fs.readdir(TOOLS_DIR, { withFileTypes: true }))
    .filter((entry) => entry.isDirectory() && /^tool\d{5}\.aihh\.ai$/.test(entry.name))
    .map((entry) => entry.name)
    .sort();

  const results = [];
  for (const dir of dirs) results.push(await validateTool(dir));

  const failed = results.filter((item) => item.issues.length);
  console.log(`Checked ${results.length} tool directories.`);

  if (failed.length) {
    for (const item of failed) {
      console.log(`\n${item.dirName}`);
      for (const issue of item.issues) console.log(`  - ${issue}`);
    }
    process.exitCode = 1;
  } else {
    console.log('All tools passed structural SEO validation.');
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
