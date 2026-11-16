# Portfolio

The personal site of RAHAI Mohamed Abdelhakim (Hakim Rahai): one home page, three case studies, and a CV download. It is a static site built with [Astro](https://astro.build).

## Run it

```bash
npm install
```

```bash
npm run dev
```

```bash
npm run build
```

`npm run dev` serves the site at http://localhost:4321. `npm run build` type-checks the project and writes the static site to `dist/`.

## Update the content

Every update is an edit to one data file or one case study, then a push.

| To change | Edit |
| --- | --- |
| Name, positioning, status line, about paragraph, leadership, education, skills, links | `src/data/profile.yaml` |
| A project's title, result line, role, status, tags, links | `src/data/projects.yaml` |
| The text of a case study | `src/content/work/<id>.mdx` |
| The CV downloads | Add the PDFs to `public/cv/` (file names are in `public/cv/README.txt`) |

Both data files are checked against a schema at build time, so a typo in a field name or a status fails the build with a readable error instead of shipping a broken page.

### Placeholders

Facts come from the CV. Nothing on the site is invented, so content that does not exist yet shows as a dashed "To add" note. To see what is still missing, search the project for `<Pending` and for `null` in the two data files.

Set `showPlaceholders: false` in `src/data/profile.yaml` to hide every note at once. Sections with missing content then show only what is confirmed.

### Add a case study

1. Add the project to `src/data/projects.yaml` with `featured: true`.
2. Create `src/content/work/<id>.mdx` with the same id. Write it in plain Markdown under these headings: Problem, Context and constraints, My role, Approach, Results, What I'd do differently, Next steps.
3. Add a cover for the id in `src/components/Cover.astro`.

Two components are available inside a case study without importing them: `<Flow steps={[...]} caption="..." />` for a pipeline diagram, and `<Pending>...</Pending>` for a note about missing content.

### Skills that link to projects

In `profile.yaml`, each skill has a `projects` list of project ids. A skill with at least one featured project becomes an outlined chip that shows those projects when pressed. Only list a project when the CV or the project itself confirms the skill was used there.

## How it is built

- **Astro 7, TypeScript, MDX.** Pages are static HTML. The only JavaScript is three small inline scripts: the theme toggle, the copy-email button and the skill chips.
- **Plain CSS with custom properties.** The design tokens (colours for both themes, type scale, spacing) are at the top of `src/styles/global.css`.
- **Fonts** are Newsreader (headings), Instrument Sans (text) and IBM Plex Mono (numbers). Astro downloads them at build time, subsets them to Latin and serves them from the site itself.
- **Themes** follow the system setting. The toggle saves a choice only when it differs from the system, and a small inline script applies it before first paint so the wrong theme never flashes.
- **Page transitions** use the browser's built-in cross-document View Transitions (CSS only). They, and every other animation, turn off under `prefers-reduced-motion`.
- **Link-preview images** are drawn at build time by `src/pages/og/[slug].png.ts`.
- **SEO:** a unique title and description per page, canonical URLs, a sitemap, `robots.txt` and schema.org `Person` markup.
- **Icons** are a small hand-drawn set in `src/components/Icon.astro`.

## Before launch

- [ ] Choose the domain, then set `SITE_URL` in the host's build settings (or change the fallback in `astro.config.mjs`). Canonical URLs, the sitemap and link previews all use it. The current fallback, `https://rahai.dev`, is a placeholder.
- [ ] Write the about paragraph (`about` in `profile.yaml`).
- [ ] Add the final CV PDFs to `public/cv/`.
- [ ] Fill the `<Pending>` notes in the three case studies, and replace the schematic covers with real screenshots and charts where they exist.
- [ ] Add the timelines for Allocator and Horizon (`period` in `projects.yaml`).
- [ ] Optional: add a Cloudflare Web Analytics token (`analyticsToken` in `profile.yaml`).
- [ ] Optional: add a portrait (`portrait` in `profile.yaml`). The hero already has a slot for it.

## Deploy

The site is static, so any static host works. On Cloudflare Pages or GitHub Pages, the build command is `npm run build` and the output directory is `dist`.

## Later

Interactive demos (as islands inside the case studies) and a `/notes` section are planned and can be added without a redesign.
