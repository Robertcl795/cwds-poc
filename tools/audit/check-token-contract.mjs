#!/usr/bin/env node
import { mkdirSync, readdirSync, readFileSync, statSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const SCRIPT_DIR = dirname(fileURLToPath(import.meta.url));
const ROOT = join(SCRIPT_DIR, '..', '..');
const REPORTS_DIR = join(ROOT, 'reports');
mkdirSync(REPORTS_DIR, { recursive: true });

const strict = process.argv.includes('--strict');
const tokenDir = join(ROOT, 'packages/design-core/tokens/src');

const readCssFiles = (dir) => {
  const entries = readdirSync(dir).sort();
  const files = [];

  for (const entry of entries) {
    const next = join(dir, entry);
    const stat = statSync(next);

    if (stat.isDirectory()) {
      files.push(...readCssFiles(next));
      continue;
    }

    if (next.endsWith('.css')) {
      files.push(next);
    }
  }

  return files;
};

const content = readCssFiles(tokenDir)
  .map((filePath) => readFileSync(filePath, 'utf8'))
  .join('\n');

const requiredProps = [
  '--cv-ref-color-brand-50',
  '--cv-ref-color-brand-100',
  '--cv-ref-color-brand-200',
  '--cv-ref-color-brand-300',
  '--cv-ref-color-brand-400',
  '--cv-ref-color-brand-500',
  '--cv-ref-color-brand-600',
  '--cv-ref-color-brand-700',
  '--cv-ref-color-brand-800',
  '--cv-ref-color-brand-900',
  '--cv-ref-color-brand-950',
  '--cv-sys-color-surface',
  '--cv-sys-color-text',
  '--cv-sys-color-border',
  '--cv-sys-color-primary',
  '--cv-sys-color-secondary',
  '--cv-sys-color-accent',
  '--cv-sys-color-success',
  '--cv-sys-color-warning',
  '--cv-sys-color-danger',
  '--cv-sys-color-info',
  '--cv-sys-color-neutral-surface',
  '--cv-sys-color-neutral-border',
  '--cv-sys-color-neutral-text',
  '--cv-sys-color-info-surface',
  '--cv-sys-color-info-border',
  '--cv-sys-color-info-text',
  '--cv-sys-color-success-surface',
  '--cv-sys-color-success-border',
  '--cv-sys-color-success-text',
  '--cv-sys-color-warning-surface',
  '--cv-sys-color-warning-border',
  '--cv-sys-color-warning-text',
  '--cv-sys-color-danger-surface',
  '--cv-sys-color-danger-border',
  '--cv-sys-color-danger-text',
  '--cv-sys-space-xs',
  '--cv-sys-space-sm',
  '--cv-sys-space-md',
  '--cv-sys-space-lg',
  '--cv-sys-space-xl',
  '--cv-sys-typescale-label',
  '--cv-sys-typescale-body',
  '--cv-sys-typescale-title',
  '--cv-sys-radius-sm',
  '--cv-sys-radius-md',
  '--cv-sys-radius-lg',
  '--cv-sys-elevation-level-1',
  '--cv-sys-elevation-level-2',
  '--cv-sys-elevation-level-3',
  '--cv-sys-motion-fast',
  '--cv-sys-motion-normal',
  '--cv-sys-z-index-sticky',
  '--cv-sys-z-index-popover',
  '--cv-sys-z-index-snackbar',
  '--cv-sys-z-index-tooltip'
];

const findings = [];

for (const prop of requiredProps) {
  if (!content.includes(prop)) {
    findings.push({ rule: 'missing-token', token: prop });
  }
}

if (!content.includes('oklch(')) {
  findings.push({ rule: 'missing-oklch-palette' });
}

if (!content.includes('light-dark(')) {
  findings.push({ rule: 'missing-light-dark-semantic-tokens' });
}

writeFileSync(join(REPORTS_DIR, 'token-contract-findings.json'), `${JSON.stringify(findings, null, 2)}\n`);

if (findings.length === 0) {
  console.log('Token contract check passed');
  process.exit(0);
}

console.error(`Token contract findings: ${findings.length}`);
for (const finding of findings) {
  console.error(`- ${finding.rule}${finding.token ? `: ${finding.token}` : ''}`);
}

if (strict) {
  process.exit(1);
}

console.error('Non-strict mode; exiting 0');
