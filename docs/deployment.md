# Deploy the portfolio

Copy `.env.example` to `.env` at the repository root and set its deployment
values. From `Client/`, use Node.js 26 and run `npm ci`, `npm run lint`, and
`npm run typecheck`. Build the Pi copy with the root environment file:

```sh
set -a
. ../.env
set +a
npm run build
```

Both hosts serve the contents of `Client/out/`.

## Raspberry Pi

On the Pi, check out this repository at `/home/k1taru/srv/IAM-K1taru`,
install Node.js 26 with `nvm install 26` as `k1taru`, and build from `Client/`.

Serve `Client/out/` through the local static server in `scripts/serve.mjs`.
Set `PORT` in the repository-root `.env` to the local port already configured
in your Cloudflare Tunnel. This single file contains the static server and site
build settings. The server binds only to loopback.

After updating `/etc/systemd/system/iam-k1taru.service`, reload systemd and
restart the service:

```sh
sudo systemctl daemon-reload
sudo systemctl enable iam-k1taru.service
sudo systemctl restart iam-k1taru.service
```

## Vercel

Set the Vercel Root Directory to `Client`. Use Node.js 26 and the default
Next.js build and output settings; Vercel detects the static export.
Use `development` for previews and `main` for production after cutover.
Set `SITE_URL=https://portfolio.k1taru.space` and
`SITE_INDEXABLE=false` for preview deployments, and `true` only for the primary
Pi-aligned production deployment.
Keep the Vercel deployment on its own hostname while the Cloudflare Tunnel owns
`portfolio.k1taru.space`.

## Cutover

Check the homepage, every published project URL, direct refreshes, static
assets, sitemap URLs, and 404s on both hosts. Check that `/portfolio.json` and
`/llms.txt` list the published projects and use the primary HTTPS origin.
Verify that social preview images resolve on that origin.

## Deployment matrix

| Host | Public origin | Static files |
| --- | --- | --- |
| Raspberry Pi / Cloudflare Tunnel | `https://portfolio.k1taru.space` | `Client/out/` via the port in `.env` |
| Vercel | Vercel production URL or custom production hostname | Vercel build of `Client/out/` |

The same source must be built separately for each host because `SITE_URL` is
compiled at build time.

The old Astro site also shipped to GitHub Pages. Verify who still links to
that hostname and decide how to transition it before changing the legacy
Pages deployment.
