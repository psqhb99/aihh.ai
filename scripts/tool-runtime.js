'use strict';

const config = (typeof window !== 'undefined' && window.TOOL_CONFIG) || {};
const input = typeof document !== 'undefined' ? document.getElementById('inputText') : null;
const output = typeof document !== 'undefined' ? document.getElementById('outputText') : null;
const statusEl = typeof document !== 'undefined' ? document.getElementById('status') : null;

const samples = {
  'json-format': '{"name":"AIHH","tools":[{"id":1,"ok":true}],"meta":{"source":"demo"}}',
  hmac: 'secret=demo-secret\nmessage=timestamp=1710000000&body={"ok":true}',
  timestamp: '1710000000\n1710000000000\n2026-05-13T08:30:00+08:00',
  'header-audit': 'content-type: text/html\nstrict-transport-security: max-age=31536000\naccess-control-allow-origin: *',
  jwt: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjMiLCJleHAiOjE4MDAwMDAwMDAsImlhdCI6MTcxMDAwMDAwMH0.demo',
  'url-diff': 'https://example.com/?utm_source=a&id=10\nhttps://example.com/?utm_source=b&id=10&ref=nav',
  'regex-extract': 'regex: [a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,}\nText: hi a@example.com and b@test.org',
  'json-schema': '{"id":1,"name":"demo","tags":["seo","tool"],"active":true}',
  'yaml-json': '{"name":"demo","enabled":true,"count":3}',
  'base64-image': 'data:image/png;base64,iVBORw0KGgo=',
  encoding: '%E4%BD%A0%E5%A5%BD%20AIHH%20\\u4f60\\u597d',
  'csv-tools': 'name,email,score\nAnn,ann@example.com,90\nBob,bob@example.com,88',
  redactor: 'John 13812345678 john@example.com 110101199001011234 6222021234567890123',
  jsonpath: '{"user":{"name":"Ann","roles":["admin","editor"]},"ok":true}',
  diff: 'line one left\nsame line\nold block\n---\nline one right\nsame line\nnew block',
  cron: '*/15 9-18 * * 1-5',
  uuid: '10',
  'sql-in': '1001\n1002\nA-1003\n1002',
  'phone-check': '13812345678\n19900001111\n12345',
  'status-search': '404\n422\n500',
  'meta-counter': 'AIHH.ai Free Online Tools Directory\nOne hundred client-side utilities for developers and SEO.',
  'serp-preview': 'AIHH.ai Free JSON Formatter Online\nhttps://tool00001.aihh.ai/\nFormat, validate, and minify JSON in your browser.',
  utm: 'url=https://example.com/page\nsource=google\nmedium=cpc\ncampaign=spring_tools',
  intent: 'json formatter\nbuy pdf converter\naihh login\nbest sitemap generator',
  htags: '<h1>Title</h1><h2>Section</h2><img src="a.png"><meta name="description" content="demo">',
  robots: 'sitemap=https://example.com/sitemap.xml\ndisallow=/admin\ndisallow=/private',
  sitemap: 'https://example.com/\nhttps://example.com/tool-a\nhttps://example.com/tool-b',
  'og-tags': 'title=Demo Page\ndescription=Useful page\nurl=https://example.com/\nimage=https://example.com/og.png',
  'faq-schema': 'Q: Is it free?\nA: Yes.\nQ: Does it upload data?\nA: No.',
  slug: 'AIHH Free JSON Formatter Online Tool',
  markdown: '# Title\n\n## Step One\n\nSome **bold** text.',
  'word-counter': 'This is sample content mixed with English words for reading time.',
  'case-convert': 'hello world example_text',
  'duplicate-lines': 'apple\nbanana\napple\norange',
  'sort-lines': 'zebra\nApple\nbanana\nalpha',
  password: 'length=18\nupper=true\nlower=true\nnumbers=true\nsymbols=true',
  hash: 'AIHH.ai',
  'invoice-vat': 'amount=1000\nrate=13',
  'privacy-copy': 'site=AIHH.ai\nemail=hello@aihh.ai\nmode=local browser tool',
  'nginx-config': 'server_name=tool.aihh.ai\nproxy_pass=http://127.0.0.1:4399\ngzip=on',
  'docker-run': 'image=nginx:alpine\nname=aihh-demo\nports=8080:80\nvolume=./data:/usr/share/nginx/html:ro',
  'k8s-yaml': 'name=aihh-api\nimage=nginx:alpine\nport=80\nreplicas=2',
  'curl-fetch': "curl -X POST 'https://api.example.com/items' -H 'Authorization: Bearer token' -d '{\"ok\":true}'",
  'json-to-ts': '{"id":1,"name":"demo","tags":["seo"],"active":true}',
  'env-sort': 'API_KEY=demo\nPORT=4399\nAPI_KEY=duplicate\n# comment',
  'port-cmd': 'port=3000\nos=win',
  'url-batch': 'Hello AIHH\nhttps://example.com?q=test',
  'ip-cidr': '192.168.1.0/24',
  'color-convert': '#64f4c4\nrgb(100,244,196)',
  'css-clamp': 'min=16\nmax=32\nviewport=1200',
  'css-grid': 'cols=3\nrows=2\ngap=16px',
  flexbox: 'justify=center\nalign=stretch\ndirection=row\nwrap=wrap',
  'tailwind-sort': 'p-4 flex gap-2 text-sm p-2 rounded-lg',
  'aspect-ratio': 'width=1920\nheight=1080',
  'svg-viewbox': '<svg viewBox="0 0 120 80" width="120" height="80"></svg>',
  'title-ab-score': 'Free JSON Formatter Online Tool\nJSON Formatter Online Free Tool',
  'xhs-note': 'product=Portable JSON tool\naudience=Developers\nhighlight=Runs in browser only',
  'video-script': 'topic=Tool site SEO growth\nlength=60s',
  'email-subject': 'AIHH update: 10 new developer tools\nWeekly picks: JSON / JWT / Cron tools',
  'faq-expand': 'topic=JSON formatter tool',
  'keyword-group': 'json formatter\njson formatter\njson validator\nyaml to json',
  'title-batch': 'JSON Formatter Tool\nWebhook HMAC Generator\nCron Expression Explainer',
  'canonical-check': '<link rel="canonical" href="https://tool00001.aihh.ai/">\n<link rel="canonical" href="https://wrong.example.com/">',
  'anchor-text': 'https://aihh.ai/|Tool directory\nhttps://tool00001.aihh.ai/|JSON tool',
  'redirect-chain': 'https://old.example.com/page\nhttps://new.example.com/page',
  'utm-batch': 'url=https://example.com/a\nsource=google\nmedium=cpc\ncampaign=spring\n---\nurl=https://example.com/b\nsource=newsletter\nmedium=email\ncampaign=may',
  'ads-title': 'Free JSON Formatter Online Tool\nBuy JSON Pro Converter Now',
  'csv-to-md': 'name,score\nAnn,90\nBob,88',
  'md-table-align': '| name | score |\n| Ann | 90 |\n| Bob | 88 |',
  'random-sample': 'Ann\nBob\nCara\nDave\nEvan\nn=2',
  'action-items': 'Decision: Alex owns API integration. Sam delivers test report by Friday.\nTODO: Update sitemap',
  'todo-split': 'goal=Ship 100 tool pages and submit Search Console',
  'pomodoro-plan': 'Polish directory\nRun tool QA\nWrite deploy docs',
  'flashcard': 'Q: Is data uploaded?\nA: No. Runs locally in the browser.\nQ: Is it free?\nA: Yes.',
  'title-case-en': 'free online json formatter for developers',
  'resume-match': 'resume: Vue React Node SEO tool sites\njd: Needs frontend engineering, SEO, indie shipping',
  'star-interview': 'situation=Production outage\ntask=Restore service\naction=Rolled back and added monitoring\nresult=Recovered in 30 minutes',
  'bank-card': '6222021234567890123\n6222020000000000004',
  'id-card': '110101199001011234\n123456789012345',
  'email-clean': 'Contact zhang@example.com and invalid@@test and bob@test.org',
  'cookie-banner': 'site=AIHH.ai\nlocale=en',
  'robots-sitemap-check': 'robots:\nUser-agent: *\nAllow: /\nSitemap: https://example.com/sitemap.xml\n---\nhttps://example.com/\nhttps://example.com/about',
  'localbusiness-schema': 'name=AIHH Studio\naddress=123 Example St, San Francisco\nphone=+1-555-0100\nurl=https://aihh.ai/',
  'selling-points': 'Runs in browser\nCategory navigation\n100 useful tools',
  'sku-naming': 'sku-001 red\nSKU_002 BLUE\nsku 003 green',
  'order-id': 'prefix=ORD\ncount=5',
  'percent-change': 'old=100\nnew=128',
  'ab-sample': 'baseline=0.05\nlift=0.2\npower=0.8\nalpha=0.05',
  'funnel-calc': 'visit=10000\nsignup=1200\npay=180',
  'nps-calc': 'promoters=62\npassives=20\ndetractors=18',
  'shuffle-options': 'Option A\nOption B\nOption C\nOption D',
  initials: 'Zhang San\nLi Si\nMary Jane Watson',
  'domain-clean': 'Visit https://WWW.Example.com/path and http://tool00001.aihh.ai/ and junk',
  'log-status': '2026-05-13 GET /api 200\n2026-05-13 POST /api 500\n2026-05-13 GET /x 404',
  'json-to-csv': '[{"name":"Ann","score":90},{"name":"Bob","score":88}]',
  'csv-to-json': 'name,score\nAnn,90\nBob,88',
  hreflang: 'zh=https://aihh.ai/\nen=https://aihh.ai/en/\nja=https://aihh.ai/ja/',
  'meta-extract': '<title>Demo</title><meta name="description" content="desc"><meta property="og:title" content="OG">',
  'alt-check': '<img src="a.png"><img src="b.png" alt="ok">'
};

function setStatus(message, bad = false) {
  statusEl.textContent = message;
  statusEl.className = bad ? 'status bad' : 'status';
}

function lines(text) {
  return String(text || '').split(/\r?\n/).map((line) => line.trim()).filter(Boolean);
}

function parseKeyValues(text) {
  const data = {};
  lines(text).forEach((line) => {
    const idx = line.indexOf('=');
    if (idx > -1) data[line.slice(0, idx).trim().toLowerCase()] = line.slice(idx + 1).trim();
  });
  return data;
}

function stableSortObject(value) {
  if (Array.isArray(value)) return value.map(stableSortObject);
  if (value && typeof value === 'object') {
    return Object.keys(value).sort().reduce((acc, key) => {
      acc[key] = stableSortObject(value[key]);
      return acc;
    }, {});
  }
  return value;
}

function base64UrlDecode(part) {
  const normalized = part.replace(/-/g, '+').replace(/_/g, '/').padEnd(Math.ceil(part.length / 4) * 4, '=');
  return decodeURIComponent(Array.from(atob(normalized)).map((c) => '%' + c.charCodeAt(0).toString(16).padStart(2, '0')).join(''));
}

async function sha(text, algorithm) {
  const bytes = new TextEncoder().encode(text);
  const hash = await crypto.subtle.digest(algorithm, bytes);
  return Array.from(new Uint8Array(hash)).map((b) => b.toString(16).padStart(2, '0')).join('');
}

async function hmac(text) {
  const kv = parseKeyValues(text);
  const secret = kv.secret || 'demo-secret';
  const message = kv.message || text;
  const key = await crypto.subtle.importKey('raw', new TextEncoder().encode(secret), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);
  const sig = await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(message));
  const hex = Array.from(new Uint8Array(sig)).map((b) => b.toString(16).padStart(2, '0')).join('');
  return 'HMAC-SHA256\nsecret: ' + secret + '\nmessage: ' + message + '\nhex: ' + hex;
}

function csvRows(text) {
  return lines(text).map((line) => line.split(',').map((cell) => cell.trim()));
}

function toYaml(value, indent = 0) {
  if (Array.isArray(value)) return value.map((item) => ' '.repeat(indent) + '- ' + (typeof item === 'object' ? '\n' + toYaml(item, indent + 2) : String(item))).join('\n');
  if (value && typeof value === 'object') return Object.entries(value).map(([k, v]) => ' '.repeat(indent) + k + ': ' + (typeof v === 'object' ? '\n' + toYaml(v, indent + 2) : String(v))).join('\n');
  return String(value);
}

function inferSchema(value) {
  if (Array.isArray(value)) return { type: 'array', items: value.length ? inferSchema(value[0]) : {} };
  if (value && typeof value === 'object') {
    const properties = {};
    Object.entries(value).forEach(([key, val]) => { properties[key] = inferSchema(val); });
    return { type: 'object', required: Object.keys(value), properties };
  }
  return { type: value === null ? 'null' : typeof value };
}

function enumeratePaths(value, prefix = '$') {
  const out = [];
  if (value && typeof value === 'object') {
    Object.entries(value).forEach(([key, val]) => {
      const next = Array.isArray(value) ? prefix + '[' + key + ']' : prefix + '.' + key;
      out.push(next + ' = ' + (typeof val === 'object' ? Array.isArray(val) ? '[array]' : '{object}' : JSON.stringify(val)));
      out.push(...enumeratePaths(val, next));
    });
  }
  return out;
}

function cronExplain(expr) {
  const p = expr.trim().split(/\s+/);
  if (p.length !== 5) return 'Enter a 5-field cron expression, e.g. */15 9-18 * * 1-5';
  const names = ['Minute', 'Hour', 'Day of month', 'Month', 'Day of week'];
  return p.map((v, i) => names[i] + ': ' + v).join('\n') + '\n\nTip: * = every value, */n = every n units, a-b = range.';
}

function uuidv4() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = crypto.getRandomValues(new Uint8Array(1))[0] & 15;
    return (c === 'x' ? r : (r & 3) | 8).toString(16);
  });
}

function runSync(kind, text) {
  if (kind === 'json-format') {
    const obj = JSON.parse(text);
    return 'Formatted:\n' + JSON.stringify(obj, null, 2) + '\n\nMinified:\n' + JSON.stringify(obj) + '\n\nSorted keys:\n' + JSON.stringify(stableSortObject(obj), null, 2);
  }
  if (kind === 'timestamp') {
    return lines(text).map((item) => {
      const n = Number(item);
      const date = Number.isFinite(n) ? new Date(String(Math.trunc(n)).length <= 10 ? n * 1000 : n) : new Date(item);
      return item + ' -> ' + (Number.isNaN(date.getTime()) ? 'Unrecognized' : date.toLocaleString() + ' / ' + date.toISOString());
    }).join('\n');
  }
  if (kind === 'header-audit') {
    const lower = text.toLowerCase();
    const checks = [['strict-transport-security', 'HSTS'], ['content-security-policy', 'CSP'], ['x-content-type-options', 'X-Content-Type-Options'], ['referrer-policy', 'Referrer-Policy'], ['access-control-allow-origin: *', 'CORS wildcard risk']];
    return checks.map(([needle, label]) => (lower.includes(needle) ? '✅ ' : '⚠️ ') + label + (lower.includes(needle) ? ' present' : ' review recommended')).join('\n');
  }
  if (kind === 'jwt') {
    const parts = text.trim().split('.');
    if (parts.length < 2) return 'JWT must include at least header.payload';
    const header = JSON.parse(base64UrlDecode(parts[0]));
    const payload = JSON.parse(base64UrlDecode(parts[1]));
    const timeInfo = ['exp', 'iat', 'nbf'].filter((k) => payload[k]).map((k) => k + ': ' + new Date(payload[k] * 1000).toLocaleString()).join('\n');
    return 'Header:\n' + JSON.stringify(header, null, 2) + '\n\nPayload:\n' + JSON.stringify(payload, null, 2) + '\n\nTime fields:\n' + (timeInfo || 'No exp/iat/nbf found');
  }
  if (kind === 'url-diff') {
    const [a, b] = lines(text);
    const ua = new URL(a); const ub = new URL(b);
    const keys = new Set([...ua.searchParams.keys(), ...ub.searchParams.keys()]);
    return Array.from(keys).sort().map((k) => k + ': ' + (ua.searchParams.get(k) || '(missing)') + ' => ' + (ub.searchParams.get(k) || '(missing)')).join('\n');
  }
  if (kind === 'regex-extract') {
    const m = text.match(/^regex:\s*(.+)$/im);
    const pattern = m ? m[1] : '[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,}';
    const re = new RegExp(pattern, 'gim');
    return Array.from(new Set(text.match(re) || [])).join('\n') || 'No matches';
  }
  if (kind === 'json-schema') return JSON.stringify(inferSchema(JSON.parse(text)), null, 2);
  if (kind === 'yaml-json') {
    try { return toYaml(JSON.parse(text)); } catch { return JSON.stringify(Object.fromEntries(lines(text).map((line) => line.split(':').map((x) => x.trim())).filter((p) => p.length >= 2)), null, 2); }
  }
  if (kind === 'base64-image') return 'Length: ' + text.length + '\nMIME: ' + ((text.match(/^data:([^;]+)/) || [])[1] || 'unknown') + '\nEstimated size: ' + Math.round(text.replace(/^data:[^,]+,/, '').length * 0.75) + ' bytes';
  if (kind === 'encoding') {
    let urlDecoded = '';
    try { urlDecoded = decodeURIComponent(text.replace(/%u/g, '%u')); } catch { urlDecoded = '(URL decode failed — check encoding)'; }
    return 'URL decode:\n' + urlDecoded + '\n\nUnicode decode:\n' + text.replace(/\\u([0-9a-fA-F]{4})/g, (_, h) => String.fromCharCode(parseInt(h, 16)));
  }
  if (kind === 'csv-tools') {
    const rows = csvRows(text); const header = rows[0] || [];
    return 'Columns: ' + header.join(' | ') + '\nData rows: ' + Math.max(0, rows.length - 1) + '\n\nDeduped lines:\n' + Array.from(new Set(lines(text))).join('\n');
  }
  if (kind === 'redactor') return text.replace(/(\d{3})\d{4}(\d{4})/g, '$1****$2').replace(/[a-z0-9._%+-]+@([a-z0-9.-]+\.[a-z]{2,})/gi, '***@$1').replace(/\d{6}(19|20)\d{2}\d{4}\d{4}/g, '****** ******** ****').replace(/\b\d{12,19}\b/g, (m) => m.slice(0, 4) + ' **** **** ' + m.slice(-4));
  if (kind === 'jsonpath') return enumeratePaths(JSON.parse(text)).join('\n');
  if (kind === 'diff') {
    const [left, right] = text.split(/\n---\n/); const a = lines(left); const b = lines(right);
    const setA = new Set(a); const setB = new Set(b);
    return 'Left only:\n' + a.filter((x) => !setB.has(x)).join('\n') + '\n\nRight only:\n' + b.filter((x) => !setA.has(x)).join('\n');
  }
  if (kind === 'cron') return cronExplain(text);
  if (kind === 'uuid') return Array.from({ length: Math.min(200, Math.max(1, Number(text.trim()) || 10)) }, uuidv4).join('\n');
  if (kind === 'sql-in') {
    const vals = Array.from(new Set(lines(text)));
    return 'IN (' + vals.map((v) => /^-?\d+(\.\d+)?$/.test(v) ? v : "'" + v.replace(/'/g, "''") + "'").join(', ') + ')';
  }
  if (kind === 'phone-check') return lines(text).map((n) => n + ' -> ' + (/^1[3-9]\d{9}$/.test(n) ? 'valid format' : 'invalid format')).join('\n');
  if (kind === 'status-search') {
    const map = { 200: 'OK', 301: 'Moved Permanently', 302: 'Found', 400: 'Bad Request', 401: 'Unauthorized', 403: 'Forbidden', 404: 'Not Found', 409: 'Conflict', 422: 'Unprocessable Entity', 429: 'Too Many Requests', 500: 'Internal Server Error', 502: 'Bad Gateway', 503: 'Service Unavailable' };
    return lines(text).map((n) => n + ' -> ' + (map[n] || 'See RFC 9110 for details')).join('\n');
  }
  if (kind === 'meta-counter') {
    const [title = '', desc = ''] = text.split(/\r?\n/);
    return 'Title length: ' + title.length + ' (suggested 20–60)\nDescription length: ' + desc.length + ' (suggested 70–160)';
  }
  if (kind === 'serp-preview') {
    const [title = '', url = '', desc = ''] = text.split(/\r?\n/);
    return title + '\n' + url + '\n' + desc + '\n\nTip: put primary keywords in the title; describe input, output, and use case in the description.';
  }
  if (kind === 'utm') {
    const kv = parseKeyValues(text); const url = new URL(kv.url || 'https://example.com/');
    [['utm_source', kv.source], ['utm_medium', kv.medium], ['utm_campaign', kv.campaign], ['utm_content', kv.content], ['utm_term', kv.term]].forEach(([k, v]) => { if (v) url.searchParams.set(k, v); });
    return url.toString();
  }
  if (kind === 'intent') return lines(text).map((k) => k + ' -> ' + (/buy|price|download/i.test(k) ? 'Transactional' : /login|official|aihh/i.test(k) ? 'Navigational' : /best|how|tutorial|what is/i.test(k) ? 'Informational' : 'Tool / mixed')).join('\n');
  if (kind === 'htags') {
    const tags = Array.from(text.matchAll(/<(h[1-6]|meta|img)\b[^>]*>/gi)).map((m) => m[0]);
    return tags.join('\n') + '\n\nH1 count: ' + (text.match(/<h1\b/gi) || []).length + '\nImages missing alt: ' + (text.match(/<img(?![^>]*alt=)/gi) || []).length;
  }
  if (kind === 'robots') {
    const kv = parseKeyValues(text); const dis = lines(text).filter((l) => l.toLowerCase().startsWith('disallow=')).map((l) => l.split('=').slice(1).join('='));
    return 'User-agent: *\n' + dis.map((d) => 'Disallow: ' + d).join('\n') + '\nAllow: /\nSitemap: ' + (kv.sitemap || 'https://example.com/sitemap.xml');
  }
  if (kind === 'sitemap') return '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' + lines(text).map((u) => '  <url><loc>' + u + '</loc><lastmod>' + new Date().toISOString().slice(0, 10) + '</lastmod></url>').join('\n') + '\n</urlset>';
  if (kind === 'og-tags') {
    const kv = parseKeyValues(text); return '<meta property="og:title" content="' + (kv.title || '') + '">\n<meta property="og:description" content="' + (kv.description || '') + '">\n<meta property="og:url" content="' + (kv.url || '') + '">\n<meta property="og:image" content="' + (kv.image || '') + '">';
  }
  if (kind === 'faq-schema') {
    const pairs = text.split(/\n(?=Q:)/).map((block) => { const q = (block.match(/Q:\s*(.+)/) || [,''])[1]; const a = (block.match(/A:\s*(.+)/) || [,''])[1]; return q && a ? { '@type': 'Question', name: q, acceptedAnswer: { '@type': 'Answer', text: a } } : null; }).filter(Boolean);
    return JSON.stringify({ '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: pairs }, null, 2);
  }
  if (kind === 'slug') return lines(text).map((s) => s.toLowerCase().replace(/[^a-z0-9\u4e00-\u9fa5]+/g, '-').replace(/^-+|-+$/g, '')).join('\n');
  if (kind === 'markdown') return 'Table of contents:\n' + lines(text).filter((l) => /^#{1,6}\s/.test(l)).map((l) => l.replace(/^(#+)\s+/, (_, h) => '  '.repeat(h.length - 1) + '- ')).join('\n') + '\n\nPlain text preview:\n' + text.replace(/[#*_\x60>\-]/g, '');
  if (kind === 'word-counter') return 'Characters: ' + text.length + '\nCJK characters: ' + (text.match(/[\u4e00-\u9fa5]/g) || []).length + '\nEnglish words: ' + (text.match(/[a-zA-Z]+/g) || []).length + '\nEstimated reading time: ' + Math.max(1, Math.ceil(text.length / 500)) + ' min';
  if (kind === 'case-convert') {
    const words = text.trim().replace(/([a-z])([A-Z])/g, '$1 $2').split(/[^a-zA-Z0-9\u4e00-\u9fa5]+/).filter(Boolean);
    const cap = (w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase();
    return 'camelCase: ' + words.map((w, i) => i ? cap(w) : w.toLowerCase()).join('') + '\nsnake_case: ' + words.map((w) => w.toLowerCase()).join('_') + '\nkebab-case: ' + words.map((w) => w.toLowerCase()).join('-') + '\nPascalCase: ' + words.map(cap).join('');
  }
  if (kind === 'hash') {
    const crypto = require('crypto');
    const buf = Buffer.from(String(text || '').trim());
    return ['sha1', 'sha256', 'sha384', 'sha512'].map((alg) => alg.toUpperCase().replace('SHA', 'SHA-') + ': ' + crypto.createHash(alg).update(buf).digest('hex')).join('\n');
  }
  if (kind === 'duplicate-lines') return Array.from(new Set(lines(text))).join('\n');
  if (kind === 'sort-lines') return lines(text).sort((a, b) => a.localeCompare(b, 'en', { sensitivity: 'base' })).join('\n');
  if (kind === 'password') {
    const kv = parseKeyValues(text); const len = Math.min(128, Math.max(8, Number(kv.length) || 18));
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789!@#$%^&*';
    return Array.from({ length: len }, () => chars[crypto.getRandomValues(new Uint32Array(1))[0] % chars.length]).join('');
  }
  if (kind === 'invoice-vat') {
    const kv = parseKeyValues(text); const amount = Number(kv.amount || lines(text)[0] || 0); const rate = Number(kv.rate || 13) / 100;
    const net = amount / (1 + rate); return 'Gross amount: ' + amount.toFixed(2) + '\nTax rate: ' + (rate * 100).toFixed(2) + '%\nNet amount: ' + net.toFixed(2) + '\nTax amount: ' + (amount - net).toFixed(2);
  }
  if (kind === 'privacy-copy') {
    const kv = parseKeyValues(text); const site = kv.site || config.name || 'This site';
    return site + ' — Usage\n\nThis tool helps with ' + (config.keywords || []).join(', ') + ' scenarios. Input is processed locally in your browser and is not uploaded. Avoid highly sensitive data on shared computers.\n\nContact: ' + (kv.email || 'hello@aihh.ai');
  }
  if (kind === 'nginx-config') {
    const kv = parseKeyValues(text);
    return 'server {\n  listen 80;\n  server_name ' + (kv.server_name || 'example.com') + ';\n  gzip ' + (kv.gzip || 'on') + ';\n  location / {\n    proxy_pass ' + (kv.proxy_pass || 'http://127.0.0.1:3000') + ';\n    proxy_set_header Host $host;\n    proxy_set_header X-Real-IP $remote_addr;\n  }\n}';
  }
  if (kind === 'docker-run') {
    const kv = parseKeyValues(text);
    const ports = (kv.ports || '8080:80').split(',').map((p) => '-p ' + p.trim()).join(' ');
    const vol = kv.volume ? '-v ' + kv.volume : '';
    return 'docker run -d --name ' + (kv.name || 'app') + ' ' + ports + ' ' + vol + ' ' + (kv.image || 'nginx:alpine');
  }
  if (kind === 'k8s-yaml') {
    const kv = parseKeyValues(text);
    const name = kv.name || 'app'; const port = Number(kv.port || 80); const replicas = Number(kv.replicas || 1);
    return 'apiVersion: apps/v1\nkind: Deployment\nmetadata:\n  name: ' + name + '\nspec:\n  replicas: ' + replicas + '\n  selector:\n    matchLabels:\n      app: ' + name + '\n  template:\n    metadata:\n      labels:\n        app: ' + name + '\n    spec:\n      containers:\n        - name: ' + name + '\n          image: ' + (kv.image || 'nginx:alpine') + '\n          ports:\n            - containerPort: ' + port + '\n---\napiVersion: v1\nkind: Service\nmetadata:\n  name: ' + name + '-svc\nspec:\n  selector:\n    app: ' + name + '\n  ports:\n    - port: ' + port + '\n      targetPort: ' + port;
  }
  if (kind === 'curl-fetch') {
    const raw = text.trim();
    const method = (raw.match(/-X\s+(\w+)/i) || [, 'GET'])[1];
    const url = (raw.match(/curl\s+(?:-X\s+\w+\s+)?['"]?([^'"\s]+)/i) || [, 'https://example.com'])[1];
    const headers = Array.from(raw.matchAll(/-H\s+['"]([^'"]+)['"]/gi)).map((m) => m[1]);
    const body = (raw.match(/-d\s+['"]([^'"]*)['"]/i) || raw.match(/-d\s+(\{[\s\S]*\})/i) || [, ''])[1];
    let out = "const res = await fetch('" + url + "', {\n  method: '" + method + "'";
    if (headers.length) out += ',\n  headers: {\n' + headers.map((h) => { const i = h.indexOf(':'); return "    '" + h.slice(0, i).trim() + "': '" + h.slice(i + 1).trim() + "'"; }).join(',\n') + '\n  }';
    if (body) out += ',\n  body: ' + (body.startsWith('{') ? body : JSON.stringify(body));
    return out + '\n});\nconst data = await res.json();';
  }
  if (kind === 'json-to-ts') {
    const walk = (v, key) => {
      if (Array.isArray(v)) return (key || 'Items') + '[]';
      if (v && typeof v === 'object') {
        const body = Object.entries(v).map(([k, val]) => '  ' + k + ': ' + walk(val, k) + ';').join('\n');
        return '{\n' + body + '\n}';
      }
      const t = v === null ? 'null' : typeof v;
      return t === 'number' ? 'number' : t === 'boolean' ? 'boolean' : 'string';
    };
    const obj = JSON.parse(text);
    return 'export interface Root ' + walk(obj, 'Root');
  }
  if (kind === 'env-sort') {
    const seen = new Set();
    return lines(text).filter((line) => {
      if (!line || line.startsWith('#')) return true;
      if (seen.has(line)) return false;
      seen.add(line);
      return true;
    }).sort((a, b) => {
      if (a.startsWith('#')) return -1;
      if (b.startsWith('#')) return 1;
      return a.localeCompare(b);
    }).join('\n');
  }
  if (kind === 'port-cmd') {
    const kv = parseKeyValues(text); const port = kv.port || '3000';
    return (kv.os === 'win'
      ? 'netstat -ano | findstr :' + port + '\ntaskkill /PID <pid> /F'
      : 'lsof -i :' + port + '\nkill -9 <pid>');
  }
  if (kind === 'url-batch') return lines(text).map((line) => line + ' -> ' + encodeURIComponent(line)).join('\n');
  if (kind === 'ip-cidr') {
    const [ip, bits] = text.trim().split('/');
    const mask = Number(bits || 24);
    const parts = ip.split('.').map(Number);
    const num = parts.reduce((a, b) => (a << 8) + b, 0);
    const host = 32 - mask;
    const size = 2 ** host;
    return 'Network: ' + ip + '/' + mask + '\nApprox. usable hosts: ' + Math.max(0, size - 2) + '\nMask (approx.): ' + [255, 255, 255, 256 - 2 ** (8 - (mask % 8 || 8))].slice(0, 4).join('.');
  }
  if (kind === 'color-convert') {
    const hex = (text.match(/#([0-9a-f]{3,8})/i) || [])[0];
    const rgb = text.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/i);
    let r, g, b;
    if (hex) {
      const h = hex.replace('#', '');
      const full = h.length === 3 ? h.split('').map((c) => c + c).join('') : h.slice(0, 6);
      r = parseInt(full.slice(0, 2), 16); g = parseInt(full.slice(2, 4), 16); b = parseInt(full.slice(4, 6), 16);
    } else if (rgb) { r = +rgb[1]; g = +rgb[2]; b = +rgb[3]; } else throw new Error('Enter #hex or rgb(r,g,b)');
    const rn = r / 255; const gn = g / 255; const bn = b / 255;
    const max = Math.max(rn, gn, bn); const min = Math.min(rn, gn, bn);
    const l = (max + min) / 2;
    let h = 0; let s = 0;
    if (max !== min) {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      if (max === rn) h = ((gn - bn) / d + (gn < bn ? 6 : 0)) / 6;
      else if (max === gn) h = ((bn - rn) / d + 2) / 6;
      else h = ((rn - gn) / d + 4) / 6;
    }
    return 'HEX: #' + [r, g, b].map((x) => x.toString(16).padStart(2, '0')).join('') + '\nRGB: rgb(' + r + ', ' + g + ', ' + b + ')\nHSL: hsl(' + Math.round(h * 360) + ', ' + Math.round(s * 100) + '%, ' + Math.round(l * 100) + '%)';
  }
  if (kind === 'css-clamp') {
    const kv = parseKeyValues(text);
    const min = kv.min || '16'; const max = kv.max || '32'; const vw = kv.viewport || '1200';
    const slope = ((Number(max) - Number(min)) / Number(vw) * 100).toFixed(4);
    return 'font-size: clamp(' + min + 'px, calc(' + min + 'px + ' + slope + 'vw), ' + max + 'px);';
  }
  if (kind === 'css-grid') {
    const kv = parseKeyValues(text);
    return '.grid {\n  display: grid;\n  grid-template-columns: repeat(' + (kv.cols || '3') + ', minmax(0, 1fr));\n  grid-template-rows: repeat(' + (kv.rows || '2') + ', auto);\n  gap: ' + (kv.gap || '16px') + ';\n}';
  }
  if (kind === 'flexbox') {
    const kv = parseKeyValues(text);
    return '.flex {\n  display: flex;\n  flex-direction: ' + (kv.direction || 'row') + ';\n  flex-wrap: ' + (kv.wrap || 'wrap') + ';\n  justify-content: ' + (kv.justify || 'center') + ';\n  align-items: ' + (kv.align || 'center') + ';\n}';
  }
  if (kind === 'tailwind-sort') return text.split(/\s+/).filter(Boolean).sort().join(' ');
  if (kind === 'aspect-ratio') {
    const kv = parseKeyValues(text);
    const w = Number(kv.width || 16); const h = Number(kv.height || 9);
    const g = (a, b) => (b ? g(b, a % b) : a);
    const d = g(w, h);
    return 'Dimensions: ' + w + ' x ' + h + '\nReduced ratio: ' + (w / d) + ':' + (h / d) + '\nDecimal ratio: ' + (w / h).toFixed(4);
  }
  if (kind === 'svg-viewbox') {
    const vb = (text.match(/viewBox=["']([^"']+)["']/i) || [, ''])[1];
    const parts = vb.split(/\s+/).map(Number);
    if (parts.length !== 4) return 'No valid viewBox found';
    return 'viewBox: ' + vb + '\nLogical width: ' + parts[2] + '\nLogical height: ' + parts[3] + '\nAspect ratio: ' + (parts[2] / parts[3]).toFixed(4);
  }
  if (kind === 'title-ab-score') {
    return lines(text).map((t) => {
      let score = 50;
      if (t.length >= 20 && t.length <= 60) score += 15;
      if (/free|online|tool|json|seo/i.test(t)) score += 10;
      if (t.length > 70) score -= 20;
      return t + ' -> score ' + score + '/100';
    }).join('\n');
  }
  if (kind === 'xhs-note') {
    const kv = parseKeyValues(text);
    return 'Title: ' + (kv.product || 'Product') + ' — real experience\n\nHook: state the pain in 3 seconds\nBody:\n1. Use case\n2. Key benefit (' + (kv.highlight || 'faster workflow') + ')\n3. Caveats\nClose: fits ' + (kv.audience || 'your audience') + ' — save for later';
  }
  if (kind === 'video-script') {
    const kv = parseKeyValues(text);
    return '| # | Visual | Script |\n| 1 | Problem | Still looking for ' + (kv.topic || 'a solution') + '? |\n| 2 | Screen | Open the tool and paste input |\n| 3 | Result | Run once and copy output |\n| 4 | CTA | Bookmark for next time |';
  }
  if (kind === 'email-subject') {
    return lines(text).map((s) => s + ' -> length ' + s.length + (s.length > 50 ? ' ⚠️ long' : ' ✅ OK')).join('\n');
  }
  if (kind === 'faq-expand') {
    const topic = parseKeyValues(text).topic || text.trim() || 'this tool';
    return 'Q: ' + topic + ' free?\nA: Yes, no signup.\n\nQ: Is data uploaded?\nA: No. Runs locally in your browser.\n\nQ: What input formats work?\nA: Paste plain text; use Load sample for format hints.\n\nQ: Wrong output?\nA: Check input format and compare with the sample.';
  }
  if (kind === 'keyword-group') {
    const groups = new Map();
    lines(text).forEach((k) => {
      const key = k.toLowerCase().replace(/\s+/g, ' ').trim();
      if (!groups.has(key)) groups.set(key, []);
      groups.get(key).push(k);
    });
    return Array.from(groups.entries()).map(([k, arr]) => '[' + k + '] x' + arr.length + '\n' + arr.join('\n')).join('\n\n');
  }
  if (kind === 'title-batch') return lines(text).map((t, i) => '#' + (i + 1) + ' ' + t + ' | length ' + t.length + (t.length > 60 ? ' ⚠️' : '')).join('\n');
  if (kind === 'canonical-check') {
    const links = Array.from(text.matchAll(/<link[^>]+rel=["']canonical["'][^>]+href=["']([^"']+)["']/gi)).map((m) => m[1]);
    return (links.length ? links.map((u, i) => (i + 1) + '. ' + u).join('\n') : 'No canonical found') + '\n\nCount: ' + links.length + (links.length > 1 ? ' ⚠️ multiple canonicals may conflict' : ' ✅');
  }
  if (kind === 'anchor-text') {
    return lines(text).map((line) => {
      const [url, anchor] = line.split('|').map((x) => x.trim());
      return (anchor || '(no anchor text)') + ' -> ' + (url || line);
    }).join('\n');
  }
  if (kind === 'redirect-chain') {
    const chain = lines(text);
    return chain.map((u, i) => (i + 1) + '. ' + u + (i < chain.length - 1 ? ' -> 301/302?' : '')).join('\n') + '\n\nRedirect hops: ' + Math.max(0, chain.length - 1);
  }
  if (kind === 'utm-batch') {
    return text.split(/\n---\n/).map((block) => runSync('utm', block.trim())).join('\n\n');
  }
  if (kind === 'ads-title') {
    return lines(text).map((t) => t + ' -> ' + t.length + '/30 chars' + (t.length > 30 ? ' ⚠️ too long' : ' ✅')).join('\n');
  }
  if (kind === 'csv-to-md') {
    const rows = csvRows(text);
    if (!rows.length) return '';
    const header = '| ' + rows[0].join(' | ') + ' |\n| ' + rows[0].map(() => '---').join(' | ') + ' |';
    const body = rows.slice(1).map((r) => '| ' + r.join(' | ') + ' |').join('\n');
    return header + '\n' + body;
  }
  if (kind === 'md-table-align') {
    const rows = lines(text).filter((l) => l.includes('|')).map((l) => l.split('|').map((c) => c.trim()).filter(Boolean));
    if (!rows.length) return text;
    const widths = rows[0].map((_, i) => Math.max(...rows.map((r) => (r[i] || '').length)));
    return rows.map((r) => '| ' + r.map((c, i) => (c || '').padEnd(widths[i])).join(' | ') + ' |').join('\n');
  }
  if (kind === 'random-sample') {
    const all = lines(text);
    const nLine = all.find((l) => /^n=\d+$/i.test(l));
    const n = nLine ? Number(nLine.split('=')[1]) : 3;
    const pool = all.filter((l) => !/^n=\d+$/i.test(l));
    const picked = [];
    const copy = [...pool];
    while (picked.length < Math.min(n, copy.length)) {
      const idx = crypto.getRandomValues(new Uint32Array(1))[0] % copy.length;
      picked.push(copy.splice(idx, 1)[0]);
    }
    return picked.join('\n');
  }
  if (kind === 'action-items') {
    const re = /(?:TODO|action item|assigned to|follow-up)[:：]?\s*(.+)$/gim;
    const found = Array.from(text.matchAll(re)).map((m) => m[1].trim());
    const names = Array.from(text.matchAll(/([A-Za-z]{2,20})\s+owns/gi)).map((m) => m[1] + ' — related action item');
    return [...found, ...names].filter(Boolean).join('\n') || 'No action items found. Try TODO:, assigned to, or action item.';
  }
  if (kind === 'todo-split') {
    const goal = parseKeyValues(text).goal || text.trim();
    return 'Goal: ' + goal + '\n\n1. Define input/output\n2. Implement core feature\n3. Test with sample data\n4. Add SEO (title/description/FAQ)\n5. Deploy and link from directory';
  }
  if (kind === 'pomodoro-plan') {
    return lines(text).map((task, i) => {
      const start = 9 * 60 + i * 30;
      const h = String(Math.floor(start / 60)).padStart(2, '0');
      const m = String(start % 60).padStart(2, '0');
      return h + ':' + m + ' - ' + task + ' (Pomodoro 25 min + 5 min break)';
    }).join('\n');
  }
  if (kind === 'flashcard') {
    return text.split(/\n(?=Q:)/).map((block) => {
      const q = (block.match(/Q:\s*(.+)/) || [, ''])[1];
      const a = (block.match(/A:\s*(.+)/) || [, ''])[1];
      return q && a ? 'Card\nQ: ' + q + '\nA: ' + a : '';
    }).filter(Boolean).join('\n\n');
  }
  if (kind === 'title-case-en') {
    const small = new Set(['a', 'an', 'the', 'and', 'or', 'for', 'to', 'of', 'in', 'on', 'at', 'by']);
    return text.split(/\s+/).map((w, i) => {
      const lower = w.toLowerCase();
      if (i && small.has(lower)) return lower;
      return lower.charAt(0).toUpperCase() + lower.slice(1);
    }).join(' ');
  }
  if (kind === 'resume-match') {
    const [resume = '', jd = ''] = text.split(/\njd[:：]/i);
    const words = jd.toLowerCase().split(/[^a-z0-9\u4e00-\u9fa5+#]+/).filter((w) => w.length > 1);
    const hits = words.filter((w) => resume.toLowerCase().includes(w));
    const uniq = Array.from(new Set(hits));
    return 'JD keywords: ' + words.length + '\nMatched: ' + uniq.length + '\nMatch rate (approx.): ' + (words.length ? Math.round((uniq.length / words.length) * 100) : 0) + '%\n\nMatched terms:\n' + uniq.join('\n');
  }
  if (kind === 'star-interview') {
    const kv = parseKeyValues(text);
    return 'S (Situation): ' + (kv.situation || '...') + '\nT (Task): ' + (kv.task || '...') + '\nA (Action): ' + (kv.action || '...') + '\nR (Result): ' + (kv.result || '...');
  }
  if (kind === 'bank-card') {
    const luhn = (num) => {
      let sum = 0; let alt = false;
      for (let i = num.length - 1; i >= 0; i -= 1) {
        let n = Number(num[i]);
        if (alt) { n *= 2; if (n > 9) n -= 9; }
        sum += n; alt = !alt;
      }
      return sum % 10 === 0;
    };
    return lines(text).map((n) => {
      const digits = n.replace(/\D/g, '');
      const ok = digits.length >= 13 && luhn(digits);
      const masked = digits.slice(0, 4) + ' **** **** ' + digits.slice(-4);
      return n + ' -> ' + masked + ' | Luhn: ' + (ok ? 'pass' : 'fail');
    }).join('\n');
  }
  if (kind === 'id-card') {
    return lines(text).map((id) => {
      const digits = id.replace(/\D/g, '');
      const masked = digits.slice(0, 6) + '********' + digits.slice(-4);
      const ok = /^\d{17}[\dXx]$/.test(digits);
      return id + ' -> ' + masked + ' | format: ' + (ok ? '18-digit' : 'invalid');
    }).join('\n');
  }
  if (kind === 'email-clean') {
    const emails = Array.from(new Set(text.match(/[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}/gi) || []));
    const valid = emails.filter((e) => !e.includes('@@'));
    const invalid = (text.match(/[^\s@]+@[^\s@]+/g) || []).filter((e) => !valid.includes(e));
    return 'Valid emails:\n' + valid.join('\n') + '\n\nPossibly invalid:\n' + (invalid.join('\n') || '(none)');
  }
  if (kind === 'cookie-banner') {
    const kv = parseKeyValues(text);
    const site = kv.site || config.name || 'This site';
    return site + ' uses cookies to improve your experience. Essential cookies are enabled by default; analytics cookies are optional. This tool processes input locally and does not upload it.';
  }
  if (kind === 'robots-sitemap-check') {
    const [robotsPart, ...rest] = text.split('---');
    const sitemapInRobots = (robotsPart.match(/sitemap:\s*(.+)/i) || robotsPart.match(/Sitemap:\s*(.+)/i) || [, ''])[1].trim();
    const urls = lines(rest.join('---'));
    return 'Sitemap in robots: ' + (sitemapInRobots || 'not declared') + '\nURL list count: ' + urls.length + '\nTip: URLs in the sitemap should be allowed by robots rules';
  }
  if (kind === 'localbusiness-schema') {
    const kv = parseKeyValues(text);
    return JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'LocalBusiness',
      name: kv.name,
      url: kv.url,
      telephone: kv.phone,
      address: { '@type': 'PostalAddress', streetAddress: kv.address }
    }, null, 2);
  }
  if (kind === 'selling-points') {
    return lines(text).map((line, i) => '| Point ' + (i + 1) + ' | User benefit | Proof |\n| ' + line + ' | Solves a clear pain | Use on landing H2 |').join('\n\n');
  }
  if (kind === 'sku-naming') {
    return lines(text).map((line) => {
      const code = line.replace(/\s+/g, '-').replace(/[^a-zA-Z0-9\u4e00-\u9fa5-]/g, '').toUpperCase();
      return line + ' -> ' + code;
    }).join('\n');
  }
  if (kind === 'order-id') {
    const kv = parseKeyValues(text);
    const count = Math.min(500, Math.max(1, Number(kv.count) || 5));
    const prefix = kv.prefix || 'ORD';
    return Array.from({ length: count }, (_, i) => prefix + '-' + new Date().toISOString().slice(0, 10).replace(/-/g, '') + '-' + String(i + 1).padStart(4, '0')).join('\n');
  }
  if (kind === 'percent-change') {
    const kv = parseKeyValues(text);
    const oldV = Number(kv.old); const newV = Number(kv.new);
    const diff = newV - oldV;
    const pct = oldV ? (diff / oldV) * 100 : 0;
    return 'Old: ' + oldV + '\nNew: ' + newV + '\nChange: ' + diff + '\nPercent change: ' + pct.toFixed(2) + '%';
  }
  if (kind === 'ab-sample') {
    const kv = parseKeyValues(text);
    const p = Number(kv.baseline || 0.05); const lift = Number(kv.lift || 0.2);
    const need = Math.ceil(16 * p * (1 - p) / (lift * p) ** 2);
    return 'Baseline conversion: ' + (p * 100).toFixed(2) + '%\nExpected lift: ' + (lift * 100).toFixed(0) + '%\nSample size per group (approx.): ' + need + '\nTotal sample (both groups): ' + (need * 2);
  }
  if (kind === 'funnel-calc') {
    const kv = parseKeyValues(text);
    const visit = Number(kv.visit || 0); const signup = Number(kv.signup || 0); const pay = Number(kv.pay || 0);
    return 'Visit -> Signup: ' + (visit ? ((signup / visit) * 100).toFixed(2) : 0) + '%\nSignup -> Pay: ' + (signup ? ((pay / signup) * 100).toFixed(2) : 0) + '%\nVisit -> Pay: ' + (visit ? ((pay / visit) * 100).toFixed(2) : 0) + '%';
  }
  if (kind === 'nps-calc') {
    const kv = parseKeyValues(text);
    const p = Number(kv.promoters || 0); const pa = Number(kv.passives || 0); const d = Number(kv.detractors || 0);
    const total = p + pa + d || 1;
    const nps = ((p - d) / total) * 100;
    return 'Promoters: ' + p + '\nPassives: ' + pa + '\nDetractors: ' + d + '\nNPS: ' + nps.toFixed(1);
  }
  if (kind === 'shuffle-options') {
    const opts = lines(text);
    for (let i = opts.length - 1; i > 0; i -= 1) {
      const j = crypto.getRandomValues(new Uint32Array(1))[0] % (i + 1);
      [opts[i], opts[j]] = [opts[j], opts[i]];
    }
    return opts.join('\n');
  }
  if (kind === 'initials') {
    return lines(text).map((name) => name.split(/\s+/).map((p) => p[0]).join('').toUpperCase() + ' <- ' + name).join('\n');
  }
  if (kind === 'domain-clean') {
    const found = Array.from(new Set((text.match(/[a-z0-9][-a-z0-9]*\.[a-z]{2,}/gi) || []).map((d) => d.toLowerCase())));
    return found.join('\n');
  }
  if (kind === 'log-status') {
    const counts = {};
    Array.from(text.matchAll(/\b([1-5]\d{2})\b/g)).forEach((m) => { counts[m[1]] = (counts[m[1]] || 0) + 1; });
    return Object.entries(counts).sort((a, b) => b[1] - a[1]).map(([code, n]) => code + ': ' + n).join('\n') || 'No status codes found';
  }
  if (kind === 'json-to-csv') {
    const arr = JSON.parse(text);
    if (!Array.isArray(arr) || !arr.length) throw new Error('Enter a JSON array');
    const keys = Array.from(arr.reduce((set, row) => { Object.keys(row).forEach((k) => set.add(k)); return set; }, new Set()));
    return keys.join(',') + '\n' + arr.map((row) => keys.map((k) => JSON.stringify(row[k] ?? '')).join(',')).join('\n');
  }
  if (kind === 'csv-to-json') {
    const rows = csvRows(text);
    const [header, ...body] = rows;
    return JSON.stringify(body.map((r) => Object.fromEntries(header.map((h, i) => [h, r[i] || '']))), null, 2);
  }
  if (kind === 'hreflang') {
    return lines(text).map((line) => {
      const [lang, url] = line.split('=').map((x) => x.trim());
      return '<link rel="alternate" hreflang="' + lang + '" href="' + url + '" />';
    }).join('\n') + '\n<link rel="alternate" hreflang="x-default" href="' + (lines(text)[0].split('=')[1] || '').trim() + '" />';
  }
  if (kind === 'meta-extract') {
    const title = (text.match(/<title>([^<]*)<\/title>/i) || [, ''])[1];
    const metas = Array.from(text.matchAll(/<meta\s+[^>]*>/gi)).map((m) => m[0]);
    return 'Title: ' + title + '\n\nMeta tags:\n' + metas.join('\n');
  }
  if (kind === 'alt-check') {
    const imgs = Array.from(text.matchAll(/<img\b[^>]*>/gi)).map((m) => m[0]);
    const missing = imgs.filter((tag) => !/alt\s*=\s*["'][^"']+["']/i.test(tag));
    return 'Total images: ' + imgs.length + '\nMissing alt: ' + missing.length + '\n\n' + (missing.join('\n') || 'All images have alt text');
  }
  const { samples500, runSync500 } = require('./runtime-500');
  if (Object.prototype.hasOwnProperty.call(samples500, kind)) {
    return runSync500(kind, text);
  }
  return text;
}

if (typeof module !== 'undefined' && module.exports) {
  const { samples500 } = require('./runtime-500');
  Object.assign(samples, samples500);
  module.exports = { runSync, samples };
}

async function runTool() {
  try {
    const text = input.value.trim();
    if (!text) throw new Error('Enter content or click Load sample.');
    let result;
    if (config.kind === 'hmac') result = await hmac(text);
    else if (config.kind === 'hash') result = 'SHA-1: ' + await sha(text, 'SHA-1') + '\nSHA-256: ' + await sha(text, 'SHA-256') + '\nSHA-384: ' + await sha(text, 'SHA-384') + '\nSHA-512: ' + await sha(text, 'SHA-512');
    else result = runSync(config.kind, text);
    output.value = result;
    setStatus('Done. Copy the result when ready.');
  } catch (error) {
    output.value = '';
    setStatus(error.message || 'Processing failed. Check input format.', true);
  }
}

if (typeof document !== 'undefined') {
  document.getElementById('sampleBtn').addEventListener('click', () => {
    input.value = samples[config.kind] || samples['word-counter'];
    runTool();
  });
  document.getElementById('runBtn').addEventListener('click', runTool);
  document.getElementById('copyBtn').addEventListener('click', async () => {
    await navigator.clipboard.writeText(output.value || '');
    setStatus('Copied to clipboard.');
  });
  document.getElementById('clearBtn').addEventListener('click', () => {
    input.value = '';
    output.value = '';
    setStatus('Cleared.');
  });
}
