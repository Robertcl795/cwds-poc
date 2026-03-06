#!/usr/bin/env node
import { mkdirSync, readdirSync, readFileSync, statSync, writeFileSync } from 'node:fs';
import { join, relative } from 'node:path';

const ROOT = process.cwd();
const REPORTS_DIR = join(ROOT, 'reports');
mkdirSync(REPORTS_DIR, { recursive: true });

const importPattern = /from\s+['"](@ds\/[a-zA-Z0-9-]+(?:\/[a-zA-Z0-9-]+)?)['"]|import\s+['"](@ds\/[a-zA-Z0-9-]+(?:\/[a-zA-Z0-9-]+)?)['"]/g;
const edges = new Map();

const shouldSkip = (path) => path.includes('/node_modules/') || path.includes('/dist/') || path.includes('/storybook-static/');

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

const classifyOwner = (filePath) => {
  const rel = relative(ROOT, filePath).replaceAll('\\', '/');

  if (rel.startsWith('packages/tokens/')) return 'packages/tokens';
  if (rel.startsWith('packages/core/')) return 'packages/core';
  if (rel.startsWith('packages/components/')) return 'packages/components';
  if (rel.startsWith('apps/')) return `apps/${rel.split('/')[1]}`;
  if (rel.startsWith('rules/')) return 'rules';
  if (rel.startsWith('docs/')) return 'docs';
  return 'other';
};

for (const root of ['packages', 'apps', 'docs', 'rules']) {
  const dir = join(ROOT, root);
  if (!statSync(dir, { throwIfNoEntry: false })) continue;

  walk(dir, (filePath) => {
    if (!filePath.endsWith('.ts') && !filePath.endsWith('.tsx') && !filePath.endsWith('.md') && !filePath.endsWith('.json')) {
      return;
    }

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

const rows = [...edges.entries()]
  .map(([edge, count]) => ({ edge, count }))
  .sort((left, right) => left.edge.localeCompare(right.edge));

writeFileSync(join(REPORTS_DIR, 'import-graph.json'), `${JSON.stringify(rows, null, 2)}\n`);
console.log('Wrote reports/import-graph.json');
