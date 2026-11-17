# Site guide

What is still open, how to change anything later, and how to put the site online. The README covers how the project is built; this file covers how you run it over time.

## 1. What is still open

These are hidden on the site for now (`showPlaceholders: false` in `profile.yaml`), so visitors only see confirmed content. Set it to `true` while you work locally to see each gap as a dashed "To add" note. To find them in the files, search for `<Pending` and for `null` in `src/data/`.

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
| Domain | `hakimrahai.dev`, registered at Name.com through the GitHub Student Developer Pack (Namecheap does not sell `.dev`) | Free until 17 Nov 2027, then $22.99 a year at Name.com, or about $12 at Cloudflare (see "Renewal") |
| DNS | Cloudflare | Free |
| Hosting | Cloudflare Workers, static assets | Free |
| Analytics | Cloudflare Web Analytics | Free, no cookies |

Name.com only holds the registration. Cloudflare answers for the domain (DNS), serves the site and issues the HTTPS certificate that `.dev` requires. The project already contains the config Cloudflare needs (`wrangler.jsonc`), and the site is built for `https://hakimrahai.dev` (set in `astro.config.mjs`).

Cloudflare over GitHub Pages because it deploys on every push without a workflow file, gives each branch a preview address, serves the custom 404 page, and has the analytics built in.

### Where things stand

| Step | State |
| --- | --- |
| Code on GitHub (`main`) | Done |
| Domain registered at Name.com | Done. Auto-renew and WHOIS privacy are on |
| Domain added to Cloudflare | Done. Active |
| Nameservers at Name.com | To fix: the list has four entries, it must have only Cloudflare's two (step 1 below) |
| DNSSEC | Off, which is what Cloudflare needs. Nothing to do |
| Cloudflare Worker for the site | To do, if not created yet (step 2) |
| Domain connected to the Worker | To do: delete the imported Name.com records first (step 3) |
| Analytics | To do (step 4) |

### 1. Fix the nameservers at Name.com

Cloudflare only activates a domain when its own nameservers are the **only** ones listed. When this was checked on 17 Nov 2026, the registry listed four:

```
elliott.ns.cloudflare.com   keep
jo.ns.cloudflare.com        keep
ns3cgw.name.com             remove
ns4qxz.name.com             remove
```

1. In Name.com, open My Domains, then `hakimrahai.dev`, then Manage Nameservers.
2. Click the minus button next to each `name.com` row (Name.com shows them as `ns3.name.com` and `ns4.name.com`) until only these two rows are left:
   - `jo.ns.cloudflare.com`
   - `elliott.ns.cloudflare.com`
3. Click **Save**. The button stays greyed out until the list changes, so remove the rows first. Name.com applies the whole list at once.
4. Do not click "Use default nameservers": that puts Name.com's four back.

After saving, Name.com will warn that DNS records managed there are no longer active. That is expected: from now on all DNS records are managed in Cloudflare.

**Check that it worked.** Paste this address into a browser:

```
https://pubapi.registry.google/rdap/domain/hakimrahai.dev
```

Under `nameservers` it should list exactly `elliott.ns.cloudflare.com` and `jo.ns.cloudflare.com`. The registry updates within minutes. Cloudflare then usually marks the domain **Active** within 1 to 2 hours (up to 24) and emails you. To make it check sooner, open the domain's Overview page in Cloudflare and click "Check nameservers now".

Cloudflare's two other suggestions on that page do not apply here: DNSSEC is already off, and "only allow Cloudflare IP addresses at your origin" is for sites with their own server, which this one does not have.

### 2. Create the Worker that builds the site

This can be done while you wait for step 1.

1. In the Cloudflare dashboard, open Workers & Pages, then Create application.
2. Choose to import a repository, connect your GitHub account, and select `RAHAI-HAKIM/my_portfolio`.
3. Use these settings:
   - Project name: `portfolio` (it must match `name` in `wrangler.jsonc`)
   - Production branch: `main`
   - Build command: `npm run build`
   - Deploy command: `npx wrangler deploy`
   - Environment variable: `NODE_VERSION` = `24`
4. Save and deploy. The first build takes a minute or two.
5. Open the `*.workers.dev` address Cloudflare gives you and click through every page.

If the build fails, open the build log in Cloudflare. The most likely cause is the Node version: check that `NODE_VERSION` is set.

### 3. Connect the domain to the Worker

Only once step 1 shows the domain as **Active** in Cloudflare.

**First, delete the records Cloudflare copied from Name.com.** When you add a domain, Cloudflare imports the DNS records it finds at the old provider. For a new Name.com domain these point at Name.com's parking page, which has no valid HTTPS certificate. With them in place, visitors get error 522 or 525 ("SSL handshake failed"), and Cloudflare refuses to attach the Worker to those names.

1. In Cloudflare, open `hakimrahai.dev`, then DNS, then Records.
2. Delete every `A`, `AAAA` and `CNAME` record whose name is `hakimrahai.dev` (shown as `@` or the bare domain) or `www`.
3. Leave `MX` and `TXT` records alone if there are any. The site does not use them, but they may carry email settings.

**Then attach the Worker:**

1. Open Workers & Pages, then the `portfolio` Worker, then Settings, then Domains & Routes.
2. Add a Custom domain: `hakimrahai.dev`.
3. Add a second one: `www.hakimrahai.dev`, so the `www` address works too.

Cloudflare creates the new DNS records and the HTTPS certificate by itself. Allow a few minutes, then open https://hakimrahai.dev. The DNS page will now show the two names as type `Worker`.

If the custom domain cannot be added and Cloudflare says a record already exists, a record from the first part is still there: delete it and try again.

### 4. Turn on analytics

1. In Cloudflare, open Analytics & Logs, then Web Analytics, and add `hakimrahai.dev`.
2. Copy the token from the snippet it shows (the value after `"token":`).
3. Paste it into `analyticsToken` in `src/data/profile.yaml`, then commit and push.

Cloudflare's dashboard labels move around. If a step does not match what you see, follow their Astro guide: https://developers.cloudflare.com/workers/framework-guides/web-apps/astro/

### After setup

Every push to `main` builds and deploys the site in about a minute. A push to any other branch gets its own preview address, so you can check a change before it goes live.

### Renewal

The free year ends on 17 Nov 2027, when Name.com renews at $22.99. Cloudflare Registrar sells `.dev` at cost, about $12 a year. To switch, transfer the domain to Cloudflare Registrar at least a few weeks before 17 Nov 2027:

1. In Name.com, turn off Transfer Lock and get the authorization code.
2. In Cloudflare, open Domain Registration, then Transfer Domains, and follow the steps. The transfer adds a year to the registration.

New registrations cannot be transferred for their first 60 days, so do this after mid-January 2027. If you would rather keep things simple, leave auto-renew on at Name.com.

### If you would rather use GitHub Pages

It also works and is free. In the repository settings, set Pages to deploy from GitHub Actions, add the official Astro workflow (`withastro/action`), and point the domain's DNS at GitHub. You lose branch previews and the built-in analytics.

## 4. After launch

- Search your name and open the site from LinkedIn on a phone. That is how most visitors arrive.
- Paste the address into LinkedIn's Post Inspector to confirm the link-preview image shows.
- Put the address on your CV, LinkedIn and GitHub profile, and pin the repositories the site links to.
- Every three months: click every link, reread the status line, and replace anything that is no longer true.
