#!/usr/bin/env node
import { mkdirSync, readdirSync, readFileSync, statSync, writeFileSync } from 'node:fs';
import { join, relative } from 'node:path';

const ROOT = process.cwd();
const REPORTS_DIR = join(ROOT, 'reports');
mkdirSync(REPORTS_DIR, { recursive: true });
const warnOnly = process.argv.includes('--warn');

const OWNER_PREFIXES = [
  ['packages/tokens/', '@ds/tokens'],
  ['packages/core/', '@ds/core'],
  ['packages/components/', '@ds/components']
];

const importPattern = /from\s+['"](@ds\/[a-zA-Z0-9-]+(?:\/[a-zA-Z0-9-]+)?)['"]|import\s+['"](@ds\/[a-zA-Z0-9-]+(?:\/[a-zA-Z0-9-]+)?)['"]/g;
const allowedDeps = new Map([
  ['@ds/tokens', new Set(['@ds/tokens'])],
  ['@ds/core', new Set(['@ds/core'])],
  ['@ds/components', new Set(['@ds/components', '@ds/core', '@ds/tokens'])]
]);
const violations = [];

const shouldSkip = (path) => path.includes('/node_modules/') || path.includes('/dist/');

const walk = (dir, onFile) => {
  for (const entry of readdirSync(dir)) {
    const next = join(dir, entry);
    const stats = statSync(next);
    if (stats.isDirectory()) {
      if (shouldSkip(next)) continue;
      walk(next, onFile);
    } else {
      onFile(next);
    }
  }
};

const ownerPackage = (filePath) => {
  const rel = relative(ROOT, filePath).replaceAll('\\', '/');
  for (const [prefix, pkg] of OWNER_PREFIXES) {
    if (rel.startsWith(prefix)) {
      return pkg;
    }
  }
  return null;
};

const rootPackageOf = (specifier) => {
  const parts = specifier.split('/');
  return parts.length >= 2 ? `${parts[0]}/${parts[1]}` : specifier;
};

walk(join(ROOT, 'packages'), (filePath) => {
  if (!filePath.endsWith('.ts') && !filePath.endsWith('.tsx')) return;

  const owner = ownerPackage(filePath);
  if (!owner) return;

  const content = readFileSync(filePath, 'utf8');
  const allowed = allowedDeps.get(owner) ?? new Set();
  for (const match of content.matchAll(importPattern)) {
    const dep = match[1] ?? match[2];
    if (!dep) continue;

    const depRoot = rootPackageOf(dep);
    if (!depRoot.startsWith('@ds/')) continue;
    if (allowed.has(depRoot)) continue;

    violations.push({
      file: relative(ROOT, filePath).replaceAll('\\', '/'),
      owner,
      dep,
      rule: `${owner} must not import ${depRoot}`
    });
  }
});

writeFileSync(join(REPORTS_DIR, 'boundary-violations.json'), `${JSON.stringify(violations, null, 2)}\n`);

if (violations.length === 0) {
  console.log('Boundary check passed');
  process.exit(0);
}

console.error(`Boundary check found ${violations.length} violation(s)`);
for (const violation of violations) {
  console.error(`- ${violation.file}: ${violation.rule}`);
}

if (warnOnly) {
  console.error('Warn-only mode enabled; exiting 0');
  process.exit(0);
}

process.exit(1);
