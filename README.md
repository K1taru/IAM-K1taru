# IAM-K1taru

The source for [portfolio.k1taru.space](https://portfolio.k1taru.space), John Michael Garcia's applied machine learning and systems portfolio.

The site is static by design. It has no public application backend, database, authentication, uploads, or contact form. GitHub Actions refreshes allowlisted GitHub metadata and deployment health before each deployment and every 6 minutes.

## Stack

- Astro 7 static output and typed content collections
- Tailwind CSS 4 through the official Vite plugin
- TypeScript and Astro validation
- GitHub Pages hosting
- GitHub Actions deployment and scheduled status refresh

Tailwind utilities handle page layout, spacing, responsive composition, and selected typography. The custom design system in `src/styles/global.css` provides the light/dark color tokens, Raspy-inspired surfaces, constellation, and reusable component skins.

## Local development

Requirements: Node.js 22 or newer.

```bash
cp .env.example .env
npm install
npm run dev
```

The development server listens only on `127.0.0.1`. Useful checks:

```bash
npm run check
npm run build
npm run sync:projects
```

The sync command writes `public/data/project-status.json` by default. A read-only `GITHUB_TOKEN` is optional; never expose it with a `PUBLIC_` prefix.

## Content model

Project case studies live in `src/content/projects`. Published entries must include:

- A precise role and team attribution
- At least one personal contribution
- Problem, architecture, outcome, and lesson sections
- An HTTPS repository URL
- Alt text for every gallery image

Set `draft: true` until those claims are approved. Team projects intentionally use conservative attribution. The résumé, portrait, graduation date, work timeline, and unverified metrics remain unpublished until approved content is available.

The repository allowlist and demo health targets are in `config/projects.json`. Visitor input can never add a health-check destination.

## Environment and domain

`.env.example` documents the local build contract. GitHub Actions supplies the production site URL and its short-lived workflow token directly to the build. Do not commit a populated `.env` file.

`SITE_URL` is compiled into canonical URLs, the sitemap, structured data, and machine-readable endpoints. The current production value is `https://portfolio.k1taru.space`.

To change the production domain:

1. Update `SITE_URL` in `.github/workflows/deploy-pages.yml` and `.env.example`.
2. Update `site.url`'s fallback in `src/data/site.ts` and the `site` fallback in `astro.config.mjs`.
3. Update `public/CNAME`.
4. Configure the custom domain under **Repository Settings → Pages** and update its DNS records.
5. Deploy again.

## GitHub Pages deployment

The deployment workflow in `.github/workflows/deploy-pages.yml` runs on:

- Every push to `main`
- A manual `workflow_dispatch` run
- A six-minute schedule at minutes 2, 8, 14, and so on through 56

Each run checks out the latest `main` branch, refreshes `public/data/project-status.json`, builds the Astro site, uploads the static artifact, and deploys it to GitHub Pages. The generated status snapshot is deployed without committing automated changes back to the repository.

Before the first deployment:

1. Open **Repository Settings → Pages** and select **GitHub Actions** as the source.
2. Set the custom domain to `portfolio.k1taru.space`.
3. Point the subdomain's DNS `CNAME` record to `K1taru.github.io`.
4. Enable **Enforce HTTPS** after GitHub provisions the certificate.

Local verification remains:

```bash
npm ci
npm run verify
```

GitHub may delay scheduled workflows during periods of high Actions load. Scheduled workflows in public repositories are automatically disabled after 60 days without repository activity; they can be re-enabled from the Actions tab. Push and manual deployments continue to refresh the snapshot independently of the schedule.

## Security model

- GitHub Pages publishes a static artifact and receives no application credentials or visitor-submitted data.
- The deployment workflow has read-only repository access plus the narrowly scoped Pages and OIDC permissions required for publishing.
- An HTML-delivered content security policy limits scripts, connections, forms, objects, images, and fonts on static hosting.
- Cloudflare Web Analytics is optional and is the only approved external browser script in the site source.
- Demo checks accept HTTPS only, resolve DNS before every request, reject private/reserved addresses, and cap redirects and timeouts.
- A failed scheduled refresh leaves the previous successful GitHub Pages deployment online.
- Dependencies are locked and checked in CI; CodeQL and Dependabot configuration are included.
- `/.well-known/security.txt` provides a public reporting route.

Review `SECURITY.md` before reporting or handling a vulnerability.

## Machine-readable portfolio

- `/portfolio.json` — public structured evidence
- `/llms.txt` — a concise, human-equivalent project index
- `/robots.txt` and `/sitemap-index.xml`
- JSON-LD `Person` and `SoftwareSourceCode` records

These endpoints repeat visible claims only. The project intentionally contains no hidden prompt injections, keyword stuffing, or instructions intended to manipulate automated evaluation.

## GitHub repository

This local repository is initialized as `IAM-K1taru`. Because GitHub CLI is not installed in the current Linux environment, create the empty public repository `K1taru/IAM-K1taru` in GitHub, then connect it:

```bash
git remote add origin git@github.com:K1taru/IAM-K1taru.git
git push -u origin main
```
