const basePath = import.meta.env.BASE_URL || '/';

const ensureTrailingSlash = (value: string) => value.endsWith('/') ? value : `${value}/`;

export const withBasePath = (path = '/') => {
  if (/^(?:[a-z][a-z\d+.-]*:|#)/i.test(path)) return path;

  const base = ensureTrailingSlash(basePath);
  const normalizedPath = path.startsWith('/') ? path.slice(1) : path;

  return new URL(normalizedPath, `https://local.invalid${base}`).pathname;
};

export const absoluteUrl = (path = '/', siteUrl: string) => {
  const normalizedPath = path.startsWith('/') ? path.slice(1) : path;

  return new URL(normalizedPath, ensureTrailingSlash(siteUrl)).toString();
};
