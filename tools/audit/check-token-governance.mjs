#!/usr/bin/env node
import { mkdirSync, readdirSync, readFileSync, statSync, writeFileSync } from 'node:fs';
import { join, relative } from 'node:path';

const ROOT = process.cwd();
const REPORTS_DIR = join(ROOT, 'reports');
mkdirSync(REPORTS_DIR, { recursive: true });
const strict = process.argv.includes('--strict');

const targets = [join(ROOT, 'packages/design-core/styles/src/components')];
const patterns = [
  { id: 'raw-hex', re: /#[0-9a-fA-F]{3,8}\b/g },
  { id: 'raw-rgb', re: /\brgba?\(/g },
  { id: 'raw-hsl', re: /\bhsla?\(/g }
];

const findings = [];

const walk = (dir, onFile) => {
  for (const entry of readdirSync(dir)) {
    const next = join(dir, entry);
    const s = statSync(next);
    if (s.isDirectory()) {
      walk(next, onFile);
    } else {
      onFile(next);
    }
  }
};

for (const dir of targets) {
  if (!statSync(dir, { throwIfNoEntry: false })) continue;
  walk(dir, (filePath) => {
    if (!filePath.endsWith('.css')) return;
    const content = readFileSync(filePath, 'utf8');
    for (const p of patterns) {
      const matches = content.match(p.re);
      if (!matches || matches.length === 0) continue;
      findings.push({ file: relative(ROOT, filePath).replaceAll('\\', '/'), rule: p.id, count: matches.length });
    }
  });
}

writeFileSync(join(REPORTS_DIR, 'token-governance-findings.json'), `${JSON.stringify(findings, null, 2)}\n`);

if (findings.length === 0) {
  console.log('Token governance check passed');
  process.exit(0);
}

console.error(`Token governance findings: ${findings.length}`);
for (const f of findings) {
  console.error(`- ${f.file} (${f.rule}) x${f.count}`);
}

if (strict) {
  process.exit(1);
}

console.error('Non-strict mode; exiting 0');
process.exit(0);
