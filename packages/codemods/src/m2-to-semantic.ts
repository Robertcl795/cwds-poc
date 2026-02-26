import { readFile, writeFile } from 'node:fs/promises';

const replacements: Array<[RegExp, string]> = [
  [/mwc-button/g, 'cv-button'],
  [/mwc-checkbox/g, 'cv-checkbox'],
  [/mwc-dialog/g, 'cv-dialog'],
  [/mwc-textfield/g, 'cv-form-field']
];

const file = process.argv[2];
if (!file) {
  console.error('Usage: pnpm --filter @covalent-poc/codemods codemod:m2 -- <file>');
  process.exitCode = 1;
} else {
  const run = async (): Promise<void> => {
    let source = await readFile(file, 'utf8');

    for (const [pattern, target] of replacements) {
      source = source.replace(pattern, target);
    }

    await writeFile(file, source, 'utf8');
    console.log(`Updated ${file}`);
  };

  run().catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });
}
