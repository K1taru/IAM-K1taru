# Portfolio architecture

## Application

Next.js App Router builds the site to `Client/out/`.

- `Client/src/app/` contains routes, layouts, and global styles.
- `Client/src/features/` contains the views, styles, and logic for home, About,
  certifications, and projects. The projects feature owns the content loader,
  URL helpers, catalog and map, case studies and notes, and homepage explorer.
- `Client/src/components/` contains shared UI such as navigation, page motion,
  section layouts, and links.

## Content

Start in `Client/content/` to edit the portfolio. Edit `profile.ts` for
profile details, `about.ts` for About copy and milestones, `skills.ts` for the
skills shown on Home and About, and `certifications.ts` for certificates.
Certificate images use the certificate slug under `Client/public/media/certifications/`.

Each project has a Markdown case study and can have technical notes. Folder
and file names determine their URLs. The build validates published frontmatter
and generates the static pages and discovery files. Add old URLs to
`retired-projects.ts` to export retirement notices. See the
[project authoring guide](../Client/content/projects/README.md).

## Deployment

The Raspberry Pi serves the primary site through a small Node.js static server.
Vercel serves an independent copy of the static pages and their media. See the
[deployment guide](deployment.md).

Use `ARCHIVE/` to recover approved content, media, and old URLs.
