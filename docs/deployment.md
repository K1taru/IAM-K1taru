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

### Automatic deployment from the Pi

The workflow in `.github/workflows/ci.yml` runs lint, typecheck, build, and
tests on pull requests and pushes. Every five minutes, the Pi checks the latest
`main` push run through the GitHub API. It deploys only when that run succeeded
and its commit is still the current `main`. Failed or pending checks block
deployment. The Pi makes outbound connections only; no inbound SSH route or
GitHub Actions deployment secrets are needed. A green CI run means verification
passed, not that the Pi has deployed it; inspect the Pi timer log for deployment
status.

Set up the Pi once:

1. Keep a clean checkout on the `main` branch at
   `/home/k1taru/srv/IAM-K1taru`. The `k1taru` user must own it and be able to
   fetch `origin` without an interactive prompt.
2. Install Node.js 26 for `k1taru` (either on `PATH` or via nvm). Keep the
   repository-root `.env` with `PORT`, `SITE_URL`, and `SITE_INDEXABLE=true`.
   The systemd service must load that `.env`, run `scripts/serve.mjs`, and serve
   the `Client/out` path. The deployment creates releases beside the checkout
   at `/home/k1taru/srv/iam-k1taru-releases` and makes `Client/out` a symlink
   to the active release.
3. Give `k1taru` passwordless permission to restart only the portfolio service.
   Use `sudo visudo -f /etc/sudoers.d/iam-k1taru-deploy` and add:

   ```text
   k1taru ALL=(root) NOPASSWD: /usr/bin/systemctl restart iam-k1taru.service
   ```

4. Create a fine-grained GitHub personal access token restricted to this
   repository with **Actions: Read-only** permission. On the Pi, store only the
   token value in `/home/k1taru/srv/.iam-k1taru-github-token`, owned by
   `k1taru` with mode `600`. Keep it out of the repository and `.env` so the
   web server does not inherit it. Renew it before expiration. The Pi checkout
   must separately be able to fetch `origin main` without prompting.
5. On the Pi, install the timer and service from this checkout:

   ```sh
   sudo install -m 644 scripts/iam-k1taru-deploy.service /etc/systemd/system/
   sudo install -m 644 scripts/iam-k1taru-deploy.timer /etc/systemd/system/
   sudo systemctl daemon-reload
   sudo systemctl enable --now iam-k1taru-deploy.timer
   sudo systemctl start iam-k1taru-deploy.service
   journalctl -u iam-k1taru-deploy.service -n 50 --no-pager
   ```

   Run these commands from `/home/k1taru/srv/IAM-K1taru` after updating the
   checkout to the commit containing this timer. `systemctl start` performs an
   immediate first check; subsequent checks happen about every five minutes.

The deploy script builds in a temporary Git worktree, checks that `main` still
points to the tested commit, updates the Pi checkout with a fast-forward merge,
and switches the `Client/out` symlink to the built release. It restarts the
service and checks the local homepage. On a failed health check, it restores
the previous release. A dirty tracked checkout stops deployment so local work
is not overwritten.

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
