# John Michael Garcia — Portfolio

**A place to explore the projects, skills, and experience behind my work in software and applied machine learning.**

This portfolio helps recruiters, collaborators, and other visitors see what I have built and what I contributed. Visitors can browse project previews, read case studies and technical notes, learn about my background, and view certifications. The site also gives them a direct way to get in touch.

**Visit the portfolio:** [portfolio.k1taru.space](https://portfolio.k1taru.space)

## What you can explore

- **Projects:** Browse web and mobile applications, computer vision work, and self-hosted tools through an interactive project explorer and map.
- **Project stories:** Read each project's purpose, my role, and the work behind it, with supporting media and technical notes where available.
- **Background and credentials:** See my experience, interests, skills, and certifications in one place.
- **Contact:** Follow links to my professional profiles or send an email about a project or role.

## Tech stack

![Next.js logo badge](https://img.shields.io/badge/Next.js-000000?logo=nextdotjs&logoColor=white)
![React logo badge](https://img.shields.io/badge/React-149ECA?logo=react&logoColor=white)
![TypeScript logo badge](https://img.shields.io/badge/TypeScript-3178C6?logo=typescript&logoColor=white)
![Tailwind CSS logo badge](https://img.shields.io/badge/Tailwind_CSS-06B6D4?logo=tailwindcss&logoColor=white)
![Three.js logo badge](https://img.shields.io/badge/Three.js-000000?logo=threedotjs&logoColor=white)
![Node.js logo badge](https://img.shields.io/badge/Node.js-5FA04E?logo=nodedotjs&logoColor=white)
![Cloudflare logo badge](https://img.shields.io/badge/Cloudflare-F38020?logo=cloudflare&logoColor=white)

| Technology | Role |
| --- | --- |
| Next.js and React | App Router pages and interactive views |
| TypeScript | Application and content types |
| Tailwind CSS | Styling alongside feature-specific CSS |
| Three.js | 3D project previews |
| Node.js | Local development, build tools, and the small static server used on the Raspberry Pi |
| Cloudflare | Tunnel exposure for the Raspberry Pi deployment |

The site is statically exported, so its published pages do not require an application backend.

## Run locally

Use Node.js 26 (specified in `Client/.nvmrc`). From the repository root:

```sh
cd Client
nvm use
npm ci
npm run dev
```

Open the local address printed by Next.js. The application lives in `Client/`; portfolio content lives in `Client/content/`.

## Verify and build

From `Client/`, run:

```sh
npm run lint
npm run typecheck
npm run build
```

The build writes the static site to `Client/out/`. From the repository root, `node --test` checks project content and the static server. GitHub Actions runs these checks on pull requests and pushes to `development` and `main`.

## Content and deployment

- [Portfolio architecture](docs/architecture.md) explains the application layout and content files.
- [Project authoring guide](Client/content/projects/README.md) covers case studies, notes, media, and retired URLs.
- [Deployment guide](docs/deployment.md) covers the Raspberry Pi static server, Vercel, and build-time settings. Start from the repository's `.env.example` when preparing a deployment.

`ARCHIVE/` contains the previous Astro portfolio and is a reference for legacy content and URLs.
