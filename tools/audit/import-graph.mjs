#!/usr/bin/env node
import { mkdirSync, readdirSync, readFileSync, statSync, writeFileSync } from 'node:fs';
import { join, relative } from 'node:path';

const ROOT = process.cwd();
const REPORTS_DIR = join(ROOT, 'reports');
mkdirSync(REPORTS_DIR, { recursive: true });

const importPattern = /from\s+['\"](@ds\/[a-zA-Z0-9-]+)['\"]|import\s+['\"](@ds\/[a-zA-Z0-9-]+)['\"]/g;
const edges = new Map();

const shouldSkip = (path) => path.includes('/node_modules/') || path.includes('/dist/') || path.includes('/storybook-static/');

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

const classifyOwner = (filePath) => {
  const rel = relative(ROOT, filePath).replaceAll('\\', '/');
  const packagePrefixes = [
    'packages/design-core/core/',
    'packages/design-core/styles/',
    'packages/design-core/tokens/',
    'packages/design-core/utils-a11y/',
    'packages/design-core/utils-icons/',
    'packages/ui-system/primitives/',
    'packages/ui-system/web-components/',
    'packages/ui-system/angular/'
  ];

  for (const prefix of packagePrefixes) {
    if (rel.startsWith(prefix)) {
      return prefix.slice(0, -1);
    }
  }

  if (rel.startsWith('apps/')) {
    return `apps/${rel.split('/')[1]}`;
  }
  if (rel.startsWith('docs/')) {
    return 'docs';
  }
  if (rel.startsWith('rules/')) {
    return 'rules';
  }
  return 'other';
};

for (const root of ['packages', 'apps', 'docs', 'rules']) {
  const dir = join(ROOT, root);
  if (!statSync(dir, { throwIfNoEntry: false })) continue;
  walk(dir, (filePath) => {
    if (!filePath.endsWith('.ts') && !filePath.endsWith('.tsx') && !filePath.endsWith('.md') && !filePath.endsWith('.json')) return;
    const content = readFileSync(filePath, 'utf8');
    const owner = classifyOwner(filePath);
    for (const match of content.matchAll(importPattern)) {
      const dep = match[1] ?? match[2];
      if (!dep) continue;
      const key = `${owner} -> ${dep}`;
      edges.set(key, (edges.get(key) ?? 0) + 1);
    }
  });
}

const rows = [...edges.entries()].map(([edge, count]) => ({ edge, count })).sort((a, b) => a.edge.localeCompare(b.edge));
writeFileSync(join(REPORTS_DIR, 'import-graph.json'), `${JSON.stringify(rows, null, 2)}\n`);
console.log('Wrote reports/import-graph.json');
