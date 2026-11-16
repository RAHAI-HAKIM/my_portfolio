# Site guide

What is still open, how to change anything later, and how to put the site online. The README covers how the project is built; this file covers how you run it over time.

## 1. What is still open

Everything here shows on the site as a dashed "To add" note until you fill it. To find them all, search the project for `<Pending` and for `null` in `src/data/`.

### Needs you

| Item | Where it goes |
| --- | --- |
| About paragraph, 3 to 4 sentences in your own words | `about` in `src/data/profile.yaml` |
| Waymark: the pilot result | `src/content/work/waymark.mdx`, Results. Also update `result` in `projects.yaml` |
| Waymark: what you would do differently | `waymark.mdx` |
| Allocator: dates of the project | `period` for `allocator` in `projects.yaml` |
| Allocator: measured improvements from a rerun (travel, gaps), a cost curve per method, a timetable screenshot | `allocator.mdx`, Results |
| Allocator: what you would do differently after the cost-scale fix, and next steps | `allocator.mdx` |
| Horizon: the problem in 2 to 3 sentences, and the datasets it runs on | `horizon.mdx`, Problem and Context |
| Horizon: one or two forecast charts and accuracy per method | `horizon.mdx`, Results |
| Horizon: what you would do differently, next steps, and the repo link once public | `horizon.mdx`, and `links.repo` in `projects.yaml` |
| Which projects used Java, SQL, OR-Tools, DuckDB, PostgreSQL and Java concurrency | `projects` lists in `profile.yaml` (they are unlinked chips until then) |

### Please read once

I wrote the case-study prose from your CV, the Waymark README and the Allocator's public README. It is accurate to those sources, but it is in my words. Read the three pages once and change anything that does not sound like you.

Two things to check in particular:

- **Waymark, "My role"** says you wrote the till, the server, the Admin app and the first Almanac evaluator, because the CV says "Founder" and the brief says "solo build". Adjust it if other people now contribute.
- **Allocator and Horizon covers** are still schematics, captioned as such. Replace them when you have a real chart or screenshot (section 2.4).

### Not built yet

These were in the brief as "if the content is ready" and can be added without a redesign:

- Interactive demos (annealing cost curve, timetable before and after, forecast explorer, expiry walkthrough). They need JSON exports from your own code.
- The `/notes` section and its RSS feed.
- A portrait in the hero. The slot exists: set `portrait` in `profile.yaml`.
- Proffer and Crucible as case studies, once there is something to show.

## 2. How to change things later

The loop is always the same: edit a file, check it locally, push.

```bash
npm run dev
```

```bash
npm run build
```

`npm run dev` shows the site at http://localhost:4321 and reloads as you save. `npm run build` is the check before you push: it validates the data files and fails with a readable message if something is wrong.

### 2.1 Common updates

| When this happens | Do this |
| --- | --- |
| Your status changes (new role, internship found) | Edit `status` in `profile.yaml` |
| The Waymark pilot finishes | Update `result` for `waymark` in `projects.yaml` and the Results section of `waymark.mdx`; update `status` in `profile.yaml` |
| The TCF result arrives | Edit the French entry under `skills` in `profile.yaml` |
| New grades | Add a line to `grades` under ENSIA in `profile.yaml`. The chart redraws itself |
| A new role or club position | Add an entry at the top of `leadership` in `profile.yaml` |
| A repo goes public | Set `links.repo` for the project in `projects.yaml`, and change `status` if it was `repo-coming` |
| A new CV | Replace the PDFs in `public/cv/`, keeping the same file names |
| A new skill | Add it to the right group in `profile.yaml`, with the ids of the projects that use it |

The "Last updated" date in the footer changes by itself on every deploy.

### 2.2 Fill a "To add" note

Open the `.mdx` file, replace the `<Pending>...</Pending>` line with your text, and save. Plain Markdown works: paragraphs, `- ` lists, `**bold**`.

When no notes are left, or if you want to launch before they are all filled, set `showPlaceholders: false` in `profile.yaml`. Every remaining note disappears from the site but stays in the files.

### 2.3 Add a screenshot to a case study

1. Put the image in `src/assets/work/<project>/`. PNG is fine; the build converts and resizes it.
2. In the `.mdx` file, import it at the top and place it:

```mdx
import chart from "../../assets/work/allocator/cost-curve.png";

<Shot src={chart} alt="What the image shows, for someone who cannot see it." caption="One line under the image." />
```

For Waymark, only use screenshots of the synthetic demo store, never a real shop.

### 2.4 Replace a schematic cover with a real image

In `src/components/Cover.astro`, import the image and add one entry to `shots`, the same way `waymark` is done. The home card and the case-study page both pick it up. Then update `coverCaption` at the top of the project's `.mdx` file.

### 2.5 Move a project from "More work" to a case study

1. In `projects.yaml`, set `featured: true` and fill `result`, `stack` and `tags`.
2. Create `src/content/work/<id>.mdx` (copy `horizon.mdx` as a starting point).
3. Add a cover for the id in `Cover.astro`.

### 2.6 Change the look

All colours, type sizes and spacing are variables at the top of `src/styles/global.css`. The accent colour is `--accent`, set once for light and twice for dark (system setting and manual toggle). If you change a colour, keep text contrast at 4.5:1 or better.

## 3. Hosting

### What to use

| Piece | Choice | Cost |
| --- | --- | --- |
| Domain | `hakimrahai.dev`, from Name.com through the GitHub Student Developer Pack | Free the first year, then about $12 to $21 a year |
| Hosting | Cloudflare (Workers, static assets) | Free |
| Analytics | Cloudflare Web Analytics | Free, no cookies |

`hakimrahai.dev` matches the wordmark and your LinkedIn handle, and it was unregistered when I checked on 17 Nov 2026. `rahai.dev` was also free if you prefer the shorter one. The site is already configured for `hakimrahai.dev`; if you register a different name, change the fallback in `astro.config.mjs`.

Cloudflare over GitHub Pages because it deploys on every push without a workflow file, gives each branch a preview address, serves the custom 404 page, and has the analytics built in. The project already contains the config it needs (`wrangler.jsonc`).

### One-time setup

1. **Push the code to GitHub.** The remote is already `RAHAI-HAKIM/my_portfolio`. Merge `site-v1` into `main` and push.
2. **Register the domain.** In the GitHub Student Developer Pack, open the Name.com offer and register `hakimrahai.dev`.
3. **Create the Cloudflare project.** In the Cloudflare dashboard, go to Workers & Pages, create an application, and import the GitHub repository. Use these settings:
   - Build command: `npm run build`
   - Deploy command: `npx wrangler deploy`
   - Environment variable: `NODE_VERSION` = `24`
4. **Check the preview address.** Cloudflare gives the site a `*.workers.dev` address. Open it and click through the pages.
5. **Connect the domain.** Add `hakimrahai.dev` to Cloudflare as a site, then set the two nameservers it shows you in Name.com's domain settings. When Cloudflare reports the domain as active, open the Worker's settings, Domains & Routes, and add `hakimrahai.dev` as a custom domain. HTTPS is issued automatically, which `.dev` requires.
6. **Turn on analytics.** In Cloudflare, open Web Analytics, add the site, copy the token, and paste it into `analyticsToken` in `profile.yaml`.

Cloudflare's dashboard labels move around, so if a step does not match what you see, follow their Astro guide: https://developers.cloudflare.com/workers/framework-guides/web-apps/astro/

### After setup

Every push to `main` builds and deploys the site in about a minute. A push to any other branch gets its own preview address, so you can check a change before it goes live.

When the renewal comes up after the first year, transfer the domain to Cloudflare Registrar, which sells `.dev` at cost.

### If you would rather use GitHub Pages

It also works and is free. In the repository settings, set Pages to deploy from GitHub Actions, add the official Astro workflow (`withastro/action`), and point the domain's DNS at GitHub. You lose branch previews and the built-in analytics.

## 4. After launch

- Search your name and open the site from LinkedIn on a phone. That is how most visitors arrive.
- Paste the address into LinkedIn's Post Inspector to confirm the link-preview image shows.
- Put the address on your CV, LinkedIn and GitHub profile, and pin the repositories the site links to.
- Every three months: click every link, reread the status line, and replace anything that is no longer true.
