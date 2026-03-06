#!/usr/bin/env node
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join, relative } from 'node:path';

const SCRIPT_DIR = dirname(fileURLToPath(import.meta.url));
const ROOT = join(SCRIPT_DIR, '..', '..');
const PACKAGES_ROOT = join(ROOT, 'packages');

const findings = [];

const collectPackageDirs = (dir) => {
  const out = [];
  for (const entry of readdirSync(dir)) {
    const next = join(dir, entry);
    if (!statSync(next).isDirectory()) continue;

    const manifest = join(next, 'package.json');
    try {
      JSON.parse(readFileSync(manifest, 'utf8'));
      out.push(next);
      continue;
    } catch {}

    out.push(...collectPackageDirs(next));
  }
  return out;
};

const collectExportTargets = (value) => {
  if (typeof value === 'string') return [value];
  if (!value || typeof value !== 'object') return [];
  return Object.values(value).flatMap((entry) => collectExportTargets(entry));
};

for (const packageDir of collectPackageDirs(PACKAGES_ROOT)) {
  const packageJsonPath = join(packageDir, 'package.json');
  const packageJson = JSON.parse(readFileSync(packageJsonPath, 'utf8'));

  if ((packageJson.designSystem?.stability ?? 'unspecified') === 'experimental') {
    continue;
  }

  for (const target of collectExportTargets(packageJson.exports)) {
    if (typeof target !== 'string') continue;
    if (target.includes('/src/')) {
      findings.push({
        package: packageJson.name,
        file: relative(ROOT, packageJsonPath).replaceAll('\\', '/'),
        target
      });
    }
  }
}

if (findings.length === 0) {
  console.log('Package export check passed');
  process.exit(0);
}

console.error(`Package export findings: ${findings.length}`);
for (const finding of findings) {
  console.error(`- ${finding.package} (${finding.file}) exports source path: ${finding.target}`);
}
process.exit(1);
