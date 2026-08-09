import net from 'node:net';

export function normalizeRepo(value) {
  const trimmed = String(value || '').trim();
  const githubMatch = trimmed.match(/^https:\/\/github\.com\/([^/]+)\/([^/#?]+?)(?:\.git)?\/?$/i);
  const candidate = githubMatch ? `${githubMatch[1]}/${githubMatch[2]}` : trimmed;
  if (!/^[A-Za-z0-9_.-]+\/[A-Za-z0-9_.-]+$/.test(candidate)) {
    throw new Error(`Invalid GitHub repository identifier: ${trimmed}`);
  }
  const [owner, repository] = candidate.split('/');
  if (owner === '.' || owner === '..' || repository === '.' || repository === '..') {
    throw new Error(`Invalid GitHub repository identifier: ${trimmed}`);
  }
  return candidate;
}

export function parseRepositoryList(value) {
  const repositories = String(value || '')
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean)
    .map(normalizeRepo);
  return [...new Set(repositories)];
}

export function isPrivateOrReservedIp(address) {
  const version = net.isIP(address);
  if (version === 4) {
    const octets = address.split('.').map(Number);
    const [a = 0, b = 0] = octets;
    return (
      a === 0 || a === 10 || a === 127 || a >= 224 ||
      (a === 100 && b >= 64 && b <= 127) ||
      (a === 169 && b === 254) ||
      (a === 172 && b >= 16 && b <= 31) ||
      (a === 192 && b === 0) ||
      (a === 192 && b === 168) ||
      (a === 192 && b === 0 && octets[2] === 2) ||
      (a === 198 && (b === 18 || b === 19 || b === 51)) ||
      (a === 203 && b === 0 && octets[2] === 113)
    );
  }
  if (version === 6) {
    const lower = address.toLowerCase();
    if (lower.startsWith('::ffff:')) {
      return isPrivateOrReservedIp(lower.slice(7));
    }
    return lower === '::' || lower === '::1' || lower.startsWith('fc') || lower.startsWith('fd') ||
      lower.startsWith('fe8') || lower.startsWith('fe9') || lower.startsWith('fea') || lower.startsWith('feb') ||
      lower.startsWith('ff') || lower.startsWith('2001:db8');
  }
  return true;
}

export function validatePublicHttpsUrl(value) {
  const url = value instanceof URL ? new URL(value) : new URL(String(value));
  if (url.protocol !== 'https:') throw new Error('Demo URL must use HTTPS.');
  if (url.username || url.password) throw new Error('Demo URL cannot contain credentials.');
  if (url.port && url.port !== '443') throw new Error('Demo URL must use the standard HTTPS port.');
  const hostname = url.hostname.toLowerCase().replace(/\.$/, '');
  if (!hostname.includes('.') || hostname === 'localhost' || /\.(?:localhost|local|internal|home)$/.test(hostname)) {
    throw new Error('Demo URL must use a public hostname.');
  }
  if (net.isIP(hostname) && isPrivateOrReservedIp(hostname)) {
    throw new Error('Demo URL cannot target a private or reserved address.');
  }
  url.hash = '';
  return url;
}

export function classifyHttpStatus(status) {
  if (status >= 200 && status < 400) return 'online';
  if (status === 401 || status === 403) return 'online';
  return 'offline';
}
