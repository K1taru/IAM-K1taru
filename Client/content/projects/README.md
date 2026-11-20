# Project case studies

Use one folder per project. Its name becomes the public slug.

- `<slug>/index.md` becomes `/projects/<slug>/`.
- `<slug>/docs/<page>.md` becomes `/projects/<slug>/docs/<page>/`.
- Published media lives under `public/media/projects/<slug>/`.

Use standard Markdown so the files work in Obsidian and an editor. Lead with
the problem, your role, your specific contributions, and the outcome.
Add technical pages when the topic benefits from a separate link.

Copy the frontmatter structure from [Pi Monitor](pi-monitor/index.md). The
project folder and `slug` must match. Set `draft: true` to omit an entry from
the exported site. A technical note needs a `title` and can set `draft: true`.

Gallery images need `src`, `alt`, `width`, and `height`. For a video, provide
`src`, `poster`, `captionTrack`, `title`, `width`, and `height`. Store these
assets below `public/media/projects/` and write their URLs from `/media/projects/`.
The build rejects published entries that reference missing media files.

Projects with a verified public demo can set `demo` to its HTTPS URL. Add
`demoStatus: true` after configuring the matching slug in the demo-status
service. The demo link works independently of live status.
