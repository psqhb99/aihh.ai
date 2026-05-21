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
  Analytics: '#94a3b8'
};

/** Large center glyph on hub cards (category default, kind override). */
const CATEGORY_EMOJI = {
  'Development & Data': '{ }',
  'SEO & Webmasters': '🔍',
  'Office & Spreadsheets': '📊',
  'Privacy & Compliance': '🔒',
  'Content & Writing': '✎',
  'Design & Frontend': '◆',
  'Productivity & Learning': '⚡',
  Analytics: '📈'
};

const KIND_GLYPH = {
  json: '{ }',
  'json-formatter': '{ }',
  jwt: '🛡',
  cron: '⏱',
  regex: '.*',
  yaml: '⇄',
  base64: '64',
  hash: '#',
  diff: '≠',
  url: '🔗',
  http: '⇄',
  sql: '▦',
  uuid: 'id',
  docker: '🐳',
  nginx: '◎',
  seo: '🔍',
  serp: '🔍',
  sitemap: '🗺',
  pdf: '📄',
  image: '🖼',
  csv: '▤',
  markdown: '¶',
  password: '🔑',
  privacy: '🔒',
  color: '🎨',
  svg: '◇',
  font: 'Aa',
  calc: '∑',
  unit: '↔',
  text: 'T',
  list: '☰',
  encode: '↦',
  decode: '↤',
  timestamp: '⏱',
  webhook: '⚡',
  api: 'API',
  git: '⎇',
  license: '©',
  manifest: '◎',
  lighthouse: '◉',
  utm: '↗',
  qr: '▣'
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

function iconGlyphForTool(tool) {
  const kind = String(tool.kind || '').toLowerCase();
  if (kind && KIND_GLYPH[kind]) return KIND_GLYPH[kind];
  for (const [key, glyph] of Object.entries(KIND_GLYPH)) {
    if (kind.includes(key)) return glyph;
  }
  const kw = String((tool.keywords && tool.keywords[0]) || '').toLowerCase();
  for (const [key, glyph] of Object.entries(KIND_GLYPH)) {
    if (kw.includes(key)) return glyph;
  }
  return CATEGORY_EMOJI[tool.category] || '⚙';
}

function escapeXml(text) {
  return String(text ?? '').replace(/[<>&]/g, '');
}

function buildCardSvg(tool) {
  const label = tool.name.length > 22 ? `${tool.name.slice(0, 20)}…` : tool.name;
  const sub = (tool.subcategory || tool.category || '').slice(0, 18);
  const color = categoryColor(tool.category);
  const glyph = iconGlyphForTool(tool);
  const num = tool.id.replace(/^tool/, '');
  const isEmoji = /\p{Extended_Pictographic}/u.test(glyph);
  const glyphSize = isEmoji ? 38 : glyph.length > 2 ? 22 : 30;
  const glyphY = isEmoji ? 62 : 66;
  const safeTitle = `${tool.name} | ${tool.id} | AIHH.ai tool icon`;

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="128" height="128" viewBox="0 0 128 128" role="img" aria-labelledby="t d">
  <title id="t">${escapeXml(safeTitle)}</title>
  <desc id="d">${escapeXml(cardImageAlt(tool))}</desc>
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#0b1220"/>
      <stop offset="100%" stop-color="#0f1a2e"/>
    </linearGradient>
  </defs>
  <rect width="128" height="128" rx="22" fill="url(#bg)"/>
  <rect x="6" y="6" width="116" height="116" rx="18" fill="#0f172a" stroke="${color}" stroke-width="2" opacity="0.95"/>
  <circle cx="64" cy="54" r="34" fill="${color}" fill-opacity="0.14" stroke="${color}" stroke-width="1.5" stroke-opacity="0.55"/>
  <text x="64" y="${glyphY}" text-anchor="middle" font-family="system-ui,Segoe UI Emoji,sans-serif" font-size="${glyphSize}" fill="${color}" font-weight="700">${escapeXml(glyph)}</text>
  <text x="64" y="98" text-anchor="middle" font-family="system-ui,sans-serif" font-size="8.5" fill="#e2e8f0" font-weight="600">${escapeXml(label)}</text>
  <text x="64" y="112" text-anchor="middle" font-family="system-ui,sans-serif" font-size="7" fill="#94a3b8">${escapeXml(sub)}</text>
  <rect x="14" y="14" width="28" height="14" rx="7" fill="#1e293b"/>
  <text x="28" y="24" text-anchor="middle" font-family="ui-monospace,Consolas,monospace" font-size="7" fill="#64748b">#${escapeXml(num)}</text>
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
    iconGlyph: iconGlyphForTool(tool),
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
  iconGlyphForTool,
  buildCardSvg,
  buildDirectoryOgSvg,
  buildHubCardFields
};
