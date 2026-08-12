#!/usr/bin/env node
import { createReadStream, readFileSync } from 'node:fs';
import { stat } from 'node:fs/promises';
import { createServer } from 'node:http';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../dist');
const envPath = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../.env');

try {
  for (const line of readFileSync(envPath, 'utf8').split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const separator = trimmed.indexOf('=');
    if (separator === -1) continue;
    const key = trimmed.slice(0, separator).trim();
    const value = trimmed.slice(separator + 1).trim().replace(/^["']|["']$/g, '');
    if (key && process.env[key] === undefined) process.env[key] = value;
  }
} catch {
  // The checked-in example documents defaults; deployments may set real env vars instead.
}

const host = process.env.HOST || '127.0.0.1';
const port = Number.parseInt(process.env.PORT || '4321', 10);

const contentTypes = new Map([
  ['.css', 'text/css; charset=utf-8'],
  ['.html', 'text/html; charset=utf-8'],
  ['.ico', 'image/x-icon'],
  ['.jpg', 'image/jpeg'],
  ['.jpeg', 'image/jpeg'],
  ['.js', 'text/javascript; charset=utf-8'],
  ['.json', 'application/json; charset=utf-8'],
  ['.png', 'image/png'],
  ['.svg', 'image/svg+xml'],
  ['.txt', 'text/plain; charset=utf-8'],
  ['.webp', 'image/webp'],
  ['.woff', 'font/woff'],
  ['.woff2', 'font/woff2'],
  ['.xml', 'application/xml; charset=utf-8']
]);

const insideRoot = (candidate) => candidate === root || candidate.startsWith(`${root}${path.sep}`);

export async function resolveFile(pathname) {
  const decoded = decodeURIComponent(pathname);
  const candidate = path.resolve(root, `.${decoded}`);
  if (!insideRoot(candidate)) return null;

  const candidates = [candidate];
  if (decoded.endsWith('/')) candidates.unshift(path.join(candidate, 'index.html'));
  else if (!path.extname(candidate)) candidates.unshift(path.join(candidate, 'index.html'));

  for (const file of candidates) {
    try {
      if ((await stat(file)).isFile()) return file;
    } catch {
      // Try the next static-path form.
    }
  }
  return null;
}

export const server = createServer(async (request, response) => {
  if (request.method !== 'GET' && request.method !== 'HEAD') {
    response.writeHead(405, { Allow: 'GET, HEAD' }).end();
    return;
  }

  try {
    const pathname = new URL(request.url || '/', 'http://localhost').pathname;
    let file = await resolveFile(pathname);
    let statusCode = 200;
    if (!file) {
      file = path.join(root, '404.html');
      statusCode = 404;
    }

    const fileStats = await stat(file);
    const headers = {
      'Content-Type': contentTypes.get(path.extname(file).toLowerCase()) || 'application/octet-stream',
      'Content-Length': fileStats.size,
      'Cache-Control': pathname.includes('/_astro/') ? 'public, max-age=31536000, immutable' : 'no-cache',
      'Referrer-Policy': 'strict-origin-when-cross-origin',
      'X-Content-Type-Options': 'nosniff',
      'X-Frame-Options': 'DENY'
    };
    response.writeHead(statusCode, headers);
    if (request.method === 'HEAD') response.end();
    else createReadStream(file).pipe(response);
  } catch {
    response.writeHead(400, { 'Content-Type': 'text/plain; charset=utf-8' }).end('Bad request');
  }
});

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  server.listen(port, host, () => {
    console.log(`IAM-K1taru is serving ${root} at http://${host}:${port}`);
  });

  server.on('error', (error) => {
    console.error(`Static server failed: ${error.message}`);
    process.exitCode = 1;
  });

  const shutdown = () => server.close(() => process.exit(0));
  process.on('SIGINT', shutdown);
  process.on('SIGTERM', shutdown);
}
