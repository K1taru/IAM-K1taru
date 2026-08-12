#!/usr/bin/env node
import { access } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const astroBin = path.join(root, 'node_modules/.bin/astro');

try {
  await access(astroBin);
} catch {
  console.error('Missing Astro dependency. Run `npm ci` in the project directory before starting iam-k1taru.service.');
  process.exit(1);
}
