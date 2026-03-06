#!/usr/bin/env node
import { mkdirSync, readdirSync, readFileSync, statSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join, relative } from 'node:path';

const SCRIPT_DIR = dirname(fileURLToPath(import.meta.url));
const ROOT = join(SCRIPT_DIR, '..', '..');
const REPORTS_DIR = join(ROOT, 'reports');
mkdirSync(REPORTS_DIR, { recursive: true });
const strict = process.argv.includes('--strict');

const rawColorPatterns = [
  { id: 'raw-hex', re: /#[0-9a-fA-F]{3,8}\b/g },
  { id: 'raw-rgb', re: /\brgba?\(/g },
  { id: 'raw-hsl', re: /\bhsla?\(/g }
];
const findings = [];

const walk = (dir, onFile) => {
  for (const entry of readdirSync(dir)) {
    const next = join(dir, entry);
    const stats = statSync(next);
    if (stats.isDirectory()) {
      walk(next, onFile);
    } else {
      onFile(next);
    }
  }
};

const scanCssDir = (dir, callback) => {
  if (!statSync(dir, { throwIfNoEntry: false })) return;
  walk(dir, (filePath) => {
    if (!filePath.endsWith('.css')) return;
    callback(filePath, readFileSync(filePath, 'utf8'));
  });
};

scanCssDir(join(ROOT, 'packages/components/src/styles'), (filePath, content) => {
  for (const pattern of rawColorPatterns) {
    const matches = content.match(pattern.re);
    if (matches && matches.length > 0) {
      findings.push({
        file: relative(ROOT, filePath).replaceAll('\\', '/'),
        rule: pattern.id,
        count: matches.length
      });
    }
  }
});

for (const dir of [join(ROOT, 'packages/components/src'), join(ROOT, 'packages/core/src')]) {
  scanCssDir(dir, (filePath, content) => {
    if (/^\s*--cv-(ref|sys)-[a-z0-9-]+\s*:/m.test(content)) {
      findings.push({
        file: relative(ROOT, filePath).replaceAll('\\', '/'),
        rule: 'forbidden-token-declaration'
      });
    }
  });
}

scanCssDir(join(ROOT, 'packages/tokens/src/primitive'), (filePath, content) => {
  const invalid = [...content.matchAll(/(--cv-[a-z0-9-]+)\s*:/g)]
    .map((match) => match[1])
    .filter((name) => name && !name.startsWith('--cv-ref-'));
  if (invalid.length > 0) {
    findings.push({
      file: relative(ROOT, filePath).replaceAll('\\', '/'),
      rule: 'invalid-primitive-token-prefix',
      count: invalid.length
    });
  }
});

for (const dir of [join(ROOT, 'packages/tokens/src/semantic'), join(ROOT, 'packages/tokens/src/themes')]) {
  scanCssDir(dir, (filePath, content) => {
    const invalid = [...content.matchAll(/(--cv-[a-z0-9-]+)\s*:/g)]
      .map((match) => match[1])
      .filter((name) => name && !name.startsWith('--cv-sys-'));
    if (invalid.length > 0) {
      findings.push({
        file: relative(ROOT, filePath).replaceAll('\\', '/'),
        rule: 'invalid-semantic-token-prefix',
        count: invalid.length
      });
    }
  });
}

writeFileSync(join(REPORTS_DIR, 'token-governance-findings.json'), `${JSON.stringify(findings, null, 2)}\n`);

if (findings.length === 0) {
  console.log('Token governance check passed');
  process.exit(0);
}

console.error(`Token governance findings: ${findings.length}`);
for (const finding of findings) {
  console.error(`- ${finding.file} (${finding.rule})${finding.count ? ` x${finding.count}` : ''}`);
}

if (strict) {
  process.exit(1);
}

console.error('Non-strict mode; exiting 0');
process.exit(0);
