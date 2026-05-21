'use strict';

function lines(text) {
  return String(text || '').split(/\r?\n/).map((l) => l.trim()).filter(Boolean);
}

function parseKV(text) {
  const d = {};
  lines(text).forEach((line) => {
    const i = line.indexOf('=');
    if (i > -1) d[line.slice(0, i).trim().toLowerCase()] = line.slice(i + 1).trim();
  });
  return d;
}

function humanizeKind(kind) {
  return String(kind).replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
}

const HTTP_MAP = {
  100: 'Continue', 101: 'Switching Protocols', 200: 'OK', 201: 'Created', 204: 'No Content',
  301: 'Moved Permanently', 302: 'Found', 304: 'Not Modified', 400: 'Bad Request', 401: 'Unauthorized',
  403: 'Forbidden', 404: 'Not Found', 405: 'Method Not Allowed', 408: 'Request Timeout',
  409: 'Conflict', 410: 'Gone', 413: 'Payload Too Large', 415: 'Unsupported Media Type',
  422: 'Unprocessable Entity', 429: 'Too Many Requests', 500: 'Internal Server Error',
  502: 'Bad Gateway', 503: 'Service Unavailable', 504: 'Gateway Timeout'
};

const PORT_MAP = {
  20: 'FTP data', 21: 'FTP', 22: 'SSH', 25: 'SMTP', 53: 'DNS', 80: 'HTTP', 110: 'POP3',
  143: 'IMAP', 443: 'HTTPS', 465: 'SMTPS', 587: 'SMTP submission', 993: 'IMAPS', 995: 'POP3S',
  3306: 'MySQL', 5432: 'PostgreSQL', 6379: 'Redis', 27017: 'MongoDB', 8080: 'HTTP alt', 8443: 'HTTPS alt'
};

const MIME_MAP = {
  json: 'application/json', html: 'text/html', css: 'text/css', js: 'text/javascript',
  png: 'image/png', jpg: 'image/jpeg', jpeg: 'image/jpeg', gif: 'image/gif', webp: 'image/webp',
  svg: 'image/svg+xml', pdf: 'application/pdf', zip: 'application/zip', csv: 'text/csv',
  xml: 'application/xml', txt: 'text/plain', woff2: 'font/woff2'
};

const DNS_MAP = {
  A: 'IPv4 address', AAAA: 'IPv6 address', CNAME: 'Canonical name alias', MX: 'Mail exchange',
  TXT: 'Text record (SPF, verification)', NS: 'Name server', SOA: 'Start of authority', PTR: 'Reverse DNS'
};

const CURL_ERR = {
  6: 'Could not resolve host', 7: 'Failed to connect', 28: 'Timeout', 35: 'SSL connect error',
  43: 'SSL certificate problem', 52: 'Empty reply', 56: 'Recv failure', 60: 'SSL cert verify failed'
};

function checklist(title, items) {
  return `${title}\n${items.map((x, i) => `${i + 1}. ${x}`).join('\n')}`;
}

function formatKV(kv) {
  const keys = Object.keys(kv);
  if (!keys.length) return '(no key=value settings detected)';
  return keys.map((k) => `${k}: ${kv[k]}`).join('\n');
}

function refLookup(kind, query) {
  const q = String(query || '').trim().split(/\s+/)[0];
  if (kind === 'http-ref' || kind === 'status-search' || kind === 'log-status') {
    const code = q.replace(/\D/g, '') || q;
    return `HTTP ${code}: ${HTTP_MAP[code] || 'Look up RFC 9110 / MDN for this status.'}\nCommon fix: check routing, auth, payload validation, and upstream health.`;
  }
  if (kind === 'port-ref' || kind === 'port-cmd') {
    const p = q.replace(/\D/g, '') || q;
    return `Port ${p}: ${PORT_MAP[p] || 'Verify service binding in your stack before opening firewall rules.'}`;
  }
  if (kind === 'mime-ref') {
    const ext = q.toLowerCase().replace(/^\./, '');
    return `${ext} → ${MIME_MAP[ext] || 'application/octet-stream (verify with file --mime-type)'}`;
  }
  if (kind === 'dns-ref') {
    const t = q.toUpperCase();
    return `DNS ${t}: ${DNS_MAP[t] || 'Consult your DNS provider docs for record syntax and TTL.'}`;
  }
  if (kind === 'curl-err-ref') {
    return `cURL error ${q}: ${CURL_ERR[q] || 'See https://curl.se/libcurl/c/libcurl-errors.html'}`;
  }
  if (kind === 'win-err-ref') {
    return `Windows error ${q}: search "winerror ${q}" in Microsoft docs; capture Event Viewer + exit code from your installer/CLI.`;
  }
  if (kind === 'signal-ref') {
    const sig = { SIGTERM: 15, SIGKILL: 9, SIGHUP: 1, SIGINT: 2 };
    return `Signal ${q}: ${sig[q] ? 'numeric ' + sig[q] : 'see man 7 signal on Linux'} — use for graceful shutdown design.`;
  }
  if (kind === 'tz-ref' || kind === 'tz-city') {
    return `Timezone ${q}: confirm IANA zone (e.g. America/New_York) in scheduling code; always store UTC internally.`;
  }
  if (kind === 'css-color-ref' || kind === 'html-entity-ref') {
    return `Reference lookup for "${q}" — paste hex/name or entity into your design system or HTML encoder tool on AIHH.ai.`;
  }
  return `Reference: ${q}\nCategory: ${humanizeKind(kind)}\nTip: pair with official docs and verify in your environment.`;
}

function pdfPlanner(kind, kv, t) {
  const task = kind.replace(/^pdf-/, '').replace(/-/g, ' ');
  const steps = [
    'Open source PDF in Acrobat, Preview, or your editor',
    `Apply settings: ${formatKV(kv)}`,
    `Run "${task}" export or preflight`,
    'Verify fonts, color space, and page boxes on output',
    'Archive source + output with version label'
  ];
  if (kind.includes('merge')) steps.unshift('List files in merge order');
  if (kind.includes('split')) steps.push('Name output files with page ranges');
  if (kind.includes('password')) steps.push('Store password in a secrets manager, not in chat');
  return `PDF workflow — ${humanizeKind(kind)}\n\n${checklist('Steps', steps)}\n\nPages/lines in input: ${lines(t).length}`;
}

function imgPlanner(kind, kv) {
  const task = kind.replace(/^img-/, '').replace(/-/g, ' ');
  return checklist(`Image task — ${humanizeKind(kind)}`, [
    `Settings:\n${formatKV(kv)}`,
    'Export master at 2× display size when possible',
    'Compress with quality 80–85 for photos, lossless for UI assets',
    'Add width/height attributes to prevent CLS',
    'Generate WebP/AVIF variants + fallback JPG/PNG',
    `Filename SEO: lowercase, hyphenated, describe ${task}`
  ]);
}

function cssSnippet(kind, kv) {
  const base = kind.replace(/-css$/, '').replace(/-/g, ' ');
  return `/* ${humanizeKind(kind)} */\n.${base.replace(/\s/g, '-')} {\n  /* ${formatKV(kv)} */\n  padding: ${kv.padding || '1rem'};\n  border-radius: ${kv.radius || '0.5rem'};\n}\n\n/* Toggle :hover / :focus-visible for a11y */`;
}

function htmlSnippet(kind, kv) {
  const tag = kind.includes('breadcrumb') ? 'nav' : 'section';
  return `<${tag} class="${kind.replace(/-html$/, '')}" aria-label="${humanizeKind(kind)}">\n  <!-- ${formatKV(kv)} -->\n</${tag}>`;
}

function schemaSnippet(kind, kv) {
  return JSON.stringify({
    '@context': 'https://schema.org',
    '@type': kind.includes('faq') ? 'FAQPage' : 'WebPage',
    name: kv.title || humanizeKind(kind),
    description: kv.description || 'Generated locally — replace with your page copy'
  }, null, 2);
}

function securityChecklist(kind, kv) {
  const items = [
    'Review settings: ' + formatKV(kv).replace(/\n/g, '; '),
    'Apply least privilege on API keys and OAuth scopes',
    'Enable HSTS + secure cookies on production',
    'Rotate secrets on schedule; never commit .env',
    'Test CSP report-only before enforce mode'
  ];
  if (kind.includes('csp')) items.unshift('Start with default-src \'self\' and tighten per directive');
  if (kind.includes('oauth')) items.unshift('Use PKCE for public clients');
  return checklist(`Security — ${humanizeKind(kind)}`, items);
}

function financeCalc(kind, kv) {
  const n = (k, d = 0) => Number(kv[k] ?? d);
  if (kind.includes('margin') || kind === 'margin-markup') {
    const cost = n('cost', 40);
    const price = n('price', n('sell', 75));
    const margin = ((price - cost) / price) * 100;
    return `Margin: ${margin.toFixed(2)}%\nMarkup on cost: ${(((price - cost) / cost) * 100).toFixed(2)}%`;
  }
  if (kind.includes('roi')) {
    const gain = n('gain', 0);
    const cost = n('cost', 1);
    return `ROI: ${(((gain - cost) / cost) * 100).toFixed(2)}%`;
  }
  if (kind.includes('commission')) {
    return `Commission: ${(n('sales', 0) * n('rate', 8) / 100).toFixed(2)}`;
  }
  if (kind.includes('overtime')) {
    const h = n('hours', 40);
    const rate = n('rate', 30);
    const reg = Math.min(40, h);
    const ot = Math.max(0, h - 40) * rate * 1.5;
    return `Regular: ${(reg * rate).toFixed(2)}\nOvertime: ${ot.toFixed(2)}\nTotal: ${(reg * rate + ot).toFixed(2)}`;
  }
  if (kind.includes('breakeven')) {
    const fixed = n('fixed', 5000);
    const price = n('price', 25);
    const cost = n('cost', 10);
    const units = (price - cost) ? fixed / (price - cost) : 0;
    return `Break-even units: ${units.toFixed(0)}`;
  }
  if (kind.includes('hourly') || kind.includes('salary')) {
    const hourly = n('hourly', 45);
    const hours = n('hours', 40);
    return `Gross pay (period): ${(hourly * hours).toFixed(2)}\nAnnual estimate (×52): ${(hourly * hours * 52).toFixed(2)}`;
  }
  if (kind.includes('sales-tax') || kind.includes('tax')) {
    const amount = n('amount', 100);
    const rate = n('rate', 8.25);
    const tax = amount * rate / 100;
    return `Tax: ${tax.toFixed(2)}\nTotal: ${(amount + tax).toFixed(2)}`;
  }
  if (kind.includes('invoice') || kind.includes('quote')) {
    const qty = n('qty', 1);
    const price = n('price', 49.5);
    return `Line total: ${(qty * price).toFixed(2)}\n(Add more lines in your spreadsheet)`;
  }
  if (kind.includes('timesheet')) {
    const hrs = lines(kv._raw || '').map(Number).filter((x) => !Number.isNaN(x));
    const sum = (kv.hours ? [Number(kv.hours)] : hrs).reduce((a, b) => a + b, 0);
    return `Hours total: ${sum.toFixed(2)}`;
  }
  return null;
}

function convertKind(kind, text, kv) {
  if (kind === 'json-xml' && text.trim().startsWith('{')) {
    try {
      const o = JSON.parse(text);
      const tag = (k, v) => {
        if (v === null || v === undefined) return '';
        if (typeof v === 'object') {
          if (Array.isArray(v)) return v.map((item) => `<${k}>${tag('item', item)}</${k}>`).join('');
          return Object.entries(v).map(([ck, cv]) => tag(ck, cv)).join('');
        }
        return `<${k}>${String(v)}</${k}>`;
      };
      return '<root>\n' + Object.entries(o).map(([k, v]) => tag(k, v)).join('\n') + '\n</root>';
    } catch (e) { /* fallthrough */ }
  }
  if (kind === 'tsv-csv') {
    return lines(text).map((l) => l.split('\t').join(',')).join('\n');
  }
  if (kind === 'ini-json' || kind === 'toml-json' || kind === 'props-json') {
    const o = {};
    lines(text).forEach((line) => {
      const i = line.indexOf('=');
      if (i > -1) o[line.slice(0, i).trim()] = line.slice(i + 1).trim();
    });
    return JSON.stringify(o, null, 2);
  }
  if (kind === 'bbcode-html') {
    return text
      .replace(/\[b\](.*?)\[\/b\]/gi, '<strong>$1</strong>')
      .replace(/\[url=([^\]]+)\](.*?)\[\/url\]/gi, '<a href="$1">$2</a>');
  }
  if (kind.includes('hex') || kind.includes('binary') || kind.includes('morse') || kind.includes('rot13')) {
    return `${humanizeKind(kind)} conversion ready.\nInput length: ${text.length} chars\nUse dedicated encoder on AIHH.ai for round-trip verify.`;
  }
  return `Convert — ${humanizeKind(kind)}\n${formatKV(kv)}\n\nPaste source format above, then run your pipeline step-by-step and verify output checksum.`;
}

function structuredPlanner(kind, text, kv) {
  const L = lines(text);
  const body = L.filter((l) => !l.includes('='));
  return [
    `${humanizeKind(kind)} — result`,
    '',
    'Settings:',
    formatKV(kv),
    '',
    body.length ? `Content lines (${body.length}):\n${body.slice(0, 8).join('\n')}${body.length > 8 ? '\n…' : ''}` : '',
    '',
    checklist('Recommended workflow', [
      'Load sample or paste your real input',
      'Click Run and review output locally',
      'Copy into your doc, IDE, or ticket',
      'Re-run after edits; nothing is uploaded',
      `Related: search ${kind.split('-')[0]} tools on AIHH.ai hub`
    ])
  ].filter(Boolean).join('\n');
}

/**
 * Smart fallback for any tool kind — meaningful output for SEO/commercial pages.
 */
function runSmartFallback(kind, text) {
  const t = String(text || '').trim();
  const kv = parseKV(t);
  const L = lines(t);
  const q = L[0] || Object.values(kv)[0] || '';

  if (kind.endsWith('-ref') || kind === 'status-search' || kind === 'log-status') {
    return L.length > 1
      ? L.map((line) => refLookup(kind, line)).join('\n\n')
      : refLookup(kind, q);
  }

  if (kind.startsWith('pdf-') || kind === 'print-pdf-tips') return pdfPlanner(kind, kv, t);

  if (kind.startsWith('img-') || kind.startsWith('lazy-') || kind.startsWith('og-') || kind.startsWith('favicon')
    || kind.startsWith('thumb-') || kind.startsWith('alt-') || kind.startsWith('picture-')) {
    return imgPlanner(kind, kv);
  }

  if (kind.endsWith('-css') || kind.includes('-css')) return cssSnippet(kind, kv);

  if (kind.endsWith('-html') || kind === 'a11y-html' || kind === 'breadcrumb-html') return htmlSnippet(kind, kv);

  if (kind.includes('schema') || kind.includes('manifest') || kind === 'indexnow') {
    if (kind === 'indexnow') return L.map((url) => `IndexNow URL: ${url}`).join('\n') + '\n\nSubmit key + URL list in Bing/Yandex webmaster tools.';
    if (kind === 'manifest-gen') {
      return JSON.stringify({
        name: kv.name || 'AIHH.ai',
        short_name: kv.short_name || 'AIHH',
        start_url: kv.start || '/',
        display: 'standalone',
        background_color: '#071012',
        theme_color: '#64f4c4'
      }, null, 2);
    }
    return schemaSnippet(kind, kv);
  }

  if (kind.includes('csp') || kind.includes('oauth') || kind.includes('csrf') || kind.includes('sec-')
    || kind.includes('sri-') || kind.includes('apikey') || kind.includes('totp') || kind.includes('otp')
    || kind.includes('pgp') || kind.includes('entropy') || kind.includes('jwt-session')) {
    return securityChecklist(kind, kv);
  }

  const fin = financeCalc(kind, kv);
  if (fin) return fin;

  if (kind.includes('calc') || kind.includes('-calc')) {
    const nums = Object.values(kv).map(Number).filter((x) => !Number.isNaN(x) && x !== 0);
    if (nums.length >= 2) return `${humanizeKind(kind)}: ${nums.join(' × ')} → combined hint ${(nums[0] + nums[1]).toFixed(2)} (verify formula for your case)`;
  }

  if (kind.includes('convert') || kind.includes('-to-') || kind.includes('json-') || kind.includes('csv')
    || kind.includes('tsv') || kind.includes('ini-') || kind.includes('toml') || kind.includes('bbcode')) {
    return convertKind(kind, t, kv);
  }

  if (kind.includes('tz-') || kind.includes('dst') || kind === 'biz-hours') {
    return `Time — ${humanizeKind(kind)}\n${formatKV(kv)}\nStore UTC in DB; convert at display with IANA zones.\nMeeting overlap: compare ${kv.zone1 || 'zone A'} vs ${kv.zone2 || 'zone B'}.`;
  }

  if (kind.includes('checklist') || kind.includes('-check') || kind.includes('-lint')
    || kind.includes('validate') || kind.includes('preflight') || kind.includes('a11y')) {
    return checklist(`${humanizeKind(kind)} — review`, [
      'Input captured: ' + (L.length || 'settings only'),
      'Run local tests / export',
      'Fix blockers before publish',
      'Document pass/fail in ticket',
      'Link canonical tool URL in release notes'
    ]);
  }

  if (kind.includes('-plan') || kind.includes('workflow') || kind.includes('launch')) {
    return checklist(`${humanizeKind(kind)} plan`, [
      'Define goal and owner',
      formatKV(kv),
      ...L.filter((l) => !l.includes('=')).slice(0, 5).map((s) => 'Step: ' + s),
      'QA on staging',
      'Ship + monitor Search Console'
    ]);
  }

  if (kind.includes('-gen') || kind.includes('-gen-')) {
    return `Generated snippet — ${humanizeKind(kind)}\n${formatKV(kv)}\n\n<!-- paste into project and adjust tokens -->`;
  }

  if (kind.includes('extract') || kind.includes('batch') || kind.includes('slug')) {
    return L.map((line, i) => `${i + 1}. ${line}`).join('\n') + `\n\nProcessed ${L.length} line(s) for ${humanizeKind(kind)}.`;
  }

  if (kind.includes('seo') || kind.includes('meta') || kind.includes('robots') || kind.includes('sitemap')
    || kind.includes('utm') || kind.includes('serp') || kind.includes('hreflang') || kind.includes('canonical')) {
    return checklist(`SEO — ${humanizeKind(kind)}`, [
      formatKV(kv),
      'Unique title ≤ 60 chars, description 140–160',
      'Canonical matches live URL',
      'Internal link from AIHH.ai hub',
      'Submit URL in GSC after deploy'
    ]);
  }

  if (kind.includes('note') || kind.includes('tips') || kind.includes('guide') || kind.includes('clause')) {
    return L.map((c) => '• ' + c).join('\n') + '\n\n— ' + humanizeKind(kind);
  }

  if (kind.includes('email') || kind.includes('cover-letter') || kind.includes('linkedin') || kind.includes('resume')) {
    return `Draft — ${humanizeKind(kind)}\n${formatKV(kv)}\n\n${L.join('\n')}\n\nEdit voice/tone before sending.`;
  }

  return structuredPlanner(kind, t, kv);
}

module.exports = { runSmartFallback, parseKV, lines, humanizeKind };
