# IAM-K1taru

The source for John Michael Garcia's applied machine learning and systems portfolio. The same Astro project can be deployed independently at:

- a custom-domain Linux host
- a GitHub Pages project site

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

Set local and production-facing values in `.env`. Keep real hostnames, bind addresses, ports, contact addresses, and analytics tokens out of public documentation.

Useful checks:

```bash
npm run check
npm run build
npm run build:github
npm run build:linux
```

The host-specific builds deliberately use different public paths:

- `npm run build:github` builds for a GitHub Pages project URL with the repository-name base path.
- `npm run build:linux` builds for a custom domain served at the domain root.

Do not serve a GitHub build on the Linux domain or a Linux build on GitHub Pages; their asset and navigation base paths are different.

## Refresh-time deployment checks

Demo availability is checked only in each visitor's browser when a page loads or is refreshed. `public/scripts/site.js` sends an eight-second cross-origin `HEAD` request to each published demo URL and updates the status chips from that result. Projects without a demo are marked **Planned**.

Because browsers intentionally hide cross-origin response details in `no-cors` mode, the check answers only whether the target produced a network response. It does not inspect the response body or distinguish a healthy application page from an HTTP error page. This matches the lightweight, refresh-only status indicator and avoids a scheduler or monitoring backend.

Demo URLs remain controlled by project frontmatter in `src/content/projects`; visitors cannot add health-check destinations. The content security policy derives its allowed connection origins from those same URLs at build time.

## Linux deployment with one systemd service

Build the root-path variant before starting the provided unit. The unit serves `dist/` using `HOST` and `PORT` from `.env`. Point your reverse proxy or tunnel at the configured local bind address.

Install dependencies, build the site, then install the unit in `/etc/systemd/system`:

```bash
npm ci
npm run build:linux
sudo install -m 0644 deploy/iam-k1taru.service /etc/systemd/system/iam-k1taru.service
sudo systemctl daemon-reload
sudo systemctl enable --now iam-k1taru.service
```

Before installing the unit, update `User`, `Group`, `WorkingDirectory`, `EnvironmentFile`, `Environment=PATH=...`, and the `dist/index.html` path for the target machine.

The service intentionally does not install dependencies or build the project. If `npm ci` or `npm run build:linux` fails, resolve that command directly before starting the service. If `dist/index.html` is missing, systemd stops immediately instead of serving an incomplete deployment.

Common operations:

```bash
sudo systemctl status iam-k1taru.service
sudo journalctl -u iam-k1taru.service -f
sudo systemctl restart iam-k1taru.service
```

After pulling changes, run `npm ci`, run `npm run build:linux`, and restart the service to publish the new static files. No timer or second service is required.

## Independent GitHub Pages deployment

`.github/workflows/deploy-pages.yml` runs only on pushes to `main` or manual dispatch. It builds with `npm run build:github`; there is no cron schedule.

For the GitHub Pages address to remain independently accessible, open **Repository Settings → Pages** and remove any value from **Custom domain**. Also keep the repository free of a `CNAME` file. GitHub performs this redirect at the Pages hosting layer, so Astro or client-side JavaScript cannot disable it.

If the setting is already empty here, check the Pages settings for the account's user-site repository. GitHub can apply a user site's custom domain to project sites owned by the same account by default. Remove any custom domain from that user-site Pages configuration as well if it is the source of the redirect.

The Linux deployment can continue using its custom domain through separately managed DNS or proxy configuration. Do not attach that hostname as the GitHub Pages custom domain when both URLs must work independently.

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

Both host variants publish `portfolio.json`, `llms.txt`, `robots.txt`, and the generated sitemap at their respective base paths. Canonical and structured-data URLs are compiled for the host selected by the build command or environment.
