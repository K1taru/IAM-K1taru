#!/usr/bin/env node
import { promises as fs } from 'node:fs';
import path from 'node:path';
import dns from 'node:dns/promises';
import { fileURLToPath } from 'node:url';
import {
  classifyHttpStatus,
  isPrivateOrReservedIp,
  normalizeRepo,
  parseRepositoryList,
  validatePublicHttpsUrl
} from './lib/sync-utils.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const configPath = process.env.PROJECT_CONFIG || path.join(root, 'config/projects.json');
const outputPath = process.env.STATUS_OUTPUT || path.join(root, 'public/data/project-status.json');
const cachePath = process.env.SYNC_CACHE_FILE || path.join(root, '.cache/github-cache.json');
const githubToken = process.env.GITHUB_TOKEN?.trim();
const timeoutMs = Math.min(Math.max(Number(process.env.PROJECT_STATUS_TIMEOUT_MS || 8000), 1000), 15000);
const maxRedirects = 3;

async function readJson(file, fallback) {
  try { return JSON.parse(await fs.readFile(file, 'utf8')); } catch { return fallback; }
}

async function writeJsonAtomic(file, value) {
  await fs.mkdir(path.dirname(file), { recursive: true });
  const temporary = `${file}.${process.pid}.tmp`;
  await fs.writeFile(temporary, `${JSON.stringify(value, null, 2)}\n`, { mode: 0o644 });
  await fs.rename(temporary, file);
}

async function assertPublicDns(url) {
  const records = await dns.lookup(url.hostname, { all: true, verbatim: true });
  if (records.length === 0) throw new Error('Hostname returned no addresses.');
  if (records.some(({ address }) => isPrivateOrReservedIp(address))) {
    throw new Error('Hostname resolved to a private or reserved address.');
  }
}

async function requestWithRedirects(input, method = 'HEAD', redirects = 0) {
  const url = validatePublicHttpsUrl(input);
  await assertPublicDns(url);
  const response = await fetch(url, {
    method,
    redirect: 'manual',
    signal: AbortSignal.timeout(timeoutMs),
    headers: method === 'GET' ? { Range: 'bytes=0-1023', 'User-Agent': 'IAM-K1taru-Status/1.0' } : { 'User-Agent': 'IAM-K1taru-Status/1.0' }
  });

  if ([301, 302, 303, 307, 308].includes(response.status)) {
    response.body?.cancel();
    if (redirects >= maxRedirects) throw new Error('Demo URL exceeded the redirect limit.');
    const location = response.headers.get('location');
    if (!location) throw new Error('Redirect response did not include a location.');
    return requestWithRedirects(new URL(location, url), method, redirects + 1);
  }

  response.body?.cancel();
  return { status: response.status, finalUrl: url.toString() };
}

async function checkDemo(value) {
  if (!value) return { state: 'planned' };
  try {
    let result = await requestWithRedirects(value, 'HEAD');
    if (result.status === 405 || result.status === 501) result = await requestWithRedirects(value, 'GET');
    return { url: result.finalUrl, state: classifyHttpStatus(result.status), statusCode: result.status };
  } catch (error) {
    return { url: String(value), state: 'offline', error: error instanceof Error ? error.message : 'Health check failed.' };
  }
}

async function fetchRepository(repo, cached) {
  const [owner, name] = normalizeRepo(repo).split('/');
  const headers = {
    Accept: 'application/vnd.github+json',
    'X-GitHub-Api-Version': '2022-11-28',
    'User-Agent': 'IAM-K1taru-Sync/1.0'
  };
  if (githubToken) headers.Authorization = `Bearer ${githubToken}`;
  if (cached?.etag) headers['If-None-Match'] = cached.etag;

  try {
    const response = await fetch(`https://api.github.com/repos/${encodeURIComponent(owner)}/${encodeURIComponent(name)}`, {
      headers,
      signal: AbortSignal.timeout(timeoutMs)
    });
    if (response.status === 304 && cached?.data) return cached;
    if (!response.ok) throw new Error(`GitHub returned ${response.status}.`);
    const body = await response.json();
    const data = {
      state: 'ok',
      primaryLanguage: body.language,
      stars: body.stargazers_count,
      forks: body.forks_count,
      topics: body.topics || [],
      pushedAt: body.pushed_at,
      updatedAt: body.updated_at,
      archived: Boolean(body.archived)
    };
    return { etag: response.headers.get('etag'), data };
  } catch (error) {
    if (cached?.data) return { ...cached, stale: true, error: error instanceof Error ? error.message : 'GitHub request failed.' };
    return { data: { state: 'error' }, error: error instanceof Error ? error.message : 'GitHub request failed.' };
  }
}

async function main() {
  const configured = await readJson(configPath, []);
  if (!Array.isArray(configured)) throw new Error('Project configuration must be an array.');
  const configuredRepos = configured.map((project) => normalizeRepo(project.repo));
  const requestedRepos = process.env.GITHUB_REPOSITORIES
    ? parseRepositoryList(process.env.GITHUB_REPOSITORIES)
    : configuredRepos;
  if (requestedRepos.length === 0 || requestedRepos.length > 25) {
    throw new Error('Repository allowlist must contain between 1 and 25 entries.');
  }

  const configByRepo = new Map(configured.map((project) => [normalizeRepo(project.repo), project]));
  const cache = await readJson(cachePath, { github: {} });

  const projects = [];
  for (const repo of requestedRepos) {
    const project = configByRepo.get(repo) || { repo };
    const github = await fetchRepository(repo, cache.github?.[repo]);
    cache.github ||= {};
    cache.github[repo] = { etag: github.etag, data: github.data };
    const demo = await checkDemo(project.demo);
    projects.push({ repo, github: github.data, demo });
  }

  const payload = { version: 1, checkedAt: new Date().toISOString(), projects };
  await writeJsonAtomic(outputPath, payload);
  await writeJsonAtomic(cachePath, cache);
  console.log(`Updated ${projects.length} allowlisted projects at ${outputPath}`);
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
