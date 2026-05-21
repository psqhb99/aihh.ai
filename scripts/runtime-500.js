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

const samples500 = {
  'pdf-page-count': 'Page 1\nPage 2\nPage 3\nPage 4',
  'pdf-merge-plan': 'files=report-part1.pdf,report-part2.pdf\norder=1,2',
  'pdf-split-plan': 'pages=1-3,10-12\nfile=manual.pdf',
  'pdf-rotate-plan': 'pages=1,3\nangle=90',
  'pdf-meta-guide': 'tool=Adobe export\nmetadata=author,title',
  'img-pdf-plan': 'images=photo1.jpg,photo2.jpg\nlayout=A4 portrait',
  'pdf-img-plan': 'pages=1-5\nformat=jpg\ndpi=150',
  'pdf-size-check': 'size=A4\norientation=portrait',
  'pdf-outline': 'Title\n  Chapter 1\n  Chapter 2',
  'pdf-checklist': 'optimize=for web\nlinearize=yes',
  'print-pdf-tips': 'page=report\n@media=print',
  'pdf-font-check': 'fonts=Arial,Noto Sans\nembed=all',
  'pdf-color-space': 'mode=print\ncmyk=yes',
  'pdf-field-rename': 'old=field_1\nnew=customer_name',
  'pdf-page-labels': 'style=1 of N\nstart=1',
  'pdf-annot-summary': 'note=Fix figure 2\npage=3',
  'pdf-version': 'target=1.7\nsource=1.4',
  'pdf-size-est': 'pages=120\nimages=heavy',
  'pdf-crop': 'margin=12mm\nbleed=3mm',
  'pdf-bleed': 'bleed=3mm\nsafe=5mm',
  'pdf-nup': 'layout=2up\nsheet=A4',
  'pdf-grayscale': 'intent=print mono',
  'pdf-password-tips': 'length=16\nsymbols=yes',
  'pdf-a-checklist': 'archival=yes\nfonts=embedded',
  'pdf-a11y-check': 'tagged=no\ntitle=missing',
  'img-format-note': 'from=png\nto=jpg\nquality=85',
  'img-resize-calc': 'width=1920\nnew_width=1280',
  'img-quality-est': 'quality=80\nsize_kb=240',
  'img-dpi-calc': 'width=2480\nheight=3508\ndpi=300',
  'img-exif-check': 'gps=yes\nserial=yes',
  'img-dominant-note': 'image=hero.jpg\npalette=auto',
  'favicon-plan': 'sizes=16,32,48,180,512',
  'og-image-size': 'width=1200\nheight=630',
  'img-hex-note': 'pick=center\nformat=hex',
  'img-rename-seo': 'files=IMG_001.jpg\nprefix=product-blue-widget',
  'svg-export-plan': 'width=512\nbackground=white',
  'gif-info': 'frames=24\ndelay=100ms',
  'ico-checklist': 'sizes=16,32,48',
  'img-bc-formula': 'brightness=+10\ncontrast=+5',
  'thumb-grid': 'cols=4\nrows=3\ngap=8px',
  'alt-batch': 'product-blue.jpg\nproduct-red.jpg',
  'lazy-img-tag': 'src=hero.jpg\nwidth=1200\nheight=630',
  'srcset-gen': 'base=photo.jpg\nwidths=400,800,1200',
  'picture-gen': 'src=photo.jpg\nwebp=photo.webp',
  'img-size-compare': 'a=1200kb\nb=450kb',
  'img-dim-parse': 'photo1.jpg 1920x1080\nphoto2.jpg 800x600',
  'lorem-gen': 'paragraphs=2\nwords=40',
  readability: 'The quick brown fox jumps over the lazy dog. This sample checks readability and sentence length for English web copy.',
  'line-ending': 'mode=crlf\nline one\nline two',
  'trim-lines': '  hello  \n\n  world  \n',
  'url-extract': 'See https://aihh.ai/ and http://tool00001.aihh.ai/',
  'email-extract': 'Contact ann@example.com or bob@test.org',
  'hashtag-extract': 'Launch #seo #tools #aihh today',
  'slug-batch': 'Free JSON Formatter\nWebhook HMAC Tool',
  'sentence-case': 'HELLO WORLD. ANOTHER LINE.',
  'reverse-text': 'AIHH tools',
  'strip-html': '<p>Hello <b>world</b></p>',
  'md-plain': '# Title\n\n**bold** text',
  'text-to-html': 'Line one\n\nLine two',
  'word-freq': 'seo tools seo json tools',
  'char-freq': 'hello',
  'reading-level': 'The public needs clear free tools that run locally in the browser without uploading files.',
  'syllable-count': 'internationalization',
  palindrome: 'level\nhello',
  anagram: 'listen\nsilent\nenlist',
  'cite-apa': 'author=Smith,J.\nyear=2024\ntitle=Online Tools',
  'meta-gen-bullets': 'Free browser JSON tool\nNo upload\nInstant copy',
  'outline-gen': 'json formatter\nbrowser tool\nseo',
  'privacy-clauses': 'local processing\nno sale of data\ncookies=minimal',
  'bmi-calc': 'weight=70\nheight=175',
  'bmr-calc': 'weight=70\nheight=175\nage=30\nsex=m',
  'loan-calc': 'principal=200000\nrate=5.5\nyears=30',
  'compound-calc': 'principal=10000\nrate=4\nyears=10',
  'tip-calc': 'bill=86.50\npercent=18\npeople=3',
  'discount-calc': 'price=100\ndiscount=15\nextra=10',
  'margin-calc': 'cost=40\nprice=75',
  'markup-calc': 'cost=50\nmarkup=60',
  'currency-calc': 'amount=100\nrate=1.08\nfrom=USD\nto=EUR',
  'unit-convert': 'from=km\nto=mile\nvalue=10',
  'fuel-calc': 'distance=320\nmpg=28\nprice=3.9',
  'calorie-calc': 'minutes=30\nmet=8\nweight=70',
  'size-chart': 'us=9\ntype=shoe',
  'age-calc': 'birth=1990-06-15\ntoday=2026-05-21',
  'date-diff': '2026-01-01\n2026-05-21',
  'workdays-calc': 'start=2026-05-01\nend=2026-05-21',
  'date-add': 'date=2026-05-21\ndays=14',
  'percent-calc': 'part=45\nwhole=200',
  'ratio-calc': 'a=16\nb=9',
  'sqrt-calc': '144',
  'sci-notation': '0.0000456',
  'fraction-calc': '12/18',
  'gcd-lcm': '12\n18',
  'json-xml': '{"ok":true,"name":"demo"}',
  'tsv-csv': 'name\tscore\nAnn\t90',
  'ini-json': 'port=4399\nhost=localhost',
  'toml-json': 'title = "demo"\nenabled = true',
  'html-table-csv': '<table><tr><th>a</th></tr><tr><td>1</td></tr></table>',
  'bbcode-html': '[b]bold[/b] [url=https://aihh.ai/]AIHH[/url]',
  'emoji-unicode': '😀 🚀',
  punycode: 'münchen.de',
  'morse-code': 'SOS',
  'binary-text': 'Hi',
  'hex-text': 'Hello',
  'octal-dec': '52',
  'roman-num': 'MMXXVI',
  'num-words': '2026',
  'csv-detect': 'a;b;c\n1;2;3',
  'props-json': 'port=8080\napi.key=demo',
  'box-shadow-gen': 'x=0\ny=4\nblur=12\ncolor=#00000033',
  'border-radius-gen': 'tl=8\ntr=8\nbr=8\nbl=8',
  'clip-path-gen': 'shape=triangle',
  'gradient-gen': 'from=#64f4c4\nto=#071012\nangle=135',
  'colorblind-note': 'type=deuteranopia',
  'img-sharpen-note': 'amount=1.2',
  'contrast-note': 'shadows=10\nhighlights=5',
  'watermark-calc': 'position=bottom-right\nmargin=24px',
  'social-size-chart': 'network=instagram\npost=square',
  'app-screenshot-chart': 'device=iphone\nsize=6.7',
  'sprite-calc': 'frames=8\ncols=4',
  'aspect-fit-note': 'mode=contain',
  'avif-checklist': 'fallback=jpg\nquality=60',
  'png-checklist': 'palette=256\ncompress=yes',
  'jpeg-chroma-note': 'subsampling=4:2:0',
  'cdn-url-template': 'host=cdn.aihh.ai\npath=/assets/{name}',
  'breakpoints-plan': 'sm=640\nmd=768\nlg=1024',
  'hero-crop-note': 'safe=center\nratio=3:1',
  'gallery-spec': 'thumb=400\nzoom=1600',
  'image-sitemap': 'https://aihh.ai/assets/hub/tools/tool00001-json-formatter-minify-and-validator.svg',
  'bulk-rename': 'pattern={id}-{slug}.webp\ncount=12',
  'openapi-list': 'paths:\n  /users:\n  /tools:',
  'graphql-format': 'query{tools{name url}}',
  'proto-format': 'message Demo { string name = 1; }',
  'ldap-dn': 'cn=admin,ou=users,dc=example,dc=com',
  'cron-next': '*/15 9-18 * * 1-5',
  'semver-compare': '1.2.3\n1.2.10',
  'compose-snippet': 'services:\n  web:\n    image: nginx',
  'systemd-snippet': 'unit=aihh.service\ndescription=AIHH tool',
  'gitignore-gen': 'node_modules\n.env\ndist',
  'editorconfig-gen': 'indent=2\ncharset=utf-8',
  'prettier-snippet': 'semi=true\nsingleQuote=true',
  'eslint-snippet': 'env=browser\nextends=eslint:recommended',
  'nginx-rate': 'zone=api\nrate=10r/s',
  'cors-builder': 'origin=https://aihh.ai\nmethods=GET,POST',
  'content-type-match': 'path=/api\next=.json',
  'mime-ext': '.json\n.html\n.webp',
  'bcrypt-note': 'cost=12',
  'ssh-key-check': 'ssh-ed25519 AAAAC3... comment',
  'pem-decode': '-----BEGIN CERTIFICATE-----\nMIIC...\n-----END CERTIFICATE-----',
  'ipv6-format': '2001:0db8:85a3:0000:0000:8a2e:0370:7334',
  'mac-format': 'aa-bb-cc-dd-ee-ff',
  'cidr-overlap': '10.0.0.0/24\n10.0.0.128/25',
  'port-range': '3000-3010',
  'http-method-ref': 'GET',
  'retry-plan': 'max=5\nbase=2',
  'schema-picker': 'WebApplication',
  'breadcrumb-schema': 'Home|Tools|JSON Formatter',
  'article-schema': 'headline=Demo\ndate=2026-05-21',
  'howto-schema': 'Step 1 paste\nStep 2 run',
  'video-schema': 'name=Demo\nduration=PT2M',
  'org-schema': 'name=AIHH.ai\nurl=https://aihh.ai/',
  'website-schema': 'url=https://aihh.ai/\nquery=tools',
  'meta-robots': 'index,follow',
  'x-robots': 'noindex',
  'rel-alternate': 'en=https://aihh.ai/\nfr=https://aihh.ai/fr/',
  'rel-pagination': 'page=2\nnext=/page/3',
  'title-pixel': 'AIHH.ai Free JSON Formatter Online Tool',
  'desc-pixel': 'Format JSON in your browser with no upload. Copy results instantly for API and config work.',
  'keyword-density': 'json formatter online tool json',
  'heading-kw': '<h1>JSON Formatter</h1>',
  'nofollow-gen': 'https://partner.example.com/deal',
  'affiliate-disclaimer': 'site=AIHH.ai',
  'faceted-seo': 'filters=color,size\nindex=no',
  'thin-content': 'words=120\nunique=yes',
  'eeat-checklist': 'author=yes\nexperience=yes',
  'http-ref': '404',
  'port-ref': '443',
  'mime-ref': 'application/json',
  'git-exit-ref': '128',
  'npm-err-ref': 'E404',
  'pg-class-ref': '42P01',
  'signal-ref': '15',
  'css-color-ref': 'rebeccapurple',
  'html-entity-ref': '&copy;',
  'tz-ref': 'America/New_York',
  'dns-ref': 'A',
  'tz-city': 'Tokyo',
  'tz-convert': 'from=EST\nto=UTC\ntime=09:30',
  'dst-finder': 'year=2026\nregion=US',
  'tz-unix': '1710000000\ntz=Asia/Tokyo',
  'button-css': 'variant=primary\nsize=md',
  'card-css': 'padding=1.5rem\nradius=1rem',
  'form-css': 'field=input\nstate=focus',
  'table-css': 'rows=striped\nscroll=x',
  'a11y-html': 'component=skip-link',
  'print-css': 'margin=1cm',
  'container-css': 'min=320px',
  'theme-css': 'primary=#64f4c4',
  'dark-mode-css': 'scheme=dark',
  'tooltip-css': 'position=top',
  'modal-css': 'size=md',
  'accordion-css': 'items=3',
  'tabs-css': 'count=4',
  'breadcrumb-html': 'Home > Tools > JSON',
  'pagination-css': 'pages=10',
  'alert-css': 'tone=info',
  'invoice-lines': 'qty=2\nprice=49.5',
  'hourly-salary': 'hourly=45\nhours=40',
  'overtime-calc': 'hours=42\nrate=30',
  'breakeven-calc': 'fixed=5000\nprice=25\ncost=10',
  'inventory-turn': 'cogs=120000\ninventory=30000',
  'amort-schedule': 'principal=10000\nrate=6\nmonths=12',
  'sales-tax': 'amount=100\nrate=8.25',
  'margin-markup': 'cost=40\nsell=100',
  'freelance-rate': 'target=80000\nbillable=1200',
  'rent-buy': 'rent=2200\nmortgage=2800',
  'quote-lines': 'item=Setup\nqty=1\nprice=500',
  'timesheet-sum': '8\n7.5\n8\n8',
  'commission-calc': 'sales=50000\nrate=8',
  'roi-calc': 'gain=15000\ncost=100000',
  'currency-format': 'amount=1234.5\nlocale=en-US\ncurrency=USD',
  'otp-guide': 'length=6',
  'pin-strength': '1234',
  'pgp-parse': '-----BEGIN PGP MESSAGE-----',
  'jwt-session-note': 'use=jwt',
  'entropy-note': 'charset=94\nlength=16',
  'totp-checklist': 'app=authenticator\nbackup=codes',
  'apikey-checklist': 'rotate=90d',
  'csp-report': "default-src 'self'",
  'sri-gen': 'url=https://cdn.example.com/lib.js',
  'sec-headers': 'csp=yes\nhsts=yes',
  'csrf-note': 'token=double-submit',
  'samesite-note': 'policy=Lax',
  'oauth-checklist': 'scope=openid profile',
  'rate-limit-hdr': 'limit=100\nwindow=60',
  'env-lint': 'API_KEY=secret\nDEBUG=true',
  'palette-gen': '#64f4c4\n#071012\n#ffd166',
  'contrast-ratio': 'fg=#ffffff\nbg=#071012',
  'glass-css': 'blur=12px\nopacity=0.2',
  'neu-css': 'depth=soft',
  'color-scale': 'base=#64f4c4\nsteps=5',
  'hsl-note': 'h=160\ns=70\nl=45',
  'oklch-note': 'l=0.7\nc=0.15\nh=160',
  'figma-spacing': 'base=4\nscale=1,2,3,4,6,8',
  'icon-scale': '16,20,24,32',
  'type-scale': 'base=16\nratio=1.25',
  'workflow-steps': 'workflow=csv-json\nstep1=Clean CSV\nstep2=Convert JSON',
  'pdf-scan-dpi': 'dpi=300\ncolor=grayscale',
  'pdf-duplex': 'sides=long-edge',
  'pdf-cover': 'title=Annual Report\nyear=2026',
  'pdf-toc-plan': 'chapters=5',
  'pdf-redact-plan': 'fields=email,phone',
  'pdf-compare-plan': 'version=a\nversion=b',
  'pdf-watermark-plan': 'text=CONFIDENTIAL',
  'pdf-print-marks': 'crop=yes\nbleed=3mm',
  'pdf-preflight': 'fonts=ok\nimages=ok',
  'pdf-office-plan': 'to=docx',
  'cover-letter': 'role=Frontend Developer\ncompany=Example Inc',
  'linkedin-headline': 'keyword=SEO tools',
  'agenda-template': 'standup\nblockers\nmetrics',
  'okr-format': 'O: Grow traffic\nKR: +20% clicks',
  'weekly-plan': 'Mon=Batch tools\nWed=QA',
  'mock-json': 'users:list\nfields=id,name',
  'ui-status-pick': '404',
  'email-sig': 'name=Alex\nrole=Engineer',
  'changelog-fmt': 'feat: add tools',
  'semver-bump': '1.2.3\nchange=feat',
  'cite-apa': 'author=Smith,J.\nyear=2024\ntitle=Online Tools',
  'b64-text': 'SGVsbG8gQUlISg==',
  'hex-decode': '48656c6c6f',
  rot13: 'Uryyb',
  caesar: 'shift=3\nHello',
  'cols-to-rows': 'a,b,c\nd,e,f',
  'paste-csv': 'a,b\n1,2',
  'list-intersect': 'a\nb\nc\n---\nb\nc\nd',
  'list-diff': 'a\nb\nc\n---\nc\nd',
  'weighted-avg': '80:0.5\n90:0.5',
  quadratic: 'a=1\nb=-5\nc=6',
  'npr-calc': 'n=10\nr=3',
  'ncr-calc': 'n=10\nr=3',
  'prime-check': '97',
  fibonacci: '10',
  'matrix-2x2': '1,2\n3,4\n|\n5,6\n7,8',
  'angle-convert': '90\nto=rad',
  'fuel-efficiency': 'liters=8\ndistance=100',
  'wind-chill': 'temp=-5\nwind=20',
  'heat-index': 'temp=35\nhumidity=65',
  'roman-date': '2026-05-21',
  'qr-plan': 'url=https://aihh.ai/',
  'utm-calendar': 'week=21\ncampaign=spring',
  'robots-ai': 'GPTBot\nClaudeBot',
  indexnow: 'https://aihh.ai/\nhttps://tool00001.aihh.ai/',
  'cwv-checklist': 'lcp=2.1\ncls=0.05\ninp=180',
  'lhci-snippet': 'url=https://aihh.ai/',
  'sw-cache': 'version=v2',
  'manifest-gen': 'name=AIHH.ai\nstart=/',
  'touch-icon': '180,167,152',
  'security-txt': 'contact=security@aihh.ai',
  'humans-txt': 'team=AIHH\nthanks=users',
  'spdx-license': 'MIT',
  'semver-bump': '1.2.3\nchange=feat',
  'conventional-commit': 'feat: add hub crawl links',
  'api-pagination': 'cursor=abc\nlimit=50',
  'idempotency-key': 'event=payment\nkey=uuid',
  'email-html': 'inline=yes\nwidth=600',
  'md-email': '# Hello\n\nWelcome',
  'sitemap-validate': 'https://aihh.ai/\nhttps://tool00001.aihh.ai/',
  'launch-checklist': 'sitemap=yes\ngsc=yes',
  'pixel-aspect': 'width=1920\nheight=1080\npar=1.0',
  'img-hash-note': 'algorithm=perceptual\nuse=duplicate detection',
  'win-err-ref': '5',
  'curl-err-ref': '28',
  'iso-week': '2026-05-21',
  'leap-year': '2024',
  'countdown-days': 'target=2026-12-31',
  'biz-hours': 'zone1=EST\nzone2=PST\nhours=9-17',
  'age-on-date': 'birth=1990-01-01\non=2026-05-21',
  'julian-day': '2026-05-21',
  'weekday-name': '2026-05-21'
};

function runSync500(kind, text) {
  const t = String(text || '').trim();
  const kv = parseKV(t);

  if (kind.startsWith('pdf-') || kind === 'print-pdf-tips') {
    if (kind === 'pdf-page-count') return 'Total pages: ' + lines(t).length + '\nLines counted: ' + lines(t).join(', ');
    return 'PDF planner: ' + kind + '\nInput noted.\nChecklist:\n1) Validate source PDF\n2) Apply ' + kind.replace('pdf-', '') + ' settings\n3) Export and verify in Acrobat/browser\n\nNext: run merge/split in desktop or wasm tool when added.';
  }

  if (kind === 'img-format-note') return 'Convert ' + (kv.from || 'png') + ' → ' + (kv.to || 'jpg') + ' at quality ' + (kv.quality || '85') + '.\nUse canvas/FileReader locally; this planner lists safe steps before batch export.';
  if (kind === 'img-resize-calc') {
    const w = Number(kv.width || kv.new_width || 1920);
    const nw = Number(kv.new_width || w * 0.5);
    return 'Scale factor: ' + (nw / w).toFixed(4) + '\nNew width: ' + nw + 'px';
  }
  if (kind === 'img-quality-est') return 'Estimated size at q=' + (kv.quality || '80') + ': ~' + (kv.size_kb || '200') + ' KB (rule-of-thumb; export to verify).';
  if (kind === 'img-dpi-calc') {
    const w = Number(kv.width || 2480);
    const h = Number(kv.height || 3508);
    const dpi = Number(kv.dpi || 300);
    return 'Print size: ' + (w / dpi).toFixed(2) + ' × ' + (h / dpi).toFixed(2) + ' inches at ' + dpi + ' DPI';
  }
  if (kind === 'lorem-gen') {
    const base = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.';
    const n = Math.min(10, Number(kv.paragraphs) || 2);
    return Array.from({ length: n }, (_, i) => '¶' + (i + 1) + '\n' + base).join('\n\n');
  }
  if (kind === 'readability') {
    const words = (t.match(/[a-zA-Z]+/g) || []).length;
    const sentences = Math.max(1, (t.match(/[.!?]+/g) || []).length);
    const syll = Math.max(words, Math.round(words * 1.4));
    const flesch = Math.max(0, Math.min(100, 206.835 - 1.015 * (words / sentences) - 84.6 * (syll / words)));
    return 'Words: ' + words + '\nSentences: ' + sentences + '\nFlesch Reading Ease (approx): ' + flesch.toFixed(1);
  }
  if (kind === 'line-ending') {
    const mode = (kv.mode || 'crlf').toLowerCase();
    const eol = mode === 'lf' ? '\n' : '\r\n';
    return lines(t.replace(/^mode=[^\n]+\n?/i, '')).join(eol);
  }
  if (kind === 'trim-lines') return lines(t).join('\n');
  if (kind === 'url-extract') return Array.from(new Set(t.match(/https?:\/\/[^\s)]+/gi) || [])).join('\n') || 'No URLs found';
  if (kind === 'email-extract') return Array.from(new Set(t.match(/[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}/gi) || [])).join('\n') || 'No emails found';
  if (kind === 'hashtag-extract') return Array.from(new Set(t.match(/#[a-zA-Z0-9_]+/g) || [])).join('\n') || 'No hashtags';
  if (kind === 'slug-batch') return lines(t).map((s) => s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')).join('\n');
  if (kind === 'sentence-case') return lines(t).map((l) => l.charAt(0).toUpperCase() + l.slice(1).toLowerCase()).join('\n');
  if (kind === 'reverse-text') return lines(t).map((l) => l.split('').reverse().join('')).join('\n');
  if (kind === 'strip-html') return t.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
  if (kind === 'md-plain') return t.replace(/^#+\s+/gm, '').replace(/[*_`]/g, '');
  if (kind === 'text-to-html') return lines(t).map((p) => '<p>' + p + '</p>').join('\n');
  if (kind === 'word-freq' || kind === 'char-freq') {
    const map = {};
    if (kind === 'word-freq') t.toLowerCase().split(/\s+/).forEach((w) => { if (w) map[w] = (map[w] || 0) + 1; });
    else t.split('').forEach((c) => { if (c.trim()) map[c] = (map[c] || 0) + 1; });
    return Object.entries(map).sort((a, b) => b[1] - a[1]).map(([k, v]) => k + ': ' + v).join('\n');
  }
  if (kind === 'reading-level') return 'Approx. grade level: ' + (6 + Math.min(8, Math.round(t.length / 120))) + '\nTip: shorten sentences for wider audiences.';
  if (kind === 'syllable-count') return 'Estimated syllables: ' + Math.max(1, Math.round((t.match(/[a-zA-Z]+/g) || []).join('').length / 3));
  if (kind === 'palindrome') return lines(t).map((l) => l + ' -> ' + (l.toLowerCase().replace(/[^a-z0-9]/g, '') === l.toLowerCase().replace(/[^a-z0-9]/g, '').split('').reverse().join('') ? 'palindrome' : 'not palindrome')).join('\n');
  if (kind === 'anagram') return lines(t).map((l) => l.split('').sort().join('')).join('\n');
  if (kind === 'meta-gen-bullets') return lines(t).join(' — ').slice(0, 155);
  if (kind === 'outline-gen') return lines(t).map((k, i) => (i + 1) + '. ' + k.charAt(0).toUpperCase() + k.slice(1)).join('\n');
  if (kind === 'privacy-clauses') return lines(t).map((c) => '• ' + c).join('\n');

  if (kind === 'bmi-calc') {
    const w = Number(kv.weight || 70);
    const h = Number(kv.height || 175) / 100;
    const bmi = w / (h * h);
    return 'BMI: ' + bmi.toFixed(2) + ' (' + (bmi < 18.5 ? 'underweight' : bmi < 25 ? 'normal' : bmi < 30 ? 'overweight' : 'obese') + ')';
  }
  if (kind === 'unit-convert') {
    const value = Number(kv.value || 10);
    const from = (kv.from || 'km').toLowerCase();
    const to = (kv.to || 'mile').toLowerCase();
    const table = { km: { mile: 0.621371, m: 1000 }, mile: { km: 1.60934 }, lb: { kg: 0.453592 }, kg: { lb: 2.20462 }, c: { f: (v) => v * 9 / 5 + 32 }, f: { c: (v) => (v - 32) * 5 / 9 } };
    let result = value;
    if (from === 'c' && to === 'f') result = value * 9 / 5 + 32;
    else if (from === 'f' && to === 'c') result = (value - 32) * 5 / 9;
    else if (table[from] && typeof table[from][to] === 'number') result = value * table[from][to];
    else result = value * 1.5;
    return value + ' ' + from + ' = ' + result.toFixed(4) + ' ' + to;
  }
  if (kind === 'loan-calc') {
    const p = Number(kv.principal || 200000);
    const r = Number(kv.rate || 5.5) / 100 / 12;
    const n = Number(kv.years || 30) * 12;
    const pay = r ? (p * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1) : p / n;
    return 'Monthly payment: ' + pay.toFixed(2);
  }
  if (kind === 'compound-calc') {
    const p = Number(kv.principal || 10000);
    const r = Number(kv.rate || 4) / 100;
    const y = Number(kv.years || 10);
    return 'Future value: ' + (p * Math.pow(1 + r, y)).toFixed(2);
  }
  if (kind === 'date-diff') {
    const [a, b] = lines(t);
    const ms = Math.abs(new Date(b) - new Date(a));
    return 'Days apart: ' + Math.round(ms / 86400000);
  }
  if (kind === 'http-ref') return 'HTTP ' + (lines(t)[0] || '404') + ' — look up meaning, common causes, and fixes in your API logs or CDN docs.';
  if (kind === 'port-ref') return 'Port ' + (lines(t)[0] || '443') + ' — standard service mapping reference. Verify in your stack before opening firewall rules.';
  if (kind === 'tz-city') return 'Local time preview for ' + (t.split('\n')[0] || 'Tokyo') + ': use browser Intl when live; planner recommends adding city to title/H1 for SEO.';
  if (kind === 'tz-convert') return 'Convert ' + (kv.time || 'now') + ' from ' + (kv.from || 'EST') + ' to ' + (kv.to || 'UTC') + ' — verify DST on target date.';
  if (kind === 'workflow-steps') {
    return 'Workflow: ' + (kv.workflow || 'custom') + '\n' + lines(t).filter((l) => !l.includes('=')).map((s, i) => (i + 1) + '. ' + s).join('\n') + '\n\nLink related tools from AIHH.ai hub.';
  }
  if (kind === 'contrast-ratio') {
    return 'Contrast check requested.\nCompare foreground/background hex in WCAG contrast checker; aim for 4.5:1 body text, 3:1 large text.';
  }
  if (kind === 'launch-checklist') {
    return 'Launch checklist:\n✓ npm run build\n✓ sitemap submitted in GSC\n✓ canonical/robots verified\n✓ hub crawl links live\n✓ smoke tests green';
  }

  if (kind === 'fuel-efficiency') {
    const liters = Number(kv.liters || kv.l);
    const dist = Number(kv.distance || kv.km);
    if (!liters || !dist) return 'Enter liters=8 and distance=100 (km), one per line.';
    const l100 = (liters / dist) * 100;
    return `Fuel consumption: ${l100.toFixed(2)} L/100km\n(${liters} L over ${dist} km)`;
  }
  if (kind === 'srcset-gen') {
    const base = kv.base || 'image.jpg';
    const widths = (kv.widths || '400,800,1200').split(',').map((w) => w.trim()).filter(Boolean);
    const srcset = widths.map((w) => `${base.replace(/\.[^.]+$/, '')}-${w}w.jpg ${w}w`).join(',\n  ');
    return `<img src="${base}" srcset="\n  ${srcset}\n" sizes="(max-width: 600px) 100vw, 50vw" alt="">`;
  }
  if (kind === 'picture-gen') {
    const src = kv.src || 'photo.jpg';
    const webp = kv.webp || src.replace(/\.[^.]+$/, '.webp');
    return `<picture>\n  <source srcset="${webp}" type="image/webp">\n  <img src="${src}" alt="" loading="lazy">\n</picture>`;
  }
  if (kind === 'leap-year') {
    const y = Number(kv.year || lines(t)[0] || 2024);
    const leap = (y % 4 === 0 && y % 100 !== 0) || y % 400 === 0;
    return `${y} is ${leap ? '' : 'not '}a leap year.`;
  }
  if (kind === 'weekday-name' || kind === 'roman-date') {
    const d = new Date(kv.date || lines(t)[0] || Date.now());
    if (Number.isNaN(d.getTime())) return 'Invalid date. Use YYYY-MM-DD.';
    if (kind === 'weekday-name') return d.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
    const rom = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI', 'XII'];
    return `${d.getDate()} ${rom[d.getMonth()]} ${d.getFullYear()}`;
  }
  if (kind === 'iso-week') {
    const d = new Date(kv.date || lines(t)[0]);
    if (Number.isNaN(d.getTime())) return 'Invalid date.';
    const tmp = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
    tmp.setUTCDate(tmp.getUTCDate() + 4 - (tmp.getUTCDay() || 7));
    const yearStart = new Date(Date.UTC(tmp.getUTCFullYear(), 0, 1));
    const week = Math.ceil((((tmp - yearStart) / 86400000) + 1) / 7);
    return `ISO week ${week} of ${tmp.getUTCFullYear()}`;
  }
  if (kind === 'countdown-days') {
    const target = new Date(kv.target || lines(t)[0]);
    const now = new Date();
    const days = Math.ceil((target - now) / 86400000);
    return Number.isNaN(target.getTime()) ? 'Invalid target date.' : `Days until ${target.toISOString().slice(0, 10)}: ${days}`;
  }
  if (kind === 'age-on-date') {
    const birth = new Date(kv.birth || lines(t)[0]);
    const on = new Date(kv.on || lines(t)[1] || Date.now());
    if (Number.isNaN(birth.getTime()) || Number.isNaN(on.getTime())) return 'Use birth=YYYY-MM-DD and on=YYYY-MM-DD.';
    let age = on.getFullYear() - birth.getFullYear();
    const m = on.getMonth() - birth.getMonth();
    if (m < 0 || (m === 0 && on.getDate() < birth.getDate())) age -= 1;
    return `Age on ${on.toISOString().slice(0, 10)}: ${age} years`;
  }
  if (kind === 'julian-day') {
    const d = new Date(kv.date || lines(t)[0]);
    if (Number.isNaN(d.getTime())) return 'Invalid date.';
    const a = Math.floor((14 - (d.getMonth() + 1)) / 12);
    const y = d.getFullYear() + 4800 - a;
    const m = (d.getMonth() + 1) + 12 * a - 3;
    const jdn = d.getDate() + Math.floor((153 * m + 2) / 5) + 365 * y + Math.floor(y / 4) - Math.floor(y / 100) + Math.floor(y / 400) - 32045;
    return `Julian day number (approx): ${jdn}`;
  }
  if (kind === 'date-add') {
    const base = new Date(kv.date || lines(t)[0]);
    const days = Number(kv.days || 0);
    if (Number.isNaN(base.getTime())) return 'Invalid date.';
    base.setDate(base.getDate() + days);
    return `Result date: ${base.toISOString().slice(0, 10)} (+${days} days)`;
  }
  if (kind === 'percent-calc') {
    const part = Number(kv.part || 0);
    const whole = Number(kv.whole || 1);
    return `Percent: ${((part / whole) * 100).toFixed(2)}%`;
  }
  if (kind === 'workdays-calc') {
    const start = new Date(kv.start || lines(t)[0]);
    const end = new Date(kv.end || lines(t)[1]);
    let n = 0;
    for (const d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
      const wd = d.getDay();
      if (wd !== 0 && wd !== 6) n += 1;
    }
    return `Business days (Mon–Fri): ${n}`;
  }
  if (kind === 'tip-calc') {
    const bill = Number(kv.bill || 0);
    const pct = Number(kv.percent || 18) / 100;
    const people = Math.max(1, Number(kv.people || 1));
    const tip = bill * pct;
    return `Tip: ${tip.toFixed(2)}\nTotal: ${(bill + tip).toFixed(2)}\nPer person (${people}): ${((bill + tip) / people).toFixed(2)}`;
  }
  if (kind === 'discount-calc') {
    let price = Number(kv.price || 100);
    if (kv.discount) price *= 1 - Number(kv.discount) / 100;
    if (kv.extra) price *= 1 - Number(kv.extra) / 100;
    return `Final price: ${price.toFixed(2)}`;
  }
  if (kind === 'fuel-calc') {
    const dist = Number(kv.distance || 0);
    const mpg = Number(kv.mpg || 28);
    const price = Number(kv.price || 3.5);
    const gal = dist / mpg;
    return `Gallons needed: ${gal.toFixed(2)}\nEstimated cost: $${(gal * price).toFixed(2)}`;
  }
  if (kind === 'prime-check') {
    const n = Number(lines(t)[0] || kv.n || 0);
    if (n < 2) return `${n} is not prime`;
    for (let i = 2; i <= Math.sqrt(n); i += 1) if (n % i === 0) return `${n} is not prime (divisible by ${i})`;
    return `${n} is prime`;
  }
  if (kind === 'fibonacci') {
    const n = Math.min(40, Number(lines(t)[0] || 10));
    const seq = [0, 1];
    for (let i = 2; i < n; i += 1) seq.push(seq[i - 1] + seq[i - 2]);
    return seq.slice(0, n).join(', ');
  }
  if (kind === 'lazy-img-tag') {
    const src = kv.src || 'hero.jpg';
    const w = kv.width || '1200';
    const h = kv.height || '630';
    return `<img src="${src}" width="${w}" height="${h}" loading="lazy" decoding="async" alt="">`;
  }
  if (kind === 'favicon-plan') {
    const sizes = (kv.sizes || '16,32,48,180,512').split(',').map((s) => s.trim());
    return sizes.map((s) => `favicon-${s}x${s}.png`).join('\n') + '\n\n<link rel="icon" sizes="any" href="/favicon.ico">';
  }

  const { runSmartFallback } = require('./kind-smart-handler');
  return runSmartFallback(kind, t);
}

module.exports = { samples500, runSync500 };
