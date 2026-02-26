import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const packageRoot = resolve(__dirname, '..');
const distDir = resolve(packageRoot, 'dist');

const tokenSources = [
  { file: 'reference.tokens.json', prefix: 'cv-ref' },
  { file: 'semantic.tokens.json', prefix: 'cv-sys' },
  { file: 'component.tokens.json', prefix: 'cv-comp' }
];

const flattenTokens = (prefix, value, path = []) => {
  if (typeof value === 'string') {
    return [`--${prefix}-${path.join('-')}: ${value};`];
  }

  return Object.entries(value).flatMap(([key, nested]) => flattenTokens(prefix, nested, [...path, key]));
};

const loadJson = async (filename) => {
  const contents = await readFile(resolve(packageRoot, 'src', filename), 'utf8');
  return JSON.parse(contents);
};

const generateCss = async () => {
  const lines = [':root {'];

  for (const source of tokenSources) {
    const tree = await loadJson(source.file);
    const variables = flattenTokens(source.prefix, tree).sort();
    lines.push(...variables.map((entry) => `  ${entry}`));
  }

  lines.push('}', '');
  return lines.join('\n');
};

const run = async () => {
  await mkdir(distDir, { recursive: true });

  const css = await generateCss();
  await writeFile(resolve(distDir, 'tokens.css'), css, 'utf8');

  await writeFile(
    resolve(distDir, 'index.js'),
    "export const tokenStylesheet = new URL('./tokens.css', import.meta.url).toString();\n",
    'utf8'
  );

  await writeFile(resolve(distDir, 'index.d.ts'), 'export declare const tokenStylesheet: string;\n', 'utf8');

  console.log('Generated tokens in packages/tokens/dist');
};

run().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
