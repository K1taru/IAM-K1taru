# Project case studies

Use one folder per project. The folder name becomes the public slug. Use
lowercase letters, numbers, and hyphens for folder names and note filenames.

- `<slug>/index.md` becomes `/projects/<slug>/`.
- `<slug>/docs/<page>.md` becomes `/projects/<slug>/docs/<page>/`.
- Published media lives under `public/media/projects/<slug>/`.

## Add or update a project

Create a folder such as `my-project/` and add an `index.md` with these fields.

```md
---
title: "My Project"
summary: "What the project does and who it helps."
year: 2026
role: "Developer"
repository: "https://github.com/your-name/my-project"
---
```

Add a Markdown body or optional fields when you have more to share. See
[Pi Monitor](pi-monitor/index.md) for a fuller example. Projects sort by
year from newest to oldest, then alphabetically by title. Edit `title` to
rename a project on the site while keeping its URL.

To add a technical note, create `docs/setup.md` in the project folder. Give
it a `title` in its frontmatter and write the note in Markdown. Set
`draft: true` on an unfinished project or note to keep it out of the export.

## Project map

Set `domain` to `applications`, `machine-learning`, `infrastructure`,
`data-systems`, or `other`. Projects without a domain appear under **Other**.
The map places new projects automatically. To position one manually or connect
it to other projects, add either or both fields below.

```yaml
map:
  position: [480, 250]
  connections: [pi-monitor, mdsystem]
```

`position` uses coordinates on the map, with `x` from 0 to 880 and `y`
from 0 to 540. Connections use project folder names and appear when both
projects are published. Enter each connection on either project.

## Media and demos

Gallery images need `src`, `alt`, `width`, and `height`. For a video, provide
`src`, `poster`, `captionTrack`, `title`, `width`, and `height`. Store these
assets below `public/media/projects/` and write their URLs from `/media/projects/`.
The build rejects published entries that reference missing media files.

Projects with a verified public demo can set `demo` to its HTTPS URL. Add
`demoStatus: true` after configuring the matching slug in the demo-status
service. The demo link works independently of live status.

## Retire or move a published project

1. Add the old folder slug and display title to [the retirement list](../retired-projects.ts).
2. Add `noteSlugs` for any old technical-note URLs you want to keep. To link
   visitors to a replacement, add its published folder slug in `replacementSlug`.
3. Draft or remove the old project folder, or move it to the new slug if it
   is the replacement. Update About milestones and any demo-status configuration
   that should refer to the replacement.

For example, `{ slug: 'old-project', title: 'Old Project', noteSlugs: ['setup'], replacementSlug: 'my-project' }`
preserves both `/projects/old-project/` and `/projects/old-project/docs/setup/` as
retirement notices. Visitors can open these URLs directly.
Remove any files from `public/` that should no longer be accessible by URL.
