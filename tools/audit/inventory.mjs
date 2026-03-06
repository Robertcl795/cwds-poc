#!/usr/bin/env node
import { mkdirSync, readdirSync, readFileSync, statSync, writeFileSync } from 'node:fs';
import { join, relative } from 'node:path';

const ROOT = process.cwd();
const REPORTS_DIR = join(ROOT, 'reports');
mkdirSync(REPORTS_DIR, { recursive: true });

const groupFor = (name) => {
  if (name === '@ds/tokens' || name === '@ds/core' || name === '@ds/components') {
    return 'design-system';
  }

  if (name === '@ds/storybook' || name === '@ds/ux-showcase') {
    return 'app';
  }

  return 'unknown';
};

const rows = [];

const collectPackageDirs = (baseDir) => {
  const out = [];
  const walk = (dir) => {
    for (const entry of readdirSync(dir)) {
      const next = join(dir, entry);
      if (!statSync(next).isDirectory()) continue;

      const manifest = join(next, 'package.json');
      try {
        const json = JSON.parse(readFileSync(manifest, 'utf8'));
        out.push({
          path: relative(ROOT, next).replaceAll('\\', '/'),
          name: json.name
        });
        continue;
      } catch {}

      walk(next);
    }
  };

  walk(join(ROOT, baseDir));
  return out;
};

for (const pkg of collectPackageDirs('packages')) {
  rows.push({
    kind: 'package',
    path: pkg.path,
    name: pkg.name,
    group: groupFor(pkg.name)
  });
}

for (const app of collectPackageDirs('apps')) {
  rows.push({
    kind: 'app',
    path: app.path,
    name: app.name,
    group: 'app'
  });
}

if (statSync(join(ROOT, 'rules'), { throwIfNoEntry: false })) {
  rows.push({ kind: 'rules', path: 'rules', name: null, group: 'rules' });
}

writeFileSync(join(REPORTS_DIR, 'inventory.json'), `${JSON.stringify(rows, null, 2)}\n`);

const summary = rows.reduce((accumulator, row) => {
  accumulator[row.group] = (accumulator[row.group] ?? 0) + 1;
  return accumulator;
}, {});

writeFileSync(join(REPORTS_DIR, 'inventory-summary.json'), `${JSON.stringify(summary, null, 2)}\n`);
console.log('Wrote reports/inventory.json and reports/inventory-summary.json');
