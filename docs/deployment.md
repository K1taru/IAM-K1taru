# Deploy the portfolio

From `Client/`, use Node.js 26 and run `npm ci`, `npm run lint`,
`npm run typecheck`, and `npm run build`. Both hosts serve the contents of `Client/out/`.
Set `SITE_URL` to the primary HTTPS origin at build time. Use `SITE_INDEXABLE=true`
on the primary deployment and `false` on mirrors and previews.

## Raspberry Pi

Serve `Client/out/` from an Nginx release directory behind the existing HTTPS ingress.
Use `try_files $uri $uri/ =404` for pages and `error_page 404 /404.html` for
missing routes. Verify the new release before switching the active symlink.
Keep the previous release directory and repoint the symlink to roll back.

To enable live status, run `node services/demo-status/server.mjs` from the repository root under systemd,
proxy `/api/live/` to `http://127.0.0.1:4100` with the request path preserved,
and set `NEXT_PUBLIC_DEMO_STATUS_BASE_URL=/api/live/v1` for the site build.

Pass `DEMO_HEALTH_ENDPOINTS` to the service as a JSON map of project slugs to
approved public HTTPS endpoints. Set `DEMO_ALLOWED_ORIGINS` to the stable
Vercel origin if its production build uses the service. `DEMO_STATUS_PORT`
defaults to `4100`. Confirm the standalone site still works by stopping the
service after a successful smoke check.

## Vercel

Set the Vercel Root Directory to `Client`. Use Node.js 26,
`npm run build` as the build command, and `out` as the output directory.
Use `development` for previews and `main` for production after cutover. Leave
`NEXT_PUBLIC_DEMO_STATUS_BASE_URL` empty for standalone previews. For live
production status, use the Pi’s public HTTPS base URL ending in `/api/live/v1`.

## Cutover

Check the homepage, every published project URL, direct refreshes, static
assets, sitemap URLs, and 404s on both hosts. Check that `/portfolio.json` and
`/llms.txt` list the published projects and use the primary HTTPS origin.
Verify that social preview images resolve on that origin.

The old Astro site also shipped to GitHub Pages. Verify who still links to
that hostname and decide how to transition it before changing the legacy
Pages deployment.
