/**
 * Enriches every tool with unique SEO copy, FAQs, and how-to steps at build time.
 */
const GENERIC_PAIN_RE = /solves a (small daily|focused) task|Paste input|Run in browser|Run tool|Copy output|No account required/i;

const AUDIENCE_BY_CAT = {
  'Development & Data': 'developers and DevOps engineers',
  'SEO & Webmasters': 'SEO specialists and site owners',
  'PDF & Documents': 'office workers, designers, and publishers',
  'Image & Media': 'designers, marketers, and content teams',
  'Text & Writing': 'writers, editors, and marketers',
  'Calculators & Units': 'students, analysts, and everyday users',
  'Converters (format/data)': 'developers and data analysts',
  'Reference & Codes': 'developers and IT support teams',
  'Date, Time & Timezone': 'remote teams and schedulers',
  'Web, HTML & CSS': 'frontend developers and designers',
  'Office & Finance': 'small business owners and finance staff',
  'Privacy & Security': 'security-conscious professionals',
  'Design & Color': 'UI designers and brand teams',
  'Integrations & Scenarios': 'operators shipping multi-step workflows',
  'Productivity & Career': 'knowledge workers and job seekers',
  'Content & Writing': 'content marketers and publishers',
  'Office & Spreadsheets': 'operations and spreadsheet users',
  'Design & Frontend': 'frontend developers and designers',
  'Productivity & Learning': 'students and self-learners'
};

const KIND_META = {
  'json-format': {
    pain: 'Raw JSON from APIs is hard to read, and a single syntax error breaks parsing.',
    functions: ['Pretty-print nested JSON', 'Minify for production', 'Sort keys for diffs', 'Surface syntax errors'],
    howTo: ['Paste JSON from logs, APIs, or config files.', 'Click Run to format, minify, or validate.', 'Copy the cleaned JSON back to your editor or ticket.']
  },
  'fuel-efficiency': {
    pain: 'Comparing fuel economy across trips or vehicles is tedious without a quick L/100km figure.',
    faqExtra: 'Enter liters and distance in km; the tool returns liters per 100 km for EU-style consumption reporting.',
    functions: ['Enter liters consumed and distance', 'Calculate L/100km instantly', 'Copy figure for reports', 'No spreadsheet required'],
    howTo: ['Enter liters=8 and distance=100 (km), one per line.', 'Click Run to compute liters per 100 km.', 'Copy the consumption line into your log or spreadsheet.']
  },
  'srcset-gen': {
    pain: 'Hand-writing responsive srcset attributes for many image widths is slow and error-prone.',
    functions: ['Build srcset from base URL', 'Add width descriptors (w)', 'Output ready-to-paste HTML', 'Match common breakpoints'],
    howTo: ['Enter base image path and comma-separated widths (e.g. 400,800,1200).', 'Run to generate the full srcset string.', 'Paste into your img tag in HTML or JSX.']
  },
  'bmi-calc': {
    pain: 'You need a quick BMI check without opening a spreadsheet or medical app.',
    functions: ['Enter weight (kg) and height (cm)', 'Get BMI value and category', 'Copy results', 'Runs locally'],
    howTo: ['Enter weight=70 and height=175 using key=value lines.', 'Click Run for BMI and category label.', 'Use for wellness tracking only—not medical advice.']
  },
  'unit-convert': {
    pain: 'Switching between unit systems for travel, cooking, or specs should not require hunting conversion tables.',
    functions: ['Convert value between two units', 'Supports common length/weight/temp', 'Shows calculated result', 'Copy numeric output'],
    howTo: ['Set from=km, to=mile, value=10 (one per line).', 'Run to convert.', 'Adjust units to match your task.']
  },
  'pdf-page-count': {
    pain: 'Before splitting or quoting print work, you need a reliable page count from exports or lists.',
    functions: ['Count pages from line list', 'Summarize totals', 'Copy count summary', 'Plan splits or imposition'],
    howTo: ['Paste one page label or marker per line.', 'Run to count lines as pages.', 'Use with your PDF tool for actual file operations.']
  },
  'readability': {
    pain: 'Editors need a fast readability score before publishing articles or help docs.',
    functions: ['Flesch Reading Ease estimate', 'Word and sentence counts', 'Copy metrics', 'Tune copy for audience'],
    howTo: ['Paste article text into the input area.', 'Run to see readability stats.', 'Revise sentences and run again.']
  },
  'workflow-steps': {
    pain: 'Multi-tool tasks are easier when steps and related AIHH utilities are listed in one place.',
    functions: ['Outline numbered workflow', 'Reference related tools', 'Copy checklist', 'Ship repeatable process'],
    howTo: ['Describe workflow= name and steps (one per line).', 'Run to get ordered steps with hub links context.', 'Follow steps across the listed tools.']
  }
};

function hashSeed(str) {
  let h = 0;
  for (let i = 0; i < str.length; i += 1) h = (h * 31 + str.charCodeAt(i)) >>> 0;
  return h;
}

function isGenericPain(tool) {
  return GENERIC_PAIN_RE.test(tool.pain) || GENERIC_PAIN_RE.test((tool.functions || []).join(' '));
}

function pickAudience(tool) {
  return AUDIENCE_BY_CAT[tool.category] || tool.audience || 'professionals and students';
}

function buildPain(tool) {
  const km = KIND_META[tool.kind];
  if (km?.pain) return km.pain;
  const kw = tool.keywords[0] || tool.name;
  const templates = [
    `When you need ${kw}, switching between apps wastes time—this page gives you an instant browser-based result.`,
    `${tool.name} helps ${pickAudience(tool)} complete ${kw} tasks without uploading files or creating accounts.`,
    `Teams often need ${kw} during daily work; this tool keeps the workflow local, fast, and copy-friendly.`,
    `If ${kw} is part of your checklist, run it here instead of rebuilding the same steps in a spreadsheet.`
  ];
  return templates[hashSeed(tool.id) % templates.length];
}

function buildFunctions(tool) {
  const km = KIND_META[tool.kind];
  if (km?.functions) return km.functions;
  const kw = tool.keywords[0] || 'your task';
  if (tool.category.includes('PDF')) {
    return [`Prepare inputs for ${kw}`, 'Generate checklist or counts', 'Review output before export', 'Copy steps into your PDF app'];
  }
  if (tool.category.includes('Image')) {
    return [`Enter image specs or text for ${kw}`, 'Get HTML/CSS or sizing output', 'Preview in browser', 'Copy into your project'];
  }
  if (tool.category.includes('Calculat') || tool.category.includes('Finance')) {
    return [`Enter numbers for ${kw}`, 'See calculated result instantly', 'Copy value for reports', 'Recalculate with new inputs'];
  }
  if (tool.category.includes('SEO')) {
    return [`Paste SEO text or URLs for ${kw}`, 'Validate length or structure', 'Copy tags or snippets', 'Publish with confidence'];
  }
  return [
    `Paste or type data for ${kw}`,
    `Process with ${tool.name}`,
    'Review output in the panel',
    'Copy result to clipboard'
  ];
}

function buildDescription(tool) {
  const kw = tool.keywords[0] || tool.name.toLowerCase();
  const kw2 = tool.keywords[1] || '';
  const aud = pickAudience(tool);
  const variants = [
    `Free ${tool.name} for ${aud}. ${kw}${kw2 ? `, ${kw2}` : ''}—runs in your browser on ${tool.domain}, no upload.`,
    `${kw} online: ${tool.name} on AIHH.ai. Local processing, instant copyable output, built for ${aud}.`,
    `Use ${tool.name} to handle ${kw}. Free client-side tool at ${tool.domain}—private, fast, no signup.`
  ];
  let desc = variants[hashSeed(tool.id + kw) % variants.length];
  if (desc.length > 165) desc = desc.slice(0, 162) + '…';
  return desc;
}

function howToForKind(tool) {
  const k = tool.kind;
  const kw = tool.keywords[0] || tool.name;
  if (k.endsWith('-ref')) return [`Enter a code, port, or label (e.g. 404 or 443).`, 'Click Run to see meaning and typical fixes.', `Apply the fix in your ${kw} workflow.`];
  if (k.startsWith('pdf-')) return ['Paste page list or key=value export settings.', 'Run to get a step-by-step PDF checklist.', 'Execute in Acrobat/browser, then verify output.'];
  if (k.startsWith('img-') || k.includes('srcset') || k.includes('favicon')) return ['Set paths, sizes, or quality as key=value lines.', 'Run to generate HTML/CSS or sizing notes.', 'Paste into your site and test LCP/CLS.'];
  if (k.includes('calc') || tool.category.includes('Calculat') || tool.category.includes('Finance')) {
    return ['Enter numbers as key=value (see Load sample).', 'Click Run for the calculated result.', 'Copy into reports; verify critical figures independently.'];
  }
  if (k.includes('checklist') || k.includes('-check') || k.includes('lint')) {
    return [`List items or settings for ${kw}.`, 'Run to get a review checklist.', 'Tick off each item before shipping.'];
  }
  if (k.includes('-gen') || k.endsWith('-css') || k.endsWith('-html')) {
    return ['Fill sample fields or paste your values.', 'Run to generate a paste-ready snippet.', 'Drop into your repo and adjust naming/tokens.'];
  }
  return null;
}

function buildHowTo(tool) {
  const km = KIND_META[tool.kind];
  if (km?.howTo) return km.howTo;
  const kindHow = howToForKind(tool);
  if (kindHow) return kindHow;
  return [
    `Open the sample or paste your own input for ${tool.keywords[0] || tool.name}.`,
    'Click Run—the tool processes everything locally in your browser.',
    'Copy the output into your document, code editor, or ticket system.'
  ];
}

function buildFaqs(tool) {
  const kw = tool.keywords[0] || tool.name;
  const km = KIND_META[tool.kind];
  const pain = km?.pain || tool.pain;
  const fn0 = (tool.functions && tool.functions[0]) || 'Paste or type your input';
  const list = [
    {
      q: `What does ${tool.name} do?`,
      a: `${tool.name} helps you with ${kw}. ${pain}${km?.faqExtra ? ` ${km.faqExtra}` : ''}`
    },
    {
      q: `Is ${tool.name} free to use?`,
      a: `Yes. ${tool.name} on ${tool.domain} is free with no account and no usage limits for normal use.`
    },
    {
      q: 'Is my input uploaded to a server?',
      a: 'No. Calculations and text processing happen in your browser. AIHH.ai does not receive your pasted content unless you share it yourself.'
    },
    {
      q: 'What input format should I use?',
      a: `${fn0}. Click Load sample to load a working example, then replace values with your own.`
    },
    {
      q: 'Can I use this tool for commercial projects?',
      a: `Yes for typical commercial use: embed links, use outputs in client work, and ship internal workflows. Results are generated locally; verify critical ${kw} results independently.`
    }
  ];
  if (needsDisclaimer(tool)) {
    list.push({
      q: 'Is this professional advice?',
      a: 'No. This page provides informational calculations or checklists only. Consult qualified professionals for medical, legal, or financial decisions.'
    });
  }
  return list;
}

function needsDisclaimer(tool) {
  const c = tool.category.toLowerCase();
  const n = tool.name.toLowerCase();
  return c.includes('calculat') || c.includes('finance') || n.includes('bmi') || n.includes('loan')
    || n.includes('tax') || n.includes('medical') || n.includes('health');
}

function inputPlaceholder(tool) {
  if (tool.kind.includes('pdf') || tool.category.includes('PDF')) return 'Paste page list, export notes, or key=value settings…';
  if (tool.category.includes('Calculat')) return 'Use key=value lines, e.g. weight=70 height=175…';
  if (tool.category.includes('Image')) return 'Paste dimensions, paths, or image settings…';
  return 'Paste text or data, or click Load sample…';
}

function attachExamples(tool, sample, output) {
  const out = { ...tool };
  if (sample) {
    out.exampleInput = String(sample).slice(0, 400);
    out.exampleOutput = String(output || '').slice(0, 500);
  }
  return out;
}

function enrichTool(tool, runtimeCtx) {
  const out = { ...tool };
  if (isGenericPain(tool) || !tool.pain || tool.pain.length < 40) out.pain = buildPain(tool);
  if (isGenericPain(tool) || (tool.functions || []).join('').includes('Paste or enter input')) {
    out.functions = buildFunctions(out);
  }
  out.audience = pickAudience(tool);
  out.description = buildDescription(out);
  out.title = `${tool.name} - Free ${tool.keywords[0] || 'Online Tool'} | AIHH.ai`;
  out.howToSteps = buildHowTo(out);
  out.faqs = buildFaqs(out);
  out.inputPlaceholder = inputPlaceholder(tool);
  out.disclaimer = needsDisclaimer(tool)
    ? 'Disclaimer: Results are for information only and are not medical, legal, tax, or financial advice. Verify critical values before decisions.'
    : '';
  out.hubBlurb = `${tool.name} — ${tool.keywords[0]}`;
  if (runtimeCtx) {
    const sample = runtimeCtx.samples[tool.kind];
    let output = '';
    if (sample) {
      try {
        output = runtimeCtx.runSync(tool.kind, sample);
      } catch (e) {
        output = '';
      }
    }
    return attachExamples(out, sample, output);
  }
  return out;
}

function enrichAllTools(tools, runtimeCtx) {
  return tools.map((t) => enrichTool(t, runtimeCtx));
}

module.exports = { enrichTool, enrichAllTools, isGenericPain, attachExamples };
