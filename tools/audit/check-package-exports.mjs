#!/usr/bin/env node
import { readdirSync, readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join, relative } from 'node:path';

const SCRIPT_DIR = dirname(fileURLToPath(import.meta.url));
const ROOT = join(SCRIPT_DIR, '..', '..');
const PACKAGES_ROOT = join(ROOT, 'packages');

const findings = [];

const packageDirs = readdirSync(PACKAGES_ROOT, { withFileTypes: true })
  .filter((entry) => entry.isDirectory())
  .flatMap((scopeDir) => {
    const scopeRoot = join(PACKAGES_ROOT, scopeDir.name);
    return readdirSync(scopeRoot, { withFileTypes: true })
      .filter((entry) => entry.isDirectory())
      .map((entry) => join(scopeRoot, entry.name));
  });

const collectExportTargets = (value) => {
  if (typeof value === 'string') {
    return [value];
  }

  if (!value || typeof value !== 'object') {
    return [];
  }

  return Object.values(value).flatMap((entry) => collectExportTargets(entry));
};

for (const packageDir of packageDirs) {
  const packageJsonPath = join(packageDir, 'package.json');
  let packageJson;

  try {
    packageJson = JSON.parse(readFileSync(packageJsonPath, 'utf8'));
  } catch {
    continue;
  }

  const stability = packageJson.designSystem?.stability ?? 'unspecified';
  if (stability === 'experimental') {
    continue;
  }

  const exportTargets = collectExportTargets(packageJson.exports);
  for (const target of exportTargets) {
    if (typeof target !== 'string') {
      continue;
    }

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
