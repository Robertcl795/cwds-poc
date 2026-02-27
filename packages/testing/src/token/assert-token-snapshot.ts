import { readFile } from 'node:fs/promises';

export async function readTokenSnapshot(path: string): Promise<Record<string, unknown>> {
  const contents = await readFile(path, 'utf8');
  return JSON.parse(contents) as Record<string, unknown>;
}
