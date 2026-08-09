# IAM-K1taru

The source for John Michael Garcia's applied machine learning and systems portfolio. The same Astro project is deployed independently at:

- `https://portfolio.k1taru.space/` from a Linux host
- `https://k1taru.github.io/IAM-K1taru/` from GitHub Pages

The site is static by design. It has no public application backend, database, authentication, uploads, contact form, cron job, or scheduled GitHub Actions workflow.

## Stack

- Astro 7 static output and typed content collections
- Tailwind CSS 4 through the official Vite plugin
- TypeScript and Astro validation
- A small Node.js static server managed by systemd on Linux
- GitHub Actions deployment to GitHub Pages

Astro remains a good fit because the portfolio is content-driven and does not need server rendering. Both deployments receive ordinary static HTML, CSS, JavaScript, and media.

## Local development

Requirements: Node.js 22 or newer.

```bash
cp .env.example .env
npm install
npm run dev
```

Useful checks:

```bash
npm run check
npm run build
npm run build:github
npm run build:linux
```

The host-specific builds deliberately use different public paths:

- `npm run build:github` builds for `https://k1taru.github.io/IAM-K1taru/` with the `/IAM-K1taru` base path.
- `npm run build:linux` builds for `https://portfolio.k1taru.space/` at the domain root.

Do not serve a GitHub build on the Linux domain or a Linux build on GitHub Pages; their asset and navigation base paths are different.

## Refresh-time deployment checks

Demo availability is checked only in each visitor's browser when a page loads or is refreshed. `public/scripts/site.js` sends an eight-second cross-origin `HEAD` request to each published demo URL and updates the status chips from that result. Projects without a demo are marked **Planned**.

Because browsers intentionally hide cross-origin response details in `no-cors` mode, the check answers only whether the target produced a network response. It does not inspect the response body or distinguish a healthy application page from an HTTP error page. This matches the lightweight, refresh-only status indicator and avoids a scheduler or monitoring backend.

Demo URLs remain controlled by project frontmatter in `src/content/projects`; visitors cannot add health-check destinations. The content security policy derives its allowed connection origins from those same URLs at build time.

## Linux deployment with one systemd service

The provided unit builds the root-path variant and serves `dist/` on `127.0.0.1:4321`. Your existing reverse proxy or tunnel can target that address.

Install dependencies once, then install and start the unit:

```bash
npm ci
sudo cp deploy/iam-k1taru.service /etc/systemd/system/iam-k1taru.service
sudo systemctl daemon-reload
sudo systemctl enable --now iam-k1taru.service
```

The checked-in unit already uses this machine's current user, absolute repository path, and NVM Node 25 path. If the repository or active Node installation moves, update `User`, `Group`, `WorkingDirectory`, `ReadWritePaths`, and `Environment=PATH=...` in the unit before installing it.

Common operations:

```bash
sudo systemctl status iam-k1taru.service
sudo journalctl -u iam-k1taru.service -f
sudo systemctl restart iam-k1taru.service
```

Each service start runs `npm run build:linux` before starting the static server. After pulling changes, restart the same service to rebuild and publish them. No timer or second service is required.

## Independent GitHub Pages deployment

`.github/workflows/deploy-pages.yml` runs only on pushes to `main` or manual dispatch. It builds with `npm run build:github`; there is no cron schedule.

For the `github.io` address to remain independently accessible, open **Repository Settings → Pages** and remove any value from **Custom domain**. Also keep the repository free of a `CNAME` file. GitHub performs this redirect at the Pages hosting layer, so Astro or client-side JavaScript cannot disable it.

If the setting is already empty here, check the Pages settings for the `K1taru.github.io` user-site repository. GitHub applies a user site's custom domain to project sites owned by the same account by default. Remove `portfolio.k1taru.space` from that user-site Pages configuration as well if it is the source of the redirect.

The Linux deployment can continue using `portfolio.k1taru.space` through your separately managed DNS/proxy configuration. Do not attach that hostname as the GitHub Pages custom domain when both URLs must work independently.

Before the first GitHub Pages deployment:

1. Open **Repository Settings → Pages**.
2. Select **GitHub Actions** as the source.
3. Ensure **Custom domain** is empty.
4. Push `main` or run the deployment workflow manually.

## Content model

Project case studies live in `src/content/projects`. Published entries must include:

- A precise role and team attribution
- At least one personal contribution
- Problem, architecture, outcome, and lesson sections
- An HTTPS repository URL
- Alt text for every gallery image

Set `draft: true` until those claims are approved. Team projects intentionally use conservative attribution.

## Security model

- Both hosts publish static artifacts and receive no application credentials or visitor-submitted data.
- The GitHub workflow has read-only repository access plus the narrowly scoped Pages and OIDC permissions required for publishing.
- An HTML-delivered content security policy limits scripts, connections, forms, objects, images, and fonts.
- Refresh-time demo checks use only build-controlled HTTPS targets and do not proxy visitor input.
- `/.well-known/security.txt` provides a public reporting route.

Review `SECURITY.md` before reporting or handling a vulnerability.

## Machine-readable portfolio

Both host variants publish `portfolio.json`, `llms.txt`, `robots.txt`, and the generated sitemap at their respective base paths. Canonical and structured-data URLs are compiled for the host selected by the build command.
