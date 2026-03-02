#!/usr/bin/env node
import { createHash } from 'node:crypto';
import { mkdirSync, readdirSync, readFileSync, statSync, writeFileSync } from 'node:fs';
import { join, relative } from 'node:path';

const ROOT = process.cwd();
const REPORTS_DIR = join(ROOT, 'reports');
mkdirSync(REPORTS_DIR, { recursive: true });

const shouldSkip = (path) => path.includes('/node_modules/') || path.includes('/dist/') || path.includes('/storybook-static/');
const exts = new Set(['.ts', '.tsx', '.css', '.md', '.json']);

const walk = (dir, files) => {
  for (const entry of readdirSync(dir)) {
    const next = join(dir, entry);
    const s = statSync(next);
    if (s.isDirectory()) {
      if (shouldSkip(next)) continue;
      walk(next, files);
    } else {
      const ext = next.slice(next.lastIndexOf('.'));
      if (exts.has(ext)) files.push(next);
    }
  }
};

const files = [];
for (const base of ['packages', 'apps', 'docs', 'rules']) {
  const dir = join(ROOT, base);
  if (statSync(dir, { throwIfNoEntry: false })) {
    walk(dir, files);
  }
}

const byHash = new Map();
for (const filePath of files) {
  const content = readFileSync(filePath);
  const hash = createHash('sha1').update(content).digest('hex');
  const list = byHash.get(hash) ?? [];
  list.push(relative(ROOT, filePath).replaceAll('\\', '/'));
  byHash.set(hash, list);
}

const clusters = [...byHash.values()].filter((list) => list.length > 1);
clusters.sort((a, b) => b.length - a.length || a[0].localeCompare(b[0]));

writeFileSync(join(REPORTS_DIR, 'duplicate-files.json'), `${JSON.stringify(clusters, null, 2)}\n`);
console.log(`Wrote reports/duplicate-files.json (${clusters.length} clusters)`);
