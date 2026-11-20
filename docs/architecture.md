# Portfolio architecture

## Application

Next.js App Router builds the site to `out/`. Routes and layouts live in
`src/app/`. Shared UI lives in `src/components/`. Tailwind starts in
`src/app/globals.css`.

## Content

Each project has a Markdown case study and can have technical notes. The
build validates frontmatter and generates URLs from published entries.
See the [authoring conventions](../content/projects/README.md).

## Deployment

The Raspberry Pi serves the primary site. Vercel serves an independent copy
of the static pages and their media. A separate Node.js service on the Pi
can provide optional demo status. See the [deployment guide](deployment.md).

Use `ARCHIVE/` to recover approved content, media, and old URLs.
