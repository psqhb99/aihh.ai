const fs = require('fs/promises');
const fsSync = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const { buildToolsList, DOMAIN } = require('./tools-en-catalog');
const {
  cardImageFileName,
  buildCardSvg,
  buildDirectoryOgSvg,
  buildHubCardFields
} = require('./hub-seo');
const {
  NAV_URL,
  buildHubFaqs,
  buildHubJsonGraph,
  patchHubHtmlBlocks
} = require('./hub-seo-build');
let tools = buildToolsList();

function buildToolFaqs(tool) {
  if (tool.faqs && tool.faqs.length) return tool.faqs;
  return [
    { q: `Is ${tool.name} free?`, a: `Yes. ${tool.name} is free to use with no account.` },
    { q: `Does ${tool.name} upload my data?`, a: 'No. Processing runs locally in your browser unless you copy results elsewhere.' },
    { q: 'What input format works?', a: `${tool.functions[0]}. Use Load sample to see a working example.` },
    { q: 'Output looks wrong?', a: 'Compare your input to the sample format, adjust, and run again.' }
  ];
}

function buildFaqHtml(faqs) {
  return faqs.map((f, i) => `<details${i === 0 ? ' open' : ''}><summary>${escapeHtml(f.q)}</summary><p>${escapeHtml(f.a)}</p></details>`).join('');
}

function buildToolJsonLd(tool, hub) {
  const url = `https://${tool.domain}/`;
  const faqs = buildToolFaqs(tool);
  const catAnchor = `${NAV_URL}#discover`;
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebPage',
        '@id': `${url}#webpage`,
        url,
        name: tool.title,
        description: tool.description,
        inLanguage: 'en',
        isPartOf: { '@id': `${NAV_URL}#website` }
      },
      {
        '@type': 'WebApplication',
        '@id': `${url}#app`,
        name: tool.name,
        url,
        image: hub.cardImageUrl,
        description: tool.description,
        applicationCategory: tool.category,
        operatingSystem: 'Any',
        browserRequirements: 'Requires JavaScript',
        offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' }
      },
      {
        '@type': 'FAQPage',
        '@id': `${url}#faq`,
        mainEntity: faqs.map((f) => ({
          '@type': 'Question',
          name: f.q,
          acceptedAnswer: { '@type': 'Answer', text: f.a }
        }))
      },
      {
        '@type': 'BreadcrumbList',
        '@id': `${url}#breadcrumb`,
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'AIHH.ai', item: NAV_URL },
          { '@type': 'ListItem', position: 2, name: tool.category, item: catAnchor },
          { '@type': 'ListItem', position: 3, name: tool.name, item: url }
        ]
      }
    ]
  };
}

async function patchHubIndex(siteBundle) {
  const indexPath = path.join(ROOT, 'index.html');
  let html = await fs.readFile(indexPath, 'utf8');
  html = patchHubHtmlBlocks(html, siteBundle, tools);
  await write(indexPath, html);
}

// English catalog: scripts/tools-en-catalog.js

function escapeHtml(value) {
  return String(value ?? '').replace(/[&<>"']/g, (char) => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;'
  }[char]));
}

function jsString(value) {
  return JSON.stringify(value).replace(/</g, '\\u003c');
}

function buildToolHtml(tool, related) {
  const url = `https://${tool.domain}/`;
  const hub = buildHubCardFields(tool);
  const faqs = buildToolFaqs(tool);
  const relatedLinks = related.map((item) => `<a href="https://${item.domain}/">${escapeHtml(item.name)}</a>`).join('');
  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${escapeHtml(tool.title)}</title>
  <meta name="description" content="${escapeHtml(tool.description)}">
  <meta name="keywords" content="${escapeHtml(tool.keywords.join(','))}">
  <meta name="robots" content="index,follow,max-image-preview:large">
  <meta name="author" content="AIHH.ai">
  <link rel="canonical" href="${url}">
  <link rel="sitemap" type="application/xml" href="${url}sitemap.xml">
  <meta property="og:type" content="website">
  <meta property="og:locale" content="en_US">
  <meta property="og:site_name" content="AIHH.ai">
  <meta property="og:title" content="${escapeHtml(tool.title)}">
  <meta property="og:description" content="${escapeHtml(tool.description)}">
  <meta property="og:url" content="${url}">
  <meta property="og:image" content="${hub.cardImageUrl}">
  <meta property="og:image:alt" content="${escapeHtml(hub.cardImageAlt)}">
  <meta property="og:image:width" content="128">
  <meta property="og:image:height" content="128">
  <meta name="twitter:card" content="summary">
  <meta name="twitter:title" content="${escapeHtml(tool.title)}">
  <meta name="twitter:description" content="${escapeHtml(tool.description)}">
  <meta name="twitter:image" content="${hub.cardImageUrl}">
  <meta name="twitter:image:alt" content="${escapeHtml(hub.cardImageAlt)}">
  <link rel="stylesheet" href="style.css">
  <script type="application/ld+json">${JSON.stringify(buildToolJsonLd(tool, hub))}</script>
</head>
<body>
  <header class="site-header">
    <a class="brand" href="${NAV_URL}">AIHH.ai</a>
    <nav><a href="${NAV_URL}">All tools</a><a href="${NAV_URL}#tool-directory-crawl">Directory</a><a href="#faq">FAQ</a></nav>
  </header>
  <nav class="breadcrumb" aria-label="Breadcrumb">
    <a href="${NAV_URL}">AIHH.ai</a> › <a href="${NAV_URL}#discover">${escapeHtml(tool.category)}</a> › <span>${escapeHtml(tool.name)}</span>
  </nav>
  <main>
    <section class="hero">
      <p class="eyebrow">${escapeHtml(tool.id)} · ${escapeHtml(tool.category)} / ${escapeHtml(tool.subcategory)}</p>
      <h1>${escapeHtml(tool.name)}</h1>
      <p class="lead">${escapeHtml(tool.description)}</p>
      <div class="chips">${tool.keywords.map((k) => `<span>${escapeHtml(k)}</span>`).join('')}</div>
    </section>
    <section class="tool-panel" aria-label="${escapeHtml(tool.name)}">
      <div class="panel-head">
        <h2>Run online</h2>
        <div class="actions">
          <button id="sampleBtn" type="button">Load sample</button>
          <button id="runBtn" type="button">Run</button>
          <button id="copyBtn" type="button">Copy result</button>
          <button id="clearBtn" type="button">Clear</button>
        </div>
      </div>
      <label for="inputText">Input</label>
      <textarea id="inputText" spellcheck="false" placeholder="${escapeHtml(tool.inputPlaceholder || 'Paste content to process')}"></textarea>
      <label for="outputText">Output</label>
      <textarea id="outputText" spellcheck="false" readonly></textarea>
      <p id="status" class="status">Processed locally in your browser. Nothing is uploaded.</p>
    </section>
    ${tool.exampleInput ? `<section class="examples" aria-label="Example">
      <h2>Example</h2>
      <div class="example-grid">
        <div><h3>Sample input</h3><pre class="example-pre">${escapeHtml(tool.exampleInput)}</pre></div>
        <div><h3>Sample output</h3><pre class="example-pre">${escapeHtml(tool.exampleOutput || 'Click Run to generate output.')}</pre></div>
      </div>
    </section>` : ''}
    <section class="content-grid">
      <article>
        <h2>What problem it solves</h2>
        <p>${escapeHtml(tool.pain)}</p>
      </article>
      <article>
        <h2>Key features</h2>
        <ul>${tool.functions.map((item) => `<li>${escapeHtml(item)}</li>`).join('')}</ul>
      </article>
      <article>
        <h2>How to use</h2>
        <ol>${(tool.howToSteps || ['Paste or type your input.', 'Click Run and review the output.', 'Copy the result into your workflow.']).map((s) => `<li>${escapeHtml(s)}</li>`).join('')}</ol>
      </article>
      <article>
        <h2>Privacy</h2>
        <p>This is a client-side tool. Input is processed only in your browser unless you copy it elsewhere. AIHH.ai does not receive your content.</p>
      </article>
    </section>
    ${tool.disclaimer ? `<section class="disclaimer"><p><strong>Note:</strong> ${escapeHtml(tool.disclaimer)}</p></section>` : ''}
    <section id="faq" class="faq">
      <h2>FAQ</h2>
      ${buildFaqHtml(faqs)}
    </section>
    <section class="related">
      <h2>Related tools</h2>
      <div>${relatedLinks}</div>
    </section>
  </main>
  <footer>© 2026 AIHH.ai · <a href="${NAV_URL}">Tool directory</a> · <a href="${NAV_URL}#tool-directory-crawl">All tools</a> · <a href="${NAV_URL}legal/terms.html">Terms</a> · <a href="${NAV_URL}legal/privacy.html">Privacy</a></footer>
  <script>
    window.TOOL_CONFIG = ${jsString(tool)};
  </script>
  <script src="app.js"></script>
</body>
</html>
`;
}

function buildToolJs() {
  return fsSync.readFileSync(path.join(__dirname, 'tool-runtime.js'), 'utf8');
}

function buildCss() {
  return `:root{color-scheme:dark;--bg:#071012;--panel:#102022;--ink:#eef7f2;--muted:#9bb1aa;--line:#254144;--brand:#64f4c4;--accent:#ffd166;--bad:#ff8a8a}*{box-sizing:border-box}body{margin:0;font-family:Inter,ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",Arial,sans-serif;background:radial-gradient(circle at top left,#17362f,#071012 38%),var(--bg);color:var(--ink)}a{color:inherit}.site-header{position:sticky;top:0;z-index:5;display:flex;align-items:center;justify-content:space-between;gap:16px;padding:16px 5vw;background:rgba(7,16,18,.86);backdrop-filter:blur(14px);border-bottom:1px solid var(--line)}.brand{font-weight:900;color:var(--brand);text-decoration:none;letter-spacing:.02em}nav{display:flex;gap:14px;color:var(--muted);font-size:14px;flex-wrap:wrap}.breadcrumb{width:min(1120px,92vw);margin:12px auto 0;padding:0 5vw;font-size:13px;color:var(--muted)}.breadcrumb a{color:var(--brand);text-decoration:none}.breadcrumb a:hover{text-decoration:underline}.breadcrumb span{color:var(--ink)}main{width:min(1120px,92vw);margin:0 auto}.hero{padding:58px 0 30px}.eyebrow{color:var(--brand);font-size:13px;text-transform:uppercase;letter-spacing:.08em}.hero h1{font-size:clamp(34px,6vw,68px);line-height:1.02;margin:12px 0 18px;letter-spacing:0}.lead{max-width:760px;color:#c8d8d3;font-size:18px;line-height:1.8}.chips{display:flex;flex-wrap:wrap;gap:10px;margin-top:22px}.chips span,.related a{border:1px solid var(--line);background:rgba(16,32,34,.72);border-radius:999px;padding:8px 12px;color:#cde9df;text-decoration:none}.tool-panel,.content-grid article,.faq,.related{background:rgba(16,32,34,.86);border:1px solid var(--line);border-radius:8px;padding:22px;box-shadow:0 20px 60px rgba(0,0,0,.22)}.panel-head{display:flex;justify-content:space-between;gap:16px;align-items:center;flex-wrap:wrap}.panel-head h2{margin:0}.actions{display:flex;gap:10px;flex-wrap:wrap}button{border:0;background:var(--brand);color:#06201a;padding:10px 14px;border-radius:6px;font-weight:800;cursor:pointer}button:nth-child(3),button:nth-child(4){background:#21383a;color:var(--ink);border:1px solid var(--line)}label{display:block;margin:16px 0 8px;color:#d8ede6;font-weight:700}textarea{width:100%;min-height:190px;resize:vertical;background:#061012;color:var(--ink);border:1px solid var(--line);border-radius:8px;padding:14px;font:14px/1.6 ui-monospace,SFMono-Regular,Consolas,monospace}#outputText{min-height:210px}.status{color:var(--brand);min-height:24px}.status.bad{color:var(--bad)}.content-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:18px;margin:22px 0}.content-grid h2,.faq h2,.related h2{margin-top:0}.content-grid p,.content-grid li,.faq p{color:#c8d8d3;line-height:1.75}.faq details{border-top:1px solid var(--line);padding:14px 0}.faq summary{cursor:pointer;font-weight:800}.examples{margin:22px 0;background:rgba(16,32,34,.86);border:1px solid var(--line);border-radius:8px;padding:22px}.examples h2{margin-top:0}.example-grid{display:grid;grid-template-columns:1fr 1fr;gap:16px}@media(max-width:760px){.example-grid{grid-template-columns:1fr}}.example-pre{background:#061012;border:1px solid var(--line);border-radius:6px;padding:12px;font:13px/1.5 ui-monospace,monospace;white-space:pre-wrap;word-break:break-word;color:#cde9df;max-height:220px;overflow:auto}.examples h3{font-size:14px;color:var(--brand);margin:0 0 8px}.related{margin:22px 0 48px}.related div{display:flex;gap:10px;flex-wrap:wrap}.disclaimer{margin:0 0 18px;padding:16px 20px;border:1px solid var(--line);border-radius:8px;background:rgba(255,209,102,.08);color:#e8dcc0;font-size:14px;line-height:1.6}footer{padding:34px 5vw;color:var(--muted);text-align:center;border-top:1px solid var(--line)}footer a{color:var(--brand)}@media(max-width:760px){.content-grid{grid-template-columns:1fr}.site-header{align-items:flex-start;flex-direction:column}.hero{padding-top:34px}.actions{width:100%}button{flex:1 1 130px}}`;
}

function buildReadme(tool) {
  return `# ${tool.id} - ${tool.name}

Live URL: \`https://${tool.domain}/\`

## Purpose
${tool.pain}

## Target keywords
${tool.keywords.map((k) => `- ${k}`).join('\n')}

## Deploy (GitHub Pages)
1. Create repo \`${tool.id}\`
2. Upload all files in this folder to repo root
3. Enable Pages: \`main\` / root
4. DNS CNAME: \`${tool.id}\` → \`<username>.github.io\`
5. Custom domain: \`${tool.domain}\`
`;
}

function buildMainSite() {
  const cards = tools.map((tool) => `<article class="card"><p>${escapeHtml(tool.id)} · ${escapeHtml(tool.category)}</p><h2>${escapeHtml(tool.name)}</h2><p>${escapeHtml(tool.description)}</p><a href="https://${tool.domain}/">Open tool</a></article>`).join('\n');
  return `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>AIHH.ai | 100 Free Online Tools</title><meta name="description" content="AIHH.ai lists 100 useful browser-based tools for developers, SEO, office work, privacy, and productivity."><link rel="canonical" href="${NAV_URL}"><style>${buildCss()} .grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(260px,1fr));gap:18px}.card{background:rgba(16,32,34,.86);border:1px solid var(--line);border-radius:8px;padding:18px}.card p{color:var(--muted);line-height:1.6}.card a{display:inline-block;margin-top:8px;color:var(--brand);font-weight:800}</style></head><body><header class="site-header"><a class="brand" href="/">AIHH.ai</a><nav><a href="#tools">100 Tools</a></nav></header><main><section class="hero"><p class="eyebrow">AIHH.ai Tool Matrix</p><h1>100 free, useful web tools</h1><p class="lead">Client-side utilities with SEO-friendly pages—built to scale toward a larger tool network.</p></section><section id="tools" class="grid">${cards}</section></main><footer>© 2026 AIHH.ai</footer></body></html>`;
}

function buildSiteData() {
  const catMap = new Map();
  for (const tool of tools) {
    if (!catMap.has(tool.category)) catMap.set(tool.category, new Map());
    const subMap = catMap.get(tool.category);
    if (!subMap.has(tool.subcategory)) subMap.set(tool.subcategory, []);
    subMap.get(tool.subcategory).push({
      id: tool.id,
      name: tool.name,
      desc: tool.description,
      url: `https://${tool.domain}/`,
      domain: tool.domain,
      title: tool.title,
      metaDescription: tool.description,
      canonical: `https://${tool.domain}/`,
      seoTag: tool.keywords[0],
      keywords: tool.keywords.join(','),
      featured: Number(tool.id.slice(4)) <= 12,
      enabled: true,
      ...buildHubCardFields(tool)
    });
  }
  const count = tools.length;
  const ogImageUrl = `${NAV_URL}assets/hub/og/aihh-tool-directory-${count}-tools.svg`;
  const hubFaqs = buildHubFaqs(count);
  const bundle = {
    hubItemList: tools.map((tool, index) => {
      const hub = buildHubCardFields(tool);
      return {
        '@type': 'ListItem',
        position: index + 1,
        name: tool.name,
        url: `https://${tool.domain}/`,
        image: hub.cardImageUrl
      };
    }),
    seo: {
      siteName: 'AIHH.ai',
      pageTitle: 'AIHH.ai | 免费在线工具 — JSON、SEO、PDF、开发、办公',
      metaDescription:
        'AIHH.ai 免费在线工具箱：JSON、SEO、PDF、图片、开发、办公与隐私工具，浏览器内即用，免注册、免安装，粘贴即得结果。',
      metaKeywords:
        'AIHH.ai,免费在线工具,JSON格式化,SEO工具,PDF工具,图片转换,开发者工具,免注册',
      ogImage: ogImageUrl,
      ogImageAlt: 'AIHH.ai — 免费在线工具箱，工作与生活常用工具一站搞定',
      navPill: '免费工具箱',
      heroBadge: '永久免费 · 免注册 · 浏览器本地运行',
      heroTitle: '免费在线工具箱',
      heroHighlight: '打开即用，专注干活',
      heroDescription:
        '不用再在一堆网站里翻来翻去。AIHH.ai 把 JSON、SEO、PDF、图片、表格和隐私相关工具收进一处：点开页面、粘贴内容、复制结果。能本地算就在本地算，数据留在你这边；日常用法不收钱、不装软件、不建账号。我们会持续上新，朝万级免费工具网迈进——学的是日活百万级免费工具站：快、清楚、真能跑。',
      heroTags: [
        '秒出结果',
        '完全免费',
        '本地处理更安心',
        '免注册',
        '开发 · SEO · 办公',
        '持续上新'
      ],
      siteStatLine: '搜索或按分类浏览，一点即开',
      matrixDescription: '开发、SEO、办公、内容、设计、隐私与效率工具，按分类整理。',
      mainCategoryTitle: '按分类浏览',
      mainCategoryDesc: '先选场景，再用子分类或搜索缩小范围。',
      subCategoryTitle: '子分类',
      subCategoryAllDesc: '显示全部分类下的子类。',
      subCategoryFilteredDesc: '当前主分类下的子类。',
      resultPanelEyebrow: '筛选结果',
      resultPanelTitle: '匹配的工具',
      resultPanelTemplate: '当前筛选匹配 {count} 个工具',
      recommendedEyebrow: '推荐',
      recommendedTitle: '常用工具',
      recommendedDesc: '开发与 SEO 场景里用得最多的入口。',
      emptyText: '没有匹配项，换个分类或更宽的关键词试试。',
      footerText: '© 2026 AIHH.ai · 免费在线工具箱',
      articleSections: [
        {
          title: '为什么大家会收藏 AIHH.ai',
          content:
            '高流量工具站的共性很简单：一个搜索框、分类一眼就懂、功能第一次就能用。我们按这个标准做——少找得多干。'
        },
        {
          title: '在这里能做什么',
          content:
            '开发同学格式化 JSON、排查接口；运营检查标题、生成 UTM；设计缩放图片、取色；办公清洗 CSV 和 PDF；学生换算单位、润色文案——都不用注册。'
        },
        {
          title: '对你免费，为规模化而搭',
          content:
            '核心工具个人与商用都免费。目录持续扩充，目标是万级免费实用页——体验对齐你已经习惯的大站：快加载、功能实在、不搞套路。'
        },
        {
          title: '隐私优先',
          content:
            '能在浏览器完成的就不上传。草稿、客户资料、一次性小修不会落到别人服务器上，用起来也更像「即时完成」。'
        },
        {
          title: 'SEO 与收录说明',
          content:
            '本站提供完整 HTML 工具目录、sitemap.xml、结构化数据（WebSite、ItemList、FAQ）及每个工具的独立子域页面，便于搜索引擎发现与收录。'
        }
      ]
    },
    hubFaqs,
    ui: { homepage: { pageSize: 16 }, announcements: [], carousels: [] },
    categories: Array.from(catMap.entries()).map(([catName, subMap]) => ({
      id: catName.replace(/\s+/g, '-').toLowerCase(),
      name: catName,
      subcategories: Array.from(subMap.entries()).map(([subName, items]) => ({
        id: subName.replace(/\s+/g, '-').toLowerCase(),
        name: subName,
        tools: items
      }))
    }))
  };
  bundle.hubJsonGraph = buildHubJsonGraph(bundle);
  return bundle;
}

function buildSeoMap() {
  return tools.map((tool) => ({
    id: tool.id,
    domain: tool.domain,
    url: `https://${tool.domain}/`,
    title: tool.title,
    metaDescription: tool.description,
    canonical: `https://${tool.domain}/`,
    keywords: tool.keywords,
    category: tool.category,
    subcategory: tool.subcategory,
    repository: tool.id,
    localPreview: `/tools/${tool.id}.${DOMAIN}/`
  }));
}

async function write(file, content) {
  await fs.mkdir(path.dirname(file), { recursive: true });
  await fs.writeFile(file, content, 'utf8');
}

function buildLegalPage(title, slug, bodyHtml) {
  return `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${escapeHtml(title)} | AIHH.ai</title><meta name="robots" content="noindex,follow"><link rel="canonical" href="${NAV_URL}legal/${slug}.html"><style>body{font-family:system-ui,sans-serif;max-width:720px;margin:40px auto;padding:0 20px;line-height:1.7;color:#1a2a24;background:#f4faf7}a{color:#0d6b52}</style></head><body><p><a href="${NAV_URL}">← AIHH.ai directory</a></p><h1>${escapeHtml(title)}</h1>${bodyHtml}<p><small>Last updated: ${new Date().toISOString().slice(0, 10)}</small></p></body></html>`;
}

async function writeLegalPages() {
  await write(path.join(ROOT, 'legal', 'terms.html'), buildLegalPage('Terms of Use', 'terms', `<p>AIHH.ai provides free browser-based utilities. By using the site you agree that tools are offered as-is, outputs are for informational purposes, and you are responsible for verifying results before business, medical, legal, or financial decisions.</p><p>You may link to and use tool outputs in commercial projects. Do not scrape the directory in a way that harms service availability.</p>`));
  await write(path.join(ROOT, 'legal', 'privacy.html'), buildLegalPage('Privacy Policy', 'privacy', `<p>Tool pages process input locally in your browser. AIHH.ai does not require accounts for normal use and does not intend to collect pasted tool input on these static pages.</p><p>Hosting/CDN logs (IP, user agent, URL) may be collected by your infrastructure provider. Contact the site operator for data requests related to analytics you enable separately.</p>`));
}

async function writeHubAssets() {
  const toolsDir = path.join(ROOT, 'assets', 'hub', 'tools');
  const ogDir = path.join(ROOT, 'assets', 'hub', 'og');
  await fs.mkdir(toolsDir, { recursive: true });
  await fs.mkdir(ogDir, { recursive: true });
  for (const tool of tools) {
    const file = cardImageFileName(tool);
    await write(path.join(toolsDir, file), buildCardSvg(tool));
  }
  const ogName = `aihh-tool-directory-${tools.length}-tools.svg`;
  await write(path.join(ogDir, ogName), buildDirectoryOgSvg(tools.length));
  console.log(`Hub SEO assets: ${tools.length} card SVGs + 1 OG SVG (${ogName}).`);
}

async function main() {
  tools = buildToolsList();
  await writeHubAssets();
  await write(path.join(ROOT, 'data', 'tools.json'), JSON.stringify(tools, null, 2));
  await write(path.join(ROOT, 'data', 'seo-map.json'), JSON.stringify(buildSeoMap(), null, 2));
  await write(path.join(ROOT, 'data', 'categories.json'), JSON.stringify(buildSiteData().categories, null, 2));
  await write(path.join(ROOT, 'storage', 'site-data.txt'), JSON.stringify(buildSiteData(), null, 2));
  const siteBundle = buildSiteData();
  const siteJson = JSON.stringify(siteBundle, null, 2);
  await write(path.join(ROOT, 'data.json'), siteJson);
  await write(
    path.join(ROOT, 'site-data.js'),
    `/* Generated by npm run build — enables file:// preview of index.html */\nwindow.AIHH_SITE_DATA = ${siteJson};\n`
  );
  await patchHubIndex(siteBundle);
  await writeLegalPages();

  const toolUrls = tools.map((tool) => `https://${tool.domain}/`);
  const sitemapUrls = [`${NAV_URL}`, ...toolUrls];
  const sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${sitemapUrls.map((url) => `  <url><loc>${url}</loc><lastmod>${new Date().toISOString().slice(0, 10)}</lastmod><changefreq>weekly</changefreq><priority>${url === NAV_URL ? '1.0' : '0.8'}</priority></url>`).join('\n')}\n</urlset>\n`;
  await write(path.join(ROOT, 'sitemap.xml'), sitemapXml);
  await write(
    path.join(ROOT, 'robots.txt'),
    `User-agent: *\nAllow: /\nDisallow: /private/\n\nSitemap: ${NAV_URL}sitemap.xml\n`
  );
  await write(path.join(ROOT, 'CNAME'), `${DOMAIN}\n`);
  await write(path.join(ROOT, '.nojekyll'), '\n');
  await write(path.join(ROOT, 'main-site', 'index.html'), buildMainSite());
  await write(path.join(ROOT, 'templates', 'single-tool', 'style.css'), buildCss());
  await write(path.join(ROOT, 'templates', 'single-tool', 'app.js'), buildToolJs());
  await write(path.join(ROOT, 'docs', '00-project-vision.md'), `# AIHH.ai tool network vision\n\nAIHH.ai is not a pile of thin pages—it is a low-cost pipeline to ship useful, original, SEO-friendly browser tools.\n\n## Current phase\n\nShip 100 focused single-page tools: each solves one job, runs client-side, and includes crawlable copy, FAQ, privacy notes, canonical, sitemap, robots, and a link back to the directory.\n\n## Long term\n\nAfter indexing, usage, and monetization validate the first 100, reuse the same catalog, templates, and QA scripts to scale toward 1,000 and 10,000 tools.\n`);
  await write(path.join(ROOT, 'docs', '01-demand-research.md'), `# Research: 100 tool ideas\n\n## Selection criteria\n\n- Real daily tasks from dev, SEO, ops, office work, privacy, and content workflows.\n- Single-page feasible: HTML/CSS/JS only, no login or server storage.\n- SEO-friendly: clear keywords, unique title/description, how-to, and FAQ.\n- Original code: generated from AIHH templates, not copied third-party apps.\n- No empty shells: every page must process input and return output.\n\n## Community signal (summary)\n\nDevelopers repeatedly ask for local JSON/JWT/regex/CSV utilities, lightweight SEO checks, and sitemap/robots helpers—preferring no signup, no upload, instant results.\n\n## Full list\n\n${tools.map((tool) => `### ${tool.id} ${tool.name}\n\n- Category: ${tool.category} / ${tool.subcategory}\n- Keywords: ${tool.keywords.join(', ')}\n- Audience: ${tool.audience}\n- Pain: ${tool.pain}\n- Features: ${tool.functions.join(', ')}\n- URL: https://${tool.domain}/\n`).join('\n')}`);
  await write(path.join(ROOT, 'docs', '02-tool-specs.md'), `# Single-tool package spec\n\nEach tool folder must include:\n\n- index.html\n- style.css\n- app.js\n- README.md\n- robots.txt\n- sitemap.xml\n- CNAME\n\nEach page must include: unique title, meta description, canonical, Open Graph, JSON-LD, H1, working UI, how-to, FAQ, privacy section, related tools, and a link back to AIHH.ai.\n`);
  await write(path.join(ROOT, 'docs', '03-seo-standard.md'), `# SEO standard\n\n1. Title includes tool name and primary keyword.\n2. Description explains input, output, use case, and client-side privacy.\n3. Canonical points to the tool subdomain.\n4. Sitemap lists canonical URLs only.\n5. robots.txt references the sitemap.\n6. Body includes H1, H2, FAQ, and privacy copy.\n7. Directory links to tools; tools link back—internal link loop.\n8. No hidden text, stuffing, or non-functional pages.\n`);
  await write(path.join(ROOT, 'docs', '04-deployment-guide.md'), `# Deployment guide\n\n1. Upload each tool folder to a matching GitHub repo.\n2. Enable GitHub Pages: \`main\` / root.\n3. DNS CNAME: \`toolxxxxx\` → your \`*.github.io\` host.\n4. Repo root \`CNAME\` file: \`toolxxxxx.aihh.ai\`.\n5. Submit sitemap in Google Search Console after deploy.\n`);
  await write(path.join(ROOT, 'docs', '05-quality-checklist.md'), `# Quality checklist\n\n- Tool page loads\n- Sample input runs\n- Output can be copied\n- title / description / canonical present\n- H1, H2, FAQ, privacy section present\n- robots.txt and sitemap.xml present\n- CNAME matches folder domain\n- Link back to AIHH.ai present\n- No copied third-party source\n`);

  await write(path.join(ROOT, 'docs', '06-deployment-manifest.md'), `# Deployment manifest (${tools.length} tools)

Use this table to create repos, bind subdomains, and verify SEO titles and descriptions. Repo names should match tool IDs, e.g. \`tool00001\`.

| ID | Repo | Subdomain | SEO Title | Meta Description |
|---|---|---|---|---|
${tools.map((tool) => `| ${tool.id} | ${tool.id} | ${tool.domain} | ${tool.title.replace(/\|/g, '/')} | ${tool.description.replace(/\|/g, '/')} |`).join('\n')}
`);

  for (let i = 0; i < tools.length; i += 1) {
    const tool = tools[i];
    const dir = path.join(ROOT, 'tools', `${tool.id}.${DOMAIN}`);
    const related = tools.filter((item) => item.category === tool.category && item.id !== tool.id).slice(0, 4);
    await write(path.join(dir, 'index.html'), buildToolHtml(tool, related));
    await write(path.join(dir, 'style.css'), buildCss());
    await write(path.join(dir, 'app.js'), buildToolJs());
    await write(path.join(dir, 'README.md'), buildReadme(tool));
    await write(path.join(dir, 'CNAME'), tool.domain + '\n');
    await write(path.join(dir, 'robots.txt'), `User-agent: *\nAllow: /\nSitemap: https://${tool.domain}/sitemap.xml\n`);
    await write(path.join(dir, 'sitemap.xml'), `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n  <url><loc>https://${tool.domain}/</loc><lastmod>${new Date().toISOString().slice(0, 10)}</lastmod><priority>0.8</priority></url>\n</urlset>\n`);
  }

  console.log(`Generated ${tools.length} tools.`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
