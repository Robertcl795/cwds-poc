#!/usr/bin/env node
import { mkdirSync, readdirSync, readFileSync, statSync, writeFileSync } from 'node:fs';
import { join, relative } from 'node:path';

const ROOT = process.cwd();
const REPORTS_DIR = join(ROOT, 'reports');
mkdirSync(REPORTS_DIR, { recursive: true });
const warnOnly = process.argv.includes('--warn');

const groupByPackage = new Map([
  ['@ds/tokens', 'design-core'],
  ['@ds/styles', 'design-core'],
  ['@ds/core', 'design-core'],
  ['@ds/utils-a11y', 'design-core'],
  ['@ds/utils-icons', 'design-core'],
  ['@ds/primitives', 'ui-system'],
  ['@ds/web-components', 'ui-system'],
  ['@ds/angular', 'ui-system']
]);

const packageByPathPrefix = [
  ['packages/ui-system/angular/', '@ds/angular'],
  ['packages/ui-system/web-components/', '@ds/web-components'],
  ['packages/design-core/core/', '@ds/core'],
  ['packages/ui-system/primitives/', '@ds/primitives'],
  ['packages/design-core/styles/', '@ds/styles'],
  ['packages/design-core/tokens/', '@ds/tokens'],
  ['packages/design-core/utils-a11y/', '@ds/utils-a11y'],
  ['packages/design-core/utils-icons/', '@ds/utils-icons']
];

const importPattern = /from\s+['\"](@ds\/[a-zA-Z0-9-]+)['\"]|import\s+['\"](@ds\/[a-zA-Z0-9-]+)['\"]/g;
const violations = [];

const shouldSkip = (path) => path.includes('/node_modules/') || path.includes('/dist/');

const walk = (dir, onFile) => {
  for (const entry of readdirSync(dir)) {
    const next = join(dir, entry);
    const s = statSync(next);
    if (s.isDirectory()) {
      if (shouldSkip(next)) continue;
      walk(next, onFile);
    } else {
      onFile(next);
    }
  }
};

const ownerPackage = (filePath) => {
  const rel = relative(ROOT, filePath).replaceAll('\\', '/');
  for (const [prefix, pkg] of packageByPathPrefix) {
    if (rel.startsWith(prefix)) return pkg;
  }
  return null;
};

walk(join(ROOT, 'packages'), (filePath) => {
  if (!filePath.endsWith('.ts') && !filePath.endsWith('.tsx')) return;

  const owner = ownerPackage(filePath);
  if (!owner) return;
  const ownerGroup = groupByPackage.get(owner);
  if (!ownerGroup) return;

  const content = readFileSync(filePath, 'utf8');
  for (const match of content.matchAll(importPattern)) {
    const dep = match[1] ?? match[2];
    if (!dep || !groupByPackage.has(dep)) continue;

    const depGroup = groupByPackage.get(dep);
    if (ownerGroup === 'design-core' && depGroup === 'ui-system') {
      violations.push({
        file: relative(ROOT, filePath).replaceAll('\\', '/'),
        owner,
        dep,
        rule: 'design-core must not import ui-system'
      });
    }
  }
});

writeFileSync(join(REPORTS_DIR, 'boundary-violations.json'), `${JSON.stringify(violations, null, 2)}\n`);

if (violations.length === 0) {
  console.log('Boundary check passed');
  process.exit(0);
}

console.error(`Boundary check found ${violations.length} violation(s)`);
for (const v of violations) {
  console.error(`- ${v.file}: ${v.owner} -> ${v.dep} (${v.rule})`);
}

if (warnOnly) {
  console.error('Warn-only mode enabled; exiting 0');
  process.exit(0);
}

process.exit(1);
