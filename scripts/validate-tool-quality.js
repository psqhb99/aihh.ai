'use strict';
const { buildToolsList } = require('./tools-en-catalog');
const { runSync, samples } = require('./tool-runtime');

const tools = buildToolsList();
let generic = 0;
let noExample = 0;
const bad = [];

for (const t of tools) {
  const sample = samples[t.kind];
  if (!t.exampleInput) noExample += 1;
  if (!sample) {
    bad.push(`${t.id}: no sample`);
    continue;
  }
  const out = runSync(t.kind, sample);
  if (!out || /kind result:/i.test(out) || /Processed locally\. Refine input/i.test(out)) {
    generic += 1;
    bad.push(`${t.id} ${t.kind}: generic fallback`);
  }
}

console.log(`Quality check: ${tools.length} tools`);
console.log(`  with example I/O: ${tools.length - noExample}`);
console.log(`  weak/generic runtime: ${generic}`);
if (bad.length) {
  bad.slice(0, 15).forEach((b) => console.log('  -', b));
  if (bad.length > 15) console.log(`  ... and ${bad.length - 15} more`);
  process.exitCode = generic > 50 ? 1 : 0;
}
