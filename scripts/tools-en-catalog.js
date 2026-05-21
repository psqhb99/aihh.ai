const DOMAIN = 'aihh.ai';

function spec(id, name, category, subcategory, kind, keywords, pain, functions, audience = 'developers, site owners, and power users') {
  const num = String(id).padStart(5, '0');
  const kw = keywords.slice(0, 3).join(', ');
  return {
    id: `tool${num}`,
    domain: `tool${num}.${DOMAIN}`,
    name,
    category,
    subcategory,
    kind,
    keywords,
    pain,
    functions,
    audience,
    title: `${name} - Free Online Tool | AIHH.ai`,
    description: `${name} for ${audience}. Handle ${kw} in the browser—no upload, no signup.`
  };
}

function buildToolsList() {
  const tools = [
    spec(1, 'JSON Formatter, Minify & Validator', 'Development & Data', 'JSON & Structured Data', 'json-format', ['json formatter', 'json validator', 'json minify'], 'API responses and config JSON are hard to read and errors are unclear.', ['Pretty print', 'Minify', 'Sort keys', 'Syntax errors']),
    spec(2, 'Webhook HMAC Signature Generator', 'Development & Data', 'API Debugging', 'hmac', ['webhook signature', 'hmac sha256', 'verify webhook'], 'Callback signature strings and digest algorithms are easy to get wrong.', ['HMAC-SHA256', 'HMAC-SHA1', 'Base string', 'Hex output']),
    spec(3, 'Timestamp Batch Converter', 'Development & Data', 'Time & Encoding', 'timestamp', ['unix timestamp', 'epoch converter', 'iso time'], 'Seconds, milliseconds, ISO, and local time get mixed in logs.', ['Second/ms detect', 'ISO convert', 'Local display', 'Batch lines']),
    spec(4, 'HTTP Security Header Checker', 'Development & Data', 'API Debugging', 'header-audit', ['security headers', 'csp checker', 'hsts check'], 'You are not sure which security headers are missing before launch.', ['CSP check', 'HSTS check', 'CORS warnings', 'Fix hints']),
    spec(5, 'JWT Expiry Visualizer', 'Development & Data', 'API Debugging', 'jwt', ['jwt decoder', 'jwt exp', 'token payload'], 'JWT payloads and exp/iat fields are hard to read quickly.', ['Local decode', 'Time fields', 'Risk hints', 'Copy payload']),
    spec(6, 'URL Query Parameter Diff', 'Development & Data', 'URL & Requests', 'url-diff', ['url compare', 'query diff', 'utm compare'], 'Hard to spot missing or changed params across redirect chains.', ['Two URL diff', 'Missing keys', 'Value changes', 'Table output']),
    spec(7, 'Regex Line Extractor & Deduper', 'Development & Data', 'Text Extraction', 'regex-extract', ['regex extract', 'log parser', 'line match'], 'Extracting matches from logs or lists requires throwaway scripts.', ['Regex match', 'Dedupe', 'Keep source line', 'Export list']),
    spec(8, 'JSON Schema Generator from Sample', 'Development & Data', 'JSON & Structured Data', 'json-schema', ['json schema', 'schema generator', 'api schema'], 'Writing schemas from sample JSON is repetitive and error-prone.', ['Infer schema', 'Required fields', 'Arrays', 'Copy JSON Schema']),
    spec(9, 'YAML ↔ JSON Converter', 'Development & Data', 'JSON & Structured Data', 'yaml-json', ['yaml to json', 'json to yaml', 'yaml validator'], 'Switching config between YAML and JSON causes indent/type mistakes.', ['JSON to YAML', 'YAML to JSON', 'Indent hints', 'Errors']),
    spec(10, 'Base64 Image Preview & Parser', 'Development & Data', 'Time & Encoding', 'base64-image', ['base64 image', 'data url', 'image preview'], 'Base64 images in APIs are hard to preview and size-check.', ['Preview', 'MIME detect', 'Size estimate', 'Data URL parse']),
    spec(11, 'Unicode & URL Encoding Fixer', 'Development & Data', 'Time & Encoding', 'encoding', ['unicode decode', 'url decode', 'mojibake fix'], 'Escaped Unicode and URL encoding make text unreadable.', ['Unicode decode', 'URL encode/decode', 'HTML entities', 'Char stats']),
    spec(12, 'CSV Column Extract, Reorder & Dedupe', 'Office & Spreadsheets', 'CSV & Tables', 'csv-tools', ['csv column', 'csv dedupe', 'csv reorder'], 'Spreadsheet apps are slow for quick CSV tweaks.', ['Extract columns', 'Reorder', 'Dedupe rows', 'Delimiter detect']),
    spec(13, 'Log & Text Privacy Redactor', 'Privacy & Compliance', 'Data Masking', 'redactor', ['log redaction', 'mask email', 'mask phone'], 'You must mask PII before sharing logs with others.', ['Phone mask', 'Email mask', 'ID mask', 'Card mask']),
    spec(14, 'JSONPath Generator', 'Development & Data', 'JSON & Structured Data', 'jsonpath', ['jsonpath', 'json path', 'field locator'], 'Hand-writing paths to deep JSON fields is error-prone.', ['Path list', 'Field search', 'Array paths', 'Copy path']),
    spec(15, 'Text & JSON Diff Tool', 'Development & Data', 'Text Extraction', 'diff', ['text diff', 'json diff', 'compare text'], 'Eyeballing config changes is slow and unreliable.', ['Line diff', 'Add/remove marks', 'JSON compare', 'Summary']),
    spec(16, 'Cron Expression Explainer', 'Development & Data', 'Time & Encoding', 'cron', ['cron parser', 'cron explain', 'cron schedule'], 'Cron syntax is easy to confuse (day vs weekday).', ['Plain English', 'Field breakdown', 'Next runs', 'Templates']),
    spec(17, 'UUID Batch Generator', 'Development & Data', 'IDs & Random', 'uuid', ['uuid generator', 'bulk uuid', 'uuid v4'], 'Tests and DB seeds need many UUIDs fast.', ['Bulk generate', 'Version hint', 'Case toggle', 'Copy list']),
    spec(18, 'SQL IN List Generator', 'Development & Data', 'SQL & Database', 'sql-in', ['sql in clause', 'sql in generator', 'where in'], 'Turning ID lists into quoted IN clauses wastes time.', ['Lines to IN', 'Number/string detect', 'Dedupe', 'Batches']),
    spec(19, 'Phone Number Format Checker', 'Privacy & Compliance', 'Data Cleaning', 'phone-check', ['phone validate', 'phone format', 'number clean'], 'Marketing lists often contain invalid phone formats.', ['Format check', 'Carrier hint', 'Batch clean', 'Masked export']),
    spec(20, 'HTTP Status Code Lookup', 'Development & Data', 'API Debugging', 'status-search', ['http status', '422 meaning', '409 conflict'], 'API errors need quick status semantics and next steps.', ['Search codes', 'Scenarios', 'Fix tips', 'Browse by class']),
    spec(21, 'Meta Title & Description Counter', 'SEO & Webmasters', 'On-Page SEO', 'meta-counter', ['title length', 'meta description length', 'seo title'], 'Titles and descriptions get truncated in SERPs.', ['Char count', 'Pixel estimate', 'Length tips', 'Truncate warn'], 'SEO specialists and publishers'),
    spec(22, 'Google SERP Snippet Preview', 'SEO & Webmasters', 'On-Page SEO', 'serp-preview', ['serp preview', 'google snippet', 'meta preview'], 'Hard to see how title/description look in search.', ['Desktop preview', 'Mobile preview', 'URL line', 'Length hints'], 'SEO specialists and publishers'),
    spec(23, 'UTM Link Builder', 'SEO & Webmasters', 'Campaign Tracking', 'utm', ['utm builder', 'campaign url', 'utm generator'], 'Campaign links need consistent UTM naming.', ['UTM params', 'Naming tips', 'URL encode', 'Copy link'], 'growth and marketing teams'),
    spec(24, 'Search Intent Classifier', 'SEO & Webmasters', 'Keyword Research', 'intent', ['search intent', 'keyword intent', 'seo intent'], 'Keyword lists need page-type decisions (tool vs article vs nav).', ['Informational', 'Transactional', 'Navigational', 'Page type tip'], 'SEO specialists and publishers'),
    spec(25, 'HTML Heading Structure Checker', 'SEO & Webmasters', 'Technical SEO', 'htags', ['h1 checker', 'heading structure', 'seo headings'], 'Broken heading hierarchy hurts readability and SEO.', ['Extract H1–H6', 'Hierarchy check', 'Empty titles', 'Outline tree'], 'SEO and frontend developers'),
    spec(26, 'robots.txt Generator', 'SEO & Webmasters', 'Technical SEO', 'robots', ['robots txt', 'robots generator', 'crawler rules'], 'New sites often ship wrong robots or miss sitemap lines.', ['Rule templates', 'Sitemap line', 'Allow/Disallow', 'Copy file']),
    spec(27, 'XML Sitemap Generator', 'SEO & Webmasters', 'Technical SEO', 'sitemap', ['sitemap generator', 'xml sitemap', 'url list sitemap'], 'Many tool URLs are tedious to hand-write in sitemap XML.', ['URL list to XML', 'lastmod', 'priority', 'Copy sitemap']),
    spec(28, 'Open Graph & Twitter Card Tags', 'SEO & Webmasters', 'Technical SEO', 'og-tags', ['open graph', 'twitter card', 'social meta'], 'Missing social tags make shares look broken.', ['OG tags', 'Twitter Card', 'Canonical align', 'Copy HTML']),
    spec(29, 'FAQ JSON-LD Generator', 'SEO & Webmasters', 'Structured Data', 'faq-schema', ['faq schema', 'json-ld faq', 'structured data'], 'FAQ schema markup is tedious to write by hand.', ['Q&A parse', 'JSON-LD output', 'Escape HTML', 'Validate JSON']),
    spec(30, 'SEO-Friendly URL Slug Generator', 'SEO & Webmasters', 'On-Page SEO', 'slug', ['url slug', 'slug generator', 'seo slug'], 'Titles need short, readable URL slugs.', ['Title to slug', 'Stop words', 'Batch slugs', 'Lowercase']),
    spec(31, 'Markdown Preview & TOC Builder', 'Content & Writing', 'Markdown', 'markdown', ['markdown preview', 'table of contents', 'md toc'], 'READMEs and articles need quick TOC and preview.', ['MD preview', 'Heading TOC', 'Word count', 'Plain export']),
    spec(32, 'Word Count & Reading Time', 'Content & Writing', 'Text Tools', 'word-counter', ['word count', 'reading time', 'character count'], 'Editors need length and reading time before publish.', ['Chars/words', 'Reading minutes', 'Sentence stats', 'Keyword count']),
    spec(33, 'Case Style Converter', 'Development & Data', 'Text Extraction', 'case-convert', ['camelcase', 'snake case', 'kebab case'], 'Variable naming differs across languages and APIs.', ['camelCase', 'snake_case', 'kebab-case', 'PascalCase']),
    spec(34, 'Duplicate Line Remover', 'Office & Spreadsheets', 'Text Cleanup', 'duplicate-lines', ['remove duplicates', 'dedupe lines', 'unique lines'], 'Keyword and ID lists often have duplicates and blank lines.', ['Order-preserving dedupe', 'Sort dedupe', 'Dup count', 'Copy result']),
    spec(35, 'Line Sort & Cleanup Tool', 'Office & Spreadsheets', 'Text Cleanup', 'sort-lines', ['sort lines', 'alphabetize list', 'text sort'], 'Domains, SKUs, and keywords need fast sorting.', ['Asc/desc sort', 'Length sort', 'Trim blanks', 'Case options']),
    spec(36, 'Password Strength & Generator', 'Privacy & Compliance', 'Security', 'password', ['password generator', 'password strength', 'secure password'], 'Staging and test accounts need strong passwords.', ['Strength score', 'Random gen', 'Charset control', 'Local only']),
    spec(37, 'SHA Hash Generator', 'Privacy & Compliance', 'Security', 'hash', ['sha256', 'hash generator', 'checksum'], 'Quick checksums for text and signatures.', ['SHA-1', 'SHA-256', 'SHA-384', 'SHA-512']),
    spec(38, 'Invoice VAT / Tax Calculator', 'Office & Spreadsheets', 'Finance', 'invoice-vat', ['vat calculator', 'tax inclusive', 'net gross'], 'Inclusive vs exclusive tax math is easy to get wrong.', ['Gross to net', 'Tax amount', 'Multi-rate', 'Breakdown']),
    spec(39, 'Privacy Policy Snippet Generator', 'Privacy & Compliance', 'Copy Templates', 'privacy-copy', ['privacy policy', 'browser tool privacy', 'no upload policy'], 'Small tool sites need clear “data stays local” copy.', ['Local processing', 'Cookie note', 'Contact placeholder', 'Copy block']),
    spec(40, 'About & Contact Page Copy Generator', 'Content & Writing', 'Copy Templates', 'privacy-copy', ['about page', 'contact page', 'trust page'], 'AdSense and user trust need basic About/Contact text.', ['About block', 'Contact block', 'Disclaimer', 'Copy template'])
  ];

  const expansion = [
    ['Nginx Config Snippet Generator', 'Development & Data', 'Config Generators', 'nginx-config', ['nginx config', 'reverse proxy', 'gzip nginx']],
    ['Docker Run Command Generator', 'Development & Data', 'Config Generators', 'docker-run', ['docker run', 'container cli', 'port mapping']],
    ['Kubernetes YAML Mini Templates', 'Development & Data', 'Config Generators', 'k8s-yaml', ['k8s yaml', 'deployment yaml', 'service yaml']],
    ['cURL to fetch() Converter', 'Development & Data', 'API Debugging', 'curl-fetch', ['curl to fetch', 'javascript fetch', 'api code']],
    ['JSON to TypeScript Types', 'Development & Data', 'JSON & Structured Data', 'json-to-ts', ['json to typescript', 'ts types', 'interface generator']],
    ['.env File Sorter & Deduper', 'Development & Data', 'Text Cleanup', 'env-sort', ['env file', 'dotenv sort', 'env dedupe']],
    ['Port Conflict Command Helper', 'Development & Data', 'CLI Helpers', 'port-cmd', ['port in use', 'kill port', 'lsof port']],
    ['URL Encode Batch Tool', 'Development & Data', 'URL & Requests', 'url-batch', ['url encode', 'url decode', 'batch encode']],
    ['IP CIDR Calculator (Lite)', 'Development & Data', 'Network Tools', 'ip-cidr', ['cidr calculator', 'subnet mask', 'ip range']],
    ['HEX RGB HSL Color Converter', 'Design & Frontend', 'Color Tools', 'color-convert', ['hex to rgb', 'hsl converter', 'color converter']],
    ['CSS clamp() Font Size Generator', 'Design & Frontend', 'CSS Tools', 'css-clamp', ['css clamp', 'fluid typography', 'responsive font']],
    ['CSS Grid Template Generator', 'Design & Frontend', 'CSS Tools', 'css-grid', ['css grid', 'grid template', 'layout generator']],
    ['Flexbox Alignment Cheat Sheet', 'Design & Frontend', 'CSS Tools', 'flexbox', ['flexbox', 'justify content', 'align items']],
    ['Tailwind Class Name Sorter', 'Design & Frontend', 'CSS Tools', 'tailwind-sort', ['tailwind sort', 'class sorter', 'utility classes']],
    ['Image Aspect Ratio Calculator', 'Design & Frontend', 'Image Tools', 'aspect-ratio', ['aspect ratio', 'image ratio', 'resize ratio']],
    ['SVG viewBox Inspector', 'Design & Frontend', 'Image Tools', 'svg-viewbox', ['svg viewbox', 'svg inspector', 'vector tools']],
    ['Headline A/B Score Helper', 'Content & Writing', 'Copy Optimization', 'title-ab-score', ['headline score', 'title test', 'ctr copy']],
    ['Short-Form Post Outline Generator', 'Content & Writing', 'Social Templates', 'xhs-note', ['social post', 'content outline', 'short video copy']],
    ['Short Video Shot List Generator', 'Content & Writing', 'Social Templates', 'video-script', ['video script', 'shot list', 'talking points']],
    ['Email Subject Line Length Check', 'Content & Writing', 'Email', 'email-subject', ['email subject', 'subject length', 'newsletter']],
    ['FAQ Question Expander', 'Content & Writing', 'SEO Writing', 'faq-expand', ['faq generator', 'expand faq', 'question ideas']],
    ['Keyword Dedupe & Grouping', 'SEO & Webmasters', 'Keyword Research', 'keyword-group', ['keyword dedupe', 'keyword groups', 'long tail']],
    ['Page Title Batch Checker', 'SEO & Webmasters', 'On-Page SEO', 'title-batch', ['title batch', 'seo titles', 'title length']],
    ['Canonical Tag Auditor', 'SEO & Webmasters', 'Technical SEO', 'canonical-check', ['canonical tag', 'duplicate url', 'seo canonical']],
    ['Internal Link Anchor Organizer', 'SEO & Webmasters', 'Internal Links', 'anchor-text', ['anchor text', 'internal links', 'link map']],
    ['Redirect Chain Logger', 'SEO & Webmasters', 'Technical SEO', 'redirect-chain', ['redirect chain', '301 check', 'url hops']],
    ['UTM Batch Link Builder', 'SEO & Webmasters', 'Campaign Tracking', 'utm-batch', ['utm batch', 'campaign urls', 'bulk utm']],
    ['Google Ads Headline Length Check', 'SEO & Webmasters', 'Paid Ads', 'ads-title', ['google ads headline', 'ad copy length', 'rsa titles']],
    ['CSV to Markdown Table', 'Office & Spreadsheets', 'CSV & Tables', 'csv-to-md', ['csv to markdown', 'markdown table', 'table convert']],
    ['Markdown Table Aligner', 'Office & Spreadsheets', 'Text Cleanup', 'md-table-align', ['markdown table', 'align table', 'md formatter']],
    ['Random List Sampler', 'Office & Spreadsheets', 'List Tools', 'random-sample', ['random sample', 'pick winners', 'list lottery']],
    ['Meeting Action Item Extractor', 'Office & Spreadsheets', 'Text Tools', 'action-items', ['action items', 'meeting notes', 'todo extract']],
    ['Task Breakdown Template Builder', 'Productivity & Learning', 'Task Management', 'todo-split', ['task breakdown', 'project plan', 'todo template']],
    ['Pomodoro Schedule Planner', 'Productivity & Learning', 'Time Management', 'pomodoro-plan', ['pomodoro', 'time blocking', 'focus plan']],
    ['Study Flashcard Builder', 'Productivity & Learning', 'Learning', 'flashcard', ['flashcards', 'study cards', 'q and a']],
    ['English Title Case Converter', 'Productivity & Learning', 'Language', 'title-case-en', ['title case', 'capitalize title', 'english title']],
    ['Resume Keyword Matcher', 'Productivity & Learning', 'Career', 'resume-match', ['resume keywords', 'job description match', 'ats keywords']],
    ['STAR Interview Answer Builder', 'Productivity & Learning', 'Career', 'star-interview', ['star method', 'behavioral interview', 'interview prep']],
    ['Bank Card Mask & Luhn Check', 'Privacy & Compliance', 'Data Masking', 'bank-card', ['card mask', 'luhn check', 'pci redact']],
    ['National ID Mask & Format Check', 'Privacy & Compliance', 'Data Masking', 'id-card', ['id mask', 'id format', 'pii mask']],
    ['Email List Cleaner', 'Privacy & Compliance', 'Data Cleaning', 'email-clean', ['email extract', 'email validate', 'list clean']],
    ['Cookie Banner Copy Generator', 'Privacy & Compliance', 'Copy Templates', 'cookie-banner', ['cookie banner', 'cookie notice', 'gdpr copy']],
    ['robots.txt vs Sitemap Checker', 'SEO & Webmasters', 'Technical SEO', 'robots-sitemap-check', ['robots sitemap', 'indexing check', 'crawl audit']],
    ['LocalBusiness Schema Generator', 'SEO & Webmasters', 'Structured Data', 'localbusiness-schema', ['localbusiness schema', 'json-ld local', 'local seo']],
    ['Product Selling Points Table', 'Content & Writing', 'Copy Optimization', 'selling-points', ['selling points', 'product copy', 'value props']],
    ['E-commerce SKU Normalizer', 'Office & Spreadsheets', 'Text Cleanup', 'sku-naming', ['sku format', 'product sku', 'catalog clean']],
    ['Order ID Batch Generator', 'Office & Spreadsheets', 'IDs & Random', 'order-id', ['order id', 'reference number', 'batch ids']],
    ['Percent Change Calculator', 'Office & Spreadsheets', 'Finance', 'percent-change', ['percent change', 'growth rate', 'delta percent']],
    ['A/B Test Sample Size Estimator', 'SEO & Webmasters', 'Analytics', 'ab-sample', ['ab test sample', 'conversion test', 'experiment size']],
    ['Marketing Funnel Drop-off Calculator', 'SEO & Webmasters', 'Analytics', 'funnel-calc', ['funnel conversion', 'drop off rate', 'growth funnel']],
    ['NPS Score Calculator', 'Office & Spreadsheets', 'Analytics', 'nps-calc', ['nps calculator', 'net promoter', 'survey score']],
    ['Survey Option Shuffler', 'Office & Spreadsheets', 'Text Cleanup', 'shuffle-options', ['shuffle options', 'randomize survey', 'ab order']],
    ['Initials & Acronym Extractor', 'Office & Spreadsheets', 'Text Tools', 'initials', ['initials generator', 'acronym', 'name initials']],
    ['Domain List Cleaner', 'SEO & Webmasters', 'Technical SEO', 'domain-clean', ['extract domains', 'url clean', 'domain list']],
    ['Log HTTP Status Counter', 'Development & Data', 'Log Analysis', 'log-status', ['status code count', 'log analyzer', 'error stats']],
    ['JSON Array to CSV', 'Development & Data', 'JSON & Structured Data', 'json-to-csv', ['json to csv', 'array to csv', 'export csv']],
    ['CSV to JSON Array', 'Office & Spreadsheets', 'CSV & Tables', 'csv-to-json', ['csv to json', 'table to json', 'data convert']],
    ['hreflang Tag Template Generator', 'SEO & Webmasters', 'Technical SEO', 'hreflang', ['hreflang generator', 'multilingual seo', 'alternate links']],
    ['HTML Meta Tag Extractor', 'SEO & Webmasters', 'On-Page SEO', 'meta-extract', ['meta extractor', 'seo meta audit', 'html meta']],
    ['Image Alt Text Accessibility Check', 'Design & Frontend', 'Accessibility', 'alt-check', ['alt text check', 'image accessibility', 'a11y images']]
  ];

  for (let i = 0; i < expansion.length; i += 1) {
    const [name, category, subcategory, kind, keywords] = expansion[i];
    tools.push(spec(
      41 + i,
      name,
      category,
      subcategory,
      kind,
      keywords,
      `${name} solves a small daily task that should be fast, reliable, and login-free.`,
      ['Paste input', 'Run tool', 'Copy output', 'Runs locally in browser']
    ));
  }

  const { buildCatalog101to500 } = require('./catalog-101-500');
  tools.push(...buildCatalog101to500());

  const { enrichAllTools } = require('./enrich-tool-content');
  const { runSync, samples } = require('./tool-runtime');
  return enrichAllTools(tools, { runSync, samples });
}

module.exports = { buildToolsList, spec, DOMAIN };
