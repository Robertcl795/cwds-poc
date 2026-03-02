#!/usr/bin/env node
import { mkdirSync, readdirSync, readFileSync, statSync, writeFileSync } from 'node:fs';
import { join, relative } from 'node:path';

const ROOT = process.cwd();
const REPORTS_DIR = join(ROOT, 'reports');
mkdirSync(REPORTS_DIR, { recursive: true });

const packageGroup = new Map([
  ['@ds/tokens', 'design-core'],
  ['@ds/styles', 'design-core'],
  ['@ds/core', 'design-core'],
  ['@ds/utils-a11y', 'design-core'],
  ['@ds/utils-icons', 'design-core'],
  ['@ds/primitives', 'ui-system'],
  ['@ds/web-components', 'ui-system'],
  ['@ds/angular', 'ui-system']
]);

const rows = [];

const collectPackageDirs = (baseDir, maxDepth = 2) => {
  const out = [];
  const walk = (dir, depth) => {
    if (depth > maxDepth) {
      return;
    }

    for (const entry of readdirSync(dir)) {
      const next = join(dir, entry);
      if (!statSync(next).isDirectory()) {
        continue;
      }

      const manifest = join(next, 'package.json');
      try {
        const json = JSON.parse(readFileSync(manifest, 'utf8'));
        out.push({
          path: relative(ROOT, next).replaceAll('\\', '/'),
          name: json.name
        });
        continue;
      } catch {}

      walk(next, depth + 1);
    }
  };

  walk(join(ROOT, baseDir), 1);
  return out;
};

for (const pkg of collectPackageDirs('packages', 3)) {
  rows.push({
    kind: 'package',
    path: pkg.path,
    name: pkg.name,
    group: packageGroup.get(pkg.name) ?? 'unknown'
  });
}

for (const app of collectPackageDirs('apps', 2)) {
  rows.push({
    kind: 'app',
    path: app.path,
    name: app.name,
    group: 'app'
  });
}
rows.push({ kind: 'rules', path: 'rules', name: null, group: 'rules' });
rows.push({ kind: 'docs', path: 'docs', name: null, group: 'rules' });

writeFileSync(join(REPORTS_DIR, 'inventory.json'), `${JSON.stringify(rows, null, 2)}\n`);

const summary = rows.reduce((acc, row) => {
  const key = row.group;
  acc[key] = (acc[key] ?? 0) + 1;
  return acc;
}, {});

writeFileSync(join(REPORTS_DIR, 'inventory-summary.json'), `${JSON.stringify(summary, null, 2)}\n`);
console.log('Wrote reports/inventory.json and reports/inventory-summary.json');
