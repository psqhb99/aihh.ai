/**
 * Hub (index.html) SEO builders — injected by build-matrix.js on npm run build.
 */
const { DOMAIN } = require('./tools-en-catalog');

const NAV_URL = `https://${DOMAIN}/`;

function slugifyCategory(name) {
  return String(name || 'tools')
    .replace(/&/g, 'and')
    .replace(/[^a-zA-Z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .toLowerCase();
}

function buildHubFaqs(toolCount) {
  return [
    {
      q: 'AIHH.ai 是什么？',
      a: `AIHH.ai 是免费在线工具导航站，收录 ${toolCount}+ 款浏览器内即可使用的实用工具，涵盖 JSON、SEO、PDF、图片、开发与办公等场景。`
    },
    {
      q: '需要注册或付费吗？',
      a: '不需要。工具页面免注册、免安装；核心功能对个人与商用均免费，打开子域页面即可使用。'
    },
    {
      q: '我的数据会上传到服务器吗？',
      a: '绝大多数工具在浏览器本地处理输入，不经过 AIHH.ai 服务器。请勿在工具中粘贴高度敏感密钥，并自行备份重要结果。'
    },
    {
      q: '如何快速找到工具？',
      a: '使用首页搜索框输入关键词（如 JSON、JWT、PDF），或按主分类、子分类筛选；也可在页面底部「完整工具目录」按分类浏览全部链接。'
    },
    {
      q: '收录了多少工具？会持续增加吗？',
      a: `当前目录已收录 ${toolCount} 个独立工具页，每个工具都有专属子域名与说明。我们会持续上新，目标是万级免费实用工具网络。`
    },
    {
      q: '工具页的 HTTPS 与域名如何配置？',
      a: '每个工具使用独立子页面（如 tool00001.aihh.ai），由 GitHub Pages 托管；DNS 指向 github.io 后由平台自动签发证书。'
    }
  ];
}

function buildHubHeadBlock(seo, toolCount) {
  const og = seo.ogImage;
  const title = seo.pageTitle;
  const desc = seo.metaDescription;
  const kw = seo.metaKeywords;
  const ogAlt = seo.ogImageAlt;
  return `    <title id="docTitle">${escapeHtml(title)}</title>
    <meta id="docDescription" name="description" content="${escapeHtml(desc)}">
    <meta name="keywords" content="${escapeHtml(kw)}">
    <meta name="author" content="AIHH.ai">
    <meta name="robots" content="index,follow,max-image-preview:large,max-snippet:-1,max-video-preview:-1">
    <meta name="googlebot" content="index,follow">
    <meta name="bingbot" content="index,follow">
    <meta name="theme-color" content="#071012">
    <link rel="canonical" href="${NAV_URL}">
    <link rel="alternate" hreflang="zh-CN" href="${NAV_URL}">
    <link rel="alternate" hreflang="x-default" href="${NAV_URL}">
    <link rel="sitemap" type="application/xml" title="Sitemap" href="${NAV_URL}sitemap.xml">
    <meta property="og:type" content="website">
    <meta property="og:site_name" content="${escapeHtml(seo.siteName || 'AIHH.ai')}">
    <meta property="og:locale" content="zh_CN">
    <meta property="og:title" content="${escapeHtml(title)}">
    <meta property="og:description" content="${escapeHtml(desc)}">
    <meta property="og:url" content="${NAV_URL}">
    <meta id="ogImage" property="og:image" content="${escapeHtml(og)}">
    <meta id="ogImageAlt" property="og:image:alt" content="${escapeHtml(ogAlt)}">
    <meta property="og:image:width" content="1200">
    <meta property="og:image:height" content="630">
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="${escapeHtml(title)}">
    <meta name="twitter:description" content="${escapeHtml(desc)}">
    <meta id="twitterImage" name="twitter:image" content="${escapeHtml(og)}">`;
}

function buildHubJsonGraph(siteBundle) {
  const seo = siteBundle.seo;
  const faqs = siteBundle.hubFaqs || [];
  const count = siteBundle.hubItemList.length;
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Organization',
        '@id': `${NAV_URL}#organization`,
        name: seo.siteName || 'AIHH.ai',
        url: NAV_URL,
        logo: seo.ogImage,
        description: seo.metaDescription
      },
      {
        '@type': 'WebSite',
        '@id': `${NAV_URL}#website`,
        name: seo.siteName || 'AIHH.ai',
        url: NAV_URL,
        description: seo.metaDescription,
        inLanguage: 'zh-CN',
        image: seo.ogImage,
        publisher: { '@id': `${NAV_URL}#organization` },
        potentialAction: {
          '@type': 'SearchAction',
          target: `${NAV_URL}?q={search_term_string}`,
          'query-input': 'required name=search_term_string'
        }
      },
      {
        '@type': 'WebPage',
        '@id': `${NAV_URL}#webpage`,
        url: NAV_URL,
        name: seo.pageTitle,
        description: seo.metaDescription,
        isPartOf: { '@id': `${NAV_URL}#website` },
        inLanguage: 'zh-CN',
        about: { '@id': `${NAV_URL}#toollist` }
      },
      {
        '@type': 'CollectionPage',
        '@id': `${NAV_URL}#collection`,
        name: 'AIHH.ai 免费在线工具目录',
        url: `${NAV_URL}#discover`,
        description: seo.matrixDescription || seo.metaDescription,
        isPartOf: { '@id': `${NAV_URL}#website` },
        numberOfItems: count
      },
      {
        '@type': 'BreadcrumbList',
        '@id': `${NAV_URL}#breadcrumb`,
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'AIHH.ai', item: NAV_URL },
          { '@type': 'ListItem', position: 2, name: '免费在线工具', item: `${NAV_URL}#discover` }
        ]
      },
      {
        '@type': 'FAQPage',
        '@id': `${NAV_URL}#faq`,
        mainEntity: faqs.map((f) => ({
          '@type': 'Question',
          name: f.q,
          acceptedAnswer: { '@type': 'Answer', text: f.a }
        }))
      },
      {
        '@type': 'ItemList',
        '@id': `${NAV_URL}#toollist`,
        name: 'AIHH.ai 免费在线工具',
        numberOfItems: count,
        itemListElement: siteBundle.hubItemList
      }
    ]
  };
}

function buildHubBreadcrumbHtml() {
  return `<nav class="hub-breadcrumb max-w-7xl mx-auto px-4 md:px-6 pt-2" aria-label="面包屑">
  <ol itemscope itemtype="https://schema.org/BreadcrumbList">
    <li itemprop="itemListElement" itemscope itemtype="https://schema.org/ListItem">
      <a itemprop="item" href="${NAV_URL}"><span itemprop="name">首页</span></a>
      <meta itemprop="position" content="1">
    </li>
    <li aria-hidden="true"> › </li>
    <li itemprop="itemListElement" itemscope itemtype="https://schema.org/ListItem">
      <a itemprop="item" href="${NAV_URL}#discover"><span itemprop="name">免费在线工具</span></a>
      <meta itemprop="position" content="2">
    </li>
  </ol>
</nav>`;
}

function buildHubFeaturedHtml(toolList) {
  const featured = toolList.filter((t) => Number(String(t.id).slice(4)) <= 24);
  const items = featured
    .map(
      (tool) =>
        `<li><a href="https://${tool.domain}/" title="${escapeHtml(tool.name)} — 免费在线使用">${escapeHtml(tool.name)}</a></li>`
    )
    .join('\n');
  return `<section id="hub-featured" class="hub-featured max-w-7xl mx-auto px-4 md:px-6 pb-6" aria-labelledby="featured-heading">
  <h2 id="featured-heading" class="tools-heading">常用工具直达</h2>
  <p class="tools-subline">高需求入口，无需搜索即可打开（完整目录见下方）。</p>
  <ul class="hub-featured-list">${items}</ul>
</section>`;
}

function buildHubFaqHtml(faqs) {
  const details = faqs
    .map(
      (f, i) =>
        `<details${i === 0 ? ' open' : ''}><summary>${escapeHtml(f.q)}</summary><p>${escapeHtml(f.a)}</p></details>`
    )
    .join('\n');
  return `<section id="hub-faq" class="hub-faq max-w-5xl mx-auto px-4 md:px-6 pb-12" aria-labelledby="hub-faq-title">
  <div class="prose-shell prose prose-invert max-w-none p-7 md:p-10">
    <h2 id="hub-faq-title">常见问题</h2>
    ${details}
  </div>
</section>`;
}

function buildHubFooterHtml(seo) {
  const year = new Date().getFullYear();
  return `<div class="footer-line mb-6"></div>
            <div class="text-center text-slate-500 text-sm hub-footer-inner" id="footerText">
                <p>${escapeHtml(seo.footerText || `© ${year} AIHH.ai · 免费在线工具箱`)}</p>
                <p class="mt-2 hub-footer-links">
                  <a href="${NAV_URL}#discover">浏览工具</a> ·
                  <a href="${NAV_URL}#tool-directory-crawl">完整目录</a> ·
                  <a href="${NAV_URL}#hub-faq">常见问题</a> ·
                  <a href="${NAV_URL}sitemap.xml">网站地图</a> ·
                  <a href="${NAV_URL}legal/terms.html">使用条款</a> ·
                  <a href="${NAV_URL}legal/privacy.html">隐私政策</a>
                </p>
            </div>`;
}

function buildHubCrawlSection(toolList) {
  const byCat = new Map();
  toolList.forEach((tool) => {
    if (!byCat.has(tool.category)) byCat.set(tool.category, []);
    byCat.get(tool.category).push(tool);
  });
  let html = `<section id="tool-directory-crawl" class="crawl-directory" aria-label="完整工具目录">\n`;
  html += `<h2>免费在线工具完整目录</h2>\n`;
  html += `<p>共 ${toolList.length} 个工具，按分类列出。每个链接指向独立工具页，支持搜索引擎收录与站内跳转。</p>\n`;
  html += `<p><a href="${NAV_URL}#discover">↑ 返回分类浏览与搜索</a></p>\n`;
  for (const [cat, items] of byCat.entries()) {
    const catId = slugifyCategory(cat);
    html += `<h3 id="cat-${catId}">${escapeHtml(cat)}</h3>\n<ul>\n`;
    items.forEach((tool) => {
      const blurb = (tool.description || '').slice(0, 140);
      html += `<li><a href="https://${tool.domain}/" title="${escapeHtml(tool.name)}">${escapeHtml(tool.name)}</a> — ${escapeHtml(tool.keywords[0] || tool.name)}${blurb ? `. ${escapeHtml(blurb)}` : ''}</li>\n`;
    });
    html += '</ul>\n';
  }
  html += '</section>';
  return html;
}

function escapeHtml(value) {
  return String(value ?? '').replace(/[&<>"']/g, (char) => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;'
  }[char]));
}

function patchHubHtmlBlocks(html, siteBundle, toolList) {
  const seo = siteBundle.seo;
  const count = siteBundle.hubItemList.length;
  const faqs = siteBundle.hubFaqs || buildHubFaqs(count);

  if (html.includes('<!-- HUB_HEAD_SEO_START -->')) {
    html = html.replace(
      /<!-- HUB_HEAD_SEO_START -->[\s\S]*?<!-- HUB_HEAD_SEO_END -->/,
      `<!-- HUB_HEAD_SEO_START -->\n${buildHubHeadBlock(seo, count)}\n    <!-- HUB_HEAD_SEO_END -->`
    );
  }

  const graph = siteBundle.hubJsonGraph || buildHubJsonGraph(siteBundle);
  html = html.replace(
    /<script type="application\/ld\+json" id="siteJsonLd">[\s\S]*?<\/script>/,
    `<script type="application/ld+json" id="siteJsonLd">${JSON.stringify(graph)}</script>`
  );

  const bc = buildHubBreadcrumbHtml();
  if (html.includes('<!-- HUB_BREADCRUMB_START -->')) {
    html = html.replace(
      /<!-- HUB_BREADCRUMB_START -->[\s\S]*?<!-- HUB_BREADCRUMB_END -->/,
      `<!-- HUB_BREADCRUMB_START -->\n${bc}\n<!-- HUB_BREADCRUMB_END -->`
    );
  } else {
    html = html.replace('<header class="site-hero', `${bc}\n\n    <header class="site-hero`);
  }

  const feat = buildHubFeaturedHtml(toolList);
  if (html.includes('<!-- HUB_FEATURED_START -->')) {
    html = html.replace(
      /<!-- HUB_FEATURED_START -->[\s\S]*?<!-- HUB_FEATURED_END -->/,
      `<!-- HUB_FEATURED_START -->\n${feat}\n<!-- HUB_FEATURED_END -->`
    );
  }

  const faqBlock = buildHubFaqHtml(faqs);
  if (html.includes('<!-- HUB_FAQ_START -->')) {
    html = html.replace(
      /<!-- HUB_FAQ_START -->[\s\S]*?<!-- HUB_FAQ_END -->/,
      `<!-- HUB_FAQ_START -->\n${faqBlock}\n<!-- HUB_FAQ_END -->`
    );
  }

  const crawl = buildHubCrawlSection(toolList);
  if (html.includes('<!-- CRAWL_LINKS_START -->')) {
    html = html.replace(
      /<!-- CRAWL_LINKS_START -->[\s\S]*?<!-- CRAWL_LINKS_END -->/,
      `<!-- CRAWL_LINKS_START -->\n${crawl}\n<!-- CRAWL_LINKS_END -->`
    );
  }

  const footer = buildHubFooterHtml(seo);
  if (html.includes('<!-- HUB_FOOTER_START -->')) {
    html = html.replace(
      /<!-- HUB_FOOTER_START -->[\s\S]*?<!-- HUB_FOOTER_END -->/,
      `<!-- HUB_FOOTER_START -->\n${footer}\n            <!-- HUB_FOOTER_END -->`
    );
  }

  return html;
}

module.exports = {
  NAV_URL,
  buildHubFaqs,
  buildHubHeadBlock,
  buildHubJsonGraph,
  buildHubBreadcrumbHtml,
  buildHubFeaturedHtml,
  buildHubFaqHtml,
  buildHubFooterHtml,
  buildHubCrawlSection,
  patchHubHtmlBlocks,
  escapeHtml
};
