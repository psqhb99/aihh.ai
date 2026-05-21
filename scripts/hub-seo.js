/**
 * Hub navigation SEO: slug filenames, alt text, SVG card icons, OG paths.
 */
const path = require('path');

const CATEGORY_COLORS = {
  'Development & Data': '#64f4c4',
  'SEO & Webmasters': '#a5b4fc',
  'Office & Spreadsheets': '#ffd166',
  'Privacy & Compliance': '#f9a8d4',
  'Content & Writing': '#86efac',
  'Design & Frontend': '#67e8f9',
  'Productivity & Learning': '#c4b5fd',
  'Analytics': '#94a3b8'
};

function slugify(text, maxLen = 52) {
  return String(text ?? '')
    .toLowerCase()
    .replace(/&/g, ' and ')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, maxLen)
    .replace(/-+$/g, '') || 'tool';
}

function cardImageFileName(tool) {
  return `${tool.id}-${slugify(tool.name)}.svg`;
}

function cardImageAlt(tool) {
  return `${tool.name} — free online ${tool.keywords[0] || 'tool'} on AIHH.ai`;
}

function cardLinkTitle(tool) {
  return `Open ${tool.name} — free, runs in your browser, no upload`;
}

function cardAnchorLabel(tool) {
  const kw = tool.keywords[0] || tool.name;
  return `${tool.name} — ${kw}`;
}

function categoryColor(category) {
  return CATEGORY_COLORS[category] || '#64f4c4';
}

function buildCardSvg(tool) {
  const label = tool.name.length > 28 ? `${tool.name.slice(0, 26)}…` : tool.name;
  const sub = tool.subcategory || tool.category;
  const color = categoryColor(tool.category);
  const safeTitle = `${tool.name} | ${tool.id} | AIHH.ai tool icon`;
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="128" height="128" viewBox="0 0 128 128" role="img" aria-labelledby="t d">
  <title id="t">${safeTitle.replace(/[<>&]/g, '')}</title>
  <desc id="d">${cardImageAlt(tool).replace(/[<>&]/g, '')}</desc>
  <rect width="128" height="128" rx="20" fill="#0b1220"/>
  <rect x="8" y="8" width="112" height="112" rx="16" fill="#102022" stroke="${color}" stroke-width="2"/>
  <text x="64" y="52" text-anchor="middle" font-family="system-ui,sans-serif" font-size="11" fill="${color}" font-weight="700">${tool.id.replace('tool', '#')}</text>
  <text x="64" y="72" text-anchor="middle" font-family="system-ui,sans-serif" font-size="9" fill="#cde9df">${label.replace(/[<>&]/g, '')}</text>
  <text x="64" y="92" text-anchor="middle" font-family="system-ui,sans-serif" font-size="7" fill="#9bb1aa">${sub.replace(/[<>&]/g, '').slice(0, 24)}</text>
</svg>`;
}

function buildDirectoryOgSvg(toolCount) {
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630" role="img">
  <title>AIHH.ai — ${toolCount} free online tools directory</title>
  <desc>Browse free browser-based developer, SEO, PDF, image, and productivity tools on AIHH.ai</desc>
  <rect width="1200" height="630" fill="#071012"/>
  <rect x="40" y="40" width="1120" height="550" rx="32" fill="#102022" stroke="#64f4c4" stroke-width="3"/>
  <text x="80" y="200" font-family="system-ui,sans-serif" font-size="72" font-weight="900" fill="#64f4c4">AIHH.ai</text>
  <text x="80" y="280" font-family="system-ui,sans-serif" font-size="36" fill="#eef7f2">${toolCount} free online tools</text>
  <text x="80" y="340" font-family="system-ui,sans-serif" font-size="24" fill="#9bb1aa">JSON · SEO · PDF · Image · Dev utilities — client-side, no upload</text>
</svg>`;
}

function buildHubCardFields(tool) {
  const file = cardImageFileName(tool);
  return {
    cardSlug: slugify(tool.name),
    cardImage: `assets/hub/tools/${file}`,
    cardImageUrl: `https://aihh.ai/assets/hub/tools/${file}`,
    cardImageAlt: cardImageAlt(tool),
    cardImageWidth: 128,
    cardImageHeight: 128,
    linkTitle: cardLinkTitle(tool),
    anchorLabel: cardAnchorLabel(tool),
    applicationCategory: tool.category,
    keywordsList: (tool.keywords || []).slice(0, 4)
  };
}

module.exports = {
  slugify,
  cardImageFileName,
  cardImageAlt,
  cardLinkTitle,
  cardAnchorLabel,
  buildCardSvg,
  buildDirectoryOgSvg,
  buildHubCardFields
};
